import * as vscode from "vscode";
import * as http from "http";
let server: http.Server;

const port = 63342;
function openFileFromUrl(url: string) {
  // the url is in format http://localhost:63342/api/file//absolute/path/to/file.ts:1:2
  // we need to extract everything after the /api/file/ part
  // handle the edge case where the url is not in the expected format
  const filePath = url.split("/api/file/")?.[1] || "";
  const [path, line, column] = filePath.split(":");

  if (!path) {
    return;
  }

  // let's open the file
  vscode.workspace.openTextDocument(path).then((doc) => {
    vscode.window.showTextDocument(doc).then((editor) => {
      // let's set the cursor position
      // handle the edge case where the line or column is not a number
      const numberLine = Number(line) - 1; // use 0-based line number
      const numberColumn = Number(column) - 1; // use 0-based column number
      if (Number.isNaN(numberLine) || Number.isNaN(numberColumn)) {
        return;
      }

      editor.selection = new vscode.Selection(
        numberLine,
        numberColumn,
        numberLine,
        numberColumn
      );
      // scroll to the cursor position
      editor.revealRange(editor.selection);
    });
  });
}

export function activate(context: vscode.ExtensionContext) {
  server = http.createServer((request, response) => {
    response.statusCode = 200;

    response.setHeader("Content-Type", "text/plain");

    response.end("Opening file...");

    openFileFromUrl(request.url || "");
  });
  // listen on port ${port} which is the default port used by IntelliJ
  // but we need to watch out for the case where the port is already in use
  // in that case we just don't start the server

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      vscode.window.showErrorMessage(
        `Port ${port} is already in use, looks like you might have an instance of IntelliJ running.`
      );
    }
  });
  server.listen(port, () => {
    console.log(
      `File Opener IntelliJ Compatability Server running at http://localhost:${port}/`
    );
  });
}

export function deactivate() {
  // close the server
  server.close();
}
