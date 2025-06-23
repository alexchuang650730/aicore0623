# PowerAutomation Local MCP Adapter

**Version:** 1.0.0  
**Author:** Manus AI  
**Date:** 2025-06-23  
**License:** MIT

## 🚀 概述

PowerAutomation Local MCP Adapter 是一個基於 Model Context Protocol (MCP) 的本地自動化適配器，專為 Manus 平台自動化測試和操作而設計。該適配器整合了 PowerAutomation 的核心功能，提供了完整的本地服務器和 VSCode 擴展支持，實現了無縫的自動化工作流程。

### 🎯 核心特性

- **🔧 MCP 標準兼容**: 完全符合 Model Context Protocol 規範，提供標準化的接口和通信協議
- **🖥️ Local Server**: 基於 Flask 的本地服務器，提供 RESTful API 和 WebSocket 實時通信
- **🔌 VSCode Extension**: 完整的 IDE 集成，提供用戶友好的圖形界面和命令面板
- **🤖 Manus 集成**: 深度集成 Manus 平台，支持登錄、消息發送、對話獲取、任務管理等功能
- **🧪 自動化測試引擎**: 內置 Playwright 驅動的自動化測試框架，支持 6 個完整的測試案例
- **💾 數據存儲管理**: 智能文件組織、搜索索引、備份恢復等數據管理功能
- **📊 實時監控**: 完整的狀態監控、性能統計、錯誤追蹤和日誌記錄

### 🏗️ 架構設計

PowerAutomation Local MCP Adapter 採用模組化架構設計，主要包含以下組件：

```
PowerAutomationlocal_Adapter/
├── powerautomation_local_mcp.py    # 主MCP適配器控制器
├── config.toml                     # 統一配置文件
├── cli.py                          # 命令行接口
├── server/                         # Local Server組件
│   ├── server_manager.py           # 服務器管理器
│   ├── integrations/               # 集成模組
│   │   └── manus_integration.py    # Manus平台集成
│   ├── automation/                 # 自動化引擎
│   │   └── automation_engine.py    # 測試執行引擎
│   └── storage/                    # 數據存儲
│       └── data_storage.py         # 文件管理系統
├── extension/                      # VSCode Extension組件
│   └── extension_manager.py        # 擴展管理器
├── shared/                         # 共享模組
│   ├── utils.py                    # 通用工具函數
│   └── exceptions.py               # 異常處理
└── tests/                          # 測試套件
    ├── basic_test.py               # 基本功能測試
    └── test_powerautomation_mcp.py # 完整測試套件
```

## 📋 系統要求

### 基本要求

- **操作系統**: Linux (Ubuntu 20.04+), macOS (10.15+), Windows (10+)
- **Python**: 3.8 或更高版本
- **Node.js**: 16.0 或更高版本 (用於 VSCode 擴展)
- **內存**: 最少 2GB RAM，推薦 4GB 或更多
- **磁盤空間**: 最少 1GB 可用空間

### Python 依賴包

```bash
# 核心依賴
toml>=0.10.2
aiohttp>=3.8.0
flask>=2.0.0
flask-cors>=4.0.0
websockets>=11.0.0
psutil>=5.9.0

# 自動化測試
playwright>=1.40.0

# 可選依賴
sqlite3  # 數據索引 (Python內建)
json     # 數據處理 (Python內建)
logging  # 日誌記錄 (Python內建)
```

## 🚀 快速開始

### 1. 環境準備

```bash
# 克隆項目
git clone <repository-url>
cd PowerAutomationlocal_Adapter

# 安裝Python依賴
pip3 install toml aiohttp flask flask-cors websockets psutil playwright

# 安裝Playwright瀏覽器
playwright install chromium
```

### 2. 配置設置

編輯 `config.toml` 文件，根據您的環境調整配置：

