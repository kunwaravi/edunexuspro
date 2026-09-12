/**
 * Microcontrollers — Architecture & Interfacing — per-topic quizzes.
 * Keyed by the EXACT topic titles in microcontrollers.ts (topic-lock flow).
 * 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in microcontrollers.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'MCU vs Microprocessor — Different Jobs': [
    { text: 'A microcontroller is…', options: ['a complete computer on one chip (CPU + RAM + flash + I/O)', 'just a CPU', 'a GPU', 'a hard drive'], correctAnswer: 'a complete computer on one chip (CPU + RAM + flash + I/O)' },
    { text: 'A microprocessor needs…', options: ['external RAM, storage and I/O', 'nothing', 'a battery only', 'a screen'], correctAnswer: 'external RAM, storage and I/O' },
    { text: 'MCUs are used in…', options: ['washing machines, keyboards and car ECUs', 'only supercomputers', 'only laptops', 'only phones'], correctAnswer: 'washing machines, keyboards and car ECUs' },
    { text: 'The appeal of MCUs is…', options: ['low cost, low power, tiny and reliable for one job', 'max speed', 'huge RAM', 'a web browser'], correctAnswer: 'low cost, low power, tiny and reliable for one job' },
  ],
  'Harvard vs Von Neumann Architectures': [
    { text: 'Von Neumann uses…', options: ['one memory space shared by instructions and data', 'separate buses', 'no memory', 'only flash'], correctAnswer: 'one memory space shared by instructions and data' },
    { text: 'Harvard separates…', options: ['instruction and data memory/buses', 'the CPU and the clock', 'power and ground', 'nothing'], correctAnswer: 'instruction and data memory/buses' },
    { text: 'The Harvard advantage is…', options: ['the CPU can fetch instructions and data in parallel', 'it needs no clock', 'it is simpler to wire', 'it uses less flash'], correctAnswer: 'the CPU can fetch instructions and data in parallel' },
    { text: 'Most modern MCUs are…', options: ['modified Harvard', 'pure Von Neumann', 'no architecture', 'CISC only'], correctAnswer: 'modified Harvard' },
  ],
  'RISC vs CISC — A Pragmatic View': [
    { text: 'RISC keeps instructions…', options: ['simple and fixed-length, executable in few cycles', 'long and complex', 'variable forever', 'invisible'], correctAnswer: 'simple and fixed-length, executable in few cycles' },
    { text: 'Examples of RISC cores are…', options: ['ARM Cortex-M, AVR, RISC-V', 'x86', '8051 always', 'MOS 6502 only'], correctAnswer: 'ARM Cortex-M, AVR, RISC-V' },
    { text: 'CISC leans toward…', options: ['complex instructions that pack more work in', 'the smallest chips', 'no instructions', 'external RAM'], correctAnswer: 'complex instructions that pack more work in' },
    { text: 'For MCUs, RISC is…', options: ['the mainstream default', 'obsolete', 'forbidden', 'a myth'], correctAnswer: 'the mainstream default' },
  ],
  'The Classic 8051 & Modern ARM Cortex': [
    { text: 'The 8051 is…', options: ['an 8-bit classic still taught and still shipping', 'the fastest chip', '64-bit', 'a GPU'], correctAnswer: 'an 8-bit classic still taught and still shipping' },
    { text: 'The modern mainstream MCU family is…', options: ['ARM Cortex-M', '8051 exclusively', 'x86', 'no family'], correctAnswer: 'ARM Cortex-M' },
    { text: 'The Cortex-M4 adds…', options: ['DSP and an FPU for math-heavy work', 'Wi-Fi', 'a GPU', 'more pins always'], correctAnswer: 'DSP and an FPU for math-heavy work' },
    { text: '8051 teaches fundamentals because…', options: ['it is a chip you can fully understand', 'it is the fastest', 'it is 64-bit', 'it has an OS'], correctAnswer: 'it is a chip you can fully understand' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'The Memory Map — Flash, RAM & Peripherals': [
    { text: 'Flash in the memory map holds…', options: ['your code (non-volatile)', 'the stack', 'peripheral registers', 'the clock'], correctAnswer: 'your code (non-volatile)' },
    { text: 'RAM holds…', options: ['variables and the stack (volatile)', 'your program', 'peripheral registers', 'nothing'], correctAnswer: 'variables and the stack (volatile)' },
    { text: 'Writing a peripheral register can…', options: ['make a pin go high or start a timer', 'delete flash', 'reboot the PC', 'do nothing ever'], correctAnswer: 'make a pin go high or start a timer' },
    { text: 'The memory map is important because…', options: ['it tells you where code, RAM and peripherals live', 'it has pretty colours', 'it is required', 'it is short'], correctAnswer: 'it tells you where code, RAM and peripherals live' },
  ],
  'Clocks & the Clock Tree': [
    { text: 'The clock source options are…', options: ['internal RC or external crystal', 'the USB only', 'the battery', 'the flash'], correctAnswer: 'internal RC or external crystal' },
    { text: 'The clock tree produces…', options: ['core, peripheral and low-power clocks', 'one clock', 'the Wi-Fi', 'a reset'], correctAnswer: 'core, peripheral and low-power clocks' },
    { text: 'A crystal is needed for…', options: ['accurate timing (UART bauds, USB, RTC)', 'blinking an LED', 'nothing', 'a quick boot'], correctAnswer: 'accurate timing (UART bauds, USB, RTC)' },
    { text: 'Wrong clock config shows up as…', options: ['everything running at the wrong speed', 'a compile error', 'a burned pin', 'no effect'], correctAnswer: 'everything running at the wrong speed' },
  ],
  'Reset Sources & Power Domains': [
    { text: 'The reset-cause register answers…', options: ['why the chip restarted', 'the temperature', 'the flash size', 'nothing'], correctAnswer: 'why the chip restarted' },
    { text: 'A watchdog reset is triggered by…', options: ['the watchdog not being kicked in time', 'a key press', 'too much RAM', 'a debugger'], correctAnswer: 'the watchdog not being kicked in time' },
    { text: 'Deep-sleep modes…', options: ['power down parts of the chip to save energy', 'overclock', 'delete flash', 'clear RAM'], correctAnswer: 'power down parts of the chip to save energy' },
    { text: 'The watchdog is kicked by…', options: ['writing its key register regularly', 'pressing reset', 'a longer delay', 'nothing'], correctAnswer: 'writing its key register regularly' },
  ],
  'Reading an MCU Datasheet End-to-End': [
    { text: 'The datasheet is used for…', options: ['pinout, electrical specs and a summary', 'register details only', 'the price', 'the logo'], correctAnswer: 'pinout, electrical specs and a summary' },
    { text: 'The reference manual documents…', options: ['registers, sequences and peripheral details', 'the marketing', 'the weight', 'nothing'], correctAnswer: 'registers, sequences and peripheral details' },
    { text: 'The first datasheet section to check is…', options: ['the feature summary', 'the last page', 'the index', 'the cover'], correctAnswer: 'the feature summary' },
    { text: 'When code "should" work, re-read…', options: ['the relevant register description for the missed bit', 'the whole datasheet from page 1', 'the price list', 'nothing'], correctAnswer: 'the relevant register description for the missed bit' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'GPIO Fundamentals — Registers & Modes': [
    { text: 'The register that sets pin direction is…', options: ['MODER (mode/direction)', 'ODR (output data)', 'IDR (input data)', 'PUPDR'], correctAnswer: 'MODER (mode/direction)' },
    { text: 'The register that sets the pin level high/low is…', options: ['ODR', 'MODER', 'IDR', 'CRL'], correctAnswer: 'ODR' },
    { text: 'Open-drain mode is used by…', options: ['I2C pins — pull low or release, never drive high', 'LED outputs', 'the ADC', 'nothing'], correctAnswer: 'I2C pins — pull low or release, never drive high' },
    { text: 'A pin in alternate-function mode…', options: ['serves a peripheral like UART or SPI', 'is an LED', 'is ground', 'floats'], correctAnswer: 'serves a peripheral like UART or SPI' },
  ],
  'LEDs & 7-Segment Displays': [
    { text: 'An active-high LED circuit is…', options: ['anode through a resistor to the pin, cathode to ground', 'anode to ground', 'no resistor', 'straight to 5V'], correctAnswer: 'anode through a resistor to the pin, cathode to ground' },
    { text: 'A 7-segment display is…', options: ['seven LEDs (plus DP) in one package', 'one big LED', 'a transistor', 'a crystal'], correctAnswer: 'seven LEDs (plus DP) in one package' },
    { text: 'Multi-digit displays are driven by…', options: ['time multiplexing the digits', 'one wire per digit', 'an analog voltage', 'no scanning'], correctAnswer: 'time multiplexing the digits' },
    { text: 'Digit-to-segment patterns are stored as…', options: ['bit masks in a lookup table', 'random numbers', 'text strings', 'analog values'], correctAnswer: 'bit masks in a lookup table' },
  ],
  'Switches, Keypads & Input Handling': [
    { text: 'A switch with the internal pull-up reads…', options: ['HIGH open, LOW closed', 'always LOW', 'random', '5V'], correctAnswer: 'HIGH open, LOW closed' },
    { text: 'A keypad matrix uses…', options: ['rows and columns scanned to find the key', 'one pin per key', 'the ADC', 'a 7-seg display'], correctAnswer: 'rows and columns scanned to find the key' },
    { text: 'Raw keypad scans need…', options: ['debouncing and release detection', 'a longer delay', 'more pins', 'nothing'], correctAnswer: 'debouncing and release detection' },
    { text: 'Input handling is naturally modelled as…', options: ['a state machine per input', 'a giant loop', 'a thread', 'a spreadsheet'], correctAnswer: 'a state machine per input' },
  ],
  'LCDs — Character Displays & Interfaces': [
    { text: 'Character LCDs use the controller…', options: ['HD44780', 'ATmega328', 'LM35', 'USB'], correctAnswer: 'HD44780' },
    { text: 'The interfaces are…', options: ['8-bit, 4-bit, or I2C via a backpack', 'only analog', 'only SPI', 'only USB'], correctAnswer: '8-bit, 4-bit, or I2C via a backpack' },
    { text: 'The HD44780 init sequence is…', options: ['timing-critical — follow it exactly', 'optional', 'impossible', 'random'], correctAnswer: 'timing-critical — follow it exactly' },
    { text: 'The I2C backpack uses…', options: ['just SDA and SCL — saving pins', 'eight data pins', 'a crystal', 'no wires'], correctAnswer: 'just SDA and SCL — saving pins' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'ADC — Sampling the Analog World': [
    { text: 'A 10-bit ADC maps 0–5 V to…', options: ['0–1023', '0–4095', '0–255', '0–999'], correctAnswer: '0–1023' },
    { text: 'The ADC sequence is…', options: ['enable → select channel → start → wait → read', 'start → read → enable', 'read only', 'enable only'], correctAnswer: 'enable → select channel → start → wait → read' },
    { text: 'To reduce noise you should…', options: ['average several samples', 'read once', 'raise the voltage', 'skip conversion'], correctAnswer: 'average several samples' },
    { text: 'Common analog sensors include…', options: ['potentiometers, LDRs, thermistors, battery voltage', 'only buttons', 'only LEDs', 'only motors'], correctAnswer: 'potentiometers, LDRs, thermistors, battery voltage' },
  ],
  'Timers — Counting, Timeouts & Captures': [
    { text: 'In free-running mode a timer…', options: ['counts up and overflows', 'counts down only', 'generates PWM always', 'reads sensors'], correctAnswer: 'counts up and overflows' },
    { text: 'Output-compare mode fires…', options: ['at a preset count — the basis of periodic interrupts', 'randomly', 'never', 'once'], correctAnswer: 'at a preset count — the basis of periodic interrupts' },
    { text: 'Input-capture mode…', options: ['timestamps an external signal', 'drives a motor', 'reads the ADC', 'boots the chip'], correctAnswer: 'timestamps an external signal' },
    { text: 'A 1 ms tick is typically built from…', options: ['a prescaled timer with a compare interrupt', 'a delay loop', 'a while loop', 'nothing'], correctAnswer: 'a prescaled timer with a compare interrupt' },
  ],
  'PWM — Controlling Power & Speed': [
    { text: 'PWM duty cycle sets…', options: ['the average output (0% off → 100% full)', 'the frequency', 'the voltage swing', 'the pin count'], correctAnswer: 'the average output (0% off → 100% full)' },
    { text: 'The ARR/period register sets…', options: ['the frequency', 'the duty', 'the prescaler', 'the channel'], correctAnswer: 'the frequency' },
    { text: 'The CCR/compare register sets…', options: ['the duty cycle', 'the frequency', 'the clock', 'the pin'], correctAnswer: 'the duty cycle' },
    { text: 'Motors prefer a PWM frequency around…', options: ['20 kHz (inaudible)', '1 Hz', '100 Hz always', 'any'], correctAnswer: '20 kHz (inaudible)' },
  ],
  'Interfacing Motors & Drivers': [
    { text: 'The motor interface formula is…', options: ['signal → driver → motor, separate power, common ground', 'GPIO → motor directly', 'ADC → motor', 'no ground'], correctAnswer: 'signal → driver → motor, separate power, common ground' },
    { text: 'A simple DC motor is driven by…', options: ['a MOSFET/transistor with a flyback diode, PWM for speed', 'a pin directly', 'the I2C bus', 'a capacitor'], correctAnswer: 'a MOSFET/transistor with a flyback diode, PWM for speed' },
    { text: 'An H-bridge provides…', options: ['direction and speed control', 'only speed', 'only direction', 'power'], correctAnswer: 'direction and speed control' },
    { text: 'A servo\'s angle is set by…', options: ['a 1–2 ms pulse every 20 ms', 'a continuous voltage', 'the duty of a fast PWM', 'its colour'], correctAnswer: 'a 1–2 ms pulse every 20 ms' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Comparing 8051, AVR, PIC & ARM Cortex': [
    { text: 'The Arduino classics use…', options: ['AVR (ATmega328)', 'ARM only', 'x86', '8051 only'], correctAnswer: 'AVR (ATmega328)' },
    { text: 'For a Wi-Fi IoT project you would choose…', options: ['ESP32', '8051', 'PIC 8-bit', 'a pure FPGA'], correctAnswer: 'ESP32' },
    { text: 'For a BLE wearable you would choose…', options: ['nRF52', '8051', 'a desktop CPU', 'no MCU'], correctAnswer: 'nRF52' },
    { text: 'The selection drivers are…', options: ['RAM, peripherals, toolchain, price and familiarity', 'brand only', 'the logo', 'the colour'], correctAnswer: 'RAM, peripherals, toolchain, price and familiarity' },
  ],
  'Bare Metal vs RTOS': [
    { text: 'Bare-metal firmware is…', options: ['a main loop scheduling everything', 'an OS', 'a thread pool', 'a browser'], correctAnswer: 'a main loop scheduling everything' },
    { text: 'An RTOS adds…', options: ['tasks, priorities, semaphores and queues', 'a web server', 'a GPU', 'more flash always'], correctAnswer: 'tasks, priorities, semaphores and queues' },
    { text: 'Choose an RTOS when…', options: ['several things must happen concurrently with different urgency', 'the project is trivial', 'you want to avoid loops', 'flash is tight'], correctAnswer: 'several things must happen concurrently with different urgency' },
    { text: 'The RTOS costs include…', options: ['memory, complexity and priority bugs', 'nothing', 'only money', 'a slower boot'], correctAnswer: 'memory, complexity and priority bugs' },
  ],
  'The Capstone — A Practical MCU Design': [
    { text: 'The capstone exercises…', options: ['datasheet, clocks, GPIO, ADC, timers, PWM, I2C', 'only blinking', 'only the LCD', 'only a button'], correctAnswer: 'datasheet, clocks, GPIO, ADC, timers, PWM, I2C' },
    { text: 'The recommended build style is…', options: ['testable slices that each verify before moving on', 'one giant wiring job', 'all code at once', 'no tests'], correctAnswer: 'testable slices that each verify before moving on' },
    { text: 'The spec drives…', options: ['the pins, schedule and rules', 'the price', 'the box', 'nothing'], correctAnswer: 'the pins, schedule and rules' },
    { text: 'The first slice is…', options: ['datasheet + clock + blink', 'the LCD', 'the fan', 'the button'], correctAnswer: 'datasheet + clock + blink' },
  ],
  'Testing, Debugging & The Road Ahead': [
    { text: 'A debugger (SWD/JTAG) gives you…', options: ['breakpoints and register inspection', 'a faster clock', 'more RAM', 'Wi-Fi'], correctAnswer: 'breakpoints and register inspection' },
    { text: 'Half of MCU bugs are…', options: ['clock config, a missed pin mode, or a missing enable bit', 'the PCB colour', 'the box size', 'nothing'], correctAnswer: 'clock config, a missed pin mode, or a missing enable bit' },
    { text: 'The debug method is…', options: ['reproduce → isolate the layer → inspect the boundary', 'rewire randomly', 'recompile blindly', 'give up'], correctAnswer: 'reproduce → isolate the layer → inspect the boundary' },
    { text: 'The natural next steps are…', options: ['HAL/LL frameworks, Zephyr, bootloaders, safety-critical design', 'stopping', 'only more blinking', 'a web app'], correctAnswer: 'HAL/LL frameworks, Zephyr, bootloaders, safety-critical design' },
  ],
};
