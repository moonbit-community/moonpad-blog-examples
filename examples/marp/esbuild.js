const esbuild = require("esbuild");
const fs = require("fs");

fs.rmSync("./slide/moonpad", { recursive: true, force: true });

esbuild.buildSync({
  entryPoints: [
    "./index.js",
    "./node_modules/monaco-editor-core/esm/vs/editor/editor.worker.js",
  ],
  bundle: true,
  minify: true,
  format: "esm",
  outdir: "./slide/moonpad",
  entryNames: "[name]",
  loader: {
    ".ttf": "file",
    ".woff2": "file",
  },
});

fs.copyFileSync(
  "./node_modules/@moonbit/moonpad-monaco/dist/lsp-server.js",
  "./slide/moonpad/lsp-server.js",
);
fs.copyFileSync(
  "./node_modules/@moonbit/moonpad-monaco/dist/moonc-worker.js",
  "./slide/moonpad/moonc-worker.js",
);
fs.copyFileSync(
  "./node_modules/@moonbit/moonpad-monaco/dist/onig.wasm",
  "./slide/moonpad/onig.wasm",
);
