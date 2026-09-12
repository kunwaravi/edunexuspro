/**
 * AutoCAD 2D — Technical Drafting — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in autocad-2d_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Getting Started with AutoCAD ────────────────────────────────────
  {
    week: 1,
    title: 'Getting Started with AutoCAD',
    description: 'The interface, navigation, coordinates and the precision habits that make a drafter.',
    topics: [
      {
        title: 'The AutoCAD Interface & Workspaces',
        text: 'AutoCAD\'s screen has four zones you will live in: the ribbon (tabs of commands: Home, Insert, Annotate, Layer, Block, Output), the drawing area with the crosshair cursor, the command line at the bottom (where AutoCAD talks back to you), and the status bar with drafting aids.\n\nEvery action is a command. You can click a ribbon icon or type the command name — typing is faster and pros type. The command line shows prompts, options and previous values.\n\nWorkspaces group the ribbon: Drafting & Annotation for 2D work, 3D Basics/Modeling for solid work. Customize toolbars and the quick access bar to what you use daily.',
        code: '// Command-line workflow\nCommand: LINE       (type the command)\nSpecify first point: 0,0\nSpecify next point: 100,0\n…\n\n// Keys you will use all day\nESC        — cancel\nENTER      — accept / repeat\nSPACE      — repeat last command\nF8         — ortho on/off (90° angles)\nF3         — object snap on/off',
        note: 'The command line is the soul of AutoCAD. Type commands, read the prompts, build the habit.',
      },
      {
        title: 'Navigating the Drawing — Zoom, Pan & Views',
        text: 'Precision needs control over what you see. Zoom in on details, pan around the sheet, and zoom extents to see everything at once.\n\nThe wheel mouse does the heavy lifting: scroll to zoom, middle-click and drag to pan, double-click the wheel for zoom extents. Keep your eye on the command line when zooming for exact scale factors.\n\nNavigation aids: the ViewCube (3D), zooming to an object or a window, and named views that jump straight back to a saved viewpoint. Save views for repeated inspection points.',
        code: '// Mouse navigation\nWheel scroll   — zoom\nWheel drag     — pan\nDouble-click wheel — zoom extents\n\n// View commands\nZOOM E (extents) — see everything\nZOOM W (window)  — zoom into a box\nPAN  — move the view\nVIEW — save and restore named views',
        note: 'Zoom with the wheel, pan with the middle button, zoom extents to reset. Saved views save minutes.',
      },
      {
        title: 'Coordinates — Absolute, Relative & Polar',
        text: 'AutoCAD places everything by coordinates. Absolute: type X,Y from the origin (0,0). Relative: @X,Y from the last point. Polar: @distance<angle. \n\n@50,30 means "50 right, 30 up from the last point". @100<45 means "100 long at 45°". These three forms are the grammar of every drawing.\n\nWith Ortho (F8) on, lines snap to horizontal/vertical; with Polar Tracking, angles snap to common increments. Type the numbers — never eyeball. A drawing is only as good as its coordinates.',
        code: '// The three coordinate forms\nAbsolute: 100,50      (from origin)\nRelative: @100,50     (from last point)\nPolar:    @100<45     (100 long at 45°)\n\n// Drawing a 100×50 rectangle\nLINE 0,0 → @100,0 → @0,50 → @-100,0 → CLOSE',
        note: '@ distance<angle is the drafter\'s workhorse. Type exact values; never draw by eye.',
      },
      {
        title: 'Precision Tools — Snap, Grid & Object Snap',
        text: 'Drafting aids keep your cursor on exact values. Grid shows dots at a spacing; Snap locks the cursor to increments (snap off for free drawing). Object Snap (OSNAP) snaps to precise points ON existing objects: endpoints, midpoints, intersections, centres, quadrants, perpendicular and tangent.\n\nObject snap tracking (OTRACK) extends temporary alignment lines so you can find points that align with existing geometry. Set your running osnaps to endpoint, midpoint, centre, intersection, quadrant — the daily set.\n\nThe difference between "about right" and "exactly on" is OSNAP. It is the #1 professional habit.',
        code: '// Running OSNAPs (right-click OSNAP → settings)\nEndpoint   Midpoint   Centre\nIntersection   Quadrant   Perpendicular\n\n// Toggle keys\nF7 grid · F9 snap · F3 osnap · F11 otrack\n\n// OSNAP overrides (type when you need one)\nEND  midpoint MID  intersection INT',
        note: 'OSNAP snaps to real geometry points. Set your running snaps once and leave them on.',
      },
    ],
    quizzes: [
      { text: 'The command line is where…', options: ['AutoCAD prompts and you type commands', 'you see the finished drawing', 'files are saved', 'layers are named'], correctAnswer: 'AutoCAD prompts and you type commands' },
      { text: 'The relative coordinate from the last point is written…', options: ['@X,Y', 'X,Y', '#X,Y', 'X@Y'], correctAnswer: '@X,Y' },
      { text: 'To cancel a command you press…', options: ['ESC', 'ENTER', 'SPACE', 'F8'], correctAnswer: 'ESC' },
      { text: 'Object snap snaps to…', options: ['exact points on existing objects', 'the grid dots', 'random spots', 'the origin'], correctAnswer: 'exact points on existing objects' },
    ],
  },

  // ── W2 · Drawing & Modifying ─────────────────────────────────────────────
  {
    week: 2,
    title: 'Drawing & Modifying',
    description: 'The geometry commands and the modify tools that shape any drawing.',
    topics: [
      {
        title: 'Lines, Polylines & Rectangles',
        text: 'LINE draws individual segments — each is its own object. POLYLINE draws connected segments as ONE object with uniform width — the professional choice for outlines, paths and anything that is a single feature.\n\nRECTANGLE draws a polyline rectangle from two corners; it is just a shortcut you will use constantly. CIRCLE and ARC complete the basic shapes: circle from centre+radius or 3 points, arc many ways (start-end-angle, start-centre-end).\n\nChoose deliberately: separate lines for separate objects, one polyline when it is really one outline. Object count is your freedom — fewer, meaningful objects are easier to modify later.',
        code: '// LINE — individual segments\nL 0,0 → 100,0 → 100,50\n\n// POLYLINE — one connected object\nPL 0,0 → @100,0 → @0,50 → CLOSE\n\n// RECTANGLE — two corners\nREC 0,0 → 150,100\n\n// CIRCLE\nC centre → radius   C 3-point',
        note: 'Polyline = one connected object. Lines = separate objects. Pick the one that matches the feature.',
      },
      {
        title: 'Modify Commands — Trim, Extend, Offset, Fillet',
        text: 'Design is 20% drawing and 80% modifying. TRIM cuts lines at a cutting edge; EXTEND lengthens a line to an edge. OFFSET creates a parallel copy at a distance — walls, outlines, spacing. FILLET rounds a corner (radius 0 makes a sharp clean join); CHAMFER cuts a corner at an angle.\n\nMIRROR reflects geometry across a line (symmetric parts), ARRAY repeats it — rectangular, polar or path (bolt circles, grilles). MOVE, COPY, ROTATE and SCALE complete the everyday set.\n\nWorkflow: draw the rough skeleton, then trim/extend/fillet it into the exact shape. Fast, editable, and how real drawings are built.',
        code: '// The everyday set\nTRIM   — cut at a cutting edge\nEXTEND — lengthen to an edge\nOFFSET — parallel copy at a distance\nFILLET — round a corner (R=0 joins clean)\nMIRROR — reflect across a line\nARRAY  — repeat in a grid, ring or along a path',
        note: 'Draw rough, then trim, extend, offset and fillet into precision. Modify commands do the real work.',
      },
      {
        title: 'Copy, Move, Rotate & Array',
        text: 'COPY duplicates an object to a new location; MOVE relocates it. Both take a base point and a displacement — pick the base point at an object snap so the result lands exactly.\n\nROTATE spins around a base point with an angle (or with a reference angle so it aligns to something). ARRAY repeats objects: rectangular arrays (rows and columns), polar arrays (around a centre), and path arrays (along a curve).\n\nBase points matter: select them at a snap, never free. These commands plus their "Multiple" options are what turn one detailed part into a whole drawing of identical parts.',
        code: '// COPY / MOVE\nCOPY   → select → base point → displacement\nMOVE   → select → base point → displacement\n\n// ROTATE\nROTATE → base point → angle (or Reference)\n\n// ARRAY\nARRAYRECT — rows & columns\nARRAYPOLAR — around a centre\nARRAYPATH  — along a curve',
        note: 'Base points must snap. Rotate by reference to align; array for the repeating parts.',
      },
      {
        title: 'Drawing Workflow — From Skeleton to Detail',
        text: 'Real drafting is iterative: start with a light construction skeleton (centre lines, overall outlines), then build detail on top of it, then clean up.\n\nConstruction lines (or thin centre lines on their own layer) define the geometry that everything snaps to. Build from big to small: overall shape first, features next, small details last.\n\nUse OFFSET for walls and spacing, TRIM to cut intersections, and FILLET for clean corners. The rhythm — sketch skeleton, add detail, trim the fat — is the same for a bracket, a plan or a section.',
        code: '// Build order\n1. Skeleton: centre lines + overall outline\n2. Big features: main shapes, offset to size\n3. Details: holes, fillets, chamfers\n4. Clean: trim, extend, fillet joins\n\n// Layers for the skeleton\n0         — geometry\nCentre    — dashed centre lines\nConstruction — temporary guides (deleted later)',
        note: 'Skeleton first, detail on top, trim the fat. Build big to small and everything snaps to structure.',
      },
    ],
    quizzes: [
      { text: 'The difference between LINE and POLYLINE is…', options: ['polyline is one connected object', 'polyline is always curved', 'line is always closed', 'there is none'], correctAnswer: 'polyline is one connected object' },
      { text: 'TRIM is used to…', options: ['cut lines at a cutting edge', 'extend lines', 'copy objects', 'round corners'], correctAnswer: 'cut lines at a cutting edge' },
      { text: 'OFFSET creates…', options: ['a parallel copy at a distance', 'a mirror', 'a rotation', 'a copy of the layer'], correctAnswer: 'a parallel copy at a distance' },
      { text: 'A polar array repeats objects…', options: ['around a centre point', 'in rows and columns', 'along a path', 'randomly'], correctAnswer: 'around a centre point' },
    ],
  },

  // ── W3 · Layers & Properties ─────────────────────────────────────────────
  {
    week: 3,
    title: 'Layers & Properties',
    description: 'Organizing the drawing with layers, controlling object properties, and annotating cleanly.',
    topics: [
      {
        title: 'Layers — The Organizer of Every Drawing',
        text: 'A layer is a named transparency with its own colour, line type and line weight. Everything you draw belongs to a layer, and layers are how a drawing stays legible.\n\nStandard discipline: geometry on 0 or a geometry layer, centre lines on a dashed centre layer, dimensions on a dimension layer, text on a text layer, hatching on its own, outlines on a thick layer. Colour is decided by layer, NOT per object — so you can re-theme the whole drawing by editing layers.\n\nThe layer control (ribbon or LAYER command) sets current layer, freezes/thaws, locks/unlocks, and toggles visibility. Locked layers are safe from accidental edits; frozen layers speed up the display.',
        code: '// Typical layer set\n0          — default\nObject     — main geometry (black/white)\nCentre     — centre lines (dashed, red)\nHidden     — hidden detail (dashed, blue)\nDim        — dimensions (green)\nText       — annotations\nHatch      — hatching (grey)\nTitleblock — sheet border\n\n// Layer states\nFreeze/thaw — invisible but held\nLock/unlock — visible but uneditable\nOff/on      — hidden from view',
        note: 'Layers carry colour, linetype and weight. Assign by discipline: geometry, centre, dim, text, hatch.',
      },
      {
        title: 'Object Properties & Selection',
        text: 'Every object carries properties: layer, colour, line type, line weight, geometry. Select an object and the Properties palette shows them; change layer or colour there and it updates.\n\nSelection tips: click to select one; window selection (left to right) catches objects fully inside; crossing selection (right to left) catches anything touched. Hold Shift to remove from the selection set.\n\nThe golden rule: let properties follow the layer. Assign colour and linetype BYLAYER, and only override when a specific object genuinely needs it. Keep "the object is what layer says" — it makes drawings predictable.',
        code: '// Selection\nLeft-to-right  — objects FULLY inside\nRight-to-left  — objects TOUCHED (crossing)\n\n// Properties palette\nSelect → Properties (Ctrl+1)\nLayer · Colour · Linetype · Lineweight\n\n// Best practice\nProperties = BYLAYER   (follow the layer)\nOverride only for a real need',
        note: 'BYLAYER keeps drawings sane: an object inherits colour, linetype and weight from its layer.',
      },
      {
        title: 'Text & Styles — Clean Annotation',
        text: 'Annotations need consistent text styles. A TEXT STYLE defines the font, height and width factor; you apply styles, not fonts, so the whole drawing updates when you change a style.\n\nSingle-line text (TEXT/DTEXT) for short labels; multiline text (MTEXT) for paragraphs and notes. MTEXT supports formatting within one object.\n\nSet text height to the plotted size: a drawing plotted at 1:1 needs text sized to the real-world reading distance. Text should sit on its layer, never overlap geometry, and follow a consistent style for titles, notes and labels.',
        code: '// Text commands\nTEXT / DTEXT — single-line labels\nMTEXT       — paragraphs, formatted\nSTYLE       — manage text styles\n\n// A text style holds\nFont · Height · Width factor\n\n// Heights in real units\nSheet plotted at 1:1 → height = reading size\nScale drawing 1:2 → height = 2 × reading size',
        note: 'Styles, not fonts. Text belongs on its layer, never overlapping geometry, sized for the plot scale.',
      },
      {
        title: 'Hatching & Fills',
        text: 'Hatching fills an area with a pattern — it communicates material (steel, brick, section) and cut areas. The HATCH command picks a pattern, a scale and the boundary region.\n\nPick the region: select an internal point and AutoCAD finds the closed boundary; or select the boundary objects directly. Adjust the pattern scale to match the drawing size — too dense or too sparse is a classic error.\n\nUse dedicated hatch layers and standards: section lines at 45°, different materials different patterns. Hatch should not cross text — by default it respects gaps and islands, and you can place text on top with a background mask.',
        code: '// HATCH\nHATCH → pick pattern → pick internal point → scale\n\n// Common patterns\nANSI31   — general purpose section (45° lines)\nANSI32   — steel\nAR-B816  — brick\nSOLID    — filled areas\n\n// Boundaries\nPick internal point → AutoCAD finds the closed region',
        note: 'Hatch carries material meaning. Pattern, scale and boundary must all be deliberate.',
      },
    ],
    quizzes: [
      { text: 'Layers are used to…', options: ['organize geometry by function', 'save files', 'zoom faster', 'make colours'], correctAnswer: 'organize geometry by function' },
      { text: 'The recommended colour setting for objects is…', options: ['BYLAYER', 'RED always', 'per object', 'random'], correctAnswer: 'BYLAYER' },
      { text: 'A locked layer…', options: ['is visible but uneditable', 'is hidden', 'is deleted', 'is frozen'], correctAnswer: 'is visible but uneditable' },
      { text: 'MTEXT is for…', options: ['paragraphs and notes', 'single short labels', 'dimensions', 'layers'], correctAnswer: 'paragraphs and notes' },
    ],
  },

  // ── W4 · Dimensions, Blocks & Templates ──────────────────────────────────
  {
    week: 4,
    title: 'Dimensions, Blocks & Templates',
    description: 'Measuring drawings the professional way, reusing parts with blocks, and standardizing with templates.',
    topics: [
      {
        title: 'Dimensioning — The Language of Measure',
        text: 'Dimensions turn a picture into a specification. Linear, aligned, angular, radius, diameter, and ordinate — each fits a situation. A dimension style (DIMSTYLE) packages the arrows, text height, precision and extension lines.\n\nDimension the functional sizes: what the part must fit and meet. Avoid redundant dimensions and overlapping text — dimension to clear, uncrowded locations. Extend beyond the object, break where they cross.\n\nEvery dimension must be readable at plot scale and belong to the dimension layer. The rule that separates pros: dimension once, correctly, to what matters.',
        code: '// Dimension types\nDIMLINEAR   — horizontal/vertical length\nDIMALIGNED  — length along an angle\nDIMRADIUS   — radius\nDIMDIAMETER — diameter\nDIMANGULAR  — angle\n\n// A dimension style sets\nArrows · Text height · Precision · Extension lines\n\n// Practice\nDimension the functional sizes only',
        note: 'Dimension what matters, exactly once, on the dim layer. Style = consistency.',
      },
      {
        title: 'Blocks — Reusable Parts',
        text: 'A block is a named collection of objects saved as one unit: a bolt, a symbol, a titleblock. Insert it anywhere and any number of times; edit the definition once and every instance updates. \n\nCreate blocks with BLOCK (define and keep), WBLOCK (write to a file to share), and insert with INSERT. Set a logical base point — usually a snap point that aligns when inserted.\n\nBlocks are the professional\'s answer to repetition: one source of truth for every reused part. They also shrink files (one definition, many references) and keep drawings consistent.',
        code: '// Block workflow\nBLOCK   → select geometry → name → base point\nINSERT  → place a block instance\nBEDIT   → edit the definition (all instances update)\nWBLOCK  → save a block as a .dwg file to share\n\n// Base point tip\nPick it at a snap (centre, end of a pin)',
        note: 'One block definition, many instances. Edit once, everything updates.',
      },
      {
        title: 'Templates — Standardize Your Start',
        text: 'A template (.dwt) is a pre-configured starting file: layers, text styles, dimension styles, titleblock, page setup and drafting settings — saved and reused for every new drawing.\n\nSet up your template once: the layer set, the standard styles, the ISO or ANSI settings your workplace uses, and a titleblock with placeholders for title, date, scale and revision.\n\nNew → Template → start drawing. Every drawing you make inherits the standards without re-creating them — consistency across a team, and no rework.',
        code: '// Template contents (.dwt)\nLayers + styles + titleblock\nDrafting settings (snaps, grid, units)\nSheet layouts + page setup\n\n// Start a job\nNEW → pick your template → draw\n\n// Why\nConsistency · Speed · Team standards',
        note: 'The template is your standard. Layers, styles, titleblock and page setup, all pre-loaded.',
      },
      {
        title: 'Reference, Scale & Annotation Practice',
        text: 'Reference work keeps drawings accurate and current. XREF attaches an external drawing you can see but not edit — the classic use is a base plan that others update, or a site plan that changes.\n\nScaling is discipline: the MODEL space holds the real-size geometry (draw 1 unit = 1 real unit). Layouts/paper space hold the sheet at plot scale with a viewport onto the model. Annotative objects scale themselves across viewports.\n\nAnnotation practice: text and dims readable at plotted size, leaders to notes, consistent styles. A drawing that is clean to read is clean to build.',
        code: '// XREF\nXREF → attach → see, not edit\n\n// Model vs layout\nMODEL: full-size geometry\nLAYOUT: sheet + viewport at plot scale\n\n// Annotative\nAnnotative text/dims auto-scale per viewport',
        note: 'Model = real size. Layout = the sheet. XREF for shared bases. Annotative for self-scaling labels.',
      },
    ],
    quizzes: [
      { text: 'The dimension for a hole is…', options: ['diameter or radius', 'angular', 'ordinate', 'linear only'], correctAnswer: 'diameter or radius' },
      { text: 'A block is…', options: ['a named reusable group of objects', 'a layer', 'a dimension', 'a template'], correctAnswer: 'a named reusable group of objects' },
      { text: 'Editing a block definition…', options: ['updates every instance', 'only affects the edited one', 'creates a new block', 'does nothing'], correctAnswer: 'updates every instance' },
      { text: 'A template (.dwt)…', options: ['pre-loads layers, styles and titleblock', 'is a drawing to copy', 'is a block library', 'is a plot style'], correctAnswer: 'pre-loads layers, styles and titleblock' },
    ],
  },

  // ── W5 · Plotting & the Project ──────────────────────────────────────────
  {
    week: 5,
    title: 'Plotting & the Project',
    description: 'Printing scaled drawings, running a complete drawing project, and the job-ready path.',
    topics: [
      {
        title: 'Layouts, Viewports & Plotting to Scale',
        text: 'A layout is the sheet: paper size, titleblock, and viewports that look onto the model at a scale. Create a viewport (MVIEW), set its scale, lock it, and the drawing is sheet-ready.\n\nPlot (PLOT) with a plot style that maps colours to line weights — the classic set maps black geometry to thin, outlines to medium, and titleblock lines to heavy. Choose the paper size and orientation to match the layout.\n\nThe scale test: a dimension height that reads 2.5 mm on paper means the plot is correct. Verify before trusting the sheet.',
        code: '// Layout workflow\nLayout tab → paper size → titleblock\nMVIEW → draw a viewport → set scale\nMSPACE → pan the view → lock viewport\nPLOT → paper size → plot style → preview → print\n\n// Plot styles (.ctb)\nColour → line weight mapping\nBlack · thin geometry · medium outlines · heavy borders',
        note: 'Viewport scale + locked view + plot style = a correct sheet. Verify with the text-size test.',
      },
      {
        title: 'The Project — A Mechanical Bracket Drawing',
        text: 'The capstone: a complete bracket drawing. Sheet: an A4/A3 layout with a titleblock. Model: the bracket at 1:1 with the given dims, plus the views — front, side and section.\n\nSteps: build the skeleton with centre lines, draw the outline, add the hole pattern (polar array), fillet the corners, dimension everything functionally, add the section hatch, and place the sheet in layout with a locked viewport.\n\nChecklist before plotting: layer discipline, no duplicate dims, no overlapping text, correct hatch, titleblock filled in. This one drawing exercises every command you learned.',
        code: '// Bracket project steps\n1. Titleblock layout\n2. Centre lines + outline\n3. Hole pattern (polar array)\n4. Fillets + chamfers\n5. Front view + side view + section\n6. Dimensions (functional)\n7. Section hatching\n8. Layout + viewport + plot\n\n// Self-check\nClean layers ✓  No duplicate dims ✓  Titleblock filled ✓',
        note: 'One drawing, every skill. Skeleton → detail → section → sheet. Check before you plot.',
      },
      {
        title: 'Drawing Standards & Team Work',
        text: 'Professional drafting follows standards: the ISO or ANSI conventions for line weights, dimension placement, symbols and sheet layouts. A drawing is a contract — it must mean the same thing to everyone who reads it.\n\nStandards in practice: standard layer names and colours, standard text styles, standard dimension styles, standard titleblock. Consistent files (one drawing, one plan) and clear file naming with revision control.\n\nWork in a team means drawings are handed off, reviewed and revised. The revision block records who changed what and when. Clean standards are what make that possible.',
        code: '// What standards cover\nLine weights · Dimension rules · Symbols\nSheet layouts · Layer names · Titleblock\n\n// Your personal standard\nOne template · named layers · consistent styles\n\n// Revision block\nRev · date · change · by',
        note: 'A drawing is a contract. Standards keep the contract readable by everyone.',
      },
      {
        title: 'The AutoCAD Career Path',
        text: 'This course covered: interface and precision, drawing and modifying, layers and properties, dimensioning, blocks and templates, and plotting to scale. You can now produce a complete, plotted 2D drawing to industry conventions.\n\nNatural next steps: 3D modeling (AutoCAD 3D, or parametric tools like Fusion and SolidWorks — see our 3D CAD course), architectural drafting (floor plans, elevations, sections), civil drafting (land plans), and specialisation via the AutoCAD certifications.\n\nThe portable skill is precision thinking: exact coordinates, clear layers, readable dimensions. Whatever software you touch next, that habit carries you.',
        code: '// What you can now do\n✓ Precise 2D geometry\n✓ Layered, standard drawings\n✓ Clean dimensioning\n✓ Blocks and templates\n✓ Scaled plotted sheets\n\n// The map forward\nAutoCAD 2D → 3D CAD → Fusion/SolidWorks → specialised draft',
        note: 'Precision thinking is the real skill. Next: 3D parametric modeling or drafting specialisation.',
      },
    ],
    quizzes: [
      { text: 'A viewport is…', options: ['a window onto the model at a set scale', 'a layer', 'a dimension', 'a block'], correctAnswer: 'a window onto the model at a set scale' },
      { text: 'Plot styles map…', options: ['colours to line weights', 'layers to colours', 'blocks to scales', 'nothing'], correctAnswer: 'colours to line weights' },
      { text: 'The bracket project includes…', options: ['views, section, dimensions and a sheet', 'only one line', 'no hatch', 'no titleblock'], correctAnswer: 'views, section, dimensions and a sheet' },
      { text: 'A drawing is best understood as…', options: ['a contract — it means the same to everyone', 'a sketch', 'a photo', 'a file name'], correctAnswer: 'a contract — it means the same to everyone' },
    ],
  },
];
