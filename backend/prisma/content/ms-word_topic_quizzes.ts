/**
 * MS Word — per-topic quizzes. Keyed by the EXACT topic titles in ms-word.ts
 * (topic-lock flow). 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in ms-word.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'The Word Window & Ribbon': [
    { text: 'The Ribbon organizes commands into…', options: ['folders', 'tabs → groups → commands', 'a toolbar with icons', 'menus only'], correctAnswer: 'tabs → groups → commands' },
    { text: 'Which Ribbon tab contains Bold, Italic and Font size?', options: ['Insert', 'Home', 'References', 'View'], correctAnswer: 'Home' },
    { text: 'The Quick Access Toolbar is…', options: ['always below the Ribbon', 'a customizable toolbar above the Ribbon', 'only for printing', 'removed in Word 2019'], correctAnswer: 'a customizable toolbar above the Ribbon' },
    { text: 'Hovering over a Ribbon command shows…', options: ['a menu of files', 'a tooltip with its purpose and shortcut', 'a print preview', 'a macro'], correctAnswer: 'a tooltip with its purpose and shortcut' },
  ],
  'Creating, Saving & File Formats': [
    { text: 'AutoRecover in Word protects you by…', options: ['deleting old versions', 'saving recovery copies periodically', 'emailing your file', 'locking the document'], correctAnswer: 'saving recovery copies periodically' },
    { text: 'The modern editable Word format is…', options: ['.doc', '.docx', '.pdf', '.txt'], correctAnswer: '.docx' },
    { text: 'Why send a PDF instead of a .docx?', options: ['PDFs are smaller always', 'a PDF never changes layout on another device', 'PDFs cannot be read', 'Word cannot open PDFs'], correctAnswer: 'a PDF never changes layout on another device' },
    { text: 'A meaningful filename example is…', options: ['document1.docx', 'Invoice_Feb_Kunal.docx', 'new.docx', 'file final 2 NEW.docx'], correctAnswer: 'Invoice_Feb_Kunal.docx' },
  ],
  'Navigating a Document': [
    { text: 'The Navigation Pane is opened from…', options: ['View → Navigation Pane', 'Insert → Navigation', 'File → Open', 'Review → Track Changes'], correctAnswer: 'View → Navigation Pane' },
    { text: 'Double-clicking a word…', options: ['selects the whole document', 'selects just that word', 'deletes the word', 'copies the word'], correctAnswer: 'selects just that word' },
    { text: 'Ctrl+End moves the cursor to…', options: ['the end of the line', 'the end of the document', 'the last page break', 'the header'], correctAnswer: 'the end of the document' },
    { text: 'The Status Bar shows…', options: ['the Ribbon', 'page number, word count and proofing status', 'your email', 'the font list'], correctAnswer: 'page number, word count and proofing status' },
  ],
  'Views, Zoom & Show/Hide': [
    { text: 'The default view for normal editing is…', options: ['Read Mode', 'Print Layout', 'Web Layout', 'Outline'], correctAnswer: 'Print Layout' },
    { text: 'Zoom changes…', options: ['the page size', 'how big text appears on screen', 'the margins', 'the font'], correctAnswer: 'how big text appears on screen' },
    { text: 'Invisible spaces appear in Show/Hide view as…', options: ['arrows', 'dots', 'squares', 'lines'], correctAnswer: 'dots' },
    { text: 'Outline view is useful for…', options: ['checking document structure via headings', 'editing images', 'printing labels', 'mail merge'], correctAnswer: 'checking document structure via headings' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Character Formatting: Font, Size & Effects': [
    { text: 'Formatting always applies…', options: ['to the cursor position by default', 'to selected text first', 'to the whole document', 'to the next page'], correctAnswer: 'to selected text first' },
    { text: 'The typical office body font size is…', options: ['8 pt', '11 or 12 pt', '18 pt', '28 pt'], correctAnswer: '11 or 12 pt' },
    { text: 'Why not rely on color alone for emphasis?', options: ['color is expensive to print', 'color-blind readers and printers ignore it', 'Word forbids colored text', 'it slows Word down'], correctAnswer: 'color-blind readers and printers ignore it' },
    { text: 'To apply one format to many different spots you…', options: ['click Format Painter twice to lock it, then Esc to stop', 'redo each by hand', 'use the mouse only', 'restart Word'], correctAnswer: 'click Format Painter twice to lock it, then Esc to stop' },
  ],
  'Paragraph Formatting: Alignment, Indents & Spacing': [
    { text: 'Which alignment stretches lines to both margins?', options: ['Left', 'Justify', 'Center', 'Right'], correctAnswer: 'Justify' },
    { text: 'A hanging indent pushes…', options: ['the first line in', 'all lines except the first in', 'the whole paragraph out', 'the margins in'], correctAnswer: 'all lines except the first in' },
    { text: 'Vertical space between paragraphs should be created with…', options: ['two Enter presses', 'paragraph spacing (space before/after)', 'empty lines of spaces', 'page breaks'], correctAnswer: 'paragraph spacing (space before/after)' },
    { text: 'Hanging indents are typical in…', options: ['reference lists', 'cover pages', 'headers', 'comments'], correctAnswer: 'reference lists' },
  ],
  'Styles — Formatting That Stays Consistent': [
    { text: 'A style is best described as…', options: ['a color scheme', 'a named bundle of formatting reused consistently', 'a drawing', 'a bookmark'], correctAnswer: 'a named bundle of formatting reused consistently' },
    { text: 'Modifying a style updates…', options: ['only the selected paragraph', 'all text using that style', 'the whole theme', 'nothing after applying'], correctAnswer: 'all text using that style' },
    { text: 'The heading styles power…', options: ['mail merge', 'the Navigation Pane and automatic Table of Contents', 'print colors', 'word count'], correctAnswer: 'the Navigation Pane and automatic Table of Contents' },
    { text: 'The professional rule for headings is…', options: ['format by hand each time', 'apply the Heading style, never hand-format', 'use uppercase only', 'center everything'], correctAnswer: 'apply the Heading style, never hand-format' },
  ],
  'Bullets, Numbering & Multi-Level Lists': [
    { text: 'A numbered list is for…', options: ['unrelated items', 'sequence or ranking', 'images', 'pages'], correctAnswer: 'sequence or ranking' },
    { text: 'To make a sub-item one level deeper in a list, press…', options: ['Ctrl', 'Tab', 'Esc', 'F5'], correctAnswer: 'Tab' },
    { text: 'Multi-Level Lists can tie levels to…', options: ['Heading styles for auto-numbered headings', 'page numbers', 'table borders', 'fonts'], correctAnswer: 'Heading styles for auto-numbered headings' },
    { text: 'A good practice for list depth is…', options: ['as many levels as possible', 'two levels is usually enough', 'never use lists', 'only one list per page'], correctAnswer: 'two levels is usually enough' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Tables — Structure & Professional Alignment': [
    { text: 'The header row of a professional table is typically…', options: ['bold with shading', 'hidden', 'italic only', 'a heading style'], correctAnswer: 'bold with shading' },
    { text: 'Numbers inside a table should be…', options: ['centered', 'right-aligned with consistent decimals', 'left-aligned', 'in words'], correctAnswer: 'right-aligned with consistent decimals' },
    { text: 'To have the header row repeat when a table spans pages…', options: ['copy it manually', 'use Repeat Header Row', 'split the table', 'remove borders'], correctAnswer: 'use Repeat Header Row' },
    { text: 'Tab-separated text becomes a table via…', options: ['Convert Text to Table', 'mail merge', 'the clipboard only', 'footnotes'], correctAnswer: 'Convert Text to Table' },
  ],
  'Images, Shapes & Text Wrapping': [
    { text: 'Square text wrapping means…', options: ['text is hidden', 'text wraps on both sides of the image', 'the image is full width', 'text overlaps the image'], correctAnswer: 'text wraps on both sides of the image' },
    { text: 'The default wrapping that treats an image like a big character is…', options: ['Square', 'In Line with Text', 'Behind Text', 'Tight'], correctAnswer: 'In Line with Text' },
    { text: 'To move several shapes together you…', options: ['group them', 'copy them individually', 'align them manually', 'use a table'], correctAnswer: 'group them' },
    { text: 'A figure caption should normally…', options: ['appear above the figure', 'appear below the figure', 'be omitted', 'be in the header'], correctAnswer: 'appear below the figure' },
  ],
  'Page Setup: Margins, Orientation & Columns': [
    { text: 'The standard office margin is…', options: ['0.25 inch', '1 inch (2.54 cm)', '3 inches', 'depends on font'], correctAnswer: '1 inch (2.54 cm)' },
    { text: 'Landscape orientation suits…', options: ['letters', 'wide tables and charts', 'cover pages', 'legal documents always'], correctAnswer: 'wide tables and charts' },
    { text: 'To mix orientations in one document you must insert…', options: ['a page break', 'a section break', 'a column break', 'a footer'], correctAnswer: 'a section break' },
    { text: 'Newsletter-style side-by-side text uses…', options: ['columns', 'tables', 'text boxes', 'headers'], correctAnswer: 'columns' },
  ],
  'Headers, Footers & Page Numbers': [
    { text: 'Headers and footers…', options: ['appear once per document', 'repeat on every page of a section', 'only appear in print', 'cannot contain text'], correctAnswer: 'repeat on every page of a section' },
    { text: 'The page number inserted in a footer is…', options: ['plain text you update by hand', 'a field that updates automatically', 'a comment', 'an image'], correctAnswer: 'a field that updates automatically' },
    { text: 'Different First Page makes…', options: ['the first page use a different header/footer', 'the first page blank', 'the document start on page 1', 'the cover page print'], correctAnswer: 'the first page use a different header/footer' },
    { text: 'Restarting numbering after a cover requires…', options: ['deleting the cover', 'unlinking the footer in the next section and restarting at 1', 'changing the font', 'adding a header'], correctAnswer: 'unlinking the footer in the next section and restarting at 1' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Mail Merge — One Letter, Many People': [
    { text: 'Mail merge personalizes one document for…', options: ['one recipient', 'many recipients from a data list', 'every printer', 'any email'], correctAnswer: 'many recipients from a data list' },
    { text: 'The recipient data must have…', options: ['a header row and one row per recipient', 'exactly one column', 'pictures', 'a footer'], correctAnswer: 'a header row and one row per recipient' },
    { text: 'Insert Merge Field places…', options: ['a fixed name', 'a placeholder replaced with real data per recipient', 'an image', 'a table'], correctAnswer: 'a placeholder replaced with real data per recipient' },
    { text: 'To see real data before merging you click…', options: ['Preview Results', 'Spelling', 'Save As', 'Track Changes'], correctAnswer: 'Preview Results' },
  ],
  'Track Changes & Comments': [
    { text: 'Insertions in Track Changes appear…', options: ['bold and blue', 'underlined in color', 'grayed out', 'in the header'], correctAnswer: 'underlined in color' },
    { text: 'When editing someone else\'s document, the professional habit is…', options: ['turn Track Changes on', 'edit silently', 'rename the file', 'lock the file'], correctAnswer: 'turn Track Changes on' },
    { text: 'Comments are for…', options: ['changing text', 'asking questions without changing text', 'printing', 'mail merge'], correctAnswer: 'asking questions without changing text' },
    { text: 'Compare Documents is used when…', options: ['you want two files side by side', 'someone edited without tracking and you need the diff', 'you need a new document', 'you want to print'], correctAnswer: 'someone edited without tracking and you need the diff' },
  ],
  'Templates & Quick Parts': [
    { text: 'A Word template is saved with the extension…', options: ['.docx', '.dotx', '.pdf', '.tmp'], correctAnswer: '.dotx' },
    { text: 'Reusable chunks of content like a signature block are called…', options: ['styles', 'Quick Parts', 'macros', 'captions'], correctAnswer: 'Quick Parts' },
    { text: 'Templates keep an office consistent because…', options: ['everyone starts from the same design and boilerplate', 'they prevent editing', 'they are password protected', 'they cannot be changed'], correctAnswer: 'everyone starts from the same design and boilerplate' },
    { text: 'If you type the same block more than twice, you should…', options: ['keep typing it', 'save it as a Quick Part', 'memorize it', 'delete it'], correctAnswer: 'save it as a Quick Part' },
  ],
  'Table of Contents & References': [
    { text: 'The automatic Table of Contents is updated by…', options: ['retyping page numbers', 'right-click → Update Field', 'saving the file', 'changing the theme'], correctAnswer: 'right-click → Update Field' },
    { text: 'References → Insert Citation builds…', options: ['a table of contents', 'a bibliography in a chosen style', 'a header', 'a footer'], correctAnswer: 'a bibliography in a chosen style' },
    { text: 'A cross-reference like "see Figure 3"…', options: ['is static text forever', 'updates its number if figures are reordered', 'needs manual typing', 'only works in PDF'], correctAnswer: 'updates its number if figures are reordered' },
    { text: 'Without Heading styles, the automatic Table of Contents…', options: ['still works', 'has nothing to collect — it needs heading styles', 'uses the footer', 'creates page numbers itself'], correctAnswer: 'has nothing to collect — it needs heading styles' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Project — A Professional Report': [
    { text: 'The correct build order for a report is…', options: ['formatting first', 'content → styles → tables/figures → cover & numbering → update TOC', 'insert images first', 'create the TOC before any content'], correctAnswer: 'content → styles → tables/figures → cover & numbering → update TOC' },
    { text: 'Body text in the report project uses…', options: ['2.0 line spacing centered', 'justified alignment with 1.5 line spacing', 'no spacing', 'random alignment'], correctAnswer: 'justified alignment with 1.5 line spacing' },
    { text: 'The final structure check is that…', options: ['every paragraph is bold', 'the Navigation Pane shows all headings and the TOC is correct', 'the document has no tables', 'page numbers are hidden'], correctAnswer: 'the Navigation Pane shows all headings and the TOC is correct' },
    { text: 'The professional rule emphasized in the project is…', options: ['format first, write later', 'structure (styles) first, polish last', 'no styles at all', 'only manual formatting'], correctAnswer: 'structure (styles) first, polish last' },
  ],
  'Project — Resume & Cover Letter': [
    { text: 'A one-page resume should lead with…', options: ['your photo only', 'name, contact line, then sections like Summary/Experience/Education/Skills', 'a long paragraph of hobbies', 'the company logo'], correctAnswer: 'name, contact line, then sections like Summary/Experience/Education/Skills' },
    { text: 'Achievements in a resume are most effective with…', options: ['no detail', 'numbers ("increased sales 30%")', 'only adjectives', 'vague phrases'], correctAnswer: 'numbers ("increased sales 30%")' },
    { text: 'For applications you send…', options: ['the .docx only', 'a PDF so the layout never breaks', 'a screenshot', 'a password-protected .docx'], correctAnswer: 'a PDF so the layout never breaks' },
    { text: 'A cover letter body is typically…', options: ['ten paragraphs', 'three paragraphs: who you are, why this role, what you bring', 'one sentence', 'a bullet list only'], correctAnswer: 'three paragraphs: who you are, why this role, what you bring' },
  ],
  'Printing, PDF & Sharing': [
    { text: 'To keep a table row from splitting across pages you…', options: ['use the row property "keep rows together"', 'merge all cells', 'delete the table', 'change the font'], correctAnswer: 'use the row property "keep rows together"' },
    { text: 'File → Save As → PDF is for…', options: ['editing later', 'delivering a locked, print-ready copy', 'mail merge', 'templates'], correctAnswer: 'delivering a locked, print-ready copy' },
    { text: 'Inspect Document before sharing checks for…', options: ['typos only', 'tracked changes, hidden text and personal information', 'file size', 'the number of tables'], correctAnswer: 'tracked changes, hidden text and personal information' },
    { text: 'The PDF exported from Word matches…', options: ['the print layout exactly', 'a different layout', 'the mobile view', 'the web layout'], correctAnswer: 'the print layout exactly' },
  ],
  'Keyboard Shortcuts & Efficiency': [
    { text: 'Ctrl+B, Ctrl+I and Ctrl+U apply…', options: ['bold, italic, underline', 'save, print, undo', 'copy, cut, paste', 'find, replace, select'], correctAnswer: 'bold, italic, underline' },
    { text: 'Ctrl+A selects…', options: ['a word', 'the whole document', 'a paragraph', 'a table'], correctAnswer: 'the whole document' },
    { text: 'Shift+Enter inserts…', options: ['a page break', 'a soft line break inside a paragraph', 'a table', 'a comment'], correctAnswer: 'a soft line break inside a paragraph' },
    { text: 'AutoCorrect in Word…', options: ['corrects common typos as you type', 'only checks spelling at the end', 'translates text', 'formats headings'], correctAnswer: 'corrects common typos as you type' },
  ],
};