```toml
[server]
host = "0.0.0.0"
port = 5000
debug = false
cors_enabled = true

[manus]
app_url = "https://manus.im/app/uuX3KzwzsthCSgqmbQbgOz"
login_email = "your-email@example.com"
login_password = "your-password"

[automation]
browser = "chromium"
headless = false
screenshot_enabled = true
video_recording = true
test_timeout = 300
```

### 3. 運行測試

```bash
# 基本功能測試
python3 basic_test.py

# 完整功能測試
python3 test_powerautomation_mcp.py
```

### 4. 啟動服務

```bash
# 命令行模式
python3 cli.py --mode server

# 交互模式
python3 cli.py --interactive

# 直接啟動MCP適配器
python3 powerautomation_local_mcp.py
```

## 🔧 配置說明

### 服務器配置 (server)

| 參數 | 類型 | 默認值 | 說明 |
|------|------|--------|------|
| host | string | "0.0.0.0" | 服務器綁定地址 |
| port | integer | 5000 | 服務器端口 |
| debug | boolean | false | 調試模式 |
| cors_enabled | boolean | true | 跨域請求支持 |
| max_connections | integer | 100 | 最大連接數 |
| request_timeout | integer | 30 | 請求超時時間(秒) |

### Manus 集成配置 (manus)

| 參數 | 類型 | 默認值 | 說明 |
|------|------|--------|------|
| app_url | string | - | Manus應用URL |
| login_email | string | - | 登錄郵箱 |
| login_password | string | - | 登錄密碼 |
| auto_login | boolean | true | 自動登錄 |
| session_timeout | integer | 3600 | 會話超時時間(秒) |
| retry_attempts | integer | 3 | 重試次數 |

### 自動化配置 (automation)

| 參數 | 類型 | 默認值 | 說明 |
|------|------|--------|------|
| browser | string | "chromium" | 瀏覽器類型 |
| headless | boolean | false | 無頭模式 |
| screenshot_enabled | boolean | true | 截圖功能 |
| video_recording | boolean | true | 視頻錄製 |
| test_timeout | integer | 300 | 測試超時時間(秒) |
| parallel_tests | integer | 1 | 並行測試數量 |

### 數據存儲配置 (storage)

| 參數 | 類型 | 默認值 | 說明 |
|------|------|--------|------|
| base_path | string | "./data" | 數據存儲根目錄 |
| index_enabled | boolean | true | 搜索索引 |
| backup_enabled | boolean | true | 自動備份 |
| cleanup_days | integer | 30 | 清理週期(天) |
| max_file_size | string | "100MB" | 最大文件大小 |
| compression_enabled | boolean | true | 壓縮存儲 |

### 擴展配置 (extension)

| 參數 | 類型 | 默認值 | 說明 |
|------|------|--------|------|
| auto_start | boolean | true | 自動啟動 |
| sidebar_enabled | boolean | true | 側邊欄顯示 |
| notifications_enabled | boolean | true | 通知功能 |
| theme | string | "dark" | 主題設置 |
| auto_refresh | boolean | true | 自動刷新 |
| refresh_interval | integer | 30 | 刷新間隔(秒) |

## 📚 API 文檔

### MCP 標準接口

PowerAutomation Local MCP Adapter 完全符合 Model Context Protocol 規範，提供以下標準接口：

#### 1. 初始化請求

```json
{
  "jsonrpc": "2.0",
  "id": "init_001",
  "method": "initialize",
  "params": {
    "protocolVersion": "1.0.0",
    "capabilities": {
      "server": true,
      "extension": true,
      "automation": true,
      "storage": true
    }
  }
}
```

#### 2. 狀態查詢

```json
{
  "jsonrpc": "2.0",
  "id": "status_001",
  "method": "get_status",
  "params": {}
}
```

響應：
```json
{
  "jsonrpc": "2.0",
  "id": "status_001",
  "result": {
    "status": "success",
    "data": {
      "initialized": true,
      "server_running": true,
      "extension_running": true,
      "manus_connected": true,
      "active_sessions": 2,
      "uptime": 3600
    }
  }
}
```

