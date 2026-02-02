-- CreateEnum
CREATE TYPE "CoverType" AS ENUM ('POLYPRO_PIQUE', 'POLYPRO', 'CARTONNE');

-- CreateEnum
CREATE TYPE "Format" AS ENUM ('F17x22', 'F21x29_7', 'F24x32');

-- CreateEnum
CREATE TYPE "Ruling" AS ENUM ('SEYES', 'LIGNE', 'QUADRI', 'BLANC');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "grammageGsm" INTEGER NOT NULL,
    "coverType" "CoverType" NOT NULL,
    "format" "Format" NOT NULL,
    "ruling" "Ruling",
    "pages" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
