# EduNexus Pro — Embedded Systems & Real-Time OS — Deep Content Audit

**Phase:** Content Quality & Curriculum Audit (MASTER PLAN v1.0) — Deep-scan, independent
**Course audited:** `Embedded` — Embedded Systems & Real-Time OS
**Date:** 2026-08-14
**Auditor role:** Lead Curriculum Quality Auditor (independent, evidence-based)
**Audit mode:** **READ-ONLY** — nothing in the product, seed files, DB, or schema was modified. The single deliverable written is this report.

---

## Evidence labels used throughout

| Label | Meaning |
|---|---|
| **[CONFIRMED]** | Verified directly in the local Postgres `nexus` DB and/or the content pipeline files. |
| **[INFERRED]** | Reasonable reading not directly observable (e.g., live-deployment parity, student behaviour). |
| **[UNKNOWN — NOT VERIFIED]** | Requires external verification (prod DB, running instance, hardware reference manual). |
| **[RECOMMENDATION]** | Proposal only — nothing implemented. |

**Deployment caveat:** per the Phase-1 deployment-state finding, the live site runs GitHub `main` (4+ commits ahead of local `master`). DB/course-state findings are **[CONFIRMED]** against the local DB and local content files; live parity is **[INFERRED]**. The prior audit of this course scored it **82/100**; this audit re-derives the score independently under a **new 12-dimension weighted rubric** (below) and does **not** inherit that number.

---

## 1. Executive Summary

The Embedded Systems & Real-Time OS course is the strongest, most professionally-current course in the EduNexus catalogue. Its 20-week / 80-topic structure is coherent and progressive (hardware foundations → CPU/ARM/AVR internals → peripherals → serial buses → ADC/DAC → RTOS → engineering practice → submission). The prose is dense, opinionated, and technically rich; nearly every topic pairs a mental model with register-level code, a practical note, and a "trap" callout. Industry practice is unusually well served (MISRA-style coding standards, static analysis, HIL testing, CI for firmware, worst-case execution time, power budgeting, decision logs).

The audit independently confirms **six technical defects in flagship lessons** — the most serious being a factual error in the Cortex-M register-bank lesson (xPSR described as containing PRIMASK) and an out-of-spec STM32F4 clock tree (APB1 = 64 MHz, exceeding the 42 MHz silicon limit). It also confirms the platform-level failures that cap the course's assessment quality: the 18-question final exam is **dead content** (no route or UI), week quizzes silently bundle the 16 topic questions with the 8 chapter questions (duplicate exposure), none of the **498 questions carry an explanation**, topic-quiz "randomization" is a no-op, and there are no in-content assignment/project briefs or rubrics. There are **no explicit learning objectives** anywhere in the course, and no embedded-security content (secure boot, crypto, MPU/TrustZone) in the curriculum.

**Independent score: 70.5/100 (HIGH confidence).** This is 11.5 points below the prior audit's 82/100; the gap is explained by the different weighting (the prior rubric gave 20% to Practical Learning and 10% to Industry Relevance, and did not weight Learning Objectives/Feedback as heavily) plus the re-verified technical defects, the dead final exam, and the absence of any assessment feedback. The content prose itself is not the problem — the top candidates for improvement are targeted fixes (Section 24, 25), not rewrites.

---

## 2. Course Metadata

| Field | Value | Evidence |
|---|---|---|
| Course ID | `Embedded` | **[CONFIRMED]** — DB `Course` table |
| Title | Embedded Systems & Real-Time OS | **[CONFIRMED]** |
| Description | "Architect microcontroller interfaces, serial communication buses, and RTOS kernels." | **[CONFIRMED]** |
| Price | 699 | **[CONFIRMED]** |
| Published | true | **[CONFIRMED]** |
| Modules (weeks) | 20 | **[CONFIRMED]** |
| Topics | 80 (exactly 4 per module) | **[CONFIRMED]** |
| Topic quiz questions | 320 (exactly 4 per topic) | **[CONFIRMED]** |
| Chapter/module quiz questions | 160 (exactly 8 per module, `topicId IS NULL`) | **[CONFIRMED]** |
| Final exam questions | 18 | **[CONFIRMED]** — `FinalExamQuestion` |
| Challenges (interactive) | 0 for this course | **[CONFIRMED]** |
| Projects | 0 (the `Project` table is empty platform-wide) | **[CONFIRMED]** |
| CourseProgress / ModuleProgress / TopicProgress / QuizResult / CertificateRecord rows | 0 / 0 / 0 / 0 / 0 | **[CONFIRMED]** — no students have engaged in the local snapshot |

Question ID ranges: final exam **598–615**; module quizzes **12709–13172**; topic quizzes **12693–13164**. No overlap.

---

## 3. Content Inventory

| Item | Claimed (seed file / docs) | Verified in DB | Match? |
|---|---|---|---|
| Modules | 20 | 20 (weeks 1–20) | ✅ match |
| Topics | 80 | 80 (4 per module, all 20 modules) | ✅ match |
| Topic quiz questions | 320 | 320 | ✅ match |
| Module quiz questions | 160 | 160 (`topicId IS NULL`) | ✅ match |
| Final exam questions | 18 | 18 (ids 598–615) | ✅ match |
| Challenges | 0 | 0 | ✅ match |
| Projects | 0 | 0 | ✅ match |
| Duplicate question texts | 0 | 0 (checked all 480 + 18) | ✅ match |
| Total reachable assessment questions | — | 480 (week + topic) | note: final exam unreachable |

**Verdict: the seed-file inventory exactly matches the database.** No DB-vs-file discrepancies were found in counts. A random cross-check of flagged topics (Clocks, Cortex-M, SysTick, C for Microcontrollers, Fetch-Decode-Execute, AVR) confirmed the DB rows match the content file byte-for-byte for text/code/note/quiz blocks. **[CONFIRMED]**

---

## 4. Curriculum Structure

The course is a single linear spine of 20 weekly modules, each with exactly 4 topics and exactly 8 chapter-quiz questions, plus a 4-question quiz per topic.

| Phase | Weeks | Theme |
|---|---|---|
| Foundations | 1–3 | What embedded is; hardware (memory map, clocks, power, reset); C for microcontrollers + toolchain + debugging |
| CPU internals | 4–7 | Fetch-decode-execute; RISC/CISC; von Neumann vs Harvard; SoC/peripherals; **AVR** register-level; **ARM Cortex-M** + NVIC + Thumb + CMSIS |
| Peripherals | 8–10 | GPIO electrical reality + HAL; timers/PWM/input-capture/SysTick; interrupt latency, races, ISR discipline |
| Serial buses | 11–13 | UART, SPI, I2C — wiring, framing, real devices, debug/traces |
| Analog | 14 | ADC (Nyquist, DMA streaming), DAC |
| RTOS | 15 | Tasks, scheduler, queues, semaphores/mutexes, RTOS bugs |
| Engineering | 16–18 | Requirements/architecture/WCET/power; coding standards/static analysis/testing/debugging; test pyramid/CI/coverage |
| Professional practice | 19–20 | Design docs, datasheets, documentation, decision log; planning a full project, demo, release review |

