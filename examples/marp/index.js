import * as moonbitMode from "@moonbit/moonpad-monaco";
import * as monaco from "monaco-editor-core";

// monaco editor 要求的全局变量，具体可以查看其文档：https://github.com/microsoft/monaco-editor
self.MonacoEnvironment = {
  getWorkerUrl: function () {
    return "/moonpad/editor.worker.js";
  },
};

// moonbitMode 是一个 monaco-editor 的扩展，也就是我们提到的moonpad，用于支持 MoonBit 语言的语法高亮和LSP服务等功能。
// `moonbitMode.init` 会初始化 MoonBit 的各种功能，并且会返回一个简单的 MoonBit 构建系统，用于编译/运行 MoonBit 代码。
const moon = moonbitMode.init({
  // 一个可以请求到 onig.wasm 的 URL 字符串
  // onig.wasm 是 oniguruma 的 wasm 版本。oniguruma 是一个正则表达式引擎，在这里用于支持 MoonBit 的 textmate 语法高亮。
  onigWasmUrl: new URL("./onig.wasm", import.meta.url).toString(),
  // 一个运行 MoonBit LSP 服务器的 Worker，用于给 MoonBit 语言提供LSP服务。
  lspWorker: new Worker("/moonpad/lsp-server.js"),
  // 一个工厂函数，用于返回一个运行 MoonBit 编译器的 Worker，用于在浏览器中直接编译 MoonBit 代码。
  mooncWorkerFactory: () => new Worker("/moonpad/moonc-worker.js"),
  // 一个配置函数，用于配置哪些codeLens需要被显示。这里我们出于简单的考虑，直接返回false，不显示任何codeLens。
  codeLensFilter() {
    return false;
  },
});

for (const pre of document.querySelectorAll(
  "marp-pre:has(code.language-moonbit)",
)) {
  const code = pre.querySelector("code.language-moonbit").textContent;
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
