/*
  Warnings:

  - You are about to drop the column `line` on the `Word` table. All the data in the column will be lost.
  - Added the required column `bbox` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lang` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lang_accuracy` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lang_votes` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `line_index` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text_accuracy` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text_votes` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accuracy` to the `Line` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bbox` to the `Line` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Word" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "line_index" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "bbox" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "text_votes" REAL NOT NULL,
    "text_accuracy" REAL NOT NULL,
    "lang" TEXT NOT NULL,
    "lang_votes" REAL NOT NULL,
    "lang_accuracy" REAL NOT NULL,
    CONSTRAINT "Word_page_section_line_index_fkey" FOREIGN KEY ("page", "section", "line_index") REFERENCES "Line" ("page", "section", "index") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Word" ("id", "index", "page", "section") SELECT "id", "index", "page", "section" FROM "Word";
DROP TABLE "Word";
ALTER TABLE "new_Word" RENAME TO "Word";
CREATE UNIQUE INDEX "Word_page_section_line_index_index_key" ON "Word"("page", "section", "line_index", "index");
CREATE TABLE "new_Line" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "bbox" TEXT NOT NULL,
    "accuracy" REAL NOT NULL
);
INSERT INTO "new_Line" ("id", "index", "page", "section") SELECT "id", "index", "page", "section" FROM "Line";
DROP TABLE "Line";
ALTER TABLE "new_Line" RENAME TO "Line";
CREATE UNIQUE INDEX "Line_page_section_index_key" ON "Line"("page", "section", "index");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