**Strengths:** the dual-chip pedagogy (AVR then ARM) gives students a visible 8-bit baseline before the 32-bit core; the interrupt/race/ISR discipline is exactly the "real-world firmware" material employers test; the engineering-practice tail (static analysis, HIL, CI, WCET, coverage) is rare in online embedded courses.

**Weaknesses:** no stated prerequisites (assumes C + basic electronics); no capstone project or graded assignment anywhere in content; no embedded-security module; the final "Certification" topic is aspirational copy with no platform tie.

---

## 5. Module-by-Module Analysis

| Wk | Module | Topics | Quality | Notable findings |
|---|---|---|---|---|
| 1 | Introduction to Embedded Systems | What an Embedded System Really Is; Real-Time Systems & Deadlines; The Embedded Development Environment; Hardware in the Loop: Datasheets & Schematics | 92 | Excellent definitions; real-time/deadline framing is correct and motivating. |
| 2 | Embedded Hardware | The Memory Map; **Clocks (Oscillators, PLLs & Clock Trees)**; Power (Rails/Current/Brownouts); Reset, Boot & Startup Code | 84 | **Clock-tree defect (EM-02, P1).** Otherwise strong (brownout, startup code). |
| 3 | Embedded Software | **C for Microcontrollers**; Toolchains/Builds/Makefiles; Debugging (GDB/SWD/print); Design Patterns for Firmware | 86 | **Magic address (EM-13, P3).** `volatile`/fixed-width/ISR-flag conventions are excellent. |
| 4 | Microprocessors | **The Fetch-Decode-Execute Cycle**; RISC vs CISC; von Neumann vs Harvard; The Stack/Heap/C Runtime | 82 | **Defective disassembly (EM-06, P2).** Rest is strong. |
| 5 | Microcontrollers | The SoC; Peripherals & CPU connection; **Peripheral Zoo (GPIO/UART/Timers/ADC)**; Memory-Mapped I/O | 82 | **SysTick CTRL missing ENABLE (EM-04, P2).** Memory-mapped I/O vs special instructions is accurate. |
| 6 | AVR Basics | AVR Architecture & Register File; Timers (TCNT/OCR/PWM); Interrupts & SREG I-Flag; UART on AVR | 90 | **"GIMPEL" typo (EM-14, P3).** Register-level AVR content is accurate (DDRx/PORTx/PINx, SREG, UBRR0/UDR0). |
| 7 | ARM Basics | **Cortex-M Architecture & Register Bank**; NVIC; Thumb/Thumb-2; CMSIS | 78 | **xPSR/PRIMASK error (EM-01, P1).** NVIC/CMSIS otherwise strong. |
| 8 | GPIO Programming | GPIO Modes & Electrical Reality; Read-Modify-Write & Atomic Pin Control; Debounce & Filtering; Simple GPIO HAL | 93 | Accurate; RMW-vs-BSRR distinction is correct and practical. |
| 9 | Timers | Counters/Prescalers/Heartbeat; PWM/Compare; Input Capture; SysTick | 80 | **TIM2 1 ms example clock assumption (EM-05, P2).** Overflow-trap and prescaler/ARR separation are good. |
| 10 | Interrupts | Latency & Critical Path; Race Conditions; Priorities/Nesting/Inversion; ISR Discipline | 94 | 12-cycle context-save, PRIMASK restore discipline, SPSC ring buffer — all correct. Strongest week. |
| 11 | UART Communication | Wiring/Framing/Baud; Polling vs Interrupt vs DMA; Framing Protocols; printf over UART | 92 | Accurate baud/overrun/framing coverage. |
| 12 | SPI Communication | Four Wires/Many Slaves; Master-Slave/CS/Daisy Chains; Real Devices (Flash/SD/Display); Debugging SPI | 90 | CPOL/CPHA "mode trap" covered; real-device focus. |
| 13 | I2C Communication | Two Wires/Open-Drain; Register-Mapped Sensors; Failure Modes (NACK/Stretch/Corruption); I2C vs SPI | 90 | Open-drain/addressing/NACK coverage is accurate and practical. |
| 14 | ADC and DAC | ADC Voltage→Number; Sampling/Aliasing/Nyquist; DMA-Streamed ADC; DAC & Traps | 91 | 12-bit 0.8 mV/step claim correct (3.3/4095). SWSTART bit-30, ADON bit-0 correct. |
| 15 | RTOS Basics | Why an RTOS; Queues; Semaphores & Mutexes; RTOS Bugs (Deadlock/Starvation/Inversion) | 93 | FreeRTOS semantics correct; priority-inversion narrative accurate. |
| 16 | Embedded Project Design | Requirements; Architecture Block Diagram; Real-Time Scheduling & WCET; Power Budgeting & Low Power | 88 | Strong design theory; **no graded brief/rubric (EM-09, P2).** |
| 17 | Development | Firmware Coding Standards & Review; Static Analysis & Compiler Warnings; Testing (Host-Side & HIL); Debugging Nightmares | 88 | MISRA-aligned standards; static analysis correct. |
| 18 | Testing | The Testing Pyramid for Firmware; Testable Firmware (Seam Pattern); CI for Firmware; Coverage | 92 | Accurate and current; coverage-limits discussion honest. |
| 19 | Documentation | Design Documents; Reading Datasheets; Writing Docs People Read; Decision Log & Handoff | 90 | Decision-log/handoff culture is genuinely professional. |
| 20 | Final Submission | Planning a Complete Project; The Demo; Release Review Checklist; Engineer's Mindset & Certification | 80 | Solid process content; **"certification" topic is aspirational, no rubric, no brief (EM-09).** |

---

## 6. Topic-by-Topic Findings

All 80 topics carry an `order` 0–3 within their module (chunk IDs `W{week}.T{order}`). Findings below flag every topic with a defect or a notable strength; unflagged topics are healthy.

