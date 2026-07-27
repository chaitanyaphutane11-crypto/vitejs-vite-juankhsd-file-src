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
}

// Compile bytecode: tokenize into structured JSON
export function compileBytecode(bytecode: string): string {
  let i = 0;
  let results: string[] = [];

  while (i < bytecode.length) {
    let opcode = bytecode.substr(i, 2);
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
