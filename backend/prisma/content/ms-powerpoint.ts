/**
 * MS PowerPoint — Impactful Presentations — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in ms-powerpoint_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Presentation Foundations ────────────────────────────────────────
  {
    week: 1,
    title: 'Presentation Foundations',
    description: 'The PowerPoint interface, slides and layouts, and getting text right from the first slide.',
    topics: [
      {
        title: 'The PowerPoint Interface & First Deck',
        text: 'PowerPoint\'s screen: the Slide thumbnail pane on the left, the big Slide area in the center, and the Ribbon of tabs on top — Home (text and editing), Insert (pictures, SmartArt, charts), Design (themes), Transitions, Animations and Slide Show.\n\nStart from File → New. A new presentation has a title slide; press Ctrl+M to add more slides. In Normal view you edit; in Slide Show view (F5) you present full-screen.\n\nThe Status Bar shows slide number of total — your map while building. Save early with Ctrl+S; presentations are also AutoRecovered like Word documents.',
        note: 'F5 starts the show from slide 1; Shift+F5 starts from the current slide. Learn both before your first presentation.',
      },
      {
        title: 'Slides & Layouts — Why Layouts Matter',
        text: 'Every slide uses a layout — the template for its placeholders: Title Slide, Title and Content, Two Content, Section Header, etc. Choose Insert → New Slide and pick a layout, or click the Layout button to change an existing slide\'s layout.\n\nPlaceholders are the text boxes the layout controls. Type in a placeholder and your text gets consistent font, size and position automatically.\n\nRule: fill the layout\'s placeholders, don\'t add free-floating text boxes. Layouts keep a 20-slide deck consistent; free text boxes turn it into a mess.',
        note: 'The instant a deck looks inconsistent, the cause is almost always free text boxes ignoring the layout. Layouts are your consistency guarantee.',
      },
      {
        title: 'Text Basics: Fonts, Bullets & Readability',
        text: 'On-slide text should be short — headlines and key points, not paragraphs. Use the built-in placeholders and keep to two or three bullet levels at most.\n\nReadability rules: body text at least 18 pt, headings 30 pt+. Choose clear fonts (Calibri, Arial) over decorative ones. Limit each slide to one main idea, six to eight lines max.\n\nBullets introduce, numbers sequence, and bold/italic signal emphasis — don\'t underline on slides (reads as a link). Spelling: F7 or the Review tab before you present.',
        note: 'The audience reads your slide, or listens to you — not both. Fewer words per slide means more people listening.',
      },
      {
        title: 'Working with a Deck: Select, Move, Duplicate & Reorder',
        text: 'In the thumbnail pane, click a slide to select it; Ctrl+click selects several. Drag a slide to reorder, or right-click → Move Up/Move Down. Ctrl+D duplicates the selected slide — the fastest way to build similar slides.\n\nWork in Slide Sorter view (View → Slide Sorter) to see the whole deck and drag slides into order like cards.\n\nDelete with Delete key, undo with Ctrl+Z. Sections (right-click → Add Section) group slides — "Intro", "Problem", "Solution", "Pricing" — and each section header keeps the deck navigable.',
        note: 'Ctrl+D (duplicate) plus Ctrl+Z (undo) are the two commands that let you experiment without fear.',
      },
    ],
    quizzes: [
      { text: 'To start the slideshow from the beginning, press…', options: ['Shift+F5', 'F5', 'Ctrl+P', 'Esc'], correctAnswer: 'F5' },
      { text: 'A layout provides…', options: ['colors only', 'placeholders that keep text consistent', 'animations', 'transitions'], correctAnswer: 'placeholders that keep text consistent' },
      { text: 'Body text on a slide should be…', options: ['at least 18 pt', '8 pt', '12 pt always', 'invisible'], correctAnswer: 'at least 18 pt' },
      { text: 'The fastest way to build a similar slide is…', options: ['retype it', 'select it and press Ctrl+D', 'insert a new blank slide', 'copy from another file'], correctAnswer: 'select it and press Ctrl+D' },
    ],
  },

  // ── W2 · Visual Design ───────────────────────────────────────────────────
  {
    week: 2,
    title: 'Visual Design',
    description: 'Themes, diagrams, images and charts — making slides visual instead of text-heavy.',
    topics: [
      {
        title: 'Themes, Color & Typography Consistency',
        text: 'A theme (Design tab) is a complete look: colors, fonts and effects that apply to the whole deck. Pick one theme and stay with it — changing themes halfway is a rookie move.\n\nVariants (next to the themes) are color schemes of the same theme. Use Design → Variants for light/dark or brand colors rather than hand-picking random colors per slide.\n\nWhen you pick a font size or color manually, consider overriding a placeholder style instead — then the entire deck updates in one click (Home → Replace or View → Slide Master for real control).',
        note: 'One theme, one set of fonts, two or three colors max. Visual discipline reads as professionalism in seconds.',
      },
      {
        title: 'SmartArt & Diagrams',
        text: 'SmartArt turns bullet lists into diagrams: Insert → SmartArt → choose a type — Process for steps, Hierarchy for org charts, List for grouped points, Cycle for repeating loops.\n\nType directly into the SmartArt text pane; the diagram updates automatically and stays editable. Convert an existing bullet list: select it → Home → Convert to SmartArt.\n\nKeep SmartArt to one per slide and don\'t overload it — a diagram with six process steps and four nested items communicates nothing.',
        note: 'If your bullet list describes a sequence or structure, it\'s a diagram in disguise. SmartArt is that conversion in one click.',
      },
      {
        title: 'Images, Icons & Visual Impact',
        text: 'Visuals beat text: a relevant image or icon carries more meaning than a sentence. Insert → Pictures (from file or online), and Insert → Icons for simple line icons.\n\nStyle images consistently: the same shape (rounded corners), consistent size, and place them with alignment guides. Use the Picture Format tab to crop and apply borders.\n\nOne strong image per slide beats five small clip-art pictures. Compress images (Picture Format → Compress Pictures) so the file stays small and opens fast.',
        note: 'Stock photo of handshake + huge text is forgettable. A specific, relevant photo with a short headline is memorable.',
      },
      {
        title: 'Charts & Tables on Slides',
        text: 'Insert → Chart embeds an Excel-linked chart. The chart data opens in a mini Excel window — edit there and the slide chart updates. Choose the chart type like Excel: column for comparisons, line for trends, pie for parts (few slices).\n\nTables on slides should be small and readable — no more than a few rows. The Table Design tab offers quick styles with header shading.\n\nRule: charts answer "so what?"; tables show the supporting detail. Don\'t paste a full spreadsheet on a slide — extract the one message.',
        note: 'A slide chart should show one clear message, not every data point. Resize, drop the clutter, add a headline that says the takeaway.',
      },
    ],
    quizzes: [
      { text: 'A theme in PowerPoint…', options: ['affects only one slide', 'is a complete look of colors, fonts and effects for the deck', 'is the slide size', 'is a transition'], correctAnswer: 'is a complete look of colors, fonts and effects for the deck' },
      { text: 'SmartArt is best used to…', options: ['add animations', 'convert bullet structure into diagrams (process, hierarchy, cycle)', 'add music', 'print slides'], correctAnswer: 'convert bullet structure into diagrams (process, hierarchy, cycle)' },
      { text: 'A memorable slide usually has…', options: ['many small clip-art pictures', 'one strong, relevant image', 'no visuals', 'a full spreadsheet'], correctAnswer: 'one strong, relevant image' },
      { text: 'To keep a presentation file small, you should…', options: ['delete all images', 'compress pictures', 'change the theme', 'add more text'], correctAnswer: 'compress pictures' },
    ],
  },

  // ── W3 · Motion & Delivery ───────────────────────────────────────────────
  {
    week: 3,
    title: 'Motion & Delivery',
    description: 'Transitions and animations used with purpose, and delivering with confidence from speaker notes.',
    topics: [
      {
        title: 'Transitions & Timings',
        text: 'Transitions animate the change between slides (Transitions tab). Use one subtle transition for the whole deck — Wipe or Fade — rather than a different effect per slide.\n\nTiming: set a consistent duration (0.5–1 s) and decide whether to advance On Click or After a fixed time. On Click is safest for live talks; After time suits kiosks.\n\nSound effects with transitions are almost always a mistake. If a transition draws attention to itself, it has failed — the audience should notice the content, not the effect.',
        note: 'Transition rule: one type, subtle, consistent. Any transition the audience notices is a transition that hurt the talk.',
      },
      {
        title: 'Animations With Purpose',
        text: 'Animations move text and objects on a single slide (Animations tab). Use them to reveal content in order — a point appearing as you speak it — not for decoration.\n\nKeep to simple Appear/Fade/Wipe effects. Entrance animations (what happens on arrival), Emphasis (pulse), Exit (on departure) — most slides need only Entrance.\n\nThe Animation Pane (Animations → Animation Pane) shows and reorders all effects and their triggers. Use Start: On Click to control each reveal manually.',
        note: 'Animation is a spotlight, not fireworks. Reveal only what you\'re about to say, and the audience reads along with you.',
      },
      {
        title: 'Speaker Notes & Rehearsal',
        text: 'Speaker Notes (bottom of the window) hold your script and cues — visible to you in Presenter View, never to the audience. Type the full talk there, not on the slide.\n\nRehearse with Presenter View (Slide Show → Presenter View): you see the current slide, your notes, the next slide and a timer while the audience sees only the slide.\n\nRehearse Timings records how long you spend per slide — aim for ~1–2 minutes per content slide and adjust. Presenter Coach (Slide Show → Rehearse with Coach) gives feedback on pace and fillers.',
        note: 'Slides are the visual; notes are the script. An audience can tell when you present from the slides instead of from knowledge.',
      },
      {
        title: 'Delivering & Exporting: PDF, Video & Broadcast',
        text: 'Export for different audiences: File → Save As → PDF for a locked copy, MP4 (File → Export → Create a Video) for a narrated video with timings, and PowerPoint Live or Teams/Slideshow for online meetings.\n\nBefore the talk: File → Info → Inspect Presentation to remove personal metadata, and run Slide Show → Rehearse with Coach once.\n\nKeyboard during the show: B/W blanks the screen (audience focus on you), Esc exits, arrow keys navigate. Enter Ctrl+P during the show to draw on slides with a laser/pen.',
        note: 'PDF to share, MP4 to replay, live broadcast to present remotely. B key to blank the screen is the one shortcut every presenter should know.',
      },
    ],
    quizzes: [
      { text: 'The best practice for transitions is…', options: ['a different effect on every slide', 'one subtle transition for the whole deck', 'sounds on every slide', 'no transitions allowed'], correctAnswer: 'one subtle transition for the whole deck' },
      { text: 'Animations should be used to…', options: ['decorate every object', 'reveal content in order as you speak', 'distract the audience', 'slow the talk down'], correctAnswer: 'reveal content in order as you speak' },
      { text: 'Speaker Notes are…', options: ['shown to the audience', 'your private script, visible only in Presenter View', 'printed on slides', 'deleted automatically'], correctAnswer: 'your private script, visible only in Presenter View' },
      { text: 'To share a locked, print-perfect copy you export to…', options: ['.pptx', '.pdf', '.docx', '.jpg'], correctAnswer: '.pdf' },
    ],
  },

  // ── W4 · Advanced Deck Craft ─────────────────────────────────────────────
  {
    week: 4,
    title: 'Advanced Deck Craft',
    description: 'Master slides, sections and templates — the machinery behind professional, reusable decks.',
    topics: [
      {
        title: 'The Slide Master — One Change, Everywhere',
        text: 'The Slide Master (View → Slide Master) is the top-level design for every slide: change the master\'s fonts, colors, logos and background, and the change flows to every layout and every slide using them.\n\nEach layout (Title Slide, Title and Content…) inherits from the master; you can tweak a layout without affecting the others.\n\nThis is the answer to "my logo should be on every slide": put it on the master, once. Same for footer text, page numbers and a consistent background.',
        note: 'Editing a deck slide-by-slide to add a logo is wrong; editing the master once is right. The master is the deck\'s single source of truth.',
      },
      {
        title: 'Sections & Deck Navigation',
        text: 'Sections organize slides into chapters: right-click a slide → Add Section, then name it ("Intro", "Problem", "Solution", "Next Steps"). In the thumbnail pane each section is a collapsible group.\n\nSection benefits: reorder whole blocks at once (drag the section header), see the deck\'s structure at a glance, and jump between sections in Slide Sorter.\n\nA Section Header layout (from the layout gallery) makes a chapter divider slide — the pause that tells the audience "new part".',
        note: 'A deck longer than ~15 slides without sections is a wall of slides. Sections turn it into a readable story.',
      },
      {
        title: 'Design Tips — Avoiding the Common Mistakes',
        text: 'The classic mistakes: too much text per slide, clip-art, mismatched fonts, rainbow colors, and 3D charts that distort data. Fixes: one idea per slide, one image, one theme, maximum two accent colors.\n\nUse the Design Ideas button (Design tab) — it suggests professional layouts for your content. Whitespace is not wasted space; it\'s what makes the important parts readable.\n\nThe 10/20/30 rule (as a guide): ~10 slides, ~20 minutes, ~30 pt minimum font. Not a law, but a good smell test.',
        note: 'Before adding anything to a slide, ask: does this help the audience remember the one idea? If not, it goes.',
      },
      {
        title: 'Building a Reusable Template',
        text: 'Turn your best deck into a template: set up the master, layouts, fonts, colors and a logo, then File → Save As → PowerPoint Template (.potx). New presentations start from your design with the right placeholders.\n\nTeams use templates to keep every deck on-brand — the sales template, the training template, the report template.\n\nTemplate hygiene: keep placeholders (don\'t hardcode content), keep it simple, and update the master whenever the brand changes.',
        note: 'A template is the difference between a company whose decks look the same and one whose decks look like twenty different authors.',
      },
    ],
    quizzes: [
      { text: 'Changes made on the Slide Master…', options: ['affect only the current slide', 'flow to every layout and slide using them', 'delete the deck', 'only affect the last slide'], correctAnswer: 'flow to every layout and slide using them' },
      { text: 'To put a logo on every slide you add it…', options: ['to each slide by hand', 'to the Slide Master once', 'to the first slide only', 'to the footer'], correctAnswer: 'to the Slide Master once' },
      { text: 'Sections are used to…', options: ['split text', 'organize slides into named chapters', 'animate slides', 'resize slides'], correctAnswer: 'organize slides into named chapters' },
      { text: 'A reusable template is saved as…', options: ['.pptx', '.potx', '.pdf', '.mp4'], correctAnswer: '.potx' },
    ],
  },

  // ── W5 · Presentation Project ────────────────────────────────────────────
  {
    week: 5,
    title: 'Presentation Project',
    description: 'Building complete presentations from brief to delivery, and reviewing like a critic.',
    topics: [
      {
        title: 'Project — A Business Pitch Deck',
        text: 'Build a 10–12 slide pitch: Title, Problem, Solution, How it works, Market, Traction, Team, Business model, Competition, Ask.\n\nEach slide carries one message with a headline ("We make onboarding 3× faster" — not "Our product"). Use one image per problem/solution slide, a simple chart for market size, and a table or bullets for the team.\n\nFinish with a clear Ask slide — the one thing you want from the audience — and practice your 5-minute version.',
        note: 'Pitch slides are headlines first. If the audience only reads the headlines, they should still understand the whole story.',
      },
      {
        title: 'Project — A Training / Teaching Session',
        text: 'A training deck teaches, not sells: Title with the topic and level, Agenda (what we will cover), Learning Objectives (what you will be able to do), then content slides in teaching order, exercises between blocks, and a Summary + Thank You.\n\nTeaching decks need more text than pitches but still short lines. Use screenshots for software, SmartArt for processes, and a "Try it" slide to pause and practice.\n\nInclude a Q&A slide and a closing slide with references and next steps.',
        note: 'Training decks follow the learner\'s journey: why it matters → how it works → you try it. Boring is fine; clear is the goal.',
      },
      {
        title: 'Reviewing a Deck Like a Critic',
        text: 'Before you call a deck done, review it as an audience member: does every headline state a message? Is there any slide you can\'t understand in 5 seconds? Any slide with more than ~30 words? Any free text box or mismatched font?\n\nCheck the outline via View → Outline: the headlines alone should tell the story. Check for the five classic sins: text walls, irrelevant images, rainbow colors, clip-art, and animation that distracts.\n\nRun it in Slide Show once, full-screen, top to bottom. The 30 seconds of honesty here saves a painful 30 minutes on stage.',
        note: 'The outline test — headlines alone must tell the story — catches 90% of deck problems in one glance.',
      },
      {
        title: 'From Brief to Delivered — The Full Workflow',
        text: 'The complete professional workflow: (1) Understand the brief — audience, goal, time limit. (2) Outline the story in headlines. (3) Add visuals and charts. (4) Set the master, theme and consistency. (5) Rehearse with notes. (6) Export PDF/Video as needed.\n\nTime management: the outline takes the thinking; the slides take the making. Never start a deck by clicking into a blank slide and typing.\n\nDeliverables: the .pptx (editable), the PDF (locked), the video (replayable), and a backup of the whole folder. A delivered presentation is the last step of a repeatable process, not an act of luck.',
        note: 'Brief → outline → visuals → master → rehearse → export. This is the entire craft; the slides are just its artifact.',
      },
    ],
    quizzes: [
      { text: 'A good pitch slide headline states…', options: ['the slide number', 'one clear message ("We make onboarding 3× faster")', 'the company name only', 'a question'], correctAnswer: 'one clear message ("We make onboarding 3× faster")' },
      { text: 'A training deck\'s agenda slide appears…', options: ['at the very end', 'early, with learning objectives', 'never', 'on the thank-you slide'], correctAnswer: 'early, with learning objectives' },
      { text: 'The outline test means…', options: ['the headlines alone should tell the whole story', 'each slide has an outline box', 'the deck has 20 slides', 'the file is named outline.pptx'], correctAnswer: 'the headlines alone should tell the whole story' },
      { text: 'The professional workflow begins with…', options: ['opening a blank slide and typing', 'understanding the brief: audience, goal, time limit', 'choosing animations', 'exporting a PDF'], correctAnswer: 'understanding the brief: audience, goal, time limit' },
    ],
  },
];