| Chunk ID | Topic | Finding |
|---|---|---|
| W1.T0–T3 | Introduction weeks | Healthy. Real-time/deadline definitions correct; datasheet-first mindset is a strength. |
| **W2.T1** | **Clocks: Oscillators, PLLs & Clock Trees** | **P1 defect:** "HSE 8MHz -> PLL(x16) -> SYSCLK 128MHz -> AHB -> APB1 (÷2=64MHz) / APB2 (÷2=64MHz)". APB1 = 64 MHz exceeds the 42 MHz maximum for STM32F4. A student replicating this config gets a non-functional/invalid peripheral clock. Also, "classic" F4 = 168 MHz (8×21); 128 MHz is non-default. **[CONFIRMED]** `embedded.ts:102`; DB topic id 1595 |
| **W3.T0** | **C for Microcontrollers** | **P3 defect:** `volatile uint32_t *port = (volatile uint32_t *)0x40021000;` — unannotated magic address. On STM32F1 this is the RCC base; on STM32F4 it is GPIOE base. Neither is disclosed; the course teaches both families. **[CONFIRMED]** `embedded.ts:141`; DB topic id 1598 |
| W3.T2 | Debugging: GDB, SWD & the Art of the Print | Strength: debug-vs-log-vs-scope triangulation; HardFault-handler advice correct. |
| **W4.T0** | **The Fetch-Decode-Execute Cycle** | **P2 defect:** disassembly of `sum(int n)` never initialises `r1` (the loop variable), so the shown `cmp`/`blt` reads an uninitialised register; the block is presented as real `objdump` output but is fabricated. Mis-teaches what a compiler emits. **[CONFIRMED]** `embedded.ts:187`; DB topic id 1602 |
| W4.T1–T3 | RISC/CISC; von Neumann vs Harvard; Stack/Heap | Healthy and accurate. |
| **W5.T2** | **GPIO, UART, Timers & ADC: The Peripheral Zoo** | **P2 defect:** `SysTick->CTRL = (1 << 2) | (1 << 1); // CLKSOURCE + INTEN` — omits bit 0 (ENABLE). The timer is configured but never enabled. **[CONFIRMED]** `embedded.ts:244`; DB topic id 1608 |
| **W6.T0** | **The AVR Architecture & Register File** | **P3 typo:** "The **GIMPEL** of AVR" (sic — almost certainly "gist"). AVR register file, DDRx/PORTx/PINx, SREG I-flag all correct. **[CONFIRMED]** `embedded.ts:276`; DB topic id 1612 |
| **W7.T0** | **The Cortex-M Architecture & Register Bank** | **P1 defect:** "**xPSR** — the program status register: condition flags (N/Z/C/V), **interrupt mask (PRIMASK)**, and the T-bit". PRIMASK is a **separate** special register (MRS/MSR), not an xPSR field. xPSR = APSR+IPSR+EPSR. The same topic's CMSIS code and the topic's quiz questions about PRIMASK are correct, so the error is localised to this prose but sits in the flagship ARM lesson. **[CONFIRMED]** `embedded.ts:321`; DB topic id 1614 |
| W7.T1–T3 | NVIC; Thumb/Thumb-2; CMSIS | Healthy. NVIC priority "lower number = higher priority" correct; Thumb-only claim correct; 12-cycle context-save correct. |
| W8.T0–T3 | GPIO modes, RMW, debounce, HAL | Healthy; the strongest peripheral week. |
| **W9.T0** | **Counters, Prescalers & the Heartbeat** | **P2 defect:** TIM2 example "16 MHz -> /16 prescaler -> 1 MHz, ARR=999 -> 1 ms" assumes a 16 MHz timer clock. On a default STM32F4 (SYSCLK 168 MHz, APB1 ÷4 → 42 MHz, timer clock ×2 = 84 MHz) the same PSC/ARR yields ~190 µs, not 1 ms. **[CONFIRMED]** `embedded.ts:411`; DB topic id 1622 |
| W9.T1–T3 | PWM, Input Capture, SysTick | Healthy. W9.T3 SysTick lesson itself uses `SysTick_Config` correctly (contrast with W5.T2). |
| W10.T0–T3 | Interrupt latency, races, inversion, ISR discipline | Healthy — best week in the course. |
| W11.T0–T3 | UART set | Healthy. |
| W12.T0–T3 | SPI set | Healthy. |
| W13.T0–T3 | I2C set | Healthy. |
| W14.T0–T3 | ADC/DAC set | Healthy. Nyquist, DMA half/full trick, DAC traps accurate. |
| W15.T0–T3 | RTOS basics | Healthy. |
| W16.T0–T3 | Project design | Healthy content; no graded brief (EM-09). |
| W17.T0–T3 | Development | Healthy. |
| W18.T0–T3 | Testing | Healthy. |
| W19.T0–T3 | Documentation | Healthy. |
| W20.T0–T3 | Final submission | Healthy process content; "certification" topic aspirational. |

---

## 7. Content Chunk Summaries

Chunk = one topic; ID = `W{week}.T{order}`. The table is condensed — the quality narrative is in Sections 5–6; this section confirms the 80-chunk inventory with one-line summaries and flags. (Full text for any chunk can be read from `backend/prisma/content/embedded.ts` by week.)

| Week | T0 | T1 | T2 | T3 |
|---|---|---|---|---|
| 1 | Embedded defined; CPUs/RTOS scope | Real-time & deadlines | Toolchain/IDE/build-flash-debug loop | Datasheet/schematic reading; HIL |
| 2 | Memory map: flash/SRAM/registers | **Clocks/PLL (P1 defect)** | Power rails, brownout | Reset, boot, startup code |
| 3 | **C constraints (P3 magic addr)** | Toolchains/Makefiles | GDB/SWD/log triangulation | Firmware design patterns |
| 4 | **Fetch-decode-execute (P2 disasm)** | RISC vs CISC | von Neumann vs Harvard | Stack/heap/C runtime |
| 5 | SoC internals | Peripherals↔CPU connection | **Peripheral zoo (P2 SysTick)** | MMIO vs special instructions |
| 6 | **AVR arch (P3 typo)** | AVR timers/OCR/PWM | AVR interrupts/SREG | AVR UART driver |
| 7 | **Cortex-M (P1 xPSR)** | NVIC & priorities | Thumb/Thumb-2 | CMSIS |
| 8 | GPIO modes/electrical | RMW & atomic pin control | Debounce & filtering | GPIO HAL |
| 9 | **Counters/prescaler (P2 TIM2)** | PWM/compare | Input capture | SysTick (correct) |
| 10 | Interrupt latency | Race conditions | Priority/nesting/inversion | ISR discipline |
| 11 | UART wiring/framing/baud | Polling vs IRQ vs DMA | Framing protocols | printf over UART |
| 12 | SPI four-wire bus | CS timing/daisy chain | Real devices: flash/SD/display | Debugging SPI (scope) |
| 13 | I2C open-drain/addresses | Register-mapped sensors | I2C failure modes | I2C vs SPI |
| 14 | ADC voltage→number | Sampling/aliasing/Nyquist | DMA-streamed ADC | DAC & traps |
| 15 | Why an RTOS | Queues | Semaphores & mutexes | Deadlock/starvation/inversion |
| 16 | Requirements | Architecture block diagram | Real-time scheduling & WCET | Power budgeting |
| 17 | Coding standards & review | Static analysis/warnings | Host-side & HIL testing | Heisenbugs & tooling |
| 18 | Testing pyramid | Seam pattern | CI for firmware | Coverage |
| 19 | Design documents | Reading datasheets | Writing docs | Decision log & handoff |
| 20 | Planning a project | The demo | Release review | Engineer's mindset & certification |

Median topic text ≈ 344 words (range 262–428). No filler topics; every chunk has a code block or concrete example plus a mental-model summary and usually a "trap" callout.

---

## 8. Technical Accuracy Findings

All **[CONFIRMED]** in both `backend/prisma/content/embedded.ts` and the local DB.

