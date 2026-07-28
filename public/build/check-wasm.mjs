import fs from 'node:fs';
const bytes = fs.readFileSync('release.wasm');
const module = await WebAssembly.compile(bytes);
console.log("== INSTANTIATED WASM EXPORTS LIST ==");
console.table(WebAssembly.Module.exports(module).map(e => e.name));