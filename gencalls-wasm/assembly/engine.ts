// engine.ts
// AssemblyScript source to compile into release.wasm

// Define a simple opcode record
class Opcode {
  name: string;
  desc: string;
  pushSize: i32;

  constructor(name: string, desc: string, pushSize: i32 = 0) {
    this.name = name;
    this.desc = desc;
    this.pushSize = pushSize;
  }
}

// Global opcode map
let OPCODES_MAP = new Map<string,Opcode>();

// Initialize database
export function initDatabase(): void {
  OPCODES_MAP.set("00", new Opcode("STOP", "Halts execution entirely"));
  OPCODES_MAP.set("01", new Opcode("ADD", "Pops 2 items, pushes arithmetic (a + b)"));
  OPCODES_MAP.set("02", new Opcode("MUL", "Pops 2 items, pushes arithmetic (a * b)"));
  OPCODES_MAP.set("03", new Opcode("SUB", "Pops 2 items, pushes arithmetic (a - b)"));
  OPCODES_MAP.set("14", new Opcode("EQ", "Checks if two top stack values are exactly equal"));
  OPCODES_MAP.set("15", new Opcode("ISZERO", "Pops 1 item, evaluates if value is equal to zero"));
  OPCODES_MAP.set("1c", new Opcode("SHR", "Logical Shift Right operation"));
  OPCODES_MAP.set("35", new Opcode("CALLDATALOAD", "Loads a 32-byte chunk directly from calldata"));
  OPCODES_MAP.set("36", new Opcode("CALLDATASIZE", "Pushes total length size parameter of transaction data"));
  OPCODES_MAP.set("52", new Opcode("MSTORE", "Saves a 32-byte word down into target memory slot"));
  OPCODES_MAP.set("56", new Opcode("JUMP", "Alters code execution pointer to destination address"));
  OPCODES_MAP.set("57", new Opcode("JUMPI", "Conditional jump: branches path if truth check is 1"));
  OPCODES_MAP.set("5b", new Opcode("JUMPDEST", "Valid marker pointer target location for loop branching paths"));
  OPCODES_MAP.set("5f", new Opcode("PUSH0", "Pushes an empty zero value element straight onto stack frame"));
  OPCODES_MAP.set("60", new Opcode("PUSH1", "Pushes a 1-byte value parameter onto stack context", 1));
  OPCODES_MAP.set("63", new Opcode("PUSH4", "Pushes a 4-byte value (Function Selector Routing Flag)", 4));
  OPCODES_MAP.set("f3", new Opcode("RETURN", "Halts execution loop, outputs designated memory segment data"));
  OPCODES_MAP.set("fd", new Opcode("REVERT", "Halts execution loop, rolls back state transitions"));

  // POP
  OPCODES_MAP.set("50", new Opcode("POP", "Removes top element from active stack context"));

  // SWAP1–SWAP16
  for (let n: i32 = 1; n <= 16; n++) {
    let hex = (0x8f + n).toString(16); // 0x90 = SWAP1 up to 0x9f = SWAP16
    OPCODES_MAP.set(hex, new Opcode("SWAP" + n.toString(), "Swaps position order of 1st and " + (n+1).toString() + "th stack items"));
  }

  // DUP1–DUP16
  for (let n: i32 = 1; n <= 16; n++) {
    let hex = (0x7f + n).toString(16); // 0x80 = DUP1 up to 0x8f = DUP16
    OPCODES_MAP.set(hex, new Opcode("DUP" + n.toString(), "Duplicates the " + n.toString() + "th stack item"));
  }

  // PUSH2–PUSH32
  for (let n: i32 = 2; n <= 32; n++) {
    let hex = (0x5f + n).toString(16); // 0x61 = PUSH2 up to 0x7f = PUSH32
    OPCODES_MAP.set(hex, new Opcode("PUSH" + n.toString(), "Pushes a " + n.toString() + "-byte value onto stack", n));
  }

  // LOG0–LOG4
  for (let n: i32 = 0; n <= 4; n++) {
    let hex = (0xa0 + n).toString(16);
    OPCODES_MAP.set(hex, new Opcode("LOG" + n.toString(), "Append log record with " + n.toString() + " topics"));
  }

  // INVALID
  OPCODES_MAP.set("fe", new Opcode("INVALID", "Triggers hardware execution panic abort condition"));
}

// Compile bytecode: tokenize into structured JSON
export function compileBytecode(bytecode: string): string {
  let i = 0;
  let results: string[] = [];

  while (i < bytecode.length) {
    let opcode = bytecode.substr(i, 2).toLowerCase();
    i += 2;

    let entry = OPCODES_MAP.has(opcode) ? OPCODES_MAP.get(opcode) : null;
    if (entry === null) {
      results.push(`{"opcode":"${opcode}","name":"UNKNOWN","desc":"Unknown opcode"}`);
      continue;
    }

    let pushData = "";
    if (entry.pushSize > 0) {
      pushData = bytecode.substr(i, entry.pushSize * 2);
      i += entry.pushSize * 2;
    }

    results.push(
      `{"opcode":"${opcode}","name":"${entry.name}","desc":"${entry.desc}","pushData":"${pushData}"}`
    );
  }

  return "[" + results.join(",") + "]";
}

// =========================================================
// String allocator + preservation hook
// =========================================================

export function allocateWasmString(len: i32): i32 {
  let size = usize(len) << 1; 
  return i32(__new(size, 1)); // ID 1 = String Class Object
}

export function _compilerPreserveHook(): void {
  let ptr = allocateWasmString(1);
  if (ptr > 0) {
    let str = "test";
    str.length;
  }
}
