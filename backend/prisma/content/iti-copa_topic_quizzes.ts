/**
 * ITI COPA — Computer Operator & Programming Assistant — per-topic quizzes.
 * Keyed by the EXACT topic titles in iti-copa.ts (topic-lock flow).
 * 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in iti-copa.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'The COPA Role — What a Computer Operator Does': [
    { text: 'The computer operator\'s daily duties include…', options: ['documents, data entry, reports and official mail', 'only gaming', 'only design', 'only repairs'], correctAnswer: 'documents, data entry, reports and official mail' },
    { text: 'The operator\'s real skills are…', options: ['accuracy, speed, organisation and calm', 'speed only', 'looks', 'fashion'], correctAnswer: 'accuracy, speed, organisation and calm' },
    { text: 'The core habits are…', options: ['check your work, save often, back up', 'never check', 'work once', 'skip backups'], correctAnswer: 'check your work, save often, back up' },
    { text: 'Software changes, but…', options: ['the habits stay useful for your career', 'nothing matters', 'you must relearn everything', 'the job changes'], correctAnswer: 'the habits stay useful for your career' },
  ],
  'Touch Typing — Speed & Accuracy': [
    { text: 'The home row is…', options: ['ASDF / JKL;', 'QWERTY', 'ZXCV', 'none'], correctAnswer: 'ASDF / JKL;' },
    { text: 'The typing rule is…', options: ['each finger owns its column', 'use only two fingers', 'look at the keys', 'type random'], correctAnswer: 'each finger owns its column' },
    { text: 'For office work the target is…', options: ['30–40 WPM accurate', '100 WPM sloppy', 'no speed', 'only errors'], correctAnswer: '30–40 WPM accurate' },
    { text: 'Daily practice should be…', options: ['10 focused minutes a day', 'one Sunday marathon', 'never', 'an hour a year'], correctAnswer: '10 focused minutes a day' },
  ],
  'Operating Systems — Windows Essentials': [
    { text: 'Alt+Tab switches…', options: ['between open apps', 'between letters', 'the keyboard', 'nothing'], correctAnswer: 'between open apps' },
    { text: 'Ctrl+Shift+Esc opens…', options: ['the task manager', 'a new folder', 'the printer', 'the browser'], correctAnswer: 'the task manager' },
    { text: 'Win+Shift+S takes…', options: ['a screenshot', 'a backup', 'a print', 'nothing'], correctAnswer: 'a screenshot' },
    { text: 'A healthy system means…', options: ['updates on, temp files cleared, few startup apps', 'no updates', 'many startup apps', 'unknown software'], correctAnswer: 'updates on, temp files cleared, few startup apps' },
  ],
  'Files & Folders — Organize, Name, Find': [
    { text: 'A clean file name looks like…', options: ['2026-08-15_attendance_v2.xlsx', 'file1.xlsx', 'new document (3).xlsx', 'abc'], correctAnswer: '2026-08-15_attendance_v2.xlsx' },
    { text: 'Version numbers in names…', options: ['track revisions clearly', 'are useless', 'slow the PC', 'are for IT'], correctAnswer: 'track revisions clearly' },
    { text: 'The backup habit is…', options: ['weekly, tested, to a second drive or cloud', 'never', 'yearly', 'when it breaks'], correctAnswer: 'weekly, tested, to a second drive or cloud' },
    { text: 'The operator who finds any file in 10 seconds is…', options: ['priceless', 'slow', 'lucky', 'a hacker'], correctAnswer: 'priceless' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Word — Official Documents Done Right': [
    { text: 'Professional documents use…', options: ['styles like Heading 1 and Normal', 'manual bold everywhere', 'random fonts', 'no styles'], correctAnswer: 'styles like Heading 1 and Normal' },
    { text: 'Mail merge sends…', options: ['one letter to many addresses', 'one file to one person', 'emails', 'nothing'], correctAnswer: 'one letter to many addresses' },
    { text: 'A clean official document has…', options: ['one font family and page numbers', 'many fonts', 'no header', 'no numbers'], correctAnswer: 'one font family and page numbers' },
    { text: 'Style-based documents…', options: ['re-format themselves when you edit a style', 'break', 'are slower', 'need rebuilding'], correctAnswer: 're-format themselves when you edit a style' },
  ],
  'Excel — Registers, Tables & Reports': [
    { text: 'The formula for a total is…', options: ['=SUM(A1:A10)', '=ADD(A1)', '=TOTAL', 'typed by hand'], correctAnswer: '=SUM(A1:A10)' },
    { text: 'The $ in a formula…', options: ['locks the reference', 'adds money', 'is a dollar sign', 'errors'], correctAnswer: 'locks the reference' },
    { text: 'Filters let you…', options: ['see slices of the data', 'delete rows', 'print', 'rename'], correctAnswer: 'see slices of the data' },
    { text: 'A typed total is…', options: ['wrong the moment the data changes', 'always right', 'a formula', 'faster'], correctAnswer: 'wrong the moment the data changes' },
  ],
  'PowerPoint — Simple, Clear Presentations': [
    { text: 'The slide rule is…', options: ['one idea per slide', 'everything on one slide', 'no slides', 'full paragraphs'], correctAnswer: 'one idea per slide' },
    { text: 'The slide master gives…', options: ['consistent design across slides', 'random colours', 'more text', 'nothing'], correctAnswer: 'consistent design across slides' },
    { text: 'What you say lives in…', options: ['presenter notes', 'the slide text', 'the title', 'the footer'], correctAnswer: 'presenter notes' },
    { text: 'A presentation is…', options: ['a visual map, not the full document', 'the full report', 'a handout', 'a video'], correctAnswer: 'a visual map, not the full document' },
  ],
  'Office Workflows — Documents, Data & Deadlines': [
    { text: 'A workflow runs…', options: ['draft → review → approve → distribute → file', 'directly to the printer', 'backwards', 'randomly'], correctAnswer: 'draft → review → approve → distribute → file' },
    { text: 'To never miss a deadline you…', options: ['plan backwards from it', 'hope', 'work faster at the end', 'ignore it'], correctAnswer: 'plan backwards from it' },
    { text: 'Templates are for…', options: ['repeat documents', 'one-off letters', 'personal files', 'nothing'], correctAnswer: 'repeat documents' },
    { text: 'The final checklist before delivering is…', options: ['content, numbers, format, saved', 'nothing', 'the colour', 'the size'], correctAnswer: 'content, numbers, format, saved' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Data Entry — Accuracy Under Speed': [
    { text: 'The entry technique is…', options: ['read a chunk, type it, verify', 'letter by letter', 'copy blindly', 'speed only'], correctAnswer: 'read a chunk, type it, verify' },
    { text: 'For codes and numbers you…', options: ['say the digits as you type', 'skip them', 'guess', 'round them'], correctAnswer: 'say the digits as you type' },
    { text: 'The operator\'s metric is…', options: ['99%+ accuracy at speed', 'only speed', 'only errors', 'no metric'], correctAnswer: '99%+ accuracy at speed' },
    { text: 'When the data matters you…', options: ['slow down and double-check', 'type faster', 'skip it', 'abbreviate'], correctAnswer: 'slow down and double-check' },
  ],
  'Email — Official Correspondence That Works': [
    { text: 'A good subject is…', options: ['clear and specific', 'urgent', 'blank', 'hi'], correctAnswer: 'clear and specific' },
    { text: 'Reply-all is for…', options: ['when everyone truly needs it', 'always', 'never', 'personal mail'], correctAnswer: 'when everyone truly needs it' },
    { text: 'BCC is for…', options: ['large safe mailing lists', 'the main recipient', 'attachments', 'nothing'], correctAnswer: 'large safe mailing lists' },
    { text: 'Email is…', options: ['a record — write professionally', 'a chat', 'informal', 'a game'], correctAnswer: 'a record — write professionally' },
  ],
  'Internet for Work — Search, Verify, Avoid Scams': [
    { text: 'A strong password is…', options: ['a long unique passphrase', 'your birth date', 'the office name', '123456'], correctAnswer: 'a long unique passphrase' },
    { text: 'An OTP should be…', options: ['never shared with anyone', 'shared with IT', 'posted online', 'written down'], correctAnswer: 'never shared with anyone' },
    { text: 'Before typing credentials you…', options: ['verify the URL', 'trust the look', 'click fast', 'skip it'], correctAnswer: 'verify the URL' },
    { text: 'The trustworthy sources for official info are…', options: ['official sites like .gov.in', 'random links', 'social posts', 'emails'], correctAnswer: 'official sites like .gov.in' },
  ],
  'Online Official Work — Forms, Portals & e-Governance': [
    { text: 'The first step on a portal is…', options: ['finding the official address', 'paying fees', 'guessing', 'sharing your ID'], correctAnswer: 'finding the official address' },
    { text: 'After submitting you should…', options: ['note the reference number', 'forget it', 're-apply', 'delete the file'], correctAnswer: 'note the reference number' },
    { text: 'Portal credentials are…', options: ['private, always', 'shared with colleagues', 'public', 'optional'], correctAnswer: 'private, always' },
    { text: 'Official online work needs…', options: ['the same accuracy and verification as any form', 'no care', 'a different attitude', 'speed only'], correctAnswer: 'the same accuracy and verification as any form' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  "PC Components — What's Inside the Box": [
    { text: 'The CPU is…', options: ['the brain', 'the memory', 'the storage', 'the power'], correctAnswer: 'the brain' },
    { text: 'RAM is…', options: ['fast working memory, cleared at shutdown', 'permanent storage', 'the motherboard', 'the fan'], correctAnswer: 'fast working memory, cleared at shutdown' },
    { text: 'A slow PC usually means…', options: ['full RAM or an old drive', 'a virus always', 'a broken screen', 'the power'], correctAnswer: 'full RAM or an old drive' },
    { text: 'Inside the case you…', options: ['unplug first and discharge static', 'touch everything', 'work live', 'skip safety'], correctAnswer: 'unplug first and discharge static' },
  ],
  'Printers & Peripherals — Keep Them Working': [
    { text: 'The first print check is…', options: ['paper loaded?', 'call IT', 'rebuy the printer', 'reboot the PC'], correctAnswer: 'paper loaded?' },
    { text: 'A stuck print queue…', options: ['blocks everything — clear it first', 'is harmless', 'resolves itself', 'is a driver'], correctAnswer: 'blocks everything — clear it first' },
    { text: 'The checklist order is…', options: ['paper, online, queue, driver, ink', 'ink, driver, queue', 'random', 'none'], correctAnswer: 'paper, online, queue, driver, ink' },
    { text: 'Printer care includes…', options: ['the right paper and correct cartridge replacement', 'random buttons', 'nothing', 'more toner'], correctAnswer: 'the right paper and correct cartridge replacement' },
  ],
  "Troubleshooting — Diagnose, Don't Guess": [
    { text: 'The troubleshooting method is…', options: ['observe, hypothesise, test, fix root cause', 'guess and restart', 'call IT immediately', 'replace parts'], correctAnswer: 'observe, hypothesise, test, fix root cause' },
    { text: 'The question that finds most bugs is…', options: ['what changed before it failed?', 'is it expensive?', 'who did it?', 'is it Monday?'], correctAnswer: 'what changed before it failed?' },
    { text: 'Restart first because…', options: ['it clears stuck states and is free', 'it erases the problem', 'it is required', 'nothing'], correctAnswer: 'it clears stuck states and is free' },
    { text: 'Before escalating you…', options: ['try the basics and document what you saw', 'give up', 'shout', 'buy a new PC'], correctAnswer: 'try the basics and document what you saw' },
  ],
  'Preventive Maintenance — Stop Problems Before They Start': [
    { text: 'The monthly routine includes…', options: ['disk cleanup and trimming startup programs', 'nothing', 'buying new PCs', 'formatting the drive'], correctAnswer: 'disk cleanup and trimming startup programs' },
    { text: 'A backup is only real when…', options: ['it is tested', 'it is done once', 'it is on the same drive', 'it is large'], correctAnswer: 'it is tested' },
    { text: 'The maintenance log…', options: ['turns guesswork into a pattern', 'is extra work', 'is for IT', 'is private'], correctAnswer: 'turns guesswork into a pattern' },
    { text: 'A machine that gets monthly care…', options: ['rarely fails at the worst moment', 'always fails', 'is slower', 'needs no backups'], correctAnswer: 'rarely fails at the worst moment' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'What Programming Is — Instructions for the Machine': [
    { text: 'A program is…', options: ['precise instructions the computer follows', 'a random process', 'a file', 'a machine'], correctAnswer: 'precise instructions the computer follows' },
    { text: 'The three parts are…', options: ['input, process, output', 'start, middle, end', 'file, edit, view', 'none'], correctAnswer: 'input, process, output' },
    { text: 'Programming awareness helps COPA because…', options: ['you can automate repetitive tasks', 'you become a developer overnight', 'nothing', 'it is required'], correctAnswer: 'you can automate repetitive tasks' },
    { text: 'A small office automation…', options: ['saves hours a week', 'is dangerous', 'is illegal', 'slows work'], correctAnswer: 'saves hours a week' },
  ],
  'Simple Logic & Problem Solving': [
    { text: 'Problem solving starts with…', options: ['breaking a task into ordered steps', 'writing code immediately', 'guessing', 'the tool'], correctAnswer: 'breaking a task into ordered steps' },
    { text: 'The structure of logic is…', options: ['steps, decisions, repetition', 'only decisions', 'random', 'none'], correctAnswer: 'steps, decisions, repetition' },
    { text: 'Before trusting your steps you…', options: ['test them on 2–3 real cases', 'skip testing', 'run once', 'share them'], correctAnswer: 'test them on 2–3 real cases' },
    { text: 'The edge case is…', options: ['the unusual input like an empty sheet', 'the main path', 'a typo', 'the last row'], correctAnswer: 'the unusual input like an empty sheet' },
  ],
  'Scripting & Automation for the Office': [
    { text: 'An Excel macro can…', options: ['record a repetitive task and replay it', 'fix the printer', 'email anyone', 'secure the office'], correctAnswer: 'record a repetitive task and replay it' },
    { text: 'The automation trigger is…', options: ['"I do this every week"', '"it is too hard"', '"scripts are for IT"', 'never'], correctAnswer: '"I do this every week"' },
    { text: 'Saved scripts need…', options: ['a comment on what each does', 'a password', 'no notes', 'a folder'], correctAnswer: 'a comment on what each does' },
    { text: 'The habit to build is…', options: ['automate one annoying task at a time', 'automate everything at once', 'never automate', 'manual forever'], correctAnswer: 'automate one annoying task at a time' },
  ],
  'The COPA Career — From Operator to Beyond': [
    { text: 'This course is…', options: ['a supplement that strengthens trade skills', 'a government certificate', 'a degree', 'a hardware licence'], correctAnswer: 'a supplement that strengthens trade skills' },
    { text: 'The official trade certificate…', options: ['remains governed by the recognised trade authority', 'comes from this course', 'is automatic', 'is not needed'], correctAnswer: 'remains governed by the recognised trade authority' },
    { text: 'Career directions include…', options: ['data entry, desktop support, and more study', 'only one job', 'no growth', 'only design'], correctAnswer: 'data entry, desktop support, and more study' },
    { text: 'The base that makes an operator indispensable is…', options: ['accuracy, organisation and dependability', 'speed alone', 'talent', 'luck'], correctAnswer: 'accuracy, organisation and dependability' },
  ],
};
