/**
 * ITI COPA — Computer Operator & Programming Assistant — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in iti-copa_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 *
 * Supplementary skill-building for COPA trade aspirants. This course is a
 * learning supplement only — it does NOT grant or replace any government
 * trade certificate; that remains governed by the official trade authority.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · COPA Trade Foundations ──────────────────────────────────────────
  {
    week: 1,
    title: 'COPA Trade Foundations',
    description: 'The computer operator\'s role, touch typing, the operating system, and managing files like a pro.',
    topics: [
      {
        title: 'The COPA Role — What a Computer Operator Does',
        text: 'The computer operator is the office\'s hands on the machine: typing documents, managing files, entering data, preparing reports, sending official mail, and keeping the office PCs running.\n\nEvery task in this course maps to a real duty: typing speed for data entry, spreadsheets for registers and reports, email for official correspondence, and maintenance so work never stops.\n\nThe operator\'s real skills are accuracy, speed, organisation and calm. Software changes — the habits you build here (check your work, save often, back up) stay useful for your whole career.',
        code: '// The daily duties\nType & format documents\nEnter and verify data\nPrepare registers and reports\nHandle official email and forms\nBasic PC care and troubleshooting\n\n// The operator\'s habits\nAccuracy before speed\nSave early, save often, back up',
        note: 'Every lesson maps to a real office duty. Accuracy and organisation are the operator\'s superpower.',
      },
      {
        title: 'Touch Typing — Speed & Accuracy',
        text: 'Touch typing is typing without looking at the keys: fingers rest on the home row (ASDF / JKL;), each finger owns its column, and the shift keys handle capitals. Practise in short, daily sessions — speed follows accuracy.\n\nTargets that serve real work: 30–40 words per minute with high accuracy beats 80 WPM with errors. Data entry jobs want accuracy above all — a typo in a register or a form is a real cost.\n\nTools: free typing tutors, daily drills, and practising on real documents. Set a daily 10-minute habit and track your WPM and error rate. Errors are practice feedback, not failure.',
        code: '// Home row\nL H L H L H   (ASDF  /  JKL;)\n\n// Fingering rule\nEach finger owns one column\nShift + letter for capitals\n\n// Targets\n30–40 WPM accurate  >  80 WPM sloppy\n\n// Daily habit\n10 minutes of typing practice\nTrack WPM + error rate',
        note: 'Accuracy first, speed second. Ten focused minutes a day beats a Sunday marathon.',
      },
      {
        title: 'Operating Systems — Windows Essentials',
        text: 'The OS runs the machine: the desktop and start menu, file explorer, task manager, and settings. As a computer operator you live in Windows: opening apps, managing windows, and keeping the system healthy.\n\nCore skills: switch between apps with Alt+Tab, take screenshots, manage multiple desktops, and use the task manager to close a stuck program. Know your file types and the standard folders.\n\nKeep the system clean: close what you don\'t need, clear temp files, keep the OS updated, and never install unknown software. A healthy machine is a fast machine.',
        code: '// Everyday Windows\nAlt+Tab     — switch apps\nWin+S       — search\nPrtSc / Win+Shift+S — screenshots\nCtrl+Shift+Esc — task manager\n\n// Health habits\nKeep updates on\nClear temp files\nClose unused apps\nInstall only trusted software',
        note: 'Know your OS cold: apps, files, screenshots, task manager. A clean system is a fast system.',
      },
      {
        title: 'Files & Folders — Organize, Name, Find',
        text: 'Files are useless if you can\'t find them. Build a folder structure that mirrors the work: one folder per project or year, clear names (2026-07_report_v2), and consistent types.\n\nMaster the tools: copy/move with cut/copy/paste and drag, rename in bulk, search by name and content, and sort by date. Learn where your work actually saves (Documents, Desktop) and where apps save (Downloads, AppData).\n\nFile discipline: one file one purpose, version numbers, weekly backups to a second drive or cloud, and never "delete and hope". The operator who finds any file in 10 seconds is priceless.',
        code: '// A clean structure\nWork/\n ├─ 2026/\n │   ├─ Reports/\n │   ├─ Registers/\n │   └─ Correspondence/\n\n// Naming\n2026-08-15_attendance_v2.xlsx\n\n// Habits\nVersion numbers on files\nWeekly backup\nSearch by name AND content',
        note: 'Structure, naming and backup are the operator\'s filing cabinet. Organize once, find forever.',
      },
    ],
    quizzes: [
      { text: 'The computer operator\'s core value is…', options: ['accuracy and organisation', 'gaming', 'design', 'nothing'], correctAnswer: 'accuracy and organisation' },
      { text: 'Touch typing means…', options: ['typing without looking at the keys', 'typing fast with two fingers', 'using only one hand', 'typing in the dark'], correctAnswer: 'typing without looking at the keys' },
      { text: 'To close a stuck program you use…', options: ['task manager', 'the printer', 'file explorer', 'the internet'], correctAnswer: 'task manager' },
      { text: 'The operator should…', options: ['back up weekly and name files clearly', 'delete old files freely', 'skip backups', 'save once'], correctAnswer: 'back up weekly and name files clearly' },
    ],
  },

  // ── W2 · Office Applications in Practice ─────────────────────────────────
  {
    week: 2,
    title: 'Office Applications in Practice',
    description: 'Word, Excel and PowerPoint for real office work — documents, registers, reports and presentations.',
    topics: [
      {
        title: 'Word — Official Documents Done Right',
        text: 'Word handles the office\'s official documents: letters, memos, notices, reports. The professional way: use styles (Heading 1, Normal), let Word manage page numbers and table of contents, and format tables cleanly.\n\nThe essentials: spell check and grammar, find-and-replace, page setup (margins, A4), headers and footers with page numbers, and mail merge for sending the same letter to many addresses.\n\nA clean official document has: consistent fonts (one family), proper spacing, page numbers, and a tidy header with the office name. Style-based documents edit themselves — a changed heading style re-formats every heading.',
        code: '// Word essentials\nStyles: Heading 1, Heading 2, Normal\nPage numbers + header/footer\nFind & Replace\nMail merge (one letter, many addresses)\n\n// Official document rules\nOne font family\nConsistent spacing\nPage numbers\nOffice header',
        note: 'Use styles, not manual formatting. Style-based documents re-format themselves when you edit.',
      },
      {
        title: 'Excel — Registers, Tables & Reports',
        text: 'Excel is the operator\'s data engine: attendance registers, stock lists, fee records, daily reports. Master the cells: enter data, format, sort, filter, and let formulas do the math.\n\nThe core formulas: SUM, AVERAGE, COUNT, IF, and references. Lock totals with $ signs (absolute references). Freeze header rows, use filters to see slices of data, and format tables with borders and fills so they read well on paper.\n\nNever type a total you can compute. A formula updates when the data changes; a typed number is wrong the moment the data changes.',
        code: '// Core formulas\n=SUM(A1:A10)\n=AVERAGE(B1:B10)\n=COUNTIF(range,"Absent")\n=IF(C2>40,"Pass","Review")\n\n// Best practice\nFormulas for every total (never typed numbers)\n$ locks references  =SUM($B$2:$B$20)\nFreeze header row\nFilters for quick slices',
        note: 'Compute with formulas, never typed totals. Excel is a live tool — let it recalculate.',
      },
      {
        title: 'PowerPoint — Simple, Clear Presentations',
        text: 'PowerPoint presents work to the office: reports, plans, training. The rule of good slides: one idea per slide, few words, a clear structure, and consistent formatting.\n\nWork with slide masters and layouts so every slide matches. Add images and charts from your data, and use presenter notes for what you actually say — the audience reads the slides, you speak the detail.\n\nA presentation is not the document: keep the dense report for the handout, and the slides as a visual map. Title slide, agenda, sections, and a clean ending slide.',
        code: '// Slide discipline\nOne idea per slide\nFew words, big ideas\nChart from real data\n\n// Tools\nSlide master (consistent design)\nLayouts not free-text boxes\nPresenter notes for the talk\n\n// Structure\nTitle → Agenda → Sections → Summary',
        note: 'One idea per slide, few words, data-backed. Master layouts keep every slide consistent.',
      },
      {
        title: 'Office Workflows — Documents, Data & Deadlines',
        text: 'Real office work is workflows: a notice goes from draft to review to print to distribution; a register goes from entry to check to report. Learn the flow, not just the tool.\n\nThe habits that make you dependable: double-check before sending, keep templates for repeat documents, log what you sent and when, and never miss a deadline — plan backwards from it.\n\nYour checklist before delivering any work: content correct, names spelled right, numbers match the source, format clean, and the file named and saved where the office expects it. Dependability is the operator\'s brand.',
        code: '// A typical workflow\nDraft → review → approve → print/email → file copy\n\n// The dependable operator\nDouble-check before send\nTemplates for repeat work\nA send log (what, when, to whom)\nPlan backwards from the deadline\n\n// Final checklist\nContent ✓  Numbers ✓  Format ✓  Saved ✓',
        note: 'Follow the workflow, plan backwards from deadlines, and check before you send.',
      },
    ],
    quizzes: [
      { text: 'Professional Word documents use…', options: ['styles, not manual formatting', 'random fonts', 'no page numbers', 'only tables'], correctAnswer: 'styles, not manual formatting' },
      { text: 'Excel totals should be…', options: ['formulas, never typed numbers', 'typed by hand', 'guessed', 'in text'], correctAnswer: 'formulas, never typed numbers' },
      { text: 'The slide rule is…', options: ['one idea per slide', 'fill the slide with text', 'no structure', 'lots of words'], correctAnswer: 'one idea per slide' },
      { text: 'Before sending any work you…', options: ['double-check content and numbers', 'skip the check', 'rename the file', 'print it'], correctAnswer: 'double-check content and numbers' },
    ],
  },

  // ── W3 · Data Entry, Internet & Official Communication ───────────────────
  {
    week: 3,
    title: 'Data Entry, Internet & Official Communication',
    description: 'Fast accurate data entry, official email, internet research, and online government work.',
    topics: [
      {
        title: 'Data Entry — Accuracy Under Speed',
        text: 'Data entry is the operator\'s core duty: names, numbers, codes, addresses — entered from forms, registers and lists into software. The value is accuracy: a wrong digit in a code or a misspelled name causes real harm.\n\nTechniques: read a small chunk then type it (not letter by letter), verify numbers twice (saying them to yourself), use the numeric keypad for digits, and let the software\'s validation catch what you can\'t. Enter in batches and spot-check.\n\nMeasure yourself: entries per hour and error rate. Good operators hold 99%+ accuracy while staying fast. Slow down when the data matters — a PAN number or account code is worth the extra second.',
        code: '// Entry technique\nRead a chunk → type it → verify\nBatch and spot-check\nNumeric keypad for numbers\n\n// Verify\nNames: spell twice\nCodes: say the digits\nAccount numbers: double-check\n\n// Metric\nAccuracy 99%+ at speed',
        note: 'Accuracy is the product. Read in chunks, verify numbers twice, and slow down when it matters.',
      },
      {
        title: 'Email — Official Correspondence That Works',
        text: 'Official email is formal writing: a clear subject, a proper greeting, a short body, and a correct signature block. The same letter conventions apply in email — spell out, use standard greetings, and never send in anger.\n\nUse the tools: reply vs reply-all (reply-all only when everyone truly needs it), BCC for large safe lists, attachments named properly, and read receipts only when required.\n\nThe checklist before Send: correct recipients, right attachment attached, subject says what it is, no typos, and the tone is professional. Emails are records — write as if they will be read in a meeting.',
        code: '// Email anatomy\nSubject: clear and specific\nGreeting + one-paragraph body\nSignature: name, role, contact\n\n// Rules\nReply-all only when needed\nBCC for large lists\nName attachments properly\nNever send angry\n\n// Before Send\nRecipients ✓  Attachment ✓  Subject ✓  Spelling ✓',
        note: 'Email is a record. Clear subject, right recipients, right attachment, professional tone.',
      },
      {
        title: 'Internet for Work — Search, Verify, Avoid Scams',
        text: 'The internet is the operator\'s research desk. Search with specific terms, evaluate what you find (who wrote it, when, is it official), and never trust a single source for important facts.\n\nOnline safety is part of the job: strong passwords (a phrase, not "123456"), never click links in suspicious emails, verify websites by their address, and never share OTPs or passwords with anyone — including callers who claim to be IT.\n\nThe work-safe internet: official sites for forms and information (.gov.in, official corporate), downloads only from the original source, and every login done carefully. One bad click can cost the office everything.',
        code: '// Search well\nSpecific terms, exact phrases in quotes\nOfficial sources first (.gov.in, official sites)\n\n// Safety\nLong passphrases, one per account\nNever share OTPs or passwords\nVerify the URL before typing credentials\nBeware unexpected attachments and links\n\n// Downloads\nOriginal sources only',
        note: 'Search with specific terms, trust official sources, and treat every login as a transaction.',
      },
      {
        title: 'Online Official Work — Forms, Portals & e-Governance',
        text: 'Government work increasingly happens online: e-governance portals, online applications, digital certificates and online payments. The operator often sits at the counter of that world.\n\nPractical skills: filling online forms accurately, uploading the right document formats and sizes, managing the user ID/password of portal accounts, printing confirmations, and tracking application status by reference number.\n\nDo your part to stay safe: use the official portal address (not a search link), check the URL bar, keep portal credentials private, and never pay "facilitation fees" through unofficial channels. Online official work is a skill — accuracy and verification apply here too.',
        code: '// Portal workflow\nFind the official portal\nCreate/verify account\nFill the form carefully\nUpload correct documents\nNote the reference number\nTrack the status\n\n// Safety\nOfficial URL only\nPortal credentials private\nNo unofficial payments',
        note: 'Official portals need the same accuracy as any form — plus extra care with credentials and URLs.',
      },
    ],
    quizzes: [
      { text: 'The data-entry technique is…', options: ['read a chunk, type it, verify', 'type letter by letter', 'type fast, never check', 'skip it'], correctAnswer: 'read a chunk, type it, verify' },
      { text: 'Reply-all is used…', options: ['only when everyone truly needs it', 'always', 'never', 'for personal mail'], correctAnswer: 'only when everyone truly needs it' },
      { text: 'A strong password is…', options: ['a long passphrase, unique per account', '123456', 'your name', 'the same everywhere'], correctAnswer: 'a long passphrase, unique per account' },
      { text: 'On a government portal you…', options: ['use the official URL and keep credentials private', 'click any search link', 'share your OTP', 'pay unofficial fees'], correctAnswer: 'use the official URL and keep credentials private' },
    ],
  },

  // ── W4 · Hardware & Maintenance Basics ───────────────────────────────────
  {
    week: 4,
    title: 'Hardware & Maintenance Basics',
    description: 'Knowing the PC from the inside, keeping printers and peripherals alive, and first-line troubleshooting.',
    topics: [
      {
        title: 'PC Components — What\'s Inside the Box',
        text: 'The operator should recognise the parts of a PC: the processor (CPU) — the brain, RAM — the short-term working memory, the storage drive (SSD/HDD) — the long-term filing cabinet, the motherboard — the city they all plug into, the power supply, and the graphics/video section.\n\nUnderstand the flow: the CPU uses RAM for active work; data lives on the drive; everything talks through the motherboard; the power supply feeds them all. When the PC is slow, the likely suspects are full RAM or an old drive — not "a virus".\n\nBe safe inside the case: unplug first, touch a metal frame to discharge static, and handle parts by their edges. Diagnosis before repair: a machine that won\'t boot is often just a loose cable or a dead power lead.',
        code: '// The parts\nCPU      — the brain\nRAM      — working memory (fast, volatile)\nSSD/HDD  — storage (permanent)\nMotherboard — the connecting city\nPSU      — the power feed\n\n// Slow PC? Check\nRAM full?\nDrive old/full?\nToo many startup programs?',
        note: 'Know the parts and the flow: CPU uses RAM, data lives on the drive, power feeds all.',
      },
      {
        title: 'Printers & Peripherals — Keep Them Working',
        text: 'Printers are the office workhorse and the operator\'s daily companion. Know the basics: paper loading, ink/toner replacement, the drivers, and the print queue.\n\nWhen printing fails, check in order: paper loaded? printer online and connected? queue not stuck? driver present? ink/toner not empty? A stuck job in the queue blocks everything behind it — clear it first.\n\nCare keeps printers alive: use the right paper, replace cartridges correctly, keep them clean, and run a test page when something changes. The operator who can unstick a printer without calling IT is worth double.',
        code: '// Print failure checklist\n1. Paper loaded?\n2. Online + connected?\n3. Queue stuck? (clear it first)\n4. Driver installed?\n5. Ink/toner not empty?\n\n// Printer care\nRight paper\nCorrect cartridge replacement\nClean rollers\nTest page after changes',
        note: 'Clear the stuck queue first, then walk the checklist. Printer care is operator hygiene.',
      },
      {
        title: 'Troubleshooting — Diagnose, Don\'t Guess',
        text: 'Troubleshooting is a method, not a talent: observe the symptom, form a hypothesis, test it, and fix the root cause — not the symptom.\n\nCommon office cases and their usual causes: slow PC (RAM/drive/startup), won\'t boot (loose cable, power, monitor input), no internet (cable/wifi, restart router, proxy), printer offline (queue/cable/driver). Restart fixes an astonishing number of problems — it clears stuck states.\n\nThe disciplined loop: what exactly fails, what changed before it failed, test one thing at a time, and confirm the fix. Never escalate without having tried the basics and written down what you saw.',
        code: '// The method\nSymptom → hypothesis → test → root-cause fix\n\n// What changed before it failed?\n(that question finds most bugs)\n\n// Restart first\nClears stuck states, nearly free\n\n// Document\nWhat you saw, what you tried, what worked',
        note: 'Diagnose with the method, not the guess. Note what changed before the failure — that\'s the clue.',
      },
      {
        title: 'Preventive Maintenance — Stop Problems Before They Start',
        text: 'Preventive maintenance keeps the office running: clean the machines, manage startup programs, keep software updated, scan for malware, and keep disks from filling up.\n\nThe routine: monthly disk clean-up, remove junk and startup bloat, run updates weekly, keep a clean backup (external drive or cloud, tested), and label every cable and machine.\n\nThe operator\'s maintenance log: what was cleaned, when, what was updated, what broke. A log turns "the computer is slow again" into a record that shows the pattern. The machine that gets monthly care rarely fails at the worst moment.',
        code: '// Monthly routine\nDisk cleanup (temp, recycle bin)\nTrim startup programs\nCheck disk space\nUpdate OS + software\nMalware scan\n\n// Backup\nTested, not just done\nWeekly for work files\n\n// Keep a log\nDate · action · result',
        note: 'Monthly care prevents weekly crises. A maintenance log turns guesswork into a pattern.',
      },
    ],
    quizzes: [
      { text: 'RAM is…', options: ['the fast working memory', 'permanent storage', 'the brain', 'the power feed'], correctAnswer: 'the fast working memory' },
      { text: 'A stuck print queue…', options: ['blocks everything behind it — clear it first', 'fixes itself', 'is harmless', 'is a driver'], correctAnswer: 'blocks everything behind it — clear it first' },
      { text: 'The first troubleshooting question is…', options: ['what changed before it failed?', 'is it a virus?', 'who did it?', 'should we buy a new one?'], correctAnswer: 'what changed before it failed?' },
      { text: 'Preventive maintenance…', options: ['prevents failures before they start', 'is optional', 'is only for servers', 'costs a fortune'], correctAnswer: 'prevents failures before they start' },
    ],
  },

  // ── W5 · Programming Awareness & the COPA Career ─────────────────────────
  {
    week: 5,
    title: 'Programming Awareness & the COPA Career',
    description: 'What programming is, simple logic and scripting, and building a durable operator career.',
    topics: [
      {
        title: 'What Programming Is — Instructions for the Machine',
        text: 'A program is a precise list of instructions the computer follows, in order. Programming awareness (not full development) means you understand the logic: input → process → output, decisions (if this, do that), and repetition (do this again).\n\nThe COPA trade values this awareness: you can automate repetitive tasks (rename files, format a list, build a small tool) and you can talk to developers in their language.\n\nReal office automation: a script that renames a batch of files, a formula that flags late entries, a macro that formats a weekly report. Small automations save hours a week — that is the practical value of thinking like a programmer.',
        code: '// The logic of every program\nInput → Process → Output\n\n// Decisions\nIF attendance < 80 THEN "Review"\nELSE "OK"\n\n// Repetition\nFOR each file: rename it\n\n// Office automation ideas\nBatch-rename files\nAuto-format a report\nFlag late entries',
        note: 'Programming is precise instructions. Even a little logic awareness automates your daily routine.',
      },
      {
        title: 'Simple Logic & Problem Solving',
        text: 'Programming starts with thinking clearly: break a task into steps, order them, handle the "what if" cases, and test your sequence on examples.\n\nSteps in plain words first: "for each row in the sheet, if the date is overdue, mark it red". Write it in English, then in the tool\'s language. The logic is the skill; the tool is just vocabulary.\n\nPractise with everyday logic: planning a day, sorting files, checking a register. If you can write the steps for making chai, you can write a program — the structure is the same. Clear steps, decisions, repetition.',
        code: '// Think in steps\n1. Start\n2. For each row:\n   IF overdue → mark red\n   ELSE → leave\n3. Done\n\n// Test on examples\nTry your steps on 2–3 real cases\nFind the edge case (empty sheet, zero rows)',
        note: 'Logic is the skill, tools are vocabulary. If you can write clear steps, you can program.',
      },
      {
        title: 'Scripting & Automation for the Office',
        text: 'Scripting turns your logic into a tool the computer runs for you. Common office automations: rename dozens of files, copy a folder\'s structure, convert a list to a table, or open a report and email it.\n\nTools you can use today: Excel macros (record a repetitive task once, replay it), simple batch/PowerShell commands for file chores, and online automation for repeated actions. Start tiny: automate one task that annoys you, measure the minutes saved, then find the next.\n\nThe automation mindset: "I do this 20 times a week" is a script waiting to be written. Save the scripts in a folder with a comment on what each does.',
        code: '// Easy wins\nExcel macro: record a weekly report format\nBatch rename: 2026-*.pdf → Sorted/2026-*.pdf\nCopy a folder structure\nFormat a raw list into a clean table\n\n// Habit\n"I do this every week" → automate it\nSave scripts with a comment header',
        note: 'Automate what you repeat. One annoying task a week becomes a folder of time-savers.',
      },
      {
        title: 'The COPA Career — From Operator to Beyond',
        text: 'This course built the operator foundation: typing, office apps, data entry, internet and official work, hardware care, and programming awareness — a supplement that prepares you for the trade\'s real duties. Your official trade certificate remains governed by the recognised trade authority; this course strengthens the skills behind it.\n\nCareer directions: data entry and office assistant, desktop support, office accounting support, and — with more study — web or software development. Every step starts from the same base: accurate, organised, dependable.\n\nGrow on the job: learn your organisation\'s systems, volunteer for new tasks, keep a skill log, and never stop automating. The operator who understands both the machine and the work becomes indispensable.',
        code: '// What you now have\n✓ Typing + office apps\n✓ Accurate data entry\n✓ Official email + online work\n✓ PC care + troubleshooting\n✓ Programming awareness\n\n// The map forward\nOperator → Office/Data → Desktop support → Development',
        note: 'Your base is accuracy, organisation and dependability. Add skills and automation as you grow.',
      },
    ],
    quizzes: [
      { text: 'A program is…', options: ['precise instructions the computer follows', 'a random process', 'a file name', 'a machine'], correctAnswer: 'precise instructions the computer follows' },
      { text: 'The three parts of any program are…', options: ['input, process, output', 'start, middle, end', 'file, edit, view', 'none'], correctAnswer: 'input, process, output' },
      { text: 'The automation mindset is…', options: ['"I do this every week" → automate it', '"I will do it manually forever"', '"scripts are for IT"', 'never automate'], correctAnswer: '"I do this every week" → automate it' },
      { text: 'This course is…', options: ['a supplement that builds the trade\'s skills', 'a government certificate', 'a degree', 'a hardware course'], correctAnswer: 'a supplement that builds the trade\'s skills' },
    ],
  },
];
