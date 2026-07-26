/// <reference types="vite/client" />

declare module '*?init' {
  const initWasm: (
    options?: WebAssembly.Imports
  ) => Promise<WebAssembly.Instance>;
  export default initWasm;
}
