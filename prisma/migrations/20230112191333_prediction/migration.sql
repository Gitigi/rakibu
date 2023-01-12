-- AlterTable
ALTER TABLE "word" ADD COLUMN     "rakibu" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "prediction" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "line_index" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "prediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prediction_page_section_line_index_index_model_key" ON "prediction"("page", "section", "line_index", "index", "model");

-- AddForeignKey
ALTER TABLE "prediction" ADD CONSTRAINT "prediction_page_section_line_index_index_fkey" FOREIGN KEY ("page", "section", "line_index", "index") REFERENCES "word"("page", "section", "line_index", "index") ON DELETE RESTRICT ON UPDATE CASCADE;
