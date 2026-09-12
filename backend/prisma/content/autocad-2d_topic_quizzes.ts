/**
 * AutoCAD 2D — Technical Drafting — per-topic quizzes.
 * Keyed by the EXACT topic titles in autocad-2d.ts (topic-lock flow).
 * 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in autocad-2d.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'The AutoCAD Interface & Workspaces': [
    { text: 'The place where AutoCAD prompts and you type is…', options: ['the command line', 'the ribbon', 'the status bar', 'the layout'], correctAnswer: 'the command line' },
    { text: 'The professional\'s way to run commands is…', options: ['typing them', 'clicking icons only', 'never running them', 'the menu bar'], correctAnswer: 'typing them' },
    { text: 'F8 toggles…', options: ['ortho (90° angles)', 'grid', 'snap', 'osnap'], correctAnswer: 'ortho (90° angles)' },
    { text: 'The workspace for 2D work is…', options: ['Drafting & Annotation', '3D Basics', '3D Modeling', 'Sheet Set'], correctAnswer: 'Drafting & Annotation' },
  ],
  'Navigating the Drawing — Zoom, Pan & Views': [
    { text: 'The mouse wheel does…', options: ['zoom', 'rotate the model', 'copy', 'delete'], correctAnswer: 'zoom' },
    { text: 'Middle-button drag does…', options: ['pan', 'zoom', 'select', 'osnap'], correctAnswer: 'pan' },
    { text: 'Zoom extents is…', options: ['double-click the wheel', 'F7', 'F8', 'Ctrl+Z'], correctAnswer: 'double-click the wheel' },
    { text: 'Named views let you…', options: ['jump back to a saved viewpoint', 'rename layers', 'change colours', 'zoom randomly'], correctAnswer: 'jump back to a saved viewpoint' },
  ],
  'Coordinates — Absolute, Relative & Polar': [
    { text: 'The polar form is…', options: ['@distance<angle', '@X,Y', 'X,Y', '#X<Y'], correctAnswer: '@distance<angle' },
    { text: '@100,50 means…', options: ['100 right and 50 up from the last point', 'from the origin', '100 up and 50 right', 'nothing'], correctAnswer: '100 right and 50 up from the last point' },
    { text: '@100<45 means…', options: ['100 long at 45°', '100 right, 45 up', '45 long at 100°', '100 down'], correctAnswer: '100 long at 45°' },
    { text: 'The rule of precision drawing is…', options: ['type exact values, never eyeball', 'use the mouse freely', 'approximate', 'skip coordinates'], correctAnswer: 'type exact values, never eyeball' },
  ],
  'Precision Tools — Snap, Grid & Object Snap': [
    { text: 'OSNAP snaps to…', options: ['exact points on existing objects', 'the grid dots', 'the origin', 'random spots'], correctAnswer: 'exact points on existing objects' },
    { text: 'A useful running osnap set is…', options: ['endpoint, midpoint, centre, intersection', 'grid only', 'nothing', 'all random'], correctAnswer: 'endpoint, midpoint, centre, intersection' },
    { text: 'F3 toggles…', options: ['object snap', 'grid', 'ortho', 'snap'], correctAnswer: 'object snap' },
    { text: 'The #1 professional habit is…', options: ['leaving running osnaps on', 'eyeballing lines', 'no snaps', 'fast clicking'], correctAnswer: 'leaving running osnaps on' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Lines, Polylines & Rectangles': [
    { text: 'A polyline is…', options: ['one connected object', 'several separate lines', 'always closed', 'a text'], correctAnswer: 'one connected object' },
    { text: 'For an outline that is really one feature you use…', options: ['polyline', 'line', 'arc', 'point'], correctAnswer: 'polyline' },
    { text: 'RECTANGLE draws…', options: ['a polyline rectangle from two corners', 'four lines', 'a circle', 'a hatch'], correctAnswer: 'a polyline rectangle from two corners' },
    { text: 'Fewer, meaningful objects are…', options: ['easier to modify later', 'harder to edit', 'always worse', 'impossible'], correctAnswer: 'easier to modify later' },
  ],
  'Modify Commands — Trim, Extend, Offset, Fillet': [
    { text: 'TRIM…', options: ['cuts lines at a cutting edge', 'extends lines', 'copies lines', 'mirrors'], correctAnswer: 'cuts lines at a cutting edge' },
    { text: 'EXTEND…', options: ['lengthens a line to an edge', 'cuts a line', 'rotates', 'offsets'], correctAnswer: 'lengthens a line to an edge' },
    { text: 'OFFSET…', options: ['creates a parallel copy at a distance', 'mirrors geometry', 'fills a corner', 'deletes'], correctAnswer: 'creates a parallel copy at a distance' },
    { text: 'FILLET with radius 0…', options: ['makes a clean sharp join', 'fails', 'rounds at default', 'deletes the corner'], correctAnswer: 'makes a clean sharp join' },
  ],
  'Copy, Move, Rotate & Array': [
    { text: 'COPY takes…', options: ['a base point and a displacement', 'nothing', 'a rotation angle', 'a layer'], correctAnswer: 'a base point and a displacement' },
    { text: 'The base point should be…', options: ['at an object snap', 'free anywhere', 'random', 'the origin'], correctAnswer: 'at an object snap' },
    { text: 'A rectangular array repeats…', options: ['in rows and columns', 'around a centre', 'along a path', 'randomly'], correctAnswer: 'in rows and columns' },
    { text: 'ROTATE with a reference angle…', options: ['aligns geometry to something', 'rotates randomly', 'deletes', 'copies'], correctAnswer: 'aligns geometry to something' },
  ],
  'Drawing Workflow — From Skeleton to Detail': [
    { text: 'The workflow starts with…', options: ['a construction skeleton', 'the details', 'the hatch', 'the titleblock'], correctAnswer: 'a construction skeleton' },
    { text: 'Build order is…', options: ['big to small', 'small to big', 'random', 'inside out'], correctAnswer: 'big to small' },
    { text: 'Construction lines are used to…', options: ['define the geometry that everything snaps to', 'hatch areas', 'dimension', 'plot'], correctAnswer: 'define the geometry that everything snaps to' },
    { text: 'The rhythm of drafting is…', options: ['skeleton, add detail, trim the fat', 'one line at a time', 'no plan', 'copy paste'], correctAnswer: 'skeleton, add detail, trim the fat' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Layers — The Organizer of Every Drawing': [
    { text: 'A layer carries…', options: ['colour, linetype and lineweight', 'only a name', 'geometry', 'a price'], correctAnswer: 'colour, linetype and lineweight' },
    { text: 'Centre lines belong on…', options: ['a dashed centre layer', 'the object layer', 'the hatch layer', 'layer 0 only'], correctAnswer: 'a dashed centre layer' },
    { text: 'A frozen layer…', options: ['is hidden but held in the drawing', 'is deleted', 'is locked', 'is unplottable'], correctAnswer: 'is hidden but held in the drawing' },
    { text: 'A locked layer…', options: ['is visible but uneditable', 'is invisible', 'cannot be plotted', 'is empty'], correctAnswer: 'is visible but uneditable' },
  ],
  'Object Properties & Selection': [
    { text: 'Window selection (left-to-right) catches…', options: ['objects fully inside the box', 'anything touched', 'nothing', 'the layers'], correctAnswer: 'objects fully inside the box' },
    { text: 'Crossing selection (right-to-left) catches…', options: ['anything the box touches', 'only full objects', 'only text', 'nothing'], correctAnswer: 'anything the box touches' },
    { text: 'The golden rule is…', options: ['properties = BYLAYER', 'every object its own colour', 'random colours', 'no layers'], correctAnswer: 'properties = BYLAYER' },
    { text: 'To remove from a selection set you hold…', options: ['Shift', 'Ctrl', 'Alt', 'Esc'], correctAnswer: 'Shift' },
  ],
  'Text & Styles — Clean Annotation': [
    { text: 'A text style defines…', options: ['font, height and width factor', 'colour only', 'the layer', 'nothing'], correctAnswer: 'font, height and width factor' },
    { text: 'Applying styles instead of fonts means…', options: ['the whole drawing updates when the style changes', 'slower work', 'no control', 'larger files'], correctAnswer: 'the whole drawing updates when the style changes' },
    { text: 'MTEXT is used for…', options: ['paragraphs and notes', 'single short labels', 'dimensions', 'hatches'], correctAnswer: 'paragraphs and notes' },
    { text: 'Text height is set…', options: ['to the plotted reading size', 'randomly', 'always 2.5', 'to the layer'], correctAnswer: 'to the plotted reading size' },
  ],
  'Hatching & Fills': [
    { text: 'Hatching communicates…', options: ['material and cut areas', 'the scale', 'the block', 'the layer'], correctAnswer: 'material and cut areas' },
    { text: 'To hatch a region you…', options: ['pick an internal point', 'draw a rectangle', 'click every line', 'plot first'], correctAnswer: 'pick an internal point' },
    { text: 'ANSI31 is…', options: ['general-purpose 45° section lines', 'steel', 'brick', 'solid fill'], correctAnswer: 'general-purpose 45° section lines' },
    { text: 'A classic hatch error is…', options: ['wrong pattern scale — too dense or sparse', 'too few layers', 'too many dims', 'no blocks'], correctAnswer: 'wrong pattern scale — too dense or sparse' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Dimensioning — The Language of Measure': [
    { text: 'A hole is dimensioned with…', options: ['diameter or radius', 'angular', 'ordinate', 'aligned only'], correctAnswer: 'diameter or radius' },
    { text: 'A dimension style packages…', options: ['arrows, text height, precision and extension lines', 'the layers', 'the blocks', 'the plot'], correctAnswer: 'arrows, text height, precision and extension lines' },
    { text: 'The professional dimension rule is…', options: ['dimension the functional sizes once', 'dimension everything twice', 'no dimensions', 'text everywhere'], correctAnswer: 'dimension the functional sizes once' },
    { text: 'Dimensions should…', options: ['avoid overlapping text and remain readable', 'cross text freely', 'touch the outline', 'be hidden'], correctAnswer: 'avoid overlapping text and remain readable' },
  ],
  'Blocks — Reusable Parts': [
    { text: 'A block is…', options: ['a named reusable group of objects', 'a layer', 'a dimension', 'a viewport'], correctAnswer: 'a named reusable group of objects' },
    { text: 'Editing a block definition…', options: ['updates every instance', 'only affects one', 'creates a copy', 'does nothing'], correctAnswer: 'updates every instance' },
    { text: 'WBLOCK…', options: ['saves a block as a .dwg file to share', 'deletes a block', 'inserts a block', 'edits a block'], correctAnswer: 'saves a block as a .dwg file to share' },
    { text: 'The block base point should be…', options: ['at a snap point for alignment', 'random', 'the origin', 'anywhere'], correctAnswer: 'at a snap point for alignment' },
  ],
  'Templates — Standardize Your Start': [
    { text: 'A template file extension is…', options: ['.dwt', '.dwg', '.dxf', '.dws'], correctAnswer: '.dwt' },
    { text: 'A template pre-loads…', options: ['layers, styles, titleblock and page setup', 'only colours', 'blocks', 'nothing'], correctAnswer: 'layers, styles, titleblock and page setup' },
    { text: 'The benefit of templates is…', options: ['consistency and no rework', 'faster crashes', 'smaller files', 'no snaps'], correctAnswer: 'consistency and no rework' },
    { text: 'Every drawing should start…', options: ['from your template', 'from scratch', 'from a photo', 'from the last file'], correctAnswer: 'from your template' },
  ],
  'Reference, Scale & Annotation Practice': [
    { text: 'XREF attaches…', options: ['an external drawing you can see but not edit', 'a layer', 'a block', 'a hatch'], correctAnswer: 'an external drawing you can see but not edit' },
    { text: 'Model space holds…', options: ['full-size geometry', 'the sheet', 'the viewport', 'only text'], correctAnswer: 'full-size geometry' },
    { text: 'Layout space holds…', options: ['the sheet with a viewport at plot scale', 'full-size geometry', 'the grid', 'nothing'], correctAnswer: 'the sheet with a viewport at plot scale' },
    { text: 'Annotative objects…', options: ['auto-scale across viewports', 'never scale', 'are locked', 'are blocks'], correctAnswer: 'auto-scale across viewports' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Layouts, Viewports & Plotting to Scale': [
    { text: 'A viewport is…', options: ['a window onto the model at a set scale', 'a titleblock', 'a dimension', 'a plot style'], correctAnswer: 'a window onto the model at a set scale' },
    { text: 'After setting the viewport scale you…', options: ['lock the viewport', 'delete it', 'hatch it', 'rename it'], correctAnswer: 'lock the viewport' },
    { text: 'Plot styles map…', options: ['colours to line weights', 'layers to colours', 'blocks to scales', 'nothing'], correctAnswer: 'colours to line weights' },
    { text: 'The plot scale test is…', options: ['a dimension height that reads correctly on paper', 'the file size', 'the layer count', 'nothing'], correctAnswer: 'a dimension height that reads correctly on paper' },
  ],
  'The Project — A Mechanical Bracket Drawing': [
    { text: 'The project\'s sheet is…', options: ['an A4/A3 layout with a titleblock', 'a random sketch', 'a 3D view', 'a block'], correctAnswer: 'an A4/A3 layout with a titleblock' },
    { text: 'The hole pattern is created with…', options: ['a polar array', 'a rectangle', 'a hatch', 'a text'], correctAnswer: 'a polar array' },
    { text: 'The drawing includes…', options: ['front, side and section views', 'only one view', 'no dimensions', 'no hatch'], correctAnswer: 'front, side and section views' },
    { text: 'Before plotting you check…', options: ['layer discipline and no duplicate dims', 'the file name', 'the grid', 'the colours'], correctAnswer: 'layer discipline and no duplicate dims' },
  ],
  'Drawing Standards & Team Work': [
    { text: 'Standards cover…', options: ['line weights, dimension rules and symbols', 'the price', 'the file size', 'nothing'], correctAnswer: 'line weights, dimension rules and symbols' },
    { text: 'A drawing is best seen as…', options: ['a contract between the drafter and reader', 'a sketch', 'a photo', 'a file'], correctAnswer: 'a contract between the drafter and reader' },
    { text: 'The revision block records…', options: ['who changed what and when', 'the price', 'the scale', 'nothing'], correctAnswer: 'who changed what and when' },
    { text: 'Consistent files and naming support…', options: ['handoffs and review in a team', 'nothing', 'faster typing', 'fewer layers'], correctAnswer: 'handoffs and review in a team' },
  ],
  'The AutoCAD Career Path': [
    { text: 'The course\'s portable skill is…', options: ['precision thinking', 'fast clicking', 'colour choices', 'file naming'], correctAnswer: 'precision thinking' },
    { text: 'The natural next step is…', options: ['3D CAD / parametric modeling', 'stopping', 'only bigger sheets', 'more colours'], correctAnswer: '3D CAD / parametric modeling' },
    { text: 'Architectural drafting means…', options: ['floor plans, elevations and sections', 'only brackets', 'only 3D', 'no plans'], correctAnswer: 'floor plans, elevations and sections' },
    { text: 'The tools for parametric 3D include…', options: ['Fusion and SolidWorks', 'Excel', 'Word', 'Photoshop'], correctAnswer: 'Fusion and SolidWorks' },
  ],
};
