/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `learning_paths` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "courses_title_key" ON "courses"("title");

-- CreateIndex
CREATE UNIQUE INDEX "learning_paths_title_key" ON "learning_paths"("title");
