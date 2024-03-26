// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Gemini } from "./lib/gemini";
import { Git } from "./lib/git";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand("aicommitgemini.apikey", async () => {
			const apikey = await vscode.window.showInputBox({
				prompt: "Please enter your Gemini API Key",
				value: vscode.workspace
					.getConfiguration("aicommitgemini")
					.get("apikey"),
			});
			if (apikey) {
				vscode.workspace
					.getConfiguration("aicommitgemini")
					.update("apikey", apikey, true);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("aicommitgemini.commit", async () => {
			try {
				const git = new Git();
				const diff = await git.getDiff();
				const gemini = new Gemini();

				// request commit context
				const commitContext = await vscode.window.showInputBox({
					prompt: "Please enter your commit context (Enter to skip)",
				});

				if (commitContext) {
					gemini.setCommitContext(commitContext);
				}

				const commitMessage = await gemini.askCommit(diff.join("\n"));
				vscode.window.showInformationMessage(commitMessage);
				await git.commit(commitMessage);
			} catch (error: any) {
				vscode.window.showErrorMessage(error.message);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("aicommitgemini.commit-all", async () => {
			try {
				const git = new Git();
				await git.stageAllChanges();
				const diff = await git.getDiff();
				const gemini = new Gemini();

				// request commit context
				const commitContext = await vscode.window.showInputBox({
					prompt: "Please enter your commit context (Enter to skip)",
				});

				if (commitContext) {
					gemini.setCommitContext(commitContext);
				}

				const commitMessage = await gemini.askCommit(diff.join("\n"));
				vscode.window.showInformationMessage(commitMessage);
				await git.commit(commitMessage);
			} catch (error: any) {
				vscode.window.showErrorMessage(error.message);
			}
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