### Server API 接口

#### Manus 集成接口

**登錄 Manus**
```http
POST /api/server/manus_login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**發送消息**
```http
POST /api/server/send_message
Content-Type: application/json

{
  "message": "Hello, this is a test message"
}
```

**獲取對話歷史**
```http
GET /api/server/get_conversations
```

**獲取任務列表**
```http
GET /api/server/get_tasks
```

#### 自動化測試接口

**運行測試案例**
```http
POST /api/server/run_test
Content-Type: application/json

{
  "test_case": "TC001",
  "parameters": {
    "headless": false,
    "screenshot": true
  }
}
```

**獲取測試結果**
```http
GET /api/server/get_test_results
```

#### 數據存儲接口

**搜索文件**
```http
POST /api/server/storage_search
Content-Type: application/json

{
  "query": "test report",
  "category": "reports",
  "limit": 50
}
```

**存儲文件**
```http
POST /api/server/store_file
Content-Type: application/json

{
  "file_path": "/path/to/file.pdf",
  "category": "documents",
  "metadata": {
    "title": "Test Report",
    "tags": ["test", "automation"]
  }
}
```

### Extension API 接口

#### 會話管理

**創建會話**
```json
{
  "method": "extension.create_session",
  "params": {
    "session_id": "session_001",
    "user_id": "user123"
  }
}
```

**關閉會話**
```json
{
  "method": "extension.close_session",
  "params": {
    "session_id": "session_001"
  }
}
```

#### 通知系統

**發送通知**
```json
{
  "method": "extension.send_notification",
  "params": {
    "message": "Test completed successfully",
    "level": "info",
    "duration": 5000
  }
}
```

#### 側邊欄更新

**更新側邊欄**
```json
{
  "method": "extension.update_sidebar",
  "params": {
    "data": {
      "status": {
        "server_running": true,
        "tests_running": 2
      },
      "recent_activities": [
        {
          "action": "test_completed",
          "test_case": "TC001",
          "timestamp": 1703123456
        }
      ]
    }
  }
}
```

## 🧪 測試案例

PowerAutomation Local MCP Adapter 包含 6 個完整的測試案例，涵蓋 Manus 平台的核心功能：

### TC001 - Manus 登錄測試

**目標**: 驗證 Manus 平台的自動登錄功能

**步驟**:
1. 導航到 Manus 應用頁面
2. 查找並點擊登錄鏈接
3. 填入登錄憑證
4. 提交登錄表單
5. 驗證登錄成功

**預期結果**: 成功登錄並重定向到主頁面

### TC002 - 消息發送測試

**目標**: 驗證消息發送功能

**步驟**:
1. 確保已登錄 Manus
2. 查找消息輸入框
3. 輸入測試消息
4. 發送消息
5. 驗證消息發送成功

**預期結果**: 消息成功發送並顯示在對話中

### TC003 - 對話獲取測試

**目標**: 驗證對話歷史獲取功能

**步驟**:
1. 確保已登錄 Manus
2. 查找對話元素
3. 提取對話內容
4. 分析對話數據

**預期結果**: 成功提取對話歷史數據

### TC004 - 任務獲取測試

**目標**: 驗證任務列表獲取功能

**步驟**:
1. 確保已登錄 Manus
2. 查找任務元素
3. 提取任務信息
4. 分析任務數據

**預期結果**: 成功提取任務列表數據

### TC005 - 文件下載測試

**目標**: 驗證文件下載功能

**步驟**:
1. 確保已登錄 Manus
2. 查找文件鏈接
3. 提取文件信息
4. 分析文件數據

**預期結果**: 成功識別和提取文件信息

### TC006 - 集成測試

**目標**: 驗證所有功能的集成運行

**步驟**:
1. 依序執行 TC001-TC005
2. 計算整體成功率
3. 生成綜合報告

**預期結果**: 整體成功率達到 80% 以上

## 🔍 故障排除

### 常見問題

#### 1. 模組導入失敗

**問題**: `ImportError: No module named 'websockets'`

**解決方案**:
```bash
pip3 install websockets
```

#### 2. Playwright 瀏覽器未安裝

**問題**: `playwright._impl._api_types.Error: Executable doesn't exist`