| ID | Sev | Claim | Where | Correct statement |
|---|---|---|---|---|
| T-1 | **P1** | "xPSR … interrupt mask (PRIMASK)" | `embedded.ts:321`, topic 1614 | PRIMASK is a separate special register (MRS/MSR); xPSR = APSR + IPSR + EPSR |
| T-2 | **P1** | "APB1 (÷2=64MHz)" on STM32F4 | `embedded.ts:102`, topic 1595 | APB1 max = 42 MHz (SYSCLK 168 → ÷4). Also "classic" F4 = 168 MHz, not 128 |
| T-3 | **P2** | Disassembly shows `sum(int n)` loop never initialising `r1` | `embedded.ts:187`, topic 1602 | Compiler would emit an initialiser; the shown object code is fabricated |
| T-4 | **P2** | `SysTick->CTRL = (1<<2)\|(1<<1)` "CLKSOURCE + INTEN" | `embedded.ts:244`, topic 1608 | Bit 0 ENABLE is required or the SysTick never runs |
| T-5 | **P2** | TIM2 "16 MHz -> /16 -> 1 MHz, ARR=999 -> 1 ms" | `embedded.ts:411`, topic 1622 | Default F4 timer clock = 84 MHz (APB1 42 ×2), so PSC=15/ARR=999 ≈ 190 µs |
| T-6 | **P3** | Unannotated `0x40021000` register pointer | `embedded.ts:141`, topic 1598 | On F1 = RCC base; on F4 = GPIOE base; neither disclosed; example is cross-family ambiguous |
| T-7 | **P3** | "The GIMPEL of AVR" | `embedded.ts:276`, topic 1612 | Typo for "gist" |
| T-8 | **P3** | Final-exam Q599 "Which register pair … initial stack pointer and reset handler?" | `FinalExamQuestion` id 599 | They are memory locations (vector-table entries), not a register pair — stem is misleading |

**Accuracy otherwise is high.** Spot-verified correct claims: AVR 32×8 register file, SREG I-flag, UBRR0/UDR0; Cortex-M 12-cycle context save, MSP/PSP, Thumb-only, NVIC lower-number-higher-priority; STM32F4 ADC 12-bit 0.8 mV/step (3.3/4095), SWSTART=CR2 bit 30, ADON=bit 0; FreeRTOS semantics; Nyquist sampling; MISRA-style static-analysis claims. No other wrong correct-answers were found in the 498-question bank.

---

## 9. Learning Objective Audit

- **Explicit learning objectives: NONE at any level.** No course-level outcomes, no module objectives, no per-topic "by the end of this lesson you will…". **[CONFIRMED]** — 80 topic texts scanned; zero objective statements.
- **Prerequisites: none stated** — the course assumes C, digital logic, and basic electronics without saying so (EM-19, P3).
- **Implicit objectives** are strong: each topic's "mental model" sentence and "the rule" summary act as de-facto objectives, and module descriptions are well written.
- **Verdict:** the *content* knows what it wants to teach, but the *course* never tells the student or the assessor. This caps Bloom-level alignment and makes the assessment bank's recall-only nature unfixable by inspection.

---

## 10. LO → Content → Practice → Assessment Matrix

Because no explicit LOs exist, the matrix maps the implicit skill clusters to where they are taught, practised, and assessed.

| Implicit skill cluster | Content (weeks) | Practice opportunity | Assessed? |
|---|---|---|---|
| Define embedded/real-time constraints | W1 | none | ✅ module quiz (recall) |
| Read memory maps / clocks / power | W2 | register examples | ✅ recall |
| Write constrained C (volatile, fixed-width) | W3, W17 | code snippets | ✅ recall; **no coding assessment** |
| Explain CPU fetch-decode-execute / ISA | W4 | disassembly walk-through | ✅ recall (flawed sample) |
| Program AVR peripherals at register level | W6 | code | ✅ recall |
| Program Cortex-M / NVIC / CMSIS | W7, W10 | code | ✅ recall |
| Drive GPIO/timers/SysTick/PWM/ADC/DAC | W8, W9, W14 | code | ✅ recall |
| Reason about interrupts/races/ISR discipline | W10 | SPSC patterns | ✅ recall |
| Wire & debug UART/SPI/I2C | W11–W13 | scope/logic-analyzer guidance | ✅ recall |
| Use an RTOS (tasks/queues/semaphores) | W15 | code | ✅ recall |
| Design: requirements/architecture/WCET/power | W16 | none | ❌ **not assessed** |
| Engineering: standards/static analysis/testing/CI | W17–W18 | none | ❌ **not assessed** |
| Professional: docs/datasheets/decision log/release | W19–W20 | none | ❌ **not assessed** |

**Key gaps:** every applied/design/engineering skill cluster (W16–W20) is taught but **never assessed**; there is no coding/performance assessment anywhere; the 498-question bank is 100 % recall. **[CONFIRMED]**

---

## 11. Assessment Audit

| Assessment type | Volume | Reachable? | Randomisation | Feedback |
|---|---|---|---|---|
| Chapter/week quiz (8 module-only questions) | 160 | ✅ via `/quiz/questions/:courseId/:week` — but returned bundled with 16 topic questions (24 total) | ❌ no shuffle, fixed order | ❌ none |
| Topic quizzes (4 per topic) | 320 | ✅ via `/quiz/questions/topic/:topicId` | ❌ no-op: `shuffle + slice(0,5)` on a 4-question bank returns all 4 | ❌ none |
| Final exam | 18 | ❌ **dead content** — zero refs in `backend/src` / `frontend/src` | n/a | n/a |
| Challenges | 0 | n/a | n/a | n/a |
| Projects / assignments | 0 briefs | ✅ envelope UI live | n/a | admin feedback free-text |

- Grading is exact-string match on option text (`quizService.ts:52`); pass threshold 60 %; XP 100 base +50 perfect.
- **Week-quiz duplication (EM-07, P2):** `getQuizQuestions` returns *all* questions whose `moduleId` matches — including the 16 topic questions per week. A student who did the 4-question topic quizzes then opens the week quiz and sees those same 16 again plus the 8 chapter questions. Total 24 per week, but 16 are repeats.
- **No summative assessment (EM-03, P1):** the final exam is unreachable, and the certificate gate (dynamic module completion + verified payment) does not require any exam. A student can earn the certificate with zero exam evidence.

---

## 12. Question-Level Defects

**Method:** all 480 course quiz questions + 18 final-exam questions reviewed for (a) wrong correct answer, (b) broken stem, (c) flippant/comedic distractors, (d) duplicated text.

| Defect class | Count | Detail |
|---|---|---|
| Wrong correct answer | 0 | **[CONFIRMED]** — every spot-verifiable answer is correct |
| Broken/imprecise stem | 1 | Final-exam id **599**: "Which **register pair** does the CPU read on Cortex-M boot…" — correct answer is the vector-table addresses 0x00000000/0x00000004, which are *memory locations*, not a register pair (P3) |
| Flippant/comedic distractors | 45 | Examples: id 12714 options include "a USB charger only", "the antenna", "a printer port"; id 12827 "toasts the pin"; id 13026 "run two ADCs"; id 13170 "the sales slides", "the logo" |
| Duplicated question text | 0 | **[CONFIRMED]** |

