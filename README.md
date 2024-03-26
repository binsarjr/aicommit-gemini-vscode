# AiCommitGemini 

AiCommitGemini is a VS Code extension that allows you to commit your changes with AI. It uses the Gemini API to generate a commit message based on the changes you made in your code.

## Features

- Commit with AI
- Set API Key
- Language of the commit message
- Project Context
- Emoji

## Requirements

- VS Code
- Gemini API Key

## Installation

1. Open VS Code
2. Open the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Search for `AiCommitGemini` and install the extension

## Usage  

set your Gemini API Key

1. Open a file in VS Code
2. Open settings (`Ctrl+,` or `Cmd+,`)
3. Search for `AiCommitGemini`
4. Set your Gemini API Key (https://aistudio.google.com/app/apikey)

commit with AI

1. Open a file in VS Code
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Search for `AiCommitGemini: AI Commit`
4. Commit with AI

commit all files with AI

1. Open a file in VS Code
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Search for `AiCommitGemini: AI Commit All`
4. Commit all files with AI

## Configuration

You can configure the extension by going to the `AiCommitGemini` section in the VS Code settings.

- `aicommitgemini.apikey`: Your Gemini API Key
- `aicommitgemini.language`: Language of the commit message (default: `english`)
- `aicommitgemini.projectContext`: Describe what is the project you are working on (default: ``)
- `aicommitgemini.emoji`: Show emoji (default: `false`)