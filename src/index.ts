import * as vscode from 'vscode';
import { activate as activateExtension } from './extension';

export function activate(context: vscode.ExtensionContext) {
  activateExtension(context);
}
