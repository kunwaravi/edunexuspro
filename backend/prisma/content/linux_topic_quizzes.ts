/**
 * Linux Essentials — per-topic quizzes. Keyed by the EXACT topic titles in linux.ts
 * (topic-lock flow). 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in linux.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'What Linux Is & Choosing a Distribution': [
    { text: 'The Linux kernel is…', options: ['free and open-source', 'proprietary Microsoft software', 'a web browser', 'a database'], correctAnswer: 'free and open-source' },
    { text: 'A distribution assembles…', options: ['kernel + GNU tools + package manager + desktop', 'only a kernel', 'only a web browser', 'a CPU'], correctAnswer: 'kernel + GNU tools + package manager + desktop' },
    { text: 'A beginner-friendly distro is…', options: ['Ubuntu or Linux Mint', 'Arch with no guide', 'a custom kernel', 'Windows 11'], correctAnswer: 'Ubuntu or Linux Mint' },
    { text: 'Linux runs…', options: ['most internet servers and cloud infrastructure', 'only desktops', 'only phones', 'nothing in production'], correctAnswer: 'most internet servers and cloud infrastructure' },
  ],
  'The Terminal & Your First Commands': [
    { text: 'The command that lists files is…', options: ['ls', 'cd', 'whoami', 'date'], correctAnswer: 'ls' },
    { text: 'The command that prints your username is…', options: ['whoami', 'pwd', 'echo', 'ls'], correctAnswer: 'whoami' },
    { text: 'ls -a shows…', options: ['all files including hidden dotfiles', 'only directories', 'only large files', 'nothing'], correctAnswer: 'all files including hidden dotfiles' },
    { text: 'Tab-completion…', options: ['finishes names for you', 'deletes files', 'runs commands', 'shows help'], correctAnswer: 'finishes names for you' },
  ],
  'The Linux Filesystem': [
    { text: 'Everything in Linux lives under…', options: ['one root /', 'C:/ and D:/', 'the registry', 'the desktop'], correctAnswer: 'one root /' },
    { text: 'The directory holding system configuration is…', options: ['/etc', '/home', '/tmp', '/dev'], correctAnswer: '/etc' },
    { text: 'The shortcut for your home directory is…', options: ['~', '..', '/root', '#'], correctAnswer: '~' },
    { text: '.. refers to…', options: ['the parent directory', 'the current directory', 'the root', 'the home'], correctAnswer: 'the parent directory' },
  ],
  'Getting Help: man, help & --help': [
    { text: 'The full manual for a command is opened with…', options: ['man <command>', '<command> -h', 'help <command>', 'info <command> always'], correctAnswer: 'man <command>' },
    { text: 'To quit a man page you press…', options: ['q', 'Ctrl+C', 'Esc', 'x'], correctAnswer: 'q' },
    { text: 'The fastest summary of a command\'s options is…', options: ['<command> --help', 'man all', 'grep', 'less'], correctAnswer: '<command> --help' },
    { text: 'The two best sections of a man page to read first are…', options: ['SYNOPSIS and EXAMPLES', 'NAME only', 'the copyright', 'the index'], correctAnswer: 'SYNOPSIS and EXAMPLES' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Navigating & Creating Directories': [
    { text: 'cd changes…', options: ['the current directory', 'the files', 'the user', 'the permissions'], correctAnswer: 'the current directory' },
    { text: 'mkdir -p ~/a/b/c creates…', options: ['the whole path a/b/c', 'only c', 'a file', 'a link'], correctAnswer: 'the whole path a/b/c' },
    { text: 'cd - returns…', options: ['to your previous directory', 'to the root', 'to the parent', 'nowhere'], correctAnswer: 'to your previous directory' },
    { text: 'A tidy home directory means…', options: ['projects live in their own folders', 'files pile up at the top level', 'everything is deleted', 'no folders exist'], correctAnswer: 'projects live in their own folders' },
  ],
  'Creating, Copying, Moving & Deleting Files': [
    { text: 'touch creates…', options: ['an empty file or updates its timestamp', 'a directory', 'a symlink', 'a partition'], correctAnswer: 'an empty file or updates its timestamp' },
    { text: 'cp copies and mv…', options: ['moves or renames', 'deletes', 'runs', 'edits'], correctAnswer: 'moves or renames' },
    { text: 'rm -rf is dangerous because…', options: ['it deletes irreversibly, with no recycle bin', 'it needs sudo', 'it is slow', 'it creates junk'], correctAnswer: 'it deletes irreversibly, with no recycle bin' },
    { text: 'The safe habit around destructive commands is…', options: ['double-check the path before pressing enter', 'never read the output', 'use rm -rf everywhere', 'skip backups'], correctAnswer: 'double-check the path before pressing enter' },
  ],
  'Viewing Files: cat, less, head, tail': [
    { text: 'cat is best for…', options: ['short files', 'huge logs', 'live watching', 'editing'], correctAnswer: 'short files' },
    { text: 'less opens…', options: ['a scrollable pager with / search and q to quit', 'the editor vim', 'a browser', 'a PDF'], correctAnswer: 'a scrollable pager with / search and q to quit' },
    { text: 'The first 10 lines of a file are shown with…', options: ['head file', 'tail file', 'cat file', 'less file'], correctAnswer: 'head file' },
    { text: 'To watch a log grow live you use…', options: ['tail -f file', 'head -f file', 'cat file', 'cp file'], correctAnswer: 'tail -f file' },
  ],
  'File Metadata, Permissions & Links': [
    { text: 'The string drwxr-xr-x starts with d meaning…', options: ['it is a directory', 'it is deleted', 'it is a device', 'it is empty'], correctAnswer: 'it is a directory' },
    { text: 'In rwxr-xr-x, the group has…', options: ['r-x (read and execute, no write)', 'rwx', 'r-- only', 'nothing'], correctAnswer: 'r-x (read and execute, no write)' },
    { text: 'chmod changes…', options: ['permissions', 'the owner', 'the file size', 'the filename'], correctAnswer: 'permissions' },
    { text: 'A symbolic link is…', options: ['a shortcut created with ln -s', 'a copy of the data', 'a hard partition', 'a type of script'], correctAnswer: 'a shortcut created with ln -s' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'grep — Searching Inside Files': [
    { text: 'grep "error" log.txt shows…', options: ['only lines containing error', 'all lines', 'the file size', 'an error page'], correctAnswer: 'only lines containing error' },
    { text: 'The -i flag makes grep…', options: ['case-insensitive', 'faster', 'recursive', 'quiet'], correctAnswer: 'case-insensitive' },
    { text: 'To search a whole directory tree you use…', options: ['grep -r', 'grep -i', 'grep -c', 'grep -n'], correctAnswer: 'grep -r' },
    { text: 'grep "500$" matches lines…', options: ['ending in 500', 'starting with 500', 'containing 500 anywhere', 'longer than 500'], correctAnswer: 'ending in 500' },
  ],
  'Pipes — Chaining Commands Together': [
    { text: 'The pipe symbol is…', options: ['|', '>', '&', '~'], correctAnswer: '|' },
    { text: 'A pipe…', options: ['feeds one command\'s output into the next', 'writes to a file', 'runs two commands at once', 'stops a command'], correctAnswer: 'feeds one command\'s output into the next' },
    { text: 'ps aux | grep nginx…', options: ['finds the nginx process', 'installs nginx', 'deletes nginx', 'edits nginx'], correctAnswer: 'finds the nginx process' },
    { text: 'The Unix philosophy is…', options: ['small tools doing one thing well, connected by pipes', 'one giant program for everything', 'no tools at all', 'GUIs only'], correctAnswer: 'small tools doing one thing well, connected by pipes' },
  ],
  'Redirection — >, >>, 2>, <': [
    { text: 'command > file…', options: ['overwrites file with the output', 'appends to file', 'reads file', 'deletes file'], correctAnswer: 'overwrites file with the output' },
    { text: 'To append instead of overwrite you use…', options: ['>>', '>', '<', '2>&1'], correctAnswer: '>>' },
    { text: 'Errors are captured with…', options: ['2> file', '1> file', '< file', '| file'], correctAnswer: '2> file' },
    { text: 'The gotcha with > is that it…', options: ['silently overwrites', 'requires sudo', 'adds a timestamp', 'creates a copy'], correctAnswer: 'silently overwrites' },
  ],
  'Text Tools: sort, uniq, cut, wc, tr, awk & sed': [
    { text: 'wc -l counts…', options: ['lines', 'bytes', 'words', 'processes'], correctAnswer: 'lines' },
    { text: 'sort | uniq -c | sort -rn…', options: ['ranks repeated items by count', 'deletes duplicates', 'reverses text', 'renames files'], correctAnswer: 'ranks repeated items by count' },
    { text: 'awk \'{print $1}\' prints…', options: ['the first whitespace-separated field of each line', 'the whole file', 'line numbers', 'the last field'], correctAnswer: 'the first whitespace-separated field of each line' },
    { text: 'sed s/old/new/g replaces…', options: ['text occurrences in a stream', 'files with new files', 'users', 'permissions'], correctAnswer: 'text occurrences in a stream' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Users, Groups & sudo': [
    { text: 'Linux is multi-user, meaning…', options: ['every action runs as some user', 'only one person can log in', 'users share one identity', 'there is no login'], correctAnswer: 'every action runs as some user' },
    { text: 'sudo lets an allowed user…', options: ['run one command as root', 'become root permanently', 'edit any file', 'change the kernel'], correctAnswer: 'run one command as root' },
    { text: 'usermod -aG sudo sarah…', options: ['adds sarah to the sudo group', 'deletes sarah', 'changes sarah\'s shell', 'locks sarah'], correctAnswer: 'adds sarah to the sudo group' },
    { text: 'The sudo discipline is…', options: ['least privilege for a single command', 'always log in as root', 'never use sudo', 'share passwords'], correctAnswer: 'least privilege for a single command' },
  ],
  'File Permissions & chmod in Depth': [
    { text: 'Octal 644 means…', options: ['owner rw, group r, others r', 'owner rwx, group r-x, others r-x', 'owner rw-, group ---, others ---', 'everything rwx'], correctAnswer: 'owner rw, group r, others r' },
    { text: 'The permission for private keys (~/.ssh) is…', options: ['600', '644', '755', '777'], correctAnswer: '600' },
    { text: 'chmod u+x adds…', options: ['execute for the owner', 'write for others', 'read for group', 'nothing'], correctAnswer: 'execute for the owner' },
    { text: 'Directories need execute permission to…', options: ['be traversed into', 'be read as files', 'be deleted', 'be renamed'], correctAnswer: 'be traversed into' },
  ],
  'Processes & System Monitoring': [
    { text: 'A process is…', options: ['a running program', 'a config file', 'a folder', 'a user'], correctAnswer: 'a running program' },
    { text: 'ps aux shows…', options: ['all processes with CPU and memory', 'only your shell', 'files in the directory', 'services only'], correctAnswer: 'all processes with CPU and memory' },
    { text: 'The graceful way to stop a process is…', options: ['kill <pid> (SIGTERM)', 'kill -9 always', 'Ctrl+Z', 'rm /proc/<pid>'], correctAnswer: 'kill <pid> (SIGTERM)' },
    { text: 'The command that shows free memory is…', options: ['free -h', 'ls -h', 'df -h', 'cat -h'], correctAnswer: 'free -h' },
  ],
  'Package Managers & Services': [
    { text: 'On Debian/Ubuntu the package manager is…', options: ['apt', 'dnf', 'pacman', 'brew'], correctAnswer: 'apt' },
    { text: 'apt update…', options: ['refreshes the package lists', 'installs everything', 'removes packages', 'restarts the PC'], correctAnswer: 'refreshes the package lists' },
    { text: 'systemctl restart nginx…', options: ['restarts the nginx service', 'installs nginx', 'deletes nginx', 'opens nginx config'], correctAnswer: 'restarts the nginx service' },
    { text: 'A service\'s logs are read with…', options: ['journalctl -u <service>', 'tail -f /dev/null', 'grep -r nginx', 'systemctl enable'], correctAnswer: 'journalctl -u <service>' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Your First Bash Script': [
    { text: 'The shebang is…', options: ['#!/bin/bash', '#bash', '//bash', '--bash--'], correctAnswer: '#!/bin/bash' },
    { text: 'set -euo pipefail…', options: ['stops on errors, rejects unset variables, catches pipe failures', 'makes the script faster', 'prints debugging', 'disables warnings'], correctAnswer: 'stops on errors, rejects unset variables, catches pipe failures' },
    { text: 'Before running ./script.sh you must…', options: ['chmod +x script.sh', 'compile it', 'cd to /root', 'install it'], correctAnswer: 'chmod +x script.sh' },
    { text: 'Scripts are read more than written, so…', options: ['keep them boring and obvious', 'obfuscate everything', 'write no comments', 'merge all logic into one line'], correctAnswer: 'keep them boring and obvious' },
  ],
  'Variables, Input & Conditionals': [
    { text: 'A variable is assigned with…', options: ['NAME=value (no spaces around =)', 'NAME = value', 'set NAME value', 'var NAME value'], correctAnswer: 'NAME=value (no spaces around =)' },
    { text: 'The first argument to a script is…', options: ['$1', '$0', '$#', 'argv[1]'], correctAnswer: '$1' },
    { text: 'The condition [ -f file ] tests…', options: ['whether a regular file exists', 'whether it is a directory', 'its size', 'its owner'], correctAnswer: 'whether a regular file exists' },
    { text: 'A successful command returns…', options: ['0', '1', '2', '-1'], correctAnswer: '0' },
  ],
  'Loops & Functions': [
    { text: 'A function is defined with…', options: ['greet() { …; }', 'function greet …;', 'def greet', 'fn greet'], correctAnswer: 'greet() { …; }' },
    { text: 'for f in *.log runs…', options: ['a block once per matching file', 'forever', 'once', 'ten times'], correctAnswer: 'a block once per matching file' },
    { text: 'The most common automation pattern in Bash is…', options: ['a for loop over a glob', 'a recursive function', 'an infinite while', 'a goto'], correctAnswer: 'a for loop over a glob' },
    { text: 'When a script grows past a few functions, you should…', options: ['split files or move to a scripting language', 'keep adding to it', 'delete it', 'ignore structure'], correctAnswer: 'split files or move to a scripting language' },
  ],
  'Admin Project: A Server-Style Workflow': [
    { text: 'The server workflow pattern is…', options: ['prepare → least-privilege user → grant only needed files → run as service → verify', 'install everything as root', 'skip updates', 'run apps in your own user'], correctAnswer: 'prepare → least-privilege user → grant only needed files → run as service → verify' },
    { text: 'A service user exists…', options: ['with the least privilege needed', 'with root access', 'with all files', 'only for GUI work'], correctAnswer: 'with the least privilege needed' },
    { text: 'Automating the steps as a script…', options: ['makes deploys identical every time', 'is optional and risky', 'hides errors', 'only works once'], correctAnswer: 'makes deploys identical every time' },
    { text: 'A runbook is…', options: ['a short README documenting install, start and verify steps', 'a stack trace', 'a config file', 'a license'], correctAnswer: 'a short README documenting install, start and verify steps' },
  ],
};
