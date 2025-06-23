# PowerAutomation - AICore 0623

PowerAutomation是基於動態專家系統的智能自動化平台，提供完整的工作流錄製、分析和管理能力。

## 🚀 主要特性

### **AICore 3.0 動態專家系統**
- **智能專家發現**: 基於Cloud Search的場景驅動專家創建
- **並行專家調用**: 同時調用多個領域專家提高效率
- **專家建議聚合**: 智能整合多專家分析結果
- **動態工具生成**: 根據專家建議自動生成MCP工具

### **完整的MCP組件生態**
- **General_Processor MCP**: 統一的通用處理器組件
- **Recorder_Workflow MCP**: 工作流錄製和管理組件
- **Test_Flow MCP**: 測試流程管理組件
- **SystemMonitor_Adapter MCP**: 系統監控適配器
- **FileProcessor_Adapter MCP**: 文件處理適配器

### **智能工作流管理**
- **無UI依賴**: 純MCP組件，無需Web界面
- **模式分析**: 工作流模式識別和優化建議
- **多格式導出**: JSON、CSV、YAML格式支持
- **會話管理**: 完整的錄製會話生命週期管理

## 📁 項目結構

```
PowerAutomation/
├── components/          # MCP組件
│   ├── general_processor_mcp.py
│   ├── recorder_workflow_mcp.py
│   ├── scenario_analyzer.py
│   ├── dynamic_expert_registry.py
│   └── expert_recommendation_aggregator.py
├── core/               # 核心引擎
│   ├── aicore3.py      # AICore 3.0主引擎
│   ├── aicore2.py      # AICore 2.0
│   └── enhanced_agent_core.py
├── tools/              # 工具系統
│   ├── tool_registry.py
│   └── enhanced_tool_registry.py
├── config/             # 配置管理
└── docs/              # 文檔
```

## 🎯 核心能力

### **六階段智能處理流程**
1. **整合式搜索和分析** - Cloud Search一次解決多問題
2. **動態專家生成** - 場景驅動的專家創建
3. **專家回答生成** - 並行多專家分析
4. **專家建議聚合** - 智能聚合和衝突解決
5. **動態工具生成** - 自動生成Flow/Adapter MCP
6. **最終結果生成** - 綜合分析和結果輸出

### **支持的專家領域**
- 技術專家 (technical_expert)
- API專家 (api_expert)
- 業務專家 (business_expert)
- 數據專家 (data_expert)
- 集成專家 (integration_expert)
- 安全專家 (security_expert)
- 性能專家 (performance_expert)
- **動態專家**: 測試、部署、編碼等場景自動創建

## 🛠️ 快速開始

### **安裝依賴**
```bash
pip install -r PowerAutomation/requirements.txt
```

### **啟動AICore 3.0**
```python
from PowerAutomation.core.aicore3 import create_aicore3

# 創建AICore實例
aicore = create_aicore3()
await aicore.initialize()

# 處理請求
result = await aicore.process_request(request)
```

### **使用Recorder_Workflow MCP**
```python
from PowerAutomation.components.recorder_workflow_mcp import create_recorder_workflow_mcp

# 創建錄製器
recorder = create_recorder_workflow_mcp()

# 開始錄製
await recorder.start_recording("測試工作流", "testing")

# 停止錄製
result = await recorder.stop_recording()
```

## 📊 系統狀態

- **版本**: PowerAutomation 3.0.0
- **MCP組件**: 8個已註冊
- **專家系統**: 動態擴展支持
- **工具發現**: 自動化工具註冊
- **測試覆蓋**: 完整功能驗證

## 🎉 主要更新 (v3.0.0)

1. **重命名**: simplified_agent → PowerAutomation
2. **AICore 3.0**: 實現動態專家系統
3. **MCP組件化**: 完整的組件生態系統
4. **UI清理**: 移除Web界面，專注核心功能
5. **智能聚合**: 多專家建議智能整合
6. **工具生成**: 動態MCP工具創建

## 📝 更新日誌

### v3.0.0 (2025-06-23)
- 實現AICore 3.0動態專家系統
- 創建Recorder_Workflow MCP組件
- 移除Workflow Recorder UI功能
- 整合General_Processor MCP
- 完善工具註冊系統
- 添加智能專家發現和聚合機制
- 支持動態MCP工具生成

---

**PowerAutomation** - 讓自動化更智能，讓專家系統更動態！

