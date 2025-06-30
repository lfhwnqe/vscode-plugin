/**
 * VSCode学习插件 - WebviewPanel实现
 * 
 * 这个文件使用WebviewPanel替换原来的TreeView侧边栏。
 * 通过这个示例，你可以学习到：
 * 1. 如何创建自定义的WebviewPanel
 * 2. 如何使用HTML/CSS/JavaScript创建丰富的用户界面
 * 3. 如何在Webview和扩展之间进行双向通信
 * 4. 如何管理面板的生命周期和状态
 */

import * as vscode from 'vscode';

/**
 * 学习面板类
 * 使用WebviewPanel提供比TreeView更丰富的用户界面
 */
export class LearningPanel {
    /**
     * 当前面板实例（单例模式）
     * 确保同时只有一个面板实例存在
     */
    public static currentPanel: LearningPanel | undefined;

    /**
     * Webview面板对象
     */
    private readonly _panel: vscode.WebviewPanel;

    /**
     * 扩展上下文
     */
    private readonly _extensionContext: vscode.ExtensionContext;

    /**
     * 资源清理器数组
     * 用于管理需要清理的资源
     */
    private _disposables: vscode.Disposable[] = [];

    /**
     * 创建或显示学习面板
     * @param extensionContext 扩展上下文
     */
    public static createOrShow(extensionContext: vscode.ExtensionContext) {
        // 如果面板已存在，直接显示
        if (LearningPanel.currentPanel) {
            LearningPanel.currentPanel._panel.reveal();
            return;
        }

        // 创建新的Webview面板
        const panel = vscode.window.createWebviewPanel(
            'learningPanel',                    // 面板类型ID
            'VSCode学习插件',                   // 面板标题
            vscode.ViewColumn.One,              // 显示位置（第一列，替代侧边栏）
            {
                // Webview选项配置
                enableScripts: true,            // 允许JavaScript执行
                retainContextWhenHidden: true,  // 隐藏时保持状态
                localResourceRoots: [           // 允许访问的本地资源路径
                    vscode.Uri.joinPath(extensionContext.extensionUri, 'media'),
                    vscode.Uri.joinPath(extensionContext.extensionUri, 'resources')
                ]
            }
        );

        // 设置面板图标
        panel.iconPath = {
            light: vscode.Uri.joinPath(extensionContext.extensionUri, 'resources', 'light', 'icon.svg'),
            dark: vscode.Uri.joinPath(extensionContext.extensionUri, 'resources', 'dark', 'icon.svg')
        };

        // 创建面板实例
        LearningPanel.currentPanel = new LearningPanel(panel, extensionContext);
    }

    /**
     * 构造函数
     * @param panel Webview面板
     * @param extensionContext 扩展上下文
     */
    private constructor(panel: vscode.WebviewPanel, extensionContext: vscode.ExtensionContext) {
        this._panel = panel;
        this._extensionContext = extensionContext;

        // 设置初始HTML内容
        this._updateWebview();

        // 监听面板关闭事件
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // 监听面板可见性变化
        this._panel.onDidChangeViewState(
            () => {
                if (this._panel.visible) {
                    this._updateWebview();
                }
            },
            null,
            this._disposables
        );

        // 监听来自Webview的消息
        this._panel.webview.onDidReceiveMessage(
            message => {
                this._handleWebviewMessage(message);
            },
            null,
            this._disposables
        );
    }

    /**
     * 处理来自Webview的消息
     * @param message 消息对象
     */
    private _handleWebviewMessage(message: any) {
        switch (message.command) {
            case 'helloWorld':
                vscode.commands.executeCommand('vscode-study-plugin.helloWorld');
                break;
            
            case 'showTime':
                vscode.commands.executeCommand('vscode-study-plugin.showCurrentTime');
                // 同时更新Webview中的时间显示
                this._updateTimeDisplay();
                break;
            
            case 'insertText':
                vscode.commands.executeCommand('vscode-study-plugin.insertText');
                break;
            
            case 'openLearningGuide':
                vscode.commands.executeCommand('vscode-study-plugin.openLearningGuide');
                break;
            
            case 'showPluginInfo':
                vscode.commands.executeCommand('vscode-study-plugin.showPluginInfo');
                break;
            
            case 'showKeybindings':
                vscode.commands.executeCommand('vscode-study-plugin.showKeybindings');
                break;
            
            case 'openFile':
                this._openFile(message.fileName);
                break;
            
            case 'refresh':
                this._updateWebview();
                vscode.window.showInformationMessage('🔄 面板已刷新！');
                break;
        }
    }

    /**
     * 更新时间显示
     */
    private _updateTimeDisplay() {
        const now = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // 发送时间更新消息到Webview
        this._panel.webview.postMessage({
            command: 'updateTime',
            time: now
        });
    }

    /**
     * 打开指定文件
     * @param fileName 文件名
     */
    private _openFile(fileName: string) {
        const filePath = vscode.Uri.joinPath(this._extensionContext.extensionUri, fileName);
        vscode.commands.executeCommand('vscode.open', filePath);
    }

    /**
     * 更新Webview内容
     */
    private _updateWebview() {
        this._panel.webview.html = this._getWebviewContent();
    }

