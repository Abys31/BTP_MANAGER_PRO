-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "email" TEXT,
    "adresse" TEXT,
    "wilaya" TEXT,
    "ville" TEXT,
    "nif" TEXT,
    "rc" TEXT,
    "nis" TEXT,
    "cnas_numero" TEXT,
    "code_activite" TEXT,
    "logo_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "telephone" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "invitation_token" TEXT,
    "invitation_expires" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chantier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "type_chantier" TEXT,
    "chef_id" INTEGER,
    "wilaya" TEXT,
    "adresse" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'EN_COURS',
    "avancement_physique" REAL NOT NULL DEFAULT 0,
    "avancement_eco" REAL NOT NULL DEFAULT 0,
    "budget_prevu" REAL NOT NULL DEFAULT 0,
    "budget_reel" REAL NOT NULL DEFAULT 0,
    "date_debut" DATETIME,
    "date_fin_prevue" DATETIME,
    "date_fin_reelle" DATETIME,
    "marche_id" INTEGER,
    "workflow_etape" TEXT NOT NULL DEFAULT 'PROJET',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Chantier_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chantier_marche_id_fkey" FOREIGN KEY ("marche_id") REFERENCES "Marche" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Marche" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "numero_contrat" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'ACTIF',
    "origine" TEXT NOT NULL DEFAULT 'PUBLIC',
    "maitre_ouvrage_nom" TEXT,
    "maitre_ouvrage_adresse" TEXT,
    "maitre_ouvrage_tel" TEXT,
    "date_contrat" DATETIME,
    "type_contrat" TEXT,
    "montant_ht" REAL NOT NULL DEFAULT 0,
    "tva_taux" REAL NOT NULL DEFAULT 19,
    "montant_ttc" REAL NOT NULL DEFAULT 0,
    "delai_initial_jours" INTEGER,
    "ods_demarrage" DATETIME,
    "fin_contractuelle" DATETIME,
    "retenue_garantie_taux" REAL NOT NULL DEFAULT 0,
    "rabais_taux" REAL NOT NULL DEFAULT 0,
    "prix_revisables" BOOLEAN NOT NULL DEFAULT false,
    "avance_forfaitaire" REAL NOT NULL DEFAULT 0,
    "taux_avance" REAL NOT NULL DEFAULT 0,
    "avance_appro" REAL NOT NULL DEFAULT 0,
    "taux_avance_appro" REAL NOT NULL DEFAULT 0,
    "caution_bonne_exec" BOOLEAN NOT NULL DEFAULT false,
    "mode_plus_values" TEXT NOT NULL DEFAULT 'SOUPLE',
    "visas_reglementaires" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Marche_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LotMarche" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "marche_id" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "description" TEXT,
    "montant_ht" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "LotMarche_marche_id_fkey" FOREIGN KEY ("marche_id") REFERENCES "Marche" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DQEItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "marche_id" INTEGER,
    "chantier_id" INTEGER,
    "code_article" TEXT,
    "designation" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "quantite" REAL NOT NULL DEFAULT 0,
    "prix_unitaire" REAL NOT NULL DEFAULT 0,
    "montant_total" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "DQEItem_marche_id_fkey" FOREIGN KEY ("marche_id") REFERENCES "Marche" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DQEItem_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Avenant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "marche_id" INTEGER NOT NULL,
    "numero" INTEGER NOT NULL,
    "objet" TEXT NOT NULL,
    "montant" REAL NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'EN_COURS',
    "date_avenant" DATETIME,
    CONSTRAINT "Avenant_marche_id_fkey" FOREIGN KEY ("marche_id") REFERENCES "Marche" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SituationTravaux" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chantier_id" INTEGER NOT NULL,
    "numero" INTEGER NOT NULL,
    "periode_mois" INTEGER NOT NULL,
    "periode_annee" INTEGER NOT NULL,
    "montant_periode" REAL NOT NULL DEFAULT 0,
    "montant_cumule" REAL NOT NULL DEFAULT 0,
    "montant_net" REAL NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'SOUMISE',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SituationTravaux_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TachePlanning" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chantier_id" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "date_debut" DATETIME,
    "date_fin" DATETIME,
    "est_jalon" BOOLEAN NOT NULL DEFAULT false,
    "avancement" REAL NOT NULL DEFAULT 0,
    "couleur" TEXT,
    CONSTRAINT "TachePlanning_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JournalChantier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chantier_id" INTEGER NOT NULL,
    "date_entree" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "texte" TEXT NOT NULL,
    "auteur_id" INTEGER,
    "photos" TEXT,
    CONSTRAINT "JournalChantier_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PointageTerrain" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chantier_id" INTEGER NOT NULL,
    "employe_nom" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "statut" TEXT NOT NULL,
    "heures_normales" REAL NOT NULL DEFAULT 8,
    "heures_sup" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "PointageTerrain_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "adresse" TEXT,
    "wilaya" TEXT,
    "ville" TEXT,
    "type" TEXT NOT NULL DEFAULT 'PARTICULIER',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Client_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fournisseur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "contact_nom" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "adresse" TEXT,
    "zone" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Fournisseur_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BonCommande" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "fournisseur_id" INTEGER NOT NULL,
    "chantier_id" INTEGER,
    "statut" TEXT NOT NULL DEFAULT 'BROUILLON',
    "date_commande" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_livraison_prevue" DATETIME,
    "montant_ht" REAL NOT NULL DEFAULT 0,
    "tva_taux" REAL NOT NULL DEFAULT 19,
    "montant_ttc" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BonCommande_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BonCommande_fournisseur_id_fkey" FOREIGN KEY ("fournisseur_id") REFERENCES "Fournisseur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BonCommande_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LigneBC" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bc_id" INTEGER NOT NULL,
    "designation" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "quantite_commandee" REAL NOT NULL,
    "quantite_receptionnee" REAL NOT NULL DEFAULT 0,
    "prix_unitaire" REAL NOT NULL,
    "montant_total" REAL NOT NULL,
    CONSTRAINT "LigneBC_bc_id_fkey" FOREIGN KEY ("bc_id") REFERENCES "BonCommande" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BonLivraison" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bc_id" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "date_reception" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'RECU',
    "notes" TEXT,
    CONSTRAINT "BonLivraison_bc_id_fkey" FOREIGN KEY ("bc_id") REFERENCES "BonCommande" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LigneBL" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bl_id" INTEGER NOT NULL,
    "ligne_bc_id" INTEGER NOT NULL,
    "quantite_livree" REAL NOT NULL,
    "notes" TEXT,
    CONSTRAINT "LigneBL_bl_id_fkey" FOREIGN KEY ("bl_id") REFERENCES "BonLivraison" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LigneBL_ligne_bc_id_fkey" FOREIGN KEY ("ligne_bc_id") REFERENCES "LigneBC" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FactureFournisseur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bc_id" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "montant_ht" REAL NOT NULL,
    "tva_taux" REAL NOT NULL DEFAULT 19,
    "montant_ttc" REAL NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "date_facture" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FactureFournisseur_bc_id_fkey" FOREIGN KEY ("bc_id") REFERENCES "BonCommande" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Devis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "client_id" INTEGER,
    "chantier_id" INTEGER,
    "statut" TEXT NOT NULL DEFAULT 'BROUILLON',
    "montant_ht" REAL NOT NULL DEFAULT 0,
    "tva_taux" REAL NOT NULL DEFAULT 19,
    "montant_ttc" REAL NOT NULL DEFAULT 0,
    "date_devis" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_validite" DATETIME,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Devis_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Devis_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Devis_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LigneDevis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "devis_id" INTEGER NOT NULL,
    "designation" TEXT NOT NULL,
    "unite" TEXT,
    "quantite" REAL NOT NULL DEFAULT 1,
    "prix_unitaire" REAL NOT NULL DEFAULT 0,
    "montant" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "LigneDevis_devis_id_fkey" FOREIGN KEY ("devis_id") REFERENCES "Devis" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "client_id" INTEGER,
    "chantier_id" INTEGER,
    "statut" TEXT NOT NULL DEFAULT 'BROUILLON',
    "montant_ht" REAL NOT NULL DEFAULT 0,
    "tva_taux" REAL NOT NULL DEFAULT 19,
    "montant_ttc" REAL NOT NULL DEFAULT 0,
    "montant_paye" REAL NOT NULL DEFAULT 0,
    "solde_du" REAL NOT NULL DEFAULT 0,
    "date_facture" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_echeance" DATETIME,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Facture_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Facture_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Facture_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LigneFacture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facture_id" INTEGER NOT NULL,
    "designation" TEXT NOT NULL,
    "unite" TEXT,
    "quantite" REAL NOT NULL DEFAULT 1,
    "prix_unitaire" REAL NOT NULL DEFAULT 0,
    "montant" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "LigneFacture_facture_id_fkey" FOREIGN KEY ("facture_id") REFERENCES "Facture" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facture_id" INTEGER NOT NULL,
    "montant" REAL NOT NULL,
    "date_paiement" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mode" TEXT NOT NULL,
    "reference" TEXT,
    CONSTRAINT "Paiement_facture_id_fkey" FOREIGN KEY ("facture_id") REFERENCES "Facture" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Depense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "chantier_id" INTEGER,
    "designation" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "montant" REAL NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "date_depense" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Depense_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Depense_chantier_id_fkey" FOREIGN KEY ("chantier_id") REFERENCES "Chantier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompteTresorerie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "solde" REAL NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CompteTresorerie_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "compte_id" INTEGER NOT NULL,
    "libelle" TEXT NOT NULL,
    "montant" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "reference" TEXT,
    CONSTRAINT "Transaction_compte_id_fkey" FOREIGN KEY ("compte_id") REFERENCES "CompteTresorerie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cheque" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "compte_id" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "beneficiaire" TEXT NOT NULL,
    "montant" REAL NOT NULL,
    "date_echeance" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    CONSTRAINT "Cheque_compte_id_fkey" FOREIGN KEY ("compte_id") REFERENCES "CompteTresorerie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PeriodePaie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "periode" TEXT NOT NULL,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "total_brut" REAL NOT NULL DEFAULT 0,
    "total_cnas" REAL NOT NULL DEFAULT 0,
    "total_irg" REAL NOT NULL DEFAULT 0,
    "total_net" REAL NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'BROUILLON',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PeriodePaie_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BulletinPaie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "periode_id" INTEGER NOT NULL,
    "employe_nom" TEXT NOT NULL,
    "salaire_base" REAL NOT NULL,
    "heures" REAL NOT NULL DEFAULT 0,
    "primes" REAL NOT NULL DEFAULT 0,
    "brut" REAL NOT NULL,
    "cnas" REAL NOT NULL,
    "irg" REAL NOT NULL,
    "net" REAL NOT NULL,
    CONSTRAINT "BulletinPaie_periode_id_fkey" FOREIGN KEY ("periode_id") REFERENCES "PeriodePaie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CautionBancaire" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "beneficiaire" TEXT NOT NULL,
    "montant" REAL NOT NULL,
    "date_emission" DATETIME NOT NULL,
    "date_echeance" DATETIME NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'ACTIVE',
    "banque" TEXT,
    "type_caution" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CautionBancaire_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CalculMetier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "metier" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "cout_total" REAL NOT NULL DEFAULT 0,
    "duree_heures" REAL NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CalculMetier_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LigneCalcul" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "calcul_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "quantite" REAL NOT NULL,
    "prix_unitaire" REAL NOT NULL,
    "montant" REAL NOT NULL,
    CONSTRAINT "LigneCalcul_calcul_id_fkey" FOREIGN KEY ("calcul_id") REFERENCES "CalculMetier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrixMarche" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "code_article" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "prix" REAL NOT NULL,
    "metier" TEXT NOT NULL,
    "wilaya" TEXT NOT NULL DEFAULT 'National',
    "source" TEXT,
    "date_prix" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PrixMarche_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PreferenceNotification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "depenses_en_attente" BOOLEAN NOT NULL DEFAULT true,
    "factures_en_retard" BOOLEAN NOT NULL DEFAULT true,
    "rappels_taches" BOOLEAN NOT NULL DEFAULT true,
    "seuil_avertissement" INTEGER NOT NULL DEFAULT 80,
    "seuil_critique" INTEGER NOT NULL DEFAULT 100,
    "delai_rappel_jours" INTEGER NOT NULL DEFAULT 3,
    CONSTRAINT "PreferenceNotification_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PreferenceNotification_company_id_key" ON "PreferenceNotification"("company_id");