**解決方案**:
```bash
playwright install chromium
```

#### 3. 配置文件錯誤

**問題**: `toml.decoder.TomlDecodeError: Invalid TOML`

**解決方案**:
- 檢查 `config.toml` 語法
- 確保所有字符串值使用引號
- 驗證 TOML 格式正確性

#### 4. 端口被佔用

**問題**: `OSError: [Errno 98] Address already in use`

**解決方案**:
```bash
# 查找佔用端口的進程
lsof -i :5000

# 終止進程
kill -9 <PID>

# 或修改配置文件中的端口
```

#### 5. Manus 登錄失敗

**問題**: 自動登錄失敗或憑證錯誤

**解決方案**:
- 檢查 `config.toml` 中的登錄憑證
- 確認 Manus 應用 URL 正確
- 檢查網絡連接
- 驗證賬戶狀態

### 日誌分析

PowerAutomation Local MCP Adapter 提供詳細的日誌記錄，幫助診斷問題：

#### 日誌級別

- **DEBUG**: 詳細的調試信息
- **INFO**: 一般信息和狀態更新
- **WARNING**: 警告信息，不影響正常運行
- **ERROR**: 錯誤信息，可能影響功能
- **CRITICAL**: 嚴重錯誤，導致系統無法運行

#### 日誌位置

- **控制台輸出**: 實時日誌信息
- **文件日誌**: `logs/powerautomation.log`
- **測試日誌**: `logs/test_execution.log`
- **錯誤日誌**: `logs/error.log`

#### 日誌配置

在 `config.toml` 中調整日誌設置：

```toml
[logging]
level = "INFO"
console_enabled = true
file_enabled = true
max_file_size = "10MB"
backup_count = 5
format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
```

## 🚀 部署指南

### 本地部署

#### 1. 開發環境

```bash
# 克隆項目
git clone <repository-url>
cd PowerAutomationlocal_Adapter

# 創建虛擬環境
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# 或
venv\Scripts\activate     # Windows

# 安裝依賴
pip install -r requirements.txt

# 運行測試
python3 basic_test.py

# 啟動服務
python3 powerautomation_local_mcp.py
```

#### 2. 生產環境

```bash
# 使用 systemd 服務 (Linux)
sudo cp powerautomation.service /etc/systemd/system/
sudo systemctl enable powerautomation
sudo systemctl start powerautomation

# 使用 Docker
docker build -t powerautomation-mcp .
docker run -d -p 5000:5000 powerautomation-mcp

# 使用 PM2 (Node.js 進程管理器)
pm2 start powerautomation_local_mcp.py --interpreter python3
```

### VSCode 擴展安裝

#### 1. 開發模式安裝

```bash
# 進入擴展目錄
cd vscode-extension

# 安裝依賴
npm install

# 編譯 TypeScript
npm run compile

# 在 VSCode 中按 F5 啟動調試模式
```

#### 2. 打包安裝

```bash
# 安裝 vsce 工具
npm install -g vsce

# 打包擴展
vsce package

# 安裝 .vsix 文件
code --install-extension powerautomation-local-1.0.0.vsix
```

### 配置管理

#### 環境變量

```bash
# 設置環境變量
export POWERAUTOMATION_CONFIG_PATH="/path/to/config.toml"
export POWERAUTOMATION_LOG_LEVEL="INFO"
export POWERAUTOMATION_DATA_PATH="/path/to/data"

# 或使用 .env 文件
echo "POWERAUTOMATION_CONFIG_PATH=/path/to/config.toml" > .env
```

#### 配置文件模板

