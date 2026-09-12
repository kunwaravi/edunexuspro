/**
 * MS Excel — per-topic quizzes. Keyed by the EXACT topic titles in ms-excel.ts
 * (topic-lock flow). 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in ms-excel.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'The Grid: Cells, Rows, Columns & Sheets': [
    { text: 'A workbook is…', options: ['a single cell', 'the file, which can contain many worksheets', 'a row of data', 'a chart'], correctAnswer: 'the file, which can contain many worksheets' },
    { text: 'To jump to the edge of the data in a direction you use…', options: ['Ctrl+Arrow', 'Ctrl+Home only', 'PageDown', 'F5 then type'], correctAnswer: 'Ctrl+Arrow' },
    { text: 'The Name Box shows…', options: ['the formula', 'the address of the selected cell', 'the font name', 'the sheet list'], correctAnswer: 'the address of the selected cell' },
    { text: 'Meaningful sheet names help because…', options: ['they are required', 'they make multi-sheet workbooks navigable ("Sales" vs "Sheet1")', 'they speed formulas', 'they print nicer'], correctAnswer: 'they make multi-sheet workbooks navigable ("Sales" vs "Sheet1")' },
  ],
  'Entering Data: Text, Numbers & Dates': [
    { text: 'Numbers in a cell appear…', options: ['left-aligned', 'right-aligned', 'centered', 'randomly'], correctAnswer: 'right-aligned' },
    { text: 'To show currency or thousands separators you…', options: ['type the symbols', 'format with Home → Number', 'use text', 'change the font'], correctAnswer: 'format with Home → Number' },
    { text: 'Excel stores dates internally as…', options: ['text', 'serial numbers (days since a base date)', 'images', 'fractions'], correctAnswer: 'serial numbers (days since a base date)' },
    { text: 'A text date like "1.5.2025" is a problem because…', options: ['it looks ugly', 'it breaks sorting and date math', 'it deletes data', 'it cannot be typed'], correctAnswer: 'it breaks sorting and date math' },
  ],
  'Editing, Filling & The Fill Handle': [
    { text: 'The fill handle is the small square at…', options: ['the top-left of the sheet', 'the bottom-right corner of a selection', 'the formula bar', 'the status bar'], correctAnswer: 'the bottom-right corner of a selection' },
    { text: 'Dragging "1, 2" with the fill handle gives…', options: ['1, 2, 1, 2…', '1, 2, 3, 4…', '2, 4, 6…', 'only 1 and 2'], correctAnswer: '1, 2, 3, 4…' },
    { text: 'Flash Fill (Ctrl+E)…', options: ['copies a formula down', 'recognizes a pattern you start and completes the column', 'deletes duplicates', 'filters the data'], correctAnswer: 'recognizes a pattern you start and completes the column' },
    { text: 'Copying a formula with the fill handle adjusts…', options: ['nothing', 'relative references as it goes down', 'absolute references', 'the font'], correctAnswer: 'relative references as it goes down' },
  ],
  'References: Absolute, Relative & Named Ranges': [
    { text: '$E$1 is…', options: ['relative', 'absolute — locked for copy', 'a named range', 'an error'], correctAnswer: 'absolute — locked for copy' },
    { text: 'To multiply every price by a fixed tax rate in E1 you write…', options: ['=B1*E1', '=B1*$E$1', '=$B$1*E1', '=E1*E1'], correctAnswer: '=B1*$E$1' },
    { text: 'F4 while editing a formula…', options: ['toggles $ on the selected reference', 'opens help', 'saves the file', 'deletes the cell'], correctAnswer: 'toggles $ on the selected reference' },
    { text: 'A named range makes a formula…', options: ['slower', 'readable: =B1*TaxRate instead of =B1*$E$1', 'unreliable', 'a macro'], correctAnswer: 'readable: =B1*TaxRate instead of =B1*$E$1' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Formula Fundamentals & Cell Math': [
    { text: '=A1+B1*C1 evaluates…', options: ['addition first', 'multiplication first (standard order)', 'left to right only', 'randomly'], correctAnswer: 'multiplication first (standard order)' },
    { text: '=B1/B2 with B2 empty gives…', options: ['0', '#DIV/0!', 'B1', 'an empty cell'], correctAnswer: '#DIV/0!' },
    { text: 'The best way to build a formula is…', options: ['type addresses from memory', 'click cells so Excel inserts the references', 'copy from another file', 'type the numbers'], correctAnswer: 'click cells so Excel inserts the references' },
    { text: 'The rule "reference the cell, don\'t type the number" means…', options: ['numbers are forbidden', 'formulas survive when data changes', 'cells must be locked', 'only totals are allowed'], correctAnswer: 'formulas survive when data changes' },
  ],
  'The SUM, AVERAGE, COUNT & IF Family': [
    { text: '=COUNTA(A1:A10) counts…', options: ['only numbers', 'all non-empty cells', 'empty cells', 'unique values'], correctAnswer: 'all non-empty cells' },
    { text: '=SUMIFS(Sales, Region, "North") adds…', options: ['all sales', 'only sales where Region is North', 'the top 10 sales', 'sales over 1000'], correctAnswer: 'only sales where Region is North' },
    { text: '=IF(D2>=40,"Pass","Fail") with D2 = 35 gives…', options: ['Pass', 'Fail', '40', 'an error'], correctAnswer: 'Fail' },
    { text: '=IF(AND(D2>=40,E2>=40),"Both passed","No") requires…', options: ['one condition', 'both conditions true for "Both passed"', 'either condition', 'no conditions'], correctAnswer: 'both conditions true for "Both passed"' },
  ],
  'Text & Date Functions': [
    { text: '=TRIM(A1)…', options: ['removes extra spaces around and between words', 'trims the font', 'deletes the cell', 'changes case'], correctAnswer: 'removes extra spaces around and between words' },
    { text: '=CONCAT(A1," ",B1)…', options: ['adds the numbers', 'joins the text values with a space between', 'counts characters', 'extracts letters'], correctAnswer: 'joins the text values with a space between' },
    { text: 'Subtracting two date cells gives…', options: ['a date', 'the number of days between them', 'text', 'an error'], correctAnswer: 'the number of days between them' },
    { text: '=TODAY() returns…', options: ['the date and time now', 'the current date (updates daily)', 'a fixed date', 'a text string'], correctAnswer: 'the current date (updates daily)' },
  ],
  'Logical Functions & Error Handling': [
    { text: '=IFERROR(VLOOKUP(...), "Not found") displays "Not found" when…', options: ['the lookup succeeds', 'the formula produces an error', 'the sheet is protected', 'the file opens'], correctAnswer: 'the formula produces an error' },
    { text: '=AND(A>90, B>90) is TRUE when…', options: ['either condition is true', 'both conditions are true', 'neither is true', 'A is true only'], correctAnswer: 'both conditions are true' },
    { text: 'For many conditions, the cleaner alternative to deep nested IFs is…', options: ['IFS()', 'OR()', 'LEFT()', 'COUNT()'], correctAnswer: 'IFS()' },
    { text: 'The safety net for lookup formulas is…', options: ['COUNTIF', 'IFERROR', 'TRIM', 'LEN'], correctAnswer: 'IFERROR' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'VLOOKUP & XLOOKUP': [
    { text: 'VLOOKUP finds a value in…', options: ['any column', 'the first column of the table', 'the last column', 'a chart'], correctAnswer: 'the first column of the table' },
    { text: 'The FALSE argument in VLOOKUP means…', options: ['approximate match', 'exact match', 'look right', 'ignore errors'], correctAnswer: 'exact match' },
    { text: 'A VLOOKUP limitation is…', options: ['it cannot look to the left of the lookup column', 'it only works on text', 'it needs a pivot table', 'it cannot return numbers'], correctAnswer: 'it cannot look to the left of the lookup column' },
    { text: 'XLOOKUP\'s advantage is…', options: ['it is slower but prettier', 'no column index and lookup in any direction with a fallback', 'it deletes duplicates', 'it only works in Word'], correctAnswer: 'no column index and lookup in any direction with a fallback' },
  ],
  'INDEX-MATCH — The Flexible Combination': [
    { text: 'MATCH("North", A2:A10, 0) returns…', options: ['the value at that cell', 'the position number of "North"', 'the sum of the column', 'an error'], correctAnswer: 'the position number of "North"' },
    { text: '=INDEX(B2:B10, 3) returns…', options: ['the 3rd value in B2:B10', 'the sum of B2:B10', 'the cell address', 'the largest value'], correctAnswer: 'the 3rd value in B2:B10' },
    { text: 'INDEX-MATCH is the choice when…', options: ['VLOOKUP cannot look to the left', 'you have no data', 'you need charts', 'the sheet is empty'], correctAnswer: 'VLOOKUP cannot look to the left' },
    { text: 'The 0 in MATCH(..., 0) means…', options: ['approximate match', 'exact match', 'the column letter', 'a formula flag'], correctAnswer: 'exact match' },
  ],
  'Data Validation — Stop Bad Input': [
    { text: 'Data Validation can restrict a cell to…', options: ['only a dropdown of allowed values', 'nothing', 'any value at all', 'a printed page'], correctAnswer: 'only a dropdown of allowed values' },
    { text: 'Dropdown validation prevents…', options: ['fast typing', 'typos like "Paid", "payed" and "PAID" as three values', 'formulas', 'printing'], correctAnswer: 'typos like "Paid", "payed" and "PAID" as three values' },
    { text: 'An input message in validation…', options: ['tells the user what to type', 'blocks all input', 'sorts the data', 'prints a note'], correctAnswer: 'tells the user what to type' },
    { text: 'Clean data is best achieved…', options: ['by cleaning at the end', 'at input time via validation', 'by never sharing files', 'by using text only'], correctAnswer: 'at input time via validation' },
  ],
  'Cleaning Data: Duplicates, Trim & Text to Columns': [
    { text: 'Data → Remove Duplicates…', options: ['hides duplicates', 'deletes duplicate rows based on chosen columns', 'sorts duplicates', 'colors them'], correctAnswer: 'deletes duplicate rows based on chosen columns' },
    { text: 'A common invisible data problem is…', options: ['extra fonts', 'trailing spaces that break lookups', 'too many sheets', 'long filenames'], correctAnswer: 'trailing spaces that break lookups' },
    { text: 'Text to Columns splits one column into several by…', options: ['a delimiter like a comma', 'the font', 'the row number', 'the color'], correctAnswer: 'a delimiter like a comma' },
    { text: 'For repeatable heavy cleaning, the tool is…', options: ['Power Query', 'sorting', 'a macro always', 'typing again'], correctAnswer: 'Power Query' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Sorting & Filtering Data': [
    { text: 'The golden rule of sorting is…', options: ['sort a single column alone', 'select the whole data range so rows stay together', 'sort in reverse', 'never sort'], correctAnswer: 'select the whole data range so rows stay together' },
    { text: 'Ctrl+Shift+L…', options: ['toggles filters on/off', 'opens a pivot table', 'adds a chart', 'sorts ascending'], correctAnswer: 'toggles filters on/off' },
    { text: 'Filtering is non-destructive because…', options: ['it deletes permanently', 'clear the filter and all data returns', 'it copies the data', 'it locks the sheet'], correctAnswer: 'clear the filter and all data returns' },
    { text: 'Converting a range to an Excel Table (Ctrl+T) gives…', options: ['filter buttons, structure and automatic formatting', 'a chart', 'a pivot table', 'a template'], correctAnswer: 'filter buttons, structure and automatic formatting' },
  ],
  'Pivot Tables — Summarize in Seconds': [
    { text: 'To create a pivot table you start from…', options: ['a chart', 'your data table → Insert → PivotTable', 'a template', 'the print menu'], correctAnswer: 'your data table → Insert → PivotTable' },
    { text: 'The field dragged to Values is…', options: ['the category to group by', 'the number to summarize (e.g. Sales)', 'the report filter only', 'the chart title'], correctAnswer: 'the number to summarize (e.g. Sales)' },
    { text: 'Value Field Settings can switch Sum to…', options: ['Average or Count', 'Text', 'a chart', 'a color'], correctAnswer: 'Average or Count' },
    { text: 'When the source data changes you must…', options: ['rebuild the pivot', 'refresh the pivot table', 'retype the data', 'nothing'], correctAnswer: 'refresh the pivot table' },
  ],
  'Charts That Communicate': [
    { text: 'For comparing categories the best chart is…', options: ['a pie chart', 'a column/bar chart', 'a scatter plot', 'a line chart'], correctAnswer: 'a column/bar chart' },
    { text: 'A pie chart is appropriate only for…', options: ['many tiny slices', 'parts-of-a-whole with few slices', 'trends over time', 'two values always'], correctAnswer: 'parts-of-a-whole with few slices' },
    { text: 'A chart built from a pivot table…', options: ['cannot be updated', 'becomes a pivot chart that updates together', 'becomes a static image', 'needs rebuilding'], correctAnswer: 'becomes a pivot chart that updates together' },
    { text: 'Good chart practice is…', options: ['add 3D effects and clutter', 'clear labels, remove clutter, match the question', 'never add a title', 'only use pie charts'], correctAnswer: 'clear labels, remove clutter, match the question' },
  ],
  'Conditional Formatting & Data Bars': [
    { text: 'Conditional Formatting changes cells based on…', options: ['their position', 'their values or rules', 'the file name', 'the printer'], correctAnswer: 'their values or rules' },
    { text: 'Highlight Cell Rules can flag…', options: ['values greater than a threshold', 'the sheet name', 'the font', 'nothing'], correctAnswer: 'values greater than a threshold' },
    { text: 'Data Bars show…', options: ['in-cell bars scaled by value', 'a chart outside the cell', 'the cell address', 'a border'], correctAnswer: 'in-cell bars scaled by value' },
    { text: 'Conditional formatting updates…', options: ['never', 'automatically as the data changes', 'only after a refresh', 'only in print'], correctAnswer: 'automatically as the data changes' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Printing & Page Setup Done Right': [
    { text: 'To fit a wide sheet on one page use…', options: ['smaller screen zoom', 'Page Layout → Scale to Fit → width 1 page', 'delete columns', 'landscape only'], correctAnswer: 'Page Layout → Scale to Fit → width 1 page' },
    { text: 'Print Titles lets you…', options: ['repeat header rows on every printed page', 'print a banner', 'number pages', 'add a logo'], correctAnswer: 'repeat header rows on every printed page' },
    { text: 'Gridlines print by default?', options: ['yes', 'no — turn them on in Page Setup if needed', 'only in color', 'never possible'], correctAnswer: 'no — turn them on in Page Setup if needed' },
    { text: 'Print Area is used to…', options: ['print only the report range', 'zoom the screen', 'change the printer', 'split the sheet'], correctAnswer: 'print only the report range' },
  ],
  'Building a Simple Dashboard': [
    { text: 'A dashboard is…', options: ['a chart', 'one sheet answering the key questions at a glance', 'a pivot table', 'a printed page'], correctAnswer: 'one sheet answering the key questions at a glance' },
    { text: 'KPI cells typically show…', options: ['large-format key numbers like revenue and orders', 'raw data rows', 'the file size', 'only text'], correctAnswer: 'large-format key numbers like revenue and orders' },
    { text: 'A Slicer attached to a pivot…', options: ['lets viewers filter without touching the data', 'edits the data', 'prints the report', 'deletes the pivot'], correctAnswer: 'lets viewers filter without touching the data' },
    { text: 'A readable dashboard should have…', options: ['many fonts and colors', 'no more than 5-6 visual elements and one consistent font', 'every possible chart', 'no numbers'], correctAnswer: 'no more than 5-6 visual elements and one consistent font' },
  ],
  'Templates & Shared Workbooks': [
    { text: 'A saved Excel template has the extension…', options: ['.xlsx', '.xltx', '.csv', '.pdf'], correctAnswer: '.xltx' },
    { text: 'Templates let you…', options: ['start every month from the same proven layout', 'hide files', 'print faster', 'share passwords'], correctAnswer: 'start every month from the same proven layout' },
    { text: 'Protect Sheet (Review tab) prevents…', options: ['others from overwriting formulas and headers', 'the file being opened', 'data entry anywhere', 'printing'], correctAnswer: 'others from overwriting formulas and headers' },
    { text: 'When several people edit one workbook, store it on…', options: ['OneDrive/SharePoint so edits sync', 'a USB stick', 'the desktop only', 'a printer'], correctAnswer: 'OneDrive/SharePoint so edits sync' },
  ],
  'Excel Shortcuts & Fast Habits': [
    { text: 'Alt+= automatically…', options: ['adds a SUM formula', 'opens the filter', 'creates a chart', 'renames the sheet'], correctAnswer: 'adds a SUM formula' },
    { text: 'F4 repeats…', options: ['the last action', 'the formula bar', 'the filter', 'the print menu'], correctAnswer: 'the last action' },
    { text: 'In a data table you should never…', options: ['merge cells (breaks filtering)', 'use headings', 'add rows', 'use numbers'], correctAnswer: 'merge cells (breaks filtering)' },
    { text: 'The fastest habit before building anything is…', options: ['sketch the question you must answer', 'type random data', 'format the sheet first', 'print a draft'], correctAnswer: 'sketch the question you must answer' },
  ],
};
