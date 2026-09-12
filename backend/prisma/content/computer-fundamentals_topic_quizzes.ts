/**
 * Computer Fundamentals — per-topic quizzes. Keyed by the EXACT topic titles in
 * computer-fundamentals.ts (topic-lock flow). 4 questions per topic, 4 options,
 * 1 correct. Distinct from the chapter-quiz texts in computer-fundamentals.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'The Main Parts of a Computer': [
    { text: 'The CPU is best described as…', options: ['the storage drive', 'the brain that does the calculations', 'the monitor', 'the power supply'], correctAnswer: 'the brain that does the calculations' },
    { text: 'The storage drive is the computer\'s…', options: ['short-term working memory', 'long-term memory for files', 'input device', 'output device'], correctAnswer: 'long-term memory for files' },
    { text: 'A keyboard is an…', options: ['output device', 'input device', 'storage device', 'processing device'], correctAnswer: 'input device' },
    { text: 'RAM forgets everything when…', options: ['you save the file', 'the power goes off', 'you open a program', 'you connect Wi-Fi'], correctAnswer: 'the power goes off' },
  ],
  'How Data Is Stored: Bits, Files & Folders': [
    { text: 'All computer data is ultimately stored as…', options: ['letters and pictures', 'binary numbers (0s and 1s)', 'sound waves', 'printed pages'], correctAnswer: 'binary numbers (0s and 1s)' },
    { text: '8 bits make…', options: ['a kilobyte', 'one byte', 'a megabyte', 'a file'], correctAnswer: 'one byte' },
    { text: 'A folder is…', options: ['a program', 'a container that groups files together', 'a file extension', 'a website'], correctAnswer: 'a container that groups files together' },
    { text: 'The .jpg in photo.jpg tells the computer…', options: ['who took the photo', 'which app opens it (it\'s an image)', 'how big the file is', 'the file\'s age'], correctAnswer: 'which app opens it (it\'s an image)' },
  ],
  'Software & the Operating System': [
    { text: 'The operating system is…', options: ['an application like Word', 'the master program that runs the whole computer', 'a web browser', 'a hardware part'], correctAnswer: 'the master program that runs the whole computer' },
    { text: 'Examples of operating systems are…', options: ['Word and Excel', 'Windows, macOS, Linux, Android', 'Chrome and Firefox', 'PDF and JPG'], correctAnswer: 'Windows, macOS, Linux, Android' },
    { text: 'Applications are…', options: ['the programs you use: Word, Excel, browsers', 'hardware parts', 'file extensions', 'network cables'], correctAnswer: 'the programs you use: Word, Excel, browsers' },
    { text: 'Software updates matter because…', options: ['they change the wallpaper', 'they patch security holes', 'they delete files', 'they are required for Wi-Fi'], correctAnswer: 'they patch security holes' },
  ],
  'Peripherals & Connections': [
    { text: 'Most peripherals connect by…', options: ['HDMI only', 'USB or Bluetooth', 'power cables', 'audio jacks only'], correctAnswer: 'USB or Bluetooth' },
    { text: 'Wi-Fi is for…', options: ['charging devices', 'wireless internet', 'printing', 'storage'], correctAnswer: 'wireless internet' },
    { text: 'When a device "doesn\'t work", check first…', options: ['the purchase receipt', 'the physical connection, then restart', 'the internet speed', 'the wallpaper'], correctAnswer: 'the physical connection, then restart' },
    { text: 'The port used to connect a monitor is usually…', options: ['HDMI/VGA', 'USB', 'audio jack', 'Ethernet'], correctAnswer: 'HDMI/VGA' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'The Desktop, Windows & Taskbar': [
    { text: 'The three window buttons at top-right are…', options: ['minimize, maximize, close', 'copy, cut, paste', 'save, print, undo', 'back, forward, refresh'], correctAnswer: 'minimize, maximize, close' },
    { text: 'Alt+Tab…', options: ['switches between open windows', 'closes the window', 'opens the Start menu', 'saves the file'], correctAnswer: 'switches between open windows' },
    { text: 'The fastest way to open any program is…', options: ['Windows key + type the name', 'right-click on desktop', 'restart the computer', 'open File Explorer'], correctAnswer: 'Windows key + type the name' },
    { text: 'Clicking a taskbar app icon again…', options: ['uninstalls it', 'minimizes it', 'renames it', 'shuts down the PC'], correctAnswer: 'minimizes it' },
  ],
  'Files, Folders & File Explorer': [
    { text: 'File Explorer is opened with…', options: ['Windows+E', 'Ctrl+S', 'F5', 'Esc'], correctAnswer: 'Windows+E' },
    { text: 'F2 is the shortcut to…', options: ['delete a file', 'rename a file', 'copy a file', 'print a file'], correctAnswer: 'rename a file' },
    { text: 'Deleting a file sends it to…', options: ['permanent deletion', 'the Recycle Bin (recoverable)', 'the trash of the internet', 'a folder'], correctAnswer: 'the Recycle Bin (recoverable)' },
    { text: 'Ctrl+Shift+N in File Explorer…', options: ['creates a new folder', 'renames the drive', 'deletes the folder', 'opens a new window'], correctAnswer: 'creates a new folder' },
  ],
  'Managing Files: Organize, Search & Back Up': [
    { text: 'A good filename example is…', options: ['New Document 4', 'Invoice_Feb_Kunal.xlsx', 'document.docx', 'file (final) NEW 2'], correctAnswer: 'Invoice_Feb_Kunal.xlsx' },
    { text: 'To find any file by name on Windows, press…', options: ['the Windows key and type', 'Ctrl+F5', 'F12', 'Esc'], correctAnswer: 'the Windows key and type' },
    { text: 'The backup rule is…', options: ['one copy is fine', 'two copies, one off-device', 'only copy photos', 'never copy work files'], correctAnswer: 'two copies, one off-device' },
    { text: 'A dead hard drive…', options: ['recovers itself', 'does not negotiate — backups are the only safety', 'is a minor problem', 'only affects games'], correctAnswer: 'does not negotiate — backups are the only safety' },
  ],
  'The Keyboard & Typing Basics': [
    { text: 'Backspace deletes…', options: ['the character after the cursor', 'the character before the cursor', 'the whole line', 'the file'], correctAnswer: 'the character before the cursor' },
    { text: 'Ctrl+Z is…', options: ['save', 'undo', 'print', 'copy'], correctAnswer: 'undo' },
    { text: 'The home-row keys for touch typing are…', options: ['ASDF JKL;', 'QWER UIOP', 'ZXCV BN', '1234 5678'], correctAnswer: 'ASDF JKL;' },
    { text: 'When learning to type, the emphasis should be on…', options: ['speed first', 'accuracy first — speed follows', 'hunting keys', 'using one finger'], correctAnswer: 'accuracy first — speed follows' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'The Web & Web Browsers': [
    { text: 'The internet is…', options: ['the World Wide Web', 'the global network connecting computers', 'a browser', 'a website'], correctAnswer: 'the global network connecting computers' },
    { text: 'To bookmark a page, press…', options: ['Ctrl+D', 'Ctrl+S', 'F5', 'Ctrl+P'], correctAnswer: 'Ctrl+D' },
    { text: 'The padlock icon in the address bar shows…', options: ['the site is popular', 'the connection is secure', 'the page is new', 'the browser is updated'], correctAnswer: 'the connection is secure' },
    { text: 'To reload a page, press…', options: ['F5', 'Ctrl+Z', 'Esc', 'Alt+Tab'], correctAnswer: 'F5' },
  ],
  'Searching Effectively': [
    { text: 'Putting a phrase in quotes makes the search…', options: ['exclude it', 'find that exact phrase', 'go faster', 'use a different engine'], correctAnswer: 'find that exact phrase' },
    { text: 'The first result on a search page is…', options: ['always the best', 'often an ad (look for the Ad label)', 'always official', 'random'], correctAnswer: 'often an ad (look for the Ad label)' },
    { text: 'To search only one site you add…', options: ['site:domain', 'http:', 'www.', 'the word "only"'], correctAnswer: 'site:domain' },
    { text: 'A good evaluation habit is…', options: ['trust the first result', 'prefer official sources and compare a few results', 'trust any .com', 'ignore the date'], correctAnswer: 'prefer official sources and compare a few results' },
  ],
  'Email Basics: Reading, Writing & Attachments': [
    { text: 'The four parts of a professional email are…', options: ['subject, greeting, message, sign-off', 'attachment, photo, emoji, link', 'font, color, size, style', 'to, cc, bcc, spam'], correctAnswer: 'subject, greeting, message, sign-off' },
    { text: 'BCC hides…', options: ['your message', 'recipients from each other', 'the attachment', 'the subject'], correctAnswer: 'recipients from each other' },
    { text: 'Attachments are added with…', options: ['the paperclip icon', 'the save icon', 'the font menu', 'the spam folder'], correctAnswer: 'the paperclip icon' },
    { text: 'An email is permanent, so you should…', options: ['send it in anger to feel better', 'never send anything you wouldn\'t want read publicly', 'always reply-all', 'never include a subject'], correctAnswer: 'never send anything you wouldn\'t want read publicly' },
  ],
  'Using Online Services: Forms, Accounts & Payments': [
    { text: 'Before clicking submit on a form, you should…', options: ['click quickly', 'read it and check your details', 'enter any random data', 'close the browser'], correctAnswer: 'read it and check your details' },
    { text: 'For online payments, prefer…', options: ['typing card details on random sites', 'official apps/UPI and checked padlocks', 'sharing the OTP', 'unsecured sites'], correctAnswer: 'official apps/UPI and checked padlocks' },
    { text: 'Keep payment confirmations as…', options: ['screenshots or emails', 'nothing', 'chats with strangers', 'retyped notes'], correctAnswer: 'screenshots or emails' },
    { text: 'When a site asks for more personal data than it needs…', options: ['give everything', 'share the minimum', 'invent data', 'stop using the internet'], correctAnswer: 'share the minimum' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Strong Passwords & Accounts': [
    { text: 'A strong password is…', options: ['your name plus 123', 'long and not a guessable word — a passphrase', '8 characters exactly', 'your birth date'], correctAnswer: 'long and not a guessable word — a passphrase' },
    { text: 'Using one password for every account is dangerous because…', options: ['it is slow', 'a leak on one site lets attackers try it everywhere', 'passwords expire', 'it is hard to remember'], correctAnswer: 'a leak on one site lets attackers try it everywhere' },
    { text: 'Two-factor authentication (2FA)…', options: ['slows nothing', 'adds a second verification step beyond the password', 'replaces the password', 'is only for email'], correctAnswer: 'adds a second verification step beyond the password' },
    { text: 'The account to protect with 2FA first is…', options: ['a game account', 'email (it resets every other account)', 'a shopping cart', 'none'], correctAnswer: 'email (it resets every other account)' },
  ],
  'Scams, Phishing & Suspicious Links': [
    { text: 'Phishing is…', options: ['a way to catch fish', 'a fake message trying to steal passwords or money', 'an email filter', 'a virus that prints'], correctAnswer: 'a fake message trying to steal passwords or money' },
    { text: 'A classic phishing red flag is…', options: ['a calm tone', 'urgency: "your account is suspended", act now', 'a clear subject line', 'official spelling'], correctAnswer: 'urgency: "your account is suspended", act now' },
    { text: 'If a message pressures you to act now, you should…', options: ['click immediately', 'pause, and verify through the official website or phone number', 'forward it to friends', 'share the OTP'], correctAnswer: 'pause, and verify through the official website or phone number' },
    { text: 'Legitimate companies never ask for…', options: ['your name', 'your OTP or password', 'your email address', 'your city'], correctAnswer: 'your OTP or password' },
  ],
  'Malware, Antivirus & Safe Downloads': [
    { text: 'Ransomware…', options: ['speeds up your PC', 'locks your files and demands money', 'deletes your browser', 'steals your Wi-Fi'], correctAnswer: 'locks your files and demands money' },
    { text: 'The built-in Windows antivirus is…', options: ['Windows Defender', 'Norton 360', 'McAfee', 'Malwarebytes'], correctAnswer: 'Windows Defender' },
    { text: 'The safest place to download software is…', options: ['any pop-up', 'the official website', 'a "cracked" site', 'an email attachment'], correctAnswer: 'the official website' },
    { text: 'The best antivirus is…', options: ['three antivirus programs', 'your own judgment: official sites, updates on, no cracked software', 'a VPN always', 'private browsing'], correctAnswer: 'your own judgment: official sites, updates on, no cracked software' },
  ],
  'Privacy & Identity Protection': [
    { text: 'A site asking your date of birth for a quiz…', options: ['needs it', 'does not need it — share the minimum', 'will delete it', 'is legal'], correctAnswer: 'does not need it — share the minimum' },
    { text: 'Oversharing on social media is risky because…', options: ['it is slow', 'scammers mine public information', 'friends get bored', 'photos get old'], correctAnswer: 'scammers mine public information' },
    { text: 'If someone asks for money from "a friend\'s new number", you should…', options: ['send it fast', 'verify by calling the real number', 'reply with your OTP', 'share your bank PIN'], correctAnswer: 'verify by calling the real number' },
    { text: 'The internet remembers, so…', options: ['post everything publicly', 'post as if your employer and future self are watching', 'delete all accounts', 'use only one name'], correctAnswer: 'post as if your employer and future self are watching' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Productivity Apps: Documents, Sheets & More': [
    { text: 'A spreadsheet is for…', options: ['letters', 'numbers, tables and calculations', 'slides', 'photos'], correctAnswer: 'numbers, tables and calculations' },
    { text: 'Free office alternatives include…', options: ['LibreOffice and Google Docs', 'only paid software', 'web browsers', 'games'], correctAnswer: 'LibreOffice and Google Docs' },
    { text: 'If you know Word, Google Docs is…', options: ['completely different', 'a small adjustment — the skills transfer', 'impossible to learn', 'a database'], correctAnswer: 'a small adjustment — the skills transfer' },
    { text: 'The productivity trio is…', options: ['Word, Excel, PowerPoint', 'Chrome, Edge, Firefox', 'Photos, Music, Video', 'Email, Chat, Files'], correctAnswer: 'Word, Excel, PowerPoint' },
  ],
  'Keyboard Shortcuts & Speed Habits': [
    { text: 'Ctrl+Z and Ctrl+Y are…', options: ['copy and paste', 'undo and redo', 'save and print', 'find and replace'], correctAnswer: 'undo and redo' },
    { text: 'Windows+L…', options: ['locks the computer', 'opens the browser', 'deletes a file', 'mutes audio'], correctAnswer: 'locks the computer' },
    { text: 'A strong speed habit is…', options: ['searching 10 minutes for files', 'organizing files with meaningful names', 'closing nothing', 'using the mouse for everything'], correctAnswer: 'organizing files with meaningful names' },
    { text: 'A realistic shortcut learning goal is…', options: ['all 200 shortcuts today', 'two new shortcuts a week — they compound', 'none', 'only Ctrl+S'], correctAnswer: 'two new shortcuts a week — they compound' },
  ],
  'Common Problems & Simple Fixes': [
    { text: 'The first step of the troubleshooting ladder is…', options: ['buy a new PC', 'restart the computer', 'reinstall the OS', 'call support'], correctAnswer: 'restart the computer' },
    { text: 'To see which programs use memory/CPU, open…', options: ['Task Manager (Ctrl+Shift+Esc)', 'the Start menu', 'File Explorer', 'the Recycle Bin'], correctAnswer: 'Task Manager (Ctrl+Shift+Esc)' },
    { text: 'The first "no internet" fix is…', options: ['change the password', 'restart the router and check Wi-Fi', 'install more RAM', 'update the wallpaper'], correctAnswer: 'restart the router and check Wi-Fi' },
    { text: 'When searching an error online, you should…', options: ['describe it in your own words', 'copy the exact wording', 'ignore the message', 'restart first always'], correctAnswer: 'copy the exact wording' },
  ],
  'Digital Citizenship & Your Next Steps': [
    { text: 'Respecting copyright means…', options: ['sharing everything', 'not pirating software or content', 'downloading cracked apps', 'ignoring licenses'], correctAnswer: 'not pirating software or content' },
    { text: 'A good digital citizen…', options: ['trolls strangers', 'treats people online with the respect they would in person', 'shares harmful content', 'hides all mistakes'], correctAnswer: 'treats people online with the respect they would in person' },
    { text: 'The fundamentals you now have are…', options: ['useless outside office work', 'the foundation for office, IT, data and further training', 'only for gaming', 'for IT experts only'], correctAnswer: 'the foundation for office, IT, data and further training' },
    { text: 'The best next step after this course is…', options: ['stop learning', 'keep practicing typing and take the next courses (Word, Excel, PowerPoint)', 'delete your computer', 'memorize shortcuts only'], correctAnswer: 'keep practicing typing and take the next courses (Word, Excel, PowerPoint)' },
  ],
};
