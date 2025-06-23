#!/usr/bin/env python3
"""
PowerAutomation Local MCP Adapter v3.0.0

基於MCP (Model Context Protocol) 標準的PowerAutomation本地適配器v3.0.0
整合local server和vscode extension兩大核心組件
提供統一的PowerAutomation功能管理和調用接口

新一代AI驅動自動化平台，支持多元化認證、智能響應式佈局、
先進MCP架構和Trae風格編輯器

Author: Manus AI
Version: 3.0.0
Date: 2025-06-23
"""

import asyncio
import json
import logging
import os
import sys
import time
from pathlib import Path
from typing import Dict, Any, Optional, List
import toml
import aiohttp
from aiohttp import web
import websockets
import threading
import subprocess

# 添加項目根目錄到Python路徑
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from server.server_manager import ServerManager
from extension.extension_manager import ExtensionManager
from shared.utils import setup_logging, validate_config, get_system_info
from shared.exceptions import PowerAutomationError, ConfigurationError, ServerError


class PowerAutomationLocalMCP:
    """
    PowerAutomation Local MCP 主適配器
    
    負責協調和管理local server和vscode extension兩大組件
    提供統一的配置管理、狀態監控和API路由功能
    """
    
    def __init__(self, config_path: str = "config.toml"):
        """
        初始化MCP適配器
        
        Args:
            config_path: 配置文件路徑
        """
        self.config_path = config_path
        self.config = {}
        self.logger = None
        self.server_manager = None
        self.extension_manager = None
        self.status = {
            "initialized": False,
            "server_running": False,
            "extension_running": False,
            "last_update": None
        }
        self.websocket_clients = set()
        
    async def initialize(self) -> bool:
        """
        初始化MCP適配器
        
        Returns:
            bool: 初始化是否成功
        """
        try:
            # 加載配置
            await self._load_config()
            
            # 設置日誌
            self._setup_logging()
            
            self.logger.info("正在初始化PowerAutomation Local MCP適配器...")
            
            # 驗證配置
            await self._validate_config()
            
            # 初始化組件管理器
            await self._initialize_managers()
            
            # 更新狀態
            self.status["initialized"] = True
            self.status["last_update"] = time.time()
            
            self.logger.info("PowerAutomation Local MCP適配器初始化完成")
            return True
            
        except Exception as e:
            if self.logger:
                self.logger.error(f"MCP適配器初始化失敗: {e}")
            else:
                print(f"MCP適配器初始化失敗: {e}")
            return False
    
    async def start_server(self) -> bool:
        """
        啟動Local Server組件
        
        Returns:
            bool: 啟動是否成功
        """
        try:
            self.logger.info("正在啟動Local Server組件...")
            
            if not self.server_manager:
                raise ServerError("Server Manager未初始化")
            
            success = await self.server_manager.start()
            if success:
                self.status["server_running"] = True
                self.status["last_update"] = time.time()
                self.logger.info("Local Server組件啟動成功")
                
                # 通知WebSocket客戶端
                await self._notify_clients({
                    "type": "status_update",
                    "component": "server",
                    "status": "running"
                })
            else:
                self.logger.error("Local Server組件啟動失敗")
                
            return success
            
        except Exception as e:
            self.logger.error(f"啟動Local Server組件時發生錯誤: {e}")
            return False
    
    async def start_extension(self) -> bool:
        """
        啟動VSCode Extension組件
        
        Returns:
            bool: 啟動是否成功
        """
        try:
            self.logger.info("正在啟動VSCode Extension組件...")
            
            if not self.extension_manager:
                raise ServerError("Extension Manager未初始化")
            
            success = await self.extension_manager.start()
            if success:
                self.status["extension_running"] = True
                self.status["last_update"] = time.time()
                self.logger.info("VSCode Extension組件啟動成功")
                
                # 通知WebSocket客戶端
                await self._notify_clients({
                    "type": "status_update",
                    "component": "extension",
                    "status": "running"
                })
            else:
                self.logger.error("VSCode Extension組件啟動失敗")
                
            return success
            
        except Exception as e:
            self.logger.error(f"啟動VSCode Extension組件時發生錯誤: {e}")
            return False
    
    async def start_all(self) -> bool:
        """
        啟動所有組件
        
        Returns:
            bool: 啟動是否成功
        """
        try:
            self.logger.info("正在啟動所有組件...")
            
            # 並行啟動兩個組件
            server_task = asyncio.create_task(self.start_server())
            extension_task = asyncio.create_task(self.start_extension())
            
            server_success, extension_success = await asyncio.gather(
                server_task, extension_task, return_exceptions=True
            )
            
            # 檢查結果
            if isinstance(server_success, Exception):
                self.logger.error(f"Server啟動異常: {server_success}")
                server_success = False
                
            if isinstance(extension_success, Exception):
                self.logger.error(f"Extension啟動異常: {extension_success}")
                extension_success = False
            
            success = server_success and extension_success
            
            if success:
                self.logger.info("所有組件啟動成功")
            else:
                self.logger.warning(f"部分組件啟動失敗 - Server: {server_success}, Extension: {extension_success}")
            
            return success
            
        except Exception as e:
            self.logger.error(f"啟動所有組件時發生錯誤: {e}")
            return False
    
    async def stop_all(self) -> bool:
        """
        停止所有組件
        
        Returns:
            bool: 停止是否成功
        """
        try:
            self.logger.info("正在停止所有組件...")
            
            # 並行停止兩個組件
            tasks = []
            if self.server_manager:
                tasks.append(asyncio.create_task(self.server_manager.stop()))
            if self.extension_manager:
                tasks.append(asyncio.create_task(self.extension_manager.stop()))
            
            if tasks:
                results = await asyncio.gather(*tasks, return_exceptions=True)
                
                # 檢查結果
                for i, result in enumerate(results):
                    if isinstance(result, Exception):
                        self.logger.error(f"組件{i}停止異常: {result}")
            
            # 更新狀態
            self.status["server_running"] = False
            self.status["extension_running"] = False
            self.status["last_update"] = time.time()
            
            # 通知WebSocket客戶端
            await self._notify_clients({
                "type": "status_update",
                "component": "all",
                "status": "stopped"
            })
            
            self.logger.info("所有組件已停止")
            return True
            
        except Exception as e:
            self.logger.error(f"停止組件時發生錯誤: {e}")
            return False
    
    async def get_status(self) -> Dict[str, Any]:
        """
        獲取系統狀態
        
        Returns:
            Dict[str, Any]: 系統狀態信息
        """
        try:
            # 獲取基本狀態
            status = self.status.copy()
            
            # 獲取系統信息
            system_info = get_system_info()
            status["system"] = system_info
            
            # 獲取組件詳細狀態
            if self.server_manager:
                status["server_details"] = await self.server_manager.get_status()
            
            if self.extension_manager:
                status["extension_details"] = await self.extension_manager.get_status()
            
            # 獲取配置信息
            status["config"] = {
                "server_port": self.config.get("server", {}).get("port", 5000),
                "debug_mode": self.config.get("server", {}).get("debug", False),
                "extension_enabled": self.config.get("extension", {}).get("auto_start", True)
            }
            
            return status
            
        except Exception as e:
            self.logger.error(f"獲取狀態時發生錯誤: {e}")
            return {"error": str(e)}
    
    async def handle_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """
        處理API請求
        
        Args:
            request: 請求數據
            
        Returns:
            Dict[str, Any]: 響應數據
        """
        try:
            method = request.get("method")
            params = request.get("params", {})
            request_id = request.get("id")
            
            self.logger.debug(f"處理請求: {method}")
            
            # 路由到相應的處理器
            if method.startswith("server."):
                if not self.server_manager:
                    raise ServerError("Server Manager未初始化")
                result = await self.server_manager.handle_request(method[7:], params)
                
            elif method.startswith("extension."):
                if not self.extension_manager:
                    raise ServerError("Extension Manager未初始化")
                result = await self.extension_manager.handle_request(method[10:], params)
                
            elif method == "get_status":
                result = await self.get_status()
                
            elif method == "start_server":
                result = {"success": await self.start_server()}
                
            elif method == "start_extension":
                result = {"success": await self.start_extension()}
                
            elif method == "start_all":
                result = {"success": await self.start_all()}
                
            elif method == "stop_all":
                result = {"success": await self.stop_all()}
                
            else:
                raise PowerAutomationError(f"未知的方法: {method}")
            
            # 構建響應
            response = {
                "id": request_id,
                "result": {
                    "status": "success",
                    "data": result,
                    "message": "請求處理成功"
                },
                "timestamp": time.time()
            }
            
            return response
            
        except Exception as e:
            self.logger.error(f"處理請求時發生錯誤: {e}")
            
            # 構建錯誤響應
            response = {
                "id": request.get("id"),
                "result": {
                    "status": "error",
                    "data": None,
                    "message": str(e)
                },
                "timestamp": time.time()
            }
            
            return response
    
    async def shutdown(self):
        """
        關閉MCP適配器
        """
        try:
            self.logger.info("正在關閉PowerAutomation Local MCP適配器...")
            
            # 停止所有組件
            await self.stop_all()
            
            # 關閉WebSocket連接
            if self.websocket_clients:
                await asyncio.gather(
                    *[ws.close() for ws in self.websocket_clients],
                    return_exceptions=True
                )
            
            self.logger.info("PowerAutomation Local MCP適配器已關閉")
            
        except Exception as e:
            self.logger.error(f"關閉MCP適配器時發生錯誤: {e}")
    
    async def _load_config(self):
        """加載配置文件"""
        try:
            if not os.path.exists(self.config_path):
                raise ConfigurationError(f"配置文件不存在: {self.config_path}")
            
            with open(self.config_path, 'r', encoding='utf-8') as f:
                self.config = toml.load(f)
                
        except Exception as e:
            raise ConfigurationError(f"加載配置文件失敗: {e}")
    
    def _setup_logging(self):
        """設置日誌"""
        log_config = self.config.get("logging", {})
        self.logger = setup_logging(
            level=log_config.get("level", "INFO"),
            file_enabled=log_config.get("file_enabled", True),
            console_enabled=log_config.get("console_enabled", True),
            max_file_size=log_config.get("max_file_size", "10MB")
        )
    
    async def _validate_config(self):
        """驗證配置"""
        try:
            validate_config(self.config)
        except Exception as e:
            raise ConfigurationError(f"配置驗證失敗: {e}")
    
    async def _initialize_managers(self):
        """初始化組件管理器"""
        try:
            # 初始化Server Manager
            self.server_manager = ServerManager(
                config=self.config.get("server", {}),
                logger=self.logger
            )
            await self.server_manager.initialize()
            
            # 初始化Extension Manager
            self.extension_manager = ExtensionManager(
                config=self.config.get("extension", {}),
                logger=self.logger
            )
            await self.extension_manager.initialize()
            
        except Exception as e:
            raise PowerAutomationError(f"初始化組件管理器失敗: {e}")
    
    async def _notify_clients(self, message: Dict[str, Any]):
        """通知WebSocket客戶端"""
        if not self.websocket_clients:
            return
        
        try:
            message_str = json.dumps(message)
            await asyncio.gather(
                *[ws.send(message_str) for ws in self.websocket_clients],
                return_exceptions=True
            )
        except Exception as e:
            self.logger.error(f"通知客戶端時發生錯誤: {e}")


