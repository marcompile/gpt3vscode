export function activate(context: vscode.ExtensionContext) {
    // Register a new command that can be invoked by the user
    const chatGPTCommand = vscode.commands.registerCommand('extension.chatGPT', async () => {
        // Show an input box to get the text to send to the API
        const text = await vscode.window.showInputBox();

        // Send the text to the API and get the response
        const response = await sendTextToAPI(text);

        // Show the response in an output channel
        const outputChannel = vscode.window.createOutputChannel("chatGPT");
        outputChannel.appendLine(response);
        outputChannel.show();
    });
    context.subscriptions.push(chatGPTCommand);

    // Add the command to the context menu when a file is right-clicked
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.addChatGPTToContextMenu', () => {
            vscode.commands.executeCommand('setContext', 'chatGPT', true);
            vscode.commands.executeCommand('editor.action.addToEditorContextMenu', {
                command: 'extension.chatGPT',
                title: 'ChatGPT'
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
    // Create the request body
    const body = JSON.stringify({
        prompt: text,
        max_tokens: 2048
    });

    // Send the request to the API
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
