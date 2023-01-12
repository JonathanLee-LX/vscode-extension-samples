import * as vscode from 'vscode';
import { TextDecoder, TextEncoder } from 'util';

/**
 * An ultra-minimal sample provider that lets the user type in JSON, and then
 * outputs JSON cells. The outputs are transient and not saved to notebook file on disk.
 */

interface RawNotebookData {
	cells: RawNotebookCell[]
}

interface RawNotebookCell {
	language: string;
	value: string;
	kind: vscode.NotebookCellKind;
	editable?: boolean;
}

export class SampleContentSerializer implements vscode.NotebookSerializer {
	public readonly label: string = 'My Sample Content Serializer';

	public async deserializeNotebook(data: Uint8Array, token: vscode.CancellationToken): Promise<vscode.NotebookData> {
		console.log('Invoking my serializer');

		// Create array of Notebook cells for the VS Code API from file contents
		const cells: vscode.NotebookCellData[] = [
			new vscode.NotebookCellData(
				vscode.NotebookCellKind.Markup,
				'Hi from my test extension',
				'markdown'
			)
		];

		return new vscode.NotebookData(cells);
	}

	public async serializeNotebook(data: vscode.NotebookData, token: vscode.CancellationToken): Promise<Uint8Array> {
		// Map the Notebook data into the format we want to save the Notebook data as
		const contents: RawNotebookData = { cells: [] };

		for (const cell of data.cells) {
			contents.cells.push({
				kind: cell.kind,
				language: cell.languageId,
				value: cell.value
			});
		}

		return new TextEncoder().encode(JSON.stringify(contents));
	}
}
