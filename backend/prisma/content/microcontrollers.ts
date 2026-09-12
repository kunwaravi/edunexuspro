/**
 * Microcontrollers — Architecture & Interfacing — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in microcontrollers_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · What a Microcontroller Is ───────────────────────────────────────
  {
    week: 1,
    title: 'What a Microcontroller Is',
    description: 'The difference between an MCU and a microprocessor, core architectures, and the families you\'ll meet.',
    topics: [
      {
        title: 'MCU vs Microprocessor — Different Jobs',
        text: 'A microprocessor (CPU) is just the compute engine — RAM, storage and I/O are external. A microcontroller (MCU) integrates CPU, RAM, flash, timers, ADC and I/O on one chip — a complete computer for one purpose, at low cost and low power.\n\nThink: a PC\'s processor is a microprocessor; the chip inside your washing machine, keyboard, and car\'s ECU is a microcontroller.\n\nThat integration is the whole point: cheap, tiny, reliable, battery-friendly. An MCU runs one (or a few) dedicated programs for years. That\'s why billions ship every year.',
        code: '// Microprocessor (PC-style)\nCPU ← RAM (external)\n   ← storage (external)\n   ← I/O chips (external)\n\n// Microcontroller (one chip)\n┌──────────────────────────┐\n│ CPU + RAM + Flash +      │\n│ Timers + ADC + GPIO +    │\n│ Serial (UART/SPI/I2C)    │\n└──────────────────────────┘',
        note: 'MCU = everything on one chip, built for one job. Microprocessor = compute engine, everything else external.',
      },
      {
        title: 'Harvard vs Von Neumann Architectures',
        text: 'The two classic memory designs. Von Neumann: one memory space shared by instructions and data — simpler, but a single bus can bottleneck. Harvard: separate memory and buses for instructions and data — the CPU can fetch an instruction and access data at the same time.\n\nMost modern MCUs use a modified Harvard: separate flash and RAM buses, unified address space. It\'s why "fetch instruction + read data" can overlap.\n\nWhy it matters: it\'s why MCUs run tight real-time loops efficiently, and why flash-based code and RAM data don\'t fight over the same bus.',
        code: '// Von Neumann\n┌──────┐   single bus   ┌───────────┐\n│ CPU  │◀──────────────▶│  Memory   │\n└──────┘                └───────────┘\n\n// Harvard\n┌──────┐─── instr bus ───┐ Flash  │\n│ CPU  │─── data bus ────┤ RAM    │\n└──────┘                 └────────┘\n\n// Modified Harvard (most MCUs): separate flash/RAM\n// buses, unified address map.',
        note: 'Harvard = instruction and data can be fetched in parallel. That parallelism is why MCUs are fast and deterministic.',
      },
      {
        title: 'RISC vs CISC — A Pragmatic View',
        text: 'RISC (Reduced Instruction Set) keeps instructions simple and fixed-length so the CPU can execute them in one or few clock cycles — ARM, AVR, RISC-V. CISC (Complex Instruction Set) packs more work into each instruction — x86, and the old 8051 leans that way.\n\nThe academic war is mostly over — modern chips blur the line. What matters practically: a RISC core is easy to pipeline, energy-efficient, and what most MCUs use. CISC survives where legacy and dense code matter (x86 PCs).\n\nFor choosing an MCU, RISC cores (Cortex-M, AVR, RISC-V) are the mainstream default.',
        code: 'RISC  → ARM Cortex-M, AVR, RISC-V, PIC\n        simple fixed instructions, pipelined\nCISC  → x86, classic 8051 (CISC-leaning)\n        complex instructions, more per op\n\n// Modern reality: blended. But MCUs are mostly RISC.',
        note: 'RISC won the MCU world. Pipeline-friendly, power-efficient, and the default for new designs.',
      },
      {
        title: 'The Classic 8051 & Modern ARM Cortex',
        text: 'The 8051 (Intel, 1980) defined the education of embedded engineers: 8-bit core, 128 bytes RAM, 4 KB ROM, 4 I/O ports, timers and a serial port. Still taught widely, still shipping in billions of parts, still the first architecture many engineers learn.\n\nARM Cortex-M is the modern workhorse: 32-bit, a rich family (M0/M0+ for cost, M3/M4 for performance + DSP, M7 for high-end, M33/M85 with TrustZone security).\n\nWhy both matter: 8051 teaches fundamentals on a chip you can fully understand; Cortex-M is what you\'ll actually design with. The concepts — registers, timers, interrupts, ports — transfer 1:1.',
        code: '// The classic 8051 resources\n8-bit core · 128 B RAM · 4 KB ROM\n4 I/O ports (P0–P3) · 2 timers · 1 UART\n\n// ARM Cortex-M family\nM0/M0+   tiny, low cost, low power\nM3       balanced, mainstream\nM4       + DSP + FPU (math-heavy)\nM7       high performance\nM33/M85  + TrustZone security',
        note: '8051 for fundamentals, Cortex-M for today\'s designs. The register/interrupt model is the same in both.',
      },
    ],
    quizzes: [
      { text: 'A microcontroller integrates…', options: ['CPU, RAM, flash, timers and I/O on one chip', 'only a CPU', 'a GPU', 'a keyboard'], correctAnswer: 'CPU, RAM, flash, timers and I/O on one chip' },
      { text: 'Harvard architecture means…', options: ['separate buses for instructions and data', 'one shared memory bus', 'no memory', 'external RAM only'], correctAnswer: 'separate buses for instructions and data' },
      { text: 'Most modern MCUs use…', options: ['RISC cores like ARM Cortex-M', 'x86 exclusively', 'no cores', 'CISC only'], correctAnswer: 'RISC cores like ARM Cortex-M' },
      { text: 'The 8051 is significant because…', options: ['it defined embedded education and still ships in billions', 'it is the fastest MCU', 'it is 64-bit', 'it has Wi-Fi'], correctAnswer: 'it defined embedded education and still ships in billions' },
    ],
  },

  // ── W2 · Memory, Clocks & the Datasheet ──────────────────────────────────
  {
    week: 2,
    title: 'Memory, Clocks & the Datasheet',
    description: 'The memory map, clock tree, reset sources, and how to actually read an MCU datasheet.',
    topics: [
      {
        title: 'The Memory Map — Flash, RAM & Peripherals',
        text: 'Every MCU has one address space: flash (your code), RAM (variables and stack), and peripherals (their registers) — all mapped into the same view. The datasheet\'s memory map tells you exactly which address range is what.\n\nFlash is non-volatile and slow-ish; RAM is volatile and fast; peripheral registers are special — writing one can make a pin go high or start a timer.\n\nRead the memory map before anything else on a new chip: where is my code? my stack? my GPIO? That one diagram explains half the datasheet.',
        code: '// A Cortex-M memory map (simplified)\n0x00000000  code / flash\n0x20000000  RAM (variables, stack)\n0x40000000  peripherals (registers)\n0xE0000000  system (NVIC, SysTick, debug)\n\n// 8051-ish view\nCode memory (ROM)   ·  Data memory (RAM)\nSpecial Function Registers (SFRs)\n\n// The datasheet gives the exact ranges per chip.',
        note: 'Flash for code, RAM for variables, one address range per peripheral. The memory map is the atlas of the chip.',
      },
      {
        title: 'Clocks & the Clock Tree',
        text: 'Everything runs on clocks. The MCU takes an internal or external oscillator (crystal/RC), and a clock tree — PLLs and dividers — scales it into the different clocks the chip needs: a fast core clock, slower peripheral clocks, and a low-power low-speed clock for watchdogs and RTC.\n\nTypical bring-up: configure the source, enable the PLL, select the system clock, and derive the peripheral clocks. An internal RC is fine for simple projects; a crystal is needed for accurate timing (UART bauds, USB, RTC).\n\nWrong clock config = everything runs, but at the wrong speed — a classic "it sort of works" trap. Check the PLL settings first.',
        code: '// Clock tree (highly simplified)\nCrystal/RC ──▶ PLL ──▶ System clock ──▶ core\n                    ├──▶ Peripheral clock (APB)\n                    └──▶ low-speed (watchdog, RTC)\n\n// On Cortex-M, check the actual clock\ngcc -print SysClk\n// RCC->CFGR chooses the source and PLL factors',
        note: 'The clock tree is where "it runs but at the wrong speed" bugs live. Trace source → PLL → dividers.',
      },
      {
        title: 'Reset Sources & Power Domains',
        text: 'The chip resets for many reasons — power-on, brown-out, watchdog, software reset, an external reset pin — and a status register records which one happened. Reading it after boot answers "why did we restart?" — the first question for any field return.\n\nPower domains: the MCU can power down parts of itself — CPU, peripherals, or to deep-sleep with just the RTC running. Low-power modes are managed by power-management registers.\n\nKnow your watchdog: it must be kicked (reloaded) in the loop or the chip reboots — a safety net that catches code hangs.',
        code: '// Reset cause (Cortex-M: RCC->CSR)\nif (RCC->CSR & RCC_CSR_WDGRSTF)\n  printf("reset: watchdog\\n");\nif (RCC->CSR & RCC_CSR_PORRSTF)\n  printf("reset: power-on\\n");\nRCC->CSR |= RCC_CSR_RMVF;   // clear flags\n\n// Watchdog pattern\nwhile (1) {\n  work();\n  IWDG->KR = 0xAAAA;   // kick it — or the chip resets\n}',
        note: 'Log the reset cause, and kick the watchdog. Both are two lines that save days of field debugging.',
      },
      {
        title: 'Reading an MCU Datasheet End-to-End',
        text: 'A datasheet is intimidating but ordered. The efficient path: (1) feature summary — does it have the peripherals you need? (2) pin diagram/table — which package, which functions per pin; (3) electrical specs — voltage, current, temperature limits; (4) memory map; (5) clock/reset chapters; (6) per-peripheral chapters with registers; (7) application notes for proven designs.\n\nCross-reference with the reference manual — the datasheet summarizes, the reference manual documents registers.\n\nTreat the datasheet as the answer key: whenever code "should" work but doesn\'t, a re-read of the relevant register description finds the missed bit or required sequence.',
        code: '// Datasheet → reference manual split\nDatasheet:     pinout, electrical specs, summary\nReference manual: registers, sequences, peripheral docs\n\n// Peripheral read template\n1. What is it for?\n2. Which pins does it use? (AF mapping)\n3. Which clock enables it?\n4. Register setup order?\n5. Any required enable/sequence bits?',
        note: 'Datasheet for the big picture, reference manual for registers. Read per-peripheral, not front-to-back.',
      },
    ],
    quizzes: [
      { text: 'Flash stores…', options: ['your code (non-volatile)', 'stack variables', 'peripheral states', 'nothing'], correctAnswer: 'your code (non-volatile)' },
      { text: 'The clock tree turns an oscillator into…', options: ['core, peripheral and low-power clocks', 'only one clock', 'the Wi-Fi signal', 'a reset'], correctAnswer: 'core, peripheral and low-power clocks' },
      { text: 'A watchdog…', options: ['reboots the chip unless kicked regularly', 'charges the battery', 'is a log', 'is a sensor'], correctAnswer: 'reboots the chip unless kicked regularly' },
      { text: 'The datasheet summarizes a chip; the reference manual documents…', options: ['registers and sequences in detail', 'the price', 'the logo', 'the weight'], correctAnswer: 'registers and sequences in detail' },
    ],
  },

  // ── W3 · GPIO & Interfacing Fundamentals ─────────────────────────────────
  {
    week: 3,
    title: 'GPIO & Interfacing Fundamentals',
    description: 'The pins themselves: driving LEDs, reading switches, and driving the classic displays.',
    topics: [
      {
        title: 'GPIO Fundamentals — Registers & Modes',
        text: 'GPIO (general-purpose I/O) is the pin interface: each pin can be input, output, or an alternate function (peripheral signal). Configuration registers set direction, mode (push-pull/open-drain), pull resistors, speed and alternate function.\n\nReading/writing: output data register (ODR) sets pin levels; input data register (IDR) reads them. Open-drain mode is how I2C pins work — they pull low or release, never drive high.\n\nThe classic first program: configure a pin as output, blink an LED. Then configure one as input with a pull-up and read a button. Both are two registers and a loop.',
        code: '// Output: PA5\nGPIOA->MODER |= (1u << 10);   // bits [11:10] = 01 (output)\nGPIOA->ODR |= (1u << 5);      // PA5 = HIGH\n\n// Input: PA3 with pull-up\nGPIOA->MODER &= ~(0b11u << 6);  // 00 = input\nGPIOA->PUPDR |= (0b01u << 6);   // pull-up\nif (GPIOA->IDR & (1u << 3)) { /* HIGH */ }',
        note: 'MODER sets direction, ODR/IDR move data, PUPDR adds pull-ups. Three register groups run the whole pin world.',
      },
      {
        title: 'LEDs & 7-Segment Displays',
        text: 'LEDs are the universal output: anode through a resistor to the pin (active-high), or to ground (active-low). For several LEDs, one pin each — or a shift register/Charlieplexing when pins are scarce.\n\nA 7-segment display is seven LEDs (plus DP) in one package — common cathode (all cathodes tied to GND) or common anode. Drive segments from pins and enable one digit at a time. For multiple digits, multiplex: scan the digits fast enough (≥50 Hz per digit) that persistence of vision fuses them into a steady readout.\n\nThe trick that makes it all work: segment patterns are just bit masks — a lookup table maps digit → segment bits.',
        code: '// 7-segment segment map (a,b,c,d,e,f,g + DP)\n// Segments → pins: seg_table[digit] = bitmask\nconst uint8_t seg[10] = {\n  0b11111100,  // 0\n  0b01100000,  // 1\n  0b11011010,  // 2\n  ...\n};\n\n// Multiplex 2 digits: scan 100 Hz\ndisplay(digit0, DIGIT1_SEL); delay(5);\ndisplay(digit1, DIGIT2_SEL); delay(5);\n\n// Drive segments from P0, select digits from P1.',
        note: 'Segment patterns are bit masks; multi-digit displays are time-multiplexed. Scan fast and they read steady.',
      },
      {
        title: 'Switches, Keypads & Input Handling',
        text: 'Switches: connect between the pin and ground, enable the internal pull-up, read HIGH (open) / LOW (closed). Debounce by sampling or timing. A keypad is switches in a matrix — rows and columns scanned to find which key is pressed without one pin per key.\n\nKeypad scan: drive each column low one at a time, read the rows; a key at (row, column) pulls its row low when its column is driven. Debounce and release-detection turn raw scans into clean key events.\n\nInput handling is a state machine: each pin or key transitions IDLE → PRESSED → DEBOUNCE → RELEASED, and you act on the transitions.',
        code: '// 4×4 keypad scan\nfor (col = 0; col < 4; col++) {\n  set_col_low(col);            // drive this column low\n  for (row = 0; row < 4; row++) {\n    if (read_row(row) == LOW)\n      key = keymap[row][col];  // key found!\n  }\n  set_col_high(col);\n}\n\n// Debounce each scan with a 20 ms timer',
        note: 'Matrix scanning turns 16 keys into 8 pins. Input = scan + debounce + edge detection.',
      },
      {
        title: 'LCDs — Character Displays & Interfaces',
        text: 'Character LCDs (16×2, 20×4) show text with the HD44780 controller. Interfaces: 8-bit parallel (8 pins), 4-bit (4 pins), or I2C via a backpack module (just SDA/SCL — the modern default).\n\nWorkflow: initialize (function set, display on, clear), set the cursor, write characters. The controller keeps an internal DDRAM; you address it by row and column.\n\nRead the init sequence carefully — the HD44780 has a specific startup dance and delays. Once it works, wrap it in functions: lcd_print("temp: "), lcd_setCursor(0,1). Displays turn a sensor reading into something human.',
        code: '// I2C backpack: two wires, same HD44780 inside\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\nlcd.init();\n\n// Key init sequence (timing-critical)\nlcd.begin(16, 2);       // set columns, rows\nlcd.backlight();\nlcd.setCursor(0, 0);\nlcd.print("Temp: ");\nlcd.setCursor(6, 0);\nlcd.print(temp);\n\n// Wrap in functions: lcd_show(), lcd_clear_line()',
        note: 'The HD44780 init sequence is timing-critical. Use I2C backpacks to save pins, and wrap everything in functions.',
      },
    ],
    quizzes: [
      { text: 'A pin configured as alternate function…', options: ['serves a peripheral like UART or SPI', 'is an output', 'is an input', 'does nothing'], correctAnswer: 'serves a peripheral like UART or SPI' },
      { text: 'Open-drain mode means…', options: ['the pin pulls low or releases, never drives high (I2C)', 'it always drives high', 'it reads only', 'it is analog'], correctAnswer: 'the pin pulls low or releases, never drives high (I2C)' },
      { text: 'Multi-digit 7-segment displays are driven by…', options: ['time multiplexing — scan the digits fast', 'one pin per digit forever', 'an analog voltage', 'Wi-Fi'], correctAnswer: 'time multiplexing — scan the digits fast' },
      { text: 'A keypad matrix scans…', options: ['columns and rows to find the pressed key', 'one pin per key', 'the ADC', 'the I2C bus'], correctAnswer: 'columns and rows to find the pressed key' },
    ],
  },

  // ── W4 · Peripherals — ADC, Timers, PWM ─────────────────────────────────
  {
    week: 4,
    title: 'Peripherals — ADC, Timers, PWM',
    description: 'The workhorses of interfacing: sampling the analog world, measuring time, and controlling power.',
    topics: [
      {
        title: 'ADC — Sampling the Analog World',
        text: 'The ADC (analog-to-digital converter) turns a voltage into a number. On a 10-bit ADC, 0–5 V maps to 0–1023; on a 12-bit, 0–4095. You pick the channel (which pin), start a conversion, wait, and read the result register.\n\nReading a potentiometer is the hello world. Beyond that: light sensors (LDR), temperature (LM35/thermistor), battery voltage, potentiometer position.\n\nAccuracy matters: use the right reference, sample at the right rate, and average several readings to kill noise. The datasheet\'s conversion-time and accuracy specs tell you how good the result can be.',
        code: '// 12-bit ADC, channel 0 (10-bit: 0–1023; 12-bit: 0–4095)\nADC->CR2 |= ADC_CR2_ADON;            // enable\nADC->SQR3 = 0;                       // channel 0\nADC->CR2 |= ADC_CR2_SWSTART;         // start\nwhile (!(ADC->SR & ADC_SR_EOC));     // wait\nuint16_t raw = ADC->DR;              // read result\n\n// Pot: 5V ── pot ── GND\n//           └── wiper ── ADC pin\n\n// Average 16 samples to reduce noise\nuint32_t sum = 0;\nfor (int i = 0; i < 16; i++) sum += adc_read();\nfloat avg = sum / 16.0f;',
        note: 'Enable → select channel → start → wait → read. Average for noise; trust the datasheet for reference and speed.',
      },
      {
        title: 'Timers — Counting, Timeouts & Captures',
        text: 'Timers count clock pulses. In free-running mode they count up and overflow; in output-compare they fire at a preset value (the heartbeat of PWM and periodic interrupts); in input-capture they timestamp an external signal — the basis of pulse-width and frequency measurement.\n\nPractical uses: a 1 ms tick for scheduling, a timeout for a serial protocol, measuring an input pulse (like an ultrasonic sensor\'s echo), and debounce windows.\n\nConfigure: clock → prescaler → mode → compare value → interrupt enable. The same timer often drives both PWM and capture on different channels.',
        code: '// Timer as a time-base: prescale to 1 µs\nTIM->PSC = SYSCLK/1000000 - 1;   // tick = 1 µs\nTIM->ARR = 999;                  // period = 1000 µs\n\n// Input capture: timestamp a rising edge\nTIM->CCER |= TIM_CCER_CC1E;\nTIM->SMCR = TIM_SMCR_TS_TI1FP1;\n// → capture register holds the timestamp\n\n// (Ultrasonic echo: capture width of HIGH pulse)',
        note: 'Free-run for timeouts, compare for interrupts, capture for measurement. One peripheral, three superpowers.',
      },
      {
        title: 'PWM — Controlling Power & Speed',
        text: 'PWM (pulse width modulation) outputs a square wave whose duty cycle sets the average: 0% = off, 50% = half, 100% = full. The hardware timer does it with no CPU load — set the duty, walk away.\n\nWhere it lands: LED brightness, motor speed (through a driver), servo pulse width, and dimmable lighting. The frequency matters too — motors want ~20 kHz (inaudible), LEDs are fine at 1 kHz+.\n\nOn a timer-based PWM, the ARR/period sets the frequency and the compare/CCR value sets the duty. Change CCR on the fly to ramp brightness or speed smoothly.',
        code: '// PWM on a timer channel\nTIM->PSC = 71;                  // prescale\nTIM->ARR = 999;                 // period → frequency\nTIM->CCR1 = 500;                // 50% duty\nTIM->CCMR1 |= TIM_CCMR1_OC1M_1 | TIM_CCMR1_OC1M_2;\nTIM->CCER |= TIM_CCER_CC1E;     // enable output\n\n// Ramp brightness: sweep CCR1 0→999\nfor (int d = 0; d <= 999; d++) { TIM->CCR1 = d; delay(1); }',
        note: 'ARR sets frequency, CCR sets duty. Hardware does the switching — your code just updates CCR.',
      },
      {
        title: 'Interfacing Motors & Drivers',
        text: 'Motors draw far more current than a pin supplies and generate destructive kick-back. So the pattern is always: control signal (from a pin/timer) → driver → motor, with a separate motor power supply sharing only ground.\n\nA simple DC motor: an N-channel MOSFET or transistor with a flyback diode, driven by PWM for speed. Direction + speed: an H-bridge (L298N, L293D, or a TB6612) — two inputs pick direction, PWM sets speed.\n\nA stepper motor: pulses step it — the driver converts pulse streams into coil sequencing (common hobby steppers use a driver board). A servo: a 1–2 ms pulse each 20 ms sets the angle — the Servo library handles it.\n\nSafety: never wire a motor to a GPIO directly. Driver chips, flyback diodes, and common ground are non-negotiable.',
        code: '// DC motor speed: PWM → MOSFET → motor\n// (flyback diode across the motor!)\n\n// Direction + speed: H-bridge\nIN1 = HIGH, IN2 = LOW  → forward\nPWM pin → EN pin       → speed\n\n// Stepper: pulse rate = step rate\n//   driver converts pulse + direction lines\n\n// Servo: 1 ms = 0°, 1.5 ms = 90°, 2 ms = 180°\n//   Servo.h handles the pulse generation',
        note: 'Signal → driver → motor, separate power, common ground. That formula protects every pin and every project.',
      },
    ],
    quizzes: [
      { text: 'A 12-bit ADC returns…', options: ['0–4095', '0–1023', '0–255', 'HIGH/LOW'], correctAnswer: '0–4095' },
      { text: 'The typical accuracy habit for ADC readings is…', options: ['averaging several samples', 'reading once', 'no conversion', 'a longer delay'], correctAnswer: 'averaging several samples' },
      { text: 'In PWM, the frequency is set by…', options: ['the ARR/period; the duty by the CCR/compare', 'the voltage', 'the pin count', 'the pull-up'], correctAnswer: 'the ARR/period; the duty by the CCR/compare' },
      { text: 'A motor is interfaced through…', options: ['a driver with separate power and common ground', 'a GPIO directly', 'the ADC', 'the I2C bus'], correctAnswer: 'a driver with separate power and common ground' },
    ],
  },

  // ── W5 · Choosing & Designing with MCUs ──────────────────────────────────
  {
    week: 5,
    title: 'Choosing & Designing with MCUs',
    description: 'Pick the right chip for a job, understand RTOS and bare metal, and build the capstone.',
    topics: [
      {
        title: 'Comparing 8051, AVR, PIC & ARM Cortex',
        text: 'The four families you\'ll hear most: 8051 (8-bit, huge legacy, cheap, educational), AVR (8-bit, the Arduino classics — ATmega328), PIC (8/16/32-bit, Microchip, huge peripheral variety), ARM Cortex-M (32-bit, the modern mainstream — STM32, nRF52, RP2040, ESP32\'s companion cores).\n\nChoose by the job: cost/power minimal → 8-bit (AVR, PIC, 8051). Performance, RAM-heavy apps, rich peripherals, ecosystem → Cortex-M. Wireless → nRF52 (BLE), ESP32 (Wi-Fi).\n\nDecision drivers: available RAM/flash, required peripherals, toolchain maturity, price/volume, and your own familiarity. A toolchain you know on an adequate chip beats the "best" chip you\'ll fight.',
        code: '// Quick family map\n8051        8-bit, legacy, educational, cheap\nAVR         8-bit, Arduino ecosystem (ATmega328)\nPIC         8/16/32-bit, Microchip, peripheral-rich\nCortex-M    32-bit mainstream (STM32, nRF52, RP2040)\n\n// Choose by the job\nWi-Fi → ESP32        BLE → nRF52\nMath/RTOS → M4/M7    Cost-min → AVR/PIC/8051',
        note: 'Match the chip to RAM, peripherals, wireless and ecosystem — not to brand hype.',
      },
      {
        title: 'Bare Metal vs RTOS',
        text: 'Bare metal: your main loop schedules everything — simple, deterministic, low overhead, the default for small projects. An RTOS (FreeRTOS, Zephyr) adds tasks, priorities, semaphores and queues — concurrency for larger systems.\n\nChoose RTOS when: several things must "happen at once", tasks have different urgency, or you need clean blocking reads (a task can wait for a message without stalling everything).\n\nThe trap: RTOS is not free — it adds memory, complexity and subtle bugs (priority inversion, deadlock). Start bare metal; reach for an RTOS when the main loop genuinely becomes unmanageable.',
        code: '// Bare metal — the superloop\nwhile (1) { service_sensors(); service_display(); service_comms(); }\n// Simple, deterministic, low overhead.\n\n// RTOS — tasks\nxTaskCreate(sensor_task, ..., 1, NULL);   // priority 1\nxTaskCreate(display_task, ..., 2, NULL);\nxSemaphoreTake(data_sem, portMAX_DELAY);\n\n// Costs: RAM per task, priorities, deadlock risk.',
        note: 'Bare metal by default; RTOS when concurrency genuinely demands it. Start simple and escalate with reason.',
      },
      {
        title: 'The Capstone — A Practical MCU Design',
        text: 'The capstone: a temperature-monitoring station on a Cortex-M — an analog temperature sensor on the ADC, an I2C LCD, a PWM fan, a button, and a timed schedule. This exercises every chapter: datasheet, clocks, GPIO, ADC, timers, PWM, I2C.\n\nDesign in slices: (1) datasheet + memory map; (2) clock bring-up + blink; (3) ADC → serial; (4) I2C LCD; (5) PWM fan; (6) button + state machine; (7) integrate + schedule. Each slice is testable.\n\nThe spec drives everything: the pins used, the schedule, the fan rule. Write it before wiring.',
        code: '// Capstone spec\nMCU:      STM32 (Cortex-M4)\nInputs:   LM35 temp on ADC ch0\n          button on PA3\nOutputs:  I2C LCD (16×2), PWM fan on PA5\nSchedule: measure every 2 s\nRule:     temp > 30 °C → fan 100%; >25 °C → 40%; else 0\n\n// Slice order\n1 datasheet → 2 clock+blink → 3 ADC → 4 LCD → 5 fan → 6 button → 7 integrate',
        note: 'Every peripheral from the course lands in one build. Slice it, test each slice, then integrate.',
      },
      {
        title: 'Testing, Debugging & The Road Ahead',
        text: 'Debug MCU code with: printf via the debug UART (breadcrumbs), an LED toggle at checkpoints, a logic analyzer for protocol decoding, an oscilloscope for timing, and SWD/JTAG debuggers (ST-Link, etc.) for breakpoints and register inspection.\n\nMethod: reproduce → isolate the layer → inspect at the boundary. Half of MCU bugs are clock config, a missed pin mode, or a missing enable bit — all visible in a debugger\'s register view.\n\nThe road ahead: dive deeper (linker scripts, bootloaders, safety-critical design), learn the HAL/LL frameworks of your favourite vendor, or go application-level with Zephyr. You now read datasheets, configure peripherals, interface displays and motors, and choose chips — the core skills of every embedded hardware engineer.',
        code: '// Debug toolkit\nprintf (debug UART)      → breadcrumbs\nLED toggle               → checkpoint reached\nLogic analyzer           → bytes on the wire\nOscilloscope             → timing\nSWD/JTAG debugger        → breakpoints, registers\n\n// Method\nreproduce → isolate layer → inspect the boundary\n\n// Next paths\nHAL/LL frameworks · Zephyr · linker scripts\nbootloaders · safety-critical embedded',
        note: 'Breadcrumbs, a debugger, and the isolate-the-layer method. You now have the full MCU skill set — go build.',
      },
    ],
    quizzes: [
      { text: 'The 32-bit mainstream MCU family is…', options: ['ARM Cortex-M', '8051', 'AVR only', 'PIC 8-bit only'], correctAnswer: 'ARM Cortex-M' },
      { text: 'Choose an RTOS when…', options: ['several tasks must run concurrently with different priorities', 'the project is tiny', 'you dislike loops', 'flash is full'], correctAnswer: 'several tasks must run concurrently with different priorities' },
      { text: 'Bare-metal firmware is…', options: ['a main loop scheduling everything', 'impossible', 'an RTOS', 'a web server'], correctAnswer: 'a main loop scheduling everything' },
      { text: 'The methodical debug method is…', options: ['reproduce → isolate the layer → inspect the boundary', 'rewire randomly', 'recompile blindly', 'buy a new chip'], correctAnswer: 'reproduce → isolate the layer → inspect the boundary' },
    ],
  },
];
