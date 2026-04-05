/*
  Warnings:

  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DeliveryNote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Marche` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `libelle` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `prixUnit` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `quantite` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `marcheId` on the `Lot` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Lot` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `categorie_id` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designation` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chemin_fichier` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_id` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_type` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mime_type` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom_fichier` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taille` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero_lot` to the `Lot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prix_vente_ht` to the `Lot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prix_vente_ttc` to the `Lot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `Lot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statut` to the `Lot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_bien` to the `Lot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prenom` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Attachment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DeliveryNote";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Marche";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Section";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Staff";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "rc" TEXT,
    "nif" TEXT,
    "nis" TEXT,
    "art" TEXT,
    "adresse" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "logo_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type_projet" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "date_debut" DATETIME NOT NULL,
    "date_fin_prevue" DATETIME NOT NULL,
    "date_fin_reelle" DATETIME,
    "budget_total" REAL NOT NULL,
    "adresse" TEXT,
    "wilaya" TEXT,
    "commune" TEXT,
    "description" TEXT,
    "created_by" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Project_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chantier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "date_debut" DATETIME NOT NULL,
    "date_fin_prevue" DATETIME NOT NULL,
    "budget_alloue" REAL NOT NULL,
    "responsable_id" INTEGER,
    "adresse" TEXT,
    "superficie" REAL,
    "description" TEXT,
    CONSTRAINT "Chantier_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chantier_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fournisseur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "raison_sociale" TEXT NOT NULL,
    "rc" TEXT,
    "nif" TEXT,
    "adresse" TEXT,
    "wilaya" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "rib" TEXT,
    "banque" TEXT,
    "solde_courant" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Fournisseur_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "type_client" TEXT NOT NULL,
    "nom_complet" TEXT NOT NULL,
    "cin_ou_rc" TEXT,
    "adresse" TEXT,
    "wilaya" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Client_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BonCommande" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "chantier_id" INTEGER NOT NULL,
    "fournisseur_id" INTEGER NOT NULL,
    "numero_bc" TEXT NOT NULL,
    "date_bc" DATETIME NOT NULL,
    "date_livraison_prevue" DATETIME,
    "statut" TEXT NOT NULL,
    "montant_ht" REAL NOT NULL DEFAULT 0,
    "tva_taux" REAL NOT NULL DEFAULT 19,
    "montant_ttc" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_by" INTEGER NOT NULL,
    CONSTRAINT "BonCommande_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BonCommande_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BonCommande_fournisseur_id_fkey" FOREIGN KEY ("fournisseur_id") REFERENCES "Fournisseur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LigneBC" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bon_commande_id" INTEGER NOT NULL,
    "article_id" INTEGER NOT NULL,
    "designation" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "quantite_commandee" REAL NOT NULL,
    "quantite_recue" REAL NOT NULL DEFAULT 0,
    "prix_unitaire_ht" REAL NOT NULL,
    "montant_ht" REAL NOT NULL,
    CONSTRAINT "LigneBC_bon_commande_id_fkey" FOREIGN KEY ("bon_commande_id") REFERENCES "BonCommande" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LigneBC_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BonLivraison" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bon_commande_id" INTEGER NOT NULL,
    "chantier_id" INTEGER NOT NULL,
    "numero_bl" TEXT NOT NULL,
    "date_reception" DATETIME NOT NULL,
    "statut" TEXT NOT NULL,
    "notes" TEXT,
    "created_by" INTEGER NOT NULL,
    CONSTRAINT "BonLivraison_bon_commande_id_fkey" FOREIGN KEY ("bon_commande_id") REFERENCES "BonCommande" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BonLivraison_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LigneBL" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bon_livraison_id" INTEGER NOT NULL,
    "ligne_bc_id" INTEGER NOT NULL,
    "quantite_livree" REAL NOT NULL,
    "notes" TEXT,
    CONSTRAINT "LigneBL_bon_livraison_id_fkey" FOREIGN KEY ("bon_livraison_id") REFERENCES "BonLivraison" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LigneBL_ligne_bc_id_fkey" FOREIGN KEY ("ligne_bc_id") REFERENCES "LigneBC" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FactureFournisseur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "fournisseur_id" INTEGER NOT NULL,
    "bon_commande_id" INTEGER,
    "numero_facture" TEXT NOT NULL,
    "date_facture" DATETIME NOT NULL,
    "date_echeance" DATETIME,
    "montant_ht" REAL NOT NULL,
    "tva_taux" REAL NOT NULL DEFAULT 19,
    "montant_tva" REAL NOT NULL,
    "montant_ttc" REAL NOT NULL,
    "statut_paiement" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "FactureFournisseur_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FactureFournisseur_fournisseur_id_fkey" FOREIGN KEY ("fournisseur_id") REFERENCES "Fournisseur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FactureFournisseur_bon_commande_id_fkey" FOREIGN KEY ("bon_commande_id") REFERENCES "BonCommande" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PaiementFournisseur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facture_fournisseur_id" INTEGER NOT NULL,
    "date_paiement" DATETIME NOT NULL,
    "montant" REAL NOT NULL,
    "mode_paiement" TEXT NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    CONSTRAINT "PaiementFournisseur_facture_fournisseur_id_fkey" FOREIGN KEY ("facture_fournisseur_id") REFERENCES "FactureFournisseur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CategorieArticle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "parent_id" INTEGER,
    CONSTRAINT "CategorieArticle_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MouvementStock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "article_id" INTEGER NOT NULL,
    "chantier_id" INTEGER,
    "type_mouvement" TEXT NOT NULL,
    "quantite" REAL NOT NULL,
    "prix_unitaire" REAL NOT NULL,
    "valeur_totale" REAL NOT NULL,
    "reference_document" TEXT,
    "date_mouvement" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "MouvementStock_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MouvementStock_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MouvementStock_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inventaire" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "date_inventaire" DATETIME NOT NULL,
    "statut" TEXT NOT NULL,
    "notes" TEXT,
    "created_by" INTEGER NOT NULL,
    CONSTRAINT "Inventaire_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LigneInventaire" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inventaire_id" INTEGER NOT NULL,
    "article_id" INTEGER NOT NULL,
    "stock_theorique" REAL NOT NULL,
    "stock_physique" REAL NOT NULL,
    "ecart" REAL NOT NULL DEFAULT 0,
    "valeur_ecart" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "LigneInventaire_inventaire_id_fkey" FOREIGN KEY ("inventaire_id") REFERENCES "Inventaire" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LigneInventaire_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Employe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "matricule" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "date_naissance" DATETIME,
    "nin" TEXT,
    "cnas_numero" TEXT,
    "qualification" TEXT NOT NULL,
    "poste" TEXT,
    "type_contrat" TEXT NOT NULL,
    "date_embauche" DATETIME NOT NULL,
    "date_fin_contrat" DATETIME,
    "salaire_base" REAL NOT NULL,
    "prime_chantier" REAL NOT NULL DEFAULT 0,
    "indemnite_transport" REAL NOT NULL DEFAULT 0,
    "telephone" TEXT,
    "adresse" TEXT,
    "rib" TEXT,
    "banque" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Employe_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AffectationChantier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employe_id" INTEGER NOT NULL,
    "chantier_id" INTEGER NOT NULL,
    "date_debut" DATETIME NOT NULL,
    "date_fin" DATETIME,
    "poste_sur_chantier" TEXT,
    "notes" TEXT,
    CONSTRAINT "AffectationChantier_employe_id_fkey" FOREIGN KEY ("employe_id") REFERENCES "Employe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AffectationChantier_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pointage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "employe_id" INTEGER NOT NULL,
    "chantier_id" INTEGER NOT NULL,
    "date_pointage" DATETIME NOT NULL,
    "heure_entree" TEXT,
    "heure_sortie" TEXT,
    "heures_normales" REAL NOT NULL DEFAULT 8,
    "heures_sup_25" REAL NOT NULL DEFAULT 0,
    "heures_sup_50" REAL NOT NULL DEFAULT 0,
    "heures_sup_100" REAL NOT NULL DEFAULT 0,
    "statut_journee" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "Pointage_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pointage_employe_id_fkey" FOREIGN KEY ("employe_id") REFERENCES "Employe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pointage_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BulletinPaie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "employe_id" INTEGER NOT NULL,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "jours_travailles" REAL NOT NULL,
    "heures_normales" REAL NOT NULL,
    "heures_sup_25" REAL NOT NULL,
    "heures_sup_50" REAL NOT NULL,
    "salaire_brut" REAL NOT NULL,
    "prime_chantier" REAL NOT NULL DEFAULT 0,
    "indemnite_transport" REAL NOT NULL DEFAULT 0,
    "autres_primes" REAL NOT NULL DEFAULT 0,
    "retenues_cnas" REAL NOT NULL DEFAULT 0,
    "retenues_irg" REAL NOT NULL DEFAULT 0,
    "autres_retenues" REAL NOT NULL DEFAULT 0,
    "avances_deduites" REAL NOT NULL DEFAULT 0,
    "salaire_net" REAL NOT NULL,
    "statut" TEXT NOT NULL,
    "date_paiement" DATETIME,
    "notes" TEXT,
    CONSTRAINT "BulletinPaie_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BulletinPaie_employe_id_fkey" FOREIGN KEY ("employe_id") REFERENCES "Employe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AvanceSalaire" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employe_id" INTEGER NOT NULL,
    "date_avance" DATETIME NOT NULL,
    "montant" REAL NOT NULL,
    "motif" TEXT,
    "remboursement_prevu" DATETIME,
    "statut" TEXT NOT NULL,
    CONSTRAINT "AvanceSalaire_employe_id_fkey" FOREIGN KEY ("employe_id") REFERENCES "Employe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Conge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employe_id" INTEGER NOT NULL,
    "type_conge" TEXT NOT NULL,
    "date_debut" DATETIME NOT NULL,
    "date_fin" DATETIME NOT NULL,
    "nombre_jours" REAL NOT NULL,
    "statut" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "Conge_employe_id_fkey" FOREIGN KEY ("employe_id") REFERENCES "Employe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Immobilisation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "marque" TEXT,
    "modele" TEXT,
    "numero_serie" TEXT,
    "date_acquisition" DATETIME NOT NULL,
    "valeur_acquisition" REAL NOT NULL,
    "duree_amortissement_ans" REAL NOT NULL,
    "valeur_residuelle" REAL NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "Immobilisation_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AffectationMateriel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "immobilisation_id" INTEGER NOT NULL,
    "chantier_id" INTEGER NOT NULL,
    "date_affectation" DATETIME NOT NULL,
    "date_retour" DATETIME,
    "cout_location_journalier" REAL NOT NULL DEFAULT 0,
    "heures_utilisation" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    CONSTRAINT "AffectationMateriel_immobilisation_id_fkey" FOREIGN KEY ("immobilisation_id") REFERENCES "Immobilisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AffectationMateriel_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "immobilisation_id" INTEGER NOT NULL,
    "type_maintenance" TEXT NOT NULL,
    "date_maintenance" DATETIME NOT NULL,
    "cout" REAL NOT NULL,
    "prestataire" TEXT,
    "prochain_entretien_km" REAL,
    "prochain_entretien_date" DATETIME,
    "description" TEXT,
    CONSTRAINT "Maintenance_immobilisation_id_fkey" FOREIGN KEY ("immobilisation_id") REFERENCES "Immobilisation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContratVente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,
    "lot_id" INTEGER NOT NULL,
    "numero_contrat" TEXT NOT NULL,
    "date_contrat" DATETIME NOT NULL,
    "prix_total_ttc" REAL NOT NULL,
    "montant_apport" REAL NOT NULL DEFAULT 0,
    "mode_financement" TEXT NOT NULL,
    "notaire" TEXT,
    "notes" TEXT,
    "statut" TEXT NOT NULL,
    CONSTRAINT "ContratVente_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContratVente_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContratVente_lot_id_fkey" FOREIGN KEY ("lot_id") REFERENCES "Lot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EcheancePaiement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contrat_vente_id" INTEGER NOT NULL,
    "numero_tranche" INTEGER NOT NULL,
    "date_echeance" DATETIME NOT NULL,
    "montant_appel" REAL NOT NULL,
    "montant_encaisse" REAL NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "EcheancePaiement_contrat_vente_id_fkey" FOREIGN KEY ("contrat_vente_id") REFERENCES "ContratVente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Encaissement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "echeance_id" INTEGER NOT NULL,
    "date_encaissement" DATETIME NOT NULL,
    "montant" REAL NOT NULL,
    "mode_paiement" TEXT NOT NULL,
    "reference_paiement" TEXT,
    "notes" TEXT,
    "created_by" INTEGER NOT NULL,
    CONSTRAINT "Encaissement_echeance_id_fkey" FOREIGN KEY ("echeance_id") REFERENCES "EcheancePaiement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DepenseDirecte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "chantier_id" INTEGER NOT NULL,
    "categorie_depense" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "montant_ht" REAL NOT NULL,
    "tva_taux" REAL NOT NULL DEFAULT 19,
    "montant_ttc" REAL NOT NULL,
    "date_depense" DATETIME NOT NULL,
    "justificatif_url" TEXT,
    "statut_paiement" TEXT NOT NULL,
    "created_by" INTEGER NOT NULL,
    CONSTRAINT "DepenseDirecte_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DepenseDirecte_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChargeFixe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "designation" TEXT NOT NULL,
    "montant_mensuel" REAL NOT NULL,
    "date_debut" DATETIME NOT NULL,
    "date_fin" DATETIME,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ChargeFixe_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SousTraitant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "raison_sociale" TEXT NOT NULL,
    "rc" TEXT,
    "nif" TEXT,
    "specialite" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "SousTraitant_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContratSousTraitance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "chantier_id" INTEGER NOT NULL,
    "sous_traitant_id" INTEGER NOT NULL,
    "numero_contrat" TEXT NOT NULL,
    "objet" TEXT NOT NULL,
    "montant_ht" REAL NOT NULL,
    "tva_taux" REAL NOT NULL DEFAULT 19,
    "date_debut" DATETIME NOT NULL,
    "date_fin" DATETIME,
    "statut" TEXT NOT NULL,
    CONSTRAINT "ContratSousTraitance_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContratSousTraitance_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContratSousTraitance_sous_traitant_id_fkey" FOREIGN KEY ("sous_traitant_id") REFERENCES "SousTraitant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SituationTravauxST" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contrat_st_id" INTEGER NOT NULL,
    "numero_situation" INTEGER NOT NULL,
    "date_situation" DATETIME NOT NULL,
    "montant_cumule_ht" REAL NOT NULL,
    "montant_periode_ht" REAL NOT NULL,
    "retenue_garantie_taux" REAL NOT NULL DEFAULT 5,
    "montant_paye" REAL NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL,
    CONSTRAINT "SituationTravauxST_contrat_st_id_fkey" FOREIGN KEY ("contrat_st_id") REFERENCES "ContratSousTraitance" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BudgetChantier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chantier_id" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "date_budget" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL,
    "notes" TEXT,
    "created_by" INTEGER NOT NULL,
    CONSTRAINT "BudgetChantier_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LigneBudget" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "budget_id" INTEGER NOT NULL,
    "categorie" TEXT NOT NULL,
    "sous_categorie" TEXT,
    "description" TEXT NOT NULL,
    "montant_prevu" REAL NOT NULL,
    "montant_realise" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    CONSTRAINT "LigneBudget_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "BudgetChantier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" INTEGER,
    "old_values" TEXT,
    "new_values" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "categorie_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "prix_unitaire_moyen" REAL NOT NULL DEFAULT 0,
    "stock_actuel" REAL NOT NULL DEFAULT 0,
    "stock_minimum" REAL NOT NULL DEFAULT 0,
    "stock_maximum" REAL,
    "description" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Article_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Article_categorie_id_fkey" FOREIGN KEY ("categorie_id") REFERENCES "CategorieArticle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("code", "id", "unite") SELECT "code", "id", "unite" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE TABLE "new_Document" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "nom_fichier" TEXT NOT NULL,
    "chemin_fichier" TEXT NOT NULL,
    "taille" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "description" TEXT,
    "created_by" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Document" ("id") SELECT "id" FROM "Document";
DROP TABLE "Document";
ALTER TABLE "new_Document" RENAME TO "Document";
CREATE TABLE "new_Lot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" INTEGER NOT NULL,
    "numero_lot" TEXT NOT NULL,
    "type_bien" TEXT NOT NULL,
    "superficie_terrain" REAL,
    "superficie_batie" REAL,
    "etage" TEXT,
    "prix_vente_ht" REAL NOT NULL,
    "tva_taux" REAL NOT NULL DEFAULT 0,
    "prix_vente_ttc" REAL NOT NULL,
    "statut" TEXT NOT NULL,
    CONSTRAINT "Lot_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Lot" ("id") SELECT "id" FROM "Lot";
DROP TABLE "Lot";
ALTER TABLE "new_Lot" RENAME TO "Lot";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'READONLY',
    "telephone" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("email", "id", "role") SELECT "email", "id", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Immobilisation_code_key" ON "Immobilisation"("code");
