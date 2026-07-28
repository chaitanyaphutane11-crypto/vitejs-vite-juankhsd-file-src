// src/App.tsx (Chunk 1 of 3)
import React, { useState, useEffect } from 'react';

export interface DiscoveredMethod {
  selector: string;
  inferredName: string;
  isView: boolean;
  params: string[];
}

const OPCODES_MAP: Record<
  string,
  { name: string; desc: string; pushSize?: number }
> = {
  '00': { name: 'STOP', desc: 'Halts execution entirely' },
  '01': { name: 'ADD', desc: 'Pops 2 items, pushes arithmetic (a + b)' },
  '02': { name: 'MUL', desc: 'Pops 2 items, pushes arithmetic (a * b)' },
  '03': { name: 'SUB', desc: 'Pops 2 items, pushes arithmetic (a - b)' },
  '14': {
    name: 'EQ',
    desc: 'Checks if two top stack values are exactly equal',
  },
  '15': {
    name: 'ISZERO',
    desc: 'Pops 1 item, evaluates if value is equal to zero',
  },
  '1c': { name: 'SHR', desc: 'Logical Shift Right operation' },
  '35': {
    name: 'CALLDATALOAD',
    desc: 'Loads a 32-byte chunk directly from calldata',
  },
  '36': {
    name: 'CALLDATASIZE',
    desc: 'Pushes total length size parameter of transaction data',
  },
  '52': {
    name: 'MSTORE',
    desc: 'Saves a 32-byte word down into target memory slot',
  },
  '56': {
    name: 'JUMP',
    desc: 'Alters code execution pointer to destination address',
  },
  '57': {
    name: 'JUMPI',
    desc: 'Conditional jump: branches path if truth check is 1',
  },
  '5b': {
    name: 'JUMPDEST',
    desc: 'Valid marker pointer target location for loop branching paths',
  },
  '5f': {
    name: 'PUSH0',
    desc: 'Pushes an empty zero value element straight onto stack frame',
  },
  '60': {
    name: 'PUSH1',
    desc: 'Pushes a 1-byte value parameter onto stack context',
    pushSize: 1,
  },
  '63': {
    name: 'PUSH4',
    desc: 'Pushes a 4-byte value (Function Selector Routing Flag)',
    pushSize: 4,
  },
  f3: {
    name: 'RETURN',
    desc: 'Halts execution loop, outputs designated memory segment data',
  },
  fd: {
    name: 'REVERT',
    desc: 'Halts execution loop, rolls back state transitions',
  },
};

/**
 * =========================================================================
 * NON-BLOCKING GENCALLS ASIO TASK ORCHESTRATOR ENGINE
 * =========================================================================
 * Upgraded to intercept Solc-optimized dispatch sequences natively.
 */
class AsioInternalWasmEngine {
  private wasmExports: any = null;
  private wasmInstance: any = null;
  constructor(compiledWasmModuleExports: any) {
    this.wasmExports = compiledWasmModuleExports;
    if (this.wasmExports && this.wasmExports.initDatabase) {
      this.wasmExports.initDatabase();
    }
  }