    /**
     * 生成Webview的HTML内容
     * @returns HTML字符串
     */
    private _getWebviewContent(): string {
        // 获取当前时间
        const currentTime = new Date().toLocaleString('zh-CN');
        
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VSCode学习插件</title>
    <style>
        /* 使用VSCode主题变量 */
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-sideBar-background);
            padding: 16px;
            margin: 0;
            line-height: 1.5;
        }
        
        .header {
            text-align: center;
            margin-bottom: 24px;
            padding: 16px;
            background-color: var(--vscode-sideBarSectionHeader-background);
            border-radius: 6px;
            border: 1px solid var(--vscode-sideBarSectionHeader-border);
        }
        
        .header h1 {
            margin: 0 0 8px 0;
            color: var(--vscode-sideBarTitle-foreground);
            font-size: 18px;
        }
        
        .header p {
            margin: 0;
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
        }
        
        .section {
            margin-bottom: 20px;
            background-color: var(--vscode-sideBarSectionHeader-background);
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid var(--vscode-sideBarSectionHeader-border);
        }
        
        .section-header {
            padding: 12px 16px;
            background-color: var(--vscode-sideBarSectionHeader-background);
            border-bottom: 1px solid var(--vscode-sideBarSectionHeader-border);
            font-weight: 600;
            color: var(--vscode-sideBarTitle-foreground);
            font-size: 13px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .section-content {
            padding: 12px;
        }
        
        .button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 12px;
            margin: 4px 0;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            width: 100%;
            text-align: left;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
        }
        
        .button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        
        .button:active {
            background-color: var(--vscode-button-background);
        }
        
        .button-icon {
            margin-right: 8px;
            font-size: 14px;
        }
        
        .time-display {
            font-family: var(--vscode-editor-font-family);
            font-size: 11px;
            color: var(--vscode-textLink-foreground);
            background-color: var(--vscode-editor-background);
            padding: 8px;
            border-radius: 4px;
            margin: 8px 0;
            text-align: center;
            border: 1px solid var(--vscode-panel-border);
        }
        
        .refresh-btn {
            background: none;
            border: none;
            color: var(--vscode-icon-foreground);
            cursor: pointer;
            padding: 4px;
            border-radius: 3px;
        }
        
        .refresh-btn:hover {
            background-color: var(--vscode-toolbar-hoverBackground);
        }
        
        .item-description {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎓 VSCode学习插件</h1>
        <p>使用WebviewPanel实现的现代化界面</p>
    </div>
    
    <div class="section">
        <div class="section-header">
            🚀 基础功能
            <button class="refresh-btn" onclick="sendCommand('refresh')" title="刷新面板">
                🔄
            </button>
        </div>
        <div class="section-content">
            <button class="button" onclick="sendCommand('helloWorld')">
                <span class="button-icon">👋</span>
                Hello World
            </button>
            <div class="item-description">显示问候消息</div>
            
            <button class="button" onclick="sendCommand('showTime')">
                <span class="button-icon">⏰</span>
                显示当前时间
            </button>
            <div class="item-description">获取系统当前时间</div>
            <div id="timeDisplay" class="time-display">
                当前时间：${currentTime}
            </div>
            
            <button class="button" onclick="sendCommand('insertText')">
                <span class="button-icon">📝</span>
                插入示例文本
            </button>
            <div class="item-description">在编辑器中插入示例代码</div>
        </div>
    </div>
    
    <div class="section">
        <div class="section-header">📚 学习资源</div>
        <div class="section-content">
            <button class="button" onclick="sendCommand('openLearningGuide')">
                <span class="button-icon">📖</span>
                学习指南
            </button>
            <div class="item-description">查看详细教程</div>
            
            <button class="button" onclick="openFile('开发环境配置.md')">
                <span class="button-icon">⚙️</span>
                开发环境配置
            </button>
            <div class="item-description">环境设置指南</div>
            
            <button class="button" onclick="openFile('项目完成总结.md')">
                <span class="button-icon">📋</span>
                项目总结
            </button>
            <div class="item-description">项目完成情况</div>
        </div>
    </div>
    
    <div class="section">
        <div class="section-header">ℹ️ 插件信息</div>
        <div class="section-content">
            <button class="button" onclick="sendCommand('showPluginInfo')">
                <span class="button-icon">📚</span>
                版本信息
            </button>
            <div class="item-description">查看插件版本和详细信息</div>
            
            <button class="button" onclick="sendCommand('showKeybindings')">
                <span class="button-icon">⌨️</span>
                快捷键说明
            </button>
            <div class="item-description">查看插件的快捷键设置</div>
        </div>
    </div>
    
    <script>
        // 获取VSCode API
        const vscode = acquireVsCodeApi();
        
        // 发送命令到扩展
        function sendCommand(command, data = {}) {
            vscode.postMessage({
                command: command,
                ...data
            });
        }
        
        // 打开文件
        function openFile(fileName) {
            sendCommand('openFile', { fileName: fileName });
        }
        
        // 监听来自扩展的消息
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.command) {
                case 'updateTime':
                    const timeDisplay = document.getElementById('timeDisplay');
                    if (timeDisplay) {
                        timeDisplay.textContent = '当前时间：' + message.time;
                    }
                    break;
            }
        });
        
        // 页面加载完成后的初始化
        document.addEventListener('DOMContentLoaded', function() {
            console.log('VSCode学习插件WebviewPanel已加载');
        });
    </script>
</body>
</html>`;
    }

    /**
     * 清理资源
     */
    public dispose() {
        LearningPanel.currentPanel = undefined;

        // 清理面板
        this._panel.dispose();

        // 清理所有disposables
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}
