import * as vscode from "vscode";
export class Git {
	public readonly api = vscode.extensions
		.getExtension("vscode.git")
		?.exports.getAPI(1);

	constructor() {
		if (!this.api) {
			throw new Error("Git extension not found");
		}
		const repositories = this.api.repositories;
		if (repositories.length === 0) {
			throw new Error("No git repository found");
		}

		if (repositories.length > 1) {
			throw new Error("Multiple git repositories found");
		}
	}

	async getDiff(): Promise<string[]> {
		const repositories = this.api.repositories;
		return await repositories[0].getDiff();
	}

	async stageAllChanges() {
		const repo = this.api.repositories[0];
		if (!repo) {
			vscode.window.showErrorMessage("No git repository found.");
			return;
		}
		const paths = repo.state.workingTreeChanges.map((c: any) => c.uri.path);
		await repo.add(paths);
	}

	async commit(message: string) {
		const repositories = this.api.repositories;
		return await repositories[0].commit(message);
	}
}