Representative flippant items (all **P3** — the correct answer is right, but the distractors are jokes that fail to test genuine discrimination and undercut the course's professional tone):

| DB id | Stem | Joke options |
|---|---|---|
| 12714 | The debugger connects to the chip via… | "a USB charger only", "the antenna", "a printer port" |
| 12827 | Besides delivering the byte, reading UDR0 also… | "toasts the pin" |
| 13026 | The half/full DMA trick lets you… | "sample faster than the ADC", "run two ADCs" |
| 13170 | A release review should confirm… | "the sales slides", "the logo" |

Full list of confirmed flippant ids: 12714, 12738, 12827, 12829, 12924, 12951, 13026, 13080, 13125, 13129, 13135, 13137, 13139, 13145, 13147, 13150, 13170 … (45 total). **[CONFIRMED]**

Healthy items are summarised rather than enumerated: the remaining 434 course questions and 17 final-exam questions are well-targeted, single-fact recall items with plausible engineering distractors and no wrong answers.

---

## 13. Practical Learning Audit

**Strengths (the course's best dimension):**
- Register-level programming on **two** real families (AVR ATmega328P, STM32F4 Cortex-M) — not abstract pseudocode.
- Real toolchain guidance: GCC/arm-none-eabi, Makefiles, linker scripts, OpenOCD/gdbserver, `-mthumb`, `-fno-builtin` conventions.
- Debug craft: GDB breakpoints, SWD, logic analyser, scope, HardFault-handler diagnostics — the triangulation of "code vs hardware" is genuinely expert-level.
- HIL testing, seam patterns, CI for firmware, coverage — current professional practice.

**Weaknesses:**
- **No executable lab track.** Code blocks are inline lesson snippets; there is no scaffolded lab (starter project → verify → extend) per week, no buildable repo, no submission.
- Skeleton APIs are not labelled as abridged/non-compiling (EM-17, P3).
- **No recommended starter board/kit/BOM** anywhere — a learner has no guidance on what hardware to buy to follow the course (EM-18, P3).
- No coding assessment exists to verify hands-on skill (the interactive challenge engine is platform-wide UI-orphaned; even it is not seeded for Embedded).

---

## 14. Project Audit

- **In-content project: none.** W16 and W20 teach *how* to plan/demo/release a project but define **no actual project brief, no rubric, no deliverable**, and award no credit (EM-09, P2). Contrast with the C++ course, which at least embeds a capstone rubric in prose.
- **Platform project envelope:** live (`routes/project.ts`) but free-form — students submit `title/description/sourceCodeUrl/reportUrl/githubUrl`; admin approves with +100 XP. No brief or rubric is referenced.
- **Gate:** hardcoded **20-module** completion (`routes/project.ts:48-56`). Embedded has exactly 20 modules, so the gate is satisfied today — latent break, not active (EM-21, P2).
- **Assignments:** 4 weekly assignments mapped `week N → module 5N` (`routes/assignment.ts:49-56`); content defines no such mapping; uploads are `mock_` file names, no real file storage (EM-22, P3).
- **Verdict:** Embedded students cannot submit any *curriculum-defined* project; the platform envelope is an empty form.

---

## 15. Industry Relevance Audit

**Current and differentiating:**
- MISRA-style coding standards, static analysis (`-Wall -Wextra -Werror`), compiler-warning discipline (W17).
- Host-side vs hardware-in-the-loop testing, CI for firmware, coverage (W18) — matches real embedded-team practice.
- WCET, power budgeting, decision logs, handoff notes, release review checklists (W16, W19, W20) — rare in online courses.
- Debug tooling (SWD/OpenOCD/scope/logic analyser) matches the 2020s toolchain.

**Gaps:**
- **No embedded security** (EM-10, P2): no secure boot, signed firmware, crypto on MCU, MPU/TrustZone, or safe-RTOS guidance. In 2026 this is a material omission for hiring relevance (IoT/Matter/PSA-certified roles).
- No watchdog/voltage-supervisor/robustness lesson (recovery, not just fault handling).
- No CAN (W10–W13 cover UART/SPI/I2C but not CAN/USB/Ethernet — a stated "serial buses" theme that stops short of automotive).
- No BLE/Zephyr/OTA; the modern "connected MCU" workflow is absent.

---

## 16. Obsolete / Deprecated Technology Audit

- **No genuinely obsolete technology is taught.** AVR is dated but is taught explicitly as a *pedagogical* 8-bit baseline, and the framing ("master AVR and you can read any MCU") is honest. ATmega328P/Arduino-Uno context is still a valid learning target.
- STM32F4 (Cortex-M4F) is mature but current and widely used; CMSIS is the vendor-neutral standard.
- FreeRTOS is the de-facto open RTOS — appropriate.
- Minor anachronism: W2 presents a 128 MHz F4 clock tree as "classic" (168 MHz is the classic F407 config) — flagged under T-2 rather than as an obsolescence issue.
- **Verdict:** no obsolete-content finding. **[CONFIRMED]**

---

## 17. Duplication Audit

- **Question text duplication:** zero duplicate texts across 498 questions. **[CONFIRMED]**
- **Content duplication:** none across topics (each concept appears once; the AVR/ARM and bus weeks cross-reference rather than repeat).
- **Systemic duplication — week quiz bundles topic questions (EM-07, P2):** each week quiz returns 16 topic questions *in addition to* the 8 chapter questions, so students who already completed the 4-question topic quizzes see the same 16 questions again in the week quiz. 320 unique topic questions are effectively presented twice. **[CONFIRMED]** `quizService.ts:4`
- **Template-format duplication (platform, legacy):** the old `seed.ts` generated ~50 boilerplate final-exam questions per course; Embedded is now owned by `reseed_embedded_full.ts` and is unaffected. The 18 Embedded final-exam questions are hand-written and distinct.

---

## 18. Consistency Audit

- **Structural consistency:** flawless — every module has exactly 4 topics and 8 module-quiz questions; every topic has exactly 4 quiz questions. **[CONFIRMED]**
- **Voice/tone:** consistent expert-but-conversational throughout; "the rule", "the mental model", "the trap" conventions are uniform.
- **Naming:** peripheral/register naming is accurate and consistent (no F1/F4 register-name mixing inside a single lesson, except the cross-family magic-address example flagged in T-6).
- **Depth:** median topic 344 words, range 262–428 — remarkably even; no thin or bloated topics.
- **Inconsistency to fix:** the *only* technical inconsistency is W5.T2 presenting a broken SysTick while W9.T3 presents the correct `SysTick_Config` idiom without reconciling them (EM-04). Also "128 MHz classic" vs the rest of the course's F4-168 framing (T-2).

---

## 19. Feedback Audit

- **Assessment feedback: absent for all 498 questions.** The `QuizQuestion` model has `{ text, options[], correctAnswer }` and **no explanation field** (`schema.prisma:137-151`). `ExamResultsModal.tsx` shows score, pass/fail, and per-question "Your answer … Correct: …" — **never why** (EM-11, P2). The separate `PracticeQuestion` model *does* carry an `explanation` (`schema.prisma:218`), proving the platform can do feedback; course quizzes simply don't.
- **Content feedback: excellent.** "Traps", mental-model summaries, and note callouts give immediate corrective guidance within the lesson — this is why the feedback dimension is not zero.
- **Verdict:** a learner who gets a quiz question wrong is told the right option but not the reasoning. For a course whose content is otherwise so didactically strong, this is the single most fixable gap.

---

## 20. Student Journey Audit

Local DB shows **zero engagement** (0 CourseProgress / 0 ModuleProgress / 0 QuizResult / 0 CertificateRecord) — either a fresh course or the local snapshot predates enrolments. **[CONFIRMED]** so the journey below is reconstructed from code and content, not observation.

- **Onboarding:** no prerequisite check; course card + syllabus only. A learner without C/electronics background is not warned (EM-19, P3).
- **Weekly rhythm:** read 4 topics → take 4× topic quizzes → take the week quiz (24 Qs, 16 of them repeats). XP 100/+50. Week-1-only badge (platform-wide front-loaded gamification, EM-23, P3).
- **Progress:** TopicProgress → ModuleProgress → CourseProgress advance automatically on passing the week quiz; certificate gate = dynamic module count + verified payment, **no exam required** (EM-03, P1).
- **Milestones:** certificate available at 100 % completion; project submission gated on all 20 modules (works for this course); assignments gated on `week*5` mapping (works for this course's shape).
- **5-minute quiz timer** on every quiz, auto-submit at 0:00 (including a partial set), with a dismissible exit-confirm dialog. Reasonable exam integrity, but a recall quiz timed at 5 minutes for 24 questions is tight for weaker students.
- **Endpoint:** a passing grade drives `confetti()` and a certificate-ready state — motivating, but no substantive summative reward since the final exam is unreachable.

---

## 21. Assessment Reachability Audit (DB → route → API → frontend → student)

| Asset | DB | Route/API | Frontend consumer | Reachable by student |
|---|---|---|---|---|
| Week quiz (8 chapter Qs) | ✅ 160 | ✅ `/quiz/questions/:courseId/:week` | `Quiz.tsx`, `CourseDetail.tsx` | ✅ but bundled with 16 topic Qs (24 total) |
| Topic quiz (4 per topic) | ✅ 320 | ✅ `/quiz/questions/topic/:topicId` | same quiz UI | ✅ (randomisation a no-op) |
| Final exam | ✅ 18 (ids 598–615) | ❌ **no route** | ❌ **zero refs** in `backend/src` & `frontend/src` | ❌ **dead content** |
| Challenges | 0 for Embedded | n/a | n/a | n/a |
| Practice bank | generic, 5 Qs | ✅ `/practice` | `PracticeArena.tsx`, `Dashboard.tsx` | ✅ but not Embedded-specific |
| Projects/assignments | 0 briefs | ✅ envelope routes | `ProjectStatusCard.tsx` | ✅ envelope only |

**Reachable question count for Embedded = 480 (week + topic).** Final exam 18 questions unreachable. Week quiz duplication means 320 topic questions are shown twice. **[CONFIRMED]**

---

## 22. Scope / Identity Audit

- **Identity is coherent:** "architect microcontroller interfaces, serial communication buses, and RTOS kernels" — the course delivers exactly that and no more. It is a *firmware/RTOS engineering* course, not a PCB/hardware-design course, and it stays in lane.
- **Chip choice is defensible:** AVR (teaching) + STM32F4 (industry). The one identity wobble is that the "serial buses" arc stops at I2C (W13); CAN/USB/Ethernet are mentioned as a theme but never taught — scope either over- or under-promises slightly depending on reading.
- **Omissions that weaken the "complete embedded engineer" claim:** security (EM-10), watchdog/supervisor, MPU, bootloader/OTA, and any graded project. These are additive, not identity-breaking.
- **Verdict:** scope is honest and well-executed; the title/description match the content.

---

## 23. Scorecard + Confidence

### Overall score: **70.5 / 100 — HIGH confidence**

| # | Dimension | Weight | Score | Weighted | Basis |
|---|---|---|---|---|---|
| 1 | Curriculum Architecture | 10 | 9.0 | 9.0 | 20-week spine, 4-topic cadence, AVR→ARM→RTOS→engineering arc, flawless structural consistency |
| 2 | Learning Objectives | 10 | 5.0 | 5.0 | zero explicit objectives/prerequisites; strong implicit "mental model" statements |
| 3 | Content Quality | 15 | 12.5 | 12.5 | dense, expert, uniform depth; minor: unlabelled skeleton code, one typo |
| 4 | Technical Accuracy | 15 | 10.0 | 10.0 | 4 core-lesson defects (xPSR, clock tree, SysTick, TIM2, disasm); rest verified accurate |
| 5 | Practical Learning | 10 | 8.0 | 8.0 | register-level on 2 families, real toolchain/debug craft; no executable lab |
| 6 | Assessment Quality | 10 | 6.5 | 6.5 | 498 items, no wrong answers, 60 % pass; no explanations, no summative, duplication |
| 7 | Question Quality | 5 | 3.5 | 3.5 | no wrong answers; 45 flippant distractors; 1 imprecise stem |
| 8 | LO Alignment | 5 | 3.5 | 3.5 | implicit alignment near-perfect; W16–W20 skills never assessed |
| 9 | Difficulty Progression | 5 | 3.5 | 3.5 | content ramps W1→W15 well; assessment flat recall throughout |
| 10 | Industry Relevance | 5 | 4.0 | 4.0 | MISRA/static-analysis/HIL/CI/WCET current; no security/CAN/OTA |
| 11 | Project Quality | 5 | 2.0 | 2.0 | no in-content brief/rubric; generic envelope; latent gate issues |
| 12 | Feedback/Learning Support | 5 | 2.5 | 2.5 | content traps excellent; 0/498 questions carry explanations |
| | **Total** | **100** | | **70.5** | |

### Module scorecard (0–100)

| Wk | Module | Score | Wk | Module | Score |
|---|---|---|---|---|---|
| 1 | Introduction to Embedded Systems | 92 | 11 | UART Communication | 92 |
| 2 | Embedded Hardware | 84 | 12 | SPI Communication | 90 |
| 3 | Embedded Software | 86 | 13 | I2C Communication | 90 |
| 4 | Microprocessors | 82 | 14 | ADC and DAC | 91 |
| 5 | Microcontrollers | 82 | 15 | RTOS Basics | 93 |
| 6 | AVR Basics | 90 | 16 | Embedded Project Design | 88 |
| 7 | ARM Basics | 78 | 17 | Development | 88 |
| 8 | GPIO Programming | 93 | 18 | Testing | 92 |
| 9 | Timers | 80 | 19 | Documentation | 90 |
| 10 | Interrupts | 94 | 20 | Final Submission | 80 |

**Confidence:** HIGH for DB/file-verified facts (inventory, technical defects, question audit, reachability). MEDIUM for reconstructed journey (no usage data) and live-deployment parity.

**Why not 82?** The prior 82 used a 7-criterion rubric weighted toward Practical (20 %) and Lesson Quality (15 %); this audit uses the mandated 12-dimension rubric that gives Learning Objectives and Feedback real weight and re-confirms the technical defects. The course content is not worse than before — the rubric is stricter, and the dead final exam + zero feedback are structural caps the prior rubric did not penalise.

---

## 24. Issue Register (P0 / P1 / P2 / P3)

| ID | Sev | Location | Finding | Evidence | Impact | Recommendation |
|---|---|---|---|---|---|---|
| EM-01 | **P1** | `embedded.ts:321`; topic 1614 (W7.T0) | xPSR described as containing PRIMASK | Prose: "xPSR — … interrupt mask (PRIMASK)…". ARMv7-M reference: PRIMASK is a separate special register | Students carry a false register model into Cortex-M debugging; Qs about PRIMASK in the same topic are correct, so the error is isolated but in the flagship ARM lesson | Reword to "xPSR = APSR+IPSR+EPSR; PRIMASK is a separate special register" |
| EM-02 | **P1** | `embedded.ts:102`; topic 1595 (W2.T1) | Clock tree "APB1 (÷2=64MHz)" | STM32F4 datasheet: APB1 max 42 MHz | A student replicating this config gets invalid peripheral clocks; mis-teaches the F4 clock tree | Correct to 168 MHz SYSCLK → APB1 ÷4 = 42 MHz; note 128 MHz is non-classic |
| EM-03 | **P1** | `FinalExamQuestion` 598–615; no route/UI | 18 Embedded final-exam questions are dead content; no summative assessment reachable; certificate does not require an exam | Zero refs to `finalExam` in `backend/src` and `frontend/src` | Students earn certificates with no summative evidence; a whole bank is wasted | Serve the final exam (post-course, gate or weight certificate) or remove the dead table |
| EM-04 | **P2** | `embedded.ts:244`; topic 1608 (W5.T2) | `SysTick->CTRL = (1<<2)\|(1<<1)` omits ENABLE | CTRL bit0 = ENABLE; W9.T3 teaches `SysTick_Config` correctly (internal inconsistency) | The teaching example never starts the timer — code doesn't work as claimed | Add `\|(1<<0)` (or use `SysTick_Config`) |
| EM-05 | **P2** | `embedded.ts:411`; topic 1622 (W9.T0) | TIM2 1 ms example assumes 16 MHz timer clock | Default F4 timer clock = 84 MHz (APB1 42 MHz ×2) → PSC=15/ARR=999 ≈ 190 µs | Wrong period taught; students get unexpected interrupt rates | State the assumed timer clock explicitly or use the real 84 MHz values |
| EM-06 | **P2** | `embedded.ts:187`; topic 1602 (W4.T0) | Disassembly of `sum(int n)` never initialises `r1` (loop var) — presented as real objdump output | Function body + disasm in same chunk | Mis-teaches what compilers emit for a loop | Fix the C/disassembly pair so `r1` is initialised, or label as illustrative |
| EM-07 | **P2** | `quizService.ts:4` (platform) | Week quiz returns 24 Qs (8 chapter + 16 topic) duplicating topic quizzes | `getQuizQuestions` returns all `moduleId` matches incl. topic questions | 320 topic questions presented twice; inflated quiz length; retake pattern-learning | Filter `topicId IS NULL` for week quizzes (or explicitly design the 24-Q mix) |
| EM-08 | **P2** | all content | No explicit learning objectives at course/module/topic level | 80 topics scanned; zero objectives | Students/assessors can't map outcomes; Bloom progression impossible | Add 1–3 measurable objectives per module |
| EM-09 | **P2** | W16, W20; `routes/project.ts` | No in-content capstone/assignment brief or rubric; envelope accepts arbitrary metadata | `Project` model is a course-less showcase entity; no briefs in content | No curriculum-defined practical work; project credit is meaningless | Write per-course project briefs + rubrics; bind them in the submission UI |
| EM-10 | **P2** | whole course | No embedded security content (secure boot, crypto, MPU/TrustZone, signed firmware) | Topic inventory scan | 2026 embedded roles expect security literacy | Add a security module (W15/W16) or weave into each peripheral week |
| EM-11 | **P2** | `schema.prisma:137-151`; `ExamResultsModal.tsx` (platform) | 0/498 course questions carry an explanation; results modal shows right/wrong only | `QuizQuestion` has no `explanation` field; `PracticeQuestion` does | Score-without-learning; the "traps" quality of the content is undone at the moment of assessment | Add `explanation` to `QuizQuestion` + content + results modal |
| EM-12 | **P2** | `quizService.ts:336-338` (platform) | Topic-quiz "randomization" is a no-op (`shuffle` + `slice(0,5)` on 4-Q banks); options never shuffled; week quizzes fixed order | Code read | No actual randomisation; retakes memorise positions | Draw from a real bank or serve all 4 and shuffle options |
| EM-13 | **P3** | `embedded.ts:141`; topic 1598 (W3.T0) | Unannotated `0x40021000` register pointer | F1 = RCC base; F4 = GPIOE base; course teaches both | Cross-family confusion in an otherwise canonical `volatile` example | Annotate the address or use a named CMSIS/AVR register |
| EM-14 | **P3** | `embedded.ts:276`; topic 1612 (W6.T0) | "The GIMPEL of AVR" | Typo | Readability nit | Fix to "gist" |
| EM-15 | **P3** | 45 quiz Qs (e.g. 12714, 12827, 13026, 13170) | Flippant/comedic distractors ("toasts the pin", "the sales slides") | Options field in DB | Undercuts discrimination and professional tone | Replace joke distractors with plausible near-misses |
| EM-16 | **P3** | Final exam Q 599 | "register pair" stem for boot SP + reset vector | Vector-table entries are memory locations, not registers | Confusing wording on an otherwise correct item | Rephrase stem ("Which memory locations…") |
| EM-17 | **P3** | W3–W9 code blocks | Skeleton/abridged APIs not labelled as non-compiling | Code blocks omit headers/init | Students may copy-paste and get compile errors | Add "abridged snippet" banner where appropriate |
| EM-18 | **P3** | whole course | No recommended starter board/kit/BOM | Topic scan | Learners don't know what hardware to buy to follow the course | Add a "hardware you need" page (e.g., STM32F4-Discovery + Uno) |
| EM-19 | **P3** | course metadata | No prerequisites stated | No prereq field/note | Wrong-audience enrolment; early drop-off | Add explicit prerequisites (C, basic electronics) |
| EM-20 | **P2** | `quizService.ts:83-112` (platform) | Non-atomic XP-award guard in `submitQuiz`; concurrent first-pass submits can double-award | `findFirst` then `update`; daily-challenge path already uses atomic `updateMany` | XP economy integrity | Adopt the atomic guard pattern from `practiceService.ts` |
| EM-21 | **P2** | `routes/project.ts:48-56`; `routes/assignment.ts:49-56` (platform) | Hardcoded 20-module project gate and `week*5` assignment mapping | Code read | Latent: breaks any ≠20-module course; works for Embedded today | Use the dynamic module-count helper |
| EM-22 | **P3** | `routes/assignment.ts:79,88` (platform) | Assignment uploads are `mock_` file names, no real storage | Code read | Submissions aren't artifacts | Implement real upload or remove the mock |
| EM-23 | **P3** | `quizService.ts:101-103` (platform) | Gamification front-loaded: week-1 badge only | Code read | Flat motivation after W1 | Add late-course badges/milestones |

**Totals: P0 = 0 · P1 = 3 · P2 = 11 · P3 = 9 · Total = 23** (EM-20..EM-23 are platform-wide issues affecting Embedded students; the course-local set is EM-01..EM-19 = 19 issues).

---

## 25. Recommended Improvement Opportunities

**Quick wins (low effort, high impact):**
1. **EM-01, EM-02, EM-04, EM-05, EM-06** — five targeted prose/code corrections in flagship lessons (Section 8). These are the highest-leverage fixes in the course.
2. **EM-11** — add an `explanation` field to `QuizQuestion` and populate it for the 160 chapter questions first; the `PracticeQuestion` pattern already exists.
3. **EM-07** — one-line filter (`topicId IS NULL`) so week quizzes stop double-serving topic questions.
4. **EM-15** — replace the 45 joke distractors with plausible near-misses (mechanical, one pass).
5. **EM-14, EM-13, EM-16, EM-17, EM-19** — typo, address annotation, stem rephrase, snippet banners, prerequisites.

**Structural (needs a wave):**
6. **EM-03** — decide the final exam's fate: route it as a post-course summative (certificate-weighted) or delete the dead table. This is the biggest assessment gap.
7. **EM-08** — author module-level learning objectives (they can be derived from the existing "mental model" and "the rule" sentences).
8. **EM-09** — write an Embedded capstone brief + rubric (W16/W20 already teach the process; bind it to the submission envelope).
9. **EM-10** — add a security week (secure boot, MPU/TrustZone, signed updates, safe-RTOS). The course is otherwise industry-complete; this is the one glaring 2026 gap.
10. **EM-12** — fix the no-op randomisation and shuffle options.

---

## 26. Unknowns / Missing Evidence

- **[UNKNOWN — NOT VERIFIED]** Live-deployment parity: local DB/files are audited; GitHub `main` may differ (see deployment caveat). The six technical defects should be re-checked on the live tree before applying fixes.
- **[UNKNOWN — NOT VERIFIED]** Real student outcomes: zero usage rows in the local snapshot; the journey reconstruction (Section 20) is from code, not observation.
- **[UNKNOWN — NOT VERIFIED]** The 45 flippant-distractor count is confirmed for the local DB; if the live tree was reseeded, the set may differ (it is seeded by `reseed_embedded_full.ts`, so parity is likely).
- **[INFERRED]** "Classic F4 = 168 MHz" is the widely-deployed default; some F4 parts/boot configs do run 128 MHz — the APB1-64 MHz violation stands regardless.
- **[INFERRED]** Impact of the 5-minute/24-question timer is judged from code; no timing study exists.

---

## 27. Final Verdict

**Embedded Systems & Real-Time OS is the strongest course in the catalogue by content craft and professional currency — and it is held back by six re-verified technical defects in its flagship lessons, an unreachable summative exam, zero assessment feedback, and the absence of any explicit learning objectives or curriculum-defined practical work.**

- **Independent score: 70.5 / 100 (HIGH confidence)** — down 11.5 from the prior audit's 82 under a stricter, mandated rubric; the delta is rubric-driven and defect-driven, not a content regression.
- **No P0 issues** — the course is fully usable and largely accurate.
- **3 P1 issues:** xPSR/PRIMASK error, APB1-64 MHz clock tree, dead final exam.
- **Verdict: KEEP with targeted FIX and ADD.** The prose deserves preservation; the six technical corrections and the structural assessment gaps (final exam, feedback, objectives, security, capstone) are the difference between 70 and a genuinely 90-scoring course.

---

## Improvement Candidates — NOT YET APPROVED

*Audit-only. Nothing below was implemented; all items are proposals pending the post-audit approval phase.*

| Item | Action | Target | Effort |
|---|---|---|---|
| Cortex-M xPSR/PRIMASK prose (EM-01) | **FIX** | `embedded.ts:321`, topic 1614 | Trivial |
| STM32F4 clock tree (EM-02) | **FIX** | `embedded.ts:102`, topic 1595 | Trivial |
| SysTick ENABLE bit (EM-04) | **FIX** | `embedded.ts:244`, topic 1608 | Trivial |
| TIM2 1 ms example (EM-05) | **FIX** | `embedded.ts:411`, topic 1622 | Trivial |
| Fabricated disassembly (EM-06) | **FIX** | `embedded.ts:187`, topic 1602 | Small |
| "GIMPEL" typo (EM-14) | **FIX** | `embedded.ts:276`, topic 1612 | Trivial |
| Magic address annotation (EM-13) | **FIX** | `embedded.ts:141`, topic 1598 | Trivial |
| Final exam route or removal (EM-03) | **ADD / REMOVE** | platform + reseed | Medium |
| Quiz feedback explanations (EM-11) | **ADD** | schema + 160 chapter Qs + modal | Large |
| Week-quiz de-duplication (EM-07) | **FIX** | `quizService.ts` | Trivial |
| Module-level objectives (EM-08) | **ADD** | 20 modules | Medium |
| Embedded capstone brief + rubric (EM-09) | **ADD** | W16/W20 + project route | Medium |
| Embedded security module (EM-10) | **ADD** | new topics (W15/W16) | Large |
| Topic-quiz randomisation (EM-12) | **FIX** | `quizService.ts:336` | Small |
| Replace 45 joke distractors (EM-15) | **REWRITE** | 45 questions | Small |
| Prerequisites + starter-kit note (EM-19, EM-18) | **ADD** | metadata + docs | Small |
| Project/assignment gates dynamic (EM-21) | **FIX** | `routes/project.ts`, `routes/assignment.ts` | Small |
| Atomic XP guard (EM-20) | **FIX** | `quizService.ts:83-112` | Small |
| Real assignment uploads (EM-22) | **ADD** | backend | Medium |
| Later-week badges (EM-23) | **ADD** | `quizService.ts` | Small |

**Unanimous recommendation:** apply the six technical FIX items and the week-quiz filter immediately; run the structural ADD items (final exam, feedback, objectives, security, capstone) as a named wave. No content needs a full REWRITE or REMOVE except the dead final exam.