```toml
# config.production.toml
[server]
host = "0.0.0.0"
port = 5000
debug = false
workers = 4

[manus]
app_url = "${MANUS_APP_URL}"
login_email = "${MANUS_EMAIL}"
login_password = "${MANUS_PASSWORD}"

[automation]
browser = "chromium"
headless = true
parallel_tests = 2

[storage]
base_path = "/var/lib/powerautomation"
backup_enabled = true
cleanup_days = 7

[logging]
level = "INFO"
file_enabled = true
```

## 🔒 安全考慮

### 憑證管理

1. **環境變量**: 使用環境變量存儲敏感信息
2. **加密存儲**: 對配置文件中的密碼進行加密
3. **訪問控制**: 限制配置文件的讀取權限
4. **定期輪換**: 定期更新登錄憑證

### 網絡安全

1. **HTTPS**: 在生產環境中使用 HTTPS
2. **防火牆**: 配置適當的防火牆規則
3. **訪問限制**: 限制 API 訪問來源
4. **速率限制**: 實施 API 速率限制

### 數據保護

1. **數據加密**: 對敏感數據進行加密存儲
2. **備份安全**: 確保備份文件的安全性
3. **日誌清理**: 定期清理包含敏感信息的日誌
4. **權限控制**: 實施最小權限原則

## 📈 性能優化

### 系統優化

1. **並發處理**: 使用異步編程提高並發性能
2. **連接池**: 實施數據庫和網絡連接池
3. **緩存策略**: 實施適當的緩存機制
4. **資源監控**: 監控 CPU、內存、磁盤使用情況

### 測試優化

1. **並行執行**: 並行運行多個測試案例
2. **智能重試**: 實施智能重試機制
3. **結果緩存**: 緩存測試結果避免重複執行
4. **資源清理**: 及時清理測試產生的臨時文件

### 存儲優化

1. **索引優化**: 優化搜索索引結構
2. **壓縮存儲**: 使用壓縮減少存儲空間
3. **分層存儲**: 實施熱冷數據分層存儲
4. **清理策略**: 自動清理過期數據

## 🤝 貢獻指南

### 開發流程

1. **Fork 項目**: 在 GitHub 上 fork 項目
2. **創建分支**: 為新功能創建專門的分支
3. **編寫代碼**: 遵循項目的編碼規範
4. **編寫測試**: 為新功能編寫相應的測試
5. **提交 PR**: 提交 Pull Request 並描述變更

### 編碼規範

1. **Python 風格**: 遵循 PEP 8 編碼規範
2. **文檔字符串**: 為所有函數和類編寫文檔字符串
3. **類型提示**: 使用 Python 類型提示
4. **錯誤處理**: 實施適當的錯誤處理機制

### 測試要求

1. **單元測試**: 為所有核心功能編寫單元測試
2. **集成測試**: 編寫組件間的集成測試
3. **覆蓋率**: 確保測試覆蓋率達到 80% 以上
4. **性能測試**: 為關鍵功能編寫性能測試

## 📄 許可證

本項目採用 MIT 許可證。詳細信息請參閱 [LICENSE](LICENSE) 文件。

## 📞 支持與聯繫

- **項目主頁**: [GitHub Repository](https://github.com/your-org/powerautomation-local-mcp)
- **問題報告**: [GitHub Issues](https://github.com/your-org/powerautomation-local-mcp/issues)
- **功能請求**: [GitHub Discussions](https://github.com/your-org/powerautomation-local-mcp/discussions)
- **電子郵件**: support@manus.ai

## 🙏 致謝

感謝以下項目和社區的支持：

- [Model Context Protocol](https://github.com/modelcontextprotocol/specification) - MCP 規範和標準
- [Playwright](https://playwright.dev/) - 自動化測試框架
- [Flask](https://flask.palletsprojects.com/) - Web 應用框架
- [VSCode](https://code.visualstudio.com/) - 集成開發環境
- [Manus AI](https://manus.ai/) - AI 自動化平台

---

**PowerAutomation Local MCP Adapter** - 讓自動化測試變得簡單而強大！

