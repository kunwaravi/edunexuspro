/**
 * Arduino — Hands-On Electronics & Coding — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in arduino_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Arduino Basics ───────────────────────────────────────────────────
  {
    week: 1,
    title: 'Arduino Basics',
    description: 'The board, the IDE, your first program, and the fundamentals of wiring.',
    topics: [
      {
        title: 'What Arduino Is & How It Fits In',
        text: 'Arduino is an open-source electronics platform: affordable microcontroller boards plus a friendly programming environment. An Arduino is a small computer that reads inputs (sensors, buttons) and drives outputs (LEDs, motors).\n\nCompared to a PC it has no operating system and runs one program at a time — but it is cheap, reliable, low-power and talks directly to hardware.\n\nThe classic starter board is the Uno with an ATmega328P: 14 digital I/O pins, 6 analog inputs, and a USB port for programming and power. The same skills carry to Nano, Mega, and ESP32 boards later.',
        code: '// The classic Uno at a glance\nATmega328P        the microcontroller brain\n14 digital pins    0–13 (HIGH/LOW inputs or outputs)\n6 analog pins      A0–A5 (read 0–1023 from voltage)\nUSB                program + power\n5V / 3.3V          power rails\nGND                common ground',
        note: 'Think of Arduino as "a microcontroller you can program in minutes". The Uno is the class standard.',
      },
      {
        title: 'The Arduino IDE & Your Toolchain',
        text: 'The Arduino IDE (or the newer Arduino Cloud / PlatformIO in VS Code) is where you write sketches. A sketch has two required functions: setup() runs once when the board starts, and loop() runs forever after that.\n\nStructure: void setup() { pinMode(13, OUTPUT); } then void loop() { digitalWrite(13, HIGH); delay(1000); }. The IDE compiles and uploads via USB with one button.\n\nSerial Monitor prints debug output from the board to your PC — your window into what the Arduino is doing. Get the board type and port right in Tools, and uploading becomes boring and reliable.',
        code: '// The skeleton every sketch shares\nvoid setup() {\n  // runs once on power-up\n}\n\nvoid loop() {\n  // runs forever\n}\n\n// Serial monitor (debugging window)\nvoid setup() {\n  Serial.begin(9600);        // start at 9600 baud\n  Serial.println("Hello!");\n}',
        note: 'setup once, loop forever. If a program misbehaves, Serial.print at each step finds where.',
      },
      {
        title: 'Your First Program: Blinking an LED',
        text: 'The "hello world" of hardware: make an LED blink. Wire the LED\'s anode (long leg) through a 220 Ω resistor to digital pin 13, and the cathode (short leg) to GND. On the Uno, pin 13 also has an onboard LED.\n\nThe program: set the pin as output in setup, then in loop alternate HIGH (on) and LOW (off) with a delay. delay(1000) pauses one second.\n\nWhat you\'re learning: digital output, current limiting (the resistor), and the concept that code controls hardware. If the LED stays dark, flip the legs — LEDs are polarized.',
        code: 'const int LED_PIN = 13;\n\nvoid setup() {\n  pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_PIN, HIGH);   // on\n  delay(1000);                   // 1 second\n  digitalWrite(LED_PIN, LOW);    // off\n  delay(1000);\n}\n\n// Wiring\nLED + (long leg) ── 220Ω ── pin 13\nLED - (short leg) ── GND',
        note: 'Blink is small but complete: wiring, current limiting, digital output, and timing. Master it and the board is yours.',
      },
      {
        title: 'Pins, Breadboards & Circuit Basics',
        text: 'The breadboard lets you prototype without soldering. Rows of five holes are connected horizontally in the middle; the long side rails carry power (VCC) and ground (GND). Components share connections by sharing the same row.\n\nAlways break ground to every part of your circuit — a missing GND is the #1 cause of "why isn\'t this working?". Supply voltage is 5V from the board for most sensors; 3.3V for logic-level and some sensors.\n\nRead the resistor colour bands to confirm value (220 Ω = red red brown). A digital pin outputs 0V or 5V; reading a pin reports LOW (0) or HIGH (1). Start every build with a simple LED so you know the power rails work.',
        code: '// Breadboard anatomy\n┌────────────────────────────┐\n│ + ┤  ●  ●  ●  ●  ●  ●  ●  │  power rail\n│ - ┤  ●  ●  ●  ●  ●  ●  ●  │  ground rail\n│   ┌─────────────────────┐  │\n│   │ ● ● ● ● ●          │  │  rows connect\n│   │ ● ● ● ● ●          │  │  (5 holes per row)\n│   └─────────────────────┘  │\n└────────────────────────────┘',
        note: 'Rows connect components; the rails carry power. A solid ground trace fixes most first-builds.',
      },
    ],
    quizzes: [
      { text: 'Arduino is…', options: ['an open-source electronics platform: boards + IDE', 'a Windows program', 'a web framework', 'a motor'], correctAnswer: 'an open-source electronics platform: boards + IDE' },
      { text: 'The two required functions in every sketch are…', options: ['setup() and loop()', 'start() and stop()', 'init() and run()', 'main() and exit()'], correctAnswer: 'setup() and loop()' },
      { text: 'The LED resistor (220 Ω) exists to…', options: ['limit the current through the LED', 'make it brighter', 'slow the blink', 'protect the USB'], correctAnswer: 'limit the current through the LED' },
      { text: 'The number one cause of "it won\'t work" in breadboard builds is…', options: ['a missing ground connection', 'the IDE version', 'a fast processor', 'the USB cable colour'], correctAnswer: 'a missing ground connection' },
    ],
  },

  // ── W2 · Digital & Analog I/O ────────────────────────────────────────────
  {
    week: 2,
    title: 'Digital & Analog I/O',
    description: 'Read and write the two signal types: digital on/off, and analog voltage levels.',
    topics: [
      {
        title: 'Digital Outputs — Controlling LEDs & More',
        text: 'A digital output can drive an LED, buzzer, relay or logic input: pinMode(pin, OUTPUT); then digitalWrite(pin, HIGH/LOW). Multiple LEDs on a common circuit show how outputs scale — each pin drives its own load through its own resistor.\n\nBuild a traffic light or a Knight Rider sweep: a for loop turns LEDs on and off in sequence. Use constants and arrays so the sketch stays readable.\n\nRemember current limits: each pin can source ~20 mA safely, and total board current is limited. Driving a motor or relay directly is out of scope for digital pins — that needs a driver or transistor (later module).',
        code: 'const int LED1 = 8, LED2 = 9, LED3 = 10;\n\nvoid setup() {\n  pinMode(LED1, OUTPUT);\n  pinMode(LED2, OUTPUT);\n  pinMode(LED3, OUTPUT);\n}\n\nvoid loop() {\n  // sweep right\n  for (int i = LED1; i <= LED3; i++) {\n    digitalWrite(i, HIGH); delay(150);\n    digitalWrite(i, LOW);\n  }\n  // sweep left\n  for (int i = LED3; i >= LED1; i--) {\n    digitalWrite(i, HIGH); delay(150);\n    digitalWrite(i, LOW);\n  }\n}',
        note: 'Array + for loop = any LED pattern. Keep each LED on its own pin with its own resistor.',
      },
      {
        title: 'Digital Inputs & Button Debouncing',
        text: 'Read a button with pinMode(pin, INPUT_PULLUP) — the internal pull-up makes the pin read HIGH by default, and pressing the button pulls it LOW. No external resistor needed.\n\nMechanical buttons bounce: the contact physically opens and closes for a few milliseconds, so one press looks like many. Fix with debouncing — check the pin, wait ~20 ms, check again, or record the last change time and ignore anything within 50 ms.\n\nEdge detection matters too: act on the transition (LOW after HIGH) rather than the level, so one press triggers one action.',
        code: 'const int BTN = 2;\nconst int LED = 13;\n\nvoid setup() {\n  pinMode(BTN, INPUT_PULLUP);\n  pinMode(LED, OUTPUT);\n}\n\nvoid loop() {\n  static unsigned long lastChange = 0;\n  static int lastState = HIGH;\n\n  int state = digitalRead(BTN);\n  if (state != lastState) {\n    lastChange = millis();        // remember when\n  }\n  if ((millis() - lastChange) > 50 && state != digitalRead(BTN)) {\n    lastState = state;\n    digitalWrite(LED, state == LOW ? HIGH : LOW);\n  }\n}',
        note: 'INPUT_PULLUP inverts the logic: released = HIGH, pressed = LOW. Debounce with time, not hope.',
      },
      {
        title: 'Analog Inputs — Reading Voltage (Potentiometer)',
        text: 'Analog pins read a voltage and convert it to a number: analogRead(pin) returns 0–1023 for 0–5V. A potentiometer (pot) is a variable resistor: turning the knob changes the voltage on its wiper.\n\nWire the pot: outer legs to 5V and GND, wiper (middle) to A0. The sketch prints the raw value and can map it to a range — map(raw, 0, 1023, 0, 255).\n\nThe magic of map(): turn the knob and produce a brightness, a position, a speed. A pot is the universal test-input for almost every project.',
        code: 'const int POT = A0;\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int raw = analogRead(POT);       // 0..1023\n  int pct = map(raw, 0, 1023, 0, 100);\n  Serial.print("raw="); Serial.print(raw);\n  Serial.print(" pct="); Serial.println(pct);\n  delay(100);\n}\n\n// Wiring\n5V ── pot ── GND\n     └── wiper ── A0',
        note: 'A0–A5 give you a 0–1023 window onto the real world. map() turns that window into anything.',
      },
      {
        title: 'PWM — Analog Output in a Digital World',
        text: 'Arduino pins are digital — they can only output 0V or 5V. PWM (Pulse Width Modulation) fakes an analog output by switching very fast: the proportion of time the pin is HIGH (the duty cycle) controls the average voltage. analogWrite(pin, 0–255) sets it.\n\nPWM pins on the Uno carry a ~ near their number: 3, 5, 6, 9, 10, 11. analogWrite(9, 128) gives roughly half brightness.\n\nWhere it shines: LED brightness, motor speed (via a driver), servo signals (though servos use the width of the pulse, not duty), and smooth fades. Fading an LED up and down is the classic PWM demo.',
        code: 'const int LED = 9;   // ~ PWM pin\n\nvoid setup() {\n  pinMode(LED, OUTPUT);\n}\n\nvoid loop() {\n  for (int b = 0; b <= 255; b++) {\n    analogWrite(LED, b);   // 0..255 duty cycle\n    delay(8);\n  }\n  for (int b = 255; b >= 0; b--) {\n    analogWrite(LED, b);\n    delay(8);\n  }\n}',
        note: 'PWM is a fast on/off switch — the eye (or motor) averages it out. analogWrite 0–255 controls the duty.',
      },
    ],
    quizzes: [
      { text: 'A digital pin can…', options: ['output 0V or 5V (HIGH/LOW)', 'output 0–255 continuously', 'read fractions', 'supply 1A'], correctAnswer: 'output 0V or 5V (HIGH/LOW)' },
      { text: 'Button bouncing is fixed with…', options: ['debouncing — check, wait, re-check or time-gate', 'a longer wire', 'INPUT instead of INPUT_PULLUP', 'a faster loop'], correctAnswer: 'debouncing — check, wait, re-check or time-gate' },
      { text: 'analogRead returns…', options: ['0–1023 for 0–5V', '0–255', 'HIGH/LOW', 'a float'], correctAnswer: '0–1023 for 0–5V' },
      { text: 'PWM simulates analog output by…', options: ['switching HIGH/LOW very fast; duty cycle sets the average', 'changing the voltage level', 'using a resistor', 'changing the ground'], correctAnswer: 'switching HIGH/LOW very fast; duty cycle sets the average' },
    ],
  },

  // ── W3 · Sensors, Actuators & Serial ─────────────────────────────────────
  {
    week: 3,
    title: 'Sensors, Actuators & Serial',
    description: 'Bring the real world in with sensors, act on it with motors and servos, and watch it all on Serial.',
    topics: [
      {
        title: 'Serial Communication — Talking to Your PC',
        text: 'Serial sends data between the board and your PC over USB. Serial.begin(9600) opens the channel, Serial.print/println sends text, Serial.available() + Serial.read() receive. The Serial Monitor on the PC shows what the board prints — and lets you type back to it.\n\nWhy it matters: serial is your debugger. Print sensor values, print state transitions, print "entering mode X". When a project misbehaves, the first move is more Serial.println.\n\nBinary protocols like I2C also run over serial lines, just with different framing — learning this now prepares you for the bus protocols next week.',
        code: 'void setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  if (Serial.available()) {\n    char c = Serial.read();\n    Serial.print("You typed: ");\n    Serial.println(c);\n  }\n  delay(20);\n}\n\n// Receive integers: Serial.parseInt() reads until non-digit',
        note: 'When in doubt, print it. Serial is the difference between "works by luck" and "works by understanding".',
      },
      {
        title: 'Reading Sensors — Temperature & Distance',
        text: 'Sensors turn physical quantities into signals your Arduino can read. Two common types:\n\nAnalog sensors — the LM35 temperature sensor outputs 10 mV per °C; voltage ÷ 0.01 gives degrees. Read with analogRead, then convert.\n\nUltrasonic distance — the HC-SR04 sends a ping and measures the echo time; distance = time × speed of sound / 2. Drive the TRIG pin, pulse it 10 µs, then pulseIn(Echo, HIGH) measures the return time in microseconds.\n\nEvery sensor reads a little differently — always consult its datasheet for the conversion formula, and print raw values first before trusting any reading.',
        code: '// Temperature (LM35): 10 mV per °C\nint raw = analogRead(A0);\nfloat volts = raw * (5.0 / 1023.0);\nfloat tempC = volts * 100.0;\n\n// Distance (HC-SR04)\nconst int TRIG = 9, ECHO = 10;\nvoid setup() {\n  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);\n  Serial.begin(9600);\n}\nvoid loop() {\n  digitalWrite(TRIG, LOW); delayMicroseconds(2);\n  digitalWrite(TRIG, HIGH); delayMicroseconds(10);\n  digitalWrite(TRIG, LOW);\n  long t = pulseIn(ECHO, HIGH);\n  float cm = t * 0.034 / 2;\n  Serial.print(cm); Serial.println(" cm");\n  delay(300);\n}',
        note: 'Datasheet first, then a raw-value sanity print. Never trust a converted reading you haven\'t seen raw.',
      },
      {
        title: 'Actuators — Servos & Motors',
        text: 'Actuators make things move. A servo (SG90) turns to a precise angle: Servo.h + myservo.attach(pin) + myservo.write(angle). Wire power (red) to 5V, ground (brown) to GND, signal (orange) to a PWM pin. It needs a stable 5V — often from the USB rail, not pin power.\n\nA DC motor just spins: control it with a transistor/MOSFET or a motor driver (L298N) because motors draw far more current than a pin can supply, and their back-EMF would reset your board.\n\nRule of thumb: signals are safe to drive from pins; power hungry things (motors, solenoids, relays) need a driver and a separate power supply, sharing only ground.',
        code: '#include <Servo.h>\nServo myservo;\n\nvoid setup() {\n  myservo.attach(9);   // PWM pin\n}\n\nvoid loop() {\n  myservo.write(0);    delay(500);\n  myservo.write(90);   delay(500);\n  myservo.write(180);  delay(500);\n}\n\n// Servo colours\nred = 5V   brown = GND   orange = signal\n// Motor safety: never drive a motor from a pin — use a driver.',
        note: 'Servos are driven by the Servo library; motors need a driver chip. Power and signal must never share one pin.',
      },
      {
        title: 'A Sensor → LED/Serial Project',
        text: 'Combine what you have: read a sensor, decide, and act. An automatic night light (light sensor or LDR → LED on when dark), a temperature alert (buzzer above 30 °C), or a distance alarm (LED + beep when something comes close).\n\nThe pattern every project shares: read → think (convert/compare) → act. Keep the three phases clearly separated in the code so you can change one without touching the others.\n\nStructure wins: constants at top, setup() for pin modes, loop() calling small functions: float readTemp() { … } then void actOnTemp(float t) { … }. This is how every future project should be built.',
        code: 'const int LDR = A0;     // light sensor\nconst int LED = 9;\n\nvoid setup() {\n  pinMode(LED, OUTPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int light = analogRead(LDR);\n  // darker = lower reading on a pull-down LDR\n  if (light < 400) {\n    analogWrite(LED, 200);       // act: light up\n  } else {\n    analogWrite(LED, 0);\n  }\n  Serial.print("light="); Serial.println(light);\n  delay(100);\n}',
        note: 'Read → decide → act. Three phases, three functions, one readable loop. That is the project pattern.',
      },
    ],
    quizzes: [
      { text: 'The Arduino\'s debugging window to the PC is…', options: ['the Serial Monitor', 'a web browser', 'the terminal only', 'the breadboard'], correctAnswer: 'the Serial Monitor' },
      { text: 'The LM35 outputs…', options: ['10 mV per °C', 'a digital signal', 'PWM', 'a frequency'], correctAnswer: '10 mV per °C' },
      { text: 'A DC motor must be driven through…', options: ['a driver/transistor with a separate power supply', 'a digital pin directly', 'a resistor to 5V', 'the analog pins'], correctAnswer: 'a driver/transistor with a separate power supply' },
      { text: 'The universal project pattern is…', options: ['read → think → act', 'act → read → think', 'think only', 'act only'], correctAnswer: 'read → think → act' },
    ],
  },

  // ── W4 · Protocols & Advanced I/O ────────────────────────────────────────
  {
    week: 4,
    title: 'Protocols & Advanced I/O',
    description: 'The I2C and SPI buses, interrupts, timing, and writing structured, reusable sketches.',
    topics: [
      {
        title: 'I2C — Talk to Many Devices on Two Wires',
        text: 'I2C lets many devices share just two wires: SDA (data) and SCL (clock). Each device has an address, and the bus selects the right one. The Arduino is the master; the sensor, display or EEPROM are slaves.\n\nThe Wire library: Wire.begin() to join, Wire.beginTransmission(addr), Wire.write(bytes), Wire.endTransmission(), and Wire.requestFrom(addr, n) to read. Displays like the 16×2 LCD (via I2C backpack) and sensors like the MPU6050 accelerometer use I2C.\n\nAddress conflicts are the classic I2C bug — when two devices share an address, change one via its pin (A0/A1 on many modules) or scan the bus to list what is present.',
        code: '#include <Wire.h>\n\nvoid setup() {\n  Wire.begin();\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  // I2C scanner: list addresses of everything on the bus\n  byte error, addr;\n  int count = 0;\n  for (addr = 1; addr < 127; addr++) {\n    Wire.beginTransmission(addr);\n    error = Wire.endTransmission();\n    if (error == 0) {\n      Serial.print("Device at 0x");\n      Serial.println(addr, HEX);\n      count++;\n    }\n  }\n  Serial.print(count); Serial.println(" devices found");\n  delay(2000);\n}',
        note: 'Two wires, many devices, unique addresses. Run the scanner when something "isn\'t there" — it almost always is.',
      },
      {
        title: 'SPI — High-Speed Peripherals',
        text: 'SPI is the high-speed cousin of I2C: four wires — MOSI (master out), MISO (master in), SCLK (clock) and SS (chip select). One SS line per slave: the master pulls a device\'s SS low to talk to that specific device, so no addressing is needed — just a wire per device.\n\nUse it for things that need raw speed: SD cards, OLED/display controllers, some sensors, Ethernet shields.\n\nIn practice: pick the library for your device (SD.h, Adafruit_SSD1306, RF24), wire the four pins to the documented pins (SS to pin 10 on the Uno by default), and let the library handle the protocol. What you must know is which pin is which and why SS exists.',
        code: '// SPI wiring on the Uno\nD11 → MOSI (data out)\nD12 → MISO (data in)\nD13 → SCLK (clock)\nD10 → SS   (chip select)\n\n// Chip select in action\nsetSPI(device);          // SS pulled LOW → device listens\nreadReg(0x0F);\nreleaseSPI();            // SS HIGH → device ignored\n\n// Typical: SD card with the SD library\n#include <SD.h>\nif (!SD.begin(10)) Serial.println("SD init failed");',
        note: 'One SS wire per device is the price of SPI\'s speed. Wire by the library\'s documented pin map.',
      },
      {
        title: 'Interrupts & Precise Timing',
        text: 'polling reads a pin repeatedly; interrupts let the hardware call you when something happens. attachInterrupt(pin, handler, FALLING) runs a short handler the moment the pin changes — perfect for encoders, limit switches and fast edges. Uno interrupt pins are 2 and 3.\n\nTiming: delay() is coarse; millis() returns milliseconds since boot, letting you schedule without blocking — the classic "blink without delay" pattern. For microsecond precision, micros() and delayMicroseconds().\n\nThe discipline: interrupt handlers must be short — set a flag, don\'t do heavy work inside them. Do the real work in loop() when the flag is set.',
        code: 'volatile bool pressed = false;\n\nvoid onButton() {\n  pressed = true;            // set a flag, nothing heavy\n}\n\nvoid setup() {\n  pinMode(2, INPUT_PULLUP);\n  attachInterrupt(digitalPinToInterrupt(2), onButton, FALLING);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  if (pressed) {\n    pressed = false;\n    Serial.println("Button pressed");   // real work here\n  }\n}\n\n// Blink without delay\nunsigned long t = millis();\nif (millis() - t >= 1000) { toggle LED; t = millis(); }',
        note: 'Interrupts flag, loop acts. millis() schedules; delay() blocks. Both are core timing skills.',
      },
      {
        title: 'Libraries & Writing Clean Sketches',
        text: 'Almost every device has a library — install via the Library Manager (Tools → Manage Libraries), then #include it. Libraries wrap the protocol so you write high-level code: display.print("hello"), servo.write(90), sensor.read().\n\nWrite your own functions for anything reused: readDistance(), displayReading(), blinkError(). Use constants for pin numbers and thresholds instead of magic numbers. Add comments that say why, not what.\n\nThe payoff: a sketch you can return to in six months. A messy sketch is where timing bugs and wiring confusion live — structure prevents them.',
        code: '#include <LiquidCrystal_I2C.h>   // display library\n\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\nconst int TEMP_PIN = A0;\n\nfloat readTemp() {\n  int raw = analogRead(TEMP_PIN);\n  return raw * (5.0 / 1023.0) * 100.0;\n}\n\nvoid showOnLCD(float c) {\n  lcd.setCursor(0, 0);\n  lcd.print("Temp: ");\n  lcd.print(c);\n  lcd.print(" C");\n}\n\nvoid setup() {\n  lcd.init(); lcd.backlight();\n}\n\nvoid loop() {\n  showOnLCD(readTemp());\n  delay(500);\n}',
        note: 'Libraries for devices, functions for your logic, constants for magic numbers. Structure is free maintenance.',
      },
    ],
    quizzes: [
      { text: 'I2C uses…', options: ['two wires (SDA + SCL) with per-device addresses', 'one wire per device', 'four wires with chip select', 'no wires'], correctAnswer: 'two wires (SDA + SCL) with per-device addresses' },
      { text: 'SPI selects a device by…', options: ['pulling its SS line low', 'sending an address byte', 'a MAC address', 'the device name'], correctAnswer: 'pulling its SS line low' },
      { text: 'An interrupt handler should…', options: ['set a flag and do real work later in loop()', 'do everything inside', 'block for seconds', 'never be used'], correctAnswer: 'set a flag and do real work later in loop()' },
      { text: 'The recommended structure for reusable sketches includes…', options: ['libraries for devices, functions for logic, constants for values', 'one giant loop', 'magic numbers', 'no comments'], correctAnswer: 'libraries for devices, functions for logic, constants for values' },
    ],
  },

  // ── W5 · The Capstone Project ────────────────────────────────────────────
  {
    week: 5,
    title: 'The Capstone Project',
    description: 'Design, build, test and polish a complete sensor-based home-automation style project.',
    topics: [
      {
        title: 'Designing the Project',
        text: 'The project: a home-automation style build of your choice — a smart night light with a light sensor, a temperature-fan controller, a motion-activated alarm, or a distance-measuring parking assistant. Define it on paper before touching a wire.\n\nWrite the specification: one goal sentence, the inputs (which sensors), the outputs (LEDs, buzzer, servo), and the behaviour rules (e.g. "fan on when temp > 30 °C"). Sketch the circuit — which pin connects where.\n\nSplit the build into steps that each end in something testable: wire the sensor and read raw values; wire the output and drive it manually; then connect them. Small testable steps are the difference between a working project and a mystery.',
        code: '// Project spec template\nName:      Temperature-fan controller\nGoal:      Keep a desk cool automatically\nInputs:    LM35 on A0\nOutputs:   DC fan (via transistor) on D9\nRules:     temp < 25°C → off\n           25–30°C   → fan at 40%\n           temp > 30°C → fan at 100%\nExtras:    LCD shows temp + fan state\n\n// Build order (each step testable)\n1. LM35 → Serial raw + °C      ✓ print works\n2. Fan → runs when pin HIGH     ✓ driver works\n3. PWM speed control            ✓ speed works\n4. Rules in code                ✓ logic works\n5. LCD display                  ✓ display works',
        note: 'Goal, inputs, outputs, rules — written down. Then build in testable slices. Never wire the whole thing blind.',
      },
      {
        title: 'Building the Circuit & Powering Safely',
        text: 'Wire carefully: sensor signal to the correct analog pin, output driver on a PWM-capable pin, common ground everywhere. Re-check against your sketch before applying power.\n\nPower discipline: the board runs from USB or a barrel jack; motors/servos need their own supply sharing only ground. Never connect a motor directly to a pin. Watch polarity on LEDs, capacitors and the sensor power pins.\n\nSafety first: unplug while rewiring, use a breadboard-friendly multimeter to check continuity and voltage before connecting load-bearing parts, and keep currents within pin limits (20 mA per pin).\n\nIf something misbehaves at power-up, remove power first, then check wiring against the sketch — an intermittent hot wire is far harder to find than a clean open circuit.',
        code: '// Powering checklist\nBoard:   USB or 9V barrel jack\nServos:  separate 5V supply, GND shared\nMotors:  driver board + battery, GND shared\nSensors: 5V or 3.3V per datasheet\n\n// Pre-power re-check\n1. Common ground?  (every part shares GND)\n2. Signal → right pin?\n3. No motor on a digital pin directly?\n4. LED polarity right? resistor present?\n5. Supply voltage matches the datasheet?',
        note: 'Check ground, check pins, check polarity, then power. A 60-second re-check beats an hour of debugging.',
      },
      {
        title: 'Programming, Testing & Debugging',
        text: 'Write the firmware in phases and test each phase. Phase 1: read the sensor raw and print. Phase 2: convert to a real value (temp in °C). Phase 3: drive the output manually. Phase 4: implement the rules. Phase 5: integrate and polish.\n\nDebugging method: use Serial at every boundary. Print raw sensor values — if the raw looks wrong, the wiring (or the sensor) is the problem, not your conversion. Print each rule branch ("temp=32 → fan 100%"). If the output doesn\'t move but the prints say it should, the wiring on the output side is wrong.\n\nTest the edge cases: the boundaries of your rules (exactly 30 °C), sensor at extremes, and what happens on power-up before the first reading.',
        code: '// Debug-friendly rule implementation\nvoid loop() {\n  float t = readTemp();\n  Serial.print("temp="); Serial.print(t);\n\n  int speed;\n  if (t < 25)     { speed = 0;   }\n  else if (t < 30){ speed = 102; }   // 40%\n  else            { speed = 255; }   // 100%\n\n  analogWrite(FAN_PIN, speed);\n  Serial.print(" fan="); Serial.println(speed);\n  delay(500);\n}\n\n// See raw + converted + action on every loop:\n// temp=24.1 fan=0\n// temp=31.8 fan=255',
        note: 'Print raw, converted, and action — every loop. The Serial trace tells you instantly which layer is wrong.',
      },
      {
        title: 'Polishing, Packaging & Beyond Arduino',
        text: 'A finished project is a polished one: a tidy breadboard layout, an enclosure if it lives in the real world, a power switch, and a README that describes the build, wiring and how to use it. Blinking status LEDs and a clean startup routine make it feel like a product.\n\nDocumentation is part of the build: the schematic, the pin map, the code with comments, and what you learned. Future-you and interviewers both read it.\n\nFrom here the roads fork: Wi-Fi IoT (ESP32), PCB design, or embedded C on bare microcontrollers. You have the foundations — sensing, actuation, protocols and debugging — that every one of those paths builds on.',
        code: '// Finished-project checklist\n□ Tidy, labelled breadboard layout\n□ Enclosure or mount for moving parts\n□ Power switch or clear power wiring\n□ Status LED shows "running"\n□ README: goal, wiring, how to use\n□ Code commented for WHY\n\n// Next steps\nESP32          → Wi-Fi, Bluetooth, cloud IoT\nPCB design     → turn the breadboard into a real board\nEmbedded C     → bare-metal microcontrollers',
        note: 'Documentation and packaging turn a working circuit into a deliverable. Then pick the next fork and keep building.',
      },
    ],
    quizzes: [
      { text: 'A good project starts with…', options: ['a written spec: goal, inputs, outputs, rules', 'random wiring', 'the most complex circuit first', 'buying more parts'], correctAnswer: 'a written spec: goal, inputs, outputs, rules' },
      { text: 'The pre-power re-check includes…', options: ['common ground, pin map, polarity, supply voltage', 'turning it on', 'only the code', 'the enclosure'], correctAnswer: 'common ground, pin map, polarity, supply voltage' },
      { text: 'When the raw sensor value looks wrong, the problem is…', options: ['wiring or the sensor, not your conversion code', 'the map() function', 'the IDE', 'the USB cable'], correctAnswer: 'wiring or the sensor, not your conversion code' },
      { text: 'A polished deliverable includes…', options: ['documentation, packaging and a README', 'only working code', 'more wires', 'a longer loop'], correctAnswer: 'documentation, packaging and a README' },
    ],
  },
];
