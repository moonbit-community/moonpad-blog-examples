import * as moonbitMode from "@moonbit/moonpad-monaco";
import * as monaco from "monaco-editor-core";

self.MonacoEnvironment = {
  getWorkerUrl: function () {
    return "/moonpad/editor.worker.js";
  },
};

const moon = moonbitMode.init({
  onigWasmUrl: new URL("./onig.wasm", import.meta.url).toString(),
  lspWorker: new Worker("/moonpad/lsp-server.js"),
  mooncWorkerFactory: () => new Worker("/moonpad/moonc-worker.js"),
  codeLensFilter() {
    return false;
  },
});

for (const pre of document.querySelectorAll("pre:has(code.language-moonbit)")) {
  const code = pre.textContent;
  const div = document.createElement("div");
  const height = code.split("\n").length * 20;
  div.style.height = `${height}px`;
  pre.replaceWith(div);
  const model = monaco.editor.createModel(code, "moonbit");
  monaco.editor.create(div, {
    model,
    theme: "light-plus",
  });
}
