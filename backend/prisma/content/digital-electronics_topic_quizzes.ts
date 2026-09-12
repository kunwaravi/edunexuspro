/**
 * Digital Electronics — Logic to Digital Systems — per-topic quizzes.
 * Keyed by the EXACT topic titles in digital-electronics.ts (topic-lock flow).
 * 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in digital-electronics.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'Why Digital — The World of 0s and 1s': [
    { text: 'Digital systems work with…', options: ['two robust states: 0 and 1', 'ten states', 'one state', 'an infinite voltage range'], correctAnswer: 'two robust states: 0 and 1' },
    { text: 'The noise margin is…', options: ['the dead zone between the LOW and HIGH bands', 'the wire length', 'the clock speed', 'the power supply'], correctAnswer: 'the dead zone between the LOW and HIGH bands' },
    { text: 'In 5 V TTL, HIGH is roughly…', options: ['2.4 V and above', '0.8 V and below', 'exactly 3.3 V', 'anything'], correctAnswer: '2.4 V and above' },
    { text: 'The reason digital beats analog is…', options: ['noise has to be huge to flip a bit', 'it is cheaper always', 'it uses more power', 'it is faster always'], correctAnswer: 'noise has to be huge to flip a bit' },
  ],
  'Binary Numbers — Counting in Base 2': [
    { text: 'Binary is base…', options: ['2', '8', '10', '16'], correctAnswer: '2' },
    { text: '1010₂ equals…', options: ['10', '12', '5', '1010'], correctAnswer: '10' },
    { text: '1100₂ equals…', options: ['12', '9', '14', '3'], correctAnswer: '12' },
    { text: 'The next number after 111₂ is…', options: ['1000₂', '1001₂', '112₂', '121₂'], correctAnswer: '1000₂' },
  ],
  'Octal & Hexadecimal — Binary in Short Hand': [
    { text: 'One hex digit represents…', options: ['4 bits', '3 bits', '8 bits', '1 bit'], correctAnswer: '4 bits' },
    { text: '0xAC in binary is…', options: ['1010 1100', '1100 1010', '1010 1110', '1111 1111'], correctAnswer: '1010 1100' },
    { text: 'The hex digit for 15 is…', options: ['F', 'E', 'G', '15'], correctAnswer: 'F' },
    { text: 'Octal groups binary in…', options: ['threes', 'fours', 'eights', 'twos'], correctAnswer: 'threes' },
  ],
  "Conversions, Two's Complement & Why It Matters": [
    { text: 'To convert decimal to binary you…', options: ['divide by 2 and read remainders bottom-up', 'multiply by 2', 'count to ten', 'guess'], correctAnswer: 'divide by 2 and read remainders bottom-up' },
    { text: "Two's complement is formed by…", options: ['flipping all bits and adding 1', 'adding 1 and flipping', 'subtracting 1', 'nothing'], correctAnswer: 'flipping all bits and adding 1' },
    { text: 'In 8-bit two\'s complement, 0xFF is…', options: ['-1', '255', '0', '127'], correctAnswer: '-1' },
    { text: 'Two\'s complement makes subtraction work because…', options: ['the hardware adds normally — signs are invisible to it', 'it doubles precision', 'it is always positive', 'it is slower'], correctAnswer: 'the hardware adds normally — signs are invisible to it' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'The Basic Gates — AND, OR, NOT': [
    { text: 'The AND gate outputs 1 only when…', options: ['all inputs are 1', 'any input is 1', 'no input is 1', 'inputs differ'], correctAnswer: 'all inputs are 1' },
    { text: 'The OR gate outputs 1 when…', options: ['any input is 1', 'all inputs are 1', 'no input is 1', 'inputs match'], correctAnswer: 'any input is 1' },
    { text: 'The NOT gate…', options: ['inverts the input', 'doubles it', 'adds 1', 'keeps it'], correctAnswer: 'inverts the input' },
    { text: 'For two inputs a truth table has…', options: ['4 rows', '2 rows', '8 rows', '16 rows'], correctAnswer: '4 rows' },
  ],
  'NAND & NOR — The Universal Gates': [
    { text: 'NAND is…', options: ['AND followed by NOT', 'OR followed by NOT', 'XOR', 'NOT only'], correctAnswer: 'AND followed by NOT' },
    { text: 'NAND outputs 0 only when…', options: ['all inputs are 1', 'all inputs are 0', 'any input is 1', 'inputs differ'], correctAnswer: 'all inputs are 1' },
    { text: 'NOR is universal because…', options: ['any logic circuit can be built from NORs alone', 'it is the fastest gate', 'it uses no power', 'it is the simplest'], correctAnswer: 'any logic circuit can be built from NORs alone' },
    { text: 'To build NOT from a NAND you…', options: ['tie the inputs together', 'add a resistor', 'invert the output', 'use two NANDs in series'], correctAnswer: 'tie the inputs together' },
  ],
  'XOR, XNOR & Useful Combinational Patterns': [
    { text: 'XOR outputs 1 when…', options: ['the inputs differ', 'the inputs match', 'both are 1', 'both are 0'], correctAnswer: 'the inputs differ' },
    { text: 'XNOR outputs 1 when…', options: ['the inputs match', 'the inputs differ', 'both are 0', 'both are 1'], correctAnswer: 'the inputs match' },
    { text: 'The sum bit of an adder is…', options: ['A ⊕ B', 'A · B', 'A + B', 'Ā'], correctAnswer: 'A ⊕ B' },
    { text: 'A chain of XORs is used to…', options: ['generate parity', 'drive a 7-segment display', 'make a register', 'divide frequency'], correctAnswer: 'generate parity' },
  ],
  "Boolean Algebra & De Morgan's Law": [
    { text: 'A · (B + C) simplifies to…', options: ['A·B + A·C', 'A·B·C', 'A + B + C', 'B + C'], correctAnswer: 'A·B + A·C' },
    { text: 'A·B overline equals…', options: ['Ā + B̄', 'Ā · B̄', 'A·B', 'A+B'], correctAnswer: 'Ā + B̄' },
    { text: 'A + Ā equals…', options: ['1', '0', 'A', 'Ā'], correctAnswer: '1' },
    { text: 'Simplification matters because…', options: ['fewer gates means less cost and power', 'it makes truth tables longer', 'it hides bugs', 'it is required'], correctAnswer: 'fewer gates means less cost and power' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Combinational vs Sequential — A First Distinction': [
    { text: 'A combinational output depends…', options: ['only on current inputs', 'on past state', 'on the clock', 'on memory'], correctAnswer: 'only on current inputs' },
    { text: 'A sequential output depends…', options: ['on inputs AND past state', 'only on inputs', 'only on nothing', 'on the moon'], correctAnswer: 'on inputs AND past state' },
    { text: 'An example of a combinational circuit is…', options: ['an adder', 'a counter', 'a flip-flop', 'a register'], correctAnswer: 'an adder' },
    { text: 'The clock is what gives sequential circuits…', options: ['memory and timing', 'speed', 'power', 'noise'], correctAnswer: 'memory and timing' },
  ],
  'Adders — Half Adders & Full Adders': [
    { text: 'A half adder produces…', options: ['Sum = A ⊕ B, Carry = A·B', 'Sum = A·B, Carry = A⊕B', 'Sum = A+B, Carry = 0', 'nothing'], correctAnswer: 'Sum = A ⊕ B, Carry = A·B' },
    { text: 'A full adder adds…', options: ['two bits plus a carry-in', 'two bits only', 'one bit', 'four bits'], correctAnswer: 'two bits plus a carry-in' },
    { text: 'A ripple-carry adder is…', options: ['full adders chained, each passing its carry', 'a single gate', 'a counter', 'a mux'], correctAnswer: 'full adders chained, each passing its carry' },
    { text: 'Ripple carry is slow because…', options: ['the carry must propagate through every stage', 'it uses XOR', 'it has no clock', 'it is too big'], correctAnswer: 'the carry must propagate through every stage' },
  ],
  'Multiplexers & Demultiplexers — Signal Routing': [
    { text: 'A 2-to-1 mux equation is…', options: ['Y = (S̄·A) + (S·B)', 'Y = A ⊕ B', 'Y = A·B', 'Y = A + B'], correctAnswer: 'Y = (S̄·A) + (S·B)' },
    { text: 'With n select lines a mux can pick among…', options: ['2ⁿ inputs', 'n inputs', 'n² inputs', '10 inputs'], correctAnswer: '2ⁿ inputs' },
    { text: 'A 4:1 mux can implement…', options: ['any 2-input function', 'only adders', 'only NOT', 'nothing'], correctAnswer: 'any 2-input function' },
    { text: 'A demultiplexer…', options: ['routes one input to one of many outputs', 'combines many inputs', 'adds bits', 'counts'], correctAnswer: 'routes one input to one of many outputs' },
  ],
  'Decoders, Encoders & 7-Segment Drivers': [
    { text: 'A 2-to-4 decoder activates…', options: ['exactly one of four outputs', 'all outputs', 'two outputs', 'none'], correctAnswer: 'exactly one of four outputs' },
    { text: 'An encoder converts…', options: ['many lines into a binary code', 'a binary code into one-hot', 'analog to digital', 'power to heat'], correctAnswer: 'many lines into a binary code' },
    { text: 'A priority encoder handles…', options: ['multiple active inputs by choosing the highest priority', 'no inputs', 'analog signals', 'only one output'], correctAnswer: 'multiple active inputs by choosing the highest priority' },
    { text: 'The 7-segment driver converts…', options: ['BCD digits to segment patterns', 'binary to octal', 'gates to muxes', 'nothing'], correctAnswer: 'BCD digits to segment patterns' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Latches & Flip-Flops — The Memory Cells': [
    { text: 'An SR latch built from cross-coupled gates…', options: ['holds a bit until set or reset', 'always outputs 0', 'adds bits', 'counts clocks'], correctAnswer: 'holds a bit until set or reset' },
    { text: 'A D flip-flop captures its input…', options: ['on the clock edge', 'whenever the input changes', 'never', 'on power up'], correctAnswer: 'on the clock edge' },
    { text: 'Edge-triggered means…', options: ['data is captured at the instant of the edge', 'data is captured all the time', 'no data is captured', 'data flows freely'], correctAnswer: 'data is captured at the instant of the edge' },
    { text: 'The forbidden SR-latch input is…', options: ['S=1, R=1', 'S=0, R=0', 'S=1, R=0', 'S=0, R=1'], correctAnswer: 'S=1, R=1' },
  ],
  'Registers & Shift Registers': [
    { text: 'A register is…', options: ['flip-flops sharing one clock to store a word', 'a single flip-flop', 'a counter', 'a decoder'], correctAnswer: 'flip-flops sharing one clock to store a word' },
    { text: 'A shift register moves bits…', options: ['one position per clock', 'two positions per clock', 'randomly', 'never'], correctAnswer: 'one position per clock' },
    { text: 'SIPO conversion…', options: ['turns a serial bitstream into parallel data', 'turns parallel into serial', 'adds bits', 'divides frequency'], correctAnswer: 'turns a serial bitstream into parallel data' },
    { text: 'Shifting left in binary…', options: ['multiplies by 2', 'divides by 2', 'adds 1', 'negates'], correctAnswer: 'multiplies by 2' },
  ],
  'Counters — Counting with Flip-Flops': [
    { text: 'A 4-bit binary counter counts…', options: ['0 to 15 then wraps', '0 to 99', '0 to 4', '1 to 16 then stops'], correctAnswer: '0 to 15 then wraps' },
    { text: 'A Mod-10 counter…', options: ['counts 0 to 9 then resets', 'counts 0 to 15', 'counts down', 'never resets'], correctAnswer: 'counts 0 to 9 then resets' },
    { text: 'Each counter stage halves the frequency, so a 4-bit counter divides by…', options: ['16', '4', '8', '2'], correctAnswer: '16' },
    { text: 'A counter driven by a fast clock with a preset terminal count can…', options: ['generate a precise 1-second pulse', 'store a register', 'decode a mux', 'drive a display directly'], correctAnswer: 'generate a precise 1-second pulse' },
  ],
  'From Counters to State Machines': [
    { text: 'A finite state machine has…', options: ['state memory, next-state logic and output logic', 'only inputs', 'only an adder', 'no clock'], correctAnswer: 'state memory, next-state logic and output logic' },
    { text: 'In a Moore machine the outputs depend…', options: ['only on the state', 'on state and inputs', 'only on inputs', 'on nothing'], correctAnswer: 'only on the state' },
    { text: 'In a Mealy machine the outputs depend…', options: ['on state AND inputs', 'only on the state', 'only on inputs', 'on nothing'], correctAnswer: 'on state AND inputs' },
    { text: 'The design method starts with…', options: ['a state diagram', 'the wiring', 'the chips', 'the power supply'], correctAnswer: 'a state diagram' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Karnaugh Maps — Simplification by Eye': [
    { text: 'A K-map group must be…', options: ['a rectangle of 1, 2, 4, 8… cells', 'any shape', 'exactly 3 cells', 'a diagonal'], correctAnswer: 'a rectangle of 1, 2, 4, 8… cells' },
    { text: 'A 4-cell group in a 4-variable map eliminates…', options: ['two variables', 'one variable', 'three variables', 'none'], correctAnswer: 'two variables' },
    { text: 'The K-map grid wraps around because…', options: ['opposite edges are adjacent', 'it is circular', 'it is a circle', 'of the colour coding'], correctAnswer: 'opposite edges are adjacent' },
    { text: 'Beyond five variables you switch to…', options: ['the Quine–McCluskey algorithm', 'guessing', 'a bigger map', 'De Morgan'], correctAnswer: 'the Quine–McCluskey algorithm' },
  ],
  'Putting It Together — A Digital System Project': [
    { text: 'The project\'s chain is…', options: ['debounced clock → counter → decoder → display', 'mux → adder → register', 'gates only', 'no clock'], correctAnswer: 'debounced clock → counter → decoder → display' },
    { text: 'The classic display driver for a BCD counter is…', options: ['the 74LS47 decoder', 'a shift register', 'a 555', 'an FPGA'], correctAnswer: 'the 74LS47 decoder' },
    { text: 'The right build order is…', options: ['clock → counter → decoder/display → debounce', 'display → decoder → counter → clock', 'all at once', 'counter first'], correctAnswer: 'clock → counter → decoder/display → debounce' },
    { text: 'The counter\'s natural 4-bit output drives…', options: ['the LEDs and then the decoder', 'the 555', 'the button', 'nothing'], correctAnswer: 'the LEDs and then the decoder' },
  ],
  'Implementation Realities — Fan-out, Propagation, Noise': [
    { text: 'Propagation delay is…', options: ['the time from input change to output settling', 'the fan-out', 'the noise margin', 'the clock period'], correctAnswer: 'the time from input change to output settling' },
    { text: 'Fan-out is…', options: ['how many gate inputs one output can drive', 'the number of gates in a path', 'the wire length', 'the power'], correctAnswer: 'how many gate inputs one output can drive' },
    { text: 'To make the clock safe you must…', options: ['keep the period longer than the longest path', 'add more gates', 'raise the voltage', 'add decoupling only'], correctAnswer: 'keep the period longer than the longest path' },
    { text: 'Every IC should have…', options: ['a 100 nF decoupling capacitor at its power pin', 'a long wire', 'no ground', 'a pull-up always'], correctAnswer: 'a 100 nF decoupling capacitor at its power pin' },
  ],
  'From Gates to a Career Path': [
    { text: 'The mental model of all digital systems is…', options: ['combinational logic + flip-flops + a clock', 'only gates', 'only memory', 'only wiring'], correctAnswer: 'combinational logic + flip-flops + a clock' },
    { text: 'The text language for designing chips is…', options: ['VHDL or Verilog', 'Python', 'HTML', 'SQL'], correctAnswer: 'VHDL or Verilog' },
    { text: 'An FPGA lets you…', options: ['redefine the logic on the chip', 'only count', 'only drive displays', 'only add'], correctAnswer: 'redefine the logic on the chip' },
    { text: 'The natural progression after this course is…', options: ['HDL → FPGA → microcontrollers → VLSI', 'stopping', 'only bigger truth tables', 'only soldering'], correctAnswer: 'HDL → FPGA → microcontrollers → VLSI' },
  ],
};
