/**
 * ITI Fitter — Workshop Measurement & Fitting — per-topic quizzes.
 * Keyed by the EXACT topic titles in iti-fitter.ts (topic-lock flow).
 * 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in iti-fitter.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  "Workshop Safety — The Fitter's First Skill": [
    { text: 'Workshop dress means…', options: ['fitted clothing, no jewellery, safety glasses', 'loose sleeves', 'rings and chains', 'anything'], correctAnswer: 'fitted clothing, no jewellery, safety glasses' },
    { text: 'Near rotating machines you never wear…', options: ['gloves (they get caught)', 'shoes', 'a shirt', 'glasses'], correctAnswer: 'gloves (they get caught)' },
    { text: 'Most workshop accidents are…', options: ['slips, trips and unguarded work', 'machines exploding', 'lightning', 'none'], correctAnswer: 'slips, trips and unguarded work' },
    { text: 'You should know where the emergency stop is…', options: ['before you start', 'when it breaks', 'afterwards', 'never'], correctAnswer: 'before you start' },
  ],
  'Hand Tools — Know Them, Care for Them': [
    { text: 'On a nut you use…', options: ['a wrench, not pliers', 'pliers always', 'a hammer', 'a file'], correctAnswer: 'a wrench, not pliers' },
    { text: 'The file…', options: ['pushes to cut', 'pulls to cut', 'cuts both ways', 'never cuts'], correctAnswer: 'pushes to cut' },
    { text: 'A damaged tool is…', options: ['repaired or replaced', 'used carefully', 'still fine', 'hidden'], correctAnswer: 'repaired or replaced' },
    { text: 'Cared-for tools…', options: ['last a career', 'break anyway', 'rust always', 'are luck'], correctAnswer: 'last a career' },
  ],
  'Measuring Basics — Precision Starts Here': [
    { text: 'The accuracy ladder is…', options: ['rule 0.5 mm, vernier 0.02 mm, micrometer 0.01 mm', 'all the same', 'reverse', 'no ladder'], correctAnswer: 'rule 0.5 mm, vernier 0.02 mm, micrometer 0.01 mm' },
    { text: 'Measure a 30 mm shaft to 0.02 mm with…', options: ['a vernier caliper', 'a steel rule', 'your eye', 'a hammer'], correctAnswer: 'a vernier caliper' },
    { text: 'Parallax error comes from…', options: ['reading at an angle', 'dirty work', 'wrong tool', 'speed'], correctAnswer: 'reading at an angle' },
    { text: 'A good measurement is…', options: ['repeatable — measure twice and agree', 'fast', 'once', 'approximate'], correctAnswer: 'repeatable — measure twice and agree' },
  ],
  'Bench Work — The Vise, Filing & Clean Practice': [
    { text: 'The work in the vice should be…', options: ['held level, not over-tightened', 'wobbling', 'loose', 'crooked'], correctAnswer: 'held level, not over-tightened' },
    { text: 'For finished parts you use…', options: ['soft jaws', 'hammer jaws', 'no jaws', 'iron teeth'], correctAnswer: 'soft jaws' },
    { text: 'On the return stroke the file…', options: ['is lifted', 'cuts harder', 'is pressed down', 'is pushed'], correctAnswer: 'is lifted' },
    { text: 'Flatness is checked with…', options: ['a straight edge', 'a hammer', 'a magnet', 'the eye'], correctAnswer: 'a straight edge' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'The Vernier Caliper — Read It Correctly': [
    { text: 'The vernier caliper measures…', options: ['outside, inside and depth', 'only outside', 'only depth', 'temperature'], correctAnswer: 'outside, inside and depth' },
    { text: 'To read you…', options: ['add the main scale to the aligned vernier line', 'read only the main scale', 'read only the vernier', 'guess'], correctAnswer: 'add the main scale to the aligned vernier line' },
    { text: 'Main 23 mm + aligned 4th vernier line (0.20 mm) = …', options: ['23.20 mm', '23.4 mm', '24 mm', '2.34 mm'], correctAnswer: '23.20 mm' },
    { text: 'The reading ritual is…', options: ['clean, close gently, read squarely, repeat', 'close hard', 'read fast', 'skip it'], correctAnswer: 'clean, close gently, read squarely, repeat' },
  ],
  'The Micrometer — 0.01 mm Accuracy': [
    { text: 'The micrometer reads to…', options: ['0.01 mm', '0.1 mm', '1 mm', '0.001 mm'], correctAnswer: '0.01 mm' },
    { text: 'The thimble rotates…', options: ['0.5 mm per full turn', '1 mm per turn', '0.1 mm', 'nothing'], correctAnswer: '0.5 mm per full turn' },
    { text: 'You tighten the micrometer with…', options: ['the ratchet only', 'force', 'a spanner', 'the hammer'], correctAnswer: 'the ratchet only' },
    { text: 'Before measuring you…', options: ['zero-check against a gauge block', 'skip it', 'oil it', 'warm it'], correctAnswer: 'zero-check against a gauge block' },
  ],
  'Gauges & Comparators — Quick Checks': [
    { text: 'A plug gauge checks…', options: ['holes with GO/NO-GO ends', 'shafts', 'gaps', 'flatness'], correctAnswer: 'holes with GO/NO-GO ends' },
    { text: 'A feeler gauge measures…', options: ['gaps', 'holes', 'shafts', 'temperature'], correctAnswer: 'gaps' },
    { text: 'A dial indicator measures…', options: ['small movements like runout and flatness', 'large dimensions', 'weight', 'time'], correctAnswer: 'small movements like runout and flatness' },
    { text: 'Slip gauges are stored…', options: ['clean, oiled and in their box', 'loose on the bench', 'in a pocket', 'anywhere'], correctAnswer: 'clean, oiled and in their box' },
  ],
  'Marking Out — Transferring the Drawing to Metal': [
    { text: 'Marking out starts from…', options: ['the datum surface', 'the centre', 'the edges', 'anywhere'], correctAnswer: 'the datum surface' },
    { text: 'The dye makes…', options: ['scribed lines visible', 'the metal shiny', 'rust', 'nothing'], correctAnswer: 'scribed lines visible' },
    { text: 'Hole locations are punched with…', options: ['the centre punch', 'a file', 'a hammer only', 'the scriber'], correctAnswer: 'the centre punch' },
    { text: 'A punch mark off by a millimetre…', options: ['ruins the hole location', 'is fine', 'self-corrects', 'is invisible'], correctAnswer: 'ruins the hole location' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Filing — Flat, Square and to Size': [
    { text: 'For stock removal you choose…', options: ['a coarse file', 'a smooth file', 'a round file', 'no file'], correctAnswer: 'a coarse file' },
    { text: 'Flatness is achieved with…', options: ['cross-filing or draw-filing', 'pressing hard', 'fast strokes', 'luck'], correctAnswer: 'cross-filing or draw-filing' },
    { text: 'The check loop is…', options: ['file, check, file', 'file once', 'never check', 'guess'], correctAnswer: 'file, check, file' },
    { text: 'The goal is…', options: ['flat, square and to the scribed size', 'fast and rough', 'shiny', 'whatever'], correctAnswer: 'flat, square and to the scribed size' },
  ],
  'Sawing — The Hacksaw to the Line': [
    { text: 'The hacksaw cuts…', options: ['on the push stroke', 'on the pull stroke', 'both', 'never'], correctAnswer: 'on the push stroke' },
    { text: 'A fine blade is for…', options: ['hard metal and thin sections', 'soft metal', 'thick wood', 'everything'], correctAnswer: 'hard metal and thin sections' },
    { text: 'You start the cut with…', options: ['a shallow notch', 'full pressure', 'a hammer', 'no start'], correctAnswer: 'a shallow notch' },
    { text: 'The rule is…', options: ['saw outside the line, then file to it', 'saw through the line', 'saw wide', 'saw anywhere'], correctAnswer: 'saw outside the line, then file to it' },
  ],
  'Drilling — Accurate Holes, Safe Practice': [
    { text: 'The sequence is…', options: ['centre punch → pilot → final size', 'final size first', 'no punch', 'hand-held'], correctAnswer: 'centre punch → pilot → final size' },
    { text: 'The work must be…', options: ['clamped — never held by hand', 'held in your hand', 'loose', 'balanced'], correctAnswer: 'clamped — never held by hand' },
    { text: 'For steel you use…', options: ['cutting oil', 'water', 'nothing', 'grease'], correctAnswer: 'cutting oil' },
    { text: 'Chips are cleared…', options: ['with a brush, machine stopped', 'with your fingers', 'while running', 'with air only'], correctAnswer: 'with a brush, machine stopped' },
  ],
  'Reaming, Tapping & Threading': [
    { text: 'Reaming is for…', options: ['sizing a hole to an exact diameter', 'making threads', 'sawing', 'filing'], correctAnswer: 'sizing a hole to an exact diameter' },
    { text: 'The tap-drill size comes from…', options: ['a standard table', 'a guess', 'the biggest drill', 'the colour'], correctAnswer: 'a standard table' },
    { text: 'Tapping motion is…', options: ['forward and back to break the chip', 'one continuous turn', 'backwards only', 'random'], correctAnswer: 'forward and back to break the chip' },
    { text: 'A die is used for…', options: ['external threads on a rod', 'internal threads', 'holes', 'reaming'], correctAnswer: 'external threads on a rod' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Keys & Pins — The Mechanical Locks': [
    { text: 'A sunk key…', options: ['transmits torque between shaft and hub', 'aligns two parts', 'locates precisely', 'seals'], correctAnswer: 'transmits torque between shaft and hub' },
    { text: 'A dowel pin…', options: ['aligns two parts', 'transmits torque', 'is decorative', 'seals'], correctAnswer: 'aligns two parts' },
    { text: 'A key that rocks in its keyway…', options: ['is a bad fit — slip and shear risk', 'is fine', 'is normal', 'self-fixes'], correctAnswer: 'is a bad fit — slip and shear risk' },
    { text: 'A sliding fit means…', options: ['a firm hand push', 'a hammer', 'a press', 'no assembly'], correctAnswer: 'a firm hand push' },
  ],
  'Threads & Fasteners — Bolts, Nuts, Studs': [
    { text: 'The metric thread system measures pitch in…', options: ['millimetres', 'inches', 'centimetres', 'grams'], correctAnswer: 'millimetres' },
    { text: 'A metric nut on an inch bolt…', options: ['does not fit — never force', 'fits always', 'is fine if oiled', 'is standard'], correctAnswer: 'does not fit — never force' },
    { text: 'The thread\'s major diameter is…', options: ['the largest diameter of the thread', 'the smallest', 'the pitch', 'the length'], correctAnswer: 'the largest diameter of the thread' },
    { text: 'Fasteners are…', options: ['cleaned, matched and never forced', 'used dirty', 'forced together', 'interchangeable'], correctAnswer: 'cleaned, matched and never forced' },
  ],
  'Assembly & Fits — Sliding, Driving, Pressing': [
    { text: 'A clearance fit gives…', options: ['free rotation (like a bearing)', 'no movement', 'a pressed joint', 'a weld'], correctAnswer: 'free rotation (like a bearing)' },
    { text: 'A drive fit needs…', options: ['a hammer', 'hand pressure', 'a wrench', 'heat always'], correctAnswer: 'a hammer' },
    { text: 'A press fit needs…', options: ['the press', 'a hammer tap', 'hand push', 'nothing'], correctAnswer: 'the press' },
    { text: 'For a shrink fit you…', options: ['heat the hub', 'hammer the shaft', 'cool the hub', 'press cold'], correctAnswer: 'heat the hub' },
  ],
  'Reading Engineering Drawings for Fitting': [
    { text: 'The dimension 30 ± 0.05 means…', options: ['30 mm within 0.05 tolerance', '30 cm', '30 inches', 'a guess'], correctAnswer: '30 mm within 0.05 tolerance' },
    { text: 'The datum is…', options: ['the reference everything is measured from', 'the title', 'the scale', 'the colour'], correctAnswer: 'the reference everything is measured from' },
    { text: 'Surface finish symbols…', options: ['tell the required smoothness', 'show the colour', 'are decoration', 'are optional'], correctAnswer: 'tell the required smoothness' },
    { text: 'The parts list in an assembly drawing gives…', options: ['the parts and the assembly order', 'only names', 'the price', 'nothing'], correctAnswer: 'the parts and the assembly order' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'The Project — A Fitted Assembly from Start to Finish': [
    { text: 'The project flow is…', options: ['drawing → mark → cut/file → drill/ream → fit → assemble', 'assemble first', 'no checks', 'random'], correctAnswer: 'drawing → mark → cut/file → drill/ream → fit → assemble' },
    { text: 'The discipline is…', options: ['work from the datum and check as you go', 'work fast', 'skip checks', 'guess'], correctAnswer: 'work from the datum and check as you go' },
    { text: 'The final self-check includes…', options: ['dimensions, square, fits and assembly', 'nothing', 'the colour', 'the weight'], correctAnswer: 'dimensions, square, fits and assembly' },
    { text: 'A proper assembly has…', options: ['moving parts free and fits correct', 'stuck parts', 'forced fits', 'missing pins'], correctAnswer: 'moving parts free and fits correct' },
  ],
  "Quality & Inspection — The Fitter's Eye": [
    { text: 'Inspection asks…', options: ['is it flat, square, to size and to the drawing?', 'is it shiny?', 'is it heavy?', 'nothing'], correctAnswer: 'is it flat, square, to size and to the drawing?' },
    { text: 'The best time to inspect is…', options: ['after roughing, before too much metal is gone', 'at the very end', 'never', 'after it fails'], correctAnswer: 'after roughing, before too much metal is gone' },
    { text: 'The fitter proves the part…', options: ['with instruments, never assumption', 'by eye', 'by feel only', 'by luck'], correctAnswer: 'with instruments, never assumption' },
    { text: 'The fitter\'s eye is…', options: ['measurement plus judgement', 'only measurement', 'only luck', 'only speed'], correctAnswer: 'measurement plus judgement' },
  ],
  'Maintenance & Repair — The Fitter at Work': [
    { text: 'Preventive maintenance…', options: ['lubricates and checks on schedule', 'waits for breakdowns', 'is optional', 'is for machines'], correctAnswer: 'lubricates and checks on schedule' },
    { text: 'Repair means…', options: ['diagnosing what wore and why', 'replacing everything', 'waiting', 'oiling only'], correctAnswer: 'diagnosing what wore and why' },
    { text: 'A maintenance log…', options: ['turns failures into a pattern', 'is extra work', 'is for managers', 'is private'], correctAnswer: 'turns failures into a pattern' },
    { text: 'A worn key or bearing…', options: ['is replaced before it fails', 'is ignored', 'is welded', 'is painted'], correctAnswer: 'is replaced before it fails' },
  ],
  'The Fitter Trade Career': [
    { text: 'This course is…', options: ['a supplement that builds trade skills', 'a government certificate', 'a degree', 'an exam pass'], correctAnswer: 'a supplement that builds trade skills' },
    { text: 'The official trade certificate…', options: ['remains governed by the recognised trade authority', 'comes from this course', 'is automatic', 'is not needed'], correctAnswer: 'remains governed by the recognised trade authority' },
    { text: 'Career directions include…', options: ['fitting, machining, CNC and inspection', 'only one job', 'no growth', 'only sales'], correctAnswer: 'fitting, machining, CNC and inspection' },
    { text: 'The fitter who is always in demand…', options: ['measures twice and checks every job', 'works fastest', 'is the strongest', 'is the loudest'], correctAnswer: 'measures twice and checks every job' },
  ],
};
