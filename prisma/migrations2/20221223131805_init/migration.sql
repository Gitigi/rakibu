-- CreateTable
CREATE TABLE "Word" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "line" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    CONSTRAINT "Word_page_section_line_fkey" FOREIGN KEY ("page", "section", "line") REFERENCES "Line" ("page", "section", "index") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Line" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "index" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_page_section_line_index_key" ON "Word"("page", "section", "line", "index");

-- CreateIndex
CREATE UNIQUE INDEX "Line_page_section_index_key" ON "Line"("page", "section", "index");
