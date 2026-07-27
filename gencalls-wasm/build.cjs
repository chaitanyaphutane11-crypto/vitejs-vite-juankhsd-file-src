import asc from "assemblyscript/asc";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Create __dirname substitute for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = "assembly/engine.ts"; 
const outDir = path.join(__dirname, "src", "wasm");

if (!fs.existsSync(outDir)){
    fs.mkdirSync(outDir, { recursive: true });
}

const absoluteSourcePath = path.resolve(sourceFile);
console.log(`[COMPILING SOURCE ASSEMBLY]: "${absoluteSourcePath}"`);

asc.main([
  sourceFile,
  "--target", "release",
  "--outFile", "src/wasm/release.wasm",
  "--optimize",
  "--noAssert"
], {
  stdout: process.stdout,
  stderr: process.stderr
}).then(({ error }) => {
  if (error) {
    console.error(`\n[BUILD ERROR] Compilation failed for: "${absoluteSourcePath}"`);
    console.error(`Details: ${error.message}\n`);
    process.exit(1);
  }
  console.log(`\n[SUCCESS] WebAssembly written to: "${path.join(outDir, "release.wasm")}"`);
});
