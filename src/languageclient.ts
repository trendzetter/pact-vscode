import { workspace } from "vscode";
import * as vscode from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';


export class PactLanguageClient {
    private client: LanguageClient;
    public constructor() {
        // LSP Config
        const pact: string = vscode.workspace.getConfiguration().get('pact.executable')!;

        // If the extension is launched in debug mode then the debug server options are used
        // Otherwise the run options are used
        const serverOptions: ServerOptions = {
            run: {
                command: pact,
                args: ['--lsp']
            },
            debug: {
                command: pact,
                args: ['--lsp']
            }
        };

        // Options to control the language client
        const clientOptions: LanguageClientOptions = {
            // Register the server for plain text documents
            documentSelector: [{ scheme: 'file', language: 'pact' }],
            synchronize: {
                // Notify the server about file changes to '.clientrc files contained in the workspace
                fileEvents: workspace.createFileSystemWatcher('**/*.{pact,repl}')
            },
            initializationOptions: [{ pact: pact }]
        };

        // Create the language client and start the client.
        this.client = new LanguageClient(
            'pactLanguageServer',
            'Pact Language Server',
            serverOptions,
            clientOptions
        );

        // Start the client. This will also launch the server
	    this.client.start();
    }

    stop(): Thenable<void> | undefined {
        return this.client.stop();
    }
}
