# VSCode学习插件 🎓

一个专门为学习VSCode插件开发而创建的基础项目，包含详细的中文注释和实用示例。

## ✨ 功能特性

这个学习插件包含以下示例功能：

- **Hello World命令** - 基础的消息显示功能
- **时间显示** - 获取和格式化当前时间
- **文本插入** - 与编辑器交互，插入示例代码
- **快捷键绑定** - 演示如何设置键盘快捷键
- **右键菜单** - 在编辑器上下文菜单中添加选项

## 🚀 快速开始

### 1. 环境要求

- Node.js (推荐 v16 或更高版本)
- VSCode (v1.101.0 或更高版本)
- Yarn 包管理器

### 2. 安装和运行

```bash
# 克隆或下载项目后，进入项目目录
cd VSCode-ai

# 安装依赖（如果还没有安装）
yarn install

# 编译项目
yarn compile

# 启动调试模式
# 在VSCode中按F5，或者使用"运行和调试"面板
```

### 3. 测试插件功能

在扩展开发主机窗口中：

1. **命令面板测试**：
   - 按 `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
   - 输入"学习插件"查看所有可用命令

2. **快捷键测试**：
   - 按 `Ctrl+Shift+H` (Mac: `Cmd+Shift+H`) 触发Hello World命令

3. **右键菜单测试**：
   - 在编辑器中选中一些文本
   - 右键点击，查看"插入示例文本"选项

## 📚 学习资源

- 📖 [学习指南.md](./学习指南.md) - 详细的学习路径和API参考
- 🔧 [src/extension.ts](./src/extension.ts) - 带有详细中文注释的主要代码
- ⚙️ [package.json](./package.json) - 插件配置文件说明

## 🛠️ 开发脚本

```bash
# 编译TypeScript代码
yarn compile

# 监听模式（自动重新编译）
yarn watch

# 运行代码检查
yarn lint

# 运行测试
yarn test

# 打包发布版本
yarn package
```

## 📁 项目结构

```
VSCode-ai/
├── .vscode/           # VSCode工作区配置
├── src/               # 源代码
│   ├── extension.ts   # 主扩展文件
│   └── test/          # 测试文件
├── package.json       # 插件清单
├── tsconfig.json      # TypeScript配置
├── webpack.config.js  # 打包配置
└── 学习指南.md        # 详细学习指南
```

## 🎯 学习目标

通过这个项目，你将学会：

- ✅ VSCode插件的基本结构和配置
- ✅ 如何注册和实现命令
- ✅ 如何与用户交互（消息、输入框等）
- ✅ 如何操作编辑器内容
- ✅ 如何设置快捷键和菜单
- ✅ 如何调试和测试插件
- ✅ 插件开发的最佳实践

## 🔧 自定义和扩展

你可以基于这个项目继续学习和开发：

1. **添加新命令** - 在package.json中定义，在extension.ts中实现
2. **创建设置项** - 使用configuration贡献点
3. **添加语言支持** - 实现语法高亮、代码补全等
4. **集成外部API** - 连接网络服务或本地工具

## 🐛 故障排除

### 常见问题

1. **插件没有激活**
   - 检查package.json中的activationEvents
   - 确保命令ID拼写正确

2. **命令找不到**
   - 验证package.json中的commands配置
   - 确保registerCommand的参数匹配

3. **编译错误**
   - 运行 `yarn install` 重新安装依赖
   - 检查TypeScript版本兼容性

### 调试技巧

- 使用 `console.log()` 在开发者工具中查看输出
- 在代码中设置断点进行调试
- 查看VSCode的"输出"面板中的错误信息

## 📖 进一步学习

- [VSCode Extension API 官方文档](https://code.visualstudio.com/api)
- [VSCode Extension Samples](https://github.com/microsoft/vscode-extension-samples)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## 🤝 贡献

欢迎提交问题和改进建议！这个项目的目标是帮助更多人学习VSCode插件开发。

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**开始你的VSCode插件开发之旅吧！** 🚀
