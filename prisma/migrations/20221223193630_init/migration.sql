-- CreateTable
CREATE TABLE "word" (
    "id" SERIAL NOT NULL,
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "line_index" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "bbox" JSONB NOT NULL,
    "text" TEXT NOT NULL,
    "text_votes" DOUBLE PRECISION NOT NULL,
    "text_accuracy" DOUBLE PRECISION NOT NULL,
    "lang" TEXT NOT NULL,
    "lang_votes" DOUBLE PRECISION NOT NULL,
    "lang_accuracy" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "line" (
    "id" SERIAL NOT NULL,
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "bbox" JSONB NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "line_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "word_page_section_line_index_index_key" ON "word"("page", "section", "line_index", "index");

-- CreateIndex
CREATE UNIQUE INDEX "line_page_section_index_key" ON "line"("page", "section", "index");

-- AddForeignKey
ALTER TABLE "word" ADD CONSTRAINT "word_page_section_line_index_fkey" FOREIGN KEY ("page", "section", "line_index") REFERENCES "line"("page", "section", "index") ON DELETE RESTRICT ON UPDATE CASCADE;
