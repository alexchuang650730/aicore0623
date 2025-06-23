"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatProvider = void 0;
class ChatProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'sendMessage':
                    this.handleMessage(data.message);
                    break;
            }
        });
    }
    async handleMessage(message) {
        // 處理AI對話邏輯
        const response = await this.getAIResponse(message);
        this._view?.webview.postMessage({
            type: 'addMessage',
            message: response,
            isUser: false
        });
    }
    async getAIResponse(message) {
        // 這裡會連接到雲側smartinvention MCP服務
        try {
            // 模擬AI響應
            return `AI回應: ${message}`;
        }
        catch (error) {
            return '抱歉，AI服務暫時不可用。';
        }
    }
    _getHtmlForWebview(webview) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PowerAutomation Chat</title>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    padding: 10px;
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                }
                .chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                }
                .messages {
                    flex: 1;
                    overflow-y: auto;
                    margin-bottom: 10px;
                    padding: 10px;
                    border: 1px solid var(--vscode-panel-border);
                    border-radius: 4px;
                }
                .message {
                    margin-bottom: 10px;
                    padding: 8px;
                    border-radius: 4px;
                }
                .user-message {
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    text-align: right;
                }
                .ai-message {
                    background-color: var(--vscode-input-background);
                    border: 1px solid var(--vscode-input-border);
                }
                .input-container {
                    display: flex;
                    gap: 10px;
                }
                .chat-input {
                    flex: 1;
                    padding: 8px;
                    border: 1px solid var(--vscode-input-border);
                    border-radius: 4px;
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                }
                .send-button {
                    padding: 8px 16px;
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .send-button:hover {
                    background-color: var(--vscode-button-hoverBackground);
                }
            </style>
        </head>
        <body>
            <div class="chat-container">
                <div class="messages" id="chatMessages">
                    <div class="message ai-message">
                        歡迎使用PowerAutomation v3.0.0 AI助手！我可以幫助您進行自動化任務、代碼生成、問題解答等。
                    </div>
                </div>
                <div class="input-container">
                    <input type="text" class="chat-input" id="chatInput" placeholder="輸入您的問題..." />
                    <button class="send-button" onclick="sendMessage()">發送</button>
                </div>
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                let messageHistory = [];

                function sendMessage() {
                    const input = document.getElementById('chatInput');
                    const message = input.value.trim();
                    
                    if (message) {
                        addMessage(message, true);
                        vscode.postMessage({
                            type: 'sendMessage',
                            message: message
                        });
                        input.value = '';
                    }
                }

                function addMessage(message, isUser) {
                    const messagesContainer = document.getElementById('chatMessages');
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message ' + (isUser ? 'user-message' : 'ai-message');
                    messageDiv.textContent = message;
                    messagesContainer.appendChild(messageDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    
                    messageHistory.push({ message, isUser });
                }

                // 監聽來自擴展的消息
                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.type) {
                        case 'addMessage':
                            addMessage(message.message, message.isUser);
                            break;
                    }
                });

                // 回車發送消息
                document.getElementById('chatInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                });
            </script>
        </body>
        </html>`;
    }
}
exports.ChatProvider = ChatProvider;
ChatProvider.viewType = 'powerautomation.chatView';
//# sourceMappingURL=ChatProvider.js.map