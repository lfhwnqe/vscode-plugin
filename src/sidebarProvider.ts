/**
 * VSCode学习插件 - 侧边栏数据提供器
 * 
 * 这个文件实现了TreeDataProvider接口，为侧边栏提供树形数据结构。
 * 通过这个示例，你可以学习到：
 * 1. 如何实现TreeDataProvider接口
 * 2. 如何创建树形数据结构
 * 3. 如何为树形项目添加图标和命令
 * 4. 如何管理树形视图的状态
 */

import * as vscode from 'vscode';

/**
 * 侧边栏项目类
 * 表示侧边栏中的一个项目（可以是分类或具体功能）
 */
export class SidebarItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,           // 显示的标签文本
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,  // 是否可折叠
        public readonly command?: vscode.Command,  // 点击时执行的命令
        public readonly iconPath?: vscode.ThemeIcon | string,  // 图标
        public readonly tooltip?: string,        // 鼠标悬停提示
        public readonly contextValue?: string    // 上下文值，用于菜单显示条件
    ) {
        super(label, collapsibleState);
        
        this.tooltip = tooltip || label;
        this.command = command;
        this.iconPath = iconPath;
        this.contextValue = contextValue;
    }
}

/**
 * 侧边栏数据提供器
 * 实现TreeDataProvider接口，为VSCode的TreeView提供数据
 */
export class SidebarProvider implements vscode.TreeDataProvider<SidebarItem> {
    
    /**
     * 数据变化事件发射器
     * 当数据发生变化时，通过这个事件通知VSCode刷新视图
     */
    private _onDidChangeTreeData: vscode.EventEmitter<SidebarItem | undefined | null | void> = new vscode.EventEmitter<SidebarItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<SidebarItem | undefined | null | void> = this._onDidChangeTreeData.event;

    /**
     * 侧边栏数据存储
     * 使用Map存储分类和对应的子项目
     */
    private data: Map<string, SidebarItem[]> = new Map();

    constructor() {
        this.initializeData();
    }

    /**
     * 初始化侧边栏数据
     * 创建分类和对应的功能项目
     */
    private initializeData(): void {
        // 基础功能分类
        const basicFeatures: SidebarItem[] = [
            new SidebarItem(
                'Hello World',
                vscode.TreeItemCollapsibleState.None,
                {
                    command: 'vscode-study-plugin.helloWorld',
                    title: 'Hello World',
                    arguments: []
                },
                new vscode.ThemeIcon('symbol-event'),
                '显示Hello World消息',
                'basicFeature'
            ),
            new SidebarItem(
                '显示当前时间',
                vscode.TreeItemCollapsibleState.None,
                {
                    command: 'vscode-study-plugin.showCurrentTime',
                    title: '显示当前时间',
                    arguments: []
                },
                new vscode.ThemeIcon('clock'),
                '获取并显示系统当前时间',
                'basicFeature'
            ),
            new SidebarItem(
                '插入示例文本',
                vscode.TreeItemCollapsibleState.None,
                {
                    command: 'vscode-study-plugin.insertText',
                    title: '插入示例文本',
                    arguments: []
                },
                new vscode.ThemeIcon('edit'),
                '在当前编辑器中插入示例代码',
                'basicFeature'
            )
        ];

        // 学习资源分类
        const learningResources: SidebarItem[] = [
            new SidebarItem(
                '学习指南',
                vscode.TreeItemCollapsibleState.None,
                {
                    command: 'vscode-study-plugin.openLearningGuide',
                    title: '打开学习指南',
                    arguments: []
                },
                new vscode.ThemeIcon('book'),
                '打开详细的插件开发教程',
                'learningResource'
            ),
            new SidebarItem(
                '开发环境配置',
                vscode.TreeItemCollapsibleState.None,
                {
                    command: 'vscode-study-plugin.openFile',
                    title: '打开开发环境配置',
                    arguments: ['开发环境配置.md']
                },
                new vscode.ThemeIcon('settings-gear'),
                '查看环境设置说明',
                'learningResource'
            ),
            new SidebarItem(
                '项目总结',
                vscode.TreeItemCollapsibleState.None,
                {
                    command: 'vscode-study-plugin.openFile',
                    title: '打开项目总结',
                    arguments: ['项目完成总结.md']
                },
                new vscode.ThemeIcon('checklist'),
                '查看项目完成情况',
                'learningResource'
            )
        ];

        // 插件信息分类
        const pluginInfo: SidebarItem[] = [
            new SidebarItem(
                '版本信息',
                vscode.TreeItemCollapsibleState.None,
                {
                    command: 'vscode-study-plugin.showPluginInfo',
                    title: '显示插件信息',
                    arguments: []
                },
                new vscode.ThemeIcon('info'),
                '查看插件版本和详细信息',
                'pluginInfo'
            ),
            new SidebarItem(
                '快捷键说明',
                vscode.TreeItemCollapsibleState.None,
                {
                    command: 'vscode-study-plugin.showKeybindings',
                    title: '显示快捷键',
                    arguments: []
                },
                new vscode.ThemeIcon('keyboard'),
                '查看所有可用的快捷键',
                'pluginInfo'
            ),
            new SidebarItem(
                '打开学习面板',
                vscode.TreeItemCollapsibleState.None,
                {
                    command: 'vscode-study-plugin.openLearningPanel',
                    title: '打开学习面板',
                    arguments: []
                },
                new vscode.ThemeIcon('window'),
                '打开WebviewPanel学习面板',
                'pluginInfo'
            )
        ];

        // 将数据存储到Map中
        this.data.set('基础功能', basicFeatures);
        this.data.set('学习资源', learningResources);
        this.data.set('插件信息', pluginInfo);
    }

