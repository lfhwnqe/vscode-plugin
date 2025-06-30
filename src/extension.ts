/**
 * VSCode学习插件 - 主扩展文件
 *
 * 这个文件是VSCode插件的入口点，包含了插件的激活和停用逻辑。
 * 通过这个示例，你可以学习到：
 * 1. 如何注册命令
 * 2. 如何显示消息
 * 3. 如何与编辑器交互
 * 4. 如何管理插件的生命周期
 */

// 导入VSCode扩展API模块
// 这个模块包含了所有与VSCode交互所需的API
import * as vscode from 'vscode';

/**
 * 插件激活函数
 *
 * 当插件被激活时会调用这个函数。插件的激活时机由package.json中的activationEvents决定。
 * 如果activationEvents为空数组，则插件会在VSCode启动时立即激活。
 *
 * @param context 扩展上下文，包含插件的状态和资源管理
 */
export function activate(context: vscode.ExtensionContext) {

	// 在控制台输出调试信息
	// 这些信息可以在VSCode的"开发者工具"中的控制台看到
	console.log('🎉 VSCode学习插件已激活！');

	// 显示插件激活通知（可选，用于学习目的）
	vscode.window.showInformationMessage('VSCode学习插件已成功加载！');

	// ========== 命令1：Hello World 示例 ==========
	// 注册一个简单的Hello World命令
	// 命令ID必须与package.json中contributes.commands中定义的command字段匹配
	const helloWorldCommand = vscode.commands.registerCommand('vscode-study-plugin.helloWorld', () => {
		// 当命令被执行时，这里的代码会被运行
		// showInformationMessage 会在VSCode右下角显示一个信息提示框
		vscode.window.showInformationMessage('🌟 Hello World! 这是你的第一个VSCode插件命令！');
	});

	// ========== 命令2：显示当前时间 ==========
	// 这个命令演示如何获取和格式化数据
	const showTimeCommand = vscode.commands.registerCommand('vscode-study-plugin.showCurrentTime', () => {
		// 获取当前时间并格式化
		const now = new Date();
		const timeString = now.toLocaleString('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});

		// 显示时间信息
		vscode.window.showInformationMessage(`⏰ 当前时间：${timeString}`);
	});

	// ========== 命令3：插入文本到编辑器 ==========
	// 这个命令演示如何与当前活动的编辑器交互
	const insertTextCommand = vscode.commands.registerCommand('vscode-study-plugin.insertText', () => {
		// 获取当前活动的编辑器
		const editor = vscode.window.activeTextEditor;

		// 检查是否有打开的编辑器
		if (!editor) {
			vscode.window.showWarningMessage('⚠️ 请先打开一个文件！');
			return;
		}

		// 获取当前光标位置或选中的文本范围
		const selection = editor.selection;

		// 要插入的示例文本
		const textToInsert = `
// 这是由VSCode学习插件插入的示例代码
// 插入时间：${new Date().toLocaleString('zh-CN')}
console.log('Hello from VSCode Study Plugin!');
`;

		// 在编辑器中插入文本
		editor.edit(editBuilder => {
			// 如果有选中文本，则替换选中的文本；否则在光标位置插入
			if (selection.isEmpty) {
				editBuilder.insert(selection.start, textToInsert);
			} else {
				editBuilder.replace(selection, textToInsert);
			}
		}).then(success => {
			if (success) {
				vscode.window.showInformationMessage('✅ 文本插入成功！');
			} else {
				vscode.window.showErrorMessage('❌ 文本插入失败！');
			}
		});
	});

	// ========== 将命令添加到订阅列表 ==========
	// 这很重要！所有的disposable对象都需要添加到context.subscriptions中
	// 这样当插件被停用时，VSCode会自动清理这些资源，防止内存泄漏
	context.subscriptions.push(
		helloWorldCommand,
		showTimeCommand,
		insertTextCommand
	);

	// 输出激活完成信息
	console.log('📝 所有命令已注册完成');
}

/**
 * 插件停用函数
 *
 * 当插件被停用时会调用这个函数。
 * 在这里可以进行清理工作，比如：
 * - 关闭文件句柄
 * - 清理定时器
 * - 断开网络连接
 * - 保存用户数据等
 *
 * 注意：通过context.subscriptions注册的资源会被VSCode自动清理，
 * 所以通常情况下这个函数可以为空。
 */
export function deactivate() {
	console.log('👋 VSCode学习插件已停用');
}
