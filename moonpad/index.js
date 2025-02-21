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

const model = monaco.editor.createModel(
  `fn main {
  println("hello")
}
`,
  "moonbit",
);

monaco.editor.create(document.getElementById("app"), {
  model,
  theme: "light-plus",
});

const result = await moon.compile({ libInputs: [["a.mbt", model.getValue()]] });
switch (result.kind) {
  case "success":
    const js = result.js;
    const stream = moon.run(js);
    let buffer = "";
    await stream.pipeTo(
      new WritableStream({
        write(chunk) {
          buffer += `${chunk}\n`;
        },
      }),
    );
    console.log(buffer);
    break;
  case "error":
    break;
}
