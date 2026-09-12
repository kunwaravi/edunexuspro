/**
 * ITI Fitter — Workshop Measurement & Fitting — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in iti-fitter_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 *
 * Supplementary skill-building for fitter trade aspirants. This course is
 * a learning supplement only — it does NOT grant or replace any government
 * trade certificate; that remains governed by the official trade authority.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Workshop Safety & Tools ─────────────────────────────────────────
  {
    week: 1,
    title: 'Workshop Safety & Tools',
    description: 'A safe workshop and well-kept hand tools are the foundation of every good fitter.',
    topics: [
      {
        title: 'Workshop Safety — The Fitter\'s First Skill',
        text: 'The workshop has real hazards: cutting, flying chips, moving machines, heavy parts. Safety is a system: proper clothing (fitted, no loose sleeves, no jewellery), safety glasses always, hair tied back, and safe footwear.\n\nHousekeeping is safety: clean floors, tools returned, offcuts cleared, and machines guarded. Most workshop accidents are slips, trips and unguarded work — all preventable.\n\nThe rules that never bend: no gloves near rotating machines (they get caught), machines stopped before adjustment, one person per machine job, and the emergency stop known before you start. A tidy fitter is a safe fitter.',
        code: '// Personal\nFitted clothing · safety glasses · hair tied\nSafe footwear · no jewellery · no gloves near rotation\n\n// Housekeeping\nClean floors · tools returned · offcuts cleared\n\n// Machines\nGuards on · stopped before adjustment\nEmergency stop — know where it is BEFORE you start',
        note: 'Safety is personal, housekeeping and machine discipline together. A tidy fitter is a safe fitter.',
      },
      {
        title: 'Hand Tools — Know Them, Care for Them',
        text: 'The fitter\'s daily kit: hammers (ball-peen, soft-face), files, chisels, hacksaws, screwdrivers, pliers, wrenches and spanners. Each tool has a job and a correct use.\n\nThe discipline of good tools: use the right tool for the job (a wrench, not pliers, on a nut), use the tool the right way (push the file, pull the saw), and put tools back after use.\n\nCare: clean after use, oil lightly, keep cutting edges protected, never use a damaged tool, and store them so edges don\'t knock together. A cared-for tool lasts a career; an abused one fails at the worst moment.',
        code: '// The fitter\'s kit\nHammers · Files · Chisels · Hacksaw\nScrewdrivers · Pliers · Spanners · Wrenches\n\n// Use\nRight tool for the job\nFile pushes · saw pulls\n\n// Care\nClean + oil after use\nProtect cutting edges\nNever use damaged tools',
        note: 'Right tool, right way, put it back. Care for the tool and it carries you for a career.',
      },
      {
        title: 'Measuring Basics — Precision Starts Here',
        text: 'Fitting is about size, and size means measurement. The basic instruments: the steel rule, the vernier caliper, and the micrometer. Precision starts with reading them correctly.\n\nThe steel rule gives 0.5 mm at best; the vernier caliper reads to 0.02 mm; the micrometer to 0.01 mm. Know which accuracy the job needs — measure a 30 mm shaft to 0.5 mm with a rule is wrong; to 0.02 mm with a vernier is right.\n\nMeasurement discipline: clean surfaces before measuring, measure at the right place (not worn spots), read squarely to avoid parallax, and record the reading. A good measurement is repeatable — measure twice and agree.',
        code: '// Accuracy ladder\nSteel rule — 0.5 mm\nVernier caliper — 0.02 mm\nMicrometer — 0.01 mm\n\n// Use the right tool for the required accuracy\n\n// Discipline\nClean surfaces\nMeasure at the right place\nRead squarely (no parallax)\nMeasure twice — they must agree',
        note: 'Match the tool to the accuracy the job needs. Clean, square, repeatable measurements.',
      },
      {
        title: 'Bench Work — The Vise, Filing & Clean Practice',
        text: 'The bench vise holds the work: parallel jaws, the work held level and not over-tightened, soft jaws for finished parts. Bench discipline — the work held correctly — makes every following operation accurate.\n\nFiling practice on the bench: the file cuts on the push stroke, body weight drives it, hold the file level, and lift on the return. Check flatness with a straight edge and square.\n\nClean practice: a clean bench, chips swept away, work lightly oiled, and the vice cleaned after use. The bench is where the fitter\'s habits are born — accuracy, tidiness and patience.',
        code: '// Vise work\nWork held level, not over-tightened\nSoft jaws for finished parts\n\n// Filing\nPush stroke cuts (body weight)\nHold the file level\nLift on the return stroke\n\n// Check\nStraight edge for flatness\nTry-square for squareness',
        note: 'The bench is the birthplace of the fitter\'s habits: hold work right, file level, check your result.',
      },
    ],
    quizzes: [
      { text: 'Near rotating machines you never wear…', options: ['gloves or loose clothing', 'safety glasses', 'shoes', 'nothing'], correctAnswer: 'gloves or loose clothing' },
      { text: 'The file cuts on…', options: ['the push stroke', 'the pull stroke', 'both', 'neither'], correctAnswer: 'the push stroke' },
      { text: 'A vernier caliper reads to…', options: ['0.02 mm', '0.5 mm', '1 mm', '0.01 m'], correctAnswer: '0.02 mm' },
      { text: 'Work held in the vice should be…', options: ['level and not over-tightened', 'wobbling', 'loose', 'crooked'], correctAnswer: 'level and not over-tightened' },
    ],
  },

  // ── W2 · Measurement & Marking ───────────────────────────────────────────
  {
    week: 2,
    title: 'Measurement & Marking',
    description: 'Reading instruments exactly and transferring dimensions to the workpiece with precision.',
    topics: [
      {
        title: 'The Vernier Caliper — Read It Correctly',
        text: 'The vernier caliper measures outside, inside and depth with a main scale and a sliding vernier scale. Reading: note the main-scale value just before the vernier zero, then find the vernier line that aligns with a main line — that line\'s number is the fraction.\n\nExample: main scale reads 23 mm, and the 4th vernier line aligns → 23.40 mm (if each vernier division is 0.05 mm).\n\nPractice the reading ritual: clean the jaws, close gently on the work, read squarely, and re-check. A reading is only a number if you can repeat it.',
        code: '// How to read\n1. Main scale: value before the vernier zero\n2. Vernier: the aligned line\n3. Add: main + vernier fraction\n\n// Example\nMain 23 mm + 4th line (0.20 mm) = 23.20 mm\n\n// Ritual\nClean jaws → close gently → read squarely → repeat',
        note: 'Read the main scale, find the aligned vernier line, add them. Repeat until the reading agrees.',
      },
      {
        title: 'The Micrometer — 0.01 mm Accuracy',
        text: 'The micrometer reads to 0.01 mm: a thimble rotates on a screw thread, each full turn moving 0.5 mm (for a 0.5 mm pitch). The sleeve shows whole and half millimetres; the thimble shows hundredths.\n\nReading: read the sleeve (e.g., 12.5 mm), then the thimble line (e.g., 18 → 0.18 mm), and add → 12.68 mm.\n\nUse: only with the ratchet (never force the spindle), on clean work, and held squarely. Zero it first (check the zero reading against a gauge block) and record. The micrometer is the standard of shop measurement — treat it like a precision instrument, because it is one.',
        code: '// Read\nSleeve 12.5 mm + Thimble 18 (0.18 mm) = 12.68 mm\n\n// Use\nRatchet only — never force\nClean work, held square\nZero-check before measuring\n\n// Care\nHandle as a precision instrument\nStore in its box',
        note: 'Ratchet only, read sleeve + thimble, zero-check first. The micrometer is shop-standard precision.',
      },
      {
        title: 'Gauges & Comparators — Quick Checks',
        text: 'Beyond direct measurement come the gauges: the slip gauge (the master standard), the plug gauge for holes, the ring gauge for shafts, the feeler gauge for gaps, and the dial indicator/comparator for fine deflection.\n\nGauges give GO/NO-GO answers fast: a plug gauge with a GO end and a NO-GO end tells a hole\'s fit in one second. Feelers measure the gap that a rule can\'t reach. A dial indicator measures small movements — runout, flatness, parallelism.\n\nGauge care: never force a gauge, keep them clean and oiled, and store slip gauges in their box, wrung and protected. A gauge is a standard — misuse turns it into a random piece of steel.',
        code: '// The gauge family\nSlip gauges — master standard\nPlug gauge — holes (GO/NO-GO)\nRing gauge — shafts\nFeeler gauge — gaps\nDial indicator — small movements\n\n// Care\nNever force · clean · oiled · boxed',
        note: 'Gauges are the quick answer: GO/NO-GO in a second, feelers for gaps, indicators for movement.',
      },
      {
        title: 'Marking Out — Transferring the Drawing to Metal',
        text: 'Marking out transfers dimensions from the drawing to the workpiece: a datum surface first, then lines, then the profile. Tools: the surface plate, the scriber, the try-square, dividers, the odd-leg caliper, the centre punch, and marking dye for visibility.\n\nMethod: prepare the datum (a flat surface and square edges), apply the dye, scribe from the datum, punch the important points (centres, hole locations) with the centre punch.\n\nThe marking must be unmistakable and accurate: fine scribed lines, accurate centres, correct from the datum. A punch mark can be off by a millimetre and ruin a hole location — centre punch accuracy is real skill.',
        code: '// Tools\nSurface plate · scriber · try-square\nDividers · odd-leg caliper · centre punch · dye\n\n// Method\nDatum first → dye → scribe from datum → punch centres\n\n// Accuracy\nScribed lines fine and clear\nCentres punched accurately\nEverything from the datum',
        note: 'Mark from the datum, scribe fine, punch centres accurately. Marking out carries every later step.',
      },
    ],
    quizzes: [
      { text: 'The vernier reading is…', options: ['main scale + aligned vernier line', 'only the main scale', 'only the vernier', 'a guess'], correctAnswer: 'main scale + aligned vernier line' },
      { text: 'The micrometer reads to…', options: ['0.01 mm', '0.5 mm', '1 mm', '0.1 cm'], correctAnswer: '0.01 mm' },
      { text: 'A plug gauge answers…', options: ['GO/NO-GO in one second', 'the temperature', 'the hardness', 'nothing'], correctAnswer: 'GO/NO-GO in one second' },
      { text: 'Marking out starts from…', options: ['the datum surface', 'the corners', 'the middle', 'anywhere'], correctAnswer: 'the datum surface' },
    ],
  },

  // ── W3 · Metal Removal — Filing, Sawing, Drilling ────────────────────────
  {
    week: 3,
    title: 'Metal Removal — Filing, Sawing, Drilling',
    description: 'Shaping metal by hand: filing flat and square, sawing to line, and accurate hole-making.',
    topics: [
      {
        title: 'Filing — Flat, Square and to Size',
        text: 'Filing is the fitter\'s signature skill: removing metal with a file to make a surface flat, square and to size. Choose the file by job — flat file for flat work, square/round/triangular for their shapes, coarse for stock removal, smooth for finishing.\n\nTechnique: push stroke cuts, body weight and rhythm, hold the file level and flat on the work, and cross-file or draw-file for flatness. Check constantly with the straight edge and try-square.\n\nThe goal: a surface that is flat (no rocking under a straight edge), square to its neighbour, and exactly to the scribed size. File, check, file — the check is what makes the skill.',
        code: '// File selection\nCoarse — stock removal\nSmooth — finishing\nFlat/square/round/triangular — shape\n\n// Technique\nPush stroke cuts · level · rhythm\nCross-file or draw-file for flatness\n\n// Check loop\nStraight edge (flat) · try-square (square)\nFile → check → file',
        note: 'File, check, file. Flat under the straight edge, square to the neighbour, exact to the line.',
      },
      {
        title: 'Sawing — The Hacksaw to the Line',
        text: 'The hacksaw cuts metal: a frame with a blade, teeth set to the work. Choose the blade by pitch — fewer teeth per inch (coarse) for soft metal and thick sections, more teeth per inch (fine) for hard metal and thin sections.\n\nTechnique: the saw cuts on the PUSH stroke, use the full blade length, keep the blade straight and in the line, light and even pressure, and start with a shallow notch to keep the blade from wandering.\n\nSaw to the line, never through it: leave the scribed line — saw just outside, then file to the line. A cut through the line is a scrap part. Patience and straightness are the whole game.',
        code: '// Blade pitch\nCoarse (fewer TPI) — soft/thick\nFine (more TPI) — hard/thin\n\n// Technique\nPush stroke cuts\nFull blade length\nStart with a shallow notch\n\n// Rule\nSaw OUTSIDE the line, then file to it',
        note: 'Push the saw, use the full blade, and cut outside the line — file to the line, never through it.',
      },
      {
        title: 'Drilling — Accurate Holes, Safe Practice',
        text: 'Drilling makes holes: a drill bit turning in a drilling machine or portable drill. Choose the bit for the material (HSS for steel), centre-punch the location, and drill with speed and feed suited to the material.\n\nSequence: centre punch → pilot hole (small) → final size. Lubricate/cool steel with cutting oil; use proper speeds (slow for large bits and hard metal). Clamp the work — never hold it by hand against a machine drill.\n\nSafety: no gloves near the spindle, chips cleared with a brush (never fingers), work clamped, and the machine stopped before clearing. An accurate hole starts with an accurate punch mark and a square start.',
        code: '// Sequence\nCentre punch → pilot hole → final size\n\n// Practice\nClamp the work — never hold by hand\nCutting oil for steel\nSpeed down as bit size up\n\n// Safety\nNo gloves · brush chips · machine stopped to clear',
        note: 'Punch, pilot, then size — with the work clamped and oil flowing. Start square, stay square.',
      },
      {
        title: 'Reaming, Tapping & Threading',
        text: 'Finishing holes and making threads: reaming sizes a drilled hole to a precise diameter; tapping cuts internal threads; dies cut external threads (on a rod).\n\nTapping: drill the tap-size hole (a table gives the drill for each tap), start the tap square to the hole, turn forward and back to break the chip, and use tapping oil. A tap started crooked stays crooked — alignment is everything.\n\nDie work: chamfer the rod end, start the die square, and cut slowly with oil. Threads are the fitter\'s standard connection — a clean, square, lubricated thread is a professional thread.',
        code: '// Reaming\nDrill undersize → ream to the exact diameter\n\n// Tapping\nTap-drill size from a table\nStart square · turn forward and back\nTapping oil\n\n// Dies\nChamfer the rod · start square · cut with oil',
        note: 'Square start, forward-and-back, oil always. A clean thread is a professional signature.',
      },
    ],
    quizzes: [
      { text: 'The filing check loop is…', options: ['file, check, file', 'file once', 'never check', 'guess'], correctAnswer: 'file, check, file' },
      { text: 'The hacksaw cuts…', options: ['on the push stroke', 'on the pull stroke', 'both', 'never'], correctAnswer: 'on the push stroke' },
      { text: 'The drilling sequence is…', options: ['centre punch → pilot → final size', 'final size first', 'no punch', 'hand-held'], correctAnswer: 'centre punch → pilot → final size' },
      { text: 'A tap started crooked…', options: ['stays crooked — alignment is everything', 'self-corrects', 'is fine', 'fixes itself'], correctAnswer: 'stays crooked — alignment is everything' },
    ],
  },

  // ── W4 · Fitting Practice ────────────────────────────────────────────────
  {
    week: 4,
    title: 'Fitting Practice',
    description: 'Fitting parts together: keys and pins, threads and fasteners, assembly, and reading drawings.',
    topics: [
      {
        title: 'Keys & Pins — The Mechanical Locks',
        text: 'Keys and pins lock parts together on shafts. A key sits in a keyway and transmits torque between a shaft and a hub (pulley, gear, coupling); a taper pin locks collars and shafts and provides precise location; a dowel pin aligns two parts.\n\nThe fitter\'s jobs: cut the keyway, fit the key (it must sit snug in the hub and shaft, with the correct fit — not rocking), and drive/remove pins with the right punches.\n\nFits matter: a key too loose slips and shears; too tight won\'t assemble. The feel — a firm hand push for a sliding fit, a light tap for a drive fit — is part of the skill. Measure, fit, feel, correct.',
        code: '// Types\nSunk key — in a shaft keyway, transmits torque\nTaper pin — locks + precise location\nDowel pin — aligns two parts\n\n// Fitting\nKey snug in keyway — no rock, correct fit\nCorrect punches to drive pins\n\n// Feel\nSliding = firm hand push\nDrive = light tap',
        note: 'Keys transmit torque, pins locate and align. Fit snug, drive straight, feel the fit.',
      },
      {
        title: 'Threads & Fasteners — Bolts, Nuts, Studs',
        text: 'Threads connect everything. The terminology: major diameter, pitch, right/left-hand, V-thread, and the systems — metric (ISO, the standard in most of the world) with pitch in millimetres, and BSW/UNC in inches.\n\nIdentify a thread: measure the major diameter and count the pitch (threads per inch or millimetre pitch), then choose the matching fastener. A metric nut on an inch bolt does not fit — forcing it destroys both.\n\nFastener practice: studs, bolts, setscrews and nuts, with correct torque and a washer where the surface needs protection. Threads are a precision connection — cleaned, matched, and never forced.',
        code: '// Thread terms\nMajor diameter · pitch · hand · form\n\n// Systems\nMetric (ISO): pitch in mm — the standard\nInch: BSW / UNC\n\n// Identify\nMeasure diameter + pitch → match the fastener\n\n// Never\nForce a metric nut onto an inch bolt',
        note: 'Identify the thread, match the fastener, never force. Threads are precision connections.',
      },
      {
        title: 'Assembly & Fits — Sliding, Driving, Pressing',
        text: 'Assembly is where fits become real. Fits classify the clearance between mating parts: clearance fits (shaft rotates in a bearing), transition fits (near-perfect location), and interference fits (shaft pressed into a hub).\n\nThe fitter feels the fit: a running fit turns freely, a push fit goes with firm hand pressure, a drive fit needs a hammer, a press fit needs the press. Assembling to the right fit, without damage, is a core skill.\n\nAssembly discipline: clean parts, align keyways and marks, use the correct tools (soft hammer, correct punches, a press for press fits), and heat where a shrink fit is intended (the hub heated, not the shaft hammered).',
        code: '// Fit families\nClearance — free rotation (bearing)\nTransition — precise location\nInterference — pressed (hub on shaft)\n\n// Feel\nRunning = turns freely\nPush = firm hand\nDrive = hammer\nPress = the press\n\n// Shrink fit\nHeat the HUB, never hammer the shaft',
        note: 'Feel the fit, assemble clean, and use the right method — heat the hub for a shrink fit.',
      },
      {
        title: 'Reading Engineering Drawings for Fitting',
        text: 'The drawing is the job specification: views (front, side, plan), dimensions, tolerances, and the notes (material, surface finish, treatment). The fitter reads what must be made, not just what is drawn.\n\nKey symbols: the dimension with its tolerance (e.g., 30 ± 0.05), the surface finish symbols, the datum for measurement, and the parts list for an assembly drawing.\n\nRead for the job: identify the datum, the critical dimensions, the fits (H7/g6 style tolerances), and the order of assembly. A fitter who reads drawings well can build what a designer drew — without guessing.',
        code: '// Read\nViews: front · side · plan\nDimensions + tolerances (30 ± 0.05)\nSurface finish symbols\nDatum\n\n// Assembly drawing\nParts list → fit order → critical fits\n\n// The goal\nBuild what is drawn, never guess',
        note: 'The drawing is the spec: datum, tolerances, finish, assembly order. Read it, don\'t guess it.',
      },
    ],
    quizzes: [
      { text: 'A sunk key transmits…', options: ['torque between shaft and hub', 'heat', 'electricity', 'nothing'], correctAnswer: 'torque between shaft and hub' },
      { text: 'A metric nut on an inch bolt…', options: ['does not fit — forcing destroys both', 'fits fine', 'is fine if oiled', 'fits always'], correctAnswer: 'does not fit — forcing destroys both' },
      { text: 'An interference fit needs…', options: ['a press or shrink fit', 'a sliding action', 'hand push', 'nothing'], correctAnswer: 'a press or shrink fit' },
      { text: 'The drawing\'s datum is…', options: ['the reference everything is measured from', 'the title', 'the colour', 'optional'], correctAnswer: 'the reference everything is measured from' },
    ],
  },

  // ── W5 · The Trade Project & Career ──────────────────────────────────────
  {
    week: 5,
    title: 'The Trade Project & Career',
    description: 'A complete fitting project, quality and inspection, maintenance, and the fitter\'s career path.',
    topics: [
      {
        title: 'The Project — A Fitted Assembly from Start to Finish',
        text: 'The capstone exercises every skill: make a small assembly — for example a tool post or a stepped shaft with a keyed pulley and a fitting block. Steps: read the drawing, mark out, cut and file to size, drill and ream, fit the key and pins, and assemble.\n\nRun it like a real job: work from the datum, check as you go, keep the fits right, and finish with the assembly assembled and the parts moving as intended.\n\nSelf-check before you finish: all dimensions within tolerance, square and flat, fits correct, moving parts free, and the assembly complete per the parts list. The project is the course in one piece.',
        code: '// Project flow\nRead drawing → mark out → saw/file →\ndrill/ream → fit key/pins → assemble\n\n// Discipline\nWork from the datum\nCheck as you go\nFits right, parts free\n\n// Final check\nDims in tolerance ✓  Square ✓  Fits ✓  Assembly ✓',
        note: 'One job, every skill. Work from the datum, check as you go, finish with a free-moving assembly.',
      },
      {
        title: 'Quality & Inspection — The Fitter\'s Eye',
        text: 'Quality is not luck; it is checking. Inspection asks: is it flat, square, to size, the right fit, and to the drawing? The instruments you learned — straight edge, try-square, vernier, micrometer, gauges — are the inspection toolkit.\n\nInspect at the right times: after roughing (before too much metal is gone), after finishing (the final size), and at assembly (the fit). Inspection early catches a scrap part before it becomes a finished scrap part.\n\nThe fitter\'s eye is measurement plus judgement: the reading and the feel, the drawing and the part. Never assume the part is right — prove it with the instrument.',
        code: '// What to check\nFlat · square · to size · right fit · to drawing\n\n// When to check\nAfter roughing — before too much metal is gone\nAfter finishing — final size\nAt assembly — the fit\n\n// Prove it\nNever assume — measure and verify',
        note: 'Inspect early, inspect often, prove with instruments. The fitter\'s eye is measurement plus judgement.',
      },
      {
        title: 'Maintenance & Repair — The Fitter at Work',
        text: 'Beyond making parts, the fitter maintains and repairs: cleaning, lubrication, adjustment, and replacing worn parts. Machinery maintenance is the fitter\'s bread and butter.\n\nMaintenance routines: regular lubrication per schedule, checking for wear and play (bearings, keys, threads), tightening and adjusting, and replacing worn parts before they fail. Repair means diagnosing the failure — what wore, why, and the correct fix.\n\nKeep records: what was checked, what was worn, what was replaced. A maintenance log turns "something keeps failing" into a pattern. The fitter who keeps the plant running is worth more than the one who waits for the breakdown.',
        code: '// Maintenance\nLubricate on schedule\nCheck wear and play\nTighten and adjust\nReplace before failure\n\n// Repair\nDiagnose — what wore, why\nFix the root cause, not the symptom\n\n// Records\nChecked · worn · replaced → pattern',
        note: 'Maintain on schedule, diagnose the failure, and keep records. The pattern is the diagnosis.',
      },
      {
        title: 'The Fitter Trade Career',
        text: 'This course built the fundamentals — safety, measurement, marking, hand operations, fitting and reading drawings — a supplement that prepares you for the trade\'s real duties. Your official trade certificate remains governed by the recognised trade authority; this course strengthens the skills behind it.\n\nCareer directions: machine-shop fitting, assembly and maintenance, toolroom work, and — with further study — machining (lathe/milling), CNC operation, or quality inspection.\n\nGrow on the job: watch the senior fitters, ask the "why" behind every technique, keep a fault log, practise your measurements daily, and never let speed replace accuracy. The fitter who measures twice, fits clean and checks every job is always in demand.',
        code: '// What you now have\n✓ Workshop safety + tools\n✓ Measurement + marking out\n✓ Filing, sawing, drilling, threading\n✓ Fitting: keys, pins, fasteners, assembly\n✓ Drawing reading + quality\n\n// The map forward\nFitting → Machining → CNC / toolroom → Inspection',
        note: 'Measure twice, fit clean, check every job. The careful fitter is always in demand.',
      },
    ],
    quizzes: [
      { text: 'The project runs…', options: ['from drawing to assembly with checks as you go', 'without checking', 'in reverse', 'randomly'], correctAnswer: 'from drawing to assembly with checks as you go' },
      { text: 'The best time to inspect is…', options: ['early, before too much metal is gone', 'at the very end', 'never', 'after it breaks'], correctAnswer: 'early, before too much metal is gone' },
      { text: 'A maintenance log…', options: ['turns failures into patterns', 'is extra work', 'is for managers', 'is private'], correctAnswer: 'turns failures into patterns' },
      { text: 'This course is…', options: ['a supplement that builds trade skills', 'a government certificate', 'a degree', 'an exam pass'], correctAnswer: 'a supplement that builds trade skills' },
    ],
  },
];
