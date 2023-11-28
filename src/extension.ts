/* eslint-disable @typescript-eslint/naming-convention */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const path = require('path');
import MyForm from './component';
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';

let viz = new Viz({ Module, render });

class DotEditorProvider implements vscode.CustomTextEditorProvider {
    static register(context: vscode.ExtensionContext) {
        const provider = new DotEditorProvider(context);
        const registration = vscode.window.registerCustomEditorProvider(DotEditorProvider.viewType, provider);
    }

    private static readonly viewType = 'dot.customEditor';

    constructor(private readonly context: vscode.ExtensionContext) {}

    async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken) {
        // You can provide your own logic to render the .dot content in the webviewPanel
        webviewPanel.webview.options = {
			enableScripts: true,
		};

        viz.renderString(document.getText(), { engine: 'dot'}).then((svg: string) => {
            console.log(svg)
      
            webviewPanel.webview.html = this.getHtmlForDot(document, svg);
          }).catch((err: any) => {
            console.log(err);
          });

    }

    private getHtmlForDot(document: vscode.TextDocument, svg: string): string {
        // Replace this with your logic to render the .dot content

        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>.dot Custom Editor</title>
            </head>
            <body>
                ${svg}
                <input />
                <iframe src="http://localhost:3009/i2f/mobile-verification" width="100%" height="100%"></iframe>
                <div id="root"></div>
                <script>
                    ReactDOM.render(
                        React.createElement(MyForm),
                        document.getElementById('root')
                    );
                </script>
            </body>
            </html>
        `;
    }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    DotEditorProvider.register(context);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "testvs" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('testvs.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const panel = vscode.window.createWebviewPanel(
            'catCoding',
            'Cat Coding',
            vscode.ViewColumn.One,
            {enableScripts: true}
          );
    
          // And set its HTML content
          panel.webview.html = getWebviewContent();

		// const helloWorldHtmlPath = vscode.Uri.file(path.join(context.extensionPath, 'hello.html'));
		// vscode.window.showInformationMessage(helloWorldHtmlPath.path);
		// vscode.commands.executeCommand('vscode.previewHtml', helloWorldHtmlPath, vscode.ViewColumn.One, 'Hello World');

	});

	context.subscriptions.push(disposable);
	vscode.window.createTreeView('helloWorld', { treeDataProvider: new HelloWorldProvider() });
    // const panel = vscode.window.createWebviewPanel(
    //     'catCoding',
    //     'Cat Coding',
    //     vscode.ViewColumn.One,
    //     {}
    //   );

    //   // And set its HTML content
    //   panel.webview.html = getWebviewContent();

    let disposable2 = vscode.commands.registerCommand('extension.openDotAsWebview', () => {
        const panel = vscode.window.createWebviewPanel(
            'dotWebview',
            'DOT Webview',
            vscode.ViewColumn.One,
            {}
        );

        panel.webview.html = '<h1>Hello, Webview!</h1>';
    });

    context.subscriptions.push(disposable2);

}

function getWebviewContent() {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cat Coding</title>
  </head>
  <body>
      <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
  </body>
  </html>`;
  }


export class HelloWorldProvider {
    getChildren() {
        return [
            // Create a tree item that represents your "Hello World" HTML page
            {
                label: "Hello World",
                command: {
                    title: "Open Hello World",
                    command: "testvs.helloWorld",
                },
            },
        ];
    }

    getTreeItem(element: any) {
        return element;
    }
	
}


// This method is called when your extension is deactivated
export function deactivate() {}
