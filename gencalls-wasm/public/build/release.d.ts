/** Exported memory */
export declare const memory: WebAssembly.Memory;
// Exported runtime interface
export declare function __new(size: number, id: number): number;
export declare function __pin(ptr: number): number;
export declare function __unpin(ptr: number): void;
export declare function __collect(): void;
export declare const __rtti_base: number;
/**
 * assembly/engine/initDatabase
 */
export declare function initDatabase(): void;
/**
 * assembly/engine/compileBytecode
 * @param bytecode `~lib/string/String`
 * @returns `~lib/string/String`
 */
export declare function compileBytecode(bytecode: string): string;
/**
 * assembly/engine/allocateWasmString
 * @param len `i32`
 * @returns `i32`
 */
export declare function allocateWasmString(len: number): number;
/**
 * assembly/engine/_compilerPreserveHook
 */
export declare function _compilerPreserveHook(): void;
