// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

function isString(value: unknown): value is string {
    return typeof value === "string";
}
  
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "Gizmo" is now active!');

	const executablePath = path.join(__dirname, '../Debug/net8.0/Gizmo.exe');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('Gizmo.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Gizmo!');


		const gizmoProjectFilePath = "C:/Programming/GizmoTestProject/project.gizmo"; //TODO Replace with the actual code to compile
        const childProcess = cp.spawn(executablePath, [gizmoProjectFilePath]);

        childProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            // Handle the output from the C++ executable as needed
            vscode.window.showInformationMessage('Compilation output: ' + data.toString());
        });

        childProcess.stderr.on('data', (data) => 
        {
            console.error(`stderr: ${data}`);
            // Handle any errors from the C++ executable
            vscode.window.showErrorMessage('Compilation error: ' + data.toString());
        });

        childProcess.on('close', (code) => 
        {
            console.log(`child process exited with code ${code}`);

            if (code === 0) 
            {
                vscode.window.showInformationMessage('Compilation successful!');
            } 
            else 
            {
                vscode.window.showErrorMessage('Compilation failed.');
            }
        });
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
