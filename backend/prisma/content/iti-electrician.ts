/**
 * ITI Electrician — Wiring, Machines & Safety — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in iti-electrician_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 *
 * Supplementary skill-building for electrician trade aspirants. This course is
 * a learning supplement only — it does NOT grant or replace any government
 * trade certificate or license; those remain governed by the official
 * trade authority and applicable regulations.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Electrical Safety & First Aid ───────────────────────────────────
  {
    week: 1,
    title: 'Electrical Safety & First Aid',
    description: 'Safety is the first lesson and the last one. Rules, first aid for shock, PPE, and safe tool habits.',
    topics: [
      {
        title: 'Safety Rules — The First and Last Lesson',
        text: 'Electricity is an invisible, silent hazard. The rules are non-negotiable: treat every circuit as LIVE until proven dead, isolate and lock the supply before work, test for absence of voltage with a tester, and never work alone on live equipment.\n\nThe order that saves lives: ISOLATE the supply (switch off and lock), TEST the circuit is dead with a voltage tester, EARTH/ground where required, then work. Five rules (check tools, isolate, lock, test, work) apply on every job, every time.\n\nLearn where the danger lives: mains voltage kills, current through the chest is the killer path, and water + electricity is a fatal combination. Safety is a habit, not a lecture.',
        code: '// The 5 safety rules\n1. Check tools and testers\n2. Isolate the supply\n3. Lock out / tag out\n4. Test for absence of voltage\n5. Work\n\n// Danger zones\nMains voltage — treat as live\nCurrent through the chest — the killer path\nWater + electricity — fatal\n\n// Golden rule\nNever work alone on live equipment',
        note: 'Isolate, lock, test, then work. The rules are non-negotiable and apply on every job.',
      },
      {
        title: 'Electric Shock & First Aid',
        text: 'Shock happens when the body completes a circuit. The first step is YOUR safety: do not touch the victim while current flows — switch off, or use a dry non-conductive object (wood, dry cloth) to separate them. Then get help and start first aid.\n\nIf the person is unresponsive but breathing: recovery position and call for help. If not breathing: CPR and an emergency call immediately. Every second counts.\n\nKnow your facility\'s emergency number and the location of the first-aid kit and fire extinguisher before you need them. Practising the drill is part of the job. Prevention is better than cure — the safety rules in the previous lesson prevent the shock that this lesson treats.',
        code: '// If someone is shocked\n1. Do NOT touch them while current flows\n2. Switch off the supply / separate with dry wood or cloth\n3. Call for emergency help\n4. Unresponsive + not breathing → CPR\n5. Unresponsive + breathing → recovery position\n\n// Before you ever need it\nKnow the emergency number\nKnow the first-aid kit\nKnow the fire extinguisher',
        note: 'Your safety first: switch off, then help. Know the emergency drill before you need it.',
      },
      {
        title: 'Personal Protective Equipment & Safe Tools',
        text: 'PPE is the last line of defence: insulated gloves, safety glasses, protective footwear, and flame-resistant clothing for live work. Insulated hand tools (VDE/1000 V marked) are for electrical work — never improvise with an ordinary screwdriver.\n\nTool discipline: insulated handles intact, testers checked (test on a known-live point first), tools carried in a proper bag, and damaged tools repaired or replaced. Never carry a tool in your pocket while climbing.\n\nThe rule of two: check your tools at the start of the job, and re-check your voltage tester by testing it on a known live source before AND after testing your circuit. A dead tester gives a false sense of safety.',
        code: '// PPE\nInsulated gloves · Safety glasses\nProtective footwear · FR clothing for live work\n\n// Tools\nVDE 1000 V insulated tools only\nTesters: test on known-live BEFORE and AFTER\n\n// Discipline\nDamaged tool → repair or replace\nTools in a bag, not your pocket',
        note: 'PPE is your last defence; insulated tools and a checked tester are your daily armour.',
      },
      {
        title: 'Fire Safety & Electrical Hazards',
        text: 'Electrical faults cause fires: overheated cables, loose connections, short circuits, and overloaded sockets. Prevention is electrical care; response is knowing the extinguisher.\n\nFire classes: Class A (wood/paper), Class B (flammable liquids), Class C (gases), Class D (metals), and Class E — electrical. For electrical fire you use a Class C/ABC dry-powder or CO2 extinguisher — NEVER water on live electrical.\n\nIn a fire: raise the alarm, switch off what you safely can, use the right extinguisher from a safe distance, and evacuate. The PASS method — Pull, Aim, Squeeze, Sweep. And the most important electrical safety rule for fires: a circuit that keeps tripping is a warning — find the fault, don\'t just reset it.',
        code: '// Fire classes\nA wood/paper · B liquids · C gases\nE electrical (never water)\n\n// Electrical fire\nSwitch off safely → CO2 or dry-powder → alarm\nNEVER water on live electrical\n\n// PASS\nPull · Aim · Squeeze · Sweep\n\n// Warning\nA breaker that keeps tripping = find the fault',
        note: 'Never water on electrical fire. A tripping breaker is a warning, not an inconvenience.',
      },
    ],
    quizzes: [
      { text: 'Before working on a circuit you…', options: ['isolate, lock, test, then work', 'test it live', 'trust the switch', 'work fast'], correctAnswer: 'isolate, lock, test, then work' },
      { text: 'If someone is shocked you first…', options: ['switch off the supply', 'grab them', 'pour water', 'call IT'], correctAnswer: 'switch off the supply' },
      { text: 'Electrical tools should be…', options: ['VDE insulated and checked', 'any screwdriver', 'ordinary', 'shared always'], correctAnswer: 'VDE insulated and checked' },
      { text: 'For an electrical fire you use…', options: ['CO2 or dry-powder, never water', 'water', 'sand only', 'nothing'], correctAnswer: 'CO2 or dry-powder, never water' },
    ],
  },

  // ── W2 · Wiring Fundamentals ─────────────────────────────────────────────
  {
    week: 2,
    title: 'Wiring Fundamentals',
    description: 'The physics of circuits, conductors and cables, drawing and reading wiring diagrams.',
    topics: [
      {
        title: 'Circuits — Voltage, Current, Resistance & Power',
        text: 'The trade works with the same physics everywhere: voltage (V) is the pressure, current (I) is the flow, resistance (R) opposes flow, and power (P = V × I) is the work being done — in watts.\n\nOhm\'s law: V = I × R. A 10 A load on a 230 V circuit draws 2.3 kW; a motor rated 1 kW at 230 V draws about 4.3 A. These numbers size the cable, the fuse and the switch.\n\nTwo circuits: series (one path, current shared) and parallel (full voltage per branch — this is how sockets are wired). Know the numbers behind every job: cable size, fuse rating and load — they are all linked by these laws.',
        code: '// The laws\nV = I × R\nP = V × I\n\n// Example\n1 kW motor at 230 V → I = 1000 / 230 ≈ 4.3 A\n10 A at 230 V → P = 2300 W = 2.3 kW\n\n// Sizing chain\nLoad (A) → cable size → fuse rating → switch rating',
        note: 'Ohm\'s law sizes the whole job: load, cable, fuse and switch are one linked calculation.',
      },
      {
        title: 'Conductors & Cables — Copper, Sizing & Insulation',
        text: 'Copper is the standard conductor; aluminium appears in larger feeders. A cable\'s current capacity (ampacity) depends on the copper size, the insulation class, and how it is installed (in air, in conduit, buried) — heat is the enemy.\n\nApproximate single-phase values (230 V, copper, PVC-insulated): 1.0 mm² ≈ 10–14 A, 1.5 mm² ≈ 15–18 A, 2.5 mm² ≈ 20–25 A, 4 mm² ≈ 25–32 A. Always check the actual table for your standard.\n\nInsulation carries a voltage rating and a colour code: in India, red/black/brown for live, blue for neutral, and green/yellow (or green) for earth. Colour discipline prevents fatal mistakes — respect it strictly.',
        code: '// Approx. ampacity (copper, PVC, 230 V)\n1.0 mm² ≈ 10–14 A\n1.5 mm² ≈ 15–18 A\n2.5 mm² ≈ 20–25 A\n4.0 mm² ≈ 25–32 A\n\n// Colour code (India)\nLive: red / brown / black\nNeutral: blue\nEarth: green-yellow or green\n\n// Derate for\nConduit, bundling, hot environments',
        note: 'Cable size = current + installation method. Colour code is a safety language — never break it.',
      },
      {
        title: 'Reading Wiring Diagrams & Symbols',
        text: 'Wiring diagrams are the trade\'s blueprint. Symbols: the fuse, switch, socket, lamp, MCB, and the transformer all have standard symbols. Drawings show HOW components connect — the schematic (logic) and the wiring diagram (physical) together tell the full story.\n\nRead the path: supply → protective device (fuse/MCB) → switch → load → neutral → return. Follow the LIVE path with one finger and the neutral return with the other; every circuit is a loop.\n\nPractice: draw the circuit for a light controlled by one switch, a socket with protection, and a 3-pin socket with earth. Reading diagrams well means you can wire what you have never seen before.',
        code: '// Read a circuit as a loop\nLive → fuse/MCB → switch → lamp → neutral → return\n\n// Standard symbols\nFuse — line with box\nSwitch — open contact\nLamp — circle with X\nMCB — switch symbol with rating\nEarth — three-line symbol\n\n// Practice circuits\n1-way light · socket + MCB · 3-pin with earth',
        note: 'Every circuit is a loop: out on live, back on neutral. Follow the loop and the symbols.',
      },
      {
        title: 'Protection — Fuses, MCBs & Earthing',
        text: 'Protection stops the two killers: overcurrent (a fault pulling too many amps) and earth faults (leakage to a body). A fuse or MCB opens the circuit when current exceeds its rating; an RCD/ELCB detects leakage to earth and trips in milliseconds.\n\nRatings match the cable and the load: the protective device must protect the cable, not just the load. A 2.5 mm² circuit with a 32 A MCB means the cable burns before the breaker trips — wrong.\n\nEarthing is protection too: the earth wire gives fault current a safe path, so protection can act and a person doesn\'t become the path. Three-pin sockets, bonded metal bodies, and a good earth electrode are not optional.',
        code: '// Protection chain\nFuse/MCB — overcurrent\nRCD/ELCB — earth leakage (fast trip)\nEarthing — safe fault-current path\n\n// Rule\nProtective device protects the CABLE, not just the load\n\n// Check\nEvery 3-pin socket earthed?\nMetal bodies bonded?',
        note: 'Protection protects the cable, and earthing protects people. Both are non-negotiable.',
      },
    ],
    quizzes: [
      { text: 'The power equation is…', options: ['P = V × I', 'P = V / I', 'P = I / V', 'P = V² × I'], correctAnswer: 'P = V × I' },
      { text: 'Cable ampacity depends on…', options: ['copper size, insulation and installation', 'the colour', 'the brand', 'nothing'], correctAnswer: 'copper size, insulation and installation' },
      { text: 'A circuit is read as…', options: ['a loop: live out, neutral back', 'a straight line', 'a tree', 'a box'], correctAnswer: 'a loop: live out, neutral back' },
      { text: 'The protective device must…', options: ['protect the cable, not just the load', 'be as big as possible', 'be optional', 'be small'], correctAnswer: 'protect the cable, not just the load' },
    ],
  },

  // ── W3 · House Wiring & Installation ─────────────────────────────────────
  {
    week: 3,
    title: 'House Wiring & Installation',
    description: 'Planning and wiring real circuits: distribution, circuits, fittings, and safe installation practice.',
    topics: [
      {
        title: 'The Distribution System — From Meter to Outlet',
        text: 'House wiring starts at the meter and branches out: the main switch, the distribution board with MCBs and an RCD, then circuits feeding sockets, lights and appliances.\n\nStructure: each circuit (lighting, socket, dedicated appliance) has its own MCB, so a fault in one room doesn\'t blackout the house. The distribution board labels every circuit — a labelled board is a maintainable board.\n\nPlan the circuits: lighting on its own circuit(s), sockets on 2.5 mm² circuits, heavy appliances (geyser, AC, motor) on dedicated circuits with their own MCB. Balance the loads across phases in a 3-phase supply. Good distribution is planning, not just wiring.',
        code: '// The chain\nMeter → main switch → distribution board\n→ per-circuit MCB/RCD → sockets · lights · appliances\n\n// Circuit plan\nLights — 1.5 mm² + 6/10 A MCB\nSockets — 2.5 mm² + 16 A MCB\nGeyser/AC/motor — dedicated circuit + own MCB\n\n// Rule\nLabel every circuit in the board',
        note: 'One circuit per room-group, dedicated circuits for heavy appliances, and a labelled board.',
      },
      {
        title: 'Switches, Sockets & Fittings',
        text: 'The fittings are the user interface: one-way switches for a single lamp, two-way for stairs/halls (two switches control one light), and sockets in 5 A (small loads) and 15/16 A (heavy loads) ratings.\n\nWiring a socket correctly: live to the live terminal, neutral to neutral, and EARTH to earth — never bridge or reverse. A two-way circuit uses two switches wired with a traveller system: two travellers between the switches plus the common.\n\nSafety details: sockets high enough to avoid children\'s reach where required, switch connections tightened (loose terminals overheat), and polarity checked — live on the switch side, not the socket, so a lamp\'s live is never exposed when the bulb is changed.',
        code: '// Fittings\n1-way switch — one switch, one light\n2-way switch — two switches, one light (stairs)\n5 A socket — small loads\n15/16 A socket — heavy loads\n\n// Socket wiring\nLive · Neutral · Earth — never bridge\n\n// Two-way circuit\nTravellers between switches + common to each lamp/line',
        note: 'Fit the right switch for the job, keep polarity correct, and torque every terminal.',
      },
      {
        title: 'Conduit, Channels & Cable Routing',
        text: 'Cables run safely inside conduit (PVC pipe), channel, or properly buried — never loose and never through water-prone areas. Conduit protects the cable and lets you replace it later without breaking walls.\n\nRules: bend radius smooth (no kinks), draw-in wires sized for future pulls, junction boxes accessible, and cables secured at regular intervals. In exposed work, keep cables off the ground and away from heat sources.\n\nPlan the route before you cut: shortest safe path, right protection, and every joint in an accessible box. A tidy route today is a maintainable system for decades.',
        code: '// Routing\nPVC conduit or channel — always\nJunction boxes accessible\nCables secured at intervals\nNo kinks, smooth bends\n\n// Avoid\nWater-prone areas\nHeat sources\nLoose unprotected runs\n\n// Rule\nEvery joint in an accessible box',
        note: 'Conduit protects and future-proofs. Plan the route, respect the bends, box every joint.',
      },
      {
        title: 'Installation Practice — Step by Step',
        text: 'A safe installation follows the sequence: plan → isolate → run conduits → pull cables → connect fittings → test → energise → label.\n\nThe connection discipline: strip only the needed insulation (no exposed copper beyond the terminal), tighten terminals properly, keep colour discipline, and never twist live and neutral in a way that can short.\n\nTesting before power: continuity of every circuit, insulation resistance (megger) between live/neutral and earth, and earth continuity at every socket. Only after a clean test do you energise, circuit by circuit, and verify each outlet.',
        code: '// Sequence\nPlan → isolate → conduits → pull cables →\nconnect fittings → test → energise → label\n\n// Connection rules\nStrip only needed insulation\nTighten terminals properly\nColour discipline always\n\n// Tests before power\nContinuity ✓\nInsulation resistance ✓\nEarth continuity at every socket ✓',
        note: 'Test before energise, always. Continuity, insulation and earth — a clean test means a safe switch-on.',
      },
    ],
    quizzes: [
      { text: 'Heavy appliances get…', options: ['their own dedicated circuit and MCB', 'any socket', 'a shared circuit', 'no protection'], correctAnswer: 'their own dedicated circuit and MCB' },
      { text: 'A two-way switch is for…', options: ['one light controlled from two places', 'two lights', 'a socket', 'nothing'], correctAnswer: 'one light controlled from two places' },
      { text: 'Cables should run…', options: ['inside conduit or channel', 'loose on the floor', 'through water', 'anywhere'], correctAnswer: 'inside conduit or channel' },
      { text: 'Before energising you test…', options: ['continuity, insulation and earth', 'nothing', 'only the paint', 'the label'], correctAnswer: 'continuity, insulation and earth' },
    ],
  },

  // ── W4 · Electrical Machines & Instruments ───────────────────────────────
  {
    week: 4,
    title: 'Electrical Machines & Instruments',
    description: 'Transformers, motors, generators and the meters that measure them.',
    topics: [
      {
        title: 'Transformers — Stepping Voltage Up and Down',
        text: 'A transformer changes AC voltage: primary and secondary windings on a core, ratio set by turns. Step-up raises voltage (transmission), step-down lowers it (distribution, appliances).\n\nTurns ratio: V2/V1 = N2/N1. Power is conserved (minus losses), so stepping down voltage steps up current — a 230 V to 12 V transformer for a lamp steps current up about 19 times.\n\nThe trade sees transformers everywhere: distribution transformers on poles, the small ones in chargers, and isolating transformers for safety. Care: they heat, they need cooling, and oil-filled units are a fire/leak hazard when damaged.',
        code: '// Turns ratio\nV2 / V1 = N2 / N1\n\n// Step-down example\n230 V → 12 V (lamp)\nTurns ratio ≈ 230/12 ≈ 19:1\nCurrent steps UP by the same factor\n\n// Care\nTransformers heat — allow cooling\nOil-filled = leak/fire hazard when damaged',
        note: 'Transformers trade voltage for current while conserving power. The ratio comes from the turns.',
      },
      {
        title: 'Motors — Induction, Single-Phase & Three-Phase',
        text: 'The induction motor is the workhorse: a rotating magnetic field in the stator drags the rotor. Three-phase motors are the standard industrial motor; single-phase motors (split-phase, capacitor-start) run on domestic supply and power fans, pumps and compressors.\n\nA single-phase induction motor cannot start on one phase alone — it needs a starting method: a capacitor and start winding (capacitor-start), or a shaded pole for tiny motors. The capacitor is a common failure point.\n\nMotor data on the nameplate: voltage, current, power, RPM, duty, and class. The nameplate is the motor\'s ID — read it before you connect anything, and protect the motor with an overload relay sized to its rated current.',
        code: '// Motor types\n3-phase induction — industrial standard\nSingle-phase — domestic (fan, pump, compressor)\n\n// Starting\nSingle-phase needs a start winding + capacitor\n\n// Nameplate essentials\nVoltage · Current · Power (kW/HP)\nRPM · Duty · Insulation class\n\n// Protection\nOverload relay at rated current',
        note: 'Read the nameplate, protect the motor, and respect the capacitor as a common failure point.',
      },
      {
        title: 'Generators & UPS — Keeping the Power On',
        text: 'Generators convert mechanical power to electrical power — diesel generators for backup, and alternators in cars. A generator\'s output is governed by speed and excitation; load must stay within its rating.\n\nBackup systems: a UPS gives seamless short-term power (batteries + inverter) for computers and critical loads; a DG set covers longer outages. The changeover — automatic transfer switch — must never feed the grid (danger to line workers).\n\nSafety: generator exhaust (CO) is lethal — never run a DG indoors or near windows. Fuel handling and earthing of the generator are mandatory. Backup power is a lifesaver when it is respected and a killer when it is not.',
        code: '// Backup chain\nUtility → transfer switch → DG / UPS → loads\n\n// UPS\nBattery + inverter = seamless short-term power\n\n// Generator rules\nNever indoors (CO kills)\nLoad within rating\nEarthing mandatory\nChangeover must NOT feed the grid',
        note: 'Backup power must be earthed, ventilated and isolated from the grid. CO from a DG is lethal.',
      },
      {
        title: 'Measurement Instruments — Multimeter, Clamp Meter, Megger',
        text: 'The meters are your eyes: the multimeter measures voltage, resistance and continuity; the clamp meter measures current without breaking the circuit; the megger measures insulation resistance at high voltage; and the energy meter bills consumption.\n\nUse: measure voltage AC/DC with the correct range and polarity; clamp a single conductor for current; use the megger only on an isolated, dead circuit — its high test voltage is dangerous on live work.\n\nReading meters well means the readings are real: right range, right mode, probes on the right points, and the result compared to expectation. A reading you don\'t understand is a reading you should not trust.',
        code: '// Instruments\nMultimeter — V, Ω, continuity\nClamp meter — current without breaking the circuit\nMegger — insulation resistance (HIGH voltage — dead circuit only)\nEnergy meter — consumption\n\n// Meter discipline\nRight range + right mode\nCompare to expectation\nMegger only on isolated dead circuits',
        note: 'Meters are your eyes. Correct range, correct mode, and never megger a live circuit.',
      },
    ],
    quizzes: [
      { text: 'A step-down transformer…', options: ['lowers voltage and raises current', 'raises voltage', 'changes frequency', 'makes DC'], correctAnswer: 'lowers voltage and raises current' },
      { text: 'A single-phase induction motor needs…', options: ['a starting method like a capacitor', 'no start', 'DC', 'a brake'], correctAnswer: 'a starting method like a capacitor' },
      { text: 'A diesel generator must never run…', options: ['indoors (CO is lethal)', 'on load', 'earthed', 'with fuel'], correctAnswer: 'indoors (CO is lethal)' },
      { text: 'The megger is used…', options: ['on isolated dead circuits only', 'on live circuits', 'for current', 'for billing'], correctAnswer: 'on isolated dead circuits only' },
    ],
  },

  // ── W5 · Troubleshooting & Trade Practice ────────────────────────────────
  {
    week: 5,
    title: 'Troubleshooting & Trade Practice',
    description: 'Finding faults methodically, common failures and their causes, maintenance, and the trade career.',
    topics: [
      {
        title: 'The Troubleshooting Method — Safe and Systematic',
        text: 'Fault-finding is a method: confirm the symptom, gather facts (what changed, when, what was working), isolate the section (supply? circuit? load? connection?), test with meters, and fix the root cause — not the symptom.\n\nSafety first in every fault job: isolate and test before touching. Then divide and conquer — check the supply at the point of failure, then move toward the load (or back). Each test halves the search space.\n\nUse all your senses safely: a burning smell, a hot cable, a buzzing contactor, a tripping breaker — each is a clue. Document what you found and the fix. A recorded fix is a future diagnosis made easy.',
        code: '// The method\nSymptom → facts (what changed?) →\nisolate the section → test → root-cause fix\n\n// Divide and conquer\nTest at the failure point, then move\nEach test halves the search space\n\n// Clues\nSmell (burning) · Heat · Buzzing · Tripping\n\n// Discipline\nIsolate + test before touching',
        note: 'Isolate, then divide and conquer. Each meter test halves the search — fix the root cause.',
      },
      {
        title: 'Common Faults — Lights, Sockets, Appliances',
        text: 'The everyday faults have everyday causes: a light that won\'t work (bulb, switch, fuse/MCB, loose terminal), a dead socket (tripped MCB/RCD, loose connection, faulty socket), an appliance that trips the RCD (earth leakage — often a wet or damaged element).\n\nCheck the simple things first: is the switch on, is the bulb seated, has the MCB tripped? Loose connections are the silent killer — they heat and fail. A circuit that trips the moment something plugs in points to that appliance.\n\nRespect the rules: never defeat protection (no wire instead of a fuse), never oversize a fuse to stop tripping — the tripping IS the protection talking. Find the fault, don\'t silence the alarm.',
        code: '// Light dead?\nBulb → switch → MCB/fuse → loose terminal\n\n// Socket dead?\nMCB/RCD tripped → loose connection → socket\n\n// Appliance trips RCD?\nEarth leakage — often a wet/damaged element\n\n// Never\nWire instead of a fuse\nOversize a fuse to stop tripping',
        note: 'Simple causes first; the tripping IS the protection. Never defeat it — find the fault.',
      },
      {
        title: 'Maintenance — Prevention Beats Repair',
        text: 'Preventive maintenance keeps the plant running: scheduled inspection, tightening of terminals, checking connections for heat (a thermal camera or careful touch on low-voltage work), and testing protection devices.\n\nThe routine: quarterly panel checks, torque checks on terminals, RCD test-button operation, insulation tests, and cleaning of switchgear and motors (dust is a fire risk and an insulation killer).\n\nKeep records: what was checked, readings taken, what was found, what was fixed. Records turn "something is wrong somewhere" into a pattern you can see. A maintained system fails rarely; an ignored one fails at the worst moment.',
        code: '// Routine checks\nTerminals — tightened\nConnections — hot spots\nRCD — test button\nInsulation — megger\nDust — cleaned (fire + insulation risk)\n\n// Records\nChecked · readings · found · fixed\n\n// Truth\nMaintained systems fail rarely',
        note: 'Inspect, tighten, test and clean on schedule. Records turn vague complaints into patterns.',
      },
      {
        title: 'The Electrician Trade Career',
        text: 'This course built the fundamentals — safety, circuits, wiring, machines and troubleshooting — a supplement that prepares you for the trade\'s real duties. Your official trade certification and license remain governed by the recognised authority and local regulations; this course strengthens the skills behind them.\n\nCareer directions: residential and commercial wiring, industrial maintenance, motor and panel work, and — with further study — design, energy auditing, or specialisation in machines and control systems.\n\nGrow on the job: observe the senior fitters, ask the "why" behind every job, keep a fault log, learn the new equipment on every site, and never let familiarity replace the safety rules. The electrician who is safe, neat and curious is always in demand.',
        code: '// What you now have\n✓ Safety + first aid\n✓ Wiring fundamentals + house wiring\n✓ Protection + earthing\n✓ Machines + instruments\n✓ Methodical troubleshooting\n\n// The map forward\nWiring → Maintenance → Industrial/panel work → Design',
        note: 'Safe, neat, curious — and the safety rules never take a day off. The trade rewards the method.',
      },
    ],
    quizzes: [
      { text: 'The troubleshooting order is…', options: ['confirm, gather facts, isolate, test, fix root cause', 'guess and reset', 'call someone', 'replace parts'], correctAnswer: 'confirm, gather facts, isolate, test, fix root cause' },
      { text: 'A circuit that trips when an appliance plugs in suggests…', options: ['earth leakage in that appliance', 'a bad bulb', 'the wrong paint', 'nothing'], correctAnswer: 'earth leakage in that appliance' },
      { text: 'You should never…', options: ['defeat protection or oversize a fuse', 'tighten terminals', 'test with a meter', 'find faults'], correctAnswer: 'defeat protection or oversize a fuse' },
      { text: 'Preventive maintenance is…', options: ['inspection, tightening and testing on schedule', 'repair when it breaks', 'optional', 'for managers'], correctAnswer: 'inspection, tightening and testing on schedule' },
    ],
  },
];
