/**
 * ESP32 — Wi-Fi & Bluetooth IoT Projects — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in esp32_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · ESP32 & the Platform ────────────────────────────────────────────
  {
    week: 1,
    title: 'ESP32 & the Platform',
    description: 'The connected microcontroller: architecture, toolchains, first programs and power.',
    topics: [
      {
        title: 'What the ESP32 Is — A Connected Microcontroller',
        text: 'The ESP32 is a low-cost system-on-chip with Wi-Fi and Bluetooth built in. Made by Espressif, it has a dual-core Xtensa CPU, a rich set of GPIOs, ADC, DAC, I2C, SPI, UART, and hardware crypto. It is the de-facto standard for Wi-Fi IoT.\n\nVersions matter: the original ESP32, the ESP32-S3 (more GPIO, native USB), and the ESP32-C3 (single-core RISC-V, cheaper). They all run the same Arduino core with minor pin differences.\n\nWhere it fits: it does everything an Arduino Uno does — plus it connects to the internet. That one difference unlocks cloud dashboards, phone apps, MQTT and OTA updates.',
        code: '// ESP32 family at a glance\nESP32      dual-core Xtensa, Wi-Fi + BT classic + BLE\nESP32-S3   more GPIO, native USB, AI acceleration\nESP32-C3   single-core RISC-V, low cost, BLE + Wi-Fi\n\n// Common to all: Wi-Fi, BLE, ADC, I2C, SPI, UART, PWM\n// The exact pin numbers vary per board — check the pin map.',
        note: 'The ESP32 is "Arduino + Wi-Fi". Start on a DevKit-style board with a built-in USB port.',
      },
      {
        title: 'Toolchains: Arduino Core & PlatformIO',
        text: 'Two ways to program the ESP32. The Arduino core turns the familiar IDE into an ESP32 toolchain: install "esp32" from Boards Manager, pick the board, upload over USB. Fastest path for beginners.\n\nPlatformIO (a VS Code extension) is the professional route: project-based, dependency management, better error messages, and libraries per project instead of globally. Most serious IoT projects use it.\n\nBoth compile the same sketches. Start in the Arduino IDE for speed, graduate to PlatformIO when a project grows. The code you write transfers unchanged.',
        code: '// Arduino IDE\nBoards Manager → install "esp32 by Espressif"\nTools → Board → esp32 Dev Module\nUpload.  (board enters bootloader automatically)\n\n// PlatformIO (VS Code)\nplatformio init --board esp32dev\nplatformio run -t upload\n\n// Same code in both:\nvoid setup()  { Serial.begin(115200); }\nvoid loop()   { Serial.println("hi"); delay(1000); }',
        note: 'Arduino IDE for learning, PlatformIO for projects. Both are the same language with different packaging.',
      },
      {
        title: 'First Program & Serial at 115200',
        text: 'The first ESP32 program is a serial hello. One difference from Uno: default baud is 115200, not 9600 — set the Serial Monitor accordingly or you\'ll see garbage. printBoardInfo() shows firmware and chip info.\n\nUpload flow: press and hold BOOT, tap EN/RESET, release BOOT, then upload — or rely on the auto-reset circuit most dev boards have. If upload fails with "waiting for download", you\'re in the manual bootloader dance.\n\nVerify the board is alive before any project work: an LED blink plus serial prints prove power, boot and toolchain all work.',
        code: '#include <WiFi.h>\n\nvoid setup() {\n  Serial.begin(115200);\n  delay(100);\n  Serial.println("\\n\\nESP32 booting...");\n  Serial.printf("Chip: %s\\n", ESP.getChipModel());\n  Serial.printf("Flash: %u MB\\n", ESP.getFlashChipSize() / (1024 * 1024));\n}\n\nvoid loop() {\n  Serial.printf("Uptime: %lu s\\n", millis() / 1000);\n  delay(1000);\n}\n\n// If upload fails: hold BOOT → tap EN → release BOOT → upload',
        note: '115200 baud or garbage. Confirm the bootloader dance works before blaming the toolchain.',
      },
      {
        title: 'Pin Mapping & Powering the Board',
        text: 'Pin numbering follows the silkscreen, but the ESP32 has quirks: some pins are inputs-only (GPIO 34–39), some are strapping pins used at boot (GPIO 0, 12, 15), and the ADCs have non-linear calibration. Always check the pin map for your exact board.\n\nThe board is 3.3V logic — never feed 5V into a GPIO. Power it from USB, from the 3.3V/5V pins (with a regulator), or from a battery via the EN pin. Sleep currents matter: with deep sleep you can run months on a battery.\n\nSafe pins for prototyping: 2, 4, 5, 16, 17, 18, 19, 21, 22, 23 — steer clear of 6–11 (flash) and 12/15 (strapping) unless you know what you\'re doing.',
        code: '// Pin notes (varies by board)\nGPIO 34–39   input-only (no internal pull-up)\nGPIO 0,12,15 strapping pins (affect boot)\nGPIO 6–11    flash, avoid on many boards\n\n// Safe prototyping set\n2, 4, 5, 16, 17, 18, 19, 21, 22, 23\n\n// 3.3V logic only — 5V into a pin damages the chip',
        note: '3.3V logic, avoid the strapping pins, and check the board pin map. That avoids 90% of ESP32 damage.',
      },
    ],
    quizzes: [
      { text: 'The ESP32\'s defining feature is…', options: ['built-in Wi-Fi and Bluetooth', 'a 64-core CPU', 'a web browser', 'a GPU'], correctAnswer: 'built-in Wi-Fi and Bluetooth' },
      { text: 'The Arduino IDE loads the ESP32 support via…', options: ['Boards Manager (esp32 by Espressif)', 'a USB stick', 'the Serial Monitor', 'a web browser'], correctAnswer: 'Boards Manager (esp32 by Espressif)' },
      { text: 'The ESP32\'s default serial baud is…', options: ['115200', '9600', '4800', '57600'], correctAnswer: '115200' },
      { text: 'The ESP32 runs at…', options: ['3.3V logic — never 5V into a GPIO', '5V logic', '12V logic', '1.8V only'], correctAnswer: '3.3V logic — never 5V into a GPIO' },
    ],
  },

  // ── W2 · Wi-Fi & Networking ──────────────────────────────────────────────
  {
    week: 2,
    title: 'Wi-Fi & Networking',
    description: 'Connect to the network, make HTTP calls, use REST APIs and keep accurate time.',
    topics: [
      {
        title: 'Connecting to Wi-Fi',
        text: 'The ESP32 joins a network with WiFi.begin(ssid, password), then you wait for WL_CONNECTED with a timeout. Add WiFi.mode(WIFI_STA) to make it a station (client) rather than an access point.\n\nHandle failure explicitly: retry a few times, then restart the board or put it into a provisioning mode — never hang forever. A helpful pattern is a reconnect watchdog in loop() that re-runs WiFi.begin() when the link drops.\n\nStore credentials well: WiFi credentials and API keys belong in a secrets header (or NVS / a provisioning flow), not hardcoded in code you might share.',
        code: '#include <WiFi.h>\n\nconst char* SSID = "my-wifi";\nconst char* PASS = "password123";\n\nvoid connectWiFi(int tries = 20) {\n  WiFi.mode(WIFI_STA);\n  WiFi.begin(SSID, PASS);\n  int n = 0;\n  while (WiFi.status() != WL_CONNECTED && n < tries) {\n    delay(500); Serial.print("."); n++;\n  }\n  if (WiFi.status() == WL_CONNECTED) {\n    Serial.print("\\nIP: "); Serial.println(WiFi.localIP());\n  } else {\n    Serial.println("\\nWi-Fi failed — check credentials");\n  }\n}',
        note: 'Station mode, explicit timeout, reconnect in loop(). "Connect and hope" is not a strategy.',
      },
      {
        title: 'HTTP Clients — GET Requests',
        text: 'The ESP32 fetches data over HTTP with the built-in HTTPClient library: an http.begin(url) + GET + read payload + end. Use it to call weather APIs, fetch configuration, or download data.\n\nAlways check the response code (200 = ok) and guard against timeouts — an API that never answers should not hang your device. Add a sensible timeout.\n\nFor HTTPS URLs you also need the right root certificate or setInsecure(); for production, pin the certificate. Plain HTTP is fine for a local server or test API.',
        code: '#include <HTTPClient.h>\n#include <ArduinoJson.h>\n\nHTTPClient http;\nhttp.begin("http://api.example.com/weather?city=delhi");\nhttp.setTimeout(5000);\n\nint code = http.GET();\nif (code == 200) {\n  String body = http.getString();\n  JsonDocument doc;\n  deserializeJson(doc, body);\n  float temp = doc["temp"];\n  Serial.print("temp="); Serial.println(temp);\n} else {\n  Serial.printf("HTTP error: %d\\n", code);\n}\nhttp.end();',
        note: 'Check the status code, add a timeout, parse with ArduinoJson. That is the whole GET story.',
      },
      {
        title: 'HTTP POST & Sending Data to APIs',
        text: 'POST sends data to a server. Set the content type, build a JSON body with ArduinoJson, and http.POST(body). Response handling mirrors GET.\n\nUse it to report sensor readings, push button events, or sync state. Combine with a queue: if the network drops, buffer readings and retry — don\'t lose them.\n\nPractical flow: sensor reads → JSON payload → POST to your endpoint → check response. Add a retry with backoff for flaky networks, and consider batching several readings into one POST to be polite to the server.',
        code: '#include <HTTPClient.h>\n#include <ArduinoJson.h>\n\nHTTPClient http;\nhttp.begin("http://api.example.com/readings");\nhttp.addHeader("Content-Type", "application/json");\n\nJsonDocument doc;\ndoc["device"] = "esp32-a1";\ndoc["temp"] = 31.2;\ndoc["humidity"] = 58;\nString body;\nserializeJson(doc, body);\n\nint code = http.POST(body);\nSerial.printf("POST status: %d\\n", code);\nhttp.end();',
        note: 'JSON in, JSON out. Buffer readings when offline and retry — the network owes you nothing.',
      },
      {
        title: 'Time Sync & mDNS',
        text: 'The ESP32 gets accurate time from NTP: configTime(gmtOffset, daylightOffset, "pool.ntp.org"). Once synced, you can timestamp readings — essential for a data dashboard.\n\nmDNS gives the board a name on your LAN: MDNS.begin("espkitchen") means http://espkitchen.local resolves to it. Great for finding devices without hunting IPs.\n\nCombine both and the device feels like a real networked citizen: reachable by name, reporting time-stamped data.',
        code: '#include <WiFi.h>\n#include <esp_sntp.h>\n#include <ESPmDNS.h>\n\nvoid setup() {\n  // NTP time (IST = UTC + 5:30)\n  configTime(5 * 3600 + 1800, 0, "pool.ntp.org");\n\n  // mDNS name\n  MDNS.begin("espkitchen");\n  // → http://espkitchen.local on the LAN\n}\n\nvoid loop() {\n  struct tm t;\n  if (getLocalTime(&t)) {\n    Serial.printf("%04d-%02d-%02d %02d:%02d:%02d\\n",\n      t.tm_year + 1900, t.tm_mon + 1, t.tm_mday,\n      t.tm_hour, t.tm_min, t.tm_sec);\n  }\n  delay(1000);\n}',
        note: 'NTP = correct timestamps; mDNS = a name instead of an IP. Both are small includes with huge usability.',
      },
    ],
    quizzes: [
      { text: 'To join a network you call…', options: ['WiFi.begin(ssid, password) and wait for WL_CONNECTED', 'WiFi.ap()', 'Serial.begin', 'HTTP.begin'], correctAnswer: 'WiFi.begin(ssid, password) and wait for WL_CONNECTED' },
      { text: 'A GET with the built-in library uses…', options: ['HTTPClient: begin → GET → check code → end', 'a for loop', 'analogRead', 'digitalWrite'], correctAnswer: 'HTTPClient: begin → GET → check code → end' },
      { text: 'JSON payloads on the ESP32 are best built with…', options: ['ArduinoJson', 'string concatenation', 'printf', 'the file system'], correctAnswer: 'ArduinoJson' },
      { text: 'NTP provides…', options: ['accurate time; mDNS gives the device a .local name', 'faster Wi-Fi', 'more flash', 'a web server'], correctAnswer: 'accurate time; mDNS gives the device a .local name' },
    ],
  },

  // ── W3 · Bluetooth & BLE ─────────────────────────────────────────────────
  {
    week: 3,
    title: 'Bluetooth & BLE',
    description: 'Talk to phones and other ESP32s over Bluetooth Low Energy and ESP-NOW.',
    topics: [
      {
        title: 'BLE Basics — The Server/Client Model',
        text: 'Bluetooth Low Energy (BLE) is the low-power radio for talking to phones. Unlike Wi-Fi, the ESP32 advertises and phones (or other ESP32s) connect. The BLE stack: a server (peripheral) exposes Services, each with Characteristics; a client (central) discovers and reads/writes them.\n\nKey concepts: a Service is a group (UUID), a Characteristic holds data with properties (read, write, notify). Notify lets the server push updates without polling — the standard way to stream sensor data to a phone app.\n\nYou almost never write a full phone app; instead use nRF Connect (mobile) or LightBlue to test your GATT server from a phone.',
        code: '// BLE model\nServer (peripheral)   → advertises a Service (UUID)\n                         └─ Characteristics (read/write/notify)\nClient (central)      → scans, connects, reads/writes\n\n// Notify: server pushes data without the client asking\n//   → ideal for streaming sensor readings to a phone',
        note: 'Service + Characteristics + notify. Understand that and every BLE library becomes legible.',
      },
      {
        title: 'Advertising & Scanning',
        text: 'A BLE peripheral advertises: it broadcasts its name and services so centrals can find it. The ESP32 sets the name, then starts advertising at an interval. A central scans, finds the name, and can connect.\n\nScanning code on the ESP32: BLE scan start, check results for your device name, connect. This lets two ESP32s find each other over BLE.\n\nReal-world: a temperature sensor advertises "esp-temp"; a phone app scans, finds it, connects and subscribes to the notify characteristic to receive readings.',
        code: '#include <BLEDevice.h>\n#include <BLEServer.h>\n\nBLEAdvertising* adv;\n\nvoid setupBLE() {\n  BLEDevice::init("esp-sensor");        // broadcast name\n  adv = BLEDevice::getAdvertising();\n  adv->start();\n}\n\n// A scanner finds it by name:\n// BLEScan + scanStart(3, false)\n// → look for "esp-sensor" in results → connect',
        note: 'Advertising is the beacon; scanning is the searchlight. Names make both human-friendly.',
      },
      {
        title: 'Bridging Sensors to a Phone App',
        text: 'The classic use: an ESP32 reads sensors and streams them to a phone. Structure it as: read sensors → update a characteristic → notify subscribers. The phone subscribes (like a chat channel) and receives updates without polling.\n\nUse one characteristic per value or one JSON-packed characteristic per update. Notify as often as the data needs — a few times per second is plenty for most sensors.\n\nThe nRF Connect app is your debug tool: connect, view the service tree, subscribe to notifications, and watch values stream in. It also lets you write test values to confirm the server side works.',
        code: '// Streaming pattern\nread sensors\n  → set characteristic value (e.g. temp as float)\n  → pNotify->notify()  (or pChar->notify())\n  → subscribed phone receives the update\n\n// Test with nRF Connect on your phone:\n// 1. Scan → connect to "esp-sensor"\n// 2. Find the temperature characteristic\n// 3. Enable notifications → values stream in',
        note: 'Notify, don\'t poll. And nRF Connect is the phone-side mirror that proves your server works.',
      },
      {
        title: 'ESP-NOW — Direct ESP32-to-ESP32',
        text: 'ESP-NOW is a Wi-Fi-based, connectionless protocol: ESP32s talk directly to each other without a router or pairing. You register the peer\'s MAC address, send data packets, and a callback fires on receive.\n\nIt\'s ideal for sensor networks and remote controls: one battery-powered sensor ESP32 sends readings to a central ESP32 that pushes them to the cloud — the sensor never touches the internet.\n\nESP-NOW and Wi-Fi coexist; you can run both (the device keeps its Wi-Fi connection while sending ESP-NOW packets). Data rate is modest, range depends on antenna and environment.',
        code: '#include <esp_now.h>\n#include <WiFi.h>\n\n// Receiver side\nvoid onData(const uint8_t* mac, const uint8_t* data, int len) {\n  // data[0..len) is the payload\n  Serial.printf("Got %d bytes from %02X:%02X...\\n",\n    len, mac[0], mac[1]);\n}\n\nWiFi.mode(WIFI_STA);\nesp_now_init();\nesp_now_register_recv_cb(onData);\n\n// Sender side\nesp_now_peer_info_t peer = {};\nmemcpy(peer.peer_addr, peerMAC, 6);\nesp_now_add_peer(&peer);\nesp_now_send(peerMAC, payload, len);',
        note: 'ESP-NOW = no router, no pairing, direct packets. Perfect for sensor → hub topologies.',
      },
    ],
    quizzes: [
      { text: 'BLE\'s data model is…', options: ['Services containing Characteristics', 'files and folders', 'HTML pages', 'CSV rows'], correctAnswer: 'Services containing Characteristics' },
      { text: 'The BLE property that pushes data without the client polling is…', options: ['notify', 'read', 'write', 'discover'], correctAnswer: 'notify' },
      { text: 'A peripheral advertises its…', options: ['name and services so centrals can find it', 'IP address', 'CPU speed', 'battery always'], correctAnswer: 'name and services so centrals can find it' },
      { text: 'ESP-NOW lets ESP32s…', options: ['talk directly without a router or pairing', 'connect to the cloud only', 'call phone apps', 'use Ethernet'], correctAnswer: 'talk directly without a router or pairing' },
    ],
  },

  // ── W4 · Power & Advanced Features ───────────────────────────────────────
  {
    week: 4,
    title: 'Power & Advanced Features',
    description: 'Deep sleep for battery life, OTA updates, multitasking with FreeRTOS and production practices.',
    topics: [
      {
        title: 'Deep Sleep & Wake Sources',
        text: 'Deep sleep is the battery-life superpower: the CPU stops and current drops to ~10 µA. You wake from a timer, a GPIO edge (button/sensor), or a touch pad, do your work, and go back to sleep.\n\nThe pattern: setup() decides — if waking from deep sleep, do the job, then esp_deep_sleep_start(). A sensor node: wake every 10 minutes → read → POST → sleep.\n\nBattery math: with a 2000 mAh battery and a 15-second wake every 10 minutes at ~80 mA, the average current is a few mA — months of life. Sleep is why IoT can run on coin cells.',
        code: '#include <esp_sleep.h>\n\nvoid setup() {\n  Serial.begin(115200);\n  // wake reason check\n  if (esp_sleep_get_wakeup_cause() == ESP_SLEEP_WAKEUP_TIMER) {\n    Serial.println("Woke from timer");\n  }\n\n  readSensors();\n  postToCloud();\n\n  // sleep for 10 minutes\n  esp_sleep_enable_timer_wakeup(10 * 60 * 1000000ULL); // µs\n  esp_deep_sleep_start();\n}\n\n// Wake by GPIO: esp_sleep_enable_ext0_wakeup(GPIO_NUM_4, LOW)',
        note: 'Timer or GPIO wake, do the job, sleep again. Deep sleep is the difference between days and months on battery.',
      },
      {
        title: 'OTA Updates — Fix Devices in the Field',
        text: 'OTA (over-the-air) updates push new firmware to devices without a USB cable. The ESP32 runs a web server (or MQTT listener) that receives a firmware binary and swaps it into flash.\n\nThe simplest: ArduinoOTA (WiFi + ArduinoOTA library). Open the Arduino IDE, select the network port, and upload over Wi-Fi — it handles the whole dance.\n\nProduction considerations: verify the firmware actually boots (a boot-count check), keep a rollback copy, and stage updates rather than blasting every device at once. A bad OTA across a fleet is how you brick 10,000 devices on a Tuesday.',
        code: '#include <ArduinoOTA.h>\n\nvoid setupOTA() {\n  ArduinoOTA.begin();\n  ArduinoOTA.onProgress([](unsigned int done, unsigned int total) {\n    Serial.printf("OTA: %u/%u\\n", done, total);\n  });\n}\n\nvoid loop() {\n  ArduinoOTA.handle();   // service OTA in loop\n}\n\n// In the IDE: Tools → Port → network port → Upload',
        note: 'OTA is an update channel, not a magic wand. Stage, verify, and keep a rollback path.',
      },
      {
        title: 'Multitasking with FreeRTOS',
        text: 'The ESP32 runs FreeRTOS: multiple tasks appear to run at once (the dual core genuinely runs two). Each task is a function with its own stack and priority. xTaskCreatePinnedToCore lets you pick the core.\n\nWhy care: your loop() might be busy with a slow HTTP call while a button needs a fast response. Split into tasks: one for sensing, one for networking, one for display.\n\nShared data between tasks needs protection — vTaskDelay() yields, Semaphores and queues coordinate. Pass data with queues (xQueueSend/xQueueReceive) rather than raw globals.',
        code: '#include <freertos/FreeRTOS.h>\n\nvoid sensorTask(void* p) {\n  while (1) {\n    float t = readTemp();\n    xQueueSend(q, &t, 0);\n    vTaskDelay(1000 / portTICK_PERIOD_MS);\n  }\n}\n\nvoid netTask(void* p) {\n  while (1) {\n    float t;\n    if (xQueueReceive(q, &t, 0)) postTemp(t);\n    vTaskDelay(5000 / portTICK_PERIOD_MS);\n  }\n}\n\nvoid setup() {\n  q = xQueueCreate(4, sizeof(float));\n  xTaskCreate(sensorTask, "sensor", 4096, NULL, 1, NULL);\n  xTaskCreate(netTask, "net", 4096, NULL, 1, NULL);\n}',
        note: 'One task per concern, queues for data, delays for scheduling. The dual core then actually earns its name.',
      },
      {
        title: 'Production Practices for IoT',
        text: 'Shipping a device is more than blinking code: secrets management (credentials in NVS or a provisioning flow, never in source), a reboot watchdog (esp_task_wdt), proper logging with levels, and a settings structure you can update.\n\nReliability: handle Wi-Fi dropouts with reconnect logic, use NVS (non-volatile storage) to persist settings across reboots, and add a health-report heartbeat so you know devices are alive.\n\nSecurity basics: HTTPS/TLS for cloud traffic, change default credentials, verify OTA images, and never expose your broker or server credentials in a way that can be extracted and reused.',
        code: '#include <Preferences.h>\n\nPreferences prefs;\nprefs.begin("app", false);            // R/W namespace\nprefs.putString("ssid", "my-wifi");   // persist\nprefs.putString("pass", "secret");\nString ssid = prefs.getString("ssid", "");  // read + default\nprefs.end();\n\n// Watchdog: keepalive every N ms or the chip reboots\nesp_task_wdt_init(30, true);',
        note: 'Secrets out of source, settings in NVS, watchdog on, HTTPS for cloud. That is the production baseline.',
      },
    ],
    quizzes: [
      { text: 'Deep sleep drops current to about…', options: ['10 µA', '80 mA', '500 mA', '1 A'], correctAnswer: '10 µA' },
      { text: 'The most common deep-sleep wake source is…', options: ['a timer (esp_sleep_enable_timer_wakeup)', 'a USB cable', 'the clock speed', 'a network ping'], correctAnswer: 'a timer (esp_sleep_enable_timer_wakeup)' },
      { text: 'OTA updates…', options: ['push new firmware over the network without USB', 'require soldering', 'only work on Linux', 'are impossible'], correctAnswer: 'push new firmware over the network without USB' },
      { text: 'FreeRTOS tasks should pass data with…', options: ['queues and semaphores, not raw globals', 'global variables', 'the file system', 'analog pins'], correctAnswer: 'queues and semaphores, not raw globals' },
    ],
  },

  // ── W5 · The Cloud-Connected Project ─────────────────────────────────────
  {
    week: 5,
    title: 'The Cloud-Connected Project',
    description: 'A complete IoT build: sensor node → MQTT → dashboard, tested and deployed.',
    topics: [
      {
        title: 'Designing the Cloud IoT Project',
        text: 'The capstone: a battery-friendly sensor node that pushes data to a cloud dashboard. Pick a concrete scope — indoor climate monitor (temp/humidity via DHT22) pushed to a web dashboard, with a history chart.\n\nArchitecture: sensor ESP32 (deep sleep) → Wi-Fi → MQTT broker (free tier: HiveMQ, EMQX, or Mosquitto) → dashboard/subscriber (Node-RED, a web app, or a free dashboard platform).\n\nWrite the spec: one goal, the hardware list, the data flow, and the message topics. A diagram of node → broker → dashboard beats a paragraph every time.',
        code: '// Project: indoor climate monitor\n// Hardware:  ESP32 DevKit + DHT22 (temp/humidity)\n// Data:     MQTT topic esp/climate { temp, humidity }\n// Broker:   broker.hivemq.com:1883 (free tier)\n// Dashboard: web page subscribing to the topic\n// Power:    deep sleep 10 min, USB or battery\n\n// Flow\nESP32 ──MQTT publish──▶ Broker ──subscribe──▶ Dashboard\n   ▲                                        └─ history chart\n   └── deep sleep between reads',
        note: 'Goal, hardware, topic, dashboard — specified on paper first. The diagram is your build map.',
      },
      {
        title: 'MQTT — The IoT Messaging Protocol',
        text: 'MQTT is a lightweight pub/sub protocol made for IoT. Clients connect to a broker; publishers send to topics; subscribers receive everything on their topics. Topics are slash paths: home/living/temp.\n\nThe PubSubClient library handles the ESP32 side: setServer(broker, port), setCallback for incoming messages, connect with an ID, publish(topic, payload) and subscribe(topic). Loop() must call client.loop() regularly to process messages.\n\nQoS levels trade reliability for cost: 0 fire-and-forget, 1 at-least-once, 2 exactly-once. Use 0 for sensor telemetry (a dropped reading is fine) and 1 for commands you can\'t lose.',
        code: '#include <PubSubClient.h>\n\nWiFiClient net;\nPubSubClient mqtt(net);\n\nvoid setupMQTT() {\n  mqtt.setServer("broker.hivemq.com", 1883);\n  mqtt.setCallback(onMsg);\n  while (!mqtt.connect("esp-kitchen-01")) {\n    delay(500);\n  }\n  mqtt.subscribe("esp/kitch/cmd");\n}\n\nvoid publishReading(float t, float h) {\n  char payload[64];\n  snprintf(payload, sizeof(payload),\n    "{\\"temp\\":%.1f,\\"humidity\\":%.1f}", t, h);\n  mqtt.publish("esp/climate", payload);\n}\n\nvoid onMsg(char* topic, byte* p, unsigned int len) {\n  Serial.printf("cmd on %s\\n", topic);\n}',
        note: 'Broker, topic, publish, subscribe, client.loop(). PubSubClient wraps it; the mental model is the real skill.',
      },
      {
        title: 'Building the Dashboard Side',
        text: 'The dashboard subscribes to the same topic. Node-RED (visual flows) or a small web app using MQTT.js in the browser (over WebSocket bridge) renders live values and history.\n\nNode-RED flow: MQTT in node → function to reshape → chart node + gauge node. The browser route: an MQTT over WebSocket client subscribes, and a charting library (Chart.js/ECharts) plots the stream.\n\nAdd the essentials: a connected/offline indicator, a history chart, and a last-seen timestamp. A dashboard without history is a toy; one without "last seen" hides dead devices.',
        code: '// Browser dashboard skeleton (MQTT over WebSocket)\nconst client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");\n\nclient.on("connect", () => client.subscribe("esp/climate"));\n\nclient.on("message", (topic, msg) => {\n  const { temp, humidity } = JSON.parse(msg.toString());\n  gauge.value = temp;                  // update live gauge\n  chart.push({ t: new Date(), temp }); // append to history\n  lastSeen.textContent = new Date().toLocaleTimeString();\n});',
        note: 'Subscribe to your own topic in a browser. Live gauge + history chart + last-seen = a real dashboard.',
      },
      {
        title: 'Testing, Deploying & What Comes Next',
        text: 'Test in layers: sensor reads correctly (serial), MQTT publishes (use MQTT Explorer to watch the topic), the dashboard renders (open it and watch), then put it on battery and watch overnight for stability. Add a reconnect watchout: after a network blip the device must recover by itself.\n\nDeployment checklist: deep sleep enabled, OTA in place, watchdog active, credentials in NVS, heartbeat publishing, and the dashboard shows last-seen. Enclose and mount the hardware, and document the build.\n\nThe road from here: edge AI with ESP32-S3, Matter for smart-home interoperability, or moving to cellular IoT (LTE-M/NB-IoT) for true field deployments. You now own the full pipeline: sensor → network → cloud → dashboard.',
        code: '// Test layers\n1. Serial:   DHT22 reads sane values\n2. MQTT:     MQTT Explorer shows esp/climate messages\n3. Dashboard: chart updates live\n4. Endurance: overnight on battery, self-recovers\n\n// Deployment checklist\n□ deep sleep ✓   □ OTA ✓   □ watchdog ✓\n□ creds in NVS ✓   □ heartbeat ✓   □ last-seen shown\n□ enclosure + README\n\n// Next forks\nESP32-S3 edge AI  ·  Matter smart-home  ·  LTE-M/NB-IoT cellular',
        note: 'Layer by layer, then endurance. Self-recovery after a blip is the difference between a demo and a device.',
      },
    ],
    quizzes: [
      { text: 'MQTT is…', options: ['a lightweight pub/sub protocol for IoT', 'a web framework', 'a database', 'a Wi-Fi standard'], correctAnswer: 'a lightweight pub/sub protocol for IoT' },
      { text: 'Publishers send to…', options: ['topics; subscribers receive everything they subscribe to', 'specific IPs', 'email addresses', 'phone numbers'], correctAnswer: 'topics; subscribers receive everything they subscribe to' },
      { text: 'The library that handles MQTT on the ESP32 is…', options: ['PubSubClient', 'WiFi.h', 'Servo.h', 'Preferences.h'], correctAnswer: 'PubSubClient' },
      { text: 'The ESP32-side key to processing messages is…', options: ['calling client.loop() regularly', 'a longer delay', 'a second core', 'NVS'], correctAnswer: 'calling client.loop() regularly' },
    ],
  },
];
