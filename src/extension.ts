import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const chatGPTCommand = vscode.commands.registerCommand('extension.chatGPT', async () => {
        const text = await vscode.window.showInputBox();
        if (text) {
            const response = await sendTextToAPI(text);
            const outputChannel = vscode.window.createOutputChannel("chatGPT");
            outputChannel.appendLine(response);
            outputChannel.show();
        }
    });
    context.subscriptions.push(chatGPTCommand);

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.addChatGPTToContextMenu', () => {
            vscode.commands.executeCommand('setContext', 'chatGPT', true);
            vscode.commands.executeCommand('editor.action.addToEditorContextMenu', {
                command: 'extension.chatGPT',
                title: 'Ask ChatGPT'
            });
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.removeChatGPTFromContextMenu', () => {
            vscode.commands.executeCommand('setContext', 'chatGPT', false);
        })
    );
    vscode.commands.executeCommand('extension.addChatGPTToContextMenu');
}

const API_URL = "https://api.openai.com/v1/engines/davinci/completions";
const API_KEY = "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";

async function sendTextToAPI(text: string) {
    const body = JSON.stringify({
        prompt: text,
        max_tokens: 2048
    });
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: body
    });
   
    // Get the response text
    const responseText = await response.text();

    // Parse the response JSON
    const responseJSON = JSON.parse(responseText);

    // return the generated text
    return responseJSON.choices[0].text;
}
