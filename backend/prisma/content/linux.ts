/**
 * Linux Essentials — Terminal to Administration — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in linux_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Getting Started with Linux ──────────────────────────────────────
  {
    week: 1,
    title: 'Getting Started with Linux',
    description: 'What Linux is, how to install it, and your first commands in the terminal.',
    topics: [
      {
        title: 'What Linux Is & Choosing a Distribution',
        text: 'Linux is a free, open-source operating system kernel. Around it, distributions (distros) assemble a complete OS: kernel + GNU tools + package manager + desktop. Ubuntu and Linux Mint suit beginners; Debian is the stable base; Fedora ships newer software; Arch gives total control.\n\nWhy Linux matters: it runs most of the internet\'s servers, nearly all cloud infrastructure, Android phones, and embedded devices. Knowing the terminal transfers to every one of those worlds.\n\nPick a beginner distro, install it on a spare machine or in a virtual machine, and use it daily. The distro is a starting point, not a religion — skills transfer.',
        code: '// Common distros at a glance\nUbuntu      → beginner-friendly, huge community\nLinux Mint  → Ubuntu base, familiar desktop\nDebian      → rock-solid, server favourite\nFedora      → modern, Red Hat family\nArch        → DIY, maximum control\n\n// Find out what you are running\ncat /etc/os-release',
        note: 'Distros share the same commands — the skills you learn on Ubuntu apply on Debian, Fedora and beyond.',
      },
      {
        title: 'The Terminal & Your First Commands',
        text: 'The terminal is where you talk to Linux. You type a command, it prints output. The prompt shows user@host:directory$. Commands follow: command options arguments.\n\nStart with the essentials: pwd prints the working directory, ls lists files, whoami shows your user, date shows the time, echo prints text. Add options like ls -l (long format) and ls -a (all files, including hidden dotfiles).\n\nYou don\'t need to memorize everything — tab-completion finishes names, the up arrow recalls history, and man pages explain any command.',
        code: '$ whoami\navi\n$ pwd\n/home/avi\n$ ls -la\ndrwxr-xr-x  3 avi avi  4096 Aug 16 12:00 .\ndrwxr-xr-x 20 avi avi  4096 Aug 16 11:00 ..\n-rw-r--r--  1 avi avi  220  Aug 16 12:01 notes.txt\n\n$ echo "hello from the terminal"\nhello from the terminal',
        note: 'Try each command as you read. Muscle memory comes from typing, not reading.',
      },
      {
        title: 'The Linux Filesystem',
        text: 'Linux arranges everything under one root / — no drive letters. Key directories: /home (user files), /etc (system config), /var (logs and data), /usr (software), /tmp (temporary files), /bin and /sbin (programs).\n\nThe path is always absolute or relative: /home/avi/notes.txt is absolute (starts at /); notes.txt or ../avi/notes.txt is relative to your current directory. . means the current directory, .. the parent.\n\nYour home directory is your castle: create projects under ~/Projects, keep scripts in ~/bin, and leave system directories alone unless you know what you\'re doing.',
        code: '/                  root of everything\n├── home/avi/      your files\n├── etc/           system configuration\n├── var/log/       logs\n├── usr/           installed software\n├── tmp/           temporary files\n\n// Shortcuts\n~      your home directory\n.      current directory\n..     parent directory',
        note: 'Everything is a file under one root. Get comfortable with the tree before you move files around.',
      },
      {
        title: 'Getting Help: man, help & --help',
        text: 'Every command documents itself. man <command> opens the full manual (press q to quit, / to search). Most commands also answer <command> --help with a quick summary. help <builtin> covers shell builtins like cd.\n\nMan pages are dense but structured: NAME, SYNOPSIS (usage), DESCRIPTION, OPTIONS, EXAMPLES. Read the SYNOPSIS and EXAMPLES first — they teach 80% of a tool.\n\nPractice: man ls, man grep, man bash. You will not remember everything; you will remember where to look.',
        code: '$ man ls\nLS(1)                                   User Commands\nNAME\n       ls - list directory contents\nSYNOPSIS\n       ls [OPTION]... [FILE]...\nOPTIONS\n       -l  use a long listing format\n       -a  do not ignore entries starting with .\n       -h  with -l, print sizes in human readable form\n\n// Quick check\n$ ls --help | head -5',
        note: 'The manual is the source of truth. When you forget a flag, man is the answer — not a web search.',
      },
    ],
    quizzes: [
      { text: 'Linux is strictly…', options: ['a kernel; distros assemble the full OS around it', 'a Windows program', 'a web browser', 'a programming language'], correctAnswer: 'a kernel; distros assemble the full OS around it' },
      { text: 'The command that prints your current directory is…', options: ['pwd', 'ls', 'whoami', 'cd'], correctAnswer: 'pwd' },
      { text: 'The Linux filesystem…', options: ['starts at / with no drive letters', 'uses C: and D: drives', 'is one big file', 'has no paths'], correctAnswer: 'starts at / with no drive letters' },
      { text: 'The full manual for a command opens with…', options: ['man <command>', 'help <command> only', 'ls <command>', 'info all'], correctAnswer: 'man <command>' },
    ],
  },

  // ── W2 · The Filesystem & Files ──────────────────────────────────────────
  {
    week: 2,
    title: 'The Filesystem & Files',
    description: 'Move around, create and edit files, inspect content and understand file metadata.',
    topics: [
      {
        title: 'Navigating & Creating Directories',
        text: 'cd changes directory, mkdir creates one (-p creates parents too), rmdir removes an empty one. A tidy structure makes everything else easier.\n\nGood habits: mkdir -p projects/web-app/src creates the whole path at once; cd ~ returns home; cd - returns to your previous directory.\n\nNever create junk at the top of your home directory. Create ~/Projects, ~/Documents, ~/Downloads and keep discipline from day one.',
        code: '$ cd ~/Projects\n$ mkdir -p web-app/src web-app/tests\n$ ls web-app\nsrc  tests\n\n$ cd web-app/src\n$ pwd\n/home/avi/Projects/web-app/src\n\n// Quick tips\ncd -    → previous directory\ncd ~    → home\ntree    → visual directory tree (install if missing)',
        note: 'One structure rule: keep projects in folders, and use -p when creating paths. Future-you will thank you.',
      },
      {
        title: 'Creating, Copying, Moving & Deleting Files',
        text: 'touch creates an empty file or updates its timestamp. cp copies, mv moves or renames, rm deletes (irreversibly). Cat is for viewing short files; cat > file redirects keyboard input into a file.\n\nThe dangerous one is rm — there is no recycle bin. rm -rf deletes a directory and everything inside with no recovery. Always double-check the path before hitting enter.\n\nBest practice: think "what does this command touch?" before running destructive commands. When in doubt, use mv to a trash folder instead of rm.',
        code: '$ touch draft.txt                  # create empty file\n$ cp draft.txt draft-backup.txt   # copy\n$ mv draft-backup.txt backup/     # move into a folder\n$ mv backup/draft-backup.txt renamed.txt   # rename\n$ rm renamed.txt                  # delete (no undo!)\n\n// Careful with:\nrm -rf some/directory    # deletes the directory AND everything inside',
        note: 'Copy and move are reversible in the sense you still have the file; rm is final. Slow down around rm.',
      },
      {
        title: 'Viewing Files: cat, less, head, tail',
        text: 'cat dumps a whole file to the screen — fine for short files. For anything longer, less opens a pager: scroll with arrows/PageUp/PageDown, search with /, quit with q. head -n 5 shows the first lines, tail -n 10 the last, and tail -f follows a growing file — perfect for watching logs.\n\nChoose the right tool: configuration files → cat or less; a 2GB log → tail and grep, never cat. The habit of reaching for tail -f when investigating logs will save you hours.',
        code: '$ less /etc/hostname\n$ head -n 3 /etc/os-release\n$ tail -n 20 /var/log/syslog\n\n// Watch a log live (Ctrl+C to stop)\n$ tail -f /var/log/syslog',
        note: 'cat for short files, less for long ones, tail -f to watch logs. Never cat a huge file into the terminal.',
      },
      {
        title: 'File Metadata, Permissions & Links',
        text: 'ls -l reveals the full story: type, permissions, link count, owner, group, size, date, name. The permission string drwxr-xr-x means: d (directory), rwx for owner (read/write/execute), r-x for group, r-x for others.\n\nchmod changes permissions with symbolic (chmod u+x script.sh) or octal (chmod 755) syntax. chown changes owner. Every script needs the execute bit: chmod +x script.sh.\n\nLinks: ln file hardlink creates a second name for the same data; ln -s file symlink creates a shortcut. Symlinks are what you\'ll use 99% of the time.',
        code: '$ ls -l script.sh\n-rwxr-xr-x 1 avi avi 250 Aug 16 12:00 script.sh\n\n// Add execute permission for the owner\n$ chmod u+x script.sh\n\n// Symbolic link\n$ ln -s /var/log/syslog syslog-link\n$ ls -l syslog-link\nlrwxrwxrwx ... syslog-link -> /var/log/syslog',
        note: 'The permission string is the first line of defence on every file. Learn to read it like a sentence.',
      },
    ],
    quizzes: [
      { text: 'mkdir -p creates…', options: ['parent directories too', 'a partition', 'a symlink', 'a compressed file'], correctAnswer: 'parent directories too' },
      { text: 'rm is dangerous because…', options: ['there is no recycle bin — deletion is final', 'it is slow', 'it needs a password', 'it is a GUI tool'], correctAnswer: 'there is no recycle bin — deletion is final' },
      { text: 'To watch a growing log file live you use…', options: ['tail -f file', 'cat file', 'head -n 1000 file', 'mv file'], correctAnswer: 'tail -f file' },
      { text: 'To make a script executable you run…', options: ['chmod +x script.sh', 'exec script.sh', 'chown script.sh', 'touch script.sh'], correctAnswer: 'chmod +x script.sh' },
    ],
  },

  // ── W3 · Text, Pipes & Redirection ───────────────────────────────────────
  {
    week: 3,
    title: 'Text, Pipes & Redirection',
    description: 'The Unix philosophy: small tools that chain together to process text and data.',
    topics: [
      {
        title: 'grep — Searching Inside Files',
        text: 'grep finds lines matching a pattern: grep "error" log.txt shows only lines containing error. Add -i for case-insensitive, -n for line numbers, -r to search a whole directory tree, -c to count matches.\n\nThis is the single most used command in daily Linux work. "Where is this setting?" → grep -r "setting" /etc. "Which process crashed?" → grep -i "fail" *.log.\n\nRegex extends grep\'s power: grep "^2026-" dates.log matches lines starting with a year; grep "500$" finds lines ending in 500.',
        code: '$ grep "error" server.log\n12:04:01 [error] DB connection refused\n12:05:10 [error] retry 2 failed\n\n$ grep -in "timeout" server.log | head -3\n12:04:02 [warn] connection timeout\n\n// Search a whole directory\n$ grep -r "listen 80" /etc/nginx/',
        note: 'grep -r across config directories is how you find settings without opening every file.',
      },
      {
        title: 'Pipes — Chaining Commands Together',
        text: 'The pipe | takes the output of one command and feeds it as input to the next. It\'s the heart of the Unix philosophy: small tools, each doing one thing well, connected by pipes.\n\nThe pattern is endless: ls -la | grep "^d" lists only directories; ps aux | grep nginx finds a process; history | grep ssh finds past ssh commands; cat file | sort | uniq -c | sort -rn ranks repeated words.\n\nThink in stages: each stage filters or transforms, and you can insert a stage anywhere. Keep the pipeline readable — if a pipe gets too long, split it.',
        code: '// Directories only\n$ ls -la | grep "^d"\ndrwxr-xr-x 4 avi avi 4096 ...\n\n// Find a process\n$ ps aux | grep nginx\navi  12345  0.0  0.1  ... nginx: master\n\n// Rank the most common words in a file\n$ cat words.txt | tr " " "\\n" | sort | uniq -c | sort -rn | head -5',
        note: 'When you need data transformed, compose it from small commands rather than writing a program.',
      },
      {
        title: 'Redirection — >, >>, 2>, <',
        text: 'Redirection sends output to files instead of the screen. command > file overwrites, command >> file appends, 2> captures errors, < reads input from a file. Standard streams: stdout (1, normal output), stderr (2, errors), stdin (0, input).\n\nCombine redirects and pipes: myscript.sh 2> errors.log | grep "ok" — errors go to a log, stdout gets filtered.\n\nThe gotcha: > overwrites silently. Append with >> when the file matters, and never redirect over a file you can\'t afford to lose.',
        code: '$ ls > listing.txt          # save output\n$ ls >> listing.txt        # append\n$ ./deploy.sh 2> deploy-errors.log   # errors to a file\n$ sort < unsorted.txt      # read from a file\n\n// Combine: keep errors, pipe the rest\n$ ./build.sh 2> build.log | grep -i warning',
        note: 'Remember > overwrites. When in doubt, use >> or check the file first.',
      },
      {
        title: 'Text Tools: sort, uniq, cut, wc, tr, awk & sed',
        text: 'The Swiss army knife set: wc -l counts lines; sort orders lines; uniq collapses duplicates (usually after sort); cut -d"," -f2 extracts a column; tr translates characters; awk prints fields and does arithmetic; sed transforms text line by line.\n\nMaster these three as a foundation: sort, cut, awk. awk \'{print $1}\' prints the first whitespace-separated field of each line — the workhorse of log analysis.\n\nsed has two everyday uses: s/old/new/g replaces text, and d deletes lines. sed -i edits a file in place — powerful, so test without -i first.',
        code: '$ wc -l server.log\n4200 server.log\n\n$ cut -d: -f1 /etc/passwd | head -3\nroot\ndaemon\navi\n\n$ awk "{print \$2}" sales.txt | sort | uniq -c\n  12 laptop\n  30 phone\n\n$ sed -i "s/http:/https:/g" config.yml   # in-place replace',
        note: 'Learn sort, cut and awk cold — log analysis and data crunching in the terminal all reduce to these.',
      },
    ],
    quizzes: [
      { text: 'grep is used to…', options: ['search for matching lines in files', 'edit files', 'create files', 'delete files'], correctAnswer: 'search for matching lines in files' },
      { text: 'The pipe |…', options: ['feeds one command\'s output into the next command', 'redirects to a file', 'runs commands in parallel', 'quits a program'], correctAnswer: 'feeds one command\'s output into the next command' },
      { text: 'To append output to a file instead of overwriting, use…', options: ['>>', '>', '<', '2>'], correctAnswer: '>>' },
      { text: 'The command that counts lines is…', options: ['wc -l', 'grep -c', 'head -n 1', 'sort -n'], correctAnswer: 'wc -l' },
    ],
  },

  // ── W4 · Users, Permissions & Processes ──────────────────────────────────
  {
    week: 4,
    title: 'Users, Permissions & Processes',
    description: 'Identity, access control, running programs, packages and services.',
    topics: [
      {
        title: 'Users, Groups & sudo',
        text: 'Linux is multi-user: every action runs as some user. You have a user (your daily identity), groups (sets of permissions), and root (the all-powerful administrator account). sudo lets an allowed user run one command as root.\n\nUser management: useradd creates users, passwd sets passwords, usermod -aG group user adds a user to a group, groups shows your memberships.\n\nsudo discipline: run the least privilege needed, only for the single command that requires it. Avoid logging in as root or staying in a root shell.',
        code: '$ whoami\navi\n\n$ groups\navi sudo\n\n$ sudo apt update          # one elevated command\n\n// Admin tasks\nsudo useradd -m sarah\nsudo passwd sarah\nsudo usermod -aG sudo sarah   # grant admin access\n$ id\nuid=1000(avi) gid=1000(avi) groups=1000(avi),27(sudo)',
        note: 'sudo = elevation for a single command, not a lifestyle. Least privilege, always.',
      },
      {
        title: 'File Permissions & chmod in Depth',
        text: 'Every file has an owner and a group, and three permission sets: owner, group, others — each with read (4), write (2), execute (1). Octal mode sums them: 7=rwx, 6=rw, 5=rx, 4=r. 755 = owner rwx, group rx, others rx — the standard for scripts and executables. 644 = owner rw, others r — standard for documents.\n\nSymbolic mode is friendlier: chmod u+x adds execute to owner, chmod o-rw removes read/write from others, chmod -R g+r fixes a whole tree.\n\nThe rule of thumb: directories need execute to be traversable, files need read to be viewable, programs need both read and execute.',
        code: '// Octal     Owner  Group  Others\n// 644   →  rw-    r--    r--   (documents)\n// 755   →  rwx    r-x    r-x   (scripts/programs)\n// 600   →  rw-    ---    ---   (secrets)\n\n$ chmod 600 ~/.ssh/id_ed25519    # private key: owner only\n$ chmod 755 scripts/deploy.sh\n\n// Symbolic\n$ chmod u+x scripts/deploy.sh\n$ chmod -R g+r shared-folder/',
        note: '600 for secrets, 755 for programs, 644 for documents. These three cover most of real life.',
      },
      {
        title: 'Processes & System Monitoring',
        text: 'A process is a running program. ps shows processes; ps aux shows all with CPU/memory; top (or htop) shows a live view sorted by usage. PID is the process id — you\'ll use it with kill.\n\nManaging: kill <pid> sends SIGTERM (graceful), kill -9 <pid> forces (last resort), killall name kills by name, and & runs a job in the background while jobs/fg/bg manage background jobs. Ctrl+C sends SIGINT to the foreground process.\n\nFor system health: free -h shows memory, df -h shows disk, uptime shows load. A quick health check is: uptime, free -h, df -h, top — in that order.',
        code: '$ ps aux | grep -v grep | grep python\navi  2033  2.1  0.5  342M  121M ?  S  12:00  0:05 python app.py\n\n$ top\nPID USER  %CPU  %MEM  COMMAND\n2033 avi   2.1   0.5   python\n\n$ kill 2033          # graceful\n$ kill -9 2033       # force (last resort)\n\n// Health quick-check\n$ uptime && free -h | head -2 && df -h | head -5',
        note: 'SIGTERM first, SIGINT via Ctrl+C, and only then kill -9. Graceful shutdowns save data.',
      },
      {
        title: 'Package Managers & Services',
        text: 'Software installs through a package manager: apt on Debian/Ubuntu, dnf on Fedora, pacman on Arch. The workflow: apt update refreshes package lists, apt install <pkg> installs, apt upgrade updates everything, apt remove removes.\n\nServices run in the background via systemd: systemctl start/stop/restart <service>, systemctl enable makes one start at boot, systemctl status shows health. journalctl -u <service> shows its logs.\n\nWhere things live: configs in /etc, logs under /var/log, services defined in /etc/systemd/system. The "service not working" loop is: systemctl status, then journalctl -u, then check config in /etc.',
        code: '$ sudo apt update && sudo apt install htop\n$ sudo apt upgrade\n\n$ sudo systemctl status nginx\n● nginx.service - A high performance web server\n     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)\n     Active: active (running)\n\n$ sudo systemctl restart nginx\n$ journalctl -u nginx -n 20    # last 20 log lines',
        note: 'systemctl status, then journalctl, then the config file. That is the debug loop for any service.',
      },
    ],
    quizzes: [
      { text: 'sudo lets a user…', options: ['run one command as root', 'become root forever', 'edit files', 'install nothing'], correctAnswer: 'run one command as root' },
      { text: 'The octal permission for rw-r--r-- is…', options: ['644', '755', '600', '777'], correctAnswer: '644' },
      { text: 'The graceful termination signal is…', options: ['SIGTERM (kill <pid>)', 'SIGKILL always', 'SIGSTOP', 'SIGPIPE'], correctAnswer: 'SIGTERM (kill <pid>)' },
      { text: 'To make a service start at boot you use…', options: ['systemctl enable <service>', 'systemctl start <service>', 'systemctl status', 'journalctl -u'], correctAnswer: 'systemctl enable <service>' },
    ],
  },

  // ── W5 · Bash Scripting & Administration ─────────────────────────────────
  {
    week: 5,
    title: 'Bash Scripting & Administration',
    description: 'Automate the repetitive work: write your own scripts, add logic, and tie it all together.',
    topics: [
      {
        title: 'Your First Bash Script',
        text: 'A Bash script is a file of commands, run with bash or ./script.sh after chmod +x. The first line, the shebang #!/bin/bash, tells the system which interpreter to run. Good scripts start with set -euo pipefail — stop on errors, reject unset variables, catch pipeline failures.\n\nStart tiny: a script that prints, then a script that backs up, then one that checks disk space. Each script you write once is a task you never type again.\n\nStructure: shebang, a comment explaining the purpose, set -euo pipefail, then the commands. Keep it boring and obvious — scripts are read more than written.',
        code: '#!/bin/bash\n# backup.sh — copy my projects to a backup folder\nset -euo pipefail\n\nBACKUP_DIR="$HOME/backups/$(date +%Y-%m-%d)"\nmkdir -p "$BACKUP_DIR"\ncp -r "$HOME/Projects" "$BACKUP_DIR/"\necho "Backup complete: $BACKUP_DIR"',
        note: 'set -euo pipefail is the safety belt. A script without it can silently keep running after a failure.',
      },
      {
        title: 'Variables, Input & Conditionals',
        text: 'Variables: NAME=value (no spaces around =), read with $NAME. Use read to prompt for input, $1 $2 for arguments, $? for the last command\'s exit status, $$ for the script PID.\n\nConditionals test outcomes: if [ "$NAME" = "avi" ]; then …; elif …; else …; fi. Test operators: -f checks a file exists, -d a directory, -z an empty string, -gt/-lt numeric comparisons.\n\nThe exit-status pattern is everything in Bash: every command returns 0 on success, non-zero on failure. Conditionals and && / || chain on exactly that.',
        code: '#!/bin/bash\nset -euo pipefail\n\nNAME="${1:-world}"          # first arg, default "world"\necho "Hello, $NAME"\n\nif [ -d "/etc/nginx" ]; then\n  echo "nginx config directory exists"\nelse\n  echo "nginx not installed"\nfi\n\n[ "$NAME" = "avi" ] && echo "Welcome back, admin!" || echo "Guest mode"',
        note: 'Everything in Bash reduces to exit statuses. [ ] is literally a command that returns 0 or 1.',
      },
      {
        title: 'Loops & Functions',
        text: 'Loops repeat work: for f in *.log runs a block for each file; while read line reads a file line by line. Functions package reusable logic: greet() { echo "Hi, $1"; } then call greet "Avi".\n\nReal uses: back up every project with a for loop, process every .txt file in a folder, retry a download with a while loop until it succeeds.\n\nKeep functions small and named as actions (backup_projects, check_disk). If a script needs more than two functions, it is growing into a real tool — split files or learn a scripting language.',
        code: '#!/bin/bash\nset -euo pipefail\n\nbackup_one() {\n  cp -r "$1" "$HOME/backups/$(basename "$1")"\n  echo "backed up $1"\n}\n\nfor project in ~/Projects/*; do\n  [ -d "$project" ] && backup_one "$project"\ndone\n\n# process every file in a folder\nfor file in *.txt; do\n  wc -l "$file"\ndone',
        note: 'The for loop over a glob is the most common automation pattern in Bash — learn it cold.',
      },
      {
        title: 'Admin Project: A Server-Style Workflow',
        text: 'Pull it together with a realistic admin task — the workflow you\'d run when adding an app to a Linux server: update packages, create a dedicated user, set permissions, install and start a service, then verify.\n\nThis is the pattern behind every deployment: prepare the OS → create the service user (least privilege) → give it exactly the files it needs → run the service under systemd → check status and logs. Then automate it as a script so the same steps always run identically.\n\nFinish by keeping a runbook: a short README in each project that says how to install, start and verify. Runbooks are what turn "it works on my machine" into "it works on the server".',
        code: '#!/bin/bash\n# deploy-app.sh — safe service-style deploy\nset -euo pipefail\n\nAPP_USER="${1:-app}"\nsudo apt update && sudo apt upgrade -y\nsudo useradd -m -s /bin/bash "$APP_USER" 2>/dev/null || true\nsudo mkdir -p "/opt/$APP_USER/app"\nsudo chown -R "$APP_USER:$APP_USER" "/opt/$APP_USER"\nsudo systemctl restart "$APP_USER" 2>/dev/null || echo "create a systemd unit for $APP_USER"\nsudo systemctl status "$APP_USER" --no-pager || true',
        note: 'A server-style workflow is: prepare → least-privilege user → grant only what is needed → run as a service → verify. Automate it.',
      },
    ],
    quizzes: [
      { text: 'The shebang line at the top of a Bash script is…', options: ['#!/bin/bash', '#start bash', '//bash', '#!/usr/bin/env -bash'], correctAnswer: '#!/bin/bash' },
      { text: 'set -euo pipefail makes a script…', options: ['stop on errors, reject unset variables, catch pipe failures', 'run faster', 'print more', 'skip failures'], correctAnswer: 'stop on errors, reject unset variables, catch pipe failures' },
      { text: 'In Bash, a successful command returns…', options: ['0', '1', '-1', 'anything'], correctAnswer: '0' },
      { text: 'To loop over every file matching a pattern you write…', options: ['for file in *.txt; do …; done', 'loop *.txt', 'while file do', 'for each *.txt'], correctAnswer: 'for file in *.txt; do …; done' },
    ],
  },
];
