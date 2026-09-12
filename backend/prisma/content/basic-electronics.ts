/**
 * Basic Electronics — Voltage to Circuits — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in basic-electronics_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Fundamentals — Voltage, Current, Resistance ─────────────────────
  {
    week: 1,
    title: 'Fundamentals — Voltage, Current, Resistance',
    description: 'The three quantities that make every circuit work, and the law that binds them.',
    topics: [
      {
        title: 'What Electricity Is — Voltage & Current',
        text: 'Electricity is moving electric charge (electrons). Two quantities describe it: current is the flow of charge, measured in amperes (A); voltage is the pressure that pushes the charge, measured in volts (V).\n\nAn analogy that works: water in pipes. Voltage is water pressure, current is the flow rate, and the pipe is the conductor. A battery is the pump; the wire is the pipe.\n\nKey facts: current flows through a complete loop (circuit); voltage is measured across a component; no pressure, no flow — no voltage, no current. A break anywhere stops everything.',
        code: 'Voltage (V)  — the "pressure" pushing charge\nCurrent (I)   — the "flow" of charge, in amperes\n\nWater analogy\nBattery  = pump        Voltage = pressure\nWire     = pipe        Current = flow rate\nResistor = narrow pipe\n\nI = V / R   — the bridge (Ohm\'s law, next lesson)',
        note: 'Current flows in a loop; voltage is the pressure driving it. If a circuit "doesn\'t work", trace the loop.',
      },
      {
        title: 'Resistance & the Conductor Family',
        text: 'Resistance opposes current flow, measured in ohms (Ω). A conductor (copper) has low resistance; an insulator (rubber, plastic) has enormous resistance; a resistor is a component with a deliberate, known resistance.\n\nResistors limit current, divide voltage, set bias points and protect components. Their value is shown by colour bands and their tolerance by the last band.\n\nSeries resistance adds: R_total = R1 + R2. Parallel resistance is lower than the smallest: 1/R_total = 1/R1 + 1/R2. Both are the arithmetic of every real circuit.',
        code: '// Colour bands for 470 Ω (yellow, violet, brown)\n// 4 = yellow, 7 = violet, ×10¹ = brown → 470 Ω\n\n// Series adds\nR = R1 + R2\n\n// Parallel lowers\n1/R = 1/R1 + 1/R2\n// Two equal in parallel → half the value\n\n// Resistor power rating matters too:\n// P = I²R — pick a rating above the real dissipation',
        note: 'Resistors are the "narrow pipes" that shape the flow. Series adds, parallel divides — memorize both.',
      },
      {
        title: "Ohm's Law — V = I × R",
        text: "Ohm's law is the one equation in electronics: V = I × R, where V is volts, I is amps, R is ohms. Rearranged: I = V/R and R = V/I. Know any two, find the third.\n\nIt tells you what a circuit does before you build it. 5 V across a 220 Ω resistor: I = 5/220 ≈ 23 mA. To limit an LED to 20 mA from 5 V: R = 5/0.02 = 250 Ω → use 220 Ω or 330 Ω.\n\nReal components approximate Ohm's law — LEDs, transistors and diodes don't follow it linearly, but resistors do. Start every analysis with V = I × R.",
        code: 'V = I × R        I = V / R        R = V / I\n\n// Example: LED current limit from 5 V\n// LED needs ~20 mA; diode drop ~2 V\nR = (5 V - 2 V) / 0.02 A = 150 Ω → use 220 Ω\n\n// Quick checks\n9 V battery, 1 kΩ resistor → I = 9 / 1000 = 9 mA\n\n// Units: volts × amps = watts (power, next topic)',
        note: 'V = I × R is the first thing to reach for. Size the resistor, predict the current, check your work.',
      },
      {
        title: 'Power & Energy in Circuits',
        text: 'Power is the rate of energy use: P = V × I, in watts. Combined with Ohm\'s law: P = I² × R or P = V² / R. Every component has a power rating — exceed it and it overheats and fails.\n\nPractical sizing: a 1 kΩ resistor carrying 10 mA dissipates P = 0.01² × 1000 = 0.1 W — fine for a ¼ W resistor. The same resistor at 50 mA: P = 0.05² × 1000 = 2.5 W — it burns.\n\nResistors come in power ratings: ⅛ W, ¼ W, ½ W, 1 W and up. Always check dissipation before building — overheating is the silent killer of circuits.',
        code: 'P = V × I         (watts)\nP = I² × R        (from I = V/R)\nP = V² / R\n\n// Resistor sanity check\n10 mA through 1 kΩ:\nP = 0.01² × 1000 = 0.1 W  → ¼ W resistor is fine\n50 mA through 1 kΩ:\nP = 0.05² × 1000 = 2.5 W → ¼ W resistor burns!\n\n// Ratings: ⅛ W · ¼ W · ½ W · 1 W',
        note: 'P = I²R decides whether a component survives. Size the power rating first, then the value.',
      },
    ],
    quizzes: [
      { text: 'Current is…', options: ['the flow of charge, in amperes', 'the pressure, in volts', 'the resistance, in ohms', 'the power, in watts'], correctAnswer: 'the flow of charge, in amperes' },
      { text: 'Voltage is…', options: ['the pressure that pushes charge', 'the flow rate', 'the opposition to flow', 'the energy'], correctAnswer: 'the pressure that pushes charge' },
      { text: "Ohm's law is…", options: ['V = I × R', 'V = I / R', 'I = V × R', 'R = V × I'], correctAnswer: 'V = I × R' },
      { text: 'Power dissipated in a resistor is found with…', options: ['P = I² × R', 'P = V × R', 'P = I / V', 'P = R / I'], correctAnswer: 'P = I² × R' },
    ],
  },

  // ── W2 · Series & Parallel Circuits ──────────────────────────────────────
  {
    week: 2,
    title: 'Series & Parallel Circuits',
    description: 'The two fundamental connections, Kirchhoff\'s laws, and how real circuits combine them.',
    topics: [
      {
        title: 'Series Circuits — One Path for Current',
        text: 'In series, components connect end to end — one path. The same current flows through every component; the supply voltage splits across them proportionally to resistance (voltage divider).\n\nKey rules: R_total = R1 + R2 + …, and the voltage across each resistor is V_n = I × R_n. The sum of the drops equals the supply voltage (Kirchhoff\'s voltage law).\n\nThe voltage divider is the classic series circuit: two resistors across a supply, and the node between them gives a fraction of the supply. V_out = V_in × R2 / (R1 + R2). It is everywhere in real designs.',
        code: '// Series — one path, same current everywhere\nV_in ── R1 ── R2 ── GND\n\nR_total = R1 + R2\nI = V_in / R_total\nV(R1) = I × R1,  V(R2) = I × R2\nV(R1) + V(R2) = V_in        (Kirchhoff\'s voltage law)\n\n// Voltage divider\nV_out = V_in × R2 / (R1 + R2)\n// 10 V, R1 = R2 = 5 kΩ → V_out = 5 V',
        note: 'Series = one path, current shared, voltage divided. The divider formula is worth its weight in gold.',
      },
      {
        title: 'Parallel Circuits — Multiple Paths',
        text: 'In parallel, components connect across the same two points — multiple paths. The same voltage appears across every branch; the total current splits, with each branch drawing what its resistance demands.\n\nKey rules: the voltage is identical across all branches; total current is the sum of branch currents (Kirchhoff\'s current law); total resistance is lower than the smallest branch.\n\nHouse wiring is parallel — every socket gets full voltage regardless of what else is on. One bulb burning out doesn\'t kill the others — the paths are independent.',
        code: '// Parallel — full voltage on every branch\nV_in ─┬─ R1 ─┬─ GND\n      └─ R2 ─┘\n\nV(R1) = V(R2) = V_in\nI_total = I(R1) + I(R2)     (Kirchhoff\'s current law)\n1/R_total = 1/R1 + 1/R2\n\n// Two equal resistors in parallel = half the value\n// 2 × 1 kΩ in parallel → 500 Ω',
        note: 'Parallel = full voltage, split current, lower total resistance. Lights in a house are parallel for this reason.',
      },
      {
        title: "Kirchhoff's Laws — Conservation for Circuits",
        text: "Kirchhoff's two laws are conservation applied to circuits. Current law (KCL): at any node, the current in equals the current out — charge doesn't pile up. Voltage law (KVL): around any loop, the sum of voltage drops equals the supply — energy is conserved.\n\nThese turn \"which way does current flow?\" and \"what is this voltage?\" into solvable equations. KCL for nodes, KVL for loops — combined with Ohm's law, they solve any resistive network.\n\nPractise on a two-loop circuit: label currents, write KCL at each node, write KVL around each loop, then solve the simultaneous equations. It feels like algebra class — because it is.",
        code: '// KCL — current in = current out at a node\nI1 = I2 + I3\n\n// KVL — the drops around a loop sum to the supply\nV_battery = V(R1) + V(R2)\n\n// Two-loop circuit\n// 1. Label currents I1, I2, I3\n// 2. KCL: I1 = I2 + I3 at the split node\n// 3. KVL: two loop equations\n// 4. Solve the three equations',
        note: 'KCL for nodes, KVL for loops. Together with Ohm\'s law they solve every resistive circuit on earth.',
      },
      {
        title: 'Combination Circuits — Series & Parallel Together',
        text: 'Real circuits mix both. The method: simplify from the inside out — combine parallel groups into one equivalent resistance, then series groups, until one resistance remains. Then work back out to find individual currents and voltages.\n\nExample: R2 and R3 in parallel, then that group in series with R1. First R23 = R2×R3/(R2+R3), then R_total = R1 + R23. Then I_total = V/R_total; the parallel branches split by their resistances.\n\nDraw the simplified version at each step. Combination analysis is just "reduce, then expand" — and it is the analysis of almost every real board.',
        code: '// Circuit: V_in ── R1 ──┬─ R2 ─┐\n//                         └─ R3 ─┴─ GND\n\n// Reduce\nR23 = R2 ∥ R3 = (R2 × R3) / (R2 + R3)\nR_total = R1 + R23\n\n// Expand\nI_total = V_in / R_total\nV(R1) = I_total × R1\nV(parallel) = V_in - V(R1)\nI(R2) = V(parallel) / R2,  I(R3) = V(parallel) / R3',
        note: 'Reduce the network to one resistance, then expand it back to find every current and voltage.',
      },
    ],
    quizzes: [
      { text: 'In series, the same ___ flows through every component…', options: ['current', 'voltage', 'power', 'resistance'], correctAnswer: 'current' },
      { text: 'The voltage divider output is…', options: ['V_in × R2 / (R1 + R2)', 'V_in × R1', 'V_in / R2', 'V_in + R1'], correctAnswer: 'V_in × R2 / (R1 + R2)' },
      { text: 'In parallel, the same ___ appears on every branch…', options: ['voltage', 'current', 'resistance', 'power'], correctAnswer: 'voltage' },
      { text: 'Kirchhoff\'s current law says…', options: ['current in = current out at a node', 'voltage sums to zero always', 'power is infinite', 'nothing'], correctAnswer: 'current in = current out at a node' },
    ],
  },

  // ── W3 · Components — Capacitors, Diodes, Transistors ────────────────────
  {
    week: 3,
    title: 'Components — Capacitors, Diodes, Transistors',
    description: 'The components beyond resistors that make electronics interesting.',
    topics: [
      {
        title: 'Capacitors — Storing Charge',
        text: 'A capacitor stores electric charge — two plates separated by an insulator (dielectric). It blocks DC and passes AC, smooths voltage, filters noise, and stores a small burst of energy.\n\nBehaviour: charging and discharging take time determined by R × C (the time constant, τ). The capacitor\'s voltage can\'t change instantly — that property makes it the natural voltage smoother.\n\nPractical roles: decoupling (a 100 nF across every IC\'s power pins), power-supply smoothing (larger electrolytic capacitors), timing (RC time constants), and coupling (passing AC between stages). Read the capacitance (farads, µF/nF/pF) and voltage rating — never exceed the rating.',
        code: 'Capacitance: F, µF, nF, pF\n1 µF = 10⁻⁶ F · 1 nF = 10⁻⁹ F · 1 pF = 10⁻¹² F\n\n// Time constant\nτ = R × C   (seconds)\n// After ~5τ a capacitor is effectively full\n\n// Decoupling: 100 nF ceramic across IC power pins\n// Smoothing: 1000 µF electrolytic after a rectifier',
        note: 'Capacitors store charge and resist voltage change. τ = RC is the time of their world.',
      },
      {
        title: 'Diodes — One-Way Valves',
        text: 'A diode lets current flow in one direction and blocks it in the other. Forward bias (anode positive): it conducts after ~0.7 V (silicon). Reverse bias: it blocks — until breakdown, which destroys most diodes.\n\nCore uses: rectification (AC to DC in power supplies), protection (a flyback diode across a relay or motor catches the reverse spike), and voltage reference (a Zener conducts in reverse at a defined voltage).\n\nPolarity matters: the band on the diode marks the cathode (the "bar" in the symbol). LED is a diode that emits light when forward-biased, with a higher drop (~2 V) and a current limit.',
        code: '// Symbol: anode ◀|▶ cathode   (the bar = cathode)\n\n// Forward: conducts after ~0.7 V (Si)\n// Reverse: blocks\n\n// Rectifier: 4 diodes → full-wave bridge\n// ~AC in ─┬─ D1 ─┐ ┌─ D3 ─┐\n//          │      ├─┤ DC out\n// ~AC in ─┴─ D2 ─┘ └─ D4 ─┘\n\n// Flyback protection (critical!)\n// Motor + diode across it, diode reversed →\n// kick-back voltage gets absorbed, not the chip',
        note: 'One-way valve: conducts forward after 0.7 V, blocks reverse. That one behaviour powers rectification and protection.',
      },
      {
        title: 'Transistors — Switches & Amplifiers',
        text: 'A transistor is a controlled switch or amplifier. Two main families: BJT (base controls a larger collector current — current-controlled) and MOSFET (gate voltage controls a larger drain current — voltage-controlled, the modern default).\n\nAs a switch: a small signal at the base/gate lets a much larger current flow — that\'s how an Arduino pin drives a motor through a transistor. BJT saturation means fully ON; a MOSFET fully ON means its gate is above the threshold.\n\nAs an amplifier: a small input variation produces a larger output variation — the basis of audio and sensors. The current gain of a BJT (hFE, β) tells you how much it multiplies the base current.',
        code: '// BJT as a switch (NPN)\n// base signal (3.3 V, 1 mA) → collector to motor\n// emitter to GND, motor from V+ to collector\n\n// MOSFET as a switch (logic-level)\n// gate at 3.3 V → ON (drain current flows)\n\n// Current gain\nI_c = β × I_b      (BJT)\n\n// Always add a flyback diode across an inductive load,\n// and a base resistor to the microcontroller pin.',
        note: 'Small in, large out — that is the transistor. Switch with it first; amplify when you\'re ready.',
      },
      {
        title: 'Reading Schematics & Common Components',
        text: 'A schematic is the language of circuits — symbols connected by lines. Learn the common ones: resistor (zigzag), capacitor (two parallel plates), diode (triangle + bar), transistor (three-terminal symbol), battery, ground (three descending bars), and ICs (boxes with numbered pins).\n\nRead a schematic in the flow of current: from the supply, through the components, to ground. Trace each loop. A complete, unbroken path is a working circuit; a missing ground is a missing loop.\n\nMatch schematic parts to real parts: values printed or colour-coded, polarity on capacitors/diodes/ICs shown by markings. Reading schematics is the fastest way to understand someone else\'s board — and to not reinvent it.',
        code: '// Common schematic symbols\nResistor    ──/\/\/──\nCapacitor   ──| |──     (+ marks the polarized one)\nDiode       ──◀|──\nBattery     ──| |──  (long = +)\nGround      ──▼──      (three descending bars)\n\n// Read the loop: supply → components → ground.\n// A missing ground = a missing loop = no current.',
        note: 'Learn the symbols, trace the current loops. A schematic read as a loop diagram reveals any circuit.',
      },
    ],
    quizzes: [
      { text: 'A capacitor…', options: ['stores charge and resists voltage change', 'blocks current forever', 'is a switch', 'amplifies'], correctAnswer: 'stores charge and resists voltage change' },
      { text: 'The RC time constant is…', options: ['τ = R × C', 'τ = R / C', 'τ = V × I', 'τ = 1/R'], correctAnswer: 'τ = R × C' },
      { text: 'A diode conducts…', options: ['forward after ~0.7 V and blocks reverse', 'in both directions', 'only in reverse', 'never'], correctAnswer: 'forward after ~0.7 V and blocks reverse' },
      { text: 'A transistor can be used as…', options: ['a controlled switch or amplifier', 'only a resistor', 'a capacitor', 'a power supply'], correctAnswer: 'a controlled switch or amplifier' },
    ],
  },

  // ── W4 · Tools & Practice ────────────────────────────────────────────────
  {
    week: 4,
    title: 'Tools & Practice',
    description: 'The multimeter, soldering iron and breadboard — the hands that turn theory into circuits.',
    topics: [
      {
        title: 'The Multimeter — Voltage, Current, Continuity',
        text: 'The multimeter is the first tool. Key modes: voltage (V — measure across components, in parallel), current (A — measure through a component, in series), resistance (Ω — component out of circuit), and continuity (buzzer — is there a complete path?).\n\nGolden rules: measure voltage in parallel across the component; measure current in series (break the loop, insert the meter); never measure resistance or continuity on a live circuit. Start with the largest range and work down.\n\nThe continuity test is your wiring sanity check: it should beep for a good connection and stay silent for a break. Most "is my wiring right?" questions end in two seconds of continuity testing.',
        code: '// Voltage — in parallel (across the part)\nV ─┬── [component] ──┬─  meter across it\n\n// Current — in series (break the loop)\nbreak here → insert meter in the break\n\n// Continuity — circuit OFF\nbeeps = complete path   ·   silence = break\n\n// Multimeter modes: V (parallel), A (series),\n// Ω + continuity (unpowered circuit)',
        note: 'Voltage across, current in series, continuity off-power. These three rules are 90% of safe measuring.',
      },
      {
        title: 'The Breadboard & Prototyping',
        text: 'The breadboard lets you prototype without soldering: rows of connected holes for components, rails for power and ground. Your circuit is a set of shared rows — components in the same row are electrically connected.\n\nGood prototyping: a tidy layout with power on top rail and ground on the bottom, labelled jumpers, one stage at a time, and a circuit you can read at a glance. Add a multimeter check before applying power.\n\nMove from breadboard to a real board (perfboard/PCB) once the circuit is proven — solder fixes what the breadboard\'s spring contacts can loosen.',
        code: '// Breadboard layout habit\n+ rail ── supply voltage\n- rail ── ground\n\n// Rows connect the five holes in that row\n// Same row = same node\n\n// Prototype checklist\n□ one stage built and tested\n□ continuity checked\n□ polarity checked\n□ supply verified before power-on',
        note: 'Tidy rows, labelled rails, one stage at a time. A readable breadboard is a debuggable breadboard.',
      },
      {
        title: 'Soldering Basics — Good Joints, Safe Work',
        text: 'Soldering joins components to a board with molten metal. The essentials: heat both the pad and the lead together, feed solder, let it flow, remove the iron — a good joint is shiny, smooth and forms a small fillet.\n\nPractice first: tinning the tip, then making joints on a practice board. Common mistakes: too little heat (cold, dull joint), too much solder (bridges between pads), holding the iron too long (lifting pads or cooking components).\n\nSafety: work in a ventilated area, use a fume extractor, never touch the tip or hot joints, and keep the iron in its stand when idle. Solder smoke is not something to breathe.',
        code: '// The joint sequence\n1. Clean + tin the tip\n2. Heat pad AND lead together\n3. Feed solder → it melts and flows\n4. Remove solder, then the iron\n5. Result: shiny, smooth fillet\n\n// Bad-joint signs\nCold joint: dull, grainy, unreliable\nBridge:     solder connects two pads that shouldn\'t touch\nPad lift:   too much heat lifted the copper',
        note: 'Heat both metals, let the solder flow, and keep it short. Shiny and smooth means good.',
      },
      {
        title: 'Safety & Test Equipment Basics',
        text: 'Safety first, always. Work on unpowered circuits when wiring; verify with a multimeter before power; respect voltage — mains (230 V) is lethal, and even low voltages can deliver dangerous currents through a body. One hand in your pocket when working near mains.\n\nEssential bench kit beyond the multimeter: a bench power supply (or batteries — avoid wall adapters for first builds), an oscilloscope (see waveforms, timing and noise), and a soldering station.\n\nComponent safety: respect polarity (capacitors, diodes, LEDs), respect ratings (voltage, current, power), and discharge large capacitors before touching them — they hold a charge after power is off.',
        code: '// Bench safety rules\n□ wire with power OFF\n□ verify with multimeter before power\n□ respect component polarity and ratings\n□ discharge large capacitors before touching\n□ one hand when near mains\n\n// Bench kit\nMultimeter (essential)\nBench supply / batteries (avoid wall adapters)\nOscilloscope (waveforms, timing)\nSoldering station',
        note: 'Power off when wiring, verify before powering, respect ratings and polarity. That is the whole safety syllabus.',
      },
    ],
    quizzes: [
      { text: 'Voltage is measured…', options: ['in parallel across the component', 'in series', 'with the circuit off', 'with continuity'], correctAnswer: 'in parallel across the component' },
      { text: 'Current is measured…', options: ['in series — break the loop and insert the meter', 'in parallel', 'across the component', 'with the power off'], correctAnswer: 'in series — break the loop and insert the meter' },
      { text: 'A continuity beep means…', options: ['a complete path exists', 'a break exists', 'the circuit is live', 'the meter is broken'], correctAnswer: 'a complete path exists' },
      { text: 'A good solder joint is…', options: ['shiny and smooth with a small fillet', 'dull and grainy', 'covering three pads', 'ball-shaped'], correctAnswer: 'shiny and smooth with a small fillet' },
    ],
  },

  // ── W5 · Your First Projects ─────────────────────────────────────────────
  {
    week: 5,
    title: 'Your First Projects',
    description: 'Build, test and finish real circuits — starting with the LED, the workhorse of everything.',
    topics: [
      {
        title: 'Project 1 — The LED Circuit',
        text: 'The universal first build: an LED on a 5 V supply through a resistor. The resistor limits current — 220–470 Ω is safe for most LEDs. Calculate first (Ohm\'s law), then wire, then measure.\n\nBuild it three ways to internalize the concepts: series (two LEDs, one path), parallel (two LEDs, separate paths), and with a switch (open = no current, closed = current flows).\n\nVerify with the multimeter: the voltage across the LED should be near its forward drop (~2 V), across the resistor the rest, and the current should match your calculation.',
        code: '// 5 V ── 220 Ω ── LED ── GND\nR = (5 V - ~2 V) / 0.02 A ≈ 150 Ω → 220 Ω safe\n\n// Series: two LEDs share one current\n// Parallel: each LED gets its own resistor\n\n// Measure to verify\nV across LED  ≈ 2 V (forward drop)\nV across R    ≈ 3 V\nI (series)     ≈ 13–15 mA\n\n// Add a switch in series: open breaks the loop',
        note: 'Design with Ohm\'s law, build, measure. The LED teaches the whole series/parallel/measurement skill set.',
      },
      {
        title: 'Project 2 — A Simple Power Supply',
        text: 'Convert wall AC into smooth DC: transformer (step down) → rectifier (AC to pulsing DC) → filter capacitor (smooth the ripple) → regulator (fixed 5 V/3.3 V).\n\nThe classic build uses a 7805 regulator for a fixed 5 V output — with input/output capacitors per the datasheet. A wall adapter is simpler and safer for first builds; the regulator project teaches the concept.\n\nMeasure what the smoothing does: on an oscilloscope, raw rectified output ripples at 100 Hz; after the capacitor the ripple shrinks; after the regulator it is flat. That visible improvement is power supply design in a nutshell.',
        code: '// AC → smooth DC\nAC ── transformer ── bridge rectifier ──\n     filter cap ── regulator (7805) ── 5 V\n\n// 7805 hookup\nIN  ← input 9–12 V DC (from rectified supply)\nGND ← common ground\nOUT → 5 V (with 0.1 µF + 10 µF caps)\n\n// Ripple: 100 Hz after the rectifier,\n// flattened by the capacitor, flat after the regulator',
        note: 'Transform, rectify, smooth, regulate — the four stages of every power supply. Measure the ripple shrinking.',
      },
      {
        title: 'Designing Your Own Circuit',
        text: 'Designing is selecting components to meet a spec. The method: write the spec (input voltage, required output), draw the schematic, calculate each component (Ohm\'s law + power ratings), pick real parts with margin, then simulate (Falstad, LTspice) or build and measure.\n\nExample spec: a night-light — an LDR (light-dependent resistor) in a voltage divider with a fixed resistor; the divider output drives a transistor that switches an LED. When it\'s dark the LDR rises, the divider output rises past the transistor threshold, and the LED comes on.\n\nGood design is margin: double the power rating, round resistors to standard values (E12 series), and leave test points. Simulate or breadboard before committing to a final build.',
        code: '// Night-light spec\nInput:  5 V, LDR + 10 kΩ divider → transistor → LED\nDark → LDR high → divider output high → LED on\n\n// Divider\nV_out = 5 V × R_ldr / (R_ldr + 10 kΩ)\n\n// Standard resistor values (E12)\n10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82, 100\n// …each ~10× larger at the next step',
        note: 'Spec → schematic → calculations → parts with margin → simulate/build → measure. That is every design, at every scale.',
      },
      {
        title: 'From Projects to a Practice',
        text: 'You now have the complete foundation: voltage, current, resistance, Ohm\'s law, series/parallel, capacitors, diodes, transistors, schematics, and the tools to build and measure. The path from here: choose a direction — more components (op-amps, 555 timers), digital logic, microcontrollers (Arduino), or power electronics.\n\nKeep a lab notebook: each project\'s spec, schematic, measurements and what went wrong. A notebook turns mistakes into lessons and builds the portfolio interviewers want to see.\n\nThe habit that matters most: measure everything, question assumptions, and build one small thing after another. Electronics is a practice — every circuit teaches the next one.',
        code: '// Your practice checklist\n□ every build starts with a spec\n□ measure with the multimeter, not assumptions\n□ power ratings respected, polarity checked\n□ notebook: spec, schematic, measurements, lessons\n\n// Next directions\nOp-amps & 555 timers   → analog depth\nDigital logic          → gates and flip-flops\nMicrocontrollers       → Arduino and beyond\nPower electronics      → bigger currents, switching',
        note: 'Spec, measure, record. One small circuit after another — that is how the practice compounds.',
      },
    ],
    quizzes: [
      { text: 'The safe resistor range for a 5 V LED circuit is…', options: ['220–470 Ω', '1 Ω', '1 MΩ', 'no resistor'], correctAnswer: '220–470 Ω' },
      { text: 'The four stages of a power supply are…', options: ['transform, rectify, smooth, regulate', 'filter, amplify, store, emit', 'switch, sleep, wake, boot', 'none'], correctAnswer: 'transform, rectify, smooth, regulate' },
      { text: 'The design method starts with…', options: ['a written spec, then schematic, then calculations', 'random wiring', 'buying parts', 'the final PCB'], correctAnswer: 'a written spec, then schematic, then calculations' },
      { text: 'The most valuable practice habit is…', options: ['measuring everything and recording lessons in a notebook', 'trusting assumptions', 'building blind', 'never measuring'], correctAnswer: 'measuring everything and recording lessons in a notebook' },
    ],
  },
];
