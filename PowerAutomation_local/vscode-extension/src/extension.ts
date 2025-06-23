import * as vscode from 'vscode';
import { DashboardProvider } from './providers/DashboardProvider';
import { ChatProvider } from './providers/ChatProvider';
import { RepositoryProvider } from './providers/RepositoryProvider';
import { MCPServerManager } from './services/MCPServerManager';
import { EditorDetectionService } from './services/EditorDetectionService';

export function activate(context: vscode.ExtensionContext) {
    console.log('PowerAutomation v3.0.0 extension is now active!');

    // 初始化服務
    const mcpServerManager = new MCPServerManager();
    const editorDetectionService = new EditorDetectionService();
    
    // 初始化提供者
    const dashboardProvider = new DashboardProvider(context.extensionUri, mcpServerManager);
    const chatProvider = new ChatProvider(context.extensionUri, mcpServerManager);
    const repositoryProvider = new RepositoryProvider(context.extensionUri);

    // 註冊視圖提供者
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('powerautomation.dashboard', dashboardProvider),
        vscode.window.registerWebviewViewProvider('powerautomation.chat', chatProvider),
        vscode.window.registerWebviewViewProvider('powerautomation.repository', repositoryProvider)
    );

    // 註冊命令
    context.subscriptions.push(
        vscode.commands.registerCommand('powerautomation.openDashboard', () => {
            dashboardProvider.show();
        }),

        vscode.commands.registerCommand('powerautomation.toggleMode', async () => {
            const config = vscode.workspace.getConfiguration('powerautomation');
            const currentMode = config.get('minimalMode', false);
            await config.update('minimalMode', !currentMode, vscode.ConfigurationTarget.Global);
            
            // 刷新所有視圖
            dashboardProvider.refresh();
            chatProvider.refresh();
            repositoryProvider.refresh();
            
            vscode.window.showInformationMessage(
                `PowerAutomation switched to ${!currentMode ? 'minimal' : 'full'} mode`
            );
        }),

        vscode.commands.registerCommand('powerautomation.startMCPServer', async () => {
            try {
                await mcpServerManager.start();
                vscode.window.showInformationMessage('MCP Server started successfully');
                dashboardProvider.refresh();
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to start MCP Server: ${error}`);
            }
        }),

        vscode.commands.registerCommand('powerautomation.stopMCPServer', async () => {
            try {
                await mcpServerManager.stop();
                vscode.window.showInformationMessage('MCP Server stopped');
                dashboardProvider.refresh();
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to stop MCP Server: ${error}`);
            }
        }),

        vscode.commands.registerCommand('powerautomation.runTests', async () => {
            const terminal = vscode.window.createTerminal('PowerAutomation Tests');
            terminal.show();
            terminal.sendText('cd tests && python3 manus_tests/manus_test_controller.py');
        })
    );

    // 監聽配置變更
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('powerautomation')) {
                dashboardProvider.refresh();
                chatProvider.refresh();
                repositoryProvider.refresh();
            }
        })
    );

    // 自動檢測其他編輯器
    if (vscode.workspace.getConfiguration('powerautomation').get('autoDetectEditors', true)) {
        editorDetectionService.detectOtherEditors().then(hasOtherEditors => {
            if (hasOtherEditors) {
                vscode.workspace.getConfiguration('powerautomation')
                    .update('minimalMode', true, vscode.ConfigurationTarget.Global);
            }
        });
    }

    // 自動啟動MCP服務器
    setTimeout(() => {
        mcpServerManager.start().catch(error => {
            console.error('Failed to auto-start MCP Server:', error);
        });
    }, 2000);

    // 設置上下文
    vscode.commands.executeCommand('setContext', 'powerautomation.enabled', true);
}

export function deactivate() {
    console.log('PowerAutomation Local MCP extension is now deactivated');
}


    // 創建狀態欄項目
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.text = "$(robot) PowerAutomation v3.0.0";
    statusBarItem.tooltip = "PowerAutomation v3.0.0 - Advanced AI Automation Platform";
    statusBarItem.command = 'powerautomation.openDashboard';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

