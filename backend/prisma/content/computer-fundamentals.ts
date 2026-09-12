/**
 * Computer Fundamentals — Start from Zero — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in computer-fundamentals_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · How Computers Work ──────────────────────────────────────────────
  {
    week: 1,
    title: 'How Computers Work',
    description: 'The parts of a computer, how it stores information, and the software that runs it — in plain language.',
    topics: [
      {
        title: 'The Main Parts of a Computer',
        text: 'Every computer — desktop, laptop, phone — has the same core parts. The System Unit (or case) holds the brain and memory. Inside: the processor (CPU, the "brain" that does the calculations), RAM (short-term memory for work in progress), and the storage drive (long-term memory for files).\n\nInput devices bring information in: keyboard, mouse, touchpad, microphone. Output devices show it out: monitor, speakers, printer.\n\nThink of it like a kitchen: the CPU is the cook, RAM is the counter space you cook on, the storage drive is the pantry, the keyboard/mouse are the shopping list, and the monitor is the finished plate.',
        note: 'RAM forgets everything when the power goes off; storage remembers. That is why you must save your work before shutting down.',
      },
      {
        title: 'How Data Is Stored: Bits, Files & Folders',
        text: 'Everything a computer holds — text, photos, music, video — is stored as numbers in binary (0s and 1s). A single 0 or 1 is a bit; 8 bits make a byte; roughly a thousand bytes are a kilobyte (KB); a million a megabyte (MB); a billion a gigabyte (GB).\n\nA file is a named unit of stored information (a document, a photo, a video), and a folder is a container that groups files together. Files have names with extensions (.docx, .jpg, .mp4) that tell the computer which app opens them.\n\nFolders inside folders form a tree. Understanding "file → folder → drive" is the foundation of finding anything on a computer.',
        note: 'Extensions matter: .docx opens in Word, .pdf in a viewer, .jpg is an image. Never hide file extensions if you are learning.',
      },
      {
        title: 'Software & the Operating System',
        text: 'Hardware is the physical machine; software is the instructions that tell it what to do. The Operating System (OS) is the master program that runs the whole computer — Windows, macOS, Linux on computers, Android/iOS on phones.\n\nThe OS manages everything behind the scenes: starting the computer (booting), showing the desktop, opening programs, managing files, and connecting the internet.\n\nApplications (apps) are the programs you use for work: Word, Excel, Chrome, a photo editor. The OS provides the platform; apps provide the functions. Everything you click is either an app or part of the OS.',
        note: 'Updates to the OS and apps are not optional niceties — they patch security holes. Install them when prompted.',
      },
      {
        title: 'Peripherals & Connections',
        text: 'Peripherals are the devices connected to the computer: printers, scanners, external drives, webcams, speakers. Most connect by USB (the rectangle/oval port) or wirelessly over Bluetooth.\n\nPorts to know: USB (most devices), HDMI/VGA (monitor/TV), audio jack (headphones), Ethernet (wired internet), and the power connector.\n\nWireless connections: Wi-Fi (internet), Bluetooth (short-range device links like headphones or a mouse). When a device "doesn\'t work", check the physical connection first — cable plugged in, device powered on, then the driver status.',
        note: 'Plug and Play usually works, but when a device misbehaves: reconnect it, restart the computer, then look up the driver.',
      },
    ],
    quizzes: [
      { text: 'RAM is best compared to…', options: ['the pantry', 'the cook\'s counter space — it forgets on power-off', 'the finished plate', 'the shopping list'], correctAnswer: 'the cook\'s counter space — it forgets on power-off' },
      { text: 'A gigabyte is approximately…', options: ['a thousand bytes', 'a billion bytes', 'a million bytes', 'a single byte'], correctAnswer: 'a billion bytes' },
      { text: 'The master program that runs the whole computer is the…', options: ['web browser', 'operating system', 'printer driver', 'file extension'], correctAnswer: 'operating system' },
      { text: 'Bluetooth is used for…', options: ['wired internet', 'short-range wireless device connections', 'printing only', 'charging'], correctAnswer: 'short-range wireless device connections' },
    ],
  },

  // ── W2 · Windows & Files ─────────────────────────────────────────────────
  {
    week: 2,
    title: 'Windows & File Management',
    description: 'The desktop, windows and the file system — organizing your work so you can always find it.',
    topics: [
      {
        title: 'The Desktop, Windows & Taskbar',
        text: 'The Desktop is your main screen: shortcuts to programs, the wallpaper, and the Taskbar at the bottom with the Start button, pinned apps, and the system tray (clock, volume, network).\n\nEvery program opens inside a window with three buttons at top-right: Minimize (hide to taskbar), Maximize (fill screen) and Close (X). Drag the title bar to move a window; Alt+Tab switches between open windows.\n\nThe Start menu (Windows key) is where you launch programs and search. Clicking an app in the taskbar switches to it; clicking its icon again minimizes it.',
        note: 'Windows key + type the app name is the fastest way to open anything — no hunting through menus.',
      },
      {
        title: 'Files, Folders & File Explorer',
        text: 'File Explorer (folder icon on the taskbar, or Windows+E) is where all files live. The left pane shows shortcuts: This PC (your drives), Quick Access (frequent folders), Downloads, Documents, Pictures.\n\nCreate a folder with right-click → New → Folder, or Ctrl+Shift+N. Copy a file with Ctrl+C then Ctrl+V; move it with Ctrl+X then Ctrl+V; rename with F2; delete with Delete (goes to Recycle Bin — recoverable).\n\nA file has an address, like C:\\Users\\YourName\\Documents\\Resume.docx — the path tells you which drive, folder, sub-folder holds it.',
        note: 'The three commands that organize your whole digital life: Copy, Cut, Paste. Master Ctrl+C, Ctrl+X, Ctrl+V.',
      },
      {
        title: 'Managing Files: Organize, Search & Back Up',
        text: 'A tidy system: use Documents for documents, Pictures for photos, and create named project folders ("Projects\\2025\\Invoice"). Name files so you know them in a year — "Invoice_Feb_Kunal.xlsx", not "New Document 4".\n\nSearch: press the Windows key and type any file name or word — Windows searches everything. In File Explorer, the search box in the top-right filters the current folder.\n\nBack up the important stuff — photos, documents, work files — to an external drive or cloud (OneDrive, Google Drive). The rule: if it\'s not in two places, it doesn\'t exist.',
        note: 'The backup rule is the most important rule in computing: two copies, one off-device. A dead hard drive does not negotiate.',
      },
      {
        title: 'The Keyboard & Typing Basics',
        text: 'The keyboard layout: letters and numbers center, Enter to confirm, Space for space, Backspace deletes backward, Delete forward, Shift for capitals, Ctrl for shortcuts, Esc to cancel.\n\nKey combinations everyone should know: Ctrl+S save, Ctrl+P print, Ctrl+Z undo, Ctrl+F find, Alt+Tab switch apps, Windows+D show desktop.\n\nTyping: sit straight, keep wrists floating, and use all ten fingers. Home-row fingers (ASDF JKL;) let you touch-type without looking. Start slow and correct — speed follows accuracy.',
        note: 'Learning to touch-type is a one-time month of effort that pays back every day you use a computer for the rest of your career.',
      },
    ],
    quizzes: [
      { text: 'Alt+Tab is used to…', options: ['close windows', 'switch between open windows', 'open the Start menu', 'save files'], correctAnswer: 'switch between open windows' },
      { text: 'Ctrl+X then Ctrl+V…', options: ['copies and pastes', 'cuts (moves) and pastes', 'deletes forever', 'renames'], correctAnswer: 'cuts (moves) and pastes' },
      { text: 'The path C:\\Users\\Name\\Documents\\Resume.docx shows…', options: ['the file\'s address: drive, folders and name', 'the file size', 'the file color', 'the printer'], correctAnswer: 'the file\'s address: drive, folders and name' },
      { text: 'The backup rule says…', options: ['one copy is enough', 'keep two copies, one off-device', 'back up only photos', 'never back up'], correctAnswer: 'keep two copies, one off-device' },
    ],
  },

  // ── W3 · The Internet ────────────────────────────────────────────────────
  {
    week: 3,
    title: 'The Internet',
    description: 'Browsing, searching and email — the everyday skills, done well and safely.',
    topics: [
      {
        title: 'The Web & Web Browsers',
        text: 'The internet is the global network connecting billions of computers. The World Wide Web is the part you see in a browser — Chrome, Edge, Firefox, Safari — made of pages linked together.\n\nEvery page has a web address (URL): https://example.com. The address bar is where you type it. Use bookmarks (Ctrl+D) to keep favorite pages, and the history (Ctrl+H) to find pages you visited.\n\nBrowser tabs let you open several pages at once — middle-click or Ctrl+T for a new tab, Ctrl+W to close. Refresh (F5) reloads a page; the padlock icon in the address bar shows the connection is secure.',
        note: 'Look for the padlock (https) before entering passwords or payment details. It means the connection is encrypted.',
      },
      {
        title: 'Searching Effectively',
        text: 'A search engine (Google, Bing) finds pages by keyword. Type the thing you want plus what you want to know: "weather in Delhi" beats "weather".\n\nSearch tricks: put phrases in quotes for exact matches, use "-" to exclude ("jaguar -car"), and add site: to search one site ("govt exam site:gov.in"). Use specific, natural-language questions.\n\nEvaluate results: prefer official/government/.edu sources, check the date, and compare two or three results. The first result is an ad more often than you think — the "Ad" label marks it.',
        note: 'Search is a skill, not a reflex. The quality of your questions decides the quality of your answers.',
      },
      {
        title: 'Email Basics: Reading, Writing & Attachments',
        text: 'Email (Gmail, Outlook) lets you send written messages with attachments. A message has: To (recipient address), Subject (the topic line), and the body (your message). Always write a subject — it tells the reader what the mail is about.\n\nAttach files with the paperclip icon. Be careful with large attachments; use a link for huge files. CC copies others, BCC hides recipients from each other.\n\nEmail etiquette: clear subject, greeting, short paragraphs, a sign-off. Reply within a reasonable time, reply-all only when everyone needs it, and never send anything in anger — emails are permanent.',
        note: 'An email with no subject and no greeting is how inboxes drown. Subject, greeting, message, sign-off — four parts, every time.',
      },
      {
        title: 'Using Online Services: Forms, Accounts & Payments',
        text: 'Modern life runs on online services: booking tickets, banking, government portals, shopping, and learning platforms like this one. Each needs an account — an email plus a password.\n\nWhen filling forms: read before clicking, keep your real details private unless needed, and double-check amounts before paying.\n\nFor payments: prefer official apps/UPI over typing card details on random sites; check the padlock; and keep payment confirmations as screenshots or emails. Know the difference between a legitimate OTP prompt and a scam (covered in Week 4).',
        note: 'A minute of reading before you click saves hours of fixing mistakes. Pause, read, then submit.',
      },
    ],
    quizzes: [
      { text: 'The padlock icon in the address bar means…', options: ['the page is free', 'the connection is secure (encrypted)', 'the site is popular', 'the page is cached'], correctAnswer: 'the connection is secure (encrypted)' },
      { text: 'To search only one website, add…', options: ['site:domain to the query', '!bang to the query', 'https to the query', 'nothing'], correctAnswer: 'site:domain to the query' },
      { text: 'An email without a subject…', options: ['is faster to send', 'tells the reader nothing — always write a subject', 'is automatically deleted', 'cannot be sent'], correctAnswer: 'tells the reader nothing — always write a subject' },
      { text: 'The padlock check matters most when…', options: ['reading news', 'entering passwords or payment details', 'watching videos', 'checking the time'], correctAnswer: 'entering passwords or payment details' },
    ],
  },

  // ── W4 · Online Safety ───────────────────────────────────────────────────
  {
    week: 4,
    title: 'Online Safety',
    description: 'Passwords, scams, malware and privacy — protecting your money, identity and peace of mind.',
    topics: [
      {
        title: 'Strong Passwords & Accounts',
        text: 'A strong password is long (12+ characters) and not a guessable word. Use a passphrase — four random words ("coffee!train-mango42") are stronger and easier to remember than "P@ssw0rd1".\n\nOne password per account. When one site leaks, attackers try that password everywhere — this is "credential stuffing". A password manager (free ones exist) stores unique passwords for you.\n\nTwo-factor authentication (2FA) — an extra code from your phone or app after the password — blocks attackers even if the password leaks. Turn it on for email and banking first.',
        note: 'Your email password is the master key to your whole digital life — it resets every other account. Protect it first.',
      },
      {
        title: 'Scams, Phishing & Suspicious Links',
        text: 'Phishing is a fake message pretending to be a bank, a company or a government, trying to steal your password or money. The message creates urgency: "your account is suspended", "claim your prize", "urgent payment".\n\nRed flags: unusual sender address (bank@secure-mail-rq72.com, not the real bank), a link that doesn\'t match the company\'s real domain, spelling mistakes, threats, and demands to act NOW.\n\nIf a message panics you: don\'t click. Open the real website yourself in a new tab and check, or call the official number. Legitimate companies never ask for your OTP or password.',
        note: 'The panic is the attack. Any message that pressures you to act immediately is trying to skip your judgment.',
      },
      {
        title: 'Malware, Antivirus & Safe Downloads',
        text: 'Malware (malicious software) includes viruses, ransomware (locks your files, demands money), spyware and trojans. It usually arrives by email attachment, fake downloads, or infected USB drives.\n\nDefenses: keep Windows and apps updated, keep a good antivirus (Windows Defender is built in) enabled and updated, and download software only from official websites.\n\nRed flags: "free" versions of paid software, "cracked" apps, pop-ups claiming your computer is infected. When in doubt, don\'t download. A backup (from Week 2) is your strongest protection against ransomware.',
        note: 'The best antivirus is your own judgment: official sites only, no cracked software, updates on.',
      },
      {
        title: 'Privacy & Identity Protection',
        text: 'Personal data is valuable. Guard your full name, address, phone, Aadhaar/PAN, bank details and photos. Share the minimum a site needs — a site asking your date of birth for a quiz does not need it.\n\nSocial media: set profiles to private, be careful what you post publicly (scammers mine public info), and never post tickets/boarding passes with visible barcodes.\n\nImpersonation: someone could use your photo and name to create fake accounts. Google yourself occasionally, and if someone asks for money "from a friend\'s new number", verify by calling the real number.',
        note: 'Oversharing once is permanent — the internet remembers. Post as if your employer and your future self are watching.',
      },
    ],
    quizzes: [
      { text: 'The strongest password from these is…', options: ['Password123', 'coffee!train-mango42 (a passphrase)', '12345678', 'your name'], correctAnswer: 'coffee!train-mango42 (a passphrase)' },
      { text: 'Two-factor authentication adds…', options: ['a second password of the same kind', 'an extra verification step beyond the password', 'a longer password', 'a browser extension'], correctAnswer: 'an extra verification step beyond the password' },
      { text: 'A phishing email usually creates…', options: ['a calm request', 'urgency and fear ("account suspended")', 'a funny joke', 'a friendly chat'], correctAnswer: 'urgency and fear ("account suspended")' },
      { text: 'The strongest protection against ransomware is…', options: ['a second antivirus', 'a good backup', 'a firewall', 'private browsing'], correctAnswer: 'a good backup' },
    ],
  },

  // ── W5 · Productivity & Troubleshooting ──────────────────────────────────
  {
    week: 5,
    title: 'Productivity & Troubleshooting',
    description: 'Working productively, solving everyday computer problems, and taking the next step.',
    topics: [
      {
        title: 'Productivity Apps: Documents, Sheets & More',
        text: 'The office trio: a word processor (Word / Google Docs) for letters and documents, a spreadsheet (Excel / Google Sheets) for numbers and tables, and presentation software (PowerPoint) for slides.\n\nFree alternatives that work the same: LibreOffice, Google Docs/Sheets/Slides. The skills transfer — if you know Word, Google Docs is a small adjustment.\n\nOther everyday apps: a browser, email client, PDF viewer, photo viewer, calculator, and notepad. You rarely need more. Learn one tool from each category well, and the category is open.',
        note: 'The tool changes, the skill doesn\'t. Mastering Word teaches you Google Docs; mastering Excel teaches you Sheets.',
      },
      {
        title: 'Keyboard Shortcuts & Speed Habits',
        text: 'The shortcuts that repay their learning: Ctrl+C/V/X (copy/paste/cut), Ctrl+S (save — press it constantly), Ctrl+Z/Y (undo/redo), Ctrl+A (select all), Ctrl+F (find), Ctrl+P (print), Windows+D (desktop), Windows+L (lock), Alt+Tab (switch apps).\n\nSpeed habits: keep files organized so you never search for 10 minutes; use Quick Access for frequent folders; save with meaningful names; close apps you\'re not using.\n\nType with all fingers, use the Start-menu search instead of menus, and learn two new shortcuts a week — they compound.',
        note: 'Ctrl+S is the most valuable shortcut in computing. Save after every meaningful change; saving is free.',
      },
      {
        title: 'Common Problems & Simple Fixes',
        text: 'The troubleshooting ladder: (1) Restart the computer — it fixes more than people expect. (2) Check the connection — cable, Wi-Fi, power. (3) Check the obvious — is the monitor on? is the device muted? (4) Update — drivers and software. (5) Search the exact error message online.\n\n"Computer is slow": close unused programs (Ctrl+Shift+Esc opens Task Manager — see what uses memory/CPU), check for updates, restart, free disk space.\n\n"No internet": check Wi-Fi is on, restart the router (unplug 30 seconds), and see if the problem is one device or everything. Write down error messages — they are the clue.',
        note: 'Read the error message before searching. Copy the exact wording into a search and someone else has usually fixed it.',
      },
      {
        title: 'Digital Citizenship & Your Next Steps',
        text: 'Being a good digital citizen: treat people online with the respect you would in person, respect copyright (don\'t pirate software or content), and report harmful content instead of sharing it.\n\nDigital literacy is a skill you now have: you understand how computers work, manage files, browse safely, protect yourself, and troubleshoot. That is the foundation for any job — office work, IT, data entry, further training.\n\nNext steps: practice typing daily, keep exploring the apps in this course, take the next courses (MS Word, MS Excel, MS PowerPoint), and always keep learning — the tools change, the fundamentals don\'t.',
        note: 'You started from zero; you now run the machine instead of fearing it. That confidence is the real certificate.',
      },
    ],
    quizzes: [
      { text: 'The Microsoft office trio is…', options: ['Word, Excel, PowerPoint', 'Chrome, Edge, Firefox', 'Photos, Music, Videos', 'Email, Chat, Files'], correctAnswer: 'Word, Excel, PowerPoint' },
      { text: 'The most valuable shortcut is…', options: ['Ctrl+S (save)', 'Ctrl+F5', 'Alt+Tab', 'Windows+L'], correctAnswer: 'Ctrl+S (save)' },
      { text: 'The first step of the troubleshooting ladder is…', options: ['reinstall Windows', 'restart the computer', 'buy a new computer', 'call for help'], correctAnswer: 'restart the computer' },
      { text: 'Digital citizenship means…', options: ['only using official websites', 'respecting others and copyright online', 'never posting anything', 'sharing everything'], correctAnswer: 'respecting others and copyright online' },
    ],
  },
];
