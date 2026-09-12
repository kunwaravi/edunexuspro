/**
 * ESP32 — Wi-Fi & Bluetooth IoT Projects — per-topic quizzes.
 * Keyed by the EXACT topic titles in esp32.ts (topic-lock flow).
 * 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in esp32.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'What the ESP32 Is — A Connected Microcontroller': [
    { text: 'The ESP32 is made by…', options: ['Espressif', 'Microchip', 'Arduino', 'TI'], correctAnswer: 'Espressif' },
    { text: 'The ESP32-S3 differs mainly by…', options: ['more GPIO and native USB', 'less RAM', 'no Wi-Fi', 'a slower clock'], correctAnswer: 'more GPIO and native USB' },
    { text: 'The ESP32-C3 is…', options: ['single-core RISC-V and low cost', 'the most expensive', 'a server chip', 'a GPU'], correctAnswer: 'single-core RISC-V and low cost' },
    { text: 'The defining feature of the family is…', options: ['built-in Wi-Fi and Bluetooth', 'a web browser', 'a keyboard', '4K video'], correctAnswer: 'built-in Wi-Fi and Bluetooth' },
  ],
  'Toolchains: Arduino Core & PlatformIO': [
    { text: 'The Arduino IDE gains ESP32 support via…', options: ['Boards Manager → "esp32 by Espressif"', 'a CD install', 'a browser plugin', 'the Serial Monitor'], correctAnswer: 'Boards Manager → "esp32 by Espressif"' },
    { text: 'PlatformIO is…', options: ['a project-based, professional toolchain (VS Code extension)', 'a phone app', 'a broker', 'a language'], correctAnswer: 'a project-based, professional toolchain (VS Code extension)' },
    { text: 'Sketches written for one toolchain…', options: ['compile unchanged in the other', 'must be rewritten', 'are incompatible', 'only run in the IDE'], correctAnswer: 'compile unchanged in the other' },
    { text: 'Start with the Arduino IDE for…', options: ['speed; graduate to PlatformIO as projects grow', 'everything forever', 'nothing', 'production fleets'], correctAnswer: 'speed; graduate to PlatformIO as projects grow' },
  ],
  'First Program & Serial at 115200': [
    { text: 'The ESP32 default serial baud is…', options: ['115200', '9600', '4800', '57600'], correctAnswer: '115200' },
    { text: 'A wrong baud in the Serial Monitor shows…', options: ['garbage characters', 'nothing', 'an error dialog', 'correct text always'], correctAnswer: 'garbage characters' },
    { text: 'If upload fails with "waiting for download", you…', options: ['hold BOOT, tap EN, release BOOT, upload', 'change the cable colour', 'reboot the PC', 'use Bluetooth'], correctAnswer: 'hold BOOT, tap EN, release BOOT, upload' },
    { text: 'A blink + serial print proves…', options: ['power, boot and toolchain all work', 'the board is fast', 'Wi-Fi is up', 'the sensor is calibrated'], correctAnswer: 'power, boot and toolchain all work' },
  ],
  'Pin Mapping & Powering the Board': [
    { text: 'GPIO 34–39 on the ESP32 are…', options: ['input-only pins', 'PWM only', 'always 5V', 'unusable'], correctAnswer: 'input-only pins' },
    { text: 'Strapping pins (0, 12, 15)…', options: ['affect boot if driven high at power-up', 'are outputs only', 'are always safe', 'carry 5V'], correctAnswer: 'affect boot if driven high at power-up' },
    { text: 'The ESP32\'s logic level is…', options: ['3.3V', '5V', '12V', '1V'], correctAnswer: '3.3V' },
    { text: 'The safe prototyping pin set includes…', options: ['2, 4, 5, 16–23', '6–11 (flash)', '34–39 inputs', '0 and 15'], correctAnswer: '2, 4, 5, 16–23' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Connecting to Wi-Fi': [
    { text: 'WiFi.mode(WIFI_STA) makes the ESP32…', options: ['a station (client), not an access point', 'an access point only', 'offline', 'a server'], correctAnswer: 'a station (client), not an access point' },
    { text: 'You know the connection succeeded when…', options: ['WiFi.status() == WL_CONNECTED', 'the LED blinks once', 'the clock ticks', 'nothing'], correctAnswer: 'WiFi.status() == WL_CONNECTED' },
    { text: 'A failed connection should…', options: ['retry with a timeout, then act explicitly', 'hang forever', 'crash the board', 'ignore it'], correctAnswer: 'retry with a timeout, then act explicitly' },
    { text: 'Wi-Fi credentials belong…', options: ['in a secrets header or NVS, not shared source', 'hardcoded in every sketch', 'on a forum', 'in the README'], correctAnswer: 'in a secrets header or NVS, not shared source' },
  ],
  'HTTP Clients — GET Requests': [
    { text: 'The ESP32\'s built-in HTTP client is…', options: ['HTTPClient', 'axios', 'request', 'fetch'], correctAnswer: 'HTTPClient' },
    { text: 'After http.begin(url) you must…', options: ['check the status code before reading the payload', 'sleep for an hour', 'close the USB', 'reset'], correctAnswer: 'check the status code before reading the payload' },
    { text: 'The response body is read with…', options: ['http.getString()', 'Serial.read()', 'analogRead()', 'http.body()'], correctAnswer: 'http.getString()' },
    { text: 'For HTTPS in production you should…', options: ['pin the root certificate (setInsecure only for testing)', 'always use setInsecure', 'never use HTTPS', 'ignore certificates'], correctAnswer: 'pin the root certificate (setInsecure only for testing)' },
  ],
  'HTTP POST & Sending Data to APIs': [
    { text: 'To send JSON you first…', options: ['add the Content-Type: application/json header', 'start a server', 'clear NVS', 'nothing'], correctAnswer: 'add the Content-Type: application/json header' },
    { text: 'A robust device on a flaky network…', options: ['buffers readings and retries', 'drops them silently', 'reboots', 'stops sensing'], correctAnswer: 'buffers readings and retries' },
    { text: 'Batching several readings into one POST…', options: ['is politer to the server', 'is forbidden', 'slows the device', 'loses data'], correctAnswer: 'is politer to the server' },
    { text: 'The standard response check after POST is…', options: ['the HTTP status code', 'the MAC address', 'the uptime', 'nothing'], correctAnswer: 'the HTTP status code' },
  ],
  'Time Sync & mDNS': [
    { text: 'NTP is used for…', options: ['accurate time via configTime()', 'faster Wi-Fi', 'stronger signal', 'more flash'], correctAnswer: 'accurate time via configTime()' },
    { text: 'mDNS gives the board…', options: ['a .local name on the LAN', 'a public domain', 'a static IP', 'an email'], correctAnswer: 'a .local name on the LAN' },
    { text: 'Timestamps matter because…', options: ['the dashboard needs to chart data over time', 'they look nice', 'NTP is required', 'the board demands it'], correctAnswer: 'the dashboard needs to chart data over time' },
    { text: 'The IST offset is…', options: ['UTC + 5:30', 'UTC - 5:30', 'UTC + 0', 'UTC + 3'], correctAnswer: 'UTC + 5:30' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'BLE Basics — The Server/Client Model': [
    { text: 'In BLE, the server is called…', options: ['the peripheral', 'the central', 'the broker', 'the hub'], correctAnswer: 'the peripheral' },
    { text: 'A BLE group of data is called…', options: ['a Service', 'a file', 'a packet', 'a frame'], correctAnswer: 'a Service' },
    { text: 'A Characteristic\'s data can be…', options: ['read, written, or pushed via notify', 'only read', 'only written', 'deleted'], correctAnswer: 'read, written, or pushed via notify' },
    { text: 'To test a GATT server from a phone you use…', options: ['nRF Connect or LightBlue', 'the Arduino IDE', 'a serial cable', 'a browser'], correctAnswer: 'nRF Connect or LightBlue' },
  ],
  'Advertising & Scanning': [
    { text: 'A peripheral advertises…', options: ['its name and services', 'its password', 'its CPU speed', 'nothing'], correctAnswer: 'its name and services' },
    { text: 'The ESP32 starts advertising with…', options: ['adv->start()', 'Serial.begin()', 'WiFi.begin()', 'delay(1000)'], correctAnswer: 'adv->start()' },
    { text: 'A central…', options: ['scans, finds the name, and connects', 'only sleeps', 'advertises forever', 'never connects'], correctAnswer: 'scans, finds the name, and connects' },
    { text: 'The advertising name is set with…', options: ['BLEDevice::init("name")', 'WiFi.begin()', 'HTTP.begin()', 'Serial.println()'], correctAnswer: 'BLEDevice::init("name")' },
  ],
  'Bridging Sensors to a Phone App': [
    { text: 'To stream sensor values to a phone you use…', options: ['notifications — the server pushes updates', 'polling with delays', 'email', 'a file system'], correctAnswer: 'notifications — the server pushes updates' },
    { text: 'A few notifications per second is…', options: ['plenty for most sensors', 'too slow always', 'illegal', 'impossible'], correctAnswer: 'plenty for most sensors' },
    { text: 'The phone-side debug tool is…', options: ['nRF Connect', 'the Arduino IDE', 'a multimeter', 'a browser'], correctAnswer: 'nRF Connect' },
    { text: 'The streaming pattern is…', options: ['read → set characteristic → notify', 'notify → read → set', 'set → read → notify', 'just read'], correctAnswer: 'read → set characteristic → notify' },
  ],
  'ESP-NOW — Direct ESP32-to-ESP32': [
    { text: 'ESP-NOW operates…', options: ['connectionless, without a router or pairing', 'only through a broker', 'over Bluetooth only', 'on the cloud'], correctAnswer: 'connectionless, without a router or pairing' },
    { text: 'You address an ESP-NOW peer by…', options: ['its MAC address', 'its IP', 'its name', 'its SSID'], correctAnswer: 'its MAC address' },
    { text: 'A good ESP-NOW topology is…', options: ['a sensor sending to a hub that pushes to the cloud', 'every node on the internet', 'peer to every phone', 'no topology'], correctAnswer: 'a sensor sending to a hub that pushes to the cloud' },
    { text: 'ESP-NOW and Wi-Fi…', options: ['can run side by side', 'cannot coexist', 'need two boards', 'are the same'], correctAnswer: 'can run side by side' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Deep Sleep & Wake Sources': [
    { text: 'In deep sleep, current drops to roughly…', options: ['10 µA', '80 mA', '1 A', '2 A'], correctAnswer: '10 µA' },
    { text: 'The timer wakeup is enabled with…', options: ['esp_sleep_enable_timer_wakeup(microseconds)', 'delay(1000)', 'WiFi.begin()', 'analogRead()'], correctAnswer: 'esp_sleep_enable_timer_wakeup(microseconds)' },
    { text: 'A GPIO wake source works for…', options: ['buttons or sensor edges', 'nothing', 'Wi-Fi packets', 'USB power'], correctAnswer: 'buttons or sensor edges' },
    { text: 'Deep sleep is what lets IoT…', options: ['run for months on a battery', 'connect faster', 'overclock', 'stream video'], correctAnswer: 'run for months on a battery' },
  ],
  'OTA Updates — Fix Devices in the Field': [
    { text: 'OTA stands for…', options: ['over-the-air firmware updates', 'open-testing-application', 'only-two-apps', 'over-time-audio'], correctAnswer: 'over-the-air firmware updates' },
    { text: 'The simplest OTA path is…', options: ['ArduinoOTA over Wi-Fi', 'a USB cable', 'a microSD swap', 'a browser download'], correctAnswer: 'ArduinoOTA over Wi-Fi' },
    { text: 'OTA handles…', options: ['the firmware binary swap into flash', 'the wiring', 'the sensor calibration', 'the power supply'], correctAnswer: 'the firmware binary swap into flash' },
    { text: 'A fleet rollout should be…', options: ['staged with a rollback path', 'blasted to all devices at once', 'untested', 'only local'], correctAnswer: 'staged with a rollback path' },
  ],
  'Multitasking with FreeRTOS': [
    { text: 'The ESP32\'s dual core can…', options: ['genuinely run two tasks at once', 'only fake parallelism', 'never multitask', 'run Windows'], correctAnswer: 'genuinely run two tasks at once' },
    { text: 'A task is…', options: ['a function with its own stack and priority', 'a sensor', 'a WiFi profile', 'a library'], correctAnswer: 'a function with its own stack and priority' },
    { text: 'Tasks pass data safely via…', options: ['queues (xQueueSend/xQueueReceive)', 'raw global variables', 'the file system', 'analog pins'], correctAnswer: 'queues (xQueueSend/xQueueReceive)' },
    { text: 'vTaskDelay()…', options: ['yields the CPU for a scheduled time', 'blocks forever', 'reboots', 'clears memory'], correctAnswer: 'yields the CPU for a scheduled time' },
  ],
  'Production Practices for IoT': [
    { text: 'Secrets should be stored…', options: ['in NVS or a provisioning flow, never in source', 'hardcoded in code', 'on the dashboard', 'in the README'], correctAnswer: 'in NVS or a provisioning flow, never in source' },
    { text: 'NVS (Preferences) persists…', options: ['settings across reboots', 'only the clock', 'firmware binaries', 'Wi-Fi channels'], correctAnswer: 'settings across reboots' },
    { text: 'A watchdog…', options: ['reboots the chip if code hangs', 'blocks Wi-Fi', 'sleeps the board', 'charges the battery'], correctAnswer: 'reboots the chip if code hangs' },
    { text: 'Cloud traffic should use…', options: ['HTTPS/TLS', 'plain HTTP', 'serial', 'no encryption'], correctAnswer: 'HTTPS/TLS' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Designing the Cloud IoT Project': [
    { text: 'The capstone architecture is…', options: ['sensor ESP32 → MQTT broker → dashboard', 'sensor → database only', 'ESP32 → email', 'no dashboard'], correctAnswer: 'sensor ESP32 → MQTT broker → dashboard' },
    { text: 'The spec should record…', options: ['goal, hardware, data flow and topics', 'only the price', 'the box colour', 'the USB type'], correctAnswer: 'goal, hardware, data flow and topics' },
    { text: 'A diagram of the flow is…', options: ['better than a paragraph', 'a waste of time', 'optional', 'forbidden'], correctAnswer: 'better than a paragraph' },
    { text: 'Deep sleep between reads makes the node…', options: ['battery-friendly', 'faster', 'louder', 'hotter'], correctAnswer: 'battery-friendly' },
  ],
  'MQTT — The IoT Messaging Protocol': [
    { text: 'MQTT is…', options: ['a lightweight pub/sub protocol for IoT', 'a SQL database', 'a web server', 'a JSON format'], correctAnswer: 'a lightweight pub/sub protocol for IoT' },
    { text: 'Publishers send to topics; subscribers receive…', options: ['everything on their subscribed topics', 'only their own messages', 'nothing', 'random data'], correctAnswer: 'everything on their subscribed topics' },
    { text: 'The ESP32 MQTT library is…', options: ['PubSubClient', 'HTTPClient', 'Servo.h', 'Preferences.h'], correctAnswer: 'PubSubClient' },
    { text: 'For sensor telemetry a reasonable QoS is…', options: ['0 (a dropped reading is fine)', '2 always', '1 for everything', 'none'], correctAnswer: '0 (a dropped reading is fine)' },
  ],
  'Building the Dashboard Side': [
    { text: 'The dashboard subscribes to…', options: ['the same MQTT topic the node publishes', 'the node\'s IP', 'the broker\'s disk', 'nothing'], correctAnswer: 'the same MQTT topic the node publishes' },
    { text: 'Node-RED builds dashboards with…', options: ['visual flows: MQTT in → function → chart', 'raw HTML only', 'machine code', 'SQL'], correctAnswer: 'visual flows: MQTT in → function → chart' },
    { text: 'The browser talks MQTT over…', options: ['WebSocket', 'USB', 'serial', 'Bluetooth'], correctAnswer: 'WebSocket' },
    { text: 'A real dashboard needs…', options: ['a history chart, live values and last-seen', 'only a logo', 'just text', 'no data'], correctAnswer: 'a history chart, live values and last-seen' },
  ],
  'Testing, Deploying & What Comes Next': [
    { text: 'The test order is…', options: ['serial sanity → MQTT visible → dashboard renders → overnight endurance', 'dashboard first', 'deploy before testing', 'random'], correctAnswer: 'serial sanity → MQTT visible → dashboard renders → overnight endurance' },
    { text: 'After a network blip the device must…', options: ['recover by itself', 'wait for a human', 'reboot endlessly', 'give up'], correctAnswer: 'recover by itself' },
    { text: 'The deployment checklist includes…', options: ['deep sleep, OTA, watchdog, credentials in NVS, heartbeat', 'only the LED', 'a prettier case', 'nothing'], correctAnswer: 'deep sleep, OTA, watchdog, credentials in NVS, heartbeat' },
    { text: 'The natural next forks are…', options: ['edge AI (S3), Matter, or cellular IoT (LTE-M/NB-IoT)', 'nothing', 'only Arduino Uno', 'only web apps'], correctAnswer: 'edge AI (S3), Matter, or cellular IoT (LTE-M/NB-IoT)' },
  ],
};
