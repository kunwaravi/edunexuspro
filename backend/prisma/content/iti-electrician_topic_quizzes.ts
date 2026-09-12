/**
 * ITI Electrician — Wiring, Machines & Safety — per-topic quizzes.
 * Keyed by the EXACT topic titles in iti-electrician.ts (topic-lock flow).
 * 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in iti-electrician.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'Safety Rules — The First and Last Lesson': [
    { text: 'The 5 safety rules start with…', options: ['checking tools and testers', 'wiring fast', 'testing live', 'working alone'], correctAnswer: 'checking tools and testers' },
    { text: 'You should treat every circuit as…', options: ['LIVE until proven dead', 'dead always', 'safe', 'neutral'], correctAnswer: 'LIVE until proven dead' },
    { text: 'The killer path for current is…', options: ['through the chest', 'through the foot', 'through the hair', 'no path'], correctAnswer: 'through the chest' },
    { text: 'The golden rule is…', options: ['never work alone on live equipment', 'always work fast', 'skip testing', 'trust the switch'], correctAnswer: 'never work alone on live equipment' },
  ],
  'Electric Shock & First Aid': [
    { text: 'The first step when someone is shocked is…', options: ['your safety: switch off before touching', 'grab them', 'pour water', 'run away'], correctAnswer: 'your safety: switch off before touching' },
    { text: 'To separate a victim you use…', options: ['a dry non-conductive object', 'your hands', 'a metal rod', 'water'], correctAnswer: 'a dry non-conductive object' },
    { text: 'Unresponsive and not breathing means…', options: ['CPR and an emergency call immediately', 'wait', 'just watch', 'pour water'], correctAnswer: 'CPR and an emergency call immediately' },
    { text: 'Before you ever need first aid you should…', options: ['know the emergency number and kit location', 'hope it never happens', 'forget it', 'practice never'], correctAnswer: 'know the emergency number and kit location' },
  ],
  'Personal Protective Equipment & Safe Tools': [
    { text: 'Electrical tools should be…', options: ['VDE/1000 V insulated', 'ordinary screwdrivers', 'anything', 'uninsulated'], correctAnswer: 'VDE/1000 V insulated' },
    { text: 'A voltage tester should be checked…', options: ['on known-live before AND after use', 'once a year', 'never', 'only after'], correctAnswer: 'on known-live before AND after use' },
    { text: 'A damaged insulated tool is…', options: ['repaired or replaced', 'used carefully', 'still fine', 'painted'], correctAnswer: 'repaired or replaced' },
    { text: 'PPE is…', options: ['the last line of defence', 'optional', 'for visitors', 'a choice'], correctAnswer: 'the last line of defence' },
  ],
  'Fire Safety & Electrical Hazards': [
    { text: 'For an electrical fire you use…', options: ['CO2 or dry-powder, never water', 'water', 'sand', 'nothing'], correctAnswer: 'CO2 or dry-powder, never water' },
    { text: 'The PASS method stands for…', options: ['Pull, Aim, Squeeze, Sweep', 'Pick, Act, Spray, Stop', 'Point, Aim, Start', 'nothing'], correctAnswer: 'Pull, Aim, Squeeze, Sweep' },
    { text: 'Electrical fires are class…', options: ['E', 'A', 'B', 'D'], correctAnswer: 'E' },
    { text: 'A breaker that keeps tripping means…', options: ['find the fault, don\'t just reset', 'reset harder', 'buy a bigger breaker', 'ignore it'], correctAnswer: 'find the fault, don\'t just reset' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Circuits — Voltage, Current, Resistance & Power': [
    { text: 'Ohm\'s law is…', options: ['V = I × R', 'V = I / R', 'P = R × I', 'I = V × P'], correctAnswer: 'V = I × R' },
    { text: 'A 1 kW load at 230 V draws about…', options: ['4.3 A', '43 A', '0.4 A', '230 A'], correctAnswer: '4.3 A' },
    { text: 'Sockets are wired…', options: ['in parallel so every socket gets full voltage', 'in series', 'randomly', 'unprotected'], correctAnswer: 'in parallel so every socket gets full voltage' },
    { text: 'Load, cable, fuse and switch are…', options: ['one linked calculation', 'independent', 'unrelated', 'guessed'], correctAnswer: 'one linked calculation' },
  ],
  'Conductors & Cables — Copper, Sizing & Insulation': [
    { text: 'The standard conductor is…', options: ['copper', 'iron', 'plastic', 'steel'], correctAnswer: 'copper' },
    { text: 'A 2.5 mm² copper cable carries roughly…', options: ['20–25 A', '2 A', '50 A', '100 A'], correctAnswer: '20–25 A' },
    { text: 'Ampacity must be derated for…', options: ['conduit, bundling and hot environments', 'nice weather', 'colour', 'nothing'], correctAnswer: 'conduit, bundling and hot environments' },
    { text: 'The earth wire colour is…', options: ['green-yellow (or green)', 'red', 'blue', 'black'], correctAnswer: 'green-yellow (or green)' },
  ],
  'Reading Wiring Diagrams & Symbols': [
    { text: 'Every circuit is…', options: ['a loop: out on live, back on neutral', 'a straight line', 'a tree', 'a box'], correctAnswer: 'a loop: out on live, back on neutral' },
    { text: 'The path order is…', options: ['supply → fuse/MCB → switch → load → neutral', 'load → switch', 'reverse', 'random'], correctAnswer: 'supply → fuse/MCB → switch → load → neutral' },
    { text: 'The lamp symbol is…', options: ['a circle with an X', 'a triangle', 'a box', 'a line'], correctAnswer: 'a circle with an X' },
    { text: 'Reading diagrams well means…', options: ['you can wire what you\'ve never seen before', 'nothing', 'you don\'t need meters', 'you skip tests'], correctAnswer: 'you can wire what you\'ve never seen before' },
  ],
  'Protection — Fuses, MCBs & Earthing': [
    { text: 'An RCD trips on…', options: ['earth leakage', 'overload only', 'high voltage only', 'noise'], correctAnswer: 'earth leakage' },
    { text: 'The protective device must…', options: ['protect the cable', 'be the biggest available', 'be optional', 'protect nothing'], correctAnswer: 'protect the cable' },
    { text: 'Earthing gives fault current…', options: ['a safe path so protection acts', 'no path', 'a delay', 'a colour'], correctAnswer: 'a safe path so protection acts' },
    { text: 'A 2.5 mm² cable with a 32 A MCB means…', options: ['the cable burns before the breaker trips', 'perfect protection', 'nothing', 'good design'], correctAnswer: 'the cable burns before the breaker trips' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'The Distribution System — From Meter to Outlet': [
    { text: 'The distribution chain is…', options: ['meter → main switch → board → circuits', 'board → meter', 'circuit → meter', 'random'], correctAnswer: 'meter → main switch → board → circuits' },
    { text: 'Each circuit has its own MCB so…', options: ['a fault in one room doesn\'t blackout the house', 'it costs more', 'it looks nicer', 'nothing'], correctAnswer: 'a fault in one room doesn\'t blackout the house' },
    { text: 'A geyser or AC needs…', options: ['a dedicated circuit with its own MCB', 'a shared socket', 'no protection', 'a 5 A socket'], correctAnswer: 'a dedicated circuit with its own MCB' },
    { text: 'A labelled distribution board is…', options: ['a maintainable board', 'a decorative board', 'unnecessary', 'for show'], correctAnswer: 'a maintainable board' },
  ],
  'Switches, Sockets & Fittings': [
    { text: 'A two-way switch controls…', options: ['one light from two places', 'two lights', 'a socket', 'the meter'], correctAnswer: 'one light from two places' },
    { text: 'Socket polarity means…', options: ['live, neutral and earth never bridged or reversed', 'the colour is nice', 'nothing', 'random wiring'], correctAnswer: 'live, neutral and earth never bridged or reversed' },
    { text: 'A 5 A socket is for…', options: ['small loads', 'geysers', 'welding', 'mains only'], correctAnswer: 'small loads' },
    { text: 'A loose terminal…', options: ['overheats and fails', 'is fine', 'saves time', 'is recommended'], correctAnswer: 'overheats and fails' },
  ],
  'Conduit, Channels & Cable Routing': [
    { text: 'Cables run safely inside…', options: ['conduit or channel', 'open air', 'water', 'wall cracks'], correctAnswer: 'conduit or channel' },
    { text: 'Junction boxes must be…', options: ['accessible', 'hidden', 'sealed forever', 'optional'], correctAnswer: 'accessible' },
    { text: 'The routing rule is…', options: ['shortest safe path, right protection', 'the longest route', 'anywhere', 'through heat'], correctAnswer: 'shortest safe path, right protection' },
    { text: 'Bends must be…', options: ['smooth, no kinks', 'sharp', 'tight', 'random'], correctAnswer: 'smooth, no kinks' },
  ],
  'Installation Practice — Step by Step': [
    { text: 'The sequence is…', options: ['plan → isolate → conduits → pull → connect → test → energise', 'energise first', 'test never', 'random'], correctAnswer: 'plan → isolate → conduits → pull → connect → test → energise' },
    { text: 'You strip…', options: ['only the needed insulation', 'as much as you like', 'nothing', 'the whole cable'], correctAnswer: 'only the needed insulation' },
    { text: 'The test before power includes…', options: ['continuity, insulation resistance and earth', 'nothing', 'the paint', 'the label'], correctAnswer: 'continuity, insulation resistance and earth' },
    { text: 'A clean test means…', options: ['a safe energise, circuit by circuit', 'skip energising', 'flip everything at once', 'no test needed'], correctAnswer: 'a safe energise, circuit by circuit' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Transformers — Stepping Voltage Up and Down': [
    { text: 'A transformer changes…', options: ['AC voltage via a turns ratio', 'frequency', 'DC to AC', 'power'], correctAnswer: 'AC voltage via a turns ratio' },
    { text: 'Stepping voltage down means…', options: ['current steps up', 'current steps down', 'power increases', 'nothing'], correctAnswer: 'current steps up' },
    { text: 'A 230 V to 12 V lamp transformer has a ratio of about…', options: ['19:1', '2:1', '1:1', '230:1'], correctAnswer: '19:1' },
    { text: 'A damaged oil-filled transformer is…', options: ['a leak/fire hazard', 'fine', 'cosmetic', 'a cooling aid'], correctAnswer: 'a leak/fire hazard' },
  ],
  'Motors — Induction, Single-Phase & Three-Phase': [
    { text: 'The industrial standard motor is…', options: ['three-phase induction', 'single-phase', 'shaded pole', 'DC'], correctAnswer: 'three-phase induction' },
    { text: 'A single-phase motor needs…', options: ['a starting method: capacitor or shaded pole', 'no start', 'a bigger pulley', 'DC'], correctAnswer: 'a starting method: capacitor or shaded pole' },
    { text: 'A common single-phase motor failure is…', options: ['the starting capacitor', 'the colour', 'the fan blades', 'nothing'], correctAnswer: 'the starting capacitor' },
    { text: 'Before connecting a motor you read…', options: ['the nameplate', 'the paint', 'the box', 'the handbook only'], correctAnswer: 'the nameplate' },
  ],
  'Generators & UPS — Keeping the Power On': [
    { text: 'A diesel generator must never run…', options: ['indoors — CO is lethal', 'earthed', 'on load', 'with fuel'], correctAnswer: 'indoors — CO is lethal' },
    { text: 'A UPS provides…', options: ['seamless short-term power', 'long-term only', 'no power', 'heating'], correctAnswer: 'seamless short-term power' },
    { text: 'The changeover must never…', options: ['feed the grid — danger to line workers', 'be automatic', 'be earthed', 'exist'], correctAnswer: 'feed the grid — danger to line workers' },
    { text: 'Generator earthing is…', options: ['mandatory', 'optional', 'a choice', 'for show'], correctAnswer: 'mandatory' },
  ],
  'Measurement Instruments — Multimeter, Clamp Meter, Megger': [
    { text: 'The clamp meter measures…', options: ['current without breaking the circuit', 'resistance', 'temperature', 'voltage only'], correctAnswer: 'current without breaking the circuit' },
    { text: 'The megger measures…', options: ['insulation resistance at high voltage', 'current', 'consumption', 'frequency'], correctAnswer: 'insulation resistance at high voltage' },
    { text: 'The megger is used…', options: ['only on isolated dead circuits', 'on live circuits', 'on water', 'always'], correctAnswer: 'only on isolated dead circuits' },
    { text: 'A reading you don\'t understand…', options: ['should not be trusted', 'is always right', 'is a fact', 'is final'], correctAnswer: 'should not be trusted' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'The Troubleshooting Method — Safe and Systematic': [
    { text: 'The first step of every fault job is…', options: ['isolate and test before touching', 'start replacing parts', 'guess', 'reset breakers'], correctAnswer: 'isolate and test before touching' },
    { text: 'Divide and conquer means…', options: ['each test halves the search space', 'test everything at once', 'skip tests', 'random checks'], correctAnswer: 'each test halves the search space' },
    { text: 'The facts question is…', options: ['what changed before it failed?', 'who did it?', 'is it expensive?', 'nothing'], correctAnswer: 'what changed before it failed?' },
    { text: 'You fix…', options: ['the root cause, not the symptom', 'the symptom only', 'nothing', 'the meter'], correctAnswer: 'the root cause, not the symptom' },
  ],
  'Common Faults — Lights, Sockets, Appliances': [
    { text: 'A dead light checks in order…', options: ['bulb → switch → MCB → loose terminal', 'MCB → bulb', 'loose terminal only', 'random'], correctAnswer: 'bulb → switch → MCB → loose terminal' },
    { text: 'An appliance that trips the RCD suggests…', options: ['earth leakage, often a wet or damaged element', 'a bad socket', 'the paint', 'nothing'], correctAnswer: 'earth leakage, often a wet or damaged element' },
    { text: 'The silent killer in electrical work is…', options: ['a loose connection that heats', 'the bulb', 'the switch', 'the label'], correctAnswer: 'a loose connection that heats' },
    { text: 'You never…', options: ['put a wire instead of a fuse', 'tighten terminals', 'test with meters', 'find faults'], correctAnswer: 'put a wire instead of a fuse' },
  ],
  'Maintenance — Prevention Beats Repair': [
    { text: 'The routine includes…', options: ['terminal tightening and RCD test-button checks', 'nothing', 'repainting', 'replacing boards'], correctAnswer: 'terminal tightening and RCD test-button checks' },
    { text: 'Dust on switchgear is…', options: ['a fire risk and an insulation killer', 'harmless', 'decorative', 'cooling'], correctAnswer: 'a fire risk and an insulation killer' },
    { text: 'Maintenance records…', options: ['turn complaints into visible patterns', 'are extra work', 'are for managers', 'are private'], correctAnswer: 'turn complaints into visible patterns' },
    { text: 'A maintained system…', options: ['fails rarely', 'always fails', 'needs no records', 'is luck'], correctAnswer: 'fails rarely' },
  ],
  'The Electrician Trade Career': [
    { text: 'This course is…', options: ['a supplement that builds trade skills', 'a government license', 'a degree', 'an exam pass'], correctAnswer: 'a supplement that builds trade skills' },
    { text: 'Official trade certification…', options: ['remains governed by the recognised authority', 'comes from this course', 'is automatic', 'is not needed'], correctAnswer: 'remains governed by the recognised authority' },
    { text: 'Career directions include…', options: ['wiring, maintenance, industrial and panel work', 'only one job', 'no growth', 'only sales'], correctAnswer: 'wiring, maintenance, industrial and panel work' },
    { text: 'The electrician who is always in demand is…', options: ['safe, neat and curious', 'the fastest', 'the strongest', 'the loudest'], correctAnswer: 'safe, neat and curious' },
  ],
};
