/**
 * seed_internships.ts — internship program catalog
 *
 * Idempotent seed: upserts the 8 internship programs by slug, so re-running is
 * always safe (never creates a duplicate row).
 *
 * Data-safety rules honoured here:
 *  - Programs are addressed by `slug`; an existing row is updated in place, so
 *    ids and existing applications keep pointing at the same program.
 *  - `isOpen` is only applied on CREATE. If an admin has closed a program, a
 *    re-seed must not silently reopen it.
 *  - `categorySlug` refers to a Course Category slug (seed_catalog.ts owns that
 *    taxonomy). A missing category is reported, not created, and does not abort
 *    the rest of the seed.
 *  - Run with: npx ts-node prisma/seed_internships.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PROGRAMS = [
  {
    slug: 'full-stack-web-development',
    title: 'Full-Stack Web Development Internship',
    description:
      'Work alongside the engineering team on production web applications — responsive interfaces in HTML, CSS and modern JavaScript on the front end, and REST APIs with a relational database on the back end. Interns ship reviewed code through Git, take part in sprint planning, and finish with a deployed project of their own.',
    categorySlug: 'web-development',
    duration: '12 Weeks',
    mode: 'Remote',
  },
  {
    slug: 'software-development',
    title: 'Software Development Internship (C, C++ & Python)',
    description:
      'A programming-focused internship for students who already know the basics of C, C++ or Python and want real problem-solving practice. Interns work through data structures, algorithms, file handling and debugging on assigned tasks, with code reviews that target clean, readable, maintainable code.',
    categorySlug: 'programming',
    duration: '10 Weeks',
    mode: 'Hybrid',
  },
  {
    slug: 'embedded-systems-firmware',
    title: 'Embedded Systems & Firmware Internship',
    description:
      'Hands-on firmware development for microcontroller platforms — GPIO, timers, interrupts, serial protocols (UART, I2C, SPI) and sensor interfacing, programmed in C and tested on real hardware. Interns read datasheets, debug with a logic analyser and document their circuits and code.',
    categorySlug: 'embedded-systems',
    duration: '12 Weeks',
    mode: 'Onsite',
  },
  {
    slug: 'iot-connected-devices',
    title: 'IoT & Connected Devices Internship',
    description:
      'Build end-to-end connected systems: sense with a microcontroller, publish over MQTT, and visualise the data on a live dashboard. Interns cover device-to-broker messaging, lightweight payload design, and the practical reliability issues that appear once a device leaves the bench.',
    categorySlug: 'iot',
    duration: '8 Weeks',
    mode: 'Hybrid',
  },
  {
    slug: 'cad-product-design',
    title: 'CAD & Product Design Internship',
    description:
      'Produce production-ready 2D drawings and 3D models for mechanical and civil workstreams. Interns work from real design briefs through modelling, assembly, dimensioning and drafting standards, and learn to review and revise a drawing set the way an industry project requires.',
    categorySlug: 'cad-design',
    duration: '8 Weeks',
    mode: 'Onsite',
  },
  {
    slug: 'computer-applications-office-automation',
    title: 'Computer Applications & Office Automation Internship',
    description:
      'A practical internship covering the computer skills every workplace assumes — document and report preparation, spreadsheets with formulas and charts, data entry quality control, and presentation design. Suited to interns building a first professional portfolio.',
    categorySlug: 'computer-office',
    duration: '6 Weeks',
    mode: 'Remote',
  },
  {
    slug: 'electronics-circuit-design',
    title: 'Electronics & Circuit Design Internship',
    description:
      'From schematic to working board: component selection, breadboard prototyping, PCB layout fundamentals, soldering and systematic fault-finding with a multimeter and oscilloscope. Interns build, measure and document a complete small circuit as their deliverable.',
    categorySlug: 'electronics',
    duration: '10 Weeks',
    mode: 'Onsite',
  },
  {
    slug: 'iti-trade-skills',
    title: 'ITI Trade Skills Internship',
    description:
      'A trade-oriented internship for ITI students that puts workshop theory to work on supervised jobs — wiring and electrical practice, measurement and tolerance discipline, tool and machine safety, and job cards completed to trade standards.',
    categorySlug: 'iti-trade-training',
    duration: '6 Weeks',
    mode: 'Onsite',
  },
];

async function upsertPrograms() {
  // Category slugs are owned by seed_catalog.ts — read them, never create them.
  const knownCategories = new Set(
    (await prisma.category.findMany({ select: { slug: true } })).map((c) => c.slug)
  );

  for (const program of PROGRAMS) {
    if (!knownCategories.has(program.categorySlug)) {
      console.warn(
        `[program] ${program.slug}: category "${program.categorySlug}" does not exist — ` +
          `seeding anyway, run seed_catalog.ts to create the category taxonomy.`
      );
    }

    const row = await prisma.internshipProgram.upsert({
      where: { slug: program.slug },
      // isOpen intentionally omitted: an admin-closed program must stay closed.
      update: {
        title: program.title,
        description: program.description,
        categorySlug: program.categorySlug,
        duration: program.duration,
        mode: program.mode,
      },
      create: {
        slug: program.slug,
        title: program.title,
        description: program.description,
        categorySlug: program.categorySlug,
        duration: program.duration,
        mode: program.mode,
        isOpen: true,
      },
      select: { id: true, slug: true, isOpen: true },
    });
    console.log(`[program] ${row.slug} -> id=${row.id} isOpen=${row.isOpen}`);
  }
}

async function main() {
  await upsertPrograms();
  const counts = await prisma.$queryRaw`
    SELECT (SELECT count(*)::int FROM "InternshipProgram") AS programs,
           (SELECT count(*)::int FROM "InternshipProgram" WHERE "isOpen") AS open_programs
  `;
  console.log('summary:', JSON.stringify(counts));
}

main()
  .catch((e) => {
    console.error('seed_internships failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
