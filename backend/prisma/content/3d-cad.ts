/**
 * 3D CAD — Parametric Solid Modeling — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in 3d-cad_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Parametric Modeling Fundamentals ────────────────────────────────
  {
    week: 1,
    title: 'Parametric Modeling Fundamentals',
    description: 'Why 3D parametric design is different, the model tree, and design intent from the first sketch.',
    topics: [
      {
        title: 'Parametric vs Direct Modeling',
        text: 'Parametric modeling stores the HISTORY: every sketch, dimension and feature is a recorded step that can be edited. Change a dimension and the model rebuilds. Direct modeling edits the geometry surface directly, with no history.\n\nParametric wins for engineering because it captures design intent — the "why" behind the shape. Change the hole spacing from 40 to 50 mm and every dependent feature follows. It is also fully editable and re-usable for new sizes.\n\nThe tools: Fusion 360 (free for personal/hobby), SolidWorks, Onshape, FreeCAD (open source) and the free Fusion for students. This course uses Fusion-style workflow — the skills transfer everywhere.',
        code: '// Parametric pipeline\nSketch → dimension/constrain → feature (extrude) →\nmore features → edit any step → model rebuilds\n\n// Direct pipeline\nGrab geometry → push/pull → no history\n\n// Tools\nFusion 360 · SolidWorks · Onshape · FreeCAD',
        note: 'Parametric = recorded history + editability. Design intent lives in the dimensions and constraints.',
      },
      {
        title: 'The Model Tree & Feature History',
        text: 'The browser/model tree lists every feature in build order: the origin, the sketches, each feature, bodies, and the final part. It is the timeline of your design.\n\nRules that save you: name features meaningfully (Screw_Hole, Base_Extrude), keep the tree clean, and edit features by double-clicking — dimensions and sketches open for change.\n\nFeature order matters. A fillet before a hole behaves differently from a hole before a fillet. Roll the timeline back to add a step in the middle when needed. The tree is your design\'s memory — treat it well.',
        code: '// Tree structure\nPart\n ├─ Origin (planes + axes)\n ├─ Sketch 1 (profile)\n ├─ Extrude 1 (base block)\n ├─ Hole 1\n ├─ Fillet 1\n └─ Body\n\n// Good habits\nRename every feature\nKeep sketches simple\nEdit by double-click',
        note: 'The tree is the design timeline. Name features, mind the order, edit by double-click.',
      },
      {
        title: 'Design Intent — Thinking Before You Model',
        text: 'Design intent is the "why": which dimensions are fixed by function, which sizes must change together, and how parts relate. Before sketching, decide: what is the driving dimension (the boss), what follows from it, and what stays rigid.\n\nExample: a bracket whose bolt spacing must stay symmetric — model the centre at the origin and dimension both holes from the centre, not from one edge. Change the width and the symmetry survives.\n\nModelling with intent means the part stays correct when someone edits it — which is the whole point of parametric design. Sketch the intent on paper before the computer.',
        code: '// Ask before modelling\nWhich dimension drives?   (the boss)\nWhat must stay symmetric?\nWhat changes together?\nWhat is fixed forever?\n\n// Example: symmetric bracket\nCentre on origin\nBoth holes dimensioned from the centre\nWidth drives → holes stay centred',
        note: 'Design intent is captured in HOW you dimension. Symmetry lives in the constraints, not the looks.',
      },
      {
        title: 'The Design Workspace & Navigation',
        text: 'The 3D workspace adds navigation to the 2D habits: orbit, pan and zoom around the model. Fusion\'s orbit (Shift+wheel), the ViewCube, and the navigation bar give you all angles.\n\nThe planes: three default construction planes (XY, XZ, YZ) — every sketch lives on a plane or a face. Pick the right plane at the start; it sets the natural orientation of the part.\n\nMaster the basics: orbit freely, look at faces square-on (look-at), toggle the visual style (shaded, wireframe, section view), and use the measure tool constantly. A model you can navigate quickly is a model you can design quickly.',
        code: '// Navigation (Fusion)\nShift + wheel — orbit\nWheel — zoom\nMiddle drag — pan\n\n// Construction planes\nXY · XZ · YZ\nEvery sketch sits on a plane or a face\n\n// Visual styles\nShaded · Wireframe · X-ray · Section view',
        note: 'Orbit with Shift+wheel, sketch on the right plane, and section-view to see inside your part.',
      },
    ],
    quizzes: [
      { text: 'Parametric modeling stores…', options: ['the history of sketches and features', 'only the final surface', 'nothing', 'a photo'], correctAnswer: 'the history of sketches and features' },
      { text: 'The model tree lists…', options: ['every feature in build order', 'only the bodies', 'the layers', 'the colours'], correctAnswer: 'every feature in build order' },
      { text: 'Design intent means…', options: ['capturing the why in dimensions and constraints', 'the look of the part', 'the colour', 'the file name'], correctAnswer: 'capturing the why in dimensions and constraints' },
      { text: 'Every sketch in 3D CAD lives on…', options: ['a plane or a face', 'the origin', 'the screen', 'a line'], correctAnswer: 'a plane or a face' },
    ],
  },

  // ── W2 · Sketches & Constraints ──────────────────────────────────────────
  {
    week: 2,
    title: 'Sketches & Constraints',
    description: 'The sketch is the DNA of the part — fully constrained, fully controlled.',
    topics: [
      {
        title: 'Sketching — Lines, Circles, Arcs & Splines',
        text: 'Every solid starts as a 2D sketch: lines, circles, arcs, rectangles, polygons and splines. Sketch on the correct plane, use construction geometry for guides, and snap to existing sketch geometry.\n\nThe sketch commands mirror 2D CAD: line, circle (centre or 3-point), arc (three-point, tangent, centre-point), rectangle, slot, polygon. Splines make free-form curves.\n\nDraw close to the final shape first — constraints will perfect it. Overlap and approximate, then let the geometry snaps and dimensions pin it down.',
        code: '// Sketch commands\nLINE · CIRCLE · ARC · RECTANGLE · POLYGON · SPLINE\n\n// Construction geometry\nFully snapped, dashed lines used as guides\n\n// Sketch workflow\n1. Draw near the shape\n2. Snap to existing geometry\n3. Constrain + dimension\n4. Finish when fully constrained',
        note: 'Draw rough, then constrain. The sketch is 2D; the features turn it into 3D.',
      },
      {
        title: 'Geometric Constraints — Parallel, Perpendicular, Coincident',
        text: 'Constraints define geometric relationships: coincident (points touch), parallel, perpendicular, horizontal, vertical, tangent, concentric, equal, collinear, and midpoint. They lock relationships, not sizes.\n\nThe solver colours sketches: white = fully constrained, blue = under-constrained, and over-constrained shows as red/redundant. A sketch is DONE when it is fully constrained and only the dimensions remain as the variables.\n\nLearn the constraint set — it is the difference between a sketch that edits cleanly and one that falls apart. Tangent and concentric rule the mechanical world.',
        code: '// Constraint set\nCoincident · Parallel · Perpendicular\nHorizontal · Vertical · Tangent\nConcentric · Equal · Collinear · Midpoint\n\n// Solver colours\nBlue — under-constrained (draggable)\nWhite/black — fully constrained\nRed — over-constrained / conflict',
        note: 'Constraints lock geometry relationships. Fully constrained sketches edit predictably.',
      },
      {
        title: 'Dimensional Constraints — Smart Dimensions',
        text: 'Dimensions give numbers to the geometry: length, angle, distance, radius, diameter. In parametric CAD a dimension is a VARIABLE — change it in the model and the part resizes.\n\nPut a name on critical dimensions (the "boss" parameters) and reference them in other sketches and features. Dimension between construction lines and centre lines to control the intent, not just edge-to-edge.\n\nEach dimension should exist once. Redundant dimensions cause conflicts; missing dimensions leave the sketch draggable. The discipline: every part of the sketch is located either by a constraint or a dimension.',
        code: '// Dimension types\nLength · Angle · Distance · Radius · Diameter\n\n// Named parameters\nwidth = 100   — the driving boss\nLength_2 = width * 2\n\n// Rule\nEvery element located by a constraint OR a dimension',
        note: 'Dimensions are variables. Name the bosses, dimension once, and reference them downstream.',
      },
      {
        title: 'Fully Constrained Sketches — The Professional Habit',
        text: 'A fully constrained sketch cannot be dragged — its shape is locked, and only the dimension values can change. That is the professional state. It survives edits, rebuilds and handoffs.\n\nReach it methodically: draw the shape, apply the geometric constraints (concentric, parallel, tangent), then add dimensions until the sketch is fully constrained. The status bar tells you.\n\nUnder-constrained sketches are the #1 source of broken parts later: an edit moves the wrong line. Two minutes of constraint discipline saves an hour of repair.',
        code: '// The fully-constrained habit\n1. Draw the shape\n2. Geometric constraints (relationships)\n3. Dimensions (numbers)\n4. Watch the status → fully constrained\n\n// Check\nTry to drag any line — nothing moves',
        note: 'Fully constrained = predictable. Drag-test your sketch before you finish it.',
      },
    ],
    quizzes: [
      { text: 'The sketch is…', options: ['the 2D DNA that features turn into 3D', 'the final part', 'the assembly', 'the drawing'], correctAnswer: 'the 2D DNA that features turn into 3D' },
      { text: 'A tangent constraint means…', options: ['two curves touch without crossing', 'two lines are parallel', 'two circles are equal', 'nothing'], correctAnswer: 'two curves touch without crossing' },
      { text: 'A fully constrained sketch…', options: ['cannot be dragged — only dimensions change', 'is draggable', 'is broken', 'is red'], correctAnswer: 'cannot be dragged — only dimensions change' },
      { text: 'Over-constrained means…', options: ['a conflict — too many rules', 'not enough rules', 'perfect', 'the sketch is done'], correctAnswer: 'a conflict — too many rules' },
    ],
  },

  // ── W3 · Solid Features ──────────────────────────────────────────────────
  {
    week: 3,
    title: 'Solid Features',
    description: 'Turning sketches into solids: extrude, revolve, sweep, loft, and the boolean toolkit.',
    topics: [
      {
        title: 'Extrude & Revolve — The First Features',
        text: 'EXTRUDE pulls a closed sketch perpendicular into a solid: a base block, a boss, or a cut (if you remove material). The distance, direction (one side, both, symmetric) and the operation (new body, join, cut, intersect) define the result.\n\nREVOLVE spins a sketch around an axis — the natural way to make anything round: shafts, wheels, bottles, pulleys. A half-profile sketched about a centre axis revolves into the full solid.\n\nThese two features build most mechanical parts. Get fluent in the options: extrude-to-face, extrude up to a surface, and revolve the profile correctly about its axis.',
        code: '// EXTRUDE\nSketch → Extrude → distance/direction/operation\nNew body · Join · Cut · Intersect\n\n// REVOLVE\nHalf-profile + centre axis → revolve 360°\nShafts · Wheels · Bottles · Pulleys\n\n// Think\nSymmetric → extrude symmetric (both directions)',
        note: 'Extrude pulls, revolve spins. Most parts start with one of these two.',
      },
      {
        title: 'Sweep & Loft — Along Paths, Between Profiles',
        text: 'SWEEP moves a profile along a path — pipes, rails, gaskets, handles. The path can be a sketch line or a model edge; the profile stays perpendicular to it.\n\nLOFT blends between two or more profiles — the way to go from a square to a circle, or a nozzle, a duct, a bottle neck. Loft profiles can be on different planes; rails guide the transition.\n\nSweep is for constant cross-sections along a path; loft is for changing cross-sections. Both are the "sculpt" features beyond extrude and revolve.',
        code: '// SWEEP\nProfile + path → slide profile along the path\nPipes · Rails · Handles · Gaskets\n\n// LOFT\nProfile 1 → profile 2 (…more) → blend\nSquare → circle · Ducts · Nozzles\n\n// Choose\nConstant cross-section → sweep\nChanging cross-section → loft',
        note: 'Sweep slides, loft blends. Constant section along a path = sweep; morphing sections = loft.',
      },
      {
        title: 'Boolean Operations — Combine, Cut, Intersect',
        text: 'Solids can be combined with boolean operations. JOIN merges two bodies into one; CUT removes one body from another (a body minus a hole-block); INTERSECT keeps the overlap.\n\nBooleans are the final assembly of shapes: extrude a flange, create a separate cylinder, then join them; make the pocket as a separate body and cut it out.\n\nModelling style matters: keep the tree clean with add-then-cut (add the stock, cut the holes) rather than many glued pieces. Separate bodies also allow different materials later.',
        code: '// Boolean ops\nJOIN      — A + B into one body\nCUT       — A - B\nINTERSECT — overlap of A and B\n\n// Add-then-cut style\n1. Add the stock (extrude/revolve/sweep)\n2. Cut the pockets/holes\n3. Join secondary shapes',
        note: 'Add the stock, cut the features. Booleans shape the raw solid into the part.',
      },
      {
        title: 'Bodies, Components & the Part Structure',
        text: 'A body is a closed solid; a component is a body PLUS its own origin, sketches and features — the container of a part. In an assembly, each part is a component; in a part file you usually have one component with one or more bodies.\n\nWhen to split: model multiple bodies when they must move or get materials separately, or when a boolean needs separate pieces. Ground the base, keep the tree tidy, and name bodies and components as you go.\n\nDesign intent at this level: a bracket with two plates joined by a web could be one body or three components — the choice is about whether they are one part or many.',
        code: '// Body vs component\nBody      — a closed solid\nComponent — body + its own origin + features\n\n// Part vs assembly\nPart file:  usually one component\nAssembly:  many components, positioned by mates\n\n// Choose\nOne material, one piece → one body\nMust move / separate material → components',
        note: 'Bodies are solids; components are parts with their own tree. Assembly = components + mates.',
      },
    ],
    quizzes: [
      { text: 'EXTRUDE…', options: ['pulls a sketch perpendicular into a solid', 'spins a sketch around an axis', 'slides a profile along a path', 'blends profiles'], correctAnswer: 'pulls a sketch perpendicular into a solid' },
      { text: 'REVOLVE is for…', options: ['anything round: shafts and wheels', 'rectangular boxes', 'pipes only', 'nothing'], correctAnswer: 'anything round: shafts and wheels' },
      { text: 'LOFT blends…', options: ['between two or more profiles', 'a profile along a path', 'two lines', 'nothing'], correctAnswer: 'between two or more profiles' },
      { text: 'CUT (boolean)…', options: ['removes one body from another', 'merges two bodies', 'keeps the overlap', 'duplicates'], correctAnswer: 'removes one body from another' },
    ],
  },

  // ── W4 · Design Features & Assemblies ────────────────────────────────────
  {
    week: 4,
    title: 'Design Features & Assemblies',
    description: 'Fillets, holes, patterns, shells — and putting parts together with mates.',
    topics: [
      {
        title: 'Fillets, Chamfers & Draft',
        text: 'FILLET rounds edges; CHAMFER bevels them. Both are cosmetic AND functional: they reduce stress concentrations, ease assembly, and remove sharp edges. Fillet at the END of modelling — after holes and cuts, or they shrink.\n\nDRAFT angles walls slightly for injection moulding and casting — parts must pull out of the mould. A draft angle (usually 0.5°–2°) on vertical faces is part of every moulded part.\n\nOrder matters: fillet last, after the geometry is final. Fillet before a cut and the cut swallows the fillet. The tree records the order — plan it.',
        code: '// FILLET / CHAMFER\nFILLET  — round an edge (radius)\nCHAMFER — bevel an edge (distances/angle)\n\n// DRAFT\nMoulded/cast faces need a draft angle (0.5°–2°)\n\n// Order\nGeometry → holes/cuts → fillets/chamfers LAST',
        note: 'Fillets last, after the geometry is final. Draft for anything that comes out of a mould.',
      },
      {
        title: 'Holes & Threads — The Standard Hardware',
        text: 'Holes are a feature, not a sketch circle: a drilled, counterbore, countersink or tapped hole, driven by standard sizes. The hole feature knows drill depths, countersinks, clearances and thread tables.\n\nStandard hardware: through holes for clearance (bolt passes through), tapped holes for threads (bolt screws in), counterbored for cap screws, countersunk for flat-head screws. Clearance and thread sizes come from tables (ISO/Metric).\n\nDesign for assembly: a bolt hole needs the right clearance, the right head seating, and enough material around it. Use the standard tables — don\'t invent sizes.',
        code: '// Hole types\nDrilled · Counterbore · Countersink · Tapped\n\n// For an M6 bolt\nClearance hole — 6.6 mm (pass through)\nTapped hole   — M6 × 1.0 thread\nCounterbore   — for the cap screw head\n\n// Placement\nDimension from the functional edges',
        note: 'Holes are standard features with tables. Clearance for pass-through, tapped for threads.',
      },
      {
        title: 'Patterns & Mirror — One Detail, Many',
        text: 'RECTANGULAR PATTERN repeats a feature in rows and columns; CIRCULAR (polar) pattern repeats around an axis — bolt circles, gear teeth, cooling fins. MIRROR copies across a plane for symmetric halves.\n\nPattern a FEATURE (or a body) rather than copying the geometry manually — patterns stay linked to the original and to the parameters. Change the original, the pattern updates.\n\nThe efficiency habit: model one hole, pattern it. One tooth, pattern it. Parametric patterns mean one edit updates dozens of instances.',
        code: '// Patterns\nRectangular — rows × columns\nCircular — around an axis (bolt circles, fins)\nMirror — across a plane (symmetric halves)\n\n// Best practice\nPattern the feature, keep it linked\nChange the original → the pattern follows',
        note: 'Model one, pattern the rest. Linked patterns make one edit propagate everywhere.',
      },
      {
        title: 'Assemblies & Mates — Putting Parts Together',
        text: 'An assembly places components and defines how they relate with MATE (coincident, concentric, tangent, distance, angle) constraints. Mates replace dimensions — parts move within the allowed degrees of freedom.\n\nThe core mate set: coincident (faces touch), concentric (axes align — the bolt-in-hole), distance, angle, tangent, and rigid. A revolute joint (pin in a hole) allows rotation; a slider allows translation.\n\nBuild assemblies in a logical order: ground the base, mate each part to what is already placed, and check the degrees of freedom. A properly mated assembly tells you instantly what can move and how.',
        code: '// Mate types\nCoincident · Concentric · Distance\nAngle · Tangent · Rigid\n\n// Joints\nRevolute — pin rotating in a hole\nSlider — translation along a direction\n\n// Build order\nGround the base → mate each part → check freedom',
        note: 'Mates constrain motion; joints define it. Concentric + coincident = a bolt in its hole.',
      },
    ],
    quizzes: [
      { text: 'Fillets should be added…', options: ['last, after the geometry is final', 'first', 'before holes', 'never'], correctAnswer: 'last, after the geometry is final' },
      { text: 'Draft angles exist because…', options: ['moulded parts must pull out of the mould', 'they look nice', 'they save material', 'they are required'], correctAnswer: 'moulded parts must pull out of the mould' },
      { text: 'A bolt passes through a…', options: ['clearance hole', 'tapped hole', 'blind hole', 'thread'], correctAnswer: 'clearance hole' },
      { text: 'A circular pattern repeats…', options: ['around an axis', 'in rows and columns', 'across a plane', 'randomly'], correctAnswer: 'around an axis' },
    ],
  },

  // ── W5 · Documentation & Manufacturing ───────────────────────────────────
  {
    week: 5,
    title: 'Documentation & Manufacturing',
    description: 'From model to drawing, to manufactured part — and the design project that ties it all together.',
    topics: [
      {
        title: 'Engineering Drawings from the Model',
        text: 'The drawing comes FROM the model: place base, projected, section and detail views, add dimensions and the titleblock. Because it is derived, the drawing updates when the model changes — the whole point of parametric work.\n\nViews: the base view, projected views (orthographic), section views through cutting planes, and detail views magnifying a feature. ISO or ANSI projection conventions.\n\nDimension the drawing to manufacturing intent: functional sizes, reference dims marked (ref), tolerances where fit matters. The model is the truth; the drawing is the contract for the shop.',
        code: '// Drawing views\nBase view · Projected (ortho) · Section · Detail\n\n// Projection standards\nISO (first angle) · ANSI (third angle)\n\n// Dimension discipline\nFunctional sizes · tolerances where fit matters\nReference dims marked (REF)',
        note: 'The drawing derives from the model. Views, sections and dims carry the manufacturing contract.',
      },
      {
        title: 'Export & 3D Printing — STL, STEP, Print-Ready Parts',
        text: 'EXPORT the model in the right format: STEP for CAD interchange (keeps solid geometry, works everywhere), STL for 3D printing (a triangle mesh of the surface), and native formats for the original tool.\n\nPrint-ready means: a watertight solid (no holes or gaps), the right orientation (overhangs supported or rotated), proper wall thickness, and slicing with supports where needed. Overhangs beyond ~45° need supports.\n\nPrint checklist: manifold mesh, units set, shell/wall thickness ≥ printer minimum, infill for strength, orientation minimising supports. A print-ready STL is a designed STL.',
        code: '// Formats\nSTEP — CAD interchange (solid, universal)\nSTL  — 3D printing (triangle mesh)\nNative — the original tool\n\n// Print readiness\nWatertight solid ✓\nOrientation minimises supports ✓\nWall thickness ≥ printer minimum ✓\nUnits correct ✓',
        note: 'STEP for CAD, STL for printing. Print-ready = watertight, oriented, thick enough.',
      },
      {
        title: 'Design for Manufacturing — Fit, Tolerance & Cost',
        text: 'Design for manufacturing (DFM) means the part is easy and cheap to make: sensible tolerances, standard hardware, uniform wall thickness, no impossible geometry. Looser tolerance where nothing fits, tighter only where it matters.\n\nFits: clearance (shaft spins in hole), transition, interference (press fit). Tolerances are named (H7, g6) in ISO systems — a hole H7 and shaft g6 is a standard running fit.\n\nDFM rules: use standard parts (screws, bearings, pins), avoid deep pockets and thin walls for machining, keep mould draft, and machine only the features that need accuracy. Cost follows simplicity.',
        code: '// Fit system (ISO)\nH7/g6  — running clearance fit\nH7/h6  — sliding fit\nH7/p6  — interference (press) fit\n\n// DFM rules\nStandard hardware only\nUniform wall thickness\nTolerate only what matters\nNo impossible geometry (deep thin pockets)',
        note: 'DFM = standard parts, sane tolerances, simple geometry. Cost and quality follow simplicity.',
      },
      {
        title: 'The Project — Design It, Model It, Print It',
        text: 'The capstone: a real design. Pick a small mechanical object — a phone stand, a cable clip, a bottle opener — and run the whole pipeline: requirements → sketches with intent → model → features → assembly (if multi-part) → drawing → print-ready STL.\n\nThe method: write the requirements (what it holds, dimensions, load), sketch the concept on paper, model it parametrically, check the constraints, fillet last, then export and slice.\n\nThe review: does it meet the spec, is it printable, does the drawing document it? Fix in the model, not on paper. A finished, printed, working part is the proof of the whole course.',
        code: '// Project pipeline\n1. Requirements (spec on paper)\n2. Concept sketch\n3. Parametric model\n4. Features + fillets\n5. Drawing (if needed)\n6. Export STL → slice → print\n7. Test → fix the model → print again\n\n// The proof\nA printed part that works = the course done',
        note: 'Design → model → print → test. A working printed part is the certificate of this course.',
      },
    ],
    quizzes: [
      { text: 'The drawing is…', options: ['derived from the model and updates with it', 'drawn by hand each time', 'a photo', 'unrelated'], correctAnswer: 'derived from the model and updates with it' },
      { text: 'STL is used for…', options: ['3D printing', 'CAD interchange', 'assemblies', 'drawings'], correctAnswer: '3D printing' },
      { text: 'A watertight solid means…', options: ['no holes or gaps in the mesh', 'a thick wall', 'a heavy part', 'no text'], correctAnswer: 'no holes or gaps in the mesh' },
      { text: 'H7/g6 is a…', options: ['standard running clearance fit', 'weld symbol', 'drawing title', 'material code'], correctAnswer: 'standard running clearance fit' },
    ],
  },
];
