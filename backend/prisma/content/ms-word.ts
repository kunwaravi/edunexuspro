/**
 * MS Word — Professional Document Creation — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in ms-word_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Getting Started with Word ───────────────────────────────────────
  {
    week: 1,
    title: 'Getting Started with Word',
    description: 'The Word interface, the Ribbon, navigation and views — so every later skill has a solid foundation.',
    topics: [
      {
        title: 'The Word Window & Ribbon',
        text: 'When Word opens you see the Quick Access Toolbar, the Title Bar, and the Ribbon with tabs: Home (most-used formatting), Insert (tables, images, headers), Layout (margins, orientation), References (contents, citations) and Review (spelling, track changes).\n\nThe Ribbon groups related commands into boxes — for example the Font group holds font, size, bold, italic and color. Hover over any command to see its keyboard shortcut and a live tooltip.\n\nCustomize the Quick Access Toolbar with commands you use daily (Save, Print, Undo) so they are always one click away, even above the Ribbon.',
        note: 'Everything in Word is a tab → group → command. If you forget where something lives, press Ctrl+F in the Ribbon\'s search box and type it.',
      },
      {
        title: 'Creating, Saving & File Formats',
        text: 'A new document can start blank or from a template (File → New). Save early and often with Ctrl+S. Word AutoSave (with OneDrive) or AutoRecover protects you if the app crashes.\n\nThe format matters: .docx is the modern Word format, .doc is legacy, .pdf is the locked print-ready format (File → Save As → PDF), and .rtf/.txt are portable plain formats.\n\nName files meaningfully — "Invoice_Feb_Kunal.docx" beats "document1.docx" — and use folders so you can find work later.',
        note: 'PDF is for delivery (never changes layout); .docx is for editing. Send PDFs when someone must not accidentally edit your document.',
      },
      {
        title: 'Navigating a Document',
        text: 'Scroll, but also use the Navigation Pane (View → Show → Navigation Pane). It lists headings, lets you jump between pages and search for any word — the fastest way around a long report.\n\nCtrl+Home jumps to the top, Ctrl+End to the bottom. Ctrl+Arrow moves word by word; Shift+Arrow selects. Select a word by double-clicking it, a paragraph by triple-clicking.\n\nThe Status Bar at the bottom shows page number, word count and proofing status — and toggles which of these appear.',
        note: 'The Navigation Pane plus headings is how you move through a 50-page report like a pro. Type headings with Heading styles and it works automatically.',
      },
      {
        title: 'Views, Zoom & Show/Hide',
        text: 'Print Layout is the default and best for normal work. Read Mode is for reading long documents without editing. Web Layout and Outline views have specific uses. Zoom (Ctrl+/-) changes how big text appears — not the page size.\n\nThe most useful hidden button is Show/Hide ¶ (Ctrl+Shift+8). It reveals paragraph marks, spaces (as dots) and tabs (as arrows). Until you see them you cannot fix broken formatting.\n\nOutlined view collapses the document to its headings — perfect for checking structure before formatting details.',
        note: 'Turn on Show/Hide ¶ whenever formatting misbehaves: invisible marks are almost always the cause.',
      },
    ],
    quizzes: [
      { text: 'The tab that holds the most-used formatting commands is…', options: ['Insert', 'Home', 'Layout', 'Review'], correctAnswer: 'Home' },
      { text: 'Which format should you send when a document must not be edited?', options: ['.docx', '.pdf', '.rtf', '.txt'], correctAnswer: '.pdf' },
      { text: 'What does the Navigation Pane show?', options: ['page thumbnails only', 'headings, pages and search results', 'recent files', 'fonts'], correctAnswer: 'headings, pages and search results' },
      { text: 'Ctrl+Shift+8 (Show/Hide ¶) reveals…', options: ['gridlines', 'paragraph marks, spaces and tabs', 'comments', 'page breaks only'], correctAnswer: 'paragraph marks, spaces and tabs' },
    ],
  },

  // ── W2 · Formatting Fundamentals ──────────────────────────────────────────
  {
    week: 2,
    title: 'Formatting Fundamentals',
    description: 'Character, paragraph and document formatting done properly — with styles doing the heavy lifting.',
    topics: [
      {
        title: 'Character Formatting: Font, Size & Effects',
        text: 'Character formatting applies to individual letters: font, size, bold, italic, underline, color, strikethrough, subscript and superscript. Select first, then apply — formatting never applies to the cursor position by default.\n\nKeep fonts professional and consistent: a serif font (Calibri, Arial, Times New Roman) at 11 or 12 pt is the office default. Use bold for emphasis and italics for titles — do not rely on color alone because color-blind readers and printers ignore it.\n\nThe Format Painter (brush icon, Home tab) copies formatting from one text to another: click the formatted text, click the brush, drag over the target. Double-click the brush to apply repeatedly, press Esc to stop.',
        note: 'Bold and italic are signs, not decorations — use them sparingly or nothing stands out.',
      },
      {
        title: 'Paragraph Formatting: Alignment, Indents & Spacing',
        text: 'Paragraph formatting affects whole blocks. Alignment: Left (default), Center, Right, and Justify (stretched to both edges — formal documents like letters and theses often use it).\n\nIndents push text from the margins: First Line indent starts each paragraph, Hanging indent pushes all lines except the first (used in reference lists). The ruler at the top controls indents and tab stops by dragging.\n\nSpacing: line spacing (1.0, 1.15, 2.0) and space before/after paragraphs. Do not create "space" by pressing Enter twice — use paragraph spacing, or the layout shifts when the font changes.',
        note: 'Justify formal documents, keep left-aligned casual ones. Never use extra Enter presses for vertical spacing.',
      },
      {
        title: 'Styles — Formatting That Stays Consistent',
        text: 'A style is a named bundle of formatting (font, size, color, spacing). Word ships with styles: Title, Heading 1, Heading 2, Normal, Quote. Apply Heading 1 to all main headings and Heading 2 to subheadings.\n\nModify once, applies everywhere: right-click a style → Modify, change it, and every heading using that style updates instantly. No more manually fixing ten headings.\n\nStyles power the Navigation Pane, the automatic Table of Contents and professional document structure — formatting by style is the single biggest professional habit in Word.',
        note: 'Rule: never format a heading by hand (bold + bigger font). Always apply the Heading style — everything else follows.',
      },
      {
        title: 'Bullets, Numbering & Multi-Level Lists',
        text: 'Bullets introduce items; numbered lists show sequence or ranking. Select the lines and click the list button, or start typing "1. " and Word continues automatically.\n\nFor nested structure (1. → a. → i.), use the Increase/Decrease Indent buttons or Tab/Shift+Tab inside the list. Multi-Level Lists tie several levels to Heading styles so headings auto-number.\n\nKeep list levels shallow — two levels is usually enough. Right-click the numbering to restart or continue numbering when a list breaks across sections.',
        note: 'Tab inside a list promotes the item one level down; Shift+Tab brings it back up. That is the whole skill.',
      },
    ],
    quizzes: [
      { text: 'The Format Painter is used to…', options: ['erase formatting', 'copy formatting from one text to another', 'change page color', 'insert a picture'], correctAnswer: 'copy formatting from one text to another' },
      { text: 'Justified text…', options: ['is centered', 'stretches lines to both margins', 'is left-aligned only', 'drops first letters'], correctAnswer: 'stretches lines to both margins' },
      { text: 'A Word style is…', options: ['a theme of colors', 'a named bundle of formatting applied consistently', 'a drawing shape', 'a macro'], correctAnswer: 'a named bundle of formatting applied consistently' },
      { text: 'Modifying a style updates…', options: ['only the selected text', 'every paragraph using that style', 'the whole document to plain text', 'nothing'], correctAnswer: 'every paragraph using that style' },
    ],
  },

  // ── W3 · Tables, Images & Page Layout ────────────────────────────────────
  {
    week: 3,
    title: 'Tables, Images & Page Layout',
    description: 'Content beyond text: tables, graphics, and arranging pages with margins, orientation and headers.',
    topics: [
      {
        title: 'Tables — Structure & Professional Alignment',
        text: 'Tables organize data in rows and columns: Insert → Table. Click inside a table to reveal the Table Design and Layout tabs. Format with a built-in table style, or set your own borders and shading.\n\nProfessional habits: header row bold with shading, thin borders (0.5 pt), numbers right-aligned with consistent decimals, and generous cell padding. Use the Layout tab to merge/split cells, sort rows, and repeat the header row across pages.\n\nConvert text to a table (Insert → Table → Convert Text to Table) when data arrives as tab- or comma-separated text.',
        note: 'A table is not a drawing — if your data is tabular, make a real table so sorting, alignment and printing all behave.',
      },
      {
        title: 'Images, Shapes & Text Wrapping',
        text: 'Insert images (Insert → Pictures), then set Layout Options to control how text flows around them: In Line with Text (image sits in a line), Square (text wraps on both sides), Tight (wraps to shape), Behind/Front of Text (layering).\n\nA professional document almost always uses Square or Tight wrapping, with the image placed at a paragraph and a small margin. Use the cropping tool, and add captions below figures.\n\nShapes and text boxes (Insert → Shapes) are useful for callouts and diagrams. Group multiple shapes so they move as one (select → right-click → Group).',
        note: 'Never leave an image at its raw insertion size. Crop, resize and wrap — an image floating mid-paragraph with broken wrap is a rookie look.',
      },
      {
        title: 'Page Setup: Margins, Orientation & Columns',
        text: 'Layout → Margins controls the white space around text. Standard is 1 inch (2.54 cm); narrow margins fit more but look cramped. Orientation switches Portrait (default) and Landscape (for wide tables and charts).\n\nApply orientation or margins to part of a document using Sections (Layout → Breaks → Next Page). A section break lets one page be landscape while the rest is portrait — the only way to mix orientations.\n\nColumns (Layout → Columns) are for newsletters and brochures. Use section breaks to change column count midway.',
        note: 'Anything that changes the "shape" of a page — margins, orientation, columns — may need a section break to apply to only part of the document.',
      },
      {
        title: 'Headers, Footers & Page Numbers',
        text: 'Headers and footers repeat on every page (Insert → Header/Footer). Page numbers go in the footer, normally centered or at the right. Different First Page makes the title page free of headers.\n\nFor page numbering that starts after the title page, insert a section break after the cover, unlink the footer from the previous section, and restart numbering at 1.\n\nUse fields for dynamic content: the page number IS a field ({PAGE}), and you can insert the file name or date as fields too — they update when the document changes.',
        note: 'Cover page unnumbered + page 1 starting on the first content page is the standard look for reports. That is one section break and two footer settings.',
      },
    ],
    quizzes: [
      { text: 'To have the header row repeat on every page of a table, use…', options: ['Repeat Header Row', 'Merge Cells', 'Split Table', 'AutoFit'], correctAnswer: 'Repeat Header Row' },
      { text: 'Square text wrapping means…', options: ['the image is behind the text', 'text wraps on both sides of the image', 'the image fills the page', 'text is inside the image'], correctAnswer: 'text wraps on both sides of the image' },
      { text: 'To make one page landscape while the rest stay portrait, you need…', options: ['a page break', 'a section break', 'a new document', 'text wrapping'], correctAnswer: 'a section break' },
      { text: 'To start page numbering at 1 after a cover page, you…', options: ['delete the first page', 'insert a section break and restart numbering in the next section', 'change the font', 'use the header only'], correctAnswer: 'insert a section break and restart numbering in the next section' },
    ],
  },

  // ── W4 · Advanced Documents ───────────────────────────────────────────────
  {
    week: 4,
    title: 'Advanced Documents',
    description: 'The professional toolkit: mail merge, collaboration, templates, references and automation.',
    topics: [
      {
        title: 'Mail Merge — One Letter, Many People',
        text: 'Mail merge personalizes one document for many recipients: a letter with each name and address inserted from a data list.\n\nSteps: write the letter leaving blanks for variable parts → Mailings → Select Recipients → Use an Existing List (Excel/CSV) → Insert Merge Field where each name/address goes → Finish & Merge → Edit Individual Documents or Send E-mail Messages.\n\nThe data file needs a header row (Name, Address, City) and one row per recipient. Every merge field in the document must match a header exactly.\n\nPreview Results shows the letter with real data before merging. For envelopes and labels, Word has dedicated merge wizards for the paper format.',
        note: 'Typing 200 identical letters with different names is a mail-merge job, not a typing job. Ten minutes of setup beats an hour of copy-paste.',
      },
      {
        title: 'Track Changes & Comments',
        text: 'Track Changes (Review → Track Changes) records every edit — insertions (underlined color), deletions (strikethrough) and formatting changes — so collaborators can review and accept or reject each one.\n\nWhen editing someone else\'s document, always track. When reviewing, use Accept / Reject (or right-click → Accept All). Comments (Review → New Comment) ask questions without changing text.\n\nCompare Documents merges two versions of the same file and shows what changed between them — essential when someone edited without tracking.',
        note: 'Never forward a document you edited with changes still hiding inside. Use Inspect Document or review the Change list before sending.',
      },
      {
        title: 'Templates & Quick Parts',
        text: 'A template is a reusable document skeleton: letterhead, styles, headers, margins and boilerplate text saved as .dotx (File → Save As → Word Template). New documents built on it inherit the design.\n\nQuick Parts are reusable chunks of content: a signature block, a company address or a standard clause. Select content → Insert → Quick Parts → Save Selection to Quick Part Gallery, then insert it anywhere with one click.\n\nThis is how offices stay consistent — everyone starts from the same template with the same signature.',
        note: 'If you have typed the same block more than twice, it deserves to be a Quick Part. If it is a whole page layout, make a template.',
      },
      {
        title: 'Table of Contents & References',
        text: 'An automatic Table of Contents (References → Table of Contents) collects every Heading 1/2/3 into a clickable, page-numbered index. It updates automatically — right-click → Update Field — so you never hand-type page numbers.\n\nHeadings with styles make this free. Citations (References → Insert Citation) build a bibliography in APA/MLA style. Captions (References → Insert Caption) number figures/tables and feed a List of Figures.\n\nCross-references let you write "see Figure 3" and have the number update if figures are reordered.',
        note: 'A report without a Table of Contents is incomplete. Apply heading styles and it builds itself in one click.',
      },
    ],
    quizzes: [
      { text: 'Mail merge combines a document with…', options: ['a style sheet', 'a data list (recipients)', 'a template', 'a macro'], correctAnswer: 'a data list (recipients)' },
      { text: 'Track Changes is meant for…', options: ['printing faster', 'recording edits so collaborators can review them', 'spell checking', 'changing page size'], correctAnswer: 'recording edits so collaborators can review them' },
      { text: 'A reusable document skeleton saved as .dotx is a…', options: ['macro', 'template', 'style', 'quick part'], correctAnswer: 'template' },
      { text: 'The automatic Table of Contents is built from…', options: ['hand-typed page numbers', 'Heading styles', 'the footer', 'comments'], correctAnswer: 'Heading styles' },
    ],
  },

  // ── W5 · Putting It Together ──────────────────────────────────────────────
  {
    week: 5,
    title: 'Putting It Together',
    description: 'Real deliverables: a formatted report, a resume, printing correctly, and sharing safely.',
    topics: [
      {
        title: 'Project — A Professional Report',
        text: 'Build a 6–8 page report end to end: cover page (no header/number), Table of Contents (automatic), headings with Heading 1/2/3, body paragraphs justified with 1.5 line spacing, tables and figures with captions, and page numbers restarting at 1 on the first content page.\n\nWork in this order: write all content in plain text first, then apply styles, then insert tables/figures, then set up the cover, headers and numbering, then update the Table of Contents.\n\nChecklist before done: Navigation Pane shows every heading, Table of Contents has correct page numbers, one font family throughout, no stray blank pages, PDF export looks identical.',
        note: 'Formatting last is the professional rule. Structure (styles) first, polish (spacing, captions) last.',
      },
      {
        title: 'Project — Resume & Cover Letter',
        text: 'Build a resume in Word: one page, clean margins, your name in a large heading, contact line, then sections — Summary, Experience, Education, Skills — each a Heading or styled label.\n\nUse a one-column or simple two-column table for skills; bullets for achievements with numbers ("increased sales 30%"). Save a copy as PDF for applications — the layout never breaks.\n\nCover letter: one page, your address block, date, recipient, a three-paragraph body (who you are, why this role, what you bring) and a formal closing.',
        note: 'Recruiters scan a resume in seconds. Clear headings, consistent spacing and measurable bullets beat any design flourish.',
      },
      {
        title: 'Printing, PDF & Sharing',
        text: 'File → Print previews exactly what will print. Check: page count, margins, and whether a table splits across pages (keep rows together via row properties).\n\nExport to PDF (File → Save As → PDF) for delivery. In Word the PDF matches the print layout — what you see is what they get. For web delivery, .docx is fine; PDF is safest.\n\nCheck the document for hidden issues before sharing: File → Info → Inspect Document checks for tracked changes, hidden text and personal information.',
        note: 'Always preview before printing and always inspect before sending. Both take seconds and prevent embarrassing delivery mistakes.',
      },
      {
        title: 'Keyboard Shortcuts & Efficiency',
        text: 'Speed up everything: Ctrl+C/X/V copy/cut/paste, Ctrl+B/I/U bold/italic/underline, Ctrl+S save, Ctrl+Z undo, Ctrl+Y redo, Ctrl+F find, Ctrl+G go to, Ctrl+Home/End jump to document start/end.\n\nSelection shortcuts: Ctrl+Shift+Arrow selects word by word, Ctrl+A selects all, F8 (then arrow keys) extends selection in a loop.\n\nWorkflows: Ctrl+Enter inserts a page break; Shift+Enter a soft line break inside a paragraph. Alt+letter navigates Ribbon tabs from the keyboard. AutoCorrect fixes common typos as you type — add your own recurring ones.',
        note: 'The 15 core shortcuts cover 90% of office work. Learn them in pairs (copy/paste, undo/redo) and they become reflexes.',
      },
    ],
    quizzes: [
      { text: 'The correct build order for a report is…', options: ['format first, write later', 'content → styles → tables/figures → cover & numbering → update TOC', 'styles before any content', 'only tables'], correctAnswer: 'content → styles → tables/figures → cover & numbering → update TOC' },
      { text: 'For job applications you should deliver…', options: ['the editable .docx', 'a PDF copy so layout never breaks', 'a printed screenshot', 'a password-protected file always'], correctAnswer: 'a PDF copy so layout never breaks' },
      { text: 'File → Info → Inspect Document checks for…', options: ['grammar only', 'tracked changes, hidden text and personal information', 'file size', 'font licenses'], correctAnswer: 'tracked changes, hidden text and personal information' },
      { text: 'Ctrl+Enter inserts…', options: ['a paragraph', 'a page break', 'a table', 'a comment'], correctAnswer: 'a page break' },
    ],
  },
];
