# CADD & BIM Foundation — Capstone Project Brief

**Project name:** *My Neighbourhood Health Clinic*
**Scope:** One small community clinic building, taken from real survey field notes to a coordinated, printed sheet set.
**Tools:** AutoCAD, SketchUp, 3ds Max (V-Ray), Revit (Architecture + Structure).
**Audience:** Final assessment for learners of the CADD & BIM Foundation course (CADDED_Civil).
**Pass line:** 60 / 100. A grade below 60 means the package is reworked and resubmitted.

---

## Why this project

The course teaches four tools that do different jobs on the same building. This capstone forces the learner to use them *in order*, the way a real design office moves a project:

```
survey notes → AutoCAD site plan → 3ds Max/SketchUp massing → chosen mass
           → Revit architecture model → structural rebar → coordinated sheets
```

That chain — from a measured survey to a coordinated BIM sheet set — is the actual
deliverable of the course. Everything before week 20 is building the skills to run it.

---

## Deliverables (four stages)

### Stage 1 — Survey → Site Plan (AutoCAD)
You are given a field survey sheet for the site: boundary dimensions, a 3 m
setback line, two existing trees to preserve, a front drainage channel, and spot
elevations at the four corners (the ground slopes ~600 mm across the lot).

Produce a **site plan DWG**:
- Property boundary, building footprint, setback line, parking bays and the
  existing trees (on their own layers).
- Spot elevations and a simple contour line where the site falls.
- Title block with plot scale 1:200, north arrow and a drawing list.

**Checkpoint:** layer naming, text height, correct 1:200 scale on the sheet.

### Stage 2 — Massing study (SketchUp + 3ds Max)
Develop **2–3 massing options** for the clinic form (e.g. L-shape, courtyard,
single bar) in SketchUp. Take the option you prefer into 3ds Max, model the
envelope, and produce **one V-Ray daylight exterior render** at eye level.

**Checkpoint:** each mass is a clean, editable volume; the render shows clear
sun/sky lighting, not flat or black.

### Stage 3 — Architecture model + schedules (Revit Architecture)
Model the chosen mass in Revit: levels, wall types, floors, roof, doors/windows
and one curtain wall. Produce:
- A **door schedule** and a **room schedule** (area + finish) driven from the model.
- One rendered interior or exterior view.
- A 3D view of the model with a correct project-north orientation.

**Checkpoint:** schedules are generated from the model (not typed), and the room
schedule numbers match the plan.

### Stage 4 — Structure, sheets and coordination (Revit Structure + Architecture)
- Add a footing and beam to the clinic, place **rebar with correct cover**, and
  produce one **rebar schedule**.
- Build a **sheet set**: site plan, ground-floor plan, section, and the door/window
  + rebar schedules — each in a viewport at the correct scale on sheets with a title block.
- Run an **interference/clash check** between structure and architecture and
  resolve at least one clash, noting what you changed.

**Checkpoint:** viewports print at the stated scale; the sheets are numbered and
named like a real package; the resolved clash is documented.

---

## Rubric

| Criterion | Exceeds (18–20) | Meets (14–17) | Partial (8–13) | Missing (0–7) |
|---|---|---|---|---|
| **Site plan (AutoCAD)** | Survey data correct; all layers, 1:200 title block, north arrow, elevations drawn to standard | Footprint + setback + elevations correct; minor layering issues | Footprint present; setbacks/elevations incomplete | No correct site plan produced |
| **Massing + render (SketchUp/3ds Max)** | 3 clear options + V-Ray daylight render with believable sun/sky | 2 options + render present | 1 option or a flat/unlit render | No massing or no render |
| **Revit architecture model + schedules** | Model complete; door + room schedules generated from model and consistent | Model + one schedule; other schedule missing/partial | Model only; schedules typed not generated | No model |
| **Structure + sheets + coordination** | Rebar placed with cover + rebar schedule; full sheet set at correct scales; clash found and resolved | Rebar + schedule; sheet set mostly correct | Rebar or sheets present but incomplete; no clash check | No structural or sheet deliverable |
| **Presentation & documentation** | Package has a short write-up: chosen mass rationale, one clash resolved, one lesson learned | Write-up present but thin | Only a file dump | No write-up |

**Total = 20 + 20 + 20 + 20 + 20 = 100.** Pass ≥ 60.

---

## Submission format

A folder named `clinic-capstone-<name>` containing:
- `site-plan.dwg` (+ a plotted `site-plan.pdf`)
- `massing.skp` / `massing-options.max` and `render.png`
- `clinic.rvt` (architecture + structural in one model or two linked files)
- `sheets.pdf` (the plotted sheet set)
- `notes.md` (the short write-up from the rubric's last row)

The `.rvt` file is the key artefact: the sheet set, schedules and rebar must all
be *in* the model, not pasted pictures.
