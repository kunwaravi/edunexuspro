-- TASK 6 — Course banner + Coming Soon support.
-- ADDITIVE ONLY: adds one column to Course. banner/thumbnail already exist
-- (20260816120000_add_course_catalog). No data loss, no destructive changes.
ALTER TABLE "Course" ADD COLUMN "comingSoon" BOOLEAN NOT NULL DEFAULT false;
