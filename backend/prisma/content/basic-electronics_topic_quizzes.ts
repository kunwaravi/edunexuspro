/**
 * Basic Electronics — Voltage to Circuits — per-topic quizzes.
 * Keyed by the EXACT topic titles in basic-electronics.ts (topic-lock flow).
 * 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in basic-electronics.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'What Electricity Is — Voltage & Current': [
    { text: 'Current is measured in…', options: ['amperes (A)', 'volts (V)', 'ohms (Ω)', 'watts (W)'], correctAnswer: 'amperes (A)' },
    { text: 'Voltage is best understood as…', options: ['the pressure that pushes charge', 'the flow of electrons', 'the opposition to flow', 'the heat'], correctAnswer: 'the pressure that pushes charge' },
    { text: 'Current flows…', options: ['in a complete loop (circuit)', 'without a loop', 'only uphill', 'never'], correctAnswer: 'in a complete loop (circuit)' },
    { text: 'A break anywhere in the loop…', options: ['stops all current', 'doubles the current', 'does nothing', 'creates voltage'], correctAnswer: 'stops all current' },
  ],
  'Resistance & the Conductor Family': [
    { text: 'Resistance is measured in…', options: ['ohms (Ω)', 'volts', 'amperes', 'farads'], correctAnswer: 'ohms (Ω)' },
    { text: 'Resistors are used to…', options: ['limit current, divide voltage and protect parts', 'store charge', 'emit light', 'block everything'], correctAnswer: 'limit current, divide voltage and protect parts' },
    { text: 'Two equal resistors in parallel give…', options: ['half the value', 'double the value', 'the same value', 'zero'], correctAnswer: 'half the value' },
    { text: 'Resistors in series…', options: ['add up: R_total = R1 + R2', 'divide: half the value', 'stay the same', 'cancel'], correctAnswer: 'add up: R_total = R1 + R2' },
  ],
  "Ohm's Law — V = I × R": [
    { text: "Ohm's law is…", options: ['V = I × R', 'I = V × R', 'R = V × I', 'V = R / I'], correctAnswer: 'V = I × R' },
    { text: '5 V across a 220 Ω resistor gives about…', options: ['23 mA', '1.1 A', '225 mA', '5 A'], correctAnswer: '23 mA' },
    { text: 'To limit an LED to 20 mA from 5 V (2 V drop), R ≈…', options: ['150 Ω (use 220 Ω)', '10 Ω', '2 kΩ', '100 kΩ'], correctAnswer: '150 Ω (use 220 Ω)' },
    { text: 'Resistors follow Ohm\'s law…', options: ['linearly', 'non-linearly', 'never', 'only at night'], correctAnswer: 'linearly' },
  ],
  'Power & Energy in Circuits': [
    { text: 'Power is…', options: ['the rate of energy use, in watts', 'the flow, in amps', 'the pressure, in volts', 'the resistance, in ohms'], correctAnswer: 'the rate of energy use, in watts' },
    { text: 'P = I² × R lets you…', options: ['check if a resistor will overheat', 'find the voltage', 'pick a wire colour', 'nothing'], correctAnswer: 'check if a resistor will overheat' },
    { text: '10 mA through 1 kΩ dissipates…', options: ['0.1 W — fine for a ¼ W resistor', '2.5 W', '10 W', '0 W'], correctAnswer: '0.1 W — fine for a ¼ W resistor' },
    { text: 'Exceeding a component\'s power rating causes…', options: ['overheating and failure', 'a faster circuit', 'nothing', 'more light'], correctAnswer: 'overheating and failure' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Series Circuits — One Path for Current': [
    { text: 'In a series circuit…', options: ['the same current flows through every component', 'the voltage is identical everywhere', 'the resistance divides', 'no current flows'], correctAnswer: 'the same current flows through every component' },
    { text: 'The supply voltage splits…', options: ['across the resistors proportionally to resistance', 'equally always', 'all on the first resistor', 'nowhere'], correctAnswer: 'across the resistors proportionally to resistance' },
    { text: 'The voltage-divider formula is…', options: ['V_out = V_in × R2 / (R1 + R2)', 'V_out = V_in × R1', 'V_out = V_in + R2', 'V_out = V_in / R1'], correctAnswer: 'V_out = V_in × R2 / (R1 + R2)' },
    { text: 'Kirchhoff\'s voltage law says…', options: ['the drops around a loop sum to the supply', 'current in equals current out', 'resistance adds forever', 'nothing'], correctAnswer: 'the drops around a loop sum to the supply' },
  ],
  'Parallel Circuits — Multiple Paths': [
    { text: 'In a parallel circuit…', options: ['the same voltage appears on every branch', 'the same current flows in every branch', 'current adds nowhere', 'voltage splits'], correctAnswer: 'the same voltage appears on every branch' },
    { text: 'Total current in parallel is…', options: ['the sum of the branch currents', 'the same as one branch', 'half the branch current', 'zero'], correctAnswer: 'the sum of the branch currents' },
    { text: 'The parallel resistance formula is…', options: ['1/R = 1/R1 + 1/R2', 'R = R1 + R2', 'R = R1 × R2', 'R = R1 - R2'], correctAnswer: '1/R = 1/R1 + 1/R2' },
    { text: 'House wiring is parallel so that…', options: ['every socket gets full voltage independently', 'current is the same everywhere', 'bulbs must all be on', 'it is cheaper'], correctAnswer: 'every socket gets full voltage independently' },
  ],
  "Kirchhoff's Laws — Conservation for Circuits": [
    { text: 'KCL (current law) says…', options: ['current in = current out at a node', 'voltage sums to zero', 'power is conserved', 'resistance adds'], correctAnswer: 'current in = current out at a node' },
    { text: 'KVL (voltage law) says…', options: ['the drops around a loop sum to the supply', 'current in = current out', 'no voltage exists', 'nothing'], correctAnswer: 'the drops around a loop sum to the supply' },
    { text: 'Together with Ohm\'s law, Kirchhoff\'s laws…', options: ['solve any resistive network', 'only work for batteries', 'are only for DC', 'are approximations'], correctAnswer: 'solve any resistive network' },
    { text: 'The method for a multi-loop circuit is…', options: ['label currents, write KCL, write KVL, solve', 'guess and check', 'measure randomly', 'skip it'], correctAnswer: 'label currents, write KCL, write KVL, solve' },
  ],
  'Combination Circuits — Series & Parallel Together': [
    { text: 'The combination-analysis method is…', options: ['reduce parallel groups and series groups to one resistance, then expand back out', 'ignore half the circuit', 'only guess', 'measure first'], correctAnswer: 'reduce parallel groups and series groups to one resistance, then expand back out' },
    { text: 'For R2 ∥ R3 then in series with R1, you first find…', options: ['R23 = (R2 × R3) / (R2 + R3)', 'R1 × R2', 'R2 + R3 only', 'nothing'], correctAnswer: 'R23 = (R2 × R3) / (R2 + R3)' },
    { text: 'After reducing, you work back out to find…', options: ['individual currents and voltages', 'the colour bands', 'the price', 'nothing'], correctAnswer: 'individual currents and voltages' },
    { text: 'The parallel branches split current…', options: ['inversely to their resistance', 'equally always', 'by their colour', 'randomly'], correctAnswer: 'inversely to their resistance' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Capacitors — Storing Charge': [
    { text: 'A capacitor is built from…', options: ['two plates separated by an insulator', 'a coil of wire', 'a piece of silicon', 'a magnet'], correctAnswer: 'two plates separated by an insulator' },
    { text: 'A capacitor blocks DC and…', options: ['passes AC, smooths voltage and filters noise', 'amplifies AC', 'generates DC', 'stores magnets'], correctAnswer: 'passes AC, smooths voltage and filters noise' },
    { text: 'The time constant is…', options: ['τ = R × C', 'τ = V × I', 'τ = R / C', 'τ = 1 × C'], correctAnswer: 'τ = R × C' },
    { text: 'The decoupling capacitor across IC power pins is typically…', options: ['100 nF', '1 F', '100 µH', 'none'], correctAnswer: '100 nF' },
  ],
  'Diodes — One-Way Valves': [
    { text: 'A diode conducts…', options: ['forward after about 0.7 V (silicon)', 'in both directions', 'only in reverse', 'never below 5 V'], correctAnswer: 'forward after about 0.7 V (silicon)' },
    { text: 'The diode\'s symbol band marks…', options: ['the cathode', 'the anode', 'the positive', 'the ground'], correctAnswer: 'the cathode' },
    { text: 'The core uses of diodes are…', options: ['rectification, protection and voltage reference', 'storage and timing', 'switching amplifiers', 'light only'], correctAnswer: 'rectification, protection and voltage reference' },
    { text: 'A flyback diode protects against…', options: ['the kick-back voltage of an inductive load', 'reverse current in an LED', 'heat', 'nothing'], correctAnswer: 'the kick-back voltage of an inductive load' },
  ],
  'Transistors — Switches & Amplifiers': [
    { text: 'A BJT is…', options: ['current-controlled: base current controls a larger collector current', 'voltage-controlled only', 'a capacitor', 'a diode'], correctAnswer: 'current-controlled: base current controls a larger collector current' },
    { text: 'A MOSFET is…', options: ['voltage-controlled: gate voltage controls a larger drain current', 'current-controlled', 'a rectifier', 'a fuse'], correctAnswer: 'voltage-controlled: gate voltage controls a larger drain current' },
    { text: 'The BJT current gain is…', options: ['β (hFE): I_c = β × I_b', 'τ', 'µ', '0'], correctAnswer: 'β (hFE): I_c = β × I_b' },
    { text: 'When a microcontroller pin drives a motor, the transistor…', options: ['lets the small pin signal switch the larger motor current', 'replaces the motor', 'doubles the voltage', 'is optional'], correctAnswer: 'lets the small pin signal switch the larger motor current' },
  ],
  'Reading Schematics & Common Components': [
    { text: 'A schematic is…', options: ['a diagram of symbols connected by lines', 'a photo of the board', 'a list of parts', 'a price sheet'], correctAnswer: 'a diagram of symbols connected by lines' },
    { text: 'The resistor symbol is…', options: ['a zigzag line', 'two parallel plates', 'a triangle + bar', 'a rectangle'], correctAnswer: 'a zigzag line' },
    { text: 'The capacitor symbol is…', options: ['two parallel plates', 'a zigzag', 'a triangle + bar', 'a battery'], correctAnswer: 'two parallel plates' },
    { text: 'To understand a schematic you…', options: ['trace the current loops from supply to ground', 'read it backwards', 'only look at the title', 'skip the grounds'], correctAnswer: 'trace the current loops from supply to ground' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'The Multimeter — Voltage, Current, Continuity': [
    { text: 'Voltage is measured…', options: ['in parallel, across the component', 'in series, in the loop', 'with no circuit', 'only on batteries'], correctAnswer: 'in parallel, across the component' },
    { text: 'Current is measured…', options: ['in series — break the loop and insert the meter', 'in parallel', 'across the resistor', 'with power off'], correctAnswer: 'in series — break the loop and insert the meter' },
    { text: 'Resistance is measured…', options: ['with the component out of a live circuit', 'on a live circuit', 'with current flowing', 'only on wires'], correctAnswer: 'with the component out of a live circuit' },
    { text: 'The continuity test…', options: ['beeps for a complete path', 'measures voltage', 'tests batteries', 'is for live circuits'], correctAnswer: 'beeps for a complete path' },
  ],
  'The Breadboard & Prototyping': [
    { text: 'On a breadboard, components connect when…', options: ['they share the same row of holes', 'they touch wires', 'they are near each other', 'they are the same colour'], correctAnswer: 'they share the same row of holes' },
    { text: 'The side rails carry…', options: ['power and ground', 'only data', 'only the clock', 'nothing'], correctAnswer: 'power and ground' },
    { text: 'The prototype checklist includes…', options: ['continuity and polarity checks before power-on', 'immediate power-on', 'no checks', 'soldering first'], correctAnswer: 'continuity and polarity checks before power-on' },
    { text: 'Move from breadboard to a real board when…', options: ['the circuit is proven', 'you are bored', 'the breadboard is full', 'never'], correctAnswer: 'the circuit is proven' },
  ],
  'Soldering Basics — Good Joints, Safe Work': [
    { text: 'A good solder joint is…', options: ['shiny, smooth and forms a small fillet', 'dull and grainy', 'covering multiple pads', 'impossible'], correctAnswer: 'shiny, smooth and forms a small fillet' },
    { text: 'The joint sequence is…', options: ['heat both metals, feed solder, let it flow, remove iron', 'solder first, then heat', 'no heat', 'press hard'], correctAnswer: 'heat both metals, feed solder, let it flow, remove iron' },
    { text: 'A cold joint looks…', options: ['dull and grainy and is unreliable', 'shiny and perfect', 'impossible to make', 'like a bridge'], correctAnswer: 'dull and grainy and is unreliable' },
    { text: 'Soldering safety includes…', options: ['ventilation, a fume extractor and never touching hot tips', 'holding the iron tip', 'breathing the smoke', 'no stand'], correctAnswer: 'ventilation, a fume extractor and never touching hot tips' },
  ],
  'Safety & Test Equipment Basics': [
    { text: 'Wire circuits…', options: ['with power OFF', 'while powered', 'with one hand', 'only at night'], correctAnswer: 'with power OFF' },
    { text: 'Before powering a build you should…', options: ['verify with the multimeter', 'trust your eyes', 'skip checks', 'use the largest supply'], correctAnswer: 'verify with the multimeter' },
    { text: 'Large capacitors can…', options: ['hold a dangerous charge after power is off', 'never hurt you', 'be shorted safely', 'always discharge themselves'], correctAnswer: 'hold a dangerous charge after power is off' },
    { text: 'The essential bench tool beyond the multimeter is…', options: ['an oscilloscope for waveforms and timing', 'a heavier hammer', 'a second laptop', 'a fan'], correctAnswer: 'an oscilloscope for waveforms and timing' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Project 1 — The LED Circuit': [
    { text: 'The LED resistor is sized with…', options: ['Ohm\'s law: R = (V_supply - V_drop) / I', 'a random guess', 'the LED colour', 'the wire length'], correctAnswer: 'Ohm\'s law: R = (V_supply - V_drop) / I' },
    { text: 'A safe resistor for a 5 V LED is…', options: ['220 Ω', '1 Ω', '1 MΩ', 'none needed'], correctAnswer: '220 Ω' },
    { text: 'The forward drop of a typical LED is about…', options: ['2 V', '0.7 V', '5 V', '12 V'], correctAnswer: '2 V' },
    { text: 'Adding a switch in series means…', options: ['open = no current, closed = current flows', 'the LED is always on', 'the switch does nothing', 'more brightness'], correctAnswer: 'open = no current, closed = current flows' },
  ],
  'Project 2 — A Simple Power Supply': [
    { text: 'The four supply stages are…', options: ['transform, rectify, smooth, regulate', 'filter, amplify, store, emit', 'boost, buck, invert, switch', 'none'], correctAnswer: 'transform, rectify, smooth, regulate' },
    { text: 'The 7805 is…', options: ['a fixed 5 V regulator', 'a transformer', 'a bridge rectifier', 'a capacitor'], correctAnswer: 'a fixed 5 V regulator' },
    { text: 'The filter capacitor…', options: ['smooths the rectified ripple', 'regulates the voltage', 'steps down AC', 'rectifies'], correctAnswer: 'smooths the rectified ripple' },
    { text: 'After the regulator the output is…', options: ['flat DC', 'rippling at 100 Hz', 'pulsing AC', 'nothing'], correctAnswer: 'flat DC' },
  ],
  'Designing Your Own Circuit': [
    { text: 'The design method starts with…', options: ['a written spec', 'a random part', 'the final board', 'soldering'], correctAnswer: 'a written spec' },
    { text: 'Component values are selected…', options: ['with calculation and margin, using standard values', 'randomly', 'by the biggest size', 'by colour preference'], correctAnswer: 'with calculation and margin, using standard values' },
    { text: 'Standard resistor values come from…', options: ['the E12 series', 'a lottery', 'the supplier', 'the colour of the band'], correctAnswer: 'the E12 series' },
    { text: 'The discipline that prevents rework is…', options: ['simulate or breadboard before the final build', 'skip testing', 'assume it works', 'order a PCB immediately'], correctAnswer: 'simulate or breadboard before the final build' },
  ],
  'From Projects to a Practice': [
    { text: 'The complete foundation now includes…', options: ['Ohm\'s law, series/parallel, capacitors, diodes, transistors, schematics and tools', 'only the LED', 'only the multimeter', 'only soldering'], correctAnswer: 'Ohm\'s law, series/parallel, capacitors, diodes, transistors, schematics and tools' },
    { text: 'A lab notebook turns…', options: ['mistakes into lessons and builds a portfolio', 'pages into circuits', 'nothing', 'time into solder'], correctAnswer: 'mistakes into lessons and builds a portfolio' },
    { text: 'The habit that matters most is…', options: ['measuring everything and questioning assumptions', 'trusting memory', 'building blind', 'never measuring'], correctAnswer: 'measuring everything and questioning assumptions' },
    { text: 'The natural next directions are…', options: ['op-amps, digital logic, microcontrollers or power electronics', 'stopping', 'only bigger LEDs', 'only batteries'], correctAnswer: 'op-amps, digital logic, microcontrollers or power electronics' },
  ],
};
