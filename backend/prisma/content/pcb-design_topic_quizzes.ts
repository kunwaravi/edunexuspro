/**
 * PCB Design — Schematic to Manufactured Board — per-topic quizzes.
 * Keyed by the EXACT topic titles in pcb-design.ts (topic-lock flow).
 * 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in pcb-design.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'What a PCB Is — Copper, Glass & Solder Mask': [
    { text: 'The board core material is…', options: ['FR-4 glass-fibre epoxy', 'aluminium', 'plastic', 'wood'], correctAnswer: 'FR-4 glass-fibre epoxy' },
    { text: 'The electrical wiring on a PCB is…', options: ['copper traces', 'silkscreen', 'solder mask', 'the outline'], correctAnswer: 'copper traces' },
    { text: 'The solder mask…', options: ['covers everything except the pads', 'carries the labels', 'is the copper', 'is the body'], correctAnswer: 'covers everything except the pads' },
    { text: 'A via connects…', options: ['the copper layers', 'two components', 'the mask', 'nothing'], correctAnswer: 'the copper layers' },
  ],
  'How Boards Are Made — Etching & Plating': [
    { text: 'Etching works by…', options: ['dissolving the unwanted copper, leaving your traces', 'printing ink', 'laser cutting', 'melting plastic'], correctAnswer: 'dissolving the unwanted copper, leaving your traces' },
    { text: 'The fab house reads…', options: ['your Gerber files', 'a PDF', 'a photo', 'a spreadsheet'], correctAnswer: 'your Gerber files' },
    { text: 'Layer connections are made by…', options: ['drilling and plating the holes', 'soldering wires', 'glue', 'nothing'], correctAnswer: 'drilling and plating the holes' },
    { text: 'The biggest board cost levers are…', options: ['size, layer count and hole count', 'the mask colour', 'the silkscreen font', 'the label'], correctAnswer: 'size, layer count and hole count' },
  ],
  'The Design Flow — Schematic to Gerber': [
    { text: 'The pipeline order is…', options: ['schematic → layout → routing → DRC → Gerbers', 'layout → schematic → Gerbers', 'Gerbers → schematic', 'routing → schematic'], correctAnswer: 'schematic → layout → routing → DRC → Gerbers' },
    { text: 'The schematic is…', options: ['the logical wiring of the design', 'the physical board', 'the Gerber', 'the enclosure'], correctAnswer: 'the logical wiring of the design' },
    { text: 'The DRC catches…', options: ['trace spacing and connectivity violations', 'logic bugs', 'part cost', 'nothing'], correctAnswer: 'trace spacing and connectivity violations' },
    { text: 'Most layout rework happens because…', options: ['the schematic was wrong', 'the mask was green', 'the board was square', 'the silk was small'], correctAnswer: 'the schematic was wrong' },
  ],
  'Setting Up KiCad — Your First Project': [
    { text: 'KiCad is…', options: ['a free open-source PCB toolchain', 'a paid MCU IDE', 'a 3D printer', 'a simulator only'], correctAnswer: 'a free open-source PCB toolchain' },
    { text: 'The schematic editor in KiCad is…', options: ['Eeschema', 'Pcbnew', 'GerbView', 'KicadSim'], correctAnswer: 'Eeschema' },
    { text: 'The layout editor in KiCad is…', options: ['Pcbnew', 'Eeschema', 'Calc', 'Plot'], correctAnswer: 'Pcbnew' },
    { text: 'Symbols are…', options: ['logical components; footprints are physical pads', 'the same thing', 'always 3D models', 'files for the fab'], correctAnswer: 'logical components; footprints are physical pads' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Components & Symbols in Eeschema': [
    { text: 'A symbol consists of…', options: ['pins, a reference designator, a value and a footprint', 'only a name', 'a 3D body', 'a price'], correctAnswer: 'pins, a reference designator, a value and a footprint' },
    { text: 'Reference designators look like…', options: ['R1, C2, U3', 'A12', 'P-7', 'X9Z'], correctAnswer: 'R1, C2, U3' },
    { text: 'The symbol and footprint must agree on…', options: ['pin count and pin names', 'the value', 'the colour', 'nothing'], correctAnswer: 'pin count and pin names' },
    { text: 'A messy symbol invites…', options: ['a wrong layout', 'a faster board', 'cheaper fabs', 'better signals'], correctAnswer: 'a wrong layout' },
  ],
  'Wiring, Net Labels & Power Symbols': [
    { text: 'A wire in the schematic…', options: ['connects adjacent pins directly', 'is a copper trace', 'is a via', 'is a label'], correctAnswer: 'connects adjacent pins directly' },
    { text: 'A net label…', options: ['connects same-named pins anywhere on the sheet', 'is a component', 'is a hole', 'is the board outline'], correctAnswer: 'connects same-named pins anywhere on the sheet' },
    { text: 'Power symbols are…', options: ['special net labels for the rails', 'footprints', 'vias', 'mounting holes'], correctAnswer: 'special net labels for the rails' },
    { text: 'A junction dot means…', options: ['the wires connect', 'the wires cross without connecting', 'a component', 'a label'], correctAnswer: 'the wires connect' },
  ],
  'Power, Decoupling & the Standard Circuits': [
    { text: 'The regulator output cap…', options: ['stabilises the regulator', 'does nothing', 'is optional', 'is the input'], correctAnswer: 'stabilises the regulator' },
    { text: 'Decoupling value per IC power pin is typically…', options: ['100 nF', '100 µF', '100 pH', '1 mF'], correctAnswer: '100 nF' },
    { text: 'The proven circuits for a chip come from…', options: ['the datasheet\'s application section', 'a random blog', 'trial and error', 'the forum'], correctAnswer: 'the datasheet\'s application section' },
    { text: 'The crystal\'s loading caps come from…', options: ['the crystal datasheet', 'any value', 'the MCU only', 'the supply'], correctAnswer: 'the crystal datasheet' },
  ],
  'ERC & Schematic Checks Before Layout': [
    { text: 'ERC stands for…', options: ['Electrical Rules Check', 'Every Resistor Check', 'External Routing Check', 'Error Review'], correctAnswer: 'Electrical Rules Check' },
    { text: 'The ERC flags…', options: ['unconnected pins and floating inputs', 'thermal issues', 'trace widths', 'panel cost'], correctAnswer: 'unconnected pins and floating inputs' },
    { text: 'A duplicate reference designator means…', options: ['two parts share a name — a real error', 'it is fine', 'a nicer board', 'faster routing'], correctAnswer: 'two parts share a name — a real error' },
    { text: 'The rule before layout is…', options: ['ERC clean, footprints assigned', 'ERC can wait', 'skip it', 'run it after Gerbers'], correctAnswer: 'ERC clean, footprints assigned' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Through-Hole vs SMD — Choosing Parts': [
    { text: 'Through-hole parts are…', options: ['strong and easy to hand-solder, but large', 'tiny and cheap always', 'machine-only', 'obsolete'], correctAnswer: 'strong and easy to hand-solder, but large' },
    { text: 'SMD parts are…', options: ['small and machine-assembled, fine to hand-solder', 'always through-hole', 'only for robots', 'larger'], correctAnswer: 'small and machine-assembled, fine to hand-solder' },
    { text: 'A 0603 resistor is about…', options: ['1.6 mm × 0.8 mm', '6 mm × 3 mm', '0.6 cm × 0.3 cm', '60 mm long'], correctAnswer: '1.6 mm × 0.8 mm' },
    { text: 'For mechanical stress you prefer…', options: ['through-hole connectors', 'the smallest SMD', 'no connectors', 'flex PCB'], correctAnswer: 'through-hole connectors' },
  ],
  'Footprints — Pads, Pitch & Verification': [
    { text: 'A footprint is…', options: ['the physical pad pattern a part sits on', 'the schematic symbol', 'the net list', 'the copper pour'], correctAnswer: 'the physical pad pattern a part sits on' },
    { text: 'The golden rule is…', options: ['verify the footprint against the datasheet drawing', 'trust the library blindly', 'guess the pitch', 'skip the courtyard'], correctAnswer: 'verify the footprint against the datasheet drawing' },
    { text: 'Pin 1 location matters because…', options: ['ICs must sit the right way up', 'it looks better', 'it is required by law', 'nothing'], correctAnswer: 'ICs must sit the right way up' },
    { text: 'A wrong pitch causes…', options: ['the part not fitting or pads soldering together', 'a faster board', 'a better ground', 'nothing'], correctAnswer: 'the part not fitting or pads soldering together' },
  ],
  'Placement — The Layout That Saves You': [
    { text: 'The MCU goes…', options: ['in the middle, with caps at its power pins', 'on the edge', 'on the back', 'anywhere'], correctAnswer: 'in the middle, with caps at its power pins' },
    { text: 'Connectors belong…', options: ['on the edge', 'in the middle', 'under the MCU', 'anywhere'], correctAnswer: 'on the edge' },
    { text: 'The crystal goes…', options: ['adjacent to its MCU pins with its caps', 'far away', 'on the back', 'on the edge'], correctAnswer: 'adjacent to its MCU pins with its caps' },
    { text: 'Good placement shows because…', options: ['routing becomes short and direct', 'the board is prettier', 'the mask is green', 'the board is smaller'], correctAnswer: 'routing becomes short and direct' },
  ],
  'Layer Plan & Board Outline': [
    { text: 'The typical beginner stack-up is…', options: ['two layers: top and bottom copper', 'one layer', 'ten layers', 'no copper'], correctAnswer: 'two layers: top and bottom copper' },
    { text: 'In a four-layer board the inner layers are usually…', options: ['power and ground planes', 'more signals', 'empty', 'silkscreen'], correctAnswer: 'power and ground planes' },
    { text: 'The board outline…', options: ['is what the fab cuts — draw it exactly', 'is decorative', 'is the silkscreen', 'is optional'], correctAnswer: 'is what the fab cuts — draw it exactly' },
    { text: 'The edge keep-out exists because…', options: ['the fab needs a few mm of clear margin', 'it looks better', 'it saves copper', 'nothing'], correctAnswer: 'the fab needs a few mm of clear margin' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Routing Basics — Traces, Widths & Spacing': [
    { text: 'A rough rule for current is…', options: ['~1 mm trace width per amp (1 oz copper)', '1 mm per milliamp', 'traces carry no current', 'any width works'], correctAnswer: '~1 mm trace width per amp (1 oz copper)' },
    { text: 'The minimum spacing comes from…', options: ['the fab\'s capability, set in design rules', 'your taste', 'the schematic', 'the silkscreen'], correctAnswer: 'the fab\'s capability, set in design rules' },
    { text: 'Corners should be…', options: ['45°', '90°', 'sharp', 'arbitrary'], correctAnswer: '45°' },
    { text: 'The critical paths to route by hand first are…', options: ['power, clocks and high-speed signals', 'only the ground', 'nothing', 'the silkscreen'], correctAnswer: 'power, clocks and high-speed signals' },
  ],
  'Grounding — The Return Path Is the Signal': [
    { text: 'Every signal current returns through…', options: ['ground', 'the power pin', 'the silkscreen', 'nowhere'], correctAnswer: 'ground' },
    { text: 'The ground plane gives…', options: ['a short, low-inductance return for every signal', 'nothing', 'more routing', 'a prettier board'], correctAnswer: 'a short, low-inductance return for every signal' },
    { text: 'On a layer change you add…', options: ['a ground via next to the signal via', 'more mask', 'a resistor', 'nothing'], correctAnswer: 'a ground via next to the signal via' },
    { text: 'Star grounding keeps…', options: ['high-current returns away from sensitive analog returns', 'the board small', 'the mask clean', 'the cost down'], correctAnswer: 'high-current returns away from sensitive analog returns' },
  ],
  'Decoupling, Planes & Thermal Management': [
    { text: 'The decoupling loop must be…', options: ['small — cap close to the pin, quick to ground', 'large', 'on the back', 'far away'], correctAnswer: 'small — cap close to the pin, quick to ground' },
    { text: 'A ferrite bead can…', options: ['split a noisy power island from a clean one', 'amplify the signal', 'replace the regulator', 'change the colour'], correctAnswer: 'split a noisy power island from a clean one' },
    { text: 'Hot components get…', options: ['copper pours and thermal vias', 'a bigger silkscreen', 'no help', 'a longer name'], correctAnswer: 'copper pours and thermal vias' },
    { text: 'Plane-connected pads need thermal relief because…', options: ['a solid connection steals heat during soldering', 'it looks better', 'it is cheaper', 'nothing'], correctAnswer: 'a solid connection steals heat during soldering' },
  ],
  'Design Rule Check & Final Review': [
    { text: 'The DRC is run…', options: ['after routing, and every error must be fixed', 'once, optionally', 'before the schematic', 'after ordering'], correctAnswer: 'after routing, and every error must be fixed' },
    { text: 'The DRC does NOT catch…', options: ['a logic error in the schematic', 'clearance violations', 'unconnected nets', 'small vias'], correctAnswer: 'a logic error in the schematic' },
    { text: 'The human review checks…', options: ['polarity, pin 1 and the crystal circuit', 'nothing', 'the mask colour', 'the panel'], correctAnswer: 'polarity, pin 1 and the crystal circuit' },
    { text: 'Every fix after ordering costs…', options: ['weeks', 'nothing', 'a minute', 'a re-run'], correctAnswer: 'weeks' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Generating Gerbers & Drill Files': [
    { text: 'Gerbers are…', options: ['per-layer image files the fab machine reads', 'PDFs', '3D models', 'spreadsheets'], correctAnswer: 'per-layer image files the fab machine reads' },
    { text: 'The modern Gerber format is…', options: ['RS-274X with embedded apertures', 'PDF', 'DXF', 'CSV'], correctAnswer: 'RS-274X with embedded apertures' },
    { text: 'The drill file format is…', options: ['Excellon', 'G-code', 'PDF', 'JPEG'], correctAnswer: 'Excellon' },
    { text: 'Before sending you must…', options: ['verify every layer in a Gerber viewer', 'trust the plot', 'skip the drill file', 'rename files'], correctAnswer: 'verify every layer in a Gerber viewer' },
  ],
  "Design for Manufacture — The Fab's Minimums": [
    { text: 'A common cheap-fab minimum trace is…', options: ['6 mil (0.15 mm)', '60 mil', '1 mm', 'no minimum'], correctAnswer: '6 mil (0.15 mm)' },
    { text: 'The source of the true minimums is…', options: ['the fab\'s capability sheet', 'a guess', 'the schematic', 'the colour'], correctAnswer: 'the fab\'s capability sheet' },
    { text: 'Ignoring DFM means…', options: ['the board costs more or can\'t be made', 'a faster board', 'better signals', 'nothing'], correctAnswer: 'the board costs more or can\'t be made' },
    { text: 'Your DRC rules must…', options: ['match or exceed the fab\'s minimums', 'be looser than the fab', 'be random', 'be hidden'], correctAnswer: 'match or exceed the fab\'s minimums' },
  ],
  'Ordering Your Board — Files, Options, Cost': [
    { text: 'The minimum upload set is…', options: ['Gerbers + drill file + board info', 'only a PDF', 'a photo', 'a screenshot'], correctAnswer: 'Gerbers + drill file + board info' },
    { text: 'The standard board thickness is…', options: ['1.6 mm', '0.1 mm', '16 mm', '5 cm'], correctAnswer: '1.6 mm' },
    { text: 'ENIG vs HASL — ENIG is…', options: ['flatter and pricier, good for fine-pitch SMD', 'cheaper and rough always', 'the same', 'for flex only'], correctAnswer: 'flatter and pricier, good for fine-pitch SMD' },
    { text: 'PCBA assembly needs…', options: ['BOM + pick-and-place + usually a stencil', 'nothing extra', 'only Gerbers', 'a 3D model'], correctAnswer: 'BOM + pick-and-place + usually a stencil' },
  ],
  'Assembly, Testing & Your First Rev A': [
    { text: 'The assembly order is…', options: ['passives → ICs → connectors → through-hole', 'connectors first', 'ICs first always', 'random'], correctAnswer: 'passives → ICs → connectors → through-hole' },
    { text: 'Before power you check…', options: ['continuity with the multimeter', 'nothing', 'the price', 'the colour'], correctAnswer: 'continuity with the multimeter' },
    { text: 'First power-on uses…', options: ['a current-limited supply', 'the wall socket directly', 'a battery', 'no supply'], correctAnswer: 'a current-limited supply' },
    { text: 'The test order after power is…', options: ['rails → clock → reset → peripherals', 'peripherals → rails', 'nothing', 'random'], correctAnswer: 'rails → clock → reset → peripherals' },
  ],
};
