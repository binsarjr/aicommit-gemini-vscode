import {
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
} from "@google/generative-ai";
import vscode from "vscode";
export type Options = {
	language: string;
};

export class Gemini {
	private useEmoji: boolean;
	private apikey: string;
	private language: string = "english";
	private projectContext: string = "";
	private commitContext: string = "";

	constructor() {
		this.apikey = vscode.workspace
			.getConfiguration("aicommitgemini")
			.get("apikey") as string;
		this.language =
			vscode.workspace.getConfiguration("aicommitgemini").get("language") ||
			("english" as string);
		this.useEmoji = Boolean(
			vscode.workspace.getConfiguration("aicommitgemini").get("emoji")
		) as boolean;

		this.projectContext =
			vscode.workspace
				.getConfiguration("aicommitgemini")
				.get("projectContext") || ("" as string);
	}

	setCommitContext(context: string) {
		this.commitContext = context;
	}

	askCommit = async (diff: string) => {
		const genAI = new GoogleGenerativeAI(this.apikey);

		const model = genAI.getGenerativeModel({
			model: "gemini-pro",
			safetySettings: [
				{
					category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
					threshold: HarmBlockThreshold.BLOCK_NONE,
				},
				{
					category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
					threshold: HarmBlockThreshold.BLOCK_NONE,
				},
				{
					category: HarmCategory.HARM_CATEGORY_HARASSMENT,
					threshold: HarmBlockThreshold.BLOCK_NONE,
				},
				{
					category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
					threshold: HarmBlockThreshold.BLOCK_NONE,
				},
			],
		});

		const prompts = [
			`
  You are a commit message generator that strictly follows the Conventional Commits specification validated via regex /^(feat|fix|docs|style|refactor|test|chore|revert|perf|build|ci)([\\w-]+): .+$/.
  Exclude anything unnecessary such as translation. Your entire response will be passed directly into git commit.
  
  ${this.projectContext ? `Project Context: ${this.projectContext}` : ""}
  ${this.commitContext ? `Commit Context: ${this.commitContext}` : ""}
  
  
  
  Choose a type from the type-to-description JSON below that best describes the git diff:
  ${JSON.stringify(
		{
			docs: "Documentation only changes",
			style:
				"Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
			refactor: "A code change that neither fixes a bug nor adds a feature",
			perf: "A code change that improves performance",
			test: "Adding missing tests or correcting existing tests",
			build: "Changes that affect the build system or external dependencies",
			ci: "Changes to our CI configuration files and scripts",
			chore: "Other changes that don't modify src or test files",
			revert: "Reverts a previous commit",
			feat: "A new feature",
			fix: "A bug fix",
		},
		null,
		2
	)}
      `.trim(),
		];

		prompts.push(
			`
  Given the following git diff, suggest a concise and descriptive commit message in ${this.language}:
  ---- ${diff}
      `.trim()
		);

		const response = await model.generateContent(prompts);

		let result = response.response.text();

		if (this.useEmoji) {
			const emoji: any = {
				docs: "📝",
				style: "💄",
				refactor: "♻️",
				perf: "⚡️",
				test: "✅",
				build: "🏗️",
				ci: "🔁",
				chore: "🔧",
				revert: "⏪",
				feat: "✨",
				fix: "🚑",
			};
			// get first word with regex \w+
			const type = result.match(/\w+/)?.[0] || "";
			if (type) {
				result = `${emoji[type] || ""} ${result}`.trim();
			}
		}
		return result;
	};
}