    /**
     * 获取树形项目
     * TreeDataProvider接口要求的方法
     * @param element 父项目，如果为undefined则返回根项目
     * @returns 子项目数组
     */
    getTreeItem(element: SidebarItem): vscode.TreeItem {
        return element;
    }

    /**
     * 获取子项目
     * TreeDataProvider接口要求的方法
     * @param element 父项目，如果为undefined则返回根项目
     * @returns 子项目数组
     */
    getChildren(element?: SidebarItem): Thenable<SidebarItem[]> {
        if (!element) {
            // 返回根级别的分类项目
            const categories: SidebarItem[] = [];
            
            for (const [categoryName] of this.data) {
                categories.push(new SidebarItem(
                    categoryName,
                    vscode.TreeItemCollapsibleState.Expanded,  // 默认展开
                    undefined,  // 分类项目不需要命令
                    this.getCategoryIcon(categoryName),
                    `${categoryName}分类`,
                    'category'
                ));
            }
            
            return Promise.resolve(categories);
        } else {
            // 返回指定分类下的子项目
            const children = this.data.get(element.label) || [];
            return Promise.resolve(children);
        }
    }

    /**
     * 获取分类图标
     * @param categoryName 分类名称
     * @returns 图标
     */
    private getCategoryIcon(categoryName: string): vscode.ThemeIcon {
        switch (categoryName) {
            case '基础功能':
                return new vscode.ThemeIcon('rocket');
            case '学习资源':
                return new vscode.ThemeIcon('library');
            case '插件信息':
                return new vscode.ThemeIcon('info');
            default:
                return new vscode.ThemeIcon('folder');
        }
    }

    /**
     * 刷新侧边栏数据
     * 触发数据变化事件，让VSCode重新加载树形视图
     */
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    /**
     * 添加新的分类
     * @param categoryName 分类名称
     * @param items 分类下的项目
     */
    addCategory(categoryName: string, items: SidebarItem[]): void {
        this.data.set(categoryName, items);
        this.refresh();
    }

    /**
     * 移除分类
     * @param categoryName 分类名称
     */
    removeCategory(categoryName: string): void {
        this.data.delete(categoryName);
        this.refresh();
    }
}
