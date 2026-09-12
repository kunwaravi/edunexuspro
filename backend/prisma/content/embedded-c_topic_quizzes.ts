/**
 * Embedded C — Firmware for Microcontrollers — per-topic quizzes.
 * Keyed by the EXACT topic titles in embedded-c.ts (topic-lock flow).
 * 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in embedded-c.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'What Embedded C Is — C Where It Meets Hardware': [
    { text: 'Embedded C is…', options: ['C running directly on hardware with no OS in between', 'C in a browser', 'C on a mainframe', 'JavaScript'], correctAnswer: 'C running directly on hardware with no OS in between' },
    { text: 'Compared with app C, embedded C cares about…', options: ['exact sizes, memory footprint and timing', 'only styling', 'the internet speed', 'nothing'], correctAnswer: 'exact sizes, memory footprint and timing' },
    { text: 'A while loop that never exits is…', options: ['normal in firmware — the program is a forever loop', 'always a bug', 'impossible', 'an error'], correctAnswer: 'normal in firmware — the program is a forever loop' },
    { text: 'Interrupt handlers…', options: ['fire asynchronously while the main loop runs', 'run once at boot', 'never exist', 'block everything'], correctAnswer: 'fire asynchronously while the main loop runs' },
  ],
  'Registers & Memory-Mapped I/O': [
    { text: 'A register is…', options: ['a memory location whose bits control a peripheral', 'a C variable', 'a file', 'a database'], correctAnswer: 'a memory location whose bits control a peripheral' },
    { text: 'The register that sets a pin to input/output is…', options: ['the MODER/direction register', 'the data register', 'the clock register', 'the debug register'], correctAnswer: 'the MODER/direction register' },
    { text: 'The standard register names for ARM Cortex come from…', options: ['CMSIS headers', 'the file system', 'the browser', 'a wiki'], correctAnswer: 'CMSIS headers' },
    { text: 'The datasheet tells you…', options: ['each register\'s address and bit layout', 'only the price', 'the company logo', 'the weight'], correctAnswer: 'each register\'s address and bit layout' },
  ],
  'Bit Manipulation — Setting, Clearing & Testing': [
    { text: 'To clear bit n of a register you write…', options: ['reg &= ~(1u << n)', 'reg |= (1u << n)', 'reg ^= (1u << n)', 'reg = n'], correctAnswer: 'reg &= ~(1u << n)' },
    { text: 'To toggle bit n you write…', options: ['reg ^= (1u << n)', 'reg |= (1u << n)', 'reg &= ~(1u << n)', 'reg >>= n'], correctAnswer: 'reg ^= (1u << n)' },
    { text: 'A 2-bit field is best replaced by…', options: ['masking it out, then OR-ing the new value shifted', 'assigning the whole register', 'a magic number', 'nothing'], correctAnswer: 'masking it out, then OR-ing the new value shifted' },
    { text: 'Naming every bit with macros…', options: ['prevents invisible bit-twiddling bugs', 'slows the compiler', 'is forbidden', 'uses more RAM always'], correctAnswer: 'prevents invisible bit-twiddling bugs' },
  ],
  'volatile, const & Memory Ordering': [
    { text: 'Without volatile, the optimizer may…', options: ['cache a register/ISR variable and read a stale value', 'delete the program', 'overclock the chip', 'do nothing'], correctAnswer: 'cache a register/ISR variable and read a stale value' },
    { text: 'Registers and ISR-shared variables should be declared…', options: ['volatile', 'static const', 'extern only', 'inline'], correctAnswer: 'volatile' },
    { text: 'volatile const means…', options: ['read-only to you, but it changes anyway', 'constant and cached', 'writable by all', 'a ROM value'], correctAnswer: 'read-only to you, but it changes anyway' },
    { text: 'A lookup table that never changes is…', options: ['const, stored in flash', 'volatile', 'in RAM always', 'deleted'], correctAnswer: 'const, stored in flash' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'GPIO Configuration — Mode, Speed & Pull-ups': [
    { text: 'The very first GPIO step is…', options: ['enabling the peripheral clock', 'writing the ODR', 'reading the IDR', 'declaring an int'], correctAnswer: 'enabling the peripheral clock' },
    { text: 'A pin used as UART TX/RX must be set to…', options: ['alternate function', 'digital output', 'analog input', 'no configuration'], correctAnswer: 'alternate function' },
    { text: 'A floating input is fixed with…', options: ['a pull-up or pull-down resistor (internal or external)', 'a bigger capacitor', 'more RAM', 'nothing'], correctAnswer: 'a pull-up or pull-down resistor (internal or external)' },
    { text: 'The reason register writes seem to do nothing is often…', options: ['the peripheral clock was never enabled', 'the LED is too bright', 'the compiler is new', 'the USB cable'], correctAnswer: 'the peripheral clock was never enabled' },
  ],
  'Driving Outputs — LEDs, Buzzers, Relays': [
    { text: 'An output pin safely sources/sinks about…', options: ['20 mA', '2 A', '5 A', 'unlimited'], correctAnswer: '20 mA' },
    { text: 'An active-low LED comes on when the pin…', options: ['goes LOW', 'goes HIGH', 'floats', 'is input'], correctAnswer: 'goes LOW' },
    { text: 'Inductive loads (relays, motors) need…', options: ['a transistor/driver plus a flyback diode', 'a direct pin connection', 'a bigger pin', 'no ground'], correctAnswer: 'a transistor/driver plus a flyback diode' },
    { text: 'The flyback diode protects against…', options: ['the load\'s kick-back voltage', 'static', 'rain', 'overclocking'], correctAnswer: 'the load\'s kick-back voltage' },
  ],
  'Reading Inputs — Switches & Debouncing in C': [
    { text: 'An input pin with a pull-up reads…', options: ['HIGH when open, LOW when pressed', 'always LOW', 'random', '5V'], correctAnswer: 'HIGH when open, LOW when pressed' },
    { text: 'Mechanical bounce means…', options: ['one press reads as many transitions', 'the pin is broken', 'the pull-up is missing', 'the LED is wrong'], correctAnswer: 'one press reads as many transitions' },
    { text: 'Debouncing is implemented by…', options: ['sampling and requiring stability (or a time gate)', 'a longer delay in setup', 'reading faster', 'nothing'], correctAnswer: 'sampling and requiring stability (or a time gate)' },
    { text: 'Edge detection acts on…', options: ['the change from previous state, not the level', 'the button colour', 'the loop count', 'the voltage'], correctAnswer: 'the change from previous state, not the level' },
  ],
  'Structuring Register-Level Firmware': [
    { text: 'The recommended firmware structure is…', options: ['board header + low-level drivers + application code', 'one giant main.c', 'no structure', 'HTML files'], correctAnswer: 'board header + low-level drivers + application code' },
    { text: 'Register details belong…', options: ['inside the driver files, not in the app', 'in every file', 'in the README', 'nowhere'], correctAnswer: 'inside the driver files, not in the app' },
    { text: 'The board header holds…', options: ['pin names like #define LED PA5 in one place', 'the whole program', 'the schematic', 'the price'], correctAnswer: 'pin names like #define LED PA5 in one place' },
    { text: 'Clean driver APIs make the code…', options: ['portable to other MCUs by swapping drivers', 'uncompilable', 'slower', 'larger always'], correctAnswer: 'portable to other MCUs by swapping drivers' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Timers — Hardware Clocks at Your Service': [
    { text: 'A timer is…', options: ['a hardware counter fed by a clock', 'a software delay', 'an ISR', 'a register only'], correctAnswer: 'a hardware counter fed by a clock' },
    { text: 'Prescaling a timer clock…', options: ['divides it down to a useful count rate', 'removes it', 'speeds up the CPU', 'adds memory'], correctAnswer: 'divides it down to a useful count rate' },
    { text: 'Hardware timers beat delay loops because they…', options: ['run independently and don\'t block the CPU', 'use more RAM', 'are simpler to type', 'always win'], correctAnswer: 'run independently and don\'t block the CPU' },
    { text: 'A 1 ms tick enables…', options: ['timeouts without blocking', 'faster compile', 'more flash', 'wireless'], correctAnswer: 'timeouts without blocking' },
  ],
  'Interrupt Service Routines — The ISR Contract': [
    { text: 'An ISR…', options: ['stops the main code, runs, and returns', 'runs in a thread', 'blocks forever', 'is a function you call'], correctAnswer: 'stops the main code, runs, and returns' },
    { text: 'ISR rules include…', options: ['stay short, don\'t block, set flags only', 'do heavy work inside', 'call printf everywhere', 'sleep'], correctAnswer: 'stay short, don\'t block, set flags only' },
    { text: 'The pending flag must be…', options: ['cleared in the ISR or it re-fires forever', 'never touched', 'set again', 'ignored'], correctAnswer: 'cleared in the ISR or it re-fires forever' },
    { text: 'The golden pattern is…', options: ['ISR sets a flag; main loop does the work', 'all work in the ISR', 'no ISRs', 'polling only'], correctAnswer: 'ISR sets a flag; main loop does the work' },
  ],
  'Edges, Debounce & Interrupt-Driven Input': [
    { text: 'An external interrupt on the falling edge fires…', options: ['the moment the button goes LOW', 'once a second', 'never', 'on boot'], correctAnswer: 'the moment the button goes LOW' },
    { text: 'Interrupt-driven buttons still need debouncing because…', options: ['every bounce triggers an interrupt', 'interrupts are slow', 'the pull-up is weak', 'nothing'], correctAnswer: 'every bounce triggers an interrupt' },
    { text: 'The edge + timestamp + window pattern…', options: ['gives one clean event per press', 'blocks the CPU', 'uses a second MCU', 'is deprecated'], correctAnswer: 'gives one clean event per press' },
    { text: 'Keep every ISR short because…', options: ['a long ISR delays the next interrupt', 'flash fills up', 'the compiler warns', 'nothing'], correctAnswer: 'a long ISR delays the next interrupt' },
  ],
  'The Main Loop — Scheduling Multiple Jobs': [
    { text: 'The superloop pattern is…', options: ['one loop calling several non-blocking services', 'a thread pool', 'an RTOS', 'a web server'], correctAnswer: 'one loop calling several non-blocking services' },
    { text: 'Each job in the superloop must…', options: ['return quickly and not block', 'take forever', 'use delay()', 'spin'], correctAnswer: 'return quickly and not block' },
    { text: 'Scheduling uses…', options: ['flags from ISRs plus time slots from the tick', 'a calendar', 'random sleeps', 'the network'], correctAnswer: 'flags from ISRs plus time slots from the tick' },
    { text: 'The superloop is preferred over threads because…', options: ['it is predictable and easy to debug', 'it is faster on any CPU', 'threads are illegal', 'it uses no RAM'], correctAnswer: 'it is predictable and easy to debug' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'UART — The Simple Two-Wire Serial Link': [
    { text: 'UART uses…', options: ['two wires (TX/RX, crossed over)', 'one wire', 'four wires', 'no wires'], correctAnswer: 'two wires (TX/RX, crossed over)' },
    { text: 'Because UART is asynchronous…', options: ['both sides must agree on the baud rate', 'a clock wire is required', 'it uses Wi-Fi', 'it is parallel'], correctAnswer: 'both sides must agree on the baud rate' },
    { text: 'The standard UART config is…', options: ['8N1 — 8 bits, no parity, 1 stop bit', '8E2', '7O1', 'any'], correctAnswer: '8N1 — 8 bits, no parity, 1 stop bit' },
    { text: 'Redirecting printf to the debug UART…', options: ['gives you a serial terminal for diagnosis', 'breaks the compiler', 'needs a GPU', 'is impossible'], correctAnswer: 'gives you a serial terminal for diagnosis' },
  ],
  'SPI — Fast, Full-Duplex, Chip-Select': [
    { text: 'The four SPI signals are…', options: ['MOSI, MISO, SCLK, SS', 'SDA, SCL, VCC, GND', 'TX, RX, EN, RST', 'CLK, DAT, CS, IRQ'], correctAnswer: 'MOSI, MISO, SCLK, SS' },
    { text: 'SPI is full-duplex, meaning…', options: ['both directions transfer on every clock', 'only one way works', 'it is half duplex', 'no data flows'], correctAnswer: 'both directions transfer on every clock' },
    { text: 'A slave is selected by…', options: ['its SS line pulled low', 'an address byte', 'a baud rate', 'a MAC'], correctAnswer: 'its SS line pulled low' },
    { text: 'SPI costs one extra wire per device, in exchange for…', options: ['higher speed and simple timing', 'lower speed', 'addressing complexity', 'nothing'], correctAnswer: 'higher speed and simple timing' },
  ],
  'I2C — Two Wires, Many Devices': [
    { text: 'I2C uses the wires…', options: ['SDA (data) and SCL (clock)', 'MOSI and MISO', 'TX and RX', 'VCC and GND'], correctAnswer: 'SDA (data) and SCL (clock)' },
    { text: 'I2C devices are addressed by…', options: ['a 7-bit address', 'a chip-select wire', 'a MAC', 'a name'], correctAnswer: 'a 7-bit address' },
    { text: 'The mandatory electrical requirement is…', options: ['pull-up resistors on SDA and SCL', 'a crystal', 'a 5V supply', 'nothing'], correctAnswer: 'pull-up resistors on SDA and SCL' },
    { text: 'An I2C scanner…', options: ['probes all addresses and lists what is present', 'measures voltage', 'fixes the wiring', 'deletes devices'], correctAnswer: 'probes all addresses and lists what is present' },
  ],
  'Reading Datasheets Like an Engineer': [
    { text: 'The datasheet section you must never skip is…', options: ['electrical characteristics (absolute maximums)', 'the marketing page', 'the logo', 'the index'], correctAnswer: 'electrical characteristics (absolute maximums)' },
    { text: 'The section that tells you what to write is…', options: ['the register map', 'the pin diagram only', 'the FAQ', 'the cover'], correctAnswer: 'the register map' },
    { text: 'Most "why doesn\'t this work" answers are…', options: ['an unenabled clock or a required sequence in the datasheet', 'in the README', 'random', 'a hardware fault'], correctAnswer: 'an unenabled clock or a required sequence in the datasheet' },
    { text: 'The recommended reading order starts with…', options: ['feature summary → pin diagram → electrical specs', 'the register map', 'application notes', 'the cover photo'], correctAnswer: 'feature summary → pin diagram → electrical specs' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Designing the Firmware Project': [
    { text: 'A firmware project should start with…', options: ['a behaviour spec on paper', 'the hardest driver', 'random wiring', 'buying parts'], correctAnswer: 'a behaviour spec on paper' },
    { text: 'A state machine drives the flow by…', options: ['dispatching on the current state each loop', 'blocking in delay()', 'recursion', 'threads'], correctAnswer: 'dispatching on the current state each loop' },
    { text: 'Each state is best written as…', options: ['a function; the loop dispatches', 'a macro', 'a comment', 'a thread'], correctAnswer: 'a function; the loop dispatches' },
    { text: 'The spec should include…', options: ['the schedule and the control rules', 'only the price', 'the box colour', 'the logo'], correctAnswer: 'the schedule and the control rules' },
  ],
  'Building the Drivers & Wiring It Together': [
    { text: 'Each driver should…', options: ['be an isolated module with a clean API', 'touch every register everywhere', 'share globals freely', 'have no API'], correctAnswer: 'be an isolated module with a clean API' },
    { text: 'The build order that doubles as a debug plan is…', options: ['LED → serial → sensor → display → fan → rules', 'all at once', 'rules first', 'display only'], correctAnswer: 'LED → serial → sensor → display → fan → rules' },
    { text: 'Each milestone being a checkpoint means…', options: ['failures are blamed on exactly one layer', 'nothing fails', 'debugging is random', 'no tests'], correctAnswer: 'failures are blamed on exactly one layer' },
    { text: 'The sensor VCC goes to…', options: ['3.3V, with GND to GND', 'the data pin', '5V only', 'a GPIO output'], correctAnswer: '3.3V, with GND to GND' },
  ],
  'Debugging Firmware Methodically': [
    { text: 'The tool that decodes UART/SPI/I2C traffic is…', options: ['a logic analyzer', 'a multimeter', 'a soldering iron', 'a screwdriver'], correctAnswer: 'a logic analyzer' },
    { text: 'printf breadcrumbs around each layer…', options: ['tell you exactly where execution stops', 'slow the flash', 'are forbidden', 'do nothing'], correctAnswer: 'tell you exactly where execution stops' },
    { text: 'A sensor returning garbage suggests…', options: ['wiring or the driver, check with the analyzer', 'the LCD', 'the fan', 'the box'], correctAnswer: 'wiring or the driver, check with the analyzer' },
    { text: 'The method is…', options: ['reproduce → isolate the layer → inspect at the boundary', 'rewire randomly', 'recompile blindly', 'change the compiler'], correctAnswer: 'reproduce → isolate the layer → inspect at the boundary' },
  ],
  'From Bare Metal to Production Firmware': [
    { text: 'A watchdog…', options: ['reboots the chip if the code hangs', 'charges the battery', 'is a log', 'speeds up the clock'], correctAnswer: 'reboots the chip if the code hangs' },
    { text: 'Reading the reset-cause register tells you…', options: ['why the device rebooted', 'the temperature', 'the uptime', 'the flash size'], correctAnswer: 'why the device rebooted' },
    { text: 'Production firmware adds…', options: ['checksums and plausibility checks on sensor data', 'more global variables', 'longer delays', 'fewer logs'], correctAnswer: 'checksums and plausibility checks on sensor data' },
    { text: 'Config and calibration belong…', options: ['in flash/NVS, not hardcoded', 'in the main loop', 'in every ISR', 'nowhere'], correctAnswer: 'in flash/NVS, not hardcoded' },
  ],
};
