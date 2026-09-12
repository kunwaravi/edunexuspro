/**
 * Arduino — Hands-On Electronics & Coding — per-topic quizzes.
 * Keyed by the EXACT topic titles in arduino.ts (topic-lock flow).
 * 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in arduino.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'What Arduino Is & How It Fits In': [
    { text: 'Arduino is an open-source platform of…', options: ['microcontroller boards + a friendly IDE', 'web servers', 'desktop PCs', 'servo motors only'], correctAnswer: 'microcontroller boards + a friendly IDE' },
    { text: 'An Arduino compared to a PC…', options: ['runs one program at a time with no OS', 'runs Windows', 'has 16 cores', 'needs a GPU'], correctAnswer: 'runs one program at a time with no OS' },
    { text: 'The Uno\'s brain is the…', options: ['ATmega328P', 'Intel i5', 'Raspberry Pi', 'ESP32'], correctAnswer: 'ATmega328P' },
    { text: 'The analog inputs read…', options: ['0–1023 from a voltage', 'only HIGH/LOW', 'digital pulses', 'MAC addresses'], correctAnswer: '0–1023 from a voltage' },
  ],
  'The Arduino IDE & Your Toolchain': [
    { text: 'The required functions in every sketch are…', options: ['setup() and loop()', 'begin() and end()', 'init() and main()', 'start() and stop()'], correctAnswer: 'setup() and loop()' },
    { text: 'setup() runs…', options: ['once when the board starts', 'forever', 'every second', 'only on reset'], correctAnswer: 'once when the board starts' },
    { text: 'The Serial Monitor…', options: ['prints debug output from the board to your PC', 'deploys the sketch', 'wires the breadboard', 'measures voltage'], correctAnswer: 'prints debug output from the board to your PC' },
    { text: 'Before uploading you must select the…', options: ['board type and port', 'font and theme', 'Wi-Fi network', 'language'], correctAnswer: 'board type and port' },
  ],
  'Your First Program: Blinking an LED': [
    { text: 'The LED\'s long leg (anode) connects through a resistor to…', options: ['the digital pin', 'GND', '5V directly', 'nothing'], correctAnswer: 'the digital pin' },
    { text: 'digitalWrite(pin, HIGH)…', options: ['sets the pin to 5V (on)', 'sets it to 0V', 'reads it', 'disconnects it'], correctAnswer: 'sets the pin to 5V (on)' },
    { text: 'delay(1000) pauses for…', options: ['1000 milliseconds (1 second)', '1 microsecond', '100 seconds', '1 minute'], correctAnswer: '1000 milliseconds (1 second)' },
    { text: 'An LED that stays dark is often fixed by…', options: ['reversing the LED legs (polarity)', 'removing the resistor', 'using a longer delay', 'changing the USB port'], correctAnswer: 'reversing the LED legs (polarity)' },
  ],
  'Pins, Breadboards & Circuit Basics': [
    { text: 'On a breadboard, components connect by…', options: ['sharing the same row of holes', 'touching wires together', 'soldering', 'the IDE'], correctAnswer: 'sharing the same row of holes' },
    { text: 'The side rails on a breadboard carry…', options: ['power (VCC) and ground (GND)', 'only data', 'only clock', 'nothing'], correctAnswer: 'power (VCC) and ground (GND)' },
    { text: 'A digital pin reads…', options: ['LOW (0) or HIGH (1)', '0–1023', 'any voltage', 'a frequency'], correctAnswer: 'LOW (0) or HIGH (1)' },
    { text: 'The #1 cause of a non-working breadboard build is…', options: ['a missing ground connection', 'the IDE version', 'slow code', 'the LED colour'], correctAnswer: 'a missing ground connection' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Digital Outputs — Controlling LEDs & More': [
    { text: 'To set a pin as output you call…', options: ['pinMode(pin, OUTPUT)', 'digitalWrite(pin, HIGH)', 'analogRead(pin)', 'attachInterrupt(pin, …)'], correctAnswer: 'pinMode(pin, OUTPUT)' },
    { text: 'A safe maximum current per pin is…', options: ['about 20 mA', '1 A', '5 A', 'unlimited'], correctAnswer: 'about 20 mA' },
    { text: 'A for loop over an LED array…', options: ['drives each LED in sequence', 'destroys the pins', 'is forbidden', 'only works once'], correctAnswer: 'drives each LED in sequence' },
    { text: 'Motors and relays…', options: ['need a driver, not a raw digital pin', 'connect straight to pins', 'need no power', 'only work on analog pins'], correctAnswer: 'need a driver, not a raw digital pin' },
  ],
  'Digital Inputs & Button Debouncing': [
    { text: 'INPUT_PULLUP makes an unpressed button read…', options: ['HIGH (pressed → LOW)', 'LOW', 'random', 'floating'], correctAnswer: 'HIGH (pressed → LOW)' },
    { text: 'Button bounce is…', options: ['mechanical noise: one press looks like many', 'a wiring error', 'a code error', 'the button colour'], correctAnswer: 'mechanical noise: one press looks like many' },
    { text: 'Debouncing is done by…', options: ['checking, waiting ~20–50 ms, and re-checking (or time-gating)', 'pressing faster', 'a stronger pull-up', 'the loop() speed'], correctAnswer: 'checking, waiting ~20–50 ms, and re-checking (or time-gating)' },
    { text: 'Edge detection acts on…', options: ['the transition (LOW after HIGH), not the level', 'the button colour', 'the loop count', 'nothing'], correctAnswer: 'the transition (LOW after HIGH), not the level' },
  ],
  'Analog Inputs — Reading Voltage (Potentiometer)': [
    { text: 'analogRead(A0) returns…', options: ['0–1023', '0–255', 'HIGH/LOW', 'a percentage'], correctAnswer: '0–1023' },
    { text: 'A potentiometer\'s wiper (middle leg) connects to…', options: ['the analog pin', 'GND', '5V only', 'the clock'], correctAnswer: 'the analog pin' },
    { text: 'map(value, 0, 1023, 0, 255) rescales…', options: ['0–1023 into 0–255', 'a float into an int', 'volts into mA', 'nothing'], correctAnswer: '0–1023 into 0–255' },
    { text: 'A pot is useful as…', options: ['the universal test input for almost any project', 'a display', 'a motor', 'a Wi-Fi module'], correctAnswer: 'the universal test input for almost any project' },
  ],
  'PWM — Analog Output in a Digital World': [
    { text: 'PWM fakes analog output by…', options: ['switching HIGH/LOW very fast; duty cycle sets the average', 'changing the supply voltage', 'using a bigger resistor', 'raising the clock'], correctAnswer: 'switching HIGH/LOW very fast; duty cycle sets the average' },
    { text: 'PWM pins on the Uno are marked with…', options: ['a ~ symbol', 'an asterisk', 'a letter', 'a colour'], correctAnswer: 'a ~ symbol' },
    { text: 'analogWrite(pin, 128) gives…', options: ['about half duty cycle (mid brightness/speed)', 'full power', 'zero', 'a square wave of 128 Hz'], correctAnswer: 'about half duty cycle (mid brightness/speed)' },
    { text: 'PWM is used for…', options: ['LED brightness and motor speed (via driver)', 'reading sensors', 'serial data only', 'I2C addressing'], correctAnswer: 'LED brightness and motor speed (via driver)' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Serial Communication — Talking to Your PC': [
    { text: 'Serial.begin(9600)…', options: ['opens the serial channel at 9600 baud', 'starts a web server', 'reboots the board', 'prints hello'], correctAnswer: 'opens the serial channel at 9600 baud' },
    { text: 'To send text to the Serial Monitor you use…', options: ['Serial.print / Serial.println', 'digitalWrite', 'analogRead', 'Wire.begin'], correctAnswer: 'Serial.print / Serial.println' },
    { text: 'The first move when a project misbehaves is…', options: ['add more Serial.println debugging', 'rewire everything', 'buy a new board', 'remove the sensor'], correctAnswer: 'add more Serial.println debugging' },
    { text: 'Serial is your…', options: ['window into what the board is doing', 'power supply', 'ground reference', 'compiler'], correctAnswer: 'window into what the board is doing' },
  ],
  'Reading Sensors — Temperature & Distance': [
    { text: 'The LM35 outputs…', options: ['10 mV per °C', 'a PWM signal', 'a resistance', 'a serial string'], correctAnswer: '10 mV per °C' },
    { text: 'The HC-SR04 measures distance by…', options: ['measuring the echo time of an ultrasonic ping', 'reading a voltage', 'counting pulses', 'a magnet'], correctAnswer: 'measuring the echo time of an ultrasonic ping' },
    { text: 'pulseIn(ECHO, HIGH) returns…', options: ['the echo duration in microseconds', 'the temperature', 'a voltage', 'a Boolean'], correctAnswer: 'the echo duration in microseconds' },
    { text: 'Before trusting a converted reading you should…', options: ['print the raw value first', 'skip the datasheet', 'map it blindly', 'assume it is right'], correctAnswer: 'print the raw value first' },
  ],
  'Actuators — Servos & Motors': [
    { text: 'A servo is controlled with…', options: ['myservo.attach(pin) + myservo.write(angle)', 'analogRead', 'digitalWrite only', 'a potentiometer'], correctAnswer: 'myservo.attach(pin) + myservo.write(angle)' },
    { text: 'The Servo library is included with…', options: ['#include <Servo.h>', '#include <Wire.h>', '#include <SPI.h>', '#include <SD.h>'], correctAnswer: '#include <Servo.h>' },
    { text: 'A DC motor must be driven through…', options: ['a transistor/MOSFET or motor driver', 'a digital pin directly', 'an analog pin directly', 'a 220 Ω resistor'], correctAnswer: 'a transistor/MOSFET or motor driver' },
    { text: 'Motors and servos get power from…', options: ['a separate supply sharing only ground', 'the signal pin', 'the Arduino 5V rail only', 'the USB data line'], correctAnswer: 'a separate supply sharing only ground' },
  ],
  'A Sensor → LED/Serial Project': [
    { text: 'The universal project pattern is…', options: ['read → think → act', 'act → read → think', 'think → act → read', 'only act'], correctAnswer: 'read → think → act' },
    { text: 'Keeping the three phases separate means…', options: ['you can change one without touching the others', 'slower code', 'more wires', 'a bigger board'], correctAnswer: 'you can change one without touching the others' },
    { text: 'Small helper functions like readTemp() make a sketch…', options: ['readable and reusable', 'impossible to run', 'slower always', 'bigger forever'], correctAnswer: 'readable and reusable' },
    { text: 'An automatic night light reads light level and…', options: ['decides whether to turn the LED on', 'always keeps it on', 'reboots', 'prints forever'], correctAnswer: 'decides whether to turn the LED on' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'I2C — Talk to Many Devices on Two Wires': [
    { text: 'I2C uses the wires…', options: ['SDA (data) and SCL (clock)', 'MOSI and MISO', 'VCC and GND', 'TRIG and ECHO'], correctAnswer: 'SDA (data) and SCL (clock)' },
    { text: 'I2C devices are addressed by…', options: ['a unique address per device', 'their MAC', 'the pin number', 'the cable'], correctAnswer: 'a unique address per device' },
    { text: 'The Wire library is included with…', options: ['#include <Wire.h>', '#include <Servo.h>', '#include <SD.h>', '#include <EEPROM.h>'], correctAnswer: '#include <Wire.h>' },
    { text: 'When two I2C devices share an address, you should…', options: ['change one device\'s address via its address pins (or scan the bus)', 'remove one device', 'shorter wires', 'nothing'], correctAnswer: 'change one device\'s address via its address pins (or scan the bus)' },
  ],
  'SPI — High-Speed Peripherals': [
    { text: 'The four SPI wires are…', options: ['MOSI, MISO, SCLK, SS', 'SDA, SCL, VCC, GND', 'TRIG, ECHO, 5V, GND', 'RX, TX, D+, D-'], correctAnswer: 'MOSI, MISO, SCLK, SS' },
    { text: 'SPI selects a slave by…', options: ['pulling its SS line low', 'sending an address byte', 'its name', 'its MAC'], correctAnswer: 'pulling its SS line low' },
    { text: 'SPI is preferred over I2C when you need…', options: ['raw speed (SD cards, displays)', 'many devices on two wires', 'no clock', 'power'], correctAnswer: 'raw speed (SD cards, displays)' },
    { text: 'On the Uno the default SS pin is…', options: ['D10', 'D13', 'D2', 'A0'], correctAnswer: 'D10' },
  ],
  'Interrupts & Precise Timing': [
    { text: 'An interrupt…', options: ['runs a handler the moment a pin changes', 'polls pins faster', 'adds delay()', 'disables loop()'], correctAnswer: 'runs a handler the moment a pin changes' },
    { text: 'The Uno\'s interrupt pins are…', options: ['2 and 3', 'A0 and A1', '13 and 12', 'all pins'], correctAnswer: '2 and 3' },
    { text: 'The "blink without delay" pattern uses…', options: ['millis() to schedule instead of blocking', 'a faster delay', 'a second board', 'longer wires'], correctAnswer: 'millis() to schedule instead of blocking' },
    { text: 'Interrupt handlers should…', options: ['set a flag; do real work in loop()', 'do heavy work inside', 'sleep', 'call delay()'], correctAnswer: 'set a flag; do real work in loop()' },
  ],
  'Libraries & Writing Clean Sketches': [
    { text: 'Libraries are installed via…', options: ['the Library Manager', 'a USB stick', 'the Serial Monitor', 'the breadboard'], correctAnswer: 'the Library Manager' },
    { text: 'Libraries let you write…', options: ['high-level code like display.print()', 'only machine code', 'no code', 'CSS'], correctAnswer: 'high-level code like display.print()' },
    { text: 'Constants instead of magic numbers make code…', options: ['readable and maintainable', 'slower', 'impossible', 'longer always'], correctAnswer: 'readable and maintainable' },
    { text: 'Comments should say…', options: ['why, not what', 'nothing', 'only the author', 'the copyright'], correctAnswer: 'why, not what' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Designing the Project': [
    { text: 'A project should start with…', options: ['a written spec: goal, inputs, outputs, rules', 'the hardest circuit first', 'random wiring', 'buying parts'], correctAnswer: 'a written spec: goal, inputs, outputs, rules' },
    { text: 'Each build step should…', options: ['end in something testable', 'be skipped', 'touch every pin', 'take a week'], correctAnswer: 'end in something testable' },
    { text: 'Small testable steps are the difference between…', options: ['a working project and a mystery', 'fast and slow code', 'two boards', 'nothing'], correctAnswer: 'a working project and a mystery' },
    { text: 'The project spec records…', options: ['the goal, sensors, outputs and behaviour rules', 'only the price', 'the box colour', 'the USB type'], correctAnswer: 'the goal, sensors, outputs and behaviour rules' },
  ],
  'Building the Circuit & Powering Safely': [
    { text: 'The pre-power re-check includes…', options: ['common ground, pin map, polarity, supply voltage', 'pressing the reset', 'running the sketch', 'a longer USB'], correctAnswer: 'common ground, pin map, polarity, supply voltage' },
    { text: 'A motor sharing a ground with the board…', options: ['is correct — ground is common, power is separate', 'blows the board', 'is forbidden always', 'needs no ground'], correctAnswer: 'is correct — ground is common, power is separate' },
    { text: 'While rewiring you should…', options: ['unplug power first', 'keep it running', 'touch every pin', 'ignore it'], correctAnswer: 'unplug power first' },
    { text: 'A safe pin current limit is about…', options: ['20 mA', '2 A', '5 A', 'unlimited'], correctAnswer: '20 mA' },
  ],
  'Programming, Testing & Debugging': [
    { text: 'The first firmware phase is…', options: ['read the sensor raw and print it', 'write all rules', 'wire the enclosure', 'deploy'], correctAnswer: 'read the sensor raw and print it' },
    { text: 'A wrong raw value means…', options: ['wiring or the sensor, not your conversion', 'the IDE is broken', 'the board is dead', 'the rules are wrong'], correctAnswer: 'wiring or the sensor, not your conversion' },
    { text: 'Printing each rule branch tells you…', options: ['which layer is wrong when the output doesn\'t move', 'the price', 'the temperature', 'nothing'], correctAnswer: 'which layer is wrong when the output doesn\'t move' },
    { text: 'Edge cases to test include…', options: ['rule boundaries, sensor extremes and power-up behaviour', 'nothing', 'only the happy path', 'the box'], correctAnswer: 'rule boundaries, sensor extremes and power-up behaviour' },
  ],
  'Polishing, Packaging & Beyond Arduino': [
    { text: 'A finished project includes…', options: ['a tidy layout, enclosure, and a README', 'only working code', 'loose wires', 'a longer delay'], correctAnswer: 'a tidy layout, enclosure, and a README' },
    { text: 'The README should describe…', options: ['goal, wiring, and how to use it', 'only the price', 'the download link', 'nothing'], correctAnswer: 'goal, wiring, and how to use it' },
    { text: 'From Arduino, the road can lead to…', options: ['ESP32 IoT, PCB design, or embedded C', 'nothing', 'only games', 'only web apps'], correctAnswer: 'ESP32 IoT, PCB design, or embedded C' },
    { text: 'The foundations you now own include…', options: ['sensing, actuation, protocols and debugging', 'just blinking', 'only LEDs', 'only the IDE'], correctAnswer: 'sensing, actuation, protocols and debugging' },
  ],
};
