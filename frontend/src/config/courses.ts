import {
  Code, Box, Wifi, Cpu, Globe, Terminal, Database, Wrench, Building2,
  FileText, Table2, Presentation, Monitor, Coffee, Braces, Infinity as InfinityIcon, Code2,
  Atom, Server, Layers, TerminalSquare, Network, CircuitBoard, Radio,
  MemoryStick, Lightbulb, Binary, PencilRuler, Boxes, Keyboard, Zap,
} from 'lucide-react';

// Presentation-only metadata (icons, colors, short labels, practice-arena wiring).
// Authoritative course data (title, description, syllabus, price, category,
// difficulty, duration, module count, certificate availability, tags) comes from
// the catalog API — this file is NOT a source of truth for course content, so it
// must never contain title/desc/syllabus/price/category/difficulty/tags copies
// (TASK 5 / spec Q cleanup).

export interface CourseConfigItem {
  id: string;
  titleShort: string;
  // D1e: practice-arena category this course's learners should be pointed at.
  // Set only when the course has a seeded practice set in that category.
  practiceCategory?: string;
  colorLight: string;
  colorDark: string;
  iconColor: string;
  textColor: string;
  barColor: string;
  icon: any;
}

export const coursesConfig: CourseConfigItem[] = [
  {
    id: 'C',
    titleShort: 'C Language',
    colorLight: 'from-blue-500/10 to-blue-600/5',
    colorDark: 'from-blue-500 to-blue-700',
    iconColor: 'text-blue-500 bg-blue-500/10',
    textColor: 'text-blue-400',
    barColor: 'bg-blue-500',
    icon: Code
  },
  {
    id: 'C++',
    titleShort: 'C++ Language',
    colorLight: 'from-purple-500/10 to-purple-600/5',
    colorDark: 'from-purple-500 to-purple-700',
    iconColor: 'text-purple-500 bg-purple-500/10',
    textColor: 'text-purple-400',
    barColor: 'bg-purple-500',
    icon: Box
  },
  {
    id: 'IoT',
    titleShort: 'IoT (Internet of Things)',
    colorLight: 'from-teal-500/10 to-teal-600/5',
    colorDark: 'from-teal-500 to-teal-700',
    iconColor: 'text-teal-500 bg-teal-500/10',
    textColor: 'text-teal-400',
    barColor: 'bg-teal-500',
    icon: Wifi
  },
  {
    id: 'Embedded',
    titleShort: 'Embedded Systems',
    colorLight: 'from-orange-500/10 to-orange-600/5',
    colorDark: 'from-orange-500 to-orange-700',
    iconColor: 'text-orange-500 bg-orange-500/10',
    textColor: 'text-orange-400',
    barColor: 'bg-orange-500',
    icon: Cpu
  },
  {
    id: 'WebDesign',
    titleShort: 'Web Design',
    colorLight: 'from-pink-500/10 to-pink-600/5',
    colorDark: 'from-pink-500 to-pink-700',
    iconColor: 'text-pink-500 bg-pink-500/10',
    textColor: 'text-pink-400',
    barColor: 'bg-pink-500',
    icon: Globe
  },
  {
    id: 'Python',
    titleShort: 'Python',
    colorLight: 'from-amber-500/10 to-amber-600/5',
    colorDark: 'from-amber-500 to-amber-700',
    iconColor: 'text-amber-500 bg-amber-500/10',
    textColor: 'text-amber-400',
    barColor: 'bg-amber-500',
    icon: Terminal
  },
  {
    id: 'SQL',
    titleShort: 'SQL Database',
    colorLight: 'from-emerald-500/10 to-emerald-600/5',
    colorDark: 'from-emerald-500 to-emerald-700',
    iconColor: 'text-emerald-500 bg-emerald-500/10',
    textColor: 'text-emerald-400',
    barColor: 'bg-emerald-500',
    icon: Database
  },
  {
    id: 'CADDED_Mech',
    titleShort: 'CADDED Mech',
    colorLight: 'from-orange-500/10 to-orange-600/5',
    colorDark: 'from-orange-500 to-orange-700',
    iconColor: 'text-orange-500 bg-orange-500/10',
    textColor: 'text-orange-400',
    barColor: 'bg-orange-500',
    icon: Wrench
  },
  {
    id: 'CADDED_Civil',
    titleShort: 'CADD & BIM',
    practiceCategory: 'Design',
    colorLight: 'from-emerald-500/10 to-emerald-600/5',
    colorDark: 'from-emerald-500 to-emerald-700',
    iconColor: 'text-emerald-500 bg-emerald-500/10',
    textColor: 'text-emerald-400',
    barColor: 'bg-emerald-500',
    icon: Building2
  },
  // ── TASK 5: 25 new course cards (presentation-only) ────────────────────────
  // Icon/color/short-label only. Business data stays in the catalog API.
  {
    id: 'MSWord',
    titleShort: 'MS Word',
    colorLight: 'from-sky-500/10 to-sky-600/5',
    colorDark: 'from-sky-500 to-sky-700',
    iconColor: 'text-sky-500 bg-sky-500/10',
    textColor: 'text-sky-400',
    barColor: 'bg-sky-500',
    icon: FileText
  },
  {
    id: 'MSExcel',
    titleShort: 'MS Excel',
    colorLight: 'from-emerald-500/10 to-emerald-600/5',
    colorDark: 'from-emerald-500 to-emerald-700',
    iconColor: 'text-emerald-500 bg-emerald-500/10',
    textColor: 'text-emerald-400',
    barColor: 'bg-emerald-500',
    icon: Table2
  },
  {
    id: 'MSPowerPoint',
    titleShort: 'MS PowerPoint',
    colorLight: 'from-orange-500/10 to-orange-600/5',
    colorDark: 'from-orange-500 to-orange-700',
    iconColor: 'text-orange-500 bg-orange-500/10',
    textColor: 'text-orange-400',
    barColor: 'bg-orange-500',
    icon: Presentation
  },
  {
    id: 'ComputerFundamentals',
    titleShort: 'Computer Fundamentals',
    colorLight: 'from-indigo-500/10 to-indigo-600/5',
    colorDark: 'from-indigo-500 to-indigo-700',
    iconColor: 'text-indigo-500 bg-indigo-500/10',
    textColor: 'text-indigo-400',
    barColor: 'bg-indigo-500',
    icon: Monitor
  },
  {
    id: 'Java',
    titleShort: 'Java',
    colorLight: 'from-red-500/10 to-red-600/5',
    colorDark: 'from-red-500 to-red-700',
    iconColor: 'text-red-500 bg-red-500/10',
    textColor: 'text-red-400',
    barColor: 'bg-red-500',
    icon: Coffee
  },
  {
    id: 'JavaScript',
    titleShort: 'JavaScript',
    colorLight: 'from-yellow-500/10 to-yellow-600/5',
    colorDark: 'from-yellow-500 to-yellow-700',
    iconColor: 'text-yellow-500 bg-yellow-500/10',
    textColor: 'text-yellow-400',
    barColor: 'bg-yellow-500',
    icon: Braces
  },
  {
    id: 'DSA',
    titleShort: 'DSA',
    colorLight: 'from-violet-500/10 to-violet-600/5',
    colorDark: 'from-violet-500 to-violet-700',
    iconColor: 'text-violet-500 bg-violet-500/10',
    textColor: 'text-violet-400',
    barColor: 'bg-violet-500',
    icon: InfinityIcon
  },
  {
    id: 'HTMLCSS',
    titleShort: 'HTML & CSS',
    colorLight: 'from-rose-500/10 to-rose-600/5',
    colorDark: 'from-rose-500 to-rose-700',
    iconColor: 'text-rose-500 bg-rose-500/10',
    textColor: 'text-rose-400',
    barColor: 'bg-rose-500',
    icon: Code2
  },
  {
    id: 'React',
    titleShort: 'React',
    colorLight: 'from-cyan-500/10 to-cyan-600/5',
    colorDark: 'from-cyan-500 to-cyan-700',
    iconColor: 'text-cyan-500 bg-cyan-500/10',
    textColor: 'text-cyan-400',
    barColor: 'bg-cyan-500',
    icon: Atom
  },
  {
    id: 'NodeJS',
    titleShort: 'Node.js',
    colorLight: 'from-green-500/10 to-green-600/5',
    colorDark: 'from-green-500 to-green-700',
    iconColor: 'text-green-500 bg-green-500/10',
    textColor: 'text-green-400',
    barColor: 'bg-green-500',
    icon: Server
  },
  {
    id: 'FullStackWeb',
    titleShort: 'Full Stack Web',
    colorLight: 'from-blue-500/10 to-blue-600/5',
    colorDark: 'from-blue-500 to-blue-700',
    iconColor: 'text-blue-500 bg-blue-500/10',
    textColor: 'text-blue-400',
    barColor: 'bg-blue-500',
    icon: Layers
  },
  {
    id: 'Linux',
    titleShort: 'Linux',
    colorLight: 'from-slate-500/10 to-slate-600/5',
    colorDark: 'from-slate-500 to-slate-700',
    iconColor: 'text-slate-500 bg-slate-500/10',
    textColor: 'text-slate-400',
    barColor: 'bg-slate-500',
    icon: TerminalSquare
  },
  {
    id: 'Networking',
    titleShort: 'Networking',
    colorLight: 'from-cyan-500/10 to-cyan-600/5',
    colorDark: 'from-cyan-500 to-cyan-700',
    iconColor: 'text-cyan-500 bg-cyan-500/10',
    textColor: 'text-cyan-400',
    barColor: 'bg-cyan-500',
    icon: Network
  },
  {
    id: 'Arduino',
    titleShort: 'Arduino',
    colorLight: 'from-teal-500/10 to-teal-600/5',
    colorDark: 'from-teal-500 to-teal-700',
    iconColor: 'text-teal-500 bg-teal-500/10',
    textColor: 'text-teal-400',
    barColor: 'bg-teal-500',
    icon: CircuitBoard
  },
  {
    id: 'ESP32',
    titleShort: 'ESP32',
    colorLight: 'from-sky-500/10 to-sky-600/5',
    colorDark: 'from-sky-500 to-sky-700',
    iconColor: 'text-sky-500 bg-sky-500/10',
    textColor: 'text-sky-400',
    barColor: 'bg-sky-500',
    icon: Radio
  },
  {
    id: 'EmbeddedC',
    titleShort: 'Embedded C',
    colorLight: 'from-orange-500/10 to-orange-600/5',
    colorDark: 'from-orange-500 to-orange-700',
    iconColor: 'text-orange-500 bg-orange-500/10',
    textColor: 'text-orange-400',
    barColor: 'bg-orange-500',
    icon: Cpu
  },
  {
    id: 'Microcontrollers',
    titleShort: 'Microcontrollers',
    colorLight: 'from-red-500/10 to-red-600/5',
    colorDark: 'from-red-500 to-red-700',
    iconColor: 'text-red-500 bg-red-500/10',
    textColor: 'text-red-400',
    barColor: 'bg-red-500',
    icon: MemoryStick
  },
  {
    id: 'BasicElectronics',
    titleShort: 'Basic Electronics',
    colorLight: 'from-amber-500/10 to-amber-600/5',
    colorDark: 'from-amber-500 to-amber-700',
    iconColor: 'text-amber-500 bg-amber-500/10',
    textColor: 'text-amber-400',
    barColor: 'bg-amber-500',
    icon: Lightbulb
  },
  {
    id: 'DigitalElectronics',
    titleShort: 'Digital Electronics',
    colorLight: 'from-fuchsia-500/10 to-fuchsia-600/5',
    colorDark: 'from-fuchsia-500 to-fuchsia-700',
    iconColor: 'text-fuchsia-500 bg-fuchsia-500/10',
    textColor: 'text-fuchsia-400',
    barColor: 'bg-fuchsia-500',
    icon: Binary
  },
  {
    id: 'PCBDesign',
    titleShort: 'PCB Design',
    colorLight: 'from-teal-500/10 to-teal-600/5',
    colorDark: 'from-teal-500 to-teal-700',
    iconColor: 'text-teal-500 bg-teal-500/10',
    textColor: 'text-teal-400',
    barColor: 'bg-teal-500',
    icon: CircuitBoard
  },
  {
    id: 'AutoCAD2D',
    titleShort: 'AutoCAD 2D',
    colorLight: 'from-red-500/10 to-red-600/5',
    colorDark: 'from-red-500 to-red-700',
    iconColor: 'text-red-500 bg-red-500/10',
    textColor: 'text-red-400',
    barColor: 'bg-red-500',
    icon: PencilRuler
  },
  {
    id: 'ThreeDCAD',
    titleShort: '3D CAD',
    colorLight: 'from-blue-500/10 to-blue-600/5',
    colorDark: 'from-blue-500 to-blue-700',
    iconColor: 'text-blue-500 bg-blue-500/10',
    textColor: 'text-blue-400',
    barColor: 'bg-blue-500',
    icon: Boxes
  },
  {
    id: 'ITICOPA',
    titleShort: 'ITI COPA',
    colorLight: 'from-lime-500/10 to-lime-600/5',
    colorDark: 'from-lime-500 to-lime-700',
    iconColor: 'text-lime-500 bg-lime-500/10',
    textColor: 'text-lime-400',
    barColor: 'bg-lime-500',
    icon: Keyboard
  },
  {
    id: 'ITIElectrician',
    titleShort: 'ITI Electrician',
    colorLight: 'from-yellow-500/10 to-yellow-600/5',
    colorDark: 'from-yellow-500 to-yellow-700',
    iconColor: 'text-yellow-500 bg-yellow-500/10',
    textColor: 'text-yellow-400',
    barColor: 'bg-yellow-500',
    icon: Zap
  },
  {
    id: 'ITIFitter',
    titleShort: 'ITI Fitter',
    colorLight: 'from-amber-500/10 to-amber-600/5',
    colorDark: 'from-amber-500 to-amber-700',
    iconColor: 'text-amber-500 bg-amber-500/10',
    textColor: 'text-amber-400',
    barColor: 'bg-amber-500',
    icon: Wrench
  }
];
