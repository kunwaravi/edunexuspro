/**
 * MS Excel — Data, Formulas & Office Reporting — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in ms-excel_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Spreadsheet Foundations ─────────────────────────────────────────
  {
    week: 1,
    title: 'Spreadsheet Foundations',
    description: 'The grid, navigation, references and formatting that everything else builds on.',
    topics: [
      {
        title: 'The Grid: Cells, Rows, Columns & Sheets',
        text: 'A worksheet is a grid of cells organized in columns (A, B, C…) and rows (1, 2, 3…). A cell\'s address is its column+row — C4 is column C, row 4. A workbook is the file; it can hold many worksheets (tabs at the bottom).\n\nSelect a cell by clicking or typing its address into the Name Box. Select a range with A1:B10 (from A1 to B10) or entire columns/rows by clicking the letter/number.\n\nPractice: click, arrow-key, use Ctrl+Arrow to jump to the edge of data, and Ctrl+Home to return to A1. Rename sheets meaningfully — "Sales", not "Sheet1".',
        note: 'Every cell has one address and every workbook is a stack of worksheets. Naming sheets is the first professional habit.',
      },
      {
        title: 'Entering Data: Text, Numbers & Dates',
        text: 'Type text, numbers or dates into a cell and press Enter (down) or Tab (right). Excel stores data as a type: text (left-aligned), numbers (right-aligned), dates and times.\n\nA number with text characters (like "12 kg") becomes text and cannot be used in math. Format numbers properly with Home → Number: thousands separators, decimals, currency, percent.\n\nDates are numbers under the hood (days since 1900). Enter 01-05-2025 as a date and format it; typing "1.5.2025" as text breaks sorting and math.',
        note: 'Format numbers with the Number group, not by typing commas or % signs. A formatted date sorts correctly; a text date does not.',
      },
      {
        title: 'Editing, Filling & The Fill Handle',
        text: 'Double-click a cell to edit, or select and retype. Ctrl+Z undoes, Ctrl+Y redoes. Drag the fill handle (the small square at a selection\'s bottom-right corner) to copy values down.\n\nThe fill handle is smarter than copy: dragging "Jan" fills Jan–Dec; dragging "1, 2" fills 1, 2, 3, 4…; dragging a formula adjusts its references. Right-drag opens a menu with Fill Series.\n\nCtrl+D fills down from the cell above; Ctrl+E (Flash Fill) recognizes a pattern you start and completes the rest automatically.',
        note: 'Flash Fill (Ctrl+E) is the hidden gem: type the result for one row, hit Ctrl+E, and Excel finishes the column from the pattern.',
      },
      {
        title: 'References: Absolute, Relative & Named Ranges',
        text: 'Formulas use references: A1 is relative (changes when copied), $A$1 is absolute (stays fixed when copied). The $ locks the column and/or row: $A1 locks column, A$1 locks row.\n\nWhen you copy =B1*C1 down, Excel moves the references with the formula — relative by default. To always multiply by the same tax rate cell, lock it: =B1*$E$1.\n\nNamed ranges (select a cell → Name Box → type "TaxRate") make formulas readable: =B1*TaxRate instead of =B1*$E$1. F4 toggles $ on a selected reference in the formula bar.',
        note: 'Rule of thumb: relative references are for the pattern, absolute ($) is for the fixed constants. F4 toggles them while editing.',
      },
    ],
    quizzes: [
      { text: 'Cell C4 is at…', options: ['column 4, row C', 'column C, row 4', 'column 3, row 4', 'column C, row 40'], correctAnswer: 'column C, row 4' },
      { text: 'Typing "12 kg" into a cell stores it as…', options: ['a number', 'text (cannot be used in math)', 'a date', 'an error'], correctAnswer: 'text (cannot be used in math)' },
      { text: 'Dragging the fill handle over "Jan" produces…', options: ['Jan repeated', 'Jan, Feb, Mar…', 'a random month', 'a number'], correctAnswer: 'Jan, Feb, Mar…' },
      { text: '$A$1 in a formula is…', options: ['a relative reference', 'an absolute reference that stays fixed when copied', 'a named range', 'an error'], correctAnswer: 'an absolute reference that stays fixed when copied' },
    ],
  },

  // ── W2 · Formulas & Functions ────────────────────────────────────────────
  {
    week: 2,
    title: 'Formulas & Functions',
    description: 'Writing correct formulas, the essential function families, and logic that makes spreadsheets think.',
    topics: [
      {
        title: 'Formula Fundamentals & Cell Math',
        text: 'Every formula starts with = . =B1+B2 adds, =B1*B2 multiplies, =B1/B2 divides, =B1^2 squares. Order of operations applies: parentheses override. =A1+B1*C1 multiplies first; =(A1+B1)*C1 adds first.\n\nReference cells by clicking them while building a formula — Excel inserts the reference for you and you never mistype an address.\n\nErrors are information: #DIV/0! means dividing by zero, #VALUE! means a type mismatch, #REF! a deleted reference. Read the error before fixing.',
        note: 'Never type the number when the number is in a cell — reference it. Formulas that reference cells survive data changes; typed numbers do not.',
      },
      {
        title: 'The SUM, AVERAGE, COUNT & IF Family',
        text: 'The essential functions: =SUM(A1:A10) adds a range, =AVERAGE(A1:A10) averages, =COUNT(A1:A10) counts numbers, =COUNTA counts non-empty cells, =MAX/MIN find extremes.\n\nSUMIFS/COUNTIFS/AVERAGEIFS add a condition: =SUMIFS(Sales, Region, "North") totals sales only for the North region. AVERAGEIF, SUMIF (single condition) are the simpler forms.\n\n=IF(condition, value_if_true, value_if_false): =IF(D2>=40,"Pass","Fail"). Nest IFs for multiple cases, and combine with AND/OR: =IF(AND(D2>=40, E2>=40),"Both passed","No").',
        note: 'The -IFS family is the workhorse of office reporting: "total sales where region = North AND month = Jan" is one formula.',
      },
      {
        title: 'Text & Date Functions',
        text: 'Text functions clean and combine text: =CONCAT(A1," ",B1) joins, =LEFT/RIGHT/MID extract characters, =TRIM removes extra spaces, =UPPER/LOWER/PROPER fix case, =LEN counts characters, =FIND locates a sub-string.\n\nDate functions: =TODAY() returns the current date, =NOW() date and time, =YEAR/MONTH/DAY extract parts, =DATEDIF(start,end,"d") counts days between dates, =EOMONTH finds month-end.\n\nExcel stores dates as serial numbers, so subtracting two dates gives days. Format the result as a number, not a date.',
        note: 'Most "dirty data" arrives as messy text — TRIM, PROPER, and LEFT/MID are the cleaning kit. Dates: always compute, never retype.',
      },
      {
        title: 'Logical Functions & Error Handling',
        text: 'Logical functions make decisions: =IF(test, yes, no), =AND(a,b) true when both, =OR(a,b) true when either, =NOT flips, =IFERROR(formula, fallback) catches errors and substitutes a message.\n\n=IFERROR(VLOOKUP(...),"Not found") turns an ugly #N/A into a readable message. Nested IFs: =IF(A1>90,"A",IF(A1>75,"B","C")).\n\nFor many conditions, IFS() is cleaner than deep nesting: =IFS(A1>90,"A", A1>75,"B", TRUE,"C"). Keep logic readable — a spreadsheet you cannot read is a spreadsheet nobody trusts.',
        note: 'IFERROR is the safety net for lookup formulas; IFS beats nested IFs once you hit three levels.',
      },
    ],
    quizzes: [
      { text: 'Every Excel formula begins with…', options: ['+', '=', '@', '#'], correctAnswer: '=' },
      { text: '#DIV/0! means…', options: ['the cell is empty', 'a formula divides by zero', 'a name is misspelled', 'the file is corrupt'], correctAnswer: 'a formula divides by zero' },
      { text: '=SUMIFS(Sales, Region, "North") returns…', options: ['all sales', 'only sales where Region is North', 'the average of sales', 'the count of North rows'], correctAnswer: 'only sales where Region is North' },
      { text: '=IFERROR(VLOOKUP(A1,B:C,2,FALSE),"Not found")…', options: ['always returns Not found', 'shows "Not found" instead of an error when the lookup fails', 'deletes the error', 'sorts the lookup'], correctAnswer: 'shows "Not found" instead of an error when the lookup fails' },
    ],
  },

  // ── W3 · Lookups & Data Quality ──────────────────────────────────────────
  {
    week: 3,
    title: 'Lookups & Data Quality',
    description: 'Finding data across tables and keeping data clean and valid.',
    topics: [
      {
        title: 'VLOOKUP & XLOOKUP',
        text: 'VLOOKUP finds a value in the first column of a table and returns a value from the same row in another column: =VLOOKUP(lookup_value, table_array, col_index, FALSE).\n\nThe FALSE (exact match) is almost always what you want. TRUE (approximate) is only for bracketed lookups like tax slabs.\n\nVLOOKUP has limits: the lookup column must be the first column, and it cannot look to the left. XLOOKUP (Excel 365) fixes both: =XLOOKUP(lookup, lookup_array, return_array, "Not found") — no column index, lookups in any direction, native fallback.',
        note: 'Newer Excel? Use XLOOKUP. Older? VLOOKUP with FALSE. The habit that matters: ALWAYS exact match in office data.',
      },
      {
        title: 'INDEX-MATCH — The Flexible Combination',
        text: 'INDEX returns a value at a row/column position: =INDEX(B2:B10, 3) gives the 3rd value in B2:B10. MATCH finds a position: =MATCH("North", A2:A10, 0) returns the row where North sits.\n\nCombined: =INDEX(return_range, MATCH(lookup, lookup_range, 0)) performs a lookup that can go left-to-right OR right-to-left — VLOOKUP\'s weak spot.\n\nThe third argument 0 means exact match. INDEX-MATCH is what to use when VLOOKUP cannot (lookup column not first, or looking left).',
        note: 'Think of MATCH as "find the position" and INDEX as "get the value at a position". Together they are a free-range VLOOKUP.',
      },
      {
        title: 'Data Validation — Stop Bad Input',
        text: 'Data Validation (Data → Data Validation) restricts what can be typed: whole numbers in a range, dates, a length limit, or a dropdown list of allowed values (List → Source: "Pending,Paid,Cancelled").\n\nAdd an input message so users know what to type, and an error alert that stops invalid entries. This is how you keep a shared spreadsheet trustworthy.\n\nDropdowns via validation also drive cleaner filtering and reports — no more "Paid", "payed" and "PAID" as three different values.',
        note: 'Every free-text column with a limited set of valid values deserves a dropdown. Clean data begins at input, not in cleanup.',
      },
      {
        title: 'Cleaning Data: Duplicates, Trim & Text to Columns',
        text: 'Find and remove duplicate rows: Data → Remove Duplicates (choose the columns that define a duplicate). Or highlight them with Conditional Formatting → Highlight Cell Rules → Duplicate Values.\n\nClean messy text: TRIM removes spaces, PROPER/TRIM fix case, Find & Replace fixes recurring typos ("Delhi " vs "delhi").\n\nText to Columns (Data tab) splits one column into several by a delimiter — a column like "Amit,25,Delhi" becomes three proper columns. Power Query (Data → From Table/Range) handles heavy cleaning repeatably.',
        note: 'Check the TRIM trick: a sheet that looks full often has trailing spaces making values un-matchable. Clean first, then lookup.',
      },
    ],
    quizzes: [
      { text: 'In office data, VLOOKUP\'s fourth argument should usually be…', options: ['TRUE (approximate)', 'FALSE (exact match)', 'omitted', 'a column letter'], correctAnswer: 'FALSE (exact match)' },
      { text: 'XLOOKUP differs from VLOOKUP because it…', options: ['only works on numbers', 'can look in any direction and needs no column index', 'is slower', 'cannot return text'], correctAnswer: 'can look in any direction and needs no column index' },
      { text: 'MATCH("North", A2:A10, 0) returns…', options: ['the value North', 'the position where North is found', 'the count of North cells', 'an error'], correctAnswer: 'the position where North is found' },
      { text: 'Data Validation dropdowns help because…', options: ['they look nice', 'they restrict input to valid values, keeping data clean', 'they delete old data', 'they speed up the computer'], correctAnswer: 'they restrict input to valid values, keeping data clean' },
    ],
  },

  // ── W4 · Data Analysis & Visualization ───────────────────────────────────
  {
    week: 4,
    title: 'Data Analysis & Visualization',
    description: 'Turning raw data into answers: sorting, filtering, pivot tables, charts and highlight rules.',
    topics: [
      {
        title: 'Sorting & Filtering Data',
        text: 'Sort rearranges rows: Data → Sort or right-click → Sort. Sort by one column, or add levels (by Region, then by Sales). Never sort a single column — select the whole table so rows stay together.\n\nFilter hides rows that don\'t match: select the header → Data → Filter (or Ctrl+Shift+L). Click the arrow to choose values, or use Text/Number/Date filters (Top 10, Between, Contains).\n\nFilters are non-destructive — clear them and all data returns. Convert your range to an Excel Table (Ctrl+T) to get filter buttons, structured references and automatic formatting for free.',
        note: 'The golden rule of sorting: select the entire data range, not one column. A filtered list is a temporary view, not a deletion.',
      },
      {
        title: 'Pivot Tables — Summarize in Seconds',
        text: 'A pivot table summarizes large data without writing formulas: select your table → Insert → PivotTable → choose New Worksheet.\n\nDrag fields to areas: Rows (categories like Region), Columns (extra dimensions like Quarter), Values (the numbers to total — Sales, with Sum), Filters (a report filter like Year).\n\nRight-click a value → Value Field Settings to switch Sum → Average → Count. Refresh after data changes (right-click → Refresh). Pivot tables answer "sales by region and quarter" in under a minute.',
        note: 'If you answer the same summing question repeatedly, it is a pivot-table job. Learn the four areas: Rows, Columns, Values, Filters.',
      },
      {
        title: 'Charts That Communicate',
        text: 'Select data → Insert → chart. Column/Bar for comparing categories, Line for trends over time, Pie only for parts-of-a-whole (few slices), Scatter for relationships.\n\nCharts need labels: title, axis titles, data labels where useful. Remove clutter — gridlines, legends that duplicate the title, and 3D effects that distort.\n\nA chart made from a pivot table becomes a pivot chart that updates together. Use the Chart Design tab to switch chart type and layout quickly.',
        note: 'Choose the chart by the question: comparing → column/bar, over time → line, composition → pie (sparingly), relationship → scatter.',
      },
      {
        title: 'Conditional Formatting & Data Bars',
        text: 'Conditional Formatting (Home → Conditional Formatting) changes cell appearance based on values: Highlight Cell Rules (greater than, between, duplicates), Top/Bottom Rules, Data Bars (in-cell bars), Color Scales and Icon Sets.\n\nReal use: red for values below target, green above; a Data Bar column that instantly shows the sales ranking; highlight duplicate order IDs.\n\nFormatting follows rules, so it updates as data changes. Clear rules (Manage Rules) when they get stale, and avoid rainbow sheets — one or two rules tell the story.',
        note: 'Conditional formatting is how a 2000-row sheet becomes a 5-second read: colors encode the numbers instead of you eyeballing them.',
      },
    ],
    quizzes: [
      { text: 'The golden rule of sorting is…', options: ['sort only one column', 'select the whole data range so rows stay together', 'sort in reverse always', 'never sort'], correctAnswer: 'select the whole data range so rows stay together' },
      { text: 'In a pivot table, the categories you summarize by go in…', options: ['Values', 'Rows/Columns', 'Filters only', 'nowhere'], correctAnswer: 'Rows/Columns' },
      { text: 'For a trend over time the best chart is…', options: ['a pie chart', 'a line chart', 'a scatter with no order', 'a 3D column'], correctAnswer: 'a line chart' },
      { text: 'Data Bars in conditional formatting…', options: ['draw borders', 'show in-cell bars scaled by value', 'delete low values', 'sort automatically'], correctAnswer: 'show in-cell bars scaled by value' },
    ],
  },

  // ── W5 · Reporting & Professional Output ─────────────────────────────────
  {
    week: 5,
    title: 'Reporting & Professional Output',
    description: 'Printing, dashboards, templates and the shortcuts that make you fast.',
    topics: [
      {
        title: 'Printing & Page Setup Done Right',
        text: 'File → Print previews exactly. Fit wide sheets: Page Layout → Scale to Fit → set width to 1 page (not height). Check Print Area, margins and orientation.\n\nRow and column settings: repeat header rows (Page Layout → Print Titles → Rows to repeat at top), so a long table shows its headers on every printed page.\n\nGridlines don\'t print by default — turn them on in Page Setup → Sheet if you want them. Set Print Area (Page Layout → Print Area) to print only the report range.',
        note: 'A spreadsheet that looks fine on screen can print across five pages. Preview, set width to 1 page, repeat headers — in that order.',
      },
      {
        title: 'Building a Simple Dashboard',
        text: 'A dashboard is one sheet that answers the key questions at a glance: a title, KPI cells (revenue, orders, profit with big-number formatting), one or two charts, and a filter.\n\nUse formulas that reference the data sheet, pivot charts, and Slicers (Insert → Slicer on a pivot table) so anyone can filter without touching the data.\n\nKeep it readable: one consistent font, no more than 5-6 visual elements, and numbers formatted to thousand separators.',
        note: 'A dashboard is a report someone can understand without you. KPI numbers up top, charts below, a slicer to filter.',
      },
      {
        title: 'Templates & Shared Workbooks',
        text: 'Save a well-designed report as a template (.xltx) so every month starts from the same layout: File → Save As → Excel Template.\n\nShared workbooks: store on OneDrive/SharePoint so multiple people edit the same file; Excel shows who is editing. Use Table names and named ranges so references survive as the workbook grows.\n\nProtect important sheets (Review → Protect Sheet) so formulas and headers can\'t be accidentally overwritten while data cells stay editable.',
        note: 'A monthly report you build once and reuse every month is a template. Protect the parts that must not change.',
      },
      {
        title: 'Excel Shortcuts & Fast Habits',
        text: 'Core shortcuts: Ctrl+Shift+L toggles filters, Ctrl+T makes a table, F4 repeats the last action, F2 edits the active cell, Ctrl+Arrow jumps to data edges, Ctrl+Space / Shift+Space select column/row, Alt+= auto-sums.\n\nWorkflow habits: keep data on one sheet and reports on another; store raw data separately from calculated output; never merge cells in data tables (they break filtering); always use tables for growing data.\n\nThe fastest Excel habit of all: before building, sketch the question you must answer — then let the tool do the arithmetic.',
        note: 'F4 (repeat last action) is the efficiency champion, and Ctrl+T is the habit that turns a raw range into a robust table.',
      },
    ],
    quizzes: [
      { text: 'To fit a wide sheet on one page you set…', options: ['Scale to Fit → width to 1 page', 'the font smaller', 'the margins to zero', 'orientation portrait'], correctAnswer: 'Scale to Fit → width to 1 page' },
      { text: 'Print Titles lets you…', options: ['print a title banner', 'repeat header rows on every printed page', 'add a logo', 'number pages'], correctAnswer: 'repeat header rows on every printed page' },
      { text: 'A Slicer attached to a pivot table lets viewers…', options: ['edit the data', 'filter the pivot without touching the data', 'delete sheets', 'print reports'], correctAnswer: 'filter the pivot without touching the data' },
      { text: 'Ctrl+T converts a range into…', options: ['a chart', 'an Excel Table with filters and structure', 'a pivot table', 'a template'], correctAnswer: 'an Excel Table with filters and structure' },
    ],
  },
];
