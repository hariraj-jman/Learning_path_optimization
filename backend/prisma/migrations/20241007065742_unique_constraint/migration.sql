/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `assignments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,learningPathId]` on the table `assignments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "assignments_userId_courseId_key" ON "assignments"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "assignments_userId_learningPathId_key" ON "assignments"("userId", "learningPathId");
