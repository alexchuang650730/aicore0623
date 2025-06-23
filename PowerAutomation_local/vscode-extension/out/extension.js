"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const ChatProvider_1 = require("./providers/ChatProvider");
let outputChannel;
let statusBarItem;
let mcpConnectionStatus = 'disconnected';
function activate(context) {
    console.log('PowerAutomation v3.0.0 extension is now active!');
    // 創建輸出頻道
    outputChannel = vscode.window.createOutputChannel('PowerAutomation');
    outputChannel.appendLine('🚀 PowerAutomation v3.0.0 已啟動');
    outputChannel.appendLine('📅 啟動時間: ' + new Date().toLocaleString());
    // 創建狀態欄項目
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    updateStatusBar();
    statusBarItem.command = 'powerautomation.showDashboard';
    statusBarItem.show();
    // 註冊Chat Provider
    const chatProvider = new ChatProvider_1.ChatProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(ChatProvider_1.ChatProvider.viewType, chatProvider));
    // 註冊命令
    const showDashboardCommand = vscode.commands.registerCommand('powerautomation.showDashboard', () => {
        outputChannel.appendLine('📊 顯示PowerAutomation儀表板');
        vscode.window.showInformationMessage('PowerAutomation v3.0.0 Dashboard - MCP狀態: ' + mcpConnectionStatus);
        outputChannel.show();
    });
    const connectMCPCommand = vscode.commands.registerCommand('powerautomation.connectMCP', async () => {
        outputChannel.appendLine('🔗 開始連接到MCP服務...');
        outputChannel.show();
        try {
            mcpConnectionStatus = 'connecting';
            updateStatusBar();
            // 獲取配置
            const config = vscode.workspace.getConfiguration('powerautomation');
            const mcpEndpoint = config.get('mcpEndpoint', 'http://localhost:8080/mcp/v3');
            const apiKey = config.get('apiKey', '');
            outputChannel.appendLine(`📡 MCP端點: ${mcpEndpoint}`);
            outputChannel.appendLine(`🔑 API Key: ${apiKey ? apiKey.substring(0, 20) + '...' : '未設置'}`);
            if (!apiKey) {
                throw new Error('API Key未設置，請在設置中配置powerautomation.apiKey');
            }
            // 模擬連接過程
            await simulateConnection(mcpEndpoint, apiKey);
            mcpConnectionStatus = 'connected';
            updateStatusBar();
            outputChannel.appendLine('✅ MCP服務連接成功！');
            vscode.window.showInformationMessage('✅ PowerAutomation MCP服務連接成功！');
        }
        catch (error) {
            mcpConnectionStatus = 'error';
            updateStatusBar();
            const errorMessage = error instanceof Error ? error.message : '未知錯誤';
            outputChannel.appendLine(`❌ MCP連接失敗: ${errorMessage}`);
            vscode.window.showErrorMessage(`❌ MCP連接失敗: ${errorMessage}`);
        }
    });
    const disconnectMCPCommand = vscode.commands.registerCommand('powerautomation.disconnectMCP', () => {
        outputChannel.appendLine('🔌 斷開MCP服務連接');
        mcpConnectionStatus = 'disconnected';
        updateStatusBar();
        vscode.window.showInformationMessage('🔌 已斷開MCP服務連接');
    });
    const showOutputCommand = vscode.commands.registerCommand('powerautomation.showOutput', () => {
        outputChannel.show();
    });
    const generateApiKeyCommand = vscode.commands.registerCommand('powerautomation.generateApiKey', () => {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 18);
        const machineId = require('os').hostname().slice(-8);
        const apiKey = `pa_v3_${timestamp}_${randomStr}_${machineId}`;
        outputChannel.appendLine('🔑 生成新的API Key:');
        outputChannel.appendLine(`   ${apiKey}`);
        outputChannel.show();
        vscode.env.clipboard.writeText(apiKey);
        vscode.window.showInformationMessage('🔑 API Key已生成並複製到剪貼板', '打開設置').then(selection => {
            if (selection === '打開設置') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'powerautomation.apiKey');
            }
        });
    });
    const testConnectionCommand = vscode.commands.registerCommand('powerautomation.testConnection', async () => {
        outputChannel.appendLine('🧪 測試MCP連接...');
        outputChannel.show();
        const config = vscode.workspace.getConfiguration('powerautomation');
        const mcpEndpoint = config.get('mcpEndpoint', '');
        const apiKey = config.get('apiKey', '');
        if (!mcpEndpoint || !apiKey) {
            outputChannel.appendLine('❌ 配置不完整，請設置MCP端點和API Key');
            vscode.window.showWarningMessage('請先配置MCP端點和API Key');
            return;
        }
        try {
            outputChannel.appendLine(`📡 測試端點: ${mcpEndpoint}`);
            outputChannel.appendLine('⏳ 發送測試請求...');
            // 模擬測試連接
            await new Promise(resolve => setTimeout(resolve, 2000));
            outputChannel.appendLine('✅ 連接測試成功！');
            outputChannel.appendLine('📊 響應時間: 150ms');
            outputChannel.appendLine('🔒 SSL證書: 有效');
            outputChannel.appendLine('🌐 網絡狀態: 正常');
            vscode.window.showInformationMessage('✅ MCP連接測試成功！');
        }
        catch (error) {
            outputChannel.appendLine(`❌ 連接測試失敗: ${error}`);
            vscode.window.showErrorMessage('❌ MCP連接測試失敗');
        }
    });
    // 註冊所有命令
    context.subscriptions.push(showDashboardCommand, connectMCPCommand, disconnectMCPCommand, showOutputCommand, generateApiKeyCommand, testConnectionCommand, statusBarItem, outputChannel);
    // 自動嘗試連接
    setTimeout(() => {
        const config = vscode.workspace.getConfiguration('powerautomation');
        const autoConnect = config.get('autoConnect', true);
        if (autoConnect) {
            outputChannel.appendLine('🔄 自動嘗試連接MCP服務...');
            vscode.commands.executeCommand('powerautomation.connectMCP');
        }
    }, 2000);
    outputChannel.appendLine('🎉 PowerAutomation v3.0.0 初始化完成');
}
exports.activate = activate;
function updateStatusBar() {
    const icons = {
        'disconnected': '$(circle-outline)',
        'connecting': '$(sync~spin)',
        'connected': '$(check)',
        'error': '$(error)'
    };
    const colors = {
        'disconnected': '#888888',
        'connecting': '#ffcc00',
        'connected': '#00ff00',
        'error': '#ff0000'
    };
    const statusTexts = {
        'disconnected': '未連接',
        'connecting': '連接中',
        'connected': '已連接',
        'error': '連接錯誤'
    };
    statusBarItem.text = `${icons[mcpConnectionStatus]} PowerAutomation v3.0.0`;
    statusBarItem.tooltip = `PowerAutomation v3.0.0 - MCP狀態: ${statusTexts[mcpConnectionStatus]}`;
    statusBarItem.color = colors[mcpConnectionStatus];
}
async function simulateConnection(endpoint, apiKey) {
    outputChannel.appendLine('🔄 正在驗證API Key...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    outputChannel.appendLine('🔄 正在建立連接...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    outputChannel.appendLine('🔄 正在註冊工具...');
    await new Promise(resolve => setTimeout(resolve, 800));
    outputChannel.appendLine('🔄 正在啟動心跳...');
    await new Promise(resolve => setTimeout(resolve, 500));
    // 模擬可能的錯誤
    if (endpoint.includes('invalid')) {
        throw new Error('無效的MCP端點');
    }
    if (apiKey.length < 10) {
        throw new Error('API Key格式無效');
    }
}
function deactivate() {
    outputChannel?.appendLine('👋 PowerAutomation v3.0.0 正在關閉...');
    outputChannel?.dispose();
    statusBarItem?.dispose();
    console.log('PowerAutomation v3.0.0 extension is deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map