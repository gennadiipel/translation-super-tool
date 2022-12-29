import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const hasImport = (activeEditor: vscode.TextEditor | undefined): boolean => {
    const text = activeEditor?.document.getText() ?? "";

    return text.replace(/ /g, "").includes(`import{t}from'ttag'`);
  };

  let disposable = vscode.commands.registerCommand(
    "translation-super-tool.translateQuote",
    () => {
      const activeEditor = vscode.window.activeTextEditor;
      const line = activeEditor?.selection.active.line;

      if (line !== undefined) {
        const textLine = activeEditor?.document.lineAt(line);
        if (textLine && activeEditor && activeEditor.selection) {
          const text = activeEditor.document.getText(activeEditor.selection);

          var pat = /"(.*?)"/g;
          var pat2 = /'(.*?)'/g;
          var out = text
            .replace(pat, (pt) => {
              let res = "t`" + pt.slice(1, pt.length - 1) + "`";

              return res;
            })
            .replace(pat2, (pt) => {
              let res = "t`" + pt.slice(1, pt.length - 1) + "`";

              return res;
            });

          activeEditor?.edit((editBuilder) => {
            editBuilder.replace(activeEditor.selection, out);

            if (!hasImport(activeEditor)) {
              editBuilder.insert(
                new vscode.Position(0, 0),
                `import { t } from 'ttag'`
              );
            }
          });
        }
      }
    }
  );

  let addTranslsationStatic = vscode.commands.registerCommand(
    "translation-super-tool.translateText",
    () => {
      const activeEditor = vscode.window.activeTextEditor;

      const line = activeEditor?.selection.active.line;
      if (line !== undefined) {
        const textLine = activeEditor?.document.lineAt(line);
        if (textLine && activeEditor && activeEditor.selection) {
          const text = activeEditor.document.getText(activeEditor.selection);

          activeEditor?.edit((editBuilder) => {
            editBuilder.replace(activeEditor.selection, "{t`" + text + "`}");
          });
        }
      }
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(addTranslsationStatic);
}

export function deactivate() {}
