# VSCode IntelliJ-Compatible File Opener (63342 Port Listener)

This extension allows you to open files in VSCode using the IntelliJ IDEA file opener protocol using the [IntellIJ IDE Remote Control Plugin](https://plugins.jetbrains.com/plugin/19991-ide-remote-control)

URL format: http://localhost:63342/api/file//absolute/path/to/file.ts:LINE_NUMBER:COLUMN_NUMBER

The extension will start on vscode startup and listen on port 63342 for incoming requests, then it will open the file in the current active editor when the request is received.

Originally created as a compatability layer for `click-to-component` react file opener plugin.