# WebSocket處理器
async def websocket_handler(websocket, path, mcp_adapter):
    """WebSocket連接處理器"""
    mcp_adapter.websocket_clients.add(websocket)
    try:
        async for message in websocket:
            try:
                request = json.loads(message)
                response = await mcp_adapter.handle_request(request)
                await websocket.send(json.dumps(response))
            except Exception as e:
                error_response = {
                    "error": str(e),
                    "timestamp": time.time()
                }
                await websocket.send(json.dumps(error_response))
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        mcp_adapter.websocket_clients.discard(websocket)


# HTTP API處理器
async def http_handler(request, mcp_adapter):
    """HTTP API請求處理器"""
    try:
        if request.method == "POST":
            data = await request.json()
            response = await mcp_adapter.handle_request(data)
            return web.json_response(response)
        elif request.method == "GET":
            if request.path == "/status":
                status = await mcp_adapter.get_status()
                return web.json_response(status)
            else:
                return web.json_response({"error": "Not Found"}, status=404)
        else:
            return web.json_response({"error": "Method Not Allowed"}, status=405)
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


async def main():
    """主函數"""
    # 創建MCP適配器實例
    mcp_adapter = PowerAutomationLocalMCP()
    
    try:
        # 初始化
        if not await mcp_adapter.initialize():
            print("MCP適配器初始化失敗")
            return
        
        # 啟動所有組件
        if not await mcp_adapter.start_all():
            print("組件啟動失敗")
            return
        
        print("PowerAutomation Local MCP適配器已啟動")
        print(f"HTTP API: http://localhost:{mcp_adapter.config.get('server', {}).get('port', 5000)}")
        print(f"WebSocket: ws://localhost:{mcp_adapter.config.get('server', {}).get('port', 5000) + 1}")
        
        # 保持運行
        try:
            while True:
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            print("\n正在關閉...")
            
    finally:
        await mcp_adapter.shutdown()


if __name__ == "__main__":
    asyncio.run(main())

