/** Exported memory */
export declare const memory: WebAssembly.Memory;
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
