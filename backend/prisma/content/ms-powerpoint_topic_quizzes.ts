/**
 * MS PowerPoint — per-topic quizzes. Keyed by the EXACT topic titles in
 * ms-powerpoint.ts (topic-lock flow). 4 questions per topic, 4 options,
 * 1 correct. Distinct from the chapter-quiz texts in ms-powerpoint.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'The PowerPoint Interface & First Deck': [
    { text: 'The Slide thumbnail pane shows…', options: ['the Ribbon', 'miniature slides you can select and reorder', 'the fonts', 'the printer queue'], correctAnswer: 'miniature slides you can select and reorder' },
    { text: 'To start the show from the current slide, press…', options: ['F5', 'Shift+F5', 'Ctrl+S', 'Esc'], correctAnswer: 'Shift+F5' },
    { text: 'Ctrl+M adds…', options: ['a new slide', 'a new theme', 'a macro', 'a comment'], correctAnswer: 'a new slide' },
    { text: 'The Status Bar shows…', options: ['slide number of total', 'the file size', 'the theme name', 'the printer'], correctAnswer: 'slide number of total' },
  ],
  'Slides & Layouts — Why Layouts Matter': [
    { text: 'A layout provides…', options: ['animations', 'placeholders with consistent position and styling', 'a theme', 'transitions'], correctAnswer: 'placeholders with consistent position and styling' },
    { text: 'To change a slide\'s layout you use…', options: ['the Layout button', 'the Animations tab', 'File → New', 'the Status Bar'], correctAnswer: 'the Layout button' },
    { text: 'Free-floating text boxes are discouraged because…', options: ['they are slow', 'they break the consistency that layouts provide', 'they can\'t be edited', 'they print badly'], correctAnswer: 'they break the consistency that layouts provide' },
    { text: 'The layout that introduces a chapter is…', options: ['Title and Content', 'Section Header', 'Two Content', 'Comparison'], correctAnswer: 'Section Header' },
  ],
  'Text Basics: Fonts, Bullets & Readability': [
    { text: 'Body text on a slide should be…', options: ['at least 18 pt', '8 pt', 'same as the font size in Word', 'hidden'], correctAnswer: 'at least 18 pt' },
    { text: 'A slide should carry…', options: ['a full paragraph', 'one main idea, six to eight lines max', 'as much text as possible', 'the whole speech'], correctAnswer: 'one main idea, six to eight lines max' },
    { text: 'Underlining on slides is avoided because…', options: ['it reads as a hyperlink', 'it is too big', 'it is a Word feature', 'it cannot be done'], correctAnswer: 'it reads as a hyperlink' },
    { text: 'If the audience reads the slide, they…', options: ['listen harder', 'are not listening to you', 'remember more', 'clap'], correctAnswer: 'are not listening to you' },
  ],
  'Working with a Deck: Select, Move, Duplicate & Reorder': [
    { text: 'To duplicate a slide quickly, press…', options: ['Ctrl+D', 'Ctrl+X', 'F5', 'Alt+F4'], correctAnswer: 'Ctrl+D' },
    { text: 'Slide Sorter view is for…', options: ['editing text', 'seeing and reordering the whole deck', 'animating', 'printing'], correctAnswer: 'seeing and reordering the whole deck' },
    { text: 'To select several slides at once, hold…', options: ['Ctrl while clicking', 'Shift+Alt', 'Esc', 'F1'], correctAnswer: 'Ctrl while clicking' },
    { text: 'Sections are used to…', options: ['group slides into chapters for navigation', 'split text into columns', 'change the theme', 'resize slides'], correctAnswer: 'group slides into chapters for navigation' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Themes, Color & Typography Consistency': [
    { text: 'A theme is…', options: ['a slide layout', 'a complete look: colors, fonts and effects for the deck', 'a transition', 'a chart style'], correctAnswer: 'a complete look: colors, fonts and effects for the deck' },
    { text: 'Changing the theme halfway through a deck is…', options: ['fine', 'a consistency mistake', 'required', 'impossible'], correctAnswer: 'a consistency mistake' },
    { text: 'Variants are…', options: ['color schemes of the same theme', 'different fonts', 'animation styles', 'section names'], correctAnswer: 'color schemes of the same theme' },
    { text: 'A disciplined palette uses…', options: ['ten accent colors', 'two or three colors max', 'every color of the rainbow', 'only black'], correctAnswer: 'two or three colors max' },
  ],
  'SmartArt & Diagrams': [
    { text: 'SmartArt converts bullet lists into…', options: ['animations', 'diagrams: Process, Hierarchy, Cycle and more', 'transitions', 'charts'], correctAnswer: 'diagrams: Process, Hierarchy, Cycle and more' },
    { text: 'The SmartArt type for an organizational chart is…', options: ['Process', 'Hierarchy', 'List', 'Matrix'], correctAnswer: 'Hierarchy' },
    { text: 'You edit SmartArt text…', options: ['in the SmartArt text pane', 'in Word', 'in Excel', 'in the notes'], correctAnswer: 'in the SmartArt text pane' },
    { text: 'Overloading a SmartArt means…', options: ['too many items communicate nothing', 'it is faster', 'it looks professional', 'it is required'], correctAnswer: 'too many items communicate nothing' },
  ],
  'Images, Icons & Visual Impact': [
    { text: 'One strong image per slide…', options: ['is forgettable', 'beats five small clip-art pictures', 'is too much', 'is forbidden'], correctAnswer: 'beats five small clip-art pictures' },
    { text: 'To keep the file small and fast, you should…', options: ['compress pictures', 'delete the deck', 'use only clip-art', 'change the theme'], correctAnswer: 'compress pictures' },
    { text: 'Consistent styling for images means…', options: ['same shape and size, aligned with guides', 'random placement', 'different sizes each slide', 'no images'], correctAnswer: 'same shape and size, aligned with guides' },
    { text: 'Icons (Insert → Icons) are good for…', options: ['simple line icons that add meaning', 'full photographs', 'video', 'music'], correctAnswer: 'simple line icons that add meaning' },
  ],
  'Charts & Tables on Slides': [
    { text: 'A slide chart is edited by…', options: ['editing its data in the mini Excel window', 'typing over it', 'deleting it', 'printing it'], correctAnswer: 'editing its data in the mini Excel window' },
    { text: 'For a trend over time on a slide you use…', options: ['a pie chart', 'a line chart', 'a 3D column', 'a table'], correctAnswer: 'a line chart' },
    { text: 'On a slide, tables should be…', options: ['full spreadsheets', 'small and readable — a few rows max', 'hidden', 'charts'], correctAnswer: 'small and readable — a few rows max' },
    { text: 'The rule for slide charts is…', options: ['show every data point', 'show one clear message', 'paste the whole spreadsheet', 'never use charts'], correctAnswer: 'show one clear message' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Transitions & Timings': [
    { text: 'The best transition practice is…', options: ['a unique effect per slide', 'one subtle effect for the whole deck', 'sound on every slide', 'no timings'], correctAnswer: 'one subtle effect for the whole deck' },
    { text: 'For a live talk, advance slides…', options: ['On Click', 'After fixed time', 'by sound', 'automatically every second'], correctAnswer: 'On Click' },
    { text: 'Sound effects with transitions are…', options: ['professional', 'almost always a mistake', 'required', 'free'], correctAnswer: 'almost always a mistake' },
    { text: 'If the audience notices the transition, then…', options: ['it worked', 'it hurt the talk', 'it is fine', 'it means the deck is complete'], correctAnswer: 'it hurt the talk' },
  ],
  'Animations With Purpose': [
    { text: 'Animations are for…', options: ['decorating every object', 'revealing content in order as you speak', 'distracting', 'filling time'], correctAnswer: 'revealing content in order as you speak' },
    { text: 'The most common useful animation types are…', options: ['Appear, Fade, Wipe', 'Bounce, Spin, Fly', 'Shrink, Grow, Spiral', 'all equally'], correctAnswer: 'Appear, Fade, Wipe' },
    { text: 'The Animation Pane is used to…', options: ['reorder and manage all effects and triggers', 'add transitions', 'change the theme', 'print slides'], correctAnswer: 'reorder and manage all effects and triggers' },
    { text: 'Start: On Click means…', options: ['each item appears when you click', 'everything appears at once', 'nothing appears', 'it plays on loop'], correctAnswer: 'each item appears when you click' },
  ],
  'Speaker Notes & Rehearsal': [
    { text: 'Speaker Notes are…', options: ['visible to the audience', 'your private script in Presenter View', 'printed on every slide', 'deleted at export'], correctAnswer: 'your private script in Presenter View' },
    { text: 'Presenter View shows the presenter…', options: ['only the slide', 'slide, notes, next slide and a timer', 'the audience', 'the internet'], correctAnswer: 'slide, notes, next slide and a timer' },
    { text: 'A typical pace per content slide is…', options: ['1–2 minutes', '10 minutes', '5 seconds', 'an hour'], correctAnswer: '1–2 minutes' },
    { text: 'Presenter Coach gives feedback on…', options: ['font size', 'pace and filler words', 'the theme', 'file size'], correctAnswer: 'pace and filler words' },
  ],
  'Delivering & Exporting: PDF, Video & Broadcast': [
    { text: 'To create a narrated video, use…', options: ['File → Export → Create a Video', 'File → Save As → PDF', 'Slide Show → Hide Slide', 'Design → Variants'], correctAnswer: 'File → Export → Create a Video' },
    { text: 'During the show, pressing B…', options: ['exits the show', 'blanks the screen (focus on you)', 'adds a slide', 'opens the notes'], correctAnswer: 'blanks the screen (focus on you)' },
    { text: 'To draw on slides during the show, press…', options: ['Ctrl+P', 'F5', 'Alt', 'Delete'], correctAnswer: 'Ctrl+P' },
    { text: 'Before sharing, Inspect Presentation…', options: ['removes personal metadata', 'adds animations', 'changes the theme', 'prints the deck'], correctAnswer: 'removes personal metadata' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'The Slide Master — One Change, Everywhere': [
    { text: 'The Slide Master is…', options: ['the first slide', 'the top-level design every layout inherits from', 'a transition', 'a section header'], correctAnswer: 'the top-level design every layout inherits from' },
    { text: 'Putting a logo on the master…', options: ['affects every slide using those layouts', 'only affects the first slide', 'is impossible', 'deletes the logo'], correctAnswer: 'affects every slide using those layouts' },
    { text: 'Each layout inherits from…', options: ['the previous slide', 'the Slide Master', 'the theme only', 'nothing'], correctAnswer: 'the Slide Master' },
    { text: 'The master is best described as…', options: ['the deck\'s single source of truth for design', 'the slide with the most text', 'a printed handout', 'a speaker note'], correctAnswer: 'the deck\'s single source of truth for design' },
  ],
  'Sections & Deck Navigation': [
    { text: 'To add a section, you…', options: ['right-click a slide → Add Section', 'press Ctrl+M', 'insert a picture', 'change the layout'], correctAnswer: 'right-click a slide → Add Section' },
    { text: 'Sections let you…', options: ['move whole blocks of slides at once', 'animate slides', 'change fonts', 'resize the deck'], correctAnswer: 'move whole blocks of slides at once' },
    { text: 'A Section Header layout serves as…', options: ['a chapter divider slide', 'the title slide', 'the last slide', 'a table'], correctAnswer: 'a chapter divider slide' },
    { text: 'A deck over ~15 slides without sections reads as…', options: ['a well-structured story', 'a wall of slides', 'a professional pitch', 'too short'], correctAnswer: 'a wall of slides' },
  ],
  'Design Tips — Avoiding the Common Mistakes': [
    { text: 'The classic text mistake is…', options: ['too much text per slide', 'short headlines', 'one idea per slide', '30 pt fonts'], correctAnswer: 'too much text per slide' },
    { text: 'Whitespace is…', options: ['wasted space', 'what makes important content readable', 'an error', 'forbidden'], correctAnswer: 'what makes important content readable' },
    { text: 'The 10/20/30 rule suggests (as a guide)…', options: ['10 slides, 20 minutes, 30 pt font', '10 minutes, 20 slides, 30 words', '30 slides, 10 minutes', '1 slide, 30 minutes'], correctAnswer: '10 slides, 20 minutes, 30 pt font' },
    { text: 'Before adding anything to a slide, ask…', options: ['does this help the audience remember the one idea?', 'is it colorful?', 'is it animated?', 'does it fill space?'], correctAnswer: 'does this help the audience remember the one idea?' },
  ],
  'Building a Reusable Template': [
    { text: 'A PowerPoint template is saved as…', options: ['.pptx', '.potx', '.pdf', '.mp4'], correctAnswer: '.potx' },
    { text: 'A template stores…', options: ['master, layouts, fonts, colors and logo', 'only the first slide', 'animations only', 'audio'], correctAnswer: 'master, layouts, fonts, colors and logo' },
    { text: 'In a template you should…', options: ['keep placeholders, not hardcoded content', 'hardcode the full presentation', 'remove placeholders', 'add a video'], correctAnswer: 'keep placeholders, not hardcoded content' },
    { text: 'Teams use templates to…', options: ['keep every deck on-brand', 'hide slides', 'make files smaller', 'avoid editing'], correctAnswer: 'keep every deck on-brand' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Project — A Business Pitch Deck': [
    { text: 'A pitch deck section order is…', options: ['Problem, Solution, Market, Traction, Team, Ask', 'Ask first always', 'random', 'Team, Team, Team'], correctAnswer: 'Problem, Solution, Market, Traction, Team, Ask' },
    { text: 'A strong pitch headline states…', options: ['one message, not a product name', 'the slide number', 'the font', 'nothing'], correctAnswer: 'one message, not a product name' },
    { text: 'For market size on a slide you use…', options: ['a simple chart', 'a full spreadsheet', 'a paragraph', 'a sound effect'], correctAnswer: 'a simple chart' },
    { text: 'The pitch ends with…', options: ['a clear Ask slide', 'a blank slide', 'an animation', 'a table of contents'], correctAnswer: 'a clear Ask slide' },
  ],
  'Project — A Training / Teaching Session': [
    { text: 'A training deck\'s agenda appears…', options: ['after the title, before the content', 'at the very end', 'never', 'on the thank-you slide'], correctAnswer: 'after the title, before the content' },
    { text: 'Teaching decks typically include…', options: ['more text than pitches, but still short lines', 'no text at all', 'only animations', 'hidden slides'], correctAnswer: 'more text than pitches, but still short lines' },
    { text: 'Between content blocks, a good training deck has…', options: ['exercises / try-it slides', 'more slides of theory', 'advertisements', 'nothing'], correctAnswer: 'exercises / try-it slides' },
    { text: 'The learner\'s journey a training deck follows is…', options: ['why it matters → how it works → you try it', 'entertainment → fun → jokes', 'theory → theory → theory', 'random'], correctAnswer: 'why it matters → how it works → you try it' },
  ],
  'Reviewing a Deck Like a Critic': [
    { text: 'The outline test means…', options: ['headlines alone must tell the story', 'each slide has a table', 'the deck prints on one page', 'the file is small'], correctAnswer: 'headlines alone must tell the story' },
    { text: 'One of the five classic sins is…', options: ['text walls', 'short lines', 'one image per slide', 'a consistent theme'], correctAnswer: 'text walls' },
    { text: 'The review question for every slide is…', options: ['can I understand this in 5 seconds?', 'is it animated?', 'does it have a chart?', 'is the font Comic Sans?'], correctAnswer: 'can I understand this in 5 seconds?' },
    { text: 'The final check before presenting is…', options: ['run the show once, full-screen, top to bottom', 'count the slides', 'rename the file', 'email it'], correctAnswer: 'run the show once, full-screen, top to bottom' },
  ],
  'From Brief to Delivered — The Full Workflow': [
    { text: 'The professional workflow starts with…', options: ['understanding the brief: audience, goal, time limit', 'opening a blank slide', 'choosing animations', 'printing'], correctAnswer: 'understanding the brief: audience, goal, time limit' },
    { text: 'The outline comes…', options: ['before the visual work — it takes the thinking', 'after every slide is built', 'at the end', 'never'], correctAnswer: 'before the visual work — it takes the thinking' },
    { text: 'The delivery artifacts are…', options: ['.pptx editable, .pdf locked, .mp4 replayable', 'only the .pptx', 'a screenshot', 'a printed handout only'], correctAnswer: '.pptx editable, .pdf locked, .mp4 replayable' },
    { text: 'A delivered presentation is…', options: ['the last step of a repeatable process', 'an act of luck', 'the beginning', 'unrepeatable'], correctAnswer: 'the last step of a repeatable process' },
  ],
};
