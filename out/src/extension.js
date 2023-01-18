"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
function activate(context) {
    const chatGPTCommand = vscode.commands.registerCommand('extension.chatGPT', () => __awaiter(this, void 0, void 0, function* () {
        const text = yield vscode.window.showInputBox();
        if (text) {
            const response = yield sendTextToAPI(text);
            const outputChannel = vscode.window.createOutputChannel("chatGPT");
            outputChannel.appendLine(response);
            outputChannel.show();
        }
    }));
    context.subscriptions.push(chatGPTCommand);
    context.subscriptions.push(vscode.commands.registerCommand('extension.addChatGPTToContextMenu', () => {
        vscode.commands.executeCommand('setContext', 'chatGPT', true);
        vscode.commands.executeCommand('editor.action.addToEditorContextMenu', {
            command: 'extension.chatGPT',
            title: 'Ask ChatGPT'
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.removeChatGPTFromContextMenu', () => {
        vscode.commands.executeCommand('setContext', 'chatGPT', false);
    }));
    vscode.commands.executeCommand('extension.addChatGPTToContextMenu');
}
exports.activate = activate;
const API_URL = "https://api.openai.com/v1/engines/davinci/completions";
const API_KEY = "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";
function sendTextToAPI(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = JSON.stringify({
            prompt: text,
            max_tokens: 2048
        });
        const response = yield fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: body
        });
        // Get the response text
        const responseText = yield response.text();
        // Parse the response JSON
        const responseJSON = JSON.parse(responseText);
        // return the generated text
        return responseJSON.choices[0].text;
    });
}
