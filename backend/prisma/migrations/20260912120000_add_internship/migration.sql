-- CreateTable
CREATE TABLE "InternshipProgram" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categorySlug" TEXT,
    "duration" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternshipProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternshipApplication" (
    "id" SERIAL NOT NULL,
    "applicationCode" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "qualification" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "portfolioUrl" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminResponse" TEXT,
    "responseEmailStatus" TEXT NOT NULL DEFAULT 'NOT_SENT',
    "respondedAt" TIMESTAMP(3),
    "respondedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternshipApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InternshipProgram_slug_key" ON "InternshipProgram"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "InternshipApplication_applicationCode_key" ON "InternshipApplication"("applicationCode");

-- CreateIndex
CREATE INDEX "InternshipApplication_userId_idx" ON "InternshipApplication"("userId");

-- CreateIndex
CREATE INDEX "InternshipApplication_programId_idx" ON "InternshipApplication"("programId");

-- CreateIndex
CREATE INDEX "InternshipApplication_status_idx" ON "InternshipApplication"("status");

-- AddForeignKey
ALTER TABLE "InternshipApplication" ADD CONSTRAINT "InternshipApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipApplication" ADD CONSTRAINT "InternshipApplication_programId_fkey" FOREIGN KEY ("programId") REFERENCES "InternshipProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

