/**
 * D1e — Practice-arena questions for the CADD & BIM Foundation course.
 *
 * Category "Design": a learner-reachable practice set for the practice arena
 * (/practice/arena?category=Design). Written to match the actual teaching
 * scope of cadd_civil.ts — AutoCAD drafting, Revit (Architecture + Structural)
 * BIM, 3ds Max visualization and SketchUp massing — and to attribute the
 * software the course teaches (2024 releases, V-Ray 6).
 *
 * Same shape as the seed.ts practice questions:
 *   { category, topic, difficulty, text, options, correctAnswer, explanation }
 *
 * NOTE: strings are double-quoted throughout so apostrophes need no escaping.
 */

export const caddBimPracticeQuestions = [
  {
    category: "Design",
    topic: "AutoCAD Drafting",
    difficulty: "Easy",
    text: "In AutoCAD, what does the OSMODE snap value 167 capture?",
    options: [
      "Endpoint + Midpoint + Center + Intersection + Perpendicular",
      "Nearest + Apparent Intersection + Quadrant",
      "Tangent + Node + Insert + Parallel",
      "Only Endpoint and Midpoint",
    ],
    correctAnswer: "Endpoint + Midpoint + Center + Intersection + Perpendicular",
    explanation:
      "OSMODE stores object snaps as a bitmask: 1 Endpoint, 2 Midpoint, 4 Center, 32 Intersection and 128 Perpendicular sum to 167.",
  },
  {
    category: "Design",
    topic: "AutoCAD Drafting",
    difficulty: "Easy",
    text: "Which AutoCAD object is a single entity whose connected segments can be edited as one piece?",
    options: ["A polyline", "Two separate line segments", "A text entity", "A dimension"],
    correctAnswer: "A polyline",
    explanation:
      "A polyline (PLINE) keeps connected segments as one object, so it is easy to edit, offset and dimension as a whole.",
  },
  {
    category: "Design",
    topic: "AutoCAD Drafting",
    difficulty: "Medium",
    text: "What is the purpose of a paper-space layout viewport in AutoCAD?",
    options: [
      "It scales and presents model-space views on a sheet for plotting",
      "It stores hatches and fills only",
      "It converts a drawing to 3D",
      "It locks all layers against editing",
    ],
    correctAnswer: "It scales and presents model-space views on a sheet for plotting",
    explanation:
      "Layout viewports show scaled views of the model on the sheet so the drawing can be plotted at the intended scale.",
  },
  {
    category: "Design",
    topic: "Revit Architecture",
    difficulty: "Easy",
    text: "What does a Level in Revit define?",
    options: [
      "A horizontal reference plane at a story height",
      "The concrete strength of a floor",
      "The render quality of a view",
      "A wall layer order",
    ],
    correctAnswer: "A horizontal reference plane at a story height",
    explanation:
      "Levels are horizontal datum planes that define story heights and host views such as floor plans and ceilings.",
  },
  {
    category: "Design",
    topic: "Revit Architecture",
    difficulty: "Medium",
    text: "How is a floor plan placed onto a sheet?",
    options: [
      "Drag a view onto the sheet, which creates a viewport",
      "Copy the plan into a drafting view",
      "Export it to DWG first",
      "Rebuild the model inside the sheet",
    ],
    correctAnswer: "Drag a view onto the sheet, which creates a viewport",
    explanation:
      "Placing a view on a sheet creates a viewport — a crop of the live view that prints with the sheet and stays linked to the model.",
  },
  {
    category: "Design",
    topic: "Revit Structure (Rebar)",
    difficulty: "Medium",
    text: "In Revit default metric rebar shape families, which shape is the rectangular stirrup/link?",
    options: ["01", "07", "12", "33"],
    correctAnswer: "07",
    explanation:
      "Revit default metric shape families number a straight bar as 01 and the rectangular stirrup/link as 07 — always confirm the loaded family before quoting a number.",
  },
  {
    category: "Design",
    topic: "Revit Structure (Rebar)",
    difficulty: "Hard",
    text: "What does rebar cover protect the steel from?",
    options: [
      "Corrosion, fire and loss of bond with concrete",
      "Accidental deletion while modelling",
      "Export format errors",
      "Sunlight fading in renders",
    ],
    correctAnswer: "Corrosion, fire and loss of bond with concrete",
    explanation:
      "Cover is the concrete distance from the surface to the outer face of the steel; codes set minimums so the bar stays protected and its bond is preserved.",
  },
  {
    category: "Design",
    topic: "Revit Structure (Rebar)",
    difficulty: "Hard",
    text: "What does a slope arrow on a roof slab define?",
    options: [
      "A slope direction by giving the arrow a head and tail height",
      "The colour of the roofing finish",
      "The rafter spacing in a truss",
      "A drainage pipe route",
    ],
    correctAnswer: "A slope direction by giving the arrow a head and tail height",
    explanation:
      "A slope arrow sets the slope across the slab from its tail height to its head height — useful where a single slope percentage does not apply.",
  },
  {
    category: "Design",
    topic: "3ds Max Visualization",
    difficulty: "Easy",
    text: "What is a common use of a massing model created in 3ds Max?",
    options: [
      "As a design study brought into the architecture/BIM pipeline",
      "As a database import for a server",
      "As a word-processor file",
      "As an invoice template",
    ],
    correctAnswer: "As a design study brought into the architecture/BIM pipeline",
    explanation:
      "Massing studies explore form early in design; the winning mass can be referenced into the architecture model for further development.",
  },
  {
    category: "Design",
    topic: "3ds Max Visualization",
    difficulty: "Medium",
    text: "What is the primary role of V-Ray inside 3ds Max?",
    options: [
      "Photorealistic lighting and rendering",
      "Compiling plugins",
      "Modelling nurbs surfaces",
      "Managing sheet sets",
    ],
    correctAnswer: "Photorealistic lighting and rendering",
    explanation:
      "V-Ray is a render engine that computes global illumination, materials and camera effects to produce photoreal stills and animations.",
  },
  {
    category: "Design",
    topic: "SketchUp",
    difficulty: "Easy",
    text: "What does the Push/Pull tool do in SketchUp?",
    options: [
      "Extrudes a flat face into a 3D volume",
      "Deletes the active layer",
      "Rotates the model to true north",
      "Measures a wall length",
    ],
    correctAnswer: "Extrudes a flat face into a 3D volume",
    explanation:
      "Push/Pull grabs a face and extrudes it perpendicular to the face, turning a rectangle into a box or a profile into a solid.",
  },
  {
    category: "Design",
    topic: "BIM Fundamentals",
    difficulty: "Medium",
    text: "What is the core idea of BIM compared with plain 2D CAD drafting?",
    options: [
      "A single coordinated model carries geometry plus data used across the project",
      "Faster printing of sheets",
      "More colours in the drawing",
      "Storing files in the cloud",
    ],
    correctAnswer: "A single coordinated model carries geometry plus data used across the project",
    explanation:
      "BIM links geometry to data — schedules, quantities, phasing and coordination — so changes propagate through the whole model, not just one drawing.",
  },
  {
    category: "Design",
    topic: "BIM Fundamentals",
    difficulty: "Medium",
    text: "What does an interference/clash check look for in a coordinated model?",
    options: [
      "Elements from different disciplines occupying the same space",
      "Duplicate sheet numbers",
      "Missing font files",
      "Slow rendering times",
    ],
    correctAnswer: "Elements from different disciplines occupying the same space",
    explanation:
      "Coordination checks find clashes such as a pipe crossing a beam; resolving them in the model prevents expensive fixes on site.",
  },
];
