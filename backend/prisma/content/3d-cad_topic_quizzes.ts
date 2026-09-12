/**
 * 3D CAD — Parametric Solid Modeling — per-topic quizzes.
 * Keyed by the EXACT topic titles in 3d-cad.ts (topic-lock flow).
 * 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in 3d-cad.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'Parametric vs Direct Modeling': [
    { text: 'Parametric modeling…', options: ['records the history of every feature', 'has no history', 'is only for art', 'deletes the timeline'], correctAnswer: 'records the history of every feature' },
    { text: 'Change a dimension in a parametric model and…', options: ['the model rebuilds around it', 'nothing changes', 'everything deletes', 'the file corrupts'], correctAnswer: 'the model rebuilds around it' },
    { text: 'Parametric design captures…', options: ['the design intent', 'the colour', 'the price', 'nothing'], correctAnswer: 'the design intent' },
    { text: 'A free tool for learning is…', options: ['Fusion 360 (personal/student) or FreeCAD', 'SolidWorks only', 'no free tool', 'MATLAB'], correctAnswer: 'Fusion 360 (personal/student) or FreeCAD' },
  ],
  'The Model Tree & Feature History': [
    { text: 'The model tree lists…', options: ['every feature in build order', 'only the bodies', 'the layers', 'the render'], correctAnswer: 'every feature in build order' },
    { text: 'Feature order matters because…', options: ['a fillet before a hole differs from a hole before a fillet', 'it is cosmetic', 'it changes the colour', 'nothing'], correctAnswer: 'a fillet before a hole differs from a hole before a fillet' },
    { text: 'To add a step in the middle of history you…', options: ['roll the timeline back and insert', 'rebuild from scratch', 'delete the tree', 'use a mirror'], correctAnswer: 'roll the timeline back and insert' },
    { text: 'Naming features…', options: ['keeps the tree readable for editing', 'slows the software', 'is forbidden', 'does nothing'], correctAnswer: 'keeps the tree readable for editing' },
  ],
  'Design Intent — Thinking Before You Model': [
    { text: 'Design intent is…', options: ['the why behind dimensions and relationships', 'the colour', 'the price', 'the file size'], correctAnswer: 'the why behind dimensions and relationships' },
    { text: 'A symmetric bracket should dimension holes…', options: ['from the centre', 'from one edge', 'randomly', 'from nothing'], correctAnswer: 'from the centre' },
    { text: 'The driving dimension is…', options: ['the boss that others follow', 'any dimension', 'the smallest', 'the colour'], correctAnswer: 'the boss that others follow' },
    { text: 'Good intent means the part…', options: ['stays correct when someone edits it', 'looks pretty', 'is small', 'is cheap'], correctAnswer: 'stays correct when someone edits it' },
  ],
  'The Design Workspace & Navigation': [
    { text: 'In Fusion, orbit is…', options: ['Shift + wheel', 'Ctrl + C', 'double-click', 'right drag'], correctAnswer: 'Shift + wheel' },
    { text: 'The three default planes are…', options: ['XY, XZ, YZ', 'A, B, C', '1, 2, 3', 'top, front only'], correctAnswer: 'XY, XZ, YZ' },
    { text: 'A section view…', options: ['lets you see inside the part', 'cuts the part permanently', 'deletes material', 'is a render'], correctAnswer: 'lets you see inside the part' },
    { text: 'Every sketch sits on…', options: ['a plane or a face', 'the origin', 'the screen', 'a line'], correctAnswer: 'a plane or a face' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Sketching — Lines, Circles, Arcs & Splines': [
    { text: 'Splines are for…', options: ['free-form curves', 'straight lines', 'circles only', 'nothing'], correctAnswer: 'free-form curves' },
    { text: 'Construction geometry is…', options: ['guides, drawn dashed and not part of the solid', 'the final outline', 'deleted automatically', 'always solid'], correctAnswer: 'guides, drawn dashed and not part of the solid' },
    { text: 'The sketch workflow is…', options: ['draw near, snap, constrain, dimension', 'dimension first', 'finish immediately', 'no order'], correctAnswer: 'draw near, snap, constrain, dimension' },
    { text: 'The sketch is…', options: ['the 2D DNA the features use', 'the finished 3D part', 'the drawing', 'the assembly'], correctAnswer: 'the 2D DNA the features use' },
  ],
  'Geometric Constraints — Parallel, Perpendicular, Coincident': [
    { text: 'A coincident constraint makes…', options: ['two points touch', 'two lines parallel', 'two circles equal', 'nothing'], correctAnswer: 'two points touch' },
    { text: 'A tangent constraint makes…', options: ['two curves touch without crossing', 'two lines perpendicular', 'two holes concentric', 'nothing'], correctAnswer: 'two curves touch without crossing' },
    { text: 'Under-constrained sketches are shown…', options: ['blue (draggable)', 'red', 'green', 'black'], correctAnswer: 'blue (draggable)' },
    { text: 'A sketch is done when…', options: ['it is fully constrained', 'it looks right', 'it is blue', 'the screen is full'], correctAnswer: 'it is fully constrained' },
  ],
  'Dimensional Constraints — Smart Dimensions': [
    { text: 'In parametric CAD a dimension is…', options: ['a variable you can change', 'fixed forever', 'a colour', 'a text'], correctAnswer: 'a variable you can change' },
    { text: 'Named "boss" parameters let you…', options: ['reference them in other features', 'rename the file', 'change the colour', 'nothing'], correctAnswer: 'reference them in other features' },
    { text: 'Each dimension should exist…', options: ['once', 'twice', 'as many times as possible', 'never'], correctAnswer: 'once' },
    { text: 'Redundant dimensions cause…', options: ['conflicts', 'nothing', 'faster rebuilds', 'better parts'], correctAnswer: 'conflicts' },
  ],
  'Fully Constrained Sketches — The Professional Habit': [
    { text: 'A fully constrained sketch…', options: ['cannot be dragged', 'is draggable', 'is broken', 'is red'], correctAnswer: 'cannot be dragged' },
    { text: 'Under-constrained sketches cause…', options: ['broken parts after edits', 'nothing', 'faster designs', 'smaller files'], correctAnswer: 'broken parts after edits' },
    { text: 'The order is…', options: ['draw → geometric constraints → dimensions', 'dimensions → draw', 'constraints last', 'random'], correctAnswer: 'draw → geometric constraints → dimensions' },
    { text: 'The test for fully constrained is…', options: ['try to drag a line — nothing moves', 'the file is small', 'the colour is green', 'no warnings'], correctAnswer: 'try to drag a line — nothing moves' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Extrude & Revolve — The First Features': [
    { text: 'EXTRUDE…', options: ['pulls a sketch perpendicular into a solid', 'spins a sketch around an axis', 'blends profiles', 'cups a face'], correctAnswer: 'pulls a sketch perpendicular into a solid' },
    { text: 'REVOLVE is for…', options: ['round parts: shafts, wheels, bottles', 'only boxes', 'only pipes', 'nothing'], correctAnswer: 'round parts: shafts, wheels, bottles' },
    { text: 'The extrude operations are…', options: ['new body, join, cut, intersect', 'copy and paste', 'undo and redo', 'colour'], correctAnswer: 'new body, join, cut, intersect' },
    { text: 'For symmetric parts you extrude…', options: ['symmetric (both directions)', 'one side only', 'randomly', 'up to a point'], correctAnswer: 'symmetric (both directions)' },
  ],
  'Sweep & Loft — Along Paths, Between Profiles': [
    { text: 'SWEEP…', options: ['slides a profile along a path', 'blends profiles', 'spins around an axis', 'cuts a pocket'], correctAnswer: 'slides a profile along a path' },
    { text: 'LOFT…', options: ['blends between two or more profiles', 'slides a profile', 'rounds edges', 'drills holes'], correctAnswer: 'blends between two or more profiles' },
    { text: 'Square-to-circle transitions use…', options: ['loft', 'sweep', 'extrude', 'revolve'], correctAnswer: 'loft' },
    { text: 'Pipes with a constant cross-section use…', options: ['sweep', 'loft', 'revolve', 'draft'], correctAnswer: 'sweep' },
  ],
  'Boolean Operations — Combine, Cut, Intersect': [
    { text: 'JOIN (boolean)…', options: ['merges two bodies into one', 'removes one body', 'keeps the overlap', 'mirrors'], correctAnswer: 'merges two bodies into one' },
    { text: 'CUT (boolean)…', options: ['removes one body from another', 'merges', 'intersects', 'duplicates'], correctAnswer: 'removes one body from another' },
    { text: 'INTERSECT keeps…', options: ['the overlap of two bodies', 'one body only', 'nothing', 'the largest body'], correctAnswer: 'the overlap of two bodies' },
    { text: 'The clean modelling style is…', options: ['add the stock, cut the features', 'glue many small pieces', 'one giant sketch', 'no booleans'], correctAnswer: 'add the stock, cut the features' },
  ],
  'Bodies, Components & the Part Structure': [
    { text: 'A body is…', options: ['a closed solid', 'a part with its own tree', 'an assembly', 'a sketch'], correctAnswer: 'a closed solid' },
    { text: 'A component is…', options: ['a body plus its own origin, sketches and features', 'a closed solid only', 'a drawing', 'a mate'], correctAnswer: 'a body plus its own origin, sketches and features' },
    { text: 'Multiple components are for…', options: ['parts that move or have different materials', 'a single solid', 'a single sketch', 'nothing'], correctAnswer: 'parts that move or have different materials' },
    { text: 'An assembly is…', options: ['components positioned by mates', 'one body', 'one sketch', 'a drawing'], correctAnswer: 'components positioned by mates' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Fillets, Chamfers & Draft': [
    { text: 'A fillet…', options: ['rounds an edge', 'bevels an edge', 'drills a hole', 'threads'], correctAnswer: 'rounds an edge' },
    { text: 'A chamfer…', options: ['bevels an edge', 'rounds an edge', 'adds a draft', 'cuts a hole'], correctAnswer: 'bevels an edge' },
    { text: 'Draft angles are for…', options: ['moulded and cast parts', 'machined flat parts', '3D prints only', 'nothing'], correctAnswer: 'moulded and cast parts' },
    { text: 'Fillets go…', options: ['last', 'first', 'before holes', 'never'], correctAnswer: 'last' },
  ],
  'Holes & Threads — The Standard Hardware': [
    { text: 'A clearance hole lets…', options: ['a bolt pass through', 'a thread screw in', 'a counterbore seat', 'nothing'], correctAnswer: 'a bolt pass through' },
    { text: 'A tapped hole…', options: ['has threads a bolt screws into', 'lets a bolt pass through', 'is cosmetic', 'is a counterbore'], correctAnswer: 'has threads a bolt screws into' },
    { text: 'For an M6 clearance you drill…', options: ['about 6.6 mm', 'exactly 6.0 mm', '10 mm', '3 mm'], correctAnswer: 'about 6.6 mm' },
    { text: 'The correct sizes come from…', options: ['standard tables (ISO/metric)', 'your guess', 'the colour', 'the file'], correctAnswer: 'standard tables (ISO/metric)' },
  ],
  'Patterns & Mirror — One Detail, Many': [
    { text: 'A rectangular pattern…', options: ['repeats in rows and columns', 'repeats around an axis', 'mirrors across a plane', 'randomly'], correctAnswer: 'repeats in rows and columns' },
    { text: 'A circular pattern…', options: ['repeats around an axis', 'repeats in a grid', 'mirrors', 'nothing'], correctAnswer: 'repeats around an axis' },
    { text: 'MIRROR…', options: ['copies across a plane for symmetric halves', 'rotates a part', 'scales a part', 'deletes'], correctAnswer: 'copies across a plane for symmetric halves' },
    { text: 'Patterns stay linked so…', options: ['editing the original updates every instance', 'they are random', 'they freeze', 'nothing'], correctAnswer: 'editing the original updates every instance' },
  ],
  'Assemblies & Mates — Putting Parts Together': [
    { text: 'A concentric mate aligns…', options: ['the axes of two parts', 'two faces', 'two edges', 'two colours'], correctAnswer: 'the axes of two parts' },
    { text: 'A bolt in a hole is…', options: ['concentric + coincident', 'a tangent only', 'a draft', 'an angle'], correctAnswer: 'concentric + coincident' },
    { text: 'A revolute joint…', options: ['allows rotation', 'allows translation', 'locks everything', 'removes freedom'], correctAnswer: 'allows rotation' },
    { text: 'The assembly build order is…', options: ['ground the base, mate each part, check freedom', 'random', 'all at once', 'no base'], correctAnswer: 'ground the base, mate each part, check freedom' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Engineering Drawings from the Model': [
    { text: 'The drawing…', options: ['derives from the model and updates with it', 'is hand-drawn', 'is a photo', 'is separate'], correctAnswer: 'derives from the model and updates with it' },
    { text: 'A section view…', options: ['cuts through the part to show internals', 'is a magnified detail', 'is the base view', 'is projected'], correctAnswer: 'cuts through the part to show internals' },
    { text: 'ANSI projection is…', options: ['third angle', 'first angle', 'no angle', 'a circle'], correctAnswer: 'third angle' },
    { text: 'The drawing carries…', options: ['the manufacturing contract (dims and tolerances)', 'only the name', 'the colour', 'nothing'], correctAnswer: 'the manufacturing contract (dims and tolerances)' },
  ],
  'Export & 3D Printing — STL, STEP, Print-Ready Parts': [
    { text: 'STL is…', options: ['a triangle mesh for 3D printing', 'a CAD interchange format', 'a drawing', 'a video'], correctAnswer: 'a triangle mesh for 3D printing' },
    { text: 'STEP is…', options: ['a solid CAD interchange format', 'a mesh for printing', 'a sketch', 'a photo'], correctAnswer: 'a solid CAD interchange format' },
    { text: 'Overhangs beyond about 45° need…', options: ['supports', 'nothing', 'thicker walls', 'a draft'], correctAnswer: 'supports' },
    { text: 'A watertight STL means…', options: ['no holes or gaps in the mesh', 'a thick wall', 'a manifold only', 'no supports'], correctAnswer: 'no holes or gaps in the mesh' },
  ],
  'Design for Manufacturing — Fit, Tolerance & Cost': [
    { text: 'A running clearance fit is…', options: ['H7/g6', 'H7/p6', 'H7/h6', 'H7/h7'], correctAnswer: 'H7/g6' },
    { text: 'An interference fit is…', options: ['a press fit', 'a running fit', 'a sliding fit', 'no fit'], correctAnswer: 'a press fit' },
    { text: 'The tolerance rule is…', options: ['tighten only where it matters', 'tight everywhere', 'loose everywhere', 'random'], correctAnswer: 'tighten only where it matters' },
    { text: 'DFM wants…', options: ['standard parts and simple geometry', 'custom everything', 'thin deep pockets', 'no holes'], correctAnswer: 'standard parts and simple geometry' },
  ],
  'The Project — Design It, Model It, Print It': [
    { text: 'The project starts with…', options: ['requirements written on paper', 'printing', 'the drawing', 'the assembly'], correctAnswer: 'requirements written on paper' },
    { text: 'The pipeline is…', options: ['spec → sketch → model → features → export → print', 'print first', 'model first', 'no order'], correctAnswer: 'spec → sketch → model → features → export → print' },
    { text: 'When a printed part fails you…', options: ['fix the model and print again', 'blame the printer', 'give up', 'buy a new part'], correctAnswer: 'fix the model and print again' },
    { text: 'The proof of the course is…', options: ['a working printed part', 'a pretty render', 'a certificate', 'a big file'], correctAnswer: 'a working printed part' },
  ],
};
