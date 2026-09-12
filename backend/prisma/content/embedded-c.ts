/**
 * Embedded C — Firmware for Microcontrollers — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in embedded-c_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · C for Embedded Systems ──────────────────────────────────────────
  {
    week: 1,
    title: 'C for Embedded Systems',
    description: 'The C features that matter on hardware: registers, bits, volatile and memory-mapped I/O.',
    topics: [
      {
        title: 'What Embedded C Is — C Where It Meets Hardware',
        text: 'Embedded C is C running close to the hardware — no operating system between you and the silicon. Your program talks to peripherals (GPIO, timers, UART) by reading and writing memory-mapped registers.\n\nCompared with application C, you care about: exact sizes (uint8_t, uint32_t), endianness, memory footprint, and timing. A while loop that spins forever is a bug in a desktop program but normal in firmware.\n\nThe mental shift: the program is a single forever loop servicing hardware, plus interrupt handlers that fire asynchronously. Master that model and the whole discipline follows.',
        code: '// A minimal embedded main\n#include <stdint.h>\n\nint main(void) {\n  GPIO->DIR |= (1u << 13);   // pin 13 as output\n  for (;;) {                  // the forever main loop\n    GPIO->OUT ^= (1u << 13);  // toggle\n    for (volatile uint32_t i = 0; i < 200000; i++) {}\n  }\n}',
        note: 'No OS, no exit, one loop forever. Registers are just memory addresses with datasheet meanings.',
      },
      {
        title: 'Registers & Memory-Mapped I/O',
        text: 'Peripherals are controlled through registers — 32-bit (or 8/16-bit) locations in the address space. The datasheet gives each register an address and a bit layout; the header file (like CMSIS for ARM) names them.\n\nThe pattern: read a register, modify the relevant bits, write it back. Never guess — the datasheet\'s register description tells you which bits do what, and which must stay untouched.\n\nUse the vendor header (CMSIS, HAL) where available; writing your own register map is a great learning exercise but a poor default. The register concept transfers to every MCU.',
        code: '// Registers are addresses with meanings\nGPIOB->MODER   // mode: input / output / alternate\nGPIOB->ODR     // output data: set the pin level\nGPIOB->IDR     // input data: read the pin level\n\n// (ARM Cortex names via CMSIS)\n// On an AVR, the same job uses DDRB / PORTB / PINB.',
        note: 'Every peripheral = a set of registers. The header + datasheet are your API reference.',
      },
      {
        title: 'Bit Manipulation — Setting, Clearing & Testing',
        text: 'Firmware lives in bits. The core tools: set a bit with reg |= (1u << n); clear with reg &= ~(1u << n); toggle with reg ^= (1u << n); test with (reg & (1u << n)) != 0.\n\nMultiple bits: a 2-bit field like a mode selector is masked and set — (reg & ~mask) then reg |= value << shift. Macros keep it readable: #define LED_PIN 13, #define BIT(p) (1u << p).\n\nPrefer masks and volatile casts over magic numbers. Bit-twiddling bugs are invisible to the eye — name everything.',
        code: '// The four core idioms\nreg |=  (1u << n);   // set bit n\nreg &= ~(1u << n);   // clear bit n\nreg ^=  (1u << n);   // toggle bit n\nif (reg & (1u << n)) // test bit n\n\n// Multi-bit field: replace bits [4:3] with value\nreg = (reg & ~(0b11u << 3)) | (value << 3);\n\n// Readable names\n#define LED_PIN 13\n#define BIT(p) (1u << (p))\nGPIO->ODR ^= BIT(LED_PIN);',
        note: 'Set, clear, toggle, test — the four idioms. Mask multi-bit fields. Name every bit with a macro.',
      },
      {
        title: 'volatile, const & Memory Ordering',
        text: 'volatile tells the compiler a variable can change behind its back — a register read in an ISR, or a hardware flag. Without it, the optimizer may cache the value and you\'ll read a stale one. Registers and ISR-shared variables must be volatile.\n\nconst says "don\'t modify" — used for lookup tables in flash. The two combine: volatile const uint32_t* means "read-only to me, changes anyway".\n\nMemory ordering (barriers like __DSB()) matters when you write a register and immediately read another — the compiler and CPU may reorder. Use volatile first, barriers when the datasheet demands it.',
        code: 'volatile uint32_t flags;              // changed by an ISR\n#define REG(x) (*(volatile uint32_t*)(x))  // memory-mapped I/O\n\nvolatile uint32_t tick = 0;\nvoid SysTick_Handler(void) { tick++; }    // ISR writes\n\n// main loop reads — volatile keeps it fresh\nif (tick - lastTick >= 1000) { /* 1s elapsed */ }\n\n// const for tables\nconst uint8_t sin_table[64] = { ... };',
        note: 'volatile = "don\'t cache me"; const = "don\'t write me". Registers and ISR variables both need volatile.',
      },
    ],
    quizzes: [
      { text: 'Embedded C runs…', options: ['directly on hardware with no OS between you and it', 'inside a browser', 'only on Windows', 'under Linux always'], correctAnswer: 'directly on hardware with no OS between you and it' },
      { text: 'Peripherals are controlled by…', options: ['reading and writing memory-mapped registers', 'the file system', 'HTML', 'system calls'], correctAnswer: 'reading and writing memory-mapped registers' },
      { text: 'To set bit n of a register you write…', options: ['reg |= (1u << n)', 'reg &= ~(1u << n)', 'reg ^= n', 'reg = n'], correctAnswer: 'reg |= (1u << n)' },
      { text: 'volatile tells the compiler…', options: ['the variable can change behind its back — don\'t cache it', 'the variable is constant', 'the variable is large', 'nothing'], correctAnswer: 'the variable can change behind its back — don\'t cache it' },
    ],
  },

  // ── W2 · GPIO & Registers ────────────────────────────────────────────────
  {
    week: 2,
    title: 'GPIO & Registers',
    description: 'Configure pins, drive outputs, read inputs, and structure clean, register-level firmware.',
    topics: [
      {
        title: 'GPIO Configuration — Mode, Speed & Pull-ups',
        text: 'Every pin must be configured before use: direction (input/output), mode (digital, analog, alternate function), and electrical options (pull-up/pull-down, speed, drive strength). On ARM Cortex this lives in the GPIO MODER, PULLUP and speed registers.\n\nSet the alternate-function register when a pin serves a peripheral like UART or SPI — that is how TX/RX become the serial port. Forgetting AF is the classic "nothing happens" bug.\n\nYour first task: turn on the GPIO peripheral\'s clock (peripheral clock enable), then configure the pin. Clock gating is why the register writes seem to do nothing otherwise.',
        code: '// Enable the GPIO block clock first\nRCC->AHB2ENR |= RCC_AHB2ENR_GPIOAEN;\n\n// Configure PA5 as output, push-pull, no pull\nGPIOA->MODER &= ~(0b11u << (5*2));\nGPIOA->MODER |=  (0b01u << (5*2));   // 01 = output\nGPIOA->OTYPER &= ~(1u << 5);          // push-pull\nGPIOA->PUPDR &= ~(0b11u << (5*2));    // no pull\n\n// Clock first, then registers. In that order.',
        note: 'Clock → mode → output. The clock gate is the silent killer — enable it or your writes vanish.',
      },
      {
        title: 'Driving Outputs — LEDs, Buzzers, Relays',
        text: 'An output pin sources or sinks current to drive an LED (via a current-limiting resistor), a buzzer, or — through a transistor/driver — a relay. Read the load\'s datasheet: a pin sinks/sources ~20 mA on most MCUs; beyond that you need a driver.\n\nActive-low wiring is common: a button or LED connected to ground so the pin goes LOW to activate. Know which convention your board uses before writing code.\n\nNever drive inductive loads (relays, motors) directly from a pin — their kick-back voltage will destroy the port. Flyback diode + transistor/driver is the rule.',
        code: '// LED on PA5, active-high, through 330Ω\nGPIOA->ODR |=  (1u << 5);   // LED on\nGPIOA->ODR &= ~(1u << 5);   // LED off\n\n// Buzzer on PB3 active-low\nGPIOB->ODR &= ~(1u << 3);   // LOW = on\n\n// Inductive loads: NEVER pin-direct.\n// Use a transistor + flyback diode (or a driver).',
        note: 'Match the wiring convention (active-high/low), respect the ~20 mA pin limit, and keep inductive loads off pins.',
      },
      {
        title: 'Reading Inputs — Switches & Debouncing in C',
        text: 'Read an input by testing the input-data register: if (GPIO->IDR & BIT(pin)). Configure the pin with a pull-up so an open switch reads a clean HIGH.\n\nMechanical switches bounce: the contact opens/closes for microseconds-to-ms, so one press reads as many transitions. Debounce by sampling: read, wait a short time, read again and require agreement (digital filter), or time-gate with a counter/timer.\n\nEdge detection (press vs release) is done by remembering the previous state and acting only on the change — the classic state-machine start.',
        code: '#define BTN 3\n// Debounce: require a stable LOW for N samples\nbool pressed = false;\nif (GPIO->IDR & BIT(BTN)) {   // currently HIGH\n  presses = 0; pressed = false;\n} else if (++presses > 10) {  // stable LOW\n  presses = 0;\n  if (!pressed) { pressed = true; onPress(); }\n}',
        note: 'Pull-up + sample-twice + edge-detect. Debounce in firmware so one click is one event.',
      },
      {
        title: 'Structuring Register-Level Firmware',
        text: 'Bare-metal code stays readable with layering: a board header for pin maps (#define LED PA5), a low-level driver per peripheral (gpio.c, timer.c), and application code on top that never touches registers directly.\n\nSplit into: gpio_init(), gpio_write(pin, level), a timer abstraction, and a scheduler-like main loop that calls services in turn. Give each driver a clean API and keep register details inside it.\n\nThe payoff: you can port the app to another MCU by swapping drivers — and debug at the layer you care about.',
        code: '// board.h — the single place pin names live\n#define LED_PIN  5\n#define BTN_PIN  3\n\n// gpio.c — registers stay here\nvoid gpio_init(void);\nvoid gpio_write(uint8_t pin, bool high);\nbool gpio_read(uint8_t pin);\n\n// main.c — no registers, just calls\nint main(void) {\n  gpio_init();\n  for (;;) {\n    if (gpio_read(BTN_PIN)) gpio_write(LED_PIN, true);\n  }\n}',
        note: 'Board header + drivers + app. Registers live in drivers; the main loop reads like English.',
      },
    ],
    quizzes: [
      { text: 'The first step before configuring any pin is…', options: ['enabling the GPIO block clock', 'writing to ODR', 'declaring a variable', 'calling delay()'], correctAnswer: 'enabling the GPIO block clock' },
      { text: 'A pin serving UART or SPI must be set to…', options: ['alternate function', 'digital output', 'analog input', 'no mode'], correctAnswer: 'alternate function' },
      { text: 'An inductive load like a relay must be driven…', options: ['through a transistor/driver with a flyback diode', 'directly from a pin', 'from the ADC', 'with no ground'], correctAnswer: 'through a transistor/driver with a flyback diode' },
      { text: 'Debouncing handles…', options: ['mechanical bounce so one press is one event', 'slow code', 'low voltage', 'the clock'], correctAnswer: 'mechanical bounce so one press is one event' },
    ],
  },

  // ── W3 · Timers & Interrupts ─────────────────────────────────────────────
  {
    week: 3,
    title: 'Timers & Interrupts',
    description: 'Measure time accurately, respond to events immediately, and keep the main loop coherent.',
    topics: [
      {
        title: 'Timers — Hardware Clocks at Your Service',
        text: 'Timers are hardware counters fed by a clock. They count up to a compare value, overflow, and can trigger actions or interrupts. They are the heartbeat of firmware: delays, timeouts, debounce windows, PWM.\n\nThe setup: pick the timer, prescale the clock (divide it down to a useful rate), set the counter period/compare value, enable the interrupt (or PWM output).\n\nWhy hardware timers beat delay loops: they run independently of the CPU, they\'re accurate, and they don\'t block — your code keeps doing useful work while the timer counts.',
        code: '// ARM Cortex SysTick — a 1 ms heartbeat\nSysTick->LOAD = SystemCoreClock / 1000 - 1;\nSysTick->VAL  = 0;\nSysTick->CTRL = SysTick_CTRL_ENABLE_Msk\n              | SysTick_CTRL_TICKINT_Msk\n              | SysTick_CTRL_CLKSOURCE_Msk;\n\nvolatile uint32_t tick_ms = 0;\nvoid SysTick_Handler(void) { tick_ms++; }\n\n// Later: timeouts without blocking\nif (tick_ms - start >= 500) { /* 500 ms passed */ }',
        note: 'Prescale → period → enable. Timer interrupts give you time without blocking the loop.',
      },
      {
        title: 'Interrupt Service Routines — The ISR Contract',
        text: 'An interrupt stops the main code, runs an ISR, and returns. ISRs are the only truly asynchronous code you write — with strict rules: keep them short, don\'t call slow functions, don\'t block, and only set flags or move data.\n\nConfiguration: enable the interrupt in the peripheral (e.g. the GPIO EXTI line), enable it at the NVIC (interrupt controller), and write the handler. The handler must clear the pending flag or it re-fires forever.\n\nThe golden pattern: ISR sets a flag / updates a variable; main loop notices and does the heavy work. This keeps latency low and the system responsive.',
        code: 'volatile bool button_pressed = false;\n\nvoid EXTI3_IRQHandler(void) {\n  if (EXTI->PR & (1u << 3)) {\n    EXTI->PR = (1u << 3);     // CLEAR the pending flag\n    button_pressed = true;    // just a flag\n  }\n}\n\nint main(void) {\n  for (;;) {\n    if (button_pressed) {\n      button_pressed = false;\n      doHeavyWork();          // real work in main\n    }\n  }\n}',
        note: 'Set a flag, clear the pending bit, return. The ISR contract is short, non-blocking, flag-setting.',
      },
      {
        title: 'Edges, Debounce & Interrupt-Driven Input',
        text: 'Interrupt-driven buttons are more responsive than polling: configure the pin as an external interrupt on the falling edge, and the ISR fires on the press. But you still must debounce — interrupts fire on every bounce.\n\nCombine edge ISR + a software timer: on edge, record the time; ignore further edges within a debounce window. This gives one clean event per press without blocking.\n\nKnow your ISR latency budget: if another long ISR is running, yours waits. Keep every ISR short and the system stays snappy.',
        code: 'volatile uint32_t last_edge = 0;\n\nvoid EXTI3_IRQHandler(void) {\n  if (EXTI->PR & (1u << 3)) {\n    EXTI->PR = (1u << 3);\n    uint32_t now = tick_ms;\n    if (now - last_edge > 50) {   // debounce window\n      last_edge = now;\n      button_pressed = true;\n    }\n  }\n}',
        note: 'Edge interrupt + timestamp + window = one clean event. Interrupts answer instantly, debounce filters the noise.',
      },
      {
        title: 'The Main Loop — Scheduling Multiple Jobs',
        text: 'Most firmware is one loop calling several services, each doing small chunks: read sensors, update display, check inputs, service communication. The superloop pattern:\n\nwhile(1) { service1(); service2(); service3(); } — simple, predictable, but jobs must be non-blocking. Each job checks its own timing (via tick_ms) and returns quickly.\n\nUse a tiny scheduler: flags set by ISRs, checked in the loop; time slots from the tick. That single loop + flags + tick pattern runs a huge amount of real firmware and is far easier to debug than preemptive threads.',
        code: 'int main(void) {\n  init_all();\n  for (;;) {\n    if (button_pressed)        handle_button();   // ISR flag\n    if (tick_ms - last_disp >= 250) { update_display(); last_disp = tick_ms; }\n    if (tick_ms - last_uart >= 1000) { send_heartbeat(); last_uart = tick_ms; }\n  }\n}\n\n// Every job is non-blocking and returns quickly.',
        note: 'One loop, flags from ISRs, time slots from the tick. Predictable, debuggable, and it powers real products.',
      },
    ],
    quizzes: [
      { text: 'Timers are…', options: ['hardware counters that run independently of the CPU', 'software delays', 'ISR flags', 'memory'], correctAnswer: 'hardware counters that run independently of the CPU' },
      { text: 'An ISR must…', options: ['be short, set flags, and clear its pending bit', 'do the whole job', 'call delay()', 'print to a screen'], correctAnswer: 'be short, set flags, and clear its pending bit' },
      { text: 'The golden ISR pattern is…', options: ['ISR sets a flag; the main loop does the heavy work', 'ISR does everything', 'no ISRs at all', 'ISR sleeps'], correctAnswer: 'ISR sets a flag; the main loop does the heavy work' },
      { text: 'The superloop pattern…', options: ['runs several non-blocking jobs in one loop', 'blocks forever', 'uses threads', 'is forbidden'], correctAnswer: 'runs several non-blocking jobs in one loop' },
    ],
  },

  // ── W4 · Serial Protocols ────────────────────────────────────────────────
  {
    week: 4,
    title: 'Serial Protocols',
    description: 'UART, SPI and I2C — the three wires of embedded communication — plus datasheet literacy.',
    topics: [
      {
        title: 'UART — The Simple Two-Wire Serial Link',
        text: 'UART (universal asynchronous receiver/transmitter) sends bytes over two wires: TX and RX (crossover — your TX goes to the other\'s RX). It is asynchronous: no clock wire — both sides agree on a baud rate.\n\nFrame anatomy: start bit, 8 data bits, optional parity, stop bit. The UART peripheral handles framing; you read/write registers (or the HAL) and get a byte at a time. Config: baud, word length, parity, stop bits — usually 8N1 (8 bits, no parity, 1 stop).\n\nUART is the debugging backbone: a serial terminal (Tera Term, minicom) shows your printf output. Make a debug UART + a printf redirect your first peripheral — every future diagnosis gets easier.',
        code: '// 8N1: 8 data bits, no parity, 1 stop bit\n// TX of A → RX of B, and B\'s TX → A\'s RX\n\n// Polled TX on a UART register\nvoid uart_putc(char c) {\n  while (!(USART->ISR & USART_ISR_TXE));  // wait for empty\n  USART->TDR = c;\n}\n\nvoid uart_puts(const char* s) {\n  while (*s) uart_putc(*s++);\n}\n\n// Redirect printf to uart_putc → Serial debug\nint _write(int fd, char* buf, int n) { … }',
        note: 'Two wires, agreed baud, 8N1. Redirect printf to a debug UART and you gain eyes.',
      },
      {
        title: 'SPI — Fast, Full-Duplex, Chip-Select',
        text: 'SPI is the high-speed bus: MOSI, MISO, SCLK and one chip-select (SS) per slave. The master drives the clock; both directions transfer simultaneously (full duplex). Four modes select clock polarity/phase.\n\nTransactions: pull SS low to select the slave, shift bytes in/out on the clock, release SS. SPI is faster than I2C and simpler in timing, at the cost of a wire per device.\n\nReal devices: SD cards, flash, displays, many sensors. The vendor library (or a driver) handles the register dance; you must know the pin map and the transaction pattern.',
        code: '// SPI master transaction\nvoid spi_xfer(uint8_t* out, uint8_t* in, uint16_t n) {\n  GPIO->ODR &= ~BIT(SS_PIN);      // select slave\n  for (uint16_t i = 0; i < n; i++) {\n    // write out[i] to TX reg, read RX reg into in[i]\n    SPI->DR = out[i];\n    while (!(SPI->SR & SPI_SR_RXNE));\n    in[i] = SPI->DR;\n  }\n  GPIO->ODR |= BIT(SS_PIN);       // release\n}',
        note: 'SS low → clock bytes in/out → SS high. Full duplex and fast, one wire per device.',
      },
      {
        title: 'I2C — Two Wires, Many Devices',
        text: 'I2C uses just SDA + SCL, with every device addressed by a 7-bit address. The master clocks, addresses a slave, and reads or writes its registers. Slower than SPI but minimal wiring.\n\nThe transaction: START, address byte (with R/W bit), the device ACKs, data bytes, STOP. The master must manage ACK/NACK states and repeated starts for read-after-write.\n\nGotchas: address conflicts (change via module pins), pull-up resistors required on both lines, and devices that need a specific register sequence to return data. An I2C scanner that probes all addresses is your friend.',
        code: '// I2C write: START | addr+W | reg | data... | STOP\nI2C1->CR1 |= I2C_CR1_START;\n// wait for SB, send address\n// wait for ADDR, send register byte\n// send data, set STOP\n\n// Read: START | addr+W | reg | RESTART | addr+R | data... | NACK | STOP\n\n// 7-bit address, e.g. 0x27 for an I2C LCD backpack\n// Both SDA and SCL need pull-ups (typically 4.7kΩ).',
        note: 'Address + register + data with ACK management. Two wires for a whole bus — pull-ups are mandatory.',
      },
      {
        title: 'Reading Datasheets Like an Engineer',
        text: 'The datasheet is the source of truth for every register, pin and timing value. Read it in a standard order: feature summary → pin diagram → block diagram → electrical characteristics (absolute maximums!) → register map → peripheral descriptions → application notes.\n\nThe electrical characteristics table is non-negotiable: max input voltage, pin sink/source current, ADC reference — exceeding them kills the chip. Then the register map tells you what to write.\n\nWhen the code "should" work but doesn\'t, re-read the datasheet for the step you skipped — a needed enable bit, a required sequence, a clock that must start first. The answer is almost always in the document.',
        code: '// Datasheet reading order\n1. Feature summary      what it is\n2. Pin diagram          what connects where\n3. Electrical specs     absolute maximums!\n4. Register map         what to write\n5. Peripheral docs      how a block works\n6. Application notes    how to use it well\n\n// When stuck: the missing step is usually\n// "enable the clock" or "a required sequence".',
        note: 'Datasheets are dense but ordered. Electrical specs first, register map next — and the answer to most bugs lives on page one of the peripheral section.',
      },
    ],
    quizzes: [
      { text: 'UART is asynchronous, meaning…', options: ['no clock wire — both sides agree on a baud rate', 'a clock wire is required', 'it uses Wi-Fi', 'it is parallel'], correctAnswer: 'no clock wire — both sides agree on a baud rate' },
      { text: '8N1 means…', options: ['8 data bits, no parity, 1 stop bit', '8 pins, no power, 1 board', '8 bytes, no checksum, 1 ms', 'none'], correctAnswer: '8 data bits, no parity, 1 stop bit' },
      { text: 'SPI selects a slave by…', options: ['pulling its SS line low', 'an address byte', 'its MAC', 'its name'], correctAnswer: 'pulling its SS line low' },
      { text: 'I2C addresses devices by…', options: ['a 7-bit address over two wires (SDA + SCL)', 'a chip-select wire', 'a baud rate', 'a MAC'], correctAnswer: 'a 7-bit address over two wires (SDA + SCL)' },
    ],
  },

  // ── W5 · Firmware Project & Debugging ────────────────────────────────────
  {
    week: 5,
    title: 'Firmware Project & Debugging',
    description: 'Design a complete firmware project, debug it methodically, and learn how real devices fail.',
    topics: [
      {
        title: 'Designing the Firmware Project',
        text: 'The capstone: a weather station — a temperature/humidity sensor (DHT22 or an I2C sensor), read on a schedule, shown on an LCD, with a fan output rule and a serial log. Define the behaviour on paper before code.\n\nThe architecture: sensor driver → data structure → display driver + fan driver + log. A timer ISR ticks; a state machine drives the sequence: init → measure → display → control → idle. Each state is a function; the loop dispatches on the current state.\n\nWrite the sequence and the rules first. Then each driver is a small, testable unit.',
        code: '// Weather-station spec\n// Sensor:  DHT22 temp/humidity\n// Outputs: LCD (I2C 16×2), fan on PA5\n// Schedule: measure every 2 s\n// Rules:   temp > 30°C → fan ON; else OFF\n\n// States\nenum { INIT, MEASURE, DISPLAY, CONTROL, IDLE };\n\n// Loop dispatches\nfor (;;) {\n  switch (state) {\n    case INIT:     sensor_init(); lcd_init(); state = MEASURE; break;\n    case MEASURE:  read_sensor(); state = DISPLAY; break;\n    case DISPLAY:  lcd_show(temp, hum); state = CONTROL; break;\n    case CONTROL:  fan_ctrl(temp); state = IDLE; break;\n    case IDLE:     if (tick_ms - t0 >= 2000) { t0 = tick_ms; state = MEASURE; } break;\n  }\n}',
        note: 'Spec first, then drivers, then a state machine. The state machine is the skeleton that keeps every job honest.',
      },
      {
        title: 'Building the Drivers & Wiring It Together',
        text: 'Write each driver as an isolated module with a clean API: dht22_read() returns temp/humidity, lcd_show() formats and prints, fan_ctrl() sets the PWM. Registers stay inside the driver files.\n\nWire sensors to the right pins (DHT22 data → a GPIO, VCC → 3.3V, GND → GND), connect the I2C LCD to SDA/SCL, and the fan through a transistor. Then build the software in the same order: blink LED (board alive) → serial prints (toolchain) → sensor read (data flows) → LCD (display works) → fan (actuation) → rules (integration).\n\nEach milestone is a checkpoint — if something fails, you know exactly which layer to blame.',
        code: '// dht22.c — registers hidden, API clean\nbool dht22_read(float* temp, float* hum);\n\n// lcd.c\nvoid lcd_init(void);\nvoid lcd_show(float t, float h);\n\n// fan.c\nvoid fan_init(void);   // PWM on the fan pin\nvoid fan_ctrl(bool on);\n\n// main.c wires them together via the state machine\n// Build order: LED → serial → sensor → LCD → fan → rules',
        note: 'Driver per device, API per driver, milestone per layer. The build order is the debug plan in reverse.',
      },
      {
        title: 'Debugging Firmware Methodically',
        text: 'Firmware bugs live in the same places: an unenabled clock, a wrong pin, a missing bit, a stale volatile, or a bad protocol handshake. Debug with the right tools and a method.\n\nThe toolkit: a logic analyzer (cheap ones decode UART/SPI/I2C), the debug UART for printf tracing, an oscilloscope for timing, and an LED you can toggle at checkpoints. printf around every layer: "GPIO configured", "sensor start", "sensor read temp=28.4".\n\nThe method: reproduce → isolate the layer → inspect at the boundary. Sensor returns garbage? Check wiring and the driver with a logic analyzer. Display blank but sensor prints? The LCD layer is the problem.',
        code: '// printf breadcrumbs\nprintf("sensor: start read\\n");\nif (dht22_read(&t, &h)) {\n  printf("sensor: ok temp=%.1f hum=%.1f\\n", t, h);\n} else {\n  printf("sensor: FAIL\\n");\n}\n\n// LED checkpoint\nLED_ON();  // we reached this line\n\n// Logic analyzer answers "did the bytes go out?"\n// Oscilloscope answers "is the timing right?"',
        note: 'Breadcrumbs + logic analyzer + one LED. Reproduce, isolate the layer, inspect at the boundary.',
      },
      {
        title: 'From Bare Metal to Production Firmware',
        text: 'Real firmware grows beyond one loop: an RTOS (FreeRTOS) for concurrency, robust error handling (watchdogs, reset causes), bootloaders and OTA updates, and safety patterns like checksums and plausibility checks on sensor data.\n\nStructure scales: keep drivers clean, use a board abstraction, log with levels, and store calibration/config in flash. Write the reset-cause register on boot — "why did we reboot?" is the first question in the field.\n\nFrom here: move to higher-level toolchains (STM32CubeIDE with HAL, Zephyr), or go deeper (linker scripts, bootloaders, safety-critical C). You now hold the full skill set: registers, drivers, ISRs, protocols and debugging — the core of every embedded engineer.',
        code: '// Production additions\n- Watchdog (reboot if the loop hangs)\n- Reset-cause log ("why did we reboot?")\n- Config/calibration in flash (not hardcoded)\n- Checksums + plausibility on sensor data\n- Bootloader → OTA update path\n- Logging with levels (error/warn/info/debug)\n\n// Next paths\nSTM32CubeIDE/HAL  → faster bring-up, big ecosystem\nZephyr RTOS       → modern, portable firmware\nLinker scripts    → deep memory control',
        note: 'RTOS, watchdogs, OTA, sanity checks — that is the gap between a project and a product. And you have the base to cross it.',
      },
    ],
    quizzes: [
      { text: 'A state machine drives the project by…', options: ['dispatching on the current state each loop', 'blocking forever', 'calling delay()', 'using threads'], correctAnswer: 'dispatching on the current state each loop' },
      { text: 'The build order that doubles as a debug plan is…', options: ['LED → serial → sensor → display → actuation → rules', 'everything at once', 'rules first', 'display first'], correctAnswer: 'LED → serial → sensor → display → actuation → rules' },
      { text: 'The tool that decodes UART/SPI/I2C bytes is…', options: ['a logic analyzer', 'an oscilloscope only', 'a multimeter', 'a screwdriver'], correctAnswer: 'a logic analyzer' },
      { text: 'The first question for a device that rebooted in the field is…', options: ['what was the reset cause?', 'what colour is the LED?', 'how old is the firmware?', 'who soldered it?'], correctAnswer: 'what was the reset cause?' },
    ],
  },
];