  public async asyncCompile(bytecode: string): Promise<string> {
    // FIXED: Explicitly return the Promise container so the caller can await the final string value
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        try {
          // 1. Destructure using modern '__liftString' for string memory extraction
          const { 
            compileBytecode, 
            __newString, 
            __liftString, 
            __pin, 
            __unpin 
          } = this.wasmExports as any;
  
          debugger;
          // // 2. Validate that the modern compiler memory bindings exist
          // if (!__newString || !compileBytecode) {
          //   throw new Error("Required WebAssembly memory allocator runtime methods are missing.");
          // }
  
          // // 3. Allocate the input string into WASM memory
          // const inputPtr = __newString(bytecode);
          
          // // 4. Pin the pointer to protect it from WebAssembly internal Garbage Collection mid-flight
          // if (typeof __pin === 'function') __pin(inputPtr);
  
          // // 5. Execute your custom compiled bytecode parsing method
          // const outputPtr = compileBytecode(inputPtr);
  
          // // 6. Lift the returned JSON token string out from WebAssembly memory spaces cleanly
          // const resultString = __liftString ? __liftString(outputPtr) : "";
  
          // // 7. Unpin the input pointer to prevent lingering memory leaks
          // if (typeof __unpin === 'function') __unpin(inputPtr);
  
          // // 8. Safely resolve the finalized parsing result
          // resolve(resultString);
  
        } catch (err) {
          console.warn("WASM execution collapsed across boundary. Falling back to native JS loop pipeline...", err);
          
          // Execute your local pure JavaScript extraction fallback module seamlessly
          resolve(this.universalBytecodeExtractor(bytecode));
        }
      }, 0);
    });
  }
  

  

  /**
   * Universal Extraction Engine: Safely handles both simple Yul PUSH4 maps
   * and complex Solc right-shift routing architectures completely offline.
   */
  private universalBytecodeExtractor(bytecode: string): string {
    let cleanHex = bytecode.startsWith('0x') ? bytecode.substring(2) : bytecode;
    let tokens = '';

    const localMap = new Map([
      ['371303c0', 'inc()'],
      ['6d4ce63c', 'get()'],
      ['b3bcfa82', 'dec()'],
      ['d4f267cb', 'tribonacciTCO(uint256)'],
    ]);

    // Strategy A: Identify standard Solc selector arrays via regex chunk matching
    // Captures occurrences where the compiler pushes a function signature for comparison
    const selectorMatches = cleanHex.match(/63([0-9a-fA-F]{8})(?:14|15|57)/g);
    const discoveredSelectors = new Set<string>();

    if (selectorMatches) {
      for (let match of selectorMatches) {
        // Isolate the true 4-byte hexadecimal substring (8 characters following '63')
        const extractedSig = match.substring(2, 10).toLowerCase();
        discoveredSelectors.add(extractedSig);
      }
    }

    // Strategy B: Fallback scan for native PUSH4 routing elements
    let i = 0;
    while (i < cleanHex.length) {
      let byte = cleanHex.substring(i, i + 2).toLowerCase();
      if (byte === '63') {
        let selectorData = cleanHex.substring(i + 2, i + 10).toLowerCase();
        if (selectorData.length === 8) {
          discoveredSelectors.add(selectorData);
        }
        i += 10;
      } else {
        i += 2;
      }
    }

    // Strategy C: Stream and cross-reference discovered sets into the core ASIO queue
    discoveredSelectors.forEach((selector) => {
      let name = localMap.get(selector) || `unknown_0x${selector}()`;
      let view =
        name.includes('get') || name.includes('tribonacci') ? '1' : '0';
      tokens += `0x${selector},${name},${view};`;
    });

    return tokens;
  }
}
// src/App.tsx (Chunk 2 of 3)

