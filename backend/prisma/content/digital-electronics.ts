/**
 * Digital Electronics — Logic to Digital Systems — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in digital-electronics_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Number Systems & the Digital World ──────────────────────────────
  {
    week: 1,
    title: 'Number Systems & the Digital World',
    description: 'How computers think in 0s and 1s, and how to move between number systems fluently.',
    topics: [
      {
        title: 'Why Digital — The World of 0s and 1s',
        text: 'Digital systems work with two states: 0 and 1, LOW and HIGH, off and on. Two states are robust — noise has to move a signal far to flip it, unlike an analog value where any disturbance changes it.\n\nThe building block is the bit — a binary digit. Eight bits make a byte. The convention matters: 0 V to about 0.8 V reads as LOW (0), and about 2.4 V to 5 V reads as HIGH (1) in TTL logic. The dead zone between them is noise margin.\n\nEverything a computer does — numbers, text, images, sound — is ultimately a stream of bits. This module makes that concrete.',
        code: '// A byte is 8 bits: the range of one byte\n// 0000 0000 (0)  …  1111 1111 (255)\n\n// Text: each character is a code\n// ASCII "A" = 65 = 0100 0001\n\n// Voltage bands (5 V TTL)\nLOW  = 0.0 V – 0.8 V   (reads as 0)\nHIGH = 2.4 V – 5.0 V   (reads as 1)\n// Between 0.8 V and 2.4 V is a forbidden zone',
        note: 'Digital = two states with noise margin. Bits are the atoms; bytes are the building bricks.',
      },
      {
        title: 'Binary Numbers — Counting in Base 2',
        text: 'Binary is base 2: only 0 and 1, and each place is a power of two (1, 2, 4, 8, 16, 32, 64, 128…). To read a binary number, add the place values of the 1-bits.\n\nExample: 1010₂ = 8 + 2 = 10₁₀. 1100₂ = 8 + 4 = 12₁₀. 255₁₀ = 1111 1111₂.\n\nCounting up in binary: 0, 1, 10, 11, 100, 101, 110, 111, 1000… After 1 comes 10 (two), then 11 (three), then 100 (four). Memorize the powers of two — they appear everywhere in hardware.',
        code: '// Powers of two\n2⁰ 1 · 2¹ 2 · 2² 4 · 2³ 8 · 2⁴ 16 · 2⁵ 32 · 2⁶ 64 · 2⁷ 128\n\n// Read: add the places of the 1-bits\n1010₂ = 8 + 2 = 10\n1100₂ = 8 + 4 = 12\n1111 1111₂ = 255\n\n// Count up in binary\n0, 1, 10, 11, 100, 101, 110, 111, 1000…',
        note: 'Binary is base 2 with powers of two. 1010₂ is 10 — the pattern is add the set places.',
      },
      {
        title: 'Octal & Hexadecimal — Binary in Short Hand',
        text: 'Binary strings get long fast. Octal is base 8 (3 bits per digit); hexadecimal is base 16 (4 bits per digit) — and since 4 bits map perfectly to one hex digit, hex is the standard shorthand.\n\nHex digits: 0–9 and A–F for 10–15. 0xF = 15, 0x10 = 16, 0xFF = 255. Group binary in fours from the right: 1010 1100₂ = 0xAC.\n\nOctal groups in threes: 101 100₂ = 54₈. Memory addresses, register values and error codes are almost always printed in hex.',
        code: '// Hex: 4 bits → 1 digit\n0000=0 0001=1 0010=2 0011=3 0100=4\n0101=5 0110=6 0111=7 1000=8 1001=9\n1010=A 1011=B 1100=C 1101=D 1110=E 1111=F\n\n// Group binary in fours from the right\n1010 1100₂ = 0xAC\n1111 1111₂ = 0xFF = 255\n\n// Octal: group in threes\n101 100₂ = 54₈',
        note: 'Hex is binary in groups of four. One glance at 0xAC beats squinting at 10101100.',
      },
      {
        title: 'Conversions, Two\'s Complement & Why It Matters',
        text: 'Converting decimal→binary: divide by 2 repeatedly, keep the remainders, read bottom-up. Decimal→hex: divide by 16 instead.\n\nSigned numbers need a scheme. Two\'s complement is the one hardware uses: flip all bits and add 1. The top bit becomes the sign — in 8 bits, 0x80 = -128, 0xFF = -1, 0x7F = +127. Adding a negative in two\'s complement just works — the hardware doesn\'t care about signs.\n\nThe same bit pattern can mean a signed or unsigned number. 0xFF is 255 unsigned but -1 signed. This distinction causes real bugs — and it\'s why languages have signed and unsigned types.',
        code: '// Decimal 13 → binary: divide by 2, read remainders bottom-up\n13 / 2 = 6 r1\n 6 / 2 = 3 r0\n 3 / 2 = 1 r1\n 1 / 2 = 0 r1\n→ 1101₂\n\n// Two\'s complement of 5 (8-bit)\n0000 0101  → flip  1111 1010  → +1  →  1111 1011 = -5\n\n// Range in 8 bits\nunsigned: 0 … 255\nsigned:   -128 … +127\n0xFF = 255 unsigned, but -1 signed',
        note: 'Two\'s complement makes subtraction into addition. 0xFF means 255 or -1 — context decides.',
      },
    ],
    quizzes: [
      { text: 'Digital systems work with…', options: ['two states: 0 and 1', 'ten states', 'one state', 'an infinite range'], correctAnswer: 'two states: 0 and 1' },
      { text: '1010₂ in decimal is…', options: ['10', '12', '8', '1010'], correctAnswer: '10' },
      { text: '0xFF equals…', options: ['255', '99', '15', '1000'], correctAnswer: '255' },
      { text: 'Two\'s complement is…', options: ['flip all bits and add 1', 'add 1 and flip', 'invert nothing', 'subtract 1'], correctAnswer: 'flip all bits and add 1' },
    ],
  },

  // ── W2 · Logic Gates & Boolean Algebra ───────────────────────────────────
  {
    week: 2,
    title: 'Logic Gates & Boolean Algebra',
    description: 'The gate-level building blocks and the algebra that simplifies them.',
    topics: [
      {
        title: 'The Basic Gates — AND, OR, NOT',
        text: 'Gates are circuits with digital inputs and outputs. AND: output is 1 only when ALL inputs are 1. OR: output is 1 when ANY input is 1. NOT: inverts the input.\n\nSymbols: NOT is a triangle with a bubble; AND is a D-shape; OR is a curved D. A bubble anywhere means invert. Output is written as an expression: AND is multiplication (Y = A·B), OR is addition (Y = A + B), NOT is a bar (Y = Ā).\n\nTruth tables list every input combination and the output. For two inputs there are four rows; for n inputs, 2ⁿ rows. Learn the three basic truth tables cold.',
        code: '// AND: all must be 1\nA B | Y\n0 0 | 0\n0 1 | 0\n1 0 | 0\n1 1 | 1      Y = A · B\n\n// OR: any can be 1\nA B | Y\n0 0 | 0\n0 1 | 1\n1 0 | 1\n1 1 | 1      Y = A + B\n\n// NOT: invert\nA | Y\n0 | 1\n1 | 0        Y = Ā',
        note: 'AND = all, OR = any, NOT = invert. Truth tables are the spec sheet of every gate.',
      },
      {
        title: 'NAND & NOR — The Universal Gates',
        text: 'NAND is AND followed by NOT; NOR is OR followed by NOT. Both are called universal gates because any logic circuit can be built from NANDs alone (or NORs alone).\n\nNAND truth table: output is 0 only when all inputs are 1 — otherwise 1. NOR: output is 1 only when all inputs are 0.\n\nReal chips are built around NAND and NOR because they are simple to fabricate. A designer often draws the logic as AND/OR, and the silicon implements it as NAND/NOR. To build NOT from NAND: tie the inputs together. To build AND: NAND followed by NOT.',
        code: '// NAND: NOT of AND\nA B | Y\n0 0 | 1\n0 1 | 1\n1 0 | 1\n1 1 | 0      Y = A·B (overline)\n\n// NOR: NOT of OR\nA B | Y\n0 0 | 1\n0 1 | 0\n1 0 | 0\n1 1 | 0      Y = A+B (overline)\n\n// Build everything from NAND\nNOT:  tie inputs → NAND(a,a) = ā\nAND:  NAND then NOT\nOR:   3 NANDs (De Morgan)',
        note: 'NAND and NOR are universal — every gate can be made from them. The chip industry loves them.',
      },
      {
        title: 'XOR, XNOR & Useful Combinational Patterns',
        text: 'XOR outputs 1 when inputs differ; XNOR outputs 1 when inputs match. XOR is the "difference detector" — the heart of adders and comparators.\n\nXOR truth table: Y = A ⊕ B = 1 when A ≠ B. XNOR is its inverse.\n\nReal patterns: an equality detector (all XNORs ANDed together), a parity generator (XOR chain), and a binary adder (XOR for sum, AND for carry). Learn to recognize XOR in schematics — it appears wherever "compare or add" happens.',
        code: '// XOR: different = 1\nA B | Y\n0 0 | 0\n0 1 | 1\n1 0 | 1\n1 1 | 0      Y = A ⊕ B\n\n// XNOR: same = 1\nY = (A ⊕ B)̄\n\n// Building an adder bit\nSum   = A ⊕ B\nCarry = A · B\n\n// Equality check\nTwo inputs equal ⟺ XNOR = 1',
        note: 'XOR detects difference. Adders, parity and comparators are built from XOR chains.',
      },
      {
        title: 'Boolean Algebra & De Morgan\'s Law',
        text: 'Boolean algebra is the algebra of 0s and 1s. Core identities: A·0 = 0, A·1 = A, A·A = A, A·Ā = 0, A+A = A, A+1 = 1, and A·(B+C) = A·B + A·C (distributive).\n\nDe Morgan\'s law: the complement of a product is the sum of complements — A·B overline = Ā + B̄. And A+B overline = Ā · B̄. It lets you push bubbles through a circuit and explains why NAND can build OR.\n\nWhy it matters: simplification means fewer gates, less power, lower cost. The K-map (next lesson) is the visual tool; algebra is the proof.',
        code: '// Core identities\nA · 0 = 0        A + 1 = 1\nA · 1 = A        A + 0 = A\nA · A = A        A + A = A\nA · Ā = 0        A + Ā = 1\n\n// De Morgan\n(A·B)̄ = Ā + B̄\n(A+B)̄ = Ā · B̄\n\n// Example: simplify A·B + A·B̄ = A·(B + B̄) = A·1 = A',
        note: 'De Morgan pushes bubbles: NOT-of-AND becomes OR-of-NOTs. The foundation of gate simplification.',
      },
    ],
    quizzes: [
      { text: 'The AND gate outputs 1 when…', options: ['all inputs are 1', 'any input is 1', 'no input is 1', 'inputs differ'], correctAnswer: 'all inputs are 1' },
      { text: 'The universal gates are…', options: ['NAND and NOR', 'AND and OR', 'XOR and XNOR', 'NOT only'], correctAnswer: 'NAND and NOR' },
      { text: 'XOR outputs 1 when…', options: ['the inputs differ', 'the inputs match', 'both are 0', 'both are 1'], correctAnswer: 'the inputs differ' },
      { text: 'De Morgan\'s law says…', options: ['NOT-of-AND equals OR-of-NOTs', 'NOT-of-AND equals AND-of-NOTs', 'nothing', 'A+B = A·B'], correctAnswer: 'NOT-of-AND equals OR-of-NOTs' },
    ],
  },

  // ── W3 · Combinational Circuits ──────────────────────────────────────────
  {
    week: 3,
    title: 'Combinational Circuits',
    description: 'Circuits whose outputs depend only on current inputs: adders, encoders, decoders, multiplexers.',
    topics: [
      {
        title: 'Combinational vs Sequential — A First Distinction',
        text: 'A combinational circuit\'s output depends ONLY on its current inputs — no memory, no clock. A sequential circuit\'s output depends on inputs AND past state — it remembers.\n\nCombinational examples: adders, multiplexers, decoders, comparators. They are pure functions: same inputs, same outputs, every time. Sequential examples: flip-flops, counters, registers — the clock changes which state you\'re in.\n\nThis is the fork in digital design. Combinational logic is "today\'s weather"; sequential logic adds "yesterday\'s memory". Know which one you\'re building before you start.',
        code: '// Combinational: Y = f(current inputs)\nY = (A·B) + (C̄·D)          no memory, no clock\n\n// Sequential: next state = f(inputs, current state)\nQ_next = Q_current ⊕ input     remember + clock\n\n// Tell by the question\n"Add two 4-bit numbers"  → combinational\n"Count up each clock"     → sequential',
        note: 'Combinational forgets; sequential remembers. The clock is what separates them.',
      },
      {
        title: 'Adders — Half Adders & Full Adders',
        text: 'Adding binary numbers bit by bit. A half adder adds two bits: Sum = A ⊕ B, Carry = A·B.\n\nA full adder adds three bits — A, B and a carry-in from the lower bit: Sum = A ⊕ B ⊕ Cin, Carry-out = A·B + Cin·(A ⊕ B). Chain full adders to add multi-bit numbers.\n\nAn 8-bit ripple-carry adder is eight full adders in a row, each passing its carry to the next. It works, but the carry ripples through — slow. Faster designs (carry-lookahead) compute carries in parallel, which is why modern CPUs add so quickly.',
        code: '// Half adder: two bits\nSum   = A ⊕ B\nCarry = A · B\n\n// Full adder: three bits\nSum   = A ⊕ B ⊕ Cin\nCout  = (A·B) + (Cin·(A⊕B))\n\n// 4-bit ripple-carry: chain 4 full adders\nFA0 → Cout → FA1 → Cout → FA2 → Cout → FA3',
        note: 'Adders: XOR for the sum, AND (plus carry logic) for the carry. Chain them to add many bits.',
      },
      {
        title: 'Multiplexers & Demultiplexers — Signal Routing',
        text: 'A multiplexer (mux) selects one of many inputs and sends it to a single output. A 2-to-1 mux: Y = (S̄ · A) + (S · B). A 4-to-1 mux uses two select lines; an 8-to-1 uses three.\n\nThe select lines choose the channel: with n select lines you can pick among 2ⁿ inputs. Demultiplexers do the reverse — one input, many outputs, select which output receives it.\n\nMuxes are everywhere: choosing which sensor to read, routing a CPU\'s data bus, implementing truth tables directly (a 4:1 mux can implement any 2-input function by tying its data inputs to 0/1/signals).',
        code: '// 2-to-1 mux\nY = (S̄ · A) + (S · B)      S=0 → A,  S=1 → B\n\n// 4-to-1 mux: 2 select lines (S1 S0)\n00→D0  01→D1  10→D2  11→D3\n\n// Implement any 2-input function with a 4:1 mux\n// Tie D0..D3 to 0, 1, A, or Ā as the truth table dictates',
        note: 'A mux is a digitally controlled switch. n select lines choose among 2ⁿ inputs.',
      },
      {
        title: 'Decoders, Encoders & 7-Segment Drivers',
        text: 'A decoder converts a binary code into one-hot output: a 2-to-4 decoder takes 2 bits and activates exactly one of 4 outputs. A 3-to-8 decoder drives 8 lines — used for memory selection and address decoding.\n\nAn encoder does the reverse — 8 lines in, 3 bits out. Priority encoders handle multiple active inputs by choosing the highest-priority one.\n\nReal use: the 7-segment driver is a decoder from BCD (0–9) to the segment pattern. Segment patterns live in a truth table: 0 = abcdef (all but g), 1 = bc, 2 = abdeg, and so on. That decoder is why your calculator displays numbers.',
        code: '// 2-to-4 decoder\nA B | Y3 Y2 Y1 Y0\n0 0 |  0  0  0  1\n0 1 |  0  0  1  0\n1 0 |  0  1  0  0\n1 1 |  1  0  0  0\n\n// 7-segment: BCD in, segment pattern out\nDigit 0 → abcdef  (a b c d e f, no g)\nDigit 1 → bc\nDigit 2 → abdeg\n…\nDigit 8 → all 7 segments',
        note: 'Decoders turn codes into one-hot lines; encoders compress lines back into codes.',
      },
    ],
    quizzes: [
      { text: 'A combinational circuit\'s output depends…', options: ['only on current inputs', 'on past state', 'on the clock', 'on memory'], correctAnswer: 'only on current inputs' },
      { text: 'A full adder adds…', options: ['two bits plus a carry-in', 'two bits only', 'one bit', 'a whole number'], correctAnswer: 'two bits plus a carry-in' },
      { text: 'A 2-to-1 multiplexer…', options: ['selects one of two inputs', 'decodes a code', 'adds two bits', 'counts'], correctAnswer: 'selects one of two inputs' },
      { text: 'A decoder converts…', options: ['a binary code into one-hot lines', 'analog into digital', 'power into heat', 'nothing'], correctAnswer: 'a binary code into one-hot lines' },
    ],
  },

  // ── W4 · Sequential Circuits ─────────────────────────────────────────────
  {
    week: 4,
    title: 'Sequential Circuits',
    description: 'Circuits that remember: latches, flip-flops, counters and registers — the heartbeat of digital systems.',
    topics: [
      {
        title: 'Latches & Flip-Flops — The Memory Cells',
        text: 'A latch is the simplest memory: it holds one bit. An SR latch (two cross-coupled NANDs or NORs) sets or resets its state. A D latch captures the D input while enabled.\n\nThe D flip-flop is the workhorse: it samples its D input on a clock edge (rising or falling) and holds that value until the next edge. "Edge-triggered" means the data is captured at the instant of the edge, not throughout.\n\nWhy this matters: flip-flops are the 1-bit memories that build registers, counters and all state machines. Every "remember this" in a chip is a flip-flop somewhere.',
        code: '// SR latch: Set / Reset\nS=1,R=0 → Q=1     S=0,R=1 → Q=0\nS=0,R=0 → hold    S=1,R=1 → forbidden\n\n// D flip-flop: capture on the clock edge\n// Each rising edge: Q ← D, then hold\n\n// One flip-flop = one bit of memory\n8 D flip-flops sharing a clock = an 8-bit register',
        note: 'Flip-flops capture D on the clock edge. String them together and you have memory.',
      },
      {
        title: 'Registers & Shift Registers',
        text: 'A register is a set of flip-flops sharing one clock — it stores a multi-bit value as a unit. An 8-bit register holds one byte, driven by one clock and one enable.\n\nA shift register moves bits through: each clock edge shifts every bit one position, with the new bit entering at one end. Types: serial-in/serial-out, serial-in/parallel-out, parallel-in/serial-out.\n\nUses: converting serial data to parallel (reading a sensor\'s bitstream), building LED runners, and performing multiply-by-2 (shift left) or divide-by-2 (shift right). The classic 74HC595 uses SIPO shift registers to drive many LEDs from few pins.',
        code: '// 8-bit register: 8 D flip-flops, one clock\n// CLK ↑  →  Q[7:0] ← D[7:0]\n\n// Shift register, each clock:\nQ7 ← Q6 ← Q5 ← … ← Q0 ← DIN\n// data walks right one bit per clock\n\n// Left shift = multiply by 2 (in binary)\n0011 (3)  << 1  →  0110 (6)',
        note: 'Registers store words; shift registers move bits one clock at a time.',
      },
      {
        title: 'Counters — Counting with Flip-Flops',
        text: 'A counter is flip-flops wired so their state counts up (or down) each clock. A 4-bit binary counter counts 0→15 then wraps. Mod-N counters count to N-1 then reset.\n\nThe count value is just the flip-flop outputs read as binary. Decade counters (0–9) power digital clocks and meters. Counters also generate timing — a counter driven by a 1 MHz clock with a terminal count at 1,000,000 produces a 1-second pulse.\n\nCounters in the real world: event counting, frequency division (each stage halves the rate — a 4-bit counter divides by 16), and the internal timing of every processor.',
        code: '// 4-bit up counter\nClock 1 → 0000\nClock 2 → 0001\n…\nClock 16 → 1111 → wraps to 0000\n\n// Frequency division\nInput 1 MHz → 1-bit counter halves to 500 kHz\n→ 4-bit counter divides by 16 → 62.5 kHz\n\n// Mod-10 (decade) counter\nCounts 0→9, resets at 10',
        note: 'Counters count clock edges. They time, divide frequency and index everything.',
      },
      {
        title: 'From Counters to State Machines',
        text: 'A state machine (finite state machine, FSM) is a sequential circuit that moves through defined states on each clock. It has: current state, next-state logic, state memory (flip-flops) and output logic.\n\nTwo classic types: Moore (outputs depend only on the state) and Mealy (outputs depend on state and inputs). Traffic light controllers, vending machines, CPU instruction decoders — all are state machines.\n\nDesign method: draw the state diagram → build the state table → pick state encoding → derive flip-flop inputs with K-maps → draw the circuit. It turns "design a controller" from art into a repeatable process.',
        code: '// FSM parts\n1. State memory:  flip-flops\n2. Next-state:   f(current state, inputs)\n3. Outputs:      Moore → f(state) only\n                 Mealy → f(state, inputs)\n\n// Traffic light states\nRed → Green → Yellow → Red\nEach state lasts N clocks, then transitions',
        note: 'A state machine is a counter with personality — the flip-flops remember where you are in the story.',
      },
    ],
    quizzes: [
      { text: 'A D flip-flop captures its input…', options: ['on the clock edge', 'constantly', 'never', 'on reset'], correctAnswer: 'on the clock edge' },
      { text: 'A register is…', options: ['flip-flops sharing one clock to store a word', 'a single bit', 'an adder', 'a decoder'], correctAnswer: 'flip-flops sharing one clock to store a word' },
      { text: 'A 4-bit binary counter counts…', options: ['0 to 15 then wraps', '0 to 99', '1 to 4', '0 to 255 then stops'], correctAnswer: '0 to 15 then wraps' },
      { text: 'In a Moore machine the outputs depend…', options: ['only on the state', 'on state and inputs', 'only on inputs', 'on nothing'], correctAnswer: 'only on the state' },
    ],
  },

  // ── W5 · Digital Systems — A Practical Build ─────────────────────────────
  {
    week: 5,
    title: 'Digital Systems — A Practical Build',
    description: 'Putting it together: K-maps, an integrated system, implementation realities, and where to go next.',
    topics: [
      {
        title: 'Karnaugh Maps — Simplification by Eye',
        text: 'A Karnaugh map (K-map) is a truth table laid out in a grid where adjacent cells differ by one bit. Groups of adjacent 1s become product terms; the larger the group, the simpler the term.\n\nRules: groups must be rectangles of 1, 2, 4, 8… cells; the grid wraps around edges; overlapping groups are allowed; each 1 must be covered at least once. For a 4-variable map, a 4-cell group eliminates two variables; an 8-cell group eliminates three.\n\nPractice: map Y = Σ(1,3,5,7,9,11,13,15), group the cells, read off the simplified sum-of-products. K-maps handle up to about 5 variables by eye; beyond that you switch to the Quine–McCluskey algorithm.',
        code: '// 4-variable K-map grid (A B on top, C D on side)\n//   00 01 11 10\n// 00 .  .  .  .\n// 01 .  .  .  .\n// 11 .  .  .  .\n// 10 .  .  .  .\n\n// Group adjacent 1s in powers of 2\n// A 2×2 group of 4 ones → one variable eliminated\n// Wrap-around counts: edges are neighbours',
        note: 'K-maps find the minimum logic by grouping adjacent 1s. Bigger groups = simpler circuits.',
      },
      {
        title: 'Putting It Together — A Digital System Project',
        text: 'A real system combines everything: an encoder, registers, a counter, an adder and a display. The classic starter: a 4-bit BCD counter driving a 7-segment display via a decoder, with a debounced button as the clock.\n\nDesign flow: draw the block diagram → write the truth tables → choose the chips (74-series: 74LS47 decoder, 74HC161 counter, 555 for clock) → wire on breadboard → verify with the display and a logic probe.\n\nEach block is verifiable alone: clock first (LED blinks), then counter (LEDs count), then decoder (display follows). Debug one block at a time — that habit carries into every bigger build.',
        code: '// Block diagram\nButton ─ debounce ─ 555 clock ─ 74HC161 counter\n        ─ 4 bits ─ 74LS47 decoder ─ 7-seg display\n\n// Build order\n1. Clock blinks an LED\n2. Counter counts on the LEDs\n3. Decoder + display follow the count\n4. Debounce fixes the jumpy count',
        note: 'Design in blocks, build in blocks, verify each block. A system is just cooperating modules.',
      },
      {
        title: 'Implementation Realities — Fan-out, Propagation, Noise',
        text: 'Ideal gates are instant and infinite; real chips have limits. Propagation delay: the time from input change to output settling, per gate. Timing analysis adds the delays of a path to see if it meets the clock.\n\nFan-out: how many gate inputs one output can drive (typically 10 for TTL). Exceeding it drags the signal. Noise margins separate logic levels from each other, so one gate\'s weak high doesn\'t read as a low.\n\nReal-world rules: decouple every IC with a 100 nF capacitor at its power pin, keep ground solid, avoid long unshielded runs for clocks, and measure with a scope or logic analyzer rather than assuming.',
        code: '// Propagation delay: input → output\n// AND gate ~10 ns; path of 4 gates ~40 ns\n// Clock period must exceed the longest path\n\n// Fan-out: one output drives at most N inputs\n// TTL ~10 fan-out\n\n// Decoupling\n// Every IC: 100 nF from VCC to GND, as close as possible',
        note: 'Real gates have delay, limited drive and noise. Decouple, respect fan-out, and time your paths.',
      },
      {
        title: 'From Gates to a Career Path',
        text: 'This course\'s map: number systems → gates → Boolean algebra → combinational circuits → sequential circuits → state machines. You now read a schematic, count in hex, and know how a CPU stores and adds.\n\nNatural next steps: hardware description languages (VHDL/Verilog) to design chips in text, FPGA boards (a chip whose logic you can redefine), microcontrollers (the stored-program version of everything here), and VLSI design for the full custom-chip journey.\n\nThe mental model that carries you: every digital system is combinational logic + flip-flops + a clock. Everything else is engineering around that truth.',
        code: '// Your toolbelt after this course\n✓ Convert binary/hex/octal on sight\n✓ Read truth tables and K-maps\n✓ Simplify with Boolean algebra + De Morgan\n✓ Build adders, muxes, decoders\n✓ Design counters and state machines\n✓ Wire and debug a real 74-series system\n\n// The map forward\nLogic → VHDL/Verilog → FPGA → MCU → VLSI',
        note: 'All digital = combinational logic + flip-flops + a clock. Go from gates to HDL and FPGA next.',
      },
    ],
    quizzes: [
      { text: 'A K-map group must have…', options: ['1, 2, 4, 8… cells in a rectangle', 'any number', 'exactly 3', '5 cells'], correctAnswer: '1, 2, 4, 8… cells in a rectangle' },
      { text: 'Propagation delay is…', options: ['the time from input change to output settling', 'the fan-out', 'the noise margin', 'the clock'], correctAnswer: 'the time from input change to output settling' },
      { text: 'The project combines…', options: ['counter + decoder + display', 'only gates', 'only algebra', 'only wires'], correctAnswer: 'counter + decoder + display' },
      { text: 'Every digital system is…', options: ['combinational logic + flip-flops + a clock', 'only gates', 'only flip-flops', 'only memory'], correctAnswer: 'combinational logic + flip-flops + a clock' },
    ],
  },
];
