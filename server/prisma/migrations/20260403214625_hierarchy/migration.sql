/*
  Warnings:

  - You are about to drop the column `lotId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `budget` on the `Lot` table. All the data in the column will be lost.
  - Added the required column `sectionId` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lotId" INTEGER NOT NULL,
    CONSTRAINT "Section_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "prixUnit" REAL,
    "quantite" REAL,
    "sectionId" INTEGER NOT NULL,
    CONSTRAINT "Article_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("code", "id", "libelle", "prixUnit", "quantite", "unite") SELECT "code", "id", "libelle", "prixUnit", "quantite", "unite" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE TABLE "new_Lot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "marcheId" INTEGER NOT NULL,
    CONSTRAINT "Lot_marcheId_fkey" FOREIGN KEY ("marcheId") REFERENCES "Marche" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Lot" ("id", "marcheId", "name") SELECT "id", "marcheId", "name" FROM "Lot";
DROP TABLE "Lot";
ALTER TABLE "new_Lot" RENAME TO "Lot";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
