-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SITE_MANAGER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Marche" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "maitreOuvrage" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "numeroOperation" TEXT,
    "wilaya" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'marché',
    "numeroMarche" TEXT,
    "dateMarche" DATETIME,
    "objet" TEXT,
    "visaCF" TEXT,
    "dateVisaCF" DATETIME,
    "valeurHT" REAL,
    "tva" REAL NOT NULL DEFAULT 19,
    "retenueGarantie" BOOLEAN NOT NULL DEFAULT true,
    "cautionBonneEx" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Lot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "budget" REAL,
    "marcheId" INTEGER NOT NULL,
    CONSTRAINT "Lot_marcheId_fkey" FOREIGN KEY ("marcheId") REFERENCES "Marche" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "prixUnit" REAL,
    "quantite" REAL,
    "lotId" INTEGER NOT NULL,
    CONSTRAINT "Article_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formule" TEXT,
    "resultat" REAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    CONSTRAINT "Attachment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Article_code_key" ON "Article"("code");
