/**
 * PCB Design — Schematic to Manufactured Board — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in pcb-design_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · The PCB & the Design Flow ───────────────────────────────────────
  {
    week: 1,
    title: 'The PCB & the Design Flow',
    description: 'What a printed circuit board actually is, how boards are built, and the design flow from idea to board.',
    topics: [
      {
        title: 'What a PCB Is — Copper, Glass & Solder Mask',
        text: 'A printed circuit board (PCB) is a mechanical platform and the electrical wiring of a product, all in one. A core of glass-fibre epoxy (FR-4) is clad with copper. Etching removes the unwanted copper, leaving traces — the wires. A solder mask covers everything except the pads, and silkscreen prints reference designators, outlines and labels.\n\nLayers: a two-layer board has copper on the top and bottom, with vias (plated holes) connecting them. A four-layer board adds internal planes — usually power and ground. More layers mean more routing room but higher cost.\n\nKnow the vocabulary: trace, pad, via, hole, footprint, silkscreen, solder mask. Every one of them shows up in your design tool and on your manufactured board.',
        code: '// Stack-up: two-layer board, top to bottom\n1. Silkscreen (labels)\n2. Solder mask (green, keeps solder where it belongs)\n3. Copper top (traces, pads)\n4. FR-4 core (the fibreglass body)\n5. Copper bottom\n6. Solder mask\n\n// Plated through-hole via connects top to bottom',
        note: 'A PCB is copper wiring on a fibreglass board, masked and labelled. Vias stitch the layers together.',
      },
      {
        title: 'How Boards Are Made — Etching & Plating',
        text: 'Manufacturing starts from a photo-pattern of your copper. A light-sensitive resist is exposed through the film and developed, then etchant dissolves the exposed copper, leaving your traces. Holes are drilled, then plated to connect layers.\n\nThe key reality: the fab house sees your Gerber files (a per-layer image format) and CAM software interprets them. Design for this machine — clearances, hole sizes and copper widths must meet its minimums.\n\nCost drivers: board size, layer count, board thickness, hole count, surface finish and quantity. A simple two-layer board is cheap; a tiny 4-layer HDI board is not.',
        code: '// The fab flow\nGerbers → film → expose resist → develop →\netch copper → strip resist → drill → plate holes →\nsolder mask → silkscreen → finish → route → test\n\n// Cost levers\nSize ↓  Layers ↓  Holes ↓  Standard finish → cheaper\n\n// Panelisation: many boards on one panel, v-scored, snapped apart',
        note: 'Etching defines the copper, drilling and plating build the vias. Gerber files are the language of the fab.',
      },
      {
        title: 'The Design Flow — Schematic to Gerber',
        text: 'Every board project runs the same pipeline: requirements → schematic → simulation/check → layout → routing → design-rule check → generate manufacturing files (Gerbers + drill) → order → build → test.\n\nThe schematic is the logical wiring; the layout is the physical placement and routing. The design rule check (DRC) catches violations: traces too close, pads shorted, holes too small. Never skip it.\n\nPlan the whole flow before starting: what connectors, what power, what stack-up, what size. The biggest time sink in PCB design is redoing layout because the schematic was wrong.',
        code: '// The pipeline\n1. Requirements (what does it do, what connects)\n2. Schematic (logical wiring, verified with ERC)\n3. Footprints (physical pads for each part)\n4. Placement (parts where they belong)\n5. Routing (copper connections)\n6. DRC (rules check) + review\n7. Gerbers + drill files\n8. Order, build, test, revise',
        note: 'Schematic first, layout second, DRC before you order. Fix errors in the schematic, not the board.',
      },
      {
        title: 'Setting Up KiCad — Your First Project',
        text: 'KiCad is the free, open-source PCB toolchain: Eeschema (schematic), Pcbnew (layout), and integrated footprint, symbol and Gerber tools. It is the industry-standard free choice.\n\nCreate a project (a .kicad_pro file holds everything), set your preferences, and pick libraries: symbols are logical components (resistor, MCU); footprints are the physical pads (through-hole, SMD). Every symbol needs a footprint at layout time.\n\nLearn the navigation before drawing: zoom, pan, grid snapping, and the hotkeys (E to edit, R to rotate, X to place wire, M to move). A clean setup saves hours.',
        code: '// KiCad project anatomy\nname.kicad_pro   — the project file\nname.kicad_sch  — schematic sheets\nname.kicad_pcb  — the layout\n*.kicad_sym     — symbol libraries\n*.kicad_mod     — footprint libraries\n\n// The flow inside KiCad\nEeschema → draw symbols + wires → assign footprints\n→ Pcbnew → place parts → route → DRC → plot Gerbers',
        note: 'KiCad = Eeschema + Pcbnew + libraries. Symbols are logic; footprints are physical pads.',
      },
    ],
    quizzes: [
      { text: 'A PCB\'s electrical wiring is made of…', options: ['copper traces on a fibreglass core', 'wires soldered by hand', 'silkscreen', 'solder mask'], correctAnswer: 'copper traces on a fibreglass core' },
      { text: 'A via is…', options: ['a plated hole connecting layers', 'a label', 'a component', 'a copper pad'], correctAnswer: 'a plated hole connecting layers' },
      { text: 'The manufacturing files sent to the fab are…', options: ['Gerbers plus drill files', 'PDF files', 'photos', 'spreadsheets'], correctAnswer: 'Gerbers plus drill files' },
      { text: 'KiCad is…', options: ['a free open-source PCB toolchain', 'a paid FPGA tool', 'a 3D printer', 'a soldering station'], correctAnswer: 'a free open-source PCB toolchain' },
    ],
  },

  // ── W2 · Schematic Capture ───────────────────────────────────────────────
  {
    week: 2,
    title: 'Schematic Capture',
    description: 'Turning the circuit idea into a clean, verifiable schematic in Eeschema.',
    topics: [
      {
        title: 'Components & Symbols in Eeschema',
        text: 'Symbols are the logical drawing of a part: pins for every connection, a reference designator (R1, C1, U1), a value, and a footprint assignment. Choose symbols from libraries — resistor, capacitor, LED, MCU — or draw your own for odd parts.\n\nEvery pin must map to a real package pin. The symbol library tells the tool the electrical model; the footprint library tells it the physical pads. They must agree on pin count and names.\n\nGood symbols are unambiguous: power pins labelled, functions grouped, and a symbol that matches the datasheet pinout. A messy symbol invites a wrong layout.',
        code: '// A resistor symbol in the schematic\nR1  —  reference designator\n10 kΩ  —  value\nResistor_SMD_R0603  —  footprint\n\n// Symbol vs footprint\nSymbol   = logical (pins, function)\nFootprint = physical (pads, size, pitch)',
        note: 'Symbols are logic, footprints are physical. Keep them matched and tidy.',
      },
      {
        title: 'Wiring, Net Labels & Power Symbols',
        text: 'Wiring connects pins: click pin to pin to draw a wire. A junction dot means wires connect; a crossing without a dot means they don\'t. Net labels name a signal so you can connect far-apart pins without long wires — everything with the same label is the same net.\n\nPower symbols (VCC, GND) are special net labels for the rails. Global labels tie sheets together.\n\nThe rule that saves boards: every net that matters gets a meaningful name — 5V_PWR, I2C_SDA, MCU_TX — so the layout and review can follow the signal path.',
        code: '// Net labels\nR1.pin2  o── 5V_PWR   (same label = same net anywhere)\n\n// Wire vs label\nWire: a drawn connection between adjacent pins\nLabel: a name that connects across the sheet\n\n// Power symbols\nGND  VCC  — rails, get a symbol not just a wire',
        note: 'Net labels connect distant pins by name. Name your rails and buses — future-you will thank past-you.',
      },
      {
        title: 'Power, Decoupling & the Standard Circuits',
        text: 'Every design has standard sub-circuits: the power rail (regulator with input/output caps), decoupling (a 100 nF cap per IC power pin, plus bulk capacitance), the reset circuit (RC or supervisor IC), and the crystal (two caps, specified by the crystal datasheet).\n\nThe regulator\'s input cap absorbs switching transients; the output cap stabilises the regulator. Decoupling caps sit electrically and physically close to each IC.\n\nCopy these patterns from the chip datasheet\'s application circuits. Datasheets literally give you proven circuits — use them. This is where most beginner boards fail (a missing cap or wrong crystal loading).',
        code: '// 5 V regulator (e.g. AMS1117-5.0)\nVIN ──[10 µF]── REG_IN    REG_OUT ──[10 µF]── VOUT\n                       └──── GND\n\n// Decoupling: 100 nF at every IC VCC pin\n// + a 10 µF bulk cap on the rail\n\n// Crystal: C1, C2 per datasheet (e.g. 22 pF each)',
        note: 'Regulator caps, per-IC decoupling, reset and crystal circuits come straight from the datasheet.',
      },
      {
        title: 'ERC & Schematic Checks Before Layout',
        text: 'The Electrical Rules Check (ERC) runs before layout and flags: unconnected pins, duplicate reference designators, outputs driving outputs, floating inputs, power pins not on the right net.\n\nTreat ERC warnings like compiler warnings: investigate every one. Some are intentional (a connector pin intentionally unconnected) — but each must be understood and explicitly handled, not ignored.\n\nBefore moving to Pcbnew: assign footprints to every symbol, run ERC until clean, and re-read the schematic once for logic errors. An hour here saves a week of layout rework.',
        code: '// Run ERC: Inspect → Electrical Rules Check\n// Common flags\n- Unconnected pin\n- Duplicate reference (two R1s)\n- Output driving output\n- Floating input\n- Power not connected\n\n// Rule: ERC clean before layout. No exceptions.',
        note: 'ERC is your free review pass. Fix every warning; understand and justify every exception.',
      },
    ],
    quizzes: [
      { text: 'A symbol is…', options: ['the logical drawing of a part with pins', 'the physical pads', 'the board outline', 'the Gerber'], correctAnswer: 'the logical drawing of a part with pins' },
      { text: 'A net label…', options: ['connects pins with the same name across the sheet', 'is a wire', 'is a component', 'is a hole'], correctAnswer: 'connects pins with the same name across the sheet' },
      { text: 'Decoupling means…', options: ['a 100 nF cap near each IC power pin', 'thicker traces', 'more vias', 'a larger board'], correctAnswer: 'a 100 nF cap near each IC power pin' },
      { text: 'The ERC check catches…', options: ['unconnected pins and floating inputs', 'thermal problems', 'bend radius', 'panel cost'], correctAnswer: 'unconnected pins and floating inputs' },
    ],
  },

  // ── W3 · Footprints & Placement ──────────────────────────────────────────
  {
    week: 3,
    title: 'Footprints & Placement',
    description: 'Physical footprints, good placement, and the layout discipline that makes routing easy.',
    topics: [
      {
        title: 'Through-Hole vs SMD — Choosing Parts',
        text: 'Through-hole (THT) parts have leads through holes, soldered on the other side. Strong, easy to hand-solder, but big and slow to assemble. Surface-mount (SMD) parts sit on pads on top of the board — smaller, cheaper in volume, machine-assembled, and fine to hand-solder with practice.\n\nThe package code matters: 0603 (imperial) or 1608 (metric) for resistors/caps; SOIC, TQFP and QFN for ICs; each has a standard footprint.\n\nBeginner advice: use SMD where it helps (small parts, high density), THT for connectors and anything that takes mechanical stress. Know how to read a package code — it encodes the pad size and pitch.',
        code: '// SMD resistor packages (imperial vs metric)\n0603  = 0.06" × 0.03"  = 1608 metric (1.6 mm × 0.8 mm)\n0805  = 2.0 mm × 1.25 mm\n\n// IC packages\nSOIC-8   — 8 pins, two rows\nTQFP-48  — 48 pins, four rows\nQFN-32   — no leads, pads under the body\n\n// THT: through-hole, soldered on the far side',
        note: 'SMD for density, THT for strength. Package codes encode the size and pitch of the pads.',
      },
      {
        title: 'Footprints — Pads, Pitch & Verification',
        text: 'A footprint is the copper pad pattern a part sits on: pad shapes and sizes, the pitch between pins, silkscreen outline, and the courtyard (the keep-out zone that stops neighbouring parts).\n\nThe golden rule: verify the footprint against the datasheet\'s mechanical drawing before layout. Wrong pitch or pad size is the classic reason a board won\'t work — the part doesn\'t fit, or pads are so close they solder together.\n\nKiCad footprints come with standard libraries, but every part deserves a check: pin 1 location, pad size vs datasheet, polarity indicators for diodes, caps and LEDs.',
        code: '// Datasheet mechanical drawing gives you\n- Pin pitch\n- Body length/width\n- Pad length/width\n- Pin 1 location\n- Courtyard allowance\n\n// Check before layout\nPin 1 matches ✓   Polarity marks ✓\nPad size ≥ datasheet minimum ✓   Pitch exact ✓',
        note: 'The footprint must match the datasheet drawing exactly. Check pin 1 and polarity before placing anything.',
      },
      {
        title: 'Placement — The Layout That Saves You',
        text: 'Placement decides whether routing is easy or impossible. Start from the datasheet: place the MCU in the middle, decoupling caps as close to its power pins as physically possible, crystal near its pins, connectors on the edge, and the regulator on the edge with its caps nearby.\n\nGroup by function and keep signal paths short and direct. Think of the current loops: every IC\'s power loop (decoupling cap → VCC → GND) should be small.\n\nUse a grid (0.5 mm or 25 mil) and 45° aesthetics will come from the router; your job at this stage is function. Place, then ask "would I route this in 10 minutes?" — if no, re-place.',
        code: '// Placement priority\n1. MCU centre\n2. Decoupling caps touching their power pins\n3. Crystal + caps adjacent to the MCU pins\n4. Regulator + caps on the edge\n5. Connectors on the edge\n\n// Rule of thumb\nSignal path short and direct\nPower loop small (cap → VCC → GND)',
        note: 'Good placement is 80% of a good board. Caps beside their pins; signals short; flows obvious.',
      },
      {
        title: 'Layer Plan & Board Outline',
        text: 'Decide the stack-up before routing: two layers (top signal, bottom signal) or four (signal, plane, plane, signal). Power and ground planes on inner layers give clean reference and routing room.\n\nDraw the board outline exactly to size — it is what the fab cuts. Add mounting holes, keep mounting hardware away from copper, and leave a keep-out zone around edges (fabrication needs a few mm).\n\nThink about the mechanical fit: connectors that must clear an enclosure, USB positions, panel thickness. A board that electrically works but mechanically doesn\'t is a re-spin.',
        code: '// Two-layer stack (beginner default)\nTop:  signals + parts\nBottom: signals + ground fills\n\n// Four-layer stack\nTop: signals\nInner 1: ground plane\nInner 2: power plane\nBottom: signals\n\n// Outline rules\n- Exact dimensions (fab cuts this)\n- 3–5 mm edge keep-out\n- Mounting holes clear of copper',
        note: 'Decide the stack-up and outline first. Planes give clean power; edges need keep-out.',
      },
    ],
    quizzes: [
      { text: 'SMD parts…', options: ['sit on pads on the board surface', 'have leads through holes', 'are always bigger', 'need no pads'], correctAnswer: 'sit on pads on the board surface' },
      { text: 'The footprint is…', options: ['the physical pad pattern a part sits on', 'the schematic symbol', 'the net list', 'the copper pour'], correctAnswer: 'the physical pad pattern a part sits on' },
      { text: 'Decoupling caps should be placed…', options: ['as close to the IC power pins as possible', 'anywhere on the board', 'on the back', 'far away'], correctAnswer: 'as close to the IC power pins as possible' },
      { text: 'A four-layer board adds…', options: ['power and ground planes inside', 'two extra signal layers only', 'nothing', 'thicker FR-4'], correctAnswer: 'power and ground planes inside' },
    ],
  },

  // ── W4 · Routing, Grounding & Design Rules ───────────────────────────────
  {
    week: 4,
    title: 'Routing, Grounding & Design Rules',
    description: 'Drawing the copper, engineering the ground, and keeping the design rules honest.',
    topics: [
      {
        title: 'Routing Basics — Traces, Widths & Spacing',
        text: 'Routing draws copper connections. Trace width sets current capacity and resistance; spacing sets the minimum gap between copper features (track-to-track, track-to-pad). The design rules (net classes, clearance, via size) live in the design rules settings and drive the DRC.\n\nRule of thumb: 1 A needs roughly 1 mm trace width (or ~10 mil per amp on 1 oz copper — check an online calculator). Power traces wider, signals thin (0.2 mm typical). 45° angles, not 90° — sharp corners concentrate current.\n\nThe autorouter can finish the job, but place and route the critical paths by hand first: power, clocks, high-speed signals.',
        code: '// Design rules (typical two-layer, cheap fab)\nMin trace: 0.2 mm (8 mil)\nMin clearance: 0.2 mm\nMin via drill: 0.3 mm\n\n// Trace width vs current (1 oz copper)\n0.5 mm → ~1 A\n1.0 mm → ~2 A\n\n// Style\n45° corners, thick power traces, thin signals',
        note: 'Trace width = current. Clearance = fab limits. Route power and critical signals by hand.',
      },
      {
        title: 'Grounding — The Return Path Is the Signal',
        text: 'Every signal current returns through ground. If the return path is long or shared, you build antennas and noise. The ground plane is the star of the show: a solid copper pour that gives every signal a short, low-inductance return.\n\nRules that work: one solid ground plane (don\'t split it casually), ground vias next to every signal via for layer changes, and a single-point connection (or a clean break) between analog and digital ground where noise isolation matters.\n\nStar grounding keeps the high-current return (motor, LED) away from the sensitive analog return. The current takes the path of least impedance — make sure that path is the one you want.',
        code: '// Ground plane\nA solid pour → every signal gets a short return\n\n// Layer change\nSignal via + adjacent ground via (return hops too)\n\n// Star ground\nSensitive return → dedicated trace to the single point\nHigh-current return → its own path to that point\n\n// No ground = antenna. Fill it, always.',
        note: 'Ground is the return path of every signal. Solid plane, vias nearby, star where it matters.',
      },
      {
        title: 'Decoupling, Planes & Thermal Management',
        text: 'Decoupling has a physical half: the 100 nF cap must be close to the pin, and its loop to VCC and GND must be small. Power planes deliver clean VCC; a ferrite bead can split noisy and clean power islands.\n\nThermal management: keep high-power parts apart, add copper pours and thermal vias under hot components, and watch the trace widths feeding them. On the other side — SMD pads connected to a big plane drain heat during soldering; thermal relief spokes make hand-soldering possible.\n\nThe thermal relief is why "the pad won\'t solder" happens: big copper planes steal the heat. Design for the assembler, not just the electrons.',
        code: '// Small loop: cap at the pin\nVCC pin ─ 100 nF cap ─ GND via (as close as possible)\n\n// Power islands\nRegulator → ferrite → MCU_VCC island\n\n// Thermal relief on plane-connected pads\nA few thin spokes, not a solid connection\n\n// Hot parts\nCopper pour under them + thermal vias to the plane',
        note: 'Physics rules: small power loops, plane-connected pads get thermal relief, hot parts get copper.',
      },
      {
        title: 'Design Rule Check & Final Review',
        text: 'The DRC reads your rules and flags every violation: clearance too small, unconnected net, unrouted track, via too small, outline violations. Run it after routing and fix every error.\n\nThen do the human review: check polarity (diodes, caps, LEDs), check pin 1s, verify the crystal circuit against its datasheet, confirm connectors match the harness, and review the power path current by current.\n\nThe final checklist: DRC clean, ERC clean, footprints verified, polarity marked, power nets wide enough, ground plane solid, mounting holes clear. Run it before generating Gerbers — every fix after ordering costs weeks.',
        code: '// DRC catches\n- Clearance violations\n- Unconnected nets\n- Unrouted traces\n- Via size vs drill limits\n- Outline issues\n\n// Human review\n✓ Polarity on all diodes/caps/LEDs\n✓ Pin 1 everywhere\n✓ Crystal caps match datasheet\n✓ Power trace widths\n✓ Solid ground pour\n✓ Mounting holes clear of copper',
        note: 'DRC catches the mechanical; your eyes catch the electrical. Both before ordering. Always.',
      },
    ],
    quizzes: [
      { text: 'Trace width determines…', options: ['current capacity and resistance', 'the colour', 'the part value', 'nothing'], correctAnswer: 'current capacity and resistance' },
      { text: 'The ground plane matters because…', options: ['every signal returns through ground', 'it looks nice', 'it is required', 'it saves money'], correctAnswer: 'every signal returns through ground' },
      { text: 'The 100 nF decoupling cap must…', options: ['be close to the IC power pin with a small loop', 'be far away', 'be on the back', 'be huge'], correctAnswer: 'be close to the IC power pin with a small loop' },
      { text: 'Thermal relief helps because…', options: ['solid connections to a plane steal heat during soldering', 'it looks nicer', 'it reduces copper', 'it is cheaper'], correctAnswer: 'solid connections to a plane steal heat during soldering' },
    ],
  },

  // ── W5 · Manufacturing & Ordering ────────────────────────────────────────
  {
    week: 5,
    title: 'Manufacturing & Ordering',
    description: 'Generating correct manufacturing files, designing for manufacturability, and ordering your first real board.',
    topics: [
      {
        title: 'Generating Gerbers & Drill Files',
        text: 'Gerber files are the per-layer images the fab machine reads: one for copper top, copper bottom, solder mask top/bottom, silkscreen, and the board outline. The drill file (Excellon format) carries the holes.\n\nKiCad plots all of these: choose the right format (RS-274X with embedded apertures — the modern standard), set the coordinate origin consistently, and plot each layer with the right settings.\n\nThen verify: open the Gerbers in a viewer (KiCad\'s GerbView, or an online one) and look at every layer — missing layers, wrong origin or flipped silkscreen are all visible here. Never send unverified Gerbers to a fab.',
        code: '// Plot set (KiCad: File → Plot)\nF.Cu   — copper top\nB.Cu   — copper bottom\nF.Mask — solder mask top\nB.Mask — solder mask bottom\nF.Silk — silkscreen top\nEdge.Cuts — board outline\n\n// Drill: Excellon format\n\n// After plotting, always:\nOpen in GerbView → check every layer, origin, alignment',
        note: 'Gerbers are the fab\'s blueprint. Plot every layer, then verify every layer in a viewer.',
      },
      {
        title: 'Design for Manufacture — The Fab\'s Minimums',
        text: 'Design for manufacturing (DFM) means your board is buildable at your chosen fab. The critical numbers come from the fab\'s capability sheet: minimum trace width, minimum clearance, minimum hole size, minimum annular ring.\n\nCheap fabs typically handle: 6/6 mil (0.15 mm) traces/clearance, 0.3 mm minimum via drill, 0.25 mm min annular ring. Your DRC rules must be set to match or exceed the fab\'s minimums.\n\nThe result of ignoring DFM: your board costs 4× at a capable fab, or simply can\'t be made. Set the design rules to the fab you\'ll actually use, then keep DRC green.',
        code: '// Capability sheet — match these in DRC\nMin trace width:   6 mil (0.15 mm)\nMin clearance:     6 mil\nMin via drill:     0.3 mm\nMin annular ring:  0.25 mm\nMin board outline: square-ish, rounded corners ok\n\n// Rule: design to the fab you will order from',
        note: 'DFM = match the fab\'s minimums. Set design rules to your real fab and keep DRC green.',
      },
      {
        title: 'Ordering Your Board — Files, Options, Cost',
        text: 'Ordering is mostly file hygiene. Submit: Gerbers, drill file, and a readme or the fab\'s uploader fields (board dimensions, layer count, thickness, copper weight, surface finish, solder mask colour, quantity).\n\nStandard options: 1.6 mm thickness, 1 oz copper, HASL or ENIG finish (ENIG costs more, flatter, for fine-pitch SMD), green or any mask colour. Panelise and reduce quantity to hit cost sweet spots.\n\nAssembly vs bare board: bare boards need your soldering; PCBA (fab assembles) needs a bill of materials, pick-and-place file and usually a stencil. Start with bare boards and hand assembly until a product needs volume.',
        code: '// Order form essentials\nDimensions × layers × thickness (1.6 mm)\nCopper: 1 oz\nFinish: HASL (cheap) / ENIG (flat, fine-pitch)\nMask: green (cheapest) / colour\nQty + delivery\n\n// Assembly add-ons\nBOM + pick-and-place + stencil → PCBA',
        note: 'Submit Gerbers + drill + clean options. Start bare and hand-assemble; add PCBA only for volume.',
      },
      {
        title: 'Assembly, Testing & Your First Rev A',
        text: 'Assembly is systematic: solder passives first, then ICs, then connectors. Work from the schematic, and use a rework station or hot air for SMD ICs; hand-solder the through-holes.\n\nTesting beats hoping: continuity check with the multimeter before power, then power on with current limiting, check the rails, then the peripherals one by one. A test checklist mirrors the build order — power, clock, reset, then each block.\n\nYour first board will have a bug. That\'s normal and it\'s the fastest way to learn: mark up the schematic with the fix, re-spin, and watch the second revision fly. Documentation of each fix is the real product.',
        code: '// Build order\nPassives → ICs → connectors → through-hole\n\n// Test order\nContinuity before power\nPower with a current-limited supply\nRails → clock → reset → peripherals\n\n// Revision ritual\n1. Reproduce the bug\n2. Find the cause on the schematic\n3. Note the fix + re-spin\n4. Rev B is the good one',
        note: 'Assemble in order, test in order, and expect rev A to teach you. The notebook is the product.',
      },
    ],
    quizzes: [
      { text: 'Gerber files describe…', options: ['each copper/mask/silkscreen layer as an image', 'the 3D model', 'the price', 'the schematic'], correctAnswer: 'each copper/mask/silkscreen layer as an image' },
      { text: 'The drill file uses…', options: ['Excellon format', 'PDF', 'JPEG', 'CSV'], correctAnswer: 'Excellon format' },
      { text: 'DFM means…', options: ['matching your design rules to the fab\'s minimums', 'a bigger board', 'more layers', 'a cheaper finish'], correctAnswer: 'matching your design rules to the fab\'s minimums' },
      { text: 'The first rule of board bring-up is…', options: ['continuity check before power', 'plug it in immediately', 'trust the layout', 'skip testing'], correctAnswer: 'continuity check before power' },
    ],
  },
];
