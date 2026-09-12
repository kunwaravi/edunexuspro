-- AlterTable (additive — Phase 1 Dynamic Course Catalog; no data loss; safe to apply multiple times via migrate deploy re-entry)
ALTER TABLE "Course" ADD COLUMN     "banner" TEXT,
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "certificateAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "courseType" TEXT,
ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "instructor" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "learningOutcomes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "prerequisites" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "shortTitle" TEXT,
ADD COLUMN     "skillsGained" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN     "subcategoryId" INTEGER,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "targetAudience" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "thumbnail" TEXT;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentId" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
