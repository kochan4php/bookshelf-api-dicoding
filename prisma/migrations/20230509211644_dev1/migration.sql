-- CreateTable
CREATE TABLE "Book" (
    "id" VARCHAR(30) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "year" INTEGER NOT NULL,
    "author" VARCHAR(255) NOT NULL,
    "summary" TEXT NOT NULL,
    "publisher" VARCHAR(255) NOT NULL,
    "page_count" INTEGER NOT NULL,
    "read_page" INTEGER NOT NULL,
    "finished" BOOLEAN NOT NULL,
    "reading" BOOLEAN NOT NULL,
    "inserted_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);