export default function App() {
  const [bytecodeHex, setBytecodeHex] = useState<string>(
    '60043610601c5760003560e01c8063371303c01460215780636d4ce63c146029578063b3bcfa82146031575b600080fd5b6001565b6002565b600356'
  );
  const [targetAddress, setTargetAddress] = useState<string>(
    '0x406e5ff58036eee55e9c11a9927943130350d3ac'
  );
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [deconstructedAsm, setDeconstructedAsm] = useState<string>('');
  const [solidityOutput, setSolidityOutput] = useState<string>('');
  const [consoleLogs, setConsoleLogs] = useState<string>('');
  const [wasmExports, setWasmExports] = useState<any>(null);
  const [wasmInstance, setWasmInstance] = useState(null);
  const fetchMethodSignature = async (selector: string): Promise<{ name: string; isView: boolean; params: string[] }> => {
    try {
      const response = await fetch(`https://openchain.xyz{selector}&filter=true`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      
      const lookupResult = data.result?.function?.[`0x${selector}`];
      if (lookupResult && lookupResult.length > 0) {
        const fullSignature = lookupResult[0].name; // e.g., "transfer(address,uint256)"
        const namePart = fullSignature.split('(')[0];
        const paramsMatch = fullSignature.match(/\((.*)\)/);
        const params = paramsMatch && paramsMatch[1] ? paramsMatch[1].split(',').map((p: string) => p.trim()) : [];
        
        // Infer visibility state rules based on standard nomenclature tokens
        const lowerName = namePart.toLowerCase();
        const isView = lowerName.startsWith('get') || lowerName.includes('balance') || lowerName.includes('owner') || lowerName.includes('view');
        
        return { name: fullSignature, isView, params };
      }
      return { name: `unknown_0x${selector}`, isView: false, params: [] };
    } catch {
      return { name: `unknown_0x${selector}`, isView: false, params: [] };
    }
  };
  // Asynchronously load the physical release.wasm file asset via raw ArrayBuffer streams
  useEffect(() => {
    const streamWasmModuleFile = async () => {
      try {
        debugger;
        const response = await fetch('build/release.wasm?t=${Date.now()}');
        if (!response.ok) throw new Error('WASM file stream request failed.');

        const bufferBytes = await response.arrayBuffer();
        const wasmModule = await WebAssembly.instantiate(bufferBytes, {
          env: {
            abort: () => {
              console.error('WebAssembly execution context aborted.');
            },
          },
        });
        const exports = wasmModule.instance.exports;
        exports.initDatabase();
        debugger;
        setWasmInstance(wasmModule.instance);
        setWasmExports(exports);
        console.log(
          '>> External physical .wasm binary file connected successfully via fetch arrays!'
        );
      } catch (e) {
        console.warn(
          '>> Static fetch blocked or file not found. Ready for native JS loop fallbacks.'
        );
      }
    };
    streamWasmModuleFile();
  }, []);

  const runGencallsCompilation = async () => {
    let rawHex = bytecodeHex.trim().replace(/^0x/, '');
    if (!rawHex) {
      setConsoleLogs(
        'Error: Please provide a valid EVM compiled bytecode sequence.'
      );
      return;
    }

    setConsoleLogs(
      '>> Initializing universal selector mining layout...\n>> Spawning non-blocking ASIO task microloops thread workers...'
    );
    
  // WebAssembly String Helper Lifters
  // Ensure 'wasmInstance' contains your loaded module exports


  const selectorList: string[] = [];
  let i = 0;
  while (i < rawHex.length) {
    const byte = rawHex.substring(i, i + 2).toLowerCase();
    if (byte === '63') {
      const selectorData = rawHex.substring(i + 2, i + 10);
      if (selectorData.length === 8) {
        selectorList.push(selectorData.toLowerCase());
      }
      i += 10;
    } else if (byte >= '60' && byte <= '7f') {
      const pushSize = parseInt(byte, 16) - 0x60 + 1;
      i += 2 + pushSize * 2;
    } else {
      i += 2;
    }
  }

  const uniqueSelectors = Array.from(new Set(selectorList));

  if (uniqueSelectors.length === 0) {
    setConsoleLogs('>> Extracted bytecode deconstruction successfully.\n>> Warning: No 4-byte selector entry markers discovered.');
    setGeneratedCode('// No valid standard method signatures exposed inside input array.');
    setSolidityOutput('');
    return;
  }

  setConsoleLogs((prev) => `${prev}\n>> Detected ${uniqueSelectors.length} function routing vectors. Resolving signatures via OpenChain API...`);

  const discoveredMethods: DiscoveredMethod[] = [];
  for (const selector of uniqueSelectors) {
    const info = await fetchMethodSignature(selector);
    discoveredMethods.push({
      selector: `0x${selector}`,
      inferredName: info.name,
      isView: info.isView,
      params: info.params
    });
  }

  setConsoleLogs((prev) => `${prev}\n>> Signatures parsed. Building Ethers.js v6 classes & Solidity interfaces...`);
  setDeconstructedAsm(deconstructBytecode(rawHex));
  setGeneratedCode(buildEthersClass(discoveredMethods));
  setSolidityOutput(buildSolidityContract(discoveredMethods));
  setConsoleLogs((prev) => `${prev}\n>> SUCCESS: Universal compilation and verification complete!`);
};

  function liftString(ptr: number, memory: WebAssembly.Memory): string {
  if (!ptr) return "";

  const buffer = memory.buffer;
  const U32 = new Uint32Array(buffer);

  // Length in bytes stored 4 bytes before the pointer
  const totalByteLength = U32[(ptr - 4) >>> 2];
  const totalChars = totalByteLength >>> 1; // UTF-16 chars

  const U16 = new Uint16Array(buffer);
  const start = ptr >>> 1; // characters start here
  const end = start + totalChars;
 
  let result = "";
  let pos = start;
  while (end - pos > 1024) {
    for (let index = pos; index <  pos + 1024; index++) {
      if(U16[index] == 0) {
        U16[index] = 80
      }
    }      
    result += String.fromCharCode(...U16.subarray(pos, pos += 1024));
  }
  result += String.fromCharCode(...U16.subarray(pos, end));
  return result;
}

  function readString(pointer, memoryExports) {
    if (!pointer) return '';
    const buffer = memoryExports.memory.buffer;
    const end = (pointer + new Uint32Array(buffer)[(pointer - 4) >>> 2]) >>> 1;
    const U16 = new Uint16Array(buffer);
    let start = pointer >>> 1, out = '';
    while (end - start > 1024) out += String.fromCharCode(...U16.subarray(start, start += 1024));
    return out + String.fromCharCode(...U16.subarray(start, end));
  }

  const deconstructBytecode = (hex: string): string => {
    const lines: string[] = [];
    lines.push("; =========================================================");
    lines.push("; STANDALONE FILE-BASED EXTERNAL WASM DECOMPILER ASSEMBLY BREAKDOWN");
    lines.push("; =========================================================\n");
  
    if (!wasmInstance) {
      setConsoleLogs("Error: WebAssembly execution module has not finished loading yet.");
      return "Error: WebAssembly execution module has not finished loading yet.";
    }
  
    let rawHex = hex.trim().replace(/^0x/, "");
    if (!rawHex) {
      return "Error: Please provide a valid EVM compiled bytecode sequence.";
    }
  
    try {
      const { compileBytecode, allocateWasmString, __pin, __unpin, memory } =
        wasmInstance.exports as any;
  
      if (!allocateWasmString || !compileBytecode) {
        throw new Error("Core WASM decompiler hooks are missing from exports.");
      }
  
      // Allocate space for the string
      const inputPtr = allocateWasmString(rawHex.length);
      if (!inputPtr) {
        throw new Error("WebAssembly failed to allocate a memory pointer for the input string.");
      }
  
      // Write characters into WASM memory
      const U16 = new Uint16Array(memory.buffer);
      const startOffset = (inputPtr >>> 1) + 2; // skip length header
      for (let i = 0; i < rawHex.length; ++i) {
        U16[startOffset + i] = rawHex.charCodeAt(i);
      }
  
      // Pin pointer
      __pin(inputPtr);
  
      // Call WASM
      const resultPtr = compileBytecode(inputPtr);
  
      // ✅ Manual string lifting (no __getString)
      const rawJsonResult = liftString(resultPtr, memory);
  
      // Unpin
      __unpin(inputPtr);
  
      // Parse tokens
      interface WasmToken {
        pc: number;
        name: string;
        opcode: string;
        desc: string;
        pushData?: string;
      }
      const tokens: WasmToken[] = JSON.parse(rawJsonResult || "[]");
  
      // Reassemble report
      tokens.forEach((tok) => {
        const pcStr = `[PC:${String(tok.pc).padStart(3, "0")}]`;
        if (tok.pushData && tok.pushData.length > 0) {
          lines.push(`${pcStr} ${tok.name.padEnd(12)} 0x${tok.pushData.padEnd(8)} ; ${tok.desc}`);
        } else {
          lines.push(`${pcStr} ${tok.name.padEnd(23)} ; ${tok.desc}`);
        }
      });
  
      return lines.join("\n");
    } catch (err: any) {
      console.error("WASM cross-boundary execution failed:", err);
      return `; [DECOMPILATION FAULT]: Cross-boundary evaluation collapsed.\n; Reason: ${err.message}`;
    }
  };
    
  
  

  const mapSolidityTypeToTs = (solidityType: string): string => {
    if (solidityType.startsWith('uint') || solidityType.startsWith('int'))
      return 'bigint | number';
    if (solidityType === 'bool') return 'boolean';
    if (solidityType === 'address') return 'string';
    return 'string | Uint8Array';
  };

  const buildEthersClass = (methods: DiscoveredMethod[]): string => {
    const methodsBlock = methods
      .map((m) => {
        const tsArgs = m.params
          .map((t, idx) => `param${idx}: ${mapSolidityTypeToTs(t)}`)
          .join(', ');
        const callDataPayload =
          m.params.length > 0
            ? `ethers.solidityPackedEncoder([${m.params
                .map((t) => `"${t}"`)
                .join(', ')}], [${m.params
                .map((_, idx) => `param${idx}`)
                .join(', ')}])`
            : `''`;

        return `  public async ${
          m.inferredName.split('(')[0]
        }(${tsArgs}): Promise<any> {\n    if (!this.runner.call) throw new Error("Attached provider missing read runner capabilities.");\n    const encodedParams = ${callDataPayload};\n    const fullData = '${
          m.selector
        }' + encodedParams.replace(/^0x/, '');\n    const rawResult = await this.runner.${
          m.isView ? 'call' : 'sendTransaction'
        }({ to: this.address, data: fullData });\n    return rawResult;\n  }`;
      })
      .join('\n\n');

    return `import { ethers, ContractRunner } from 'ethers';\n\nexport class BytecodeGeneratedContract {\n  constructor(public readonly address: string, private runner: ContractRunner) {}\n\n${methodsBlock}\n}`;
  };

  const buildSolidityContract = (methods: DiscoveredMethod[]): string => {
    const functionStubs = methods
      .map((m) => {
        const solidityParams = m.params
          .map((t, idx) => `${t} param${idx}`)
          .join(', ');
        const signature = m.isView
          ? 'external view returns (bytes memory)'
          : 'external';
        return `    /**\n     * @dev Dispatch signature for selector ${
          m.selector
        }\n     */\n    function ${
          m.inferredName.split('(')[0]
        }(${solidityParams}) ${signature} {\n        // TODO: Map in-place stack mutations\n    }`;
      })
      .join('\n\n');

    return `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.24;\n\ncontract DecompiledYulContract {\n\n${functionStubs}\n}`;
  };

  const downloadSourceFile = (filename: string, textContent: string) => {
    if (!textContent) return;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  // src/App.tsx (Chunk 3 of 3)

  // Unified System Clipboard Action Hook
  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert('Code template successfully copied to clipboard system memory!');
  };

  // Custom Inline Regex Syntax Highlighting Lexer Engine
  const renderHighlightedSolidity = (text: string) => {
    if (!text)
      return (
        <span style={{ color: '#9CA3AF' }}>
          // Click compiler action block to analyze inputs...
        </span>
      );

    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      // 1. Structural Global Comments Match
      if (
        line.trim().startsWith('//') ||
        line.trim().startsWith('*') ||
        line.trim().startsWith('/*')
      ) {
        return (
          <div key={lIdx} style={{ color: '#6B7280', fontFamily: 'monospace' }}>
            {line}
          </div>
        );
      }

      const words = line.split(/(\s+|\(|\)|\{|\}|;|,)/);
      const elements = words.map((word, wIdx) => {
        // 2. Structural High-Level Syntax Pragmas and Keywords
        if (
          /^(pragma|solidity|contract|function|external|view|returns|import|public|async|class|return)$/.test(
            word
          )
        ) {
          return (
            <span key={wIdx} style={{ color: '#4F46E5', fontWeight: 'bold' }}>
              {word}
            </span>
          );
        }
        // 3. Application System Core Data Variable Types
        if (
          /^(uint256|bytes|memory|string|address|bool|bigint|Promise)$/.test(
            word
          )
        ) {
          return (
            <span key={wIdx} style={{ color: '#059669', fontWeight: 'bold' }}>
              {word}
            </span>
          );
        }
        // 4. Hexadecimal Functional Identification Signatures
        if (/^0x[0-9a-fA-F]+$/.test(word)) {
          return (
            <span
              key={wIdx}
              style={{ color: '#D97706', fontFamily: 'monospace' }}
            >
              {word}
            </span>
          );
        }
        // 5. Encapsulated Application String Literals
        if (/^(".*"|'.*'|`.*`)$/.test(word)) {
          return (
            <span key={wIdx} style={{ color: '#DC2626' }}>
              {word}
            </span>
          );
        }
        return <span key={wIdx}>{word}</span>;
      });

      return (
        <div key={lIdx} style={{ minHeight: '1.5em', fontFamily: 'monospace' }}>
          {elements}
        </div>
      );
    });
  };

  return (
    <div
      style={{
        padding: '24px',
        maxWidth: '1400px',
        margin: '20px auto',
        fontFamily: 'sans-serif',
        backgroundColor: '#F9FAFB',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
      }}
    >
      {/* Primary Header Segment */}
      <div
        style={{
          borderBottom: '1px solid #E5E7EB',
          paddingBottom: '12px',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ margin: '0 0 4px 0', color: '#111827' }}>
          Gencalls Standalone Web Decompiler Workspace
        </h2>
        <p style={{ margin: 0, color: '#6B7280', fontSize: '13px' }}>
          Deconstruct EVM bytecode structures offline utilizing an external
          `.wasm` file database driven by non-blocking ASIO loops
        </p>
      </div>

      {/* Main Structural Layout Content Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: '24px',
        }}
      >
        {/* Left Side: Parameters, Inputs, and Assembly Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#4B5563',
                marginBottom: '6px',
              }}
            >
              CONTRACT BLOCKCHAIN TARGET ADDRESS
            </label>
            <input
              type="text"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              style={{
                width: '94%',
                padding: '8px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#4B5563',
                marginBottom: '6px',
              }}
            >
              EVM RUNTIME BYTECODE VECTOR (HEX DATA)
            </label>
            <textarea
              rows={5}
              value={bytecodeHex}
              onChange={(e) => setBytecodeHex(e.target.value)}
              style={{
                width: '94%',
                padding: '8px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '11px',
                resize: 'none',
              }}
            />
          </div>

          <button
            onClick={runGencallsCompilation}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#4F46E5',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Run Async WASM Decompiler
          </button>

          {consoleLogs && (
            <div
              style={{
                padding: '12px',
                backgroundColor: '#111827',
                color: '#10B981',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '11px',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.4',
              }}
            >
              {consoleLogs}
            </div>
          )}

          {deconstructedAsm && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#4B5563',
                  marginBottom: '6px',
                }}
              >
                ANNOTATED LOW-LEVEL ASSEMBLY STREAM BREAKDOWN
              </label>
              <div
                style={{
                  height: '260px',
                  overflowY: 'scroll',
                  padding: '12px',
                  backgroundColor: '#1F2937',
                  color: '#F3F4F6',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  whiteSpace: 'pre',
                  lineHeight: '1.5',
                }}
              >
                {deconstructedAsm}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Reconstructed Visual Code Models */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Reconstructed Solidity Interface */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px',
              }}
            >
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#4B5563',
                }}
              >
                RECONSTRUCTED SOLIDITY STRUCTURAL MODEL
              </label>
              {solidityOutput && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => copyToClipboard(solidityOutput)}
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      cursor: 'pointer',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      backgroundColor: '#FFF',
                    }}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() =>
                      downloadSourceFile(
                        'DecompiledContract.sol',
                        solidityOutput
                      )
                    }
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      cursor: 'pointer',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      backgroundColor: '#FFF',
                    }}
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
            <div
              style={{
                width: '96%',
                height: '180px',
                overflowY: 'auto',
                padding: '12px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '11px',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
              }}
            >
              {renderHighlightedSolidity(solidityOutput)}
            </div>
          </div>

          {/* Reconstructed EthersJS Class Module */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px',
              }}
            >
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#4B5563',
                }}
              >
                AUTO-GENERATED ETHERS.JS V6 CLIENT MODULE
              </label>
              {generatedCode && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => copyToClipboard(generatedCode)}
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      cursor: 'pointer',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      backgroundColor: '#FFF',
                    }}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() =>
                      downloadSourceFile('contract-interface.ts', generatedCode)
                    }
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      cursor: 'pointer',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      backgroundColor: '#FFF',
                    }}
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
            <div
              style={{
                width: '96%',
                height: '320px',
                overflowY: 'auto',
                padding: '12px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '11px',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
              }}
            >
              {renderHighlightedSolidity(generatedCode)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
