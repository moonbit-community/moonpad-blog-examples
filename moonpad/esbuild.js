const esbuild = require("esbuild");
const fs = require("fs");

fs.rmSync("./dist", { recursive: true, force: true });

esbuild.buildSync({
  entryPoints: [
    "./index.js",
    "./node_modules/monaco-editor-core/esm/vs/editor/editor.worker.js",
  ],
  bundle: true,
  minify: true,
  format: "esm",
  outdir: "./dist/moonpad",
  entryNames: "[name]",
  loader: {
    ".ttf": "file",
    ".woff2": "file",
  },
});

fs.copyFileSync("./index.html", "./dist/index.html");

fs.copyFileSync(
  "./node_modules/@moonbit/moonpad-monaco/dist/lsp-server.js",
  "./dist/moonpad/lsp-server.js",
);
fs.copyFileSync(
  "./node_modules/@moonbit/moonpad-monaco/dist/moonc-worker.js",
  "./dist/moonpad/moonc-worker.js",
);
fs.copyFileSync(
  "./node_modules/@moonbit/moonpad-monaco/dist/onig.wasm",
  "./dist/moonpad/onig.wasm",
);
