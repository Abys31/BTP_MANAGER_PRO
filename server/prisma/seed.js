import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding BTP Manager DZ...')

  // Company
  const company = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: { nom: 'SARL CONSTRUCTIONS DZ', rc: '16/00-1234567B05', nif: '001623456789012', nis: '123456789012345', adresse: '12 Rue de la Paix, Alger Centre', telephone: '+213 21 12 34 56', email: 'contact@constructions-dz.com' }
  })

  // Users
  const hash = await bcrypt.hash('admin123', 10)
  const hashC = await bcrypt.hash('compta123', 10)
  await prisma.user.upsert({ where: { email: 'admin@btp.dz' }, update: {}, create: { company_id: company.id, nom: 'Admin', prenom: 'Super', email: 'admin@btp.dz', password_hash: hash, role: 'SUPER_ADMIN' } })
  await prisma.user.upsert({ where: { email: 'comptable@btp.dz' }, update: {}, create: { company_id: company.id, nom: 'Merzouk', prenom: 'Amina', email: 'comptable@btp.dz', password_hash: hashC, role: 'COMPTABLE' } })
  await prisma.user.upsert({ where: { email: 'admin@constructions-dz.com' }, update: {}, create: { company_id: company.id, nom: 'Admin', prenom: 'Super', email: 'admin@constructions-dz.com', password_hash: hash, role: 'SUPER_ADMIN' } })

  // Projects
  const projets = await Promise.all([
    prisma.project.upsert({ where: { id: 1 }, update: {}, create: { company_id: company.id, code: 'PRJ-2024-001', nom: 'Résidence El Bahia — 100 Logements', type_projet: 'PROMOTION_IMMOBILIERE', statut: 'EN_COURS', date_debut: new Date('2024-01-10'), date_fin_prevue: new Date('2025-12-30'), budget_total: 500000000, wilaya: 'Oran', commune: 'Bir El Djir', created_by: 1 } }),
    prisma.project.upsert({ where: { id: 2 }, update: {}, create: { company_id: company.id, code: 'PRJ-2024-002', nom: 'Lycée 1000 places — Aïn Bénian', type_projet: 'BATIMENT', statut: 'EN_COURS', date_debut: new Date('2024-03-15'), date_fin_prevue: new Date('2025-06-30'), budget_total: 350000000, wilaya: 'Alger', commune: 'Aïn Bénian', created_by: 1 } }),
    prisma.project.upsert({ where: { id: 3 }, update: {}, create: { company_id: company.id, code: 'PRJ-2024-003', nom: 'Route Wilaya RW-14 — Tlemcen', type_projet: 'TRAVAUX_PUBLICS', statut: 'ETUDE', date_debut: new Date('2024-06-01'), date_fin_prevue: new Date('2026-01-31'), budget_total: 280000000, wilaya: 'Tlemcen', commune: 'Mansourah', created_by: 1 } }),
  ])

  // Chantiers
  const chantiers = await Promise.all([
    prisma.chantier.upsert({ where: { id: 1 }, update: {}, create: { project_id: 1, company_id: company.id, code: 'CH-001', nom: 'Gros œuvre — Bloc A', statut: 'EN_COURS', date_debut: new Date('2024-01-15'), date_fin_prevue: new Date('2025-06-30'), budget_alloue: 180000000 } }),
    prisma.chantier.upsert({ where: { id: 2 }, update: {}, create: { project_id: 1, company_id: company.id, code: 'CH-002', nom: 'Second œuvre — Bloc A', statut: 'EN_COURS', date_debut: new Date('2024-07-01'), date_fin_prevue: new Date('2025-12-30'), budget_alloue: 120000000 } }),
    prisma.chantier.upsert({ where: { id: 3 }, update: {}, create: { project_id: 2, company_id: company.id, code: 'CH-003', nom: 'Fondations & Structure', statut: 'EN_COURS', date_debut: new Date('2024-03-20'), date_fin_prevue: new Date('2024-12-31'), budget_alloue: 150000000 } }),
    prisma.chantier.upsert({ where: { id: 4 }, update: {}, create: { project_id: 2, company_id: company.id, code: 'CH-004', nom: 'Corps bâtiment', statut: 'EN_COURS', date_debut: new Date('2024-08-01'), date_fin_prevue: new Date('2025-06-30'), budget_alloue: 120000000 } }),
  ])

  // Catégories articles
  const cats = await Promise.all([
    prisma.categorieArticle.upsert({ where: { id: 1 }, update: {}, create: { company_id: company.id, nom: 'Ciment & Béton' } }),
    prisma.categorieArticle.upsert({ where: { id: 2 }, update: {}, create: { company_id: company.id, nom: 'Granulats & Sable' } }),
    prisma.categorieArticle.upsert({ where: { id: 3 }, update: {}, create: { company_id: company.id, nom: 'Armatures Acier' } }),
    prisma.categorieArticle.upsert({ where: { id: 4 }, update: {}, create: { company_id: company.id, nom: 'Blocs & Briques' } }),
    prisma.categorieArticle.upsert({ where: { id: 5 }, update: {}, create: { company_id: company.id, nom: 'Peinture & Revêtement' } }),
    prisma.categorieArticle.upsert({ where: { id: 6 }, update: {}, create: { company_id: company.id, nom: 'Plomberie' } }),
    prisma.categorieArticle.upsert({ where: { id: 7 }, update: {}, create: { company_id: company.id, nom: 'Électricité' } }),
    prisma.categorieArticle.upsert({ where: { id: 8 }, update: {}, create: { company_id: company.id, nom: 'Carburant' } }),
  ])

  // Articles
  const articles = [
    { code: 'CIM-CPJ-001', designation: 'Ciment CPJ 42.5', unite: 'SAC', prix: 420, stock: 250, smin: 100, cat: 1 },
    { code: 'CIM-CPA-002', designation: 'Ciment CPA 52.5', unite: 'SAC', prix: 580, stock: 80, smin: 100, cat: 1 },
    { code: 'GRA-SAB-001', designation: 'Sable de dune 0/3', unite: 'M3', prix: 2800, stock: 45, smin: 20, cat: 2 },
    { code: 'GRA-GRV-001', designation: 'Gravier concassé 3/8', unite: 'M3', prix: 3200, stock: 38, smin: 15, cat: 2 },
    { code: 'GRA-GRV-002', designation: 'Gravier concassé 8/15', unite: 'M3', prix: 3400, stock: 28, smin: 15, cat: 2 },
    { code: 'ACR-HA-010', designation: 'Fer HA 10mm', unite: 'TONNE', prix: 95000, stock: 12, smin: 5, cat: 3 },
    { code: 'ACR-HA-012', designation: 'Fer HA 12mm', unite: 'TONNE', prix: 94000, stock: 8, smin: 5, cat: 3 },
    { code: 'ACR-HA-016', designation: 'Fer HA 16mm', unite: 'TONNE', prix: 96000, stock: 3, smin: 5, cat: 3 },
    { code: 'BLK-PAR-001', designation: 'Parpaing creux 20cm', unite: 'UNITE', prix: 38, stock: 4500, smin: 2000, cat: 4 },
    { code: 'BLK-BRQ-001', designation: 'Brique rouge 7 trous', unite: 'UNITE', prix: 15, stock: 12000, smin: 5000, cat: 4 },
    { code: 'PNT-BLC-001', designation: 'Peinture vinylique blanc 15L', unite: 'LITRE', prix: 650, stock: 120, smin: 50, cat: 5 },
    { code: 'PLB-TUB-001', designation: 'Tube PVC Ø110mm', unite: 'ML', prix: 280, stock: 85, smin: 30, cat: 6 },
    { code: 'ELC-CAB-001', designation: 'Câble électrique 2.5mm²', unite: 'ML', prix: 95, stock: 350, smin: 200, cat: 7 },
    { code: 'CAR-DIE-001', designation: 'Gasoil (Diesel)', unite: 'LITRE', prix: 22, stock: 800, smin: 300, cat: 8 },
  ]

  for (const a of articles) {
    const existing = await prisma.article.findFirst({ where: { company_id: company.id, code: a.code } })
    if (!existing) {
      const cat = await prisma.categorieArticle.findFirst({ where: { company_id: company.id, nom: { contains: ['Ciment','Granulats','Armatures','Blocs','Peinture','Plomb','Électri','Carburant'][a.cat - 1].slice(0,4) } } })
      await prisma.article.create({ data: { company_id: company.id, categorie_id: cat?.id || a.cat, code: a.code, designation: a.designation, unite: a.unite, prix_unitaire_moyen: a.prix, stock_actuel: a.stock, stock_minimum: a.smin } })
    }
  }

  // Fournisseurs
  const fournisseurs = [
    { rs: 'SCAEK — Cimenterie Ain Kbira', rc: '19/A-12345', tel: '+213 36 12 34 56', wilaya: 'Sétif' },
    { rs: 'SNTP — Sables & Granulats', rc: '09/B-67890', tel: '+213 24 45 67 89', wilaya: 'Blida' },
    { rs: 'SIDER — Acier Algérie', rc: '21/A-11111', tel: '+213 36 98 76 54', wilaya: 'Annaba' },
    { rs: 'MATBAT DZ', rc: '16/C-22222', tel: '+213 21 56 78 90', wilaya: 'Alger' },
    { rs: 'SARL BENBOUZID Peintures', rc: '23/A-33333', tel: '+213 23 34 56 78', wilaya: 'Sétif' },
    { rs: 'ALGÉRIE PLB & ELECT', rc: '16/B-44444', tel: '+213 21 11 22 33', wilaya: 'Alger' },
    { rs: 'SONATRACH Carburants', rc: '00/A-00001', tel: '+213 21 00 00 00', wilaya: 'Alger' },
    { rs: 'EURL ENTP Matériaux TP', rc: '16/D-55555', tel: '+213 21 77 88 99', wilaya: 'Alger' },
  ]

  for (let i = 0; i < fournisseurs.length; i++) {
    const f = fournisseurs[i]
    await prisma.fournisseur.upsert({
      where: { id: i + 1 },
      update: {},
      create: { company_id: company.id, raison_sociale: f.rs, rc: f.rc, telephone: f.tel, wilaya: f.wilaya }
    })
  }

  // Employés
  const employes = [
    { mat: 'EMP-001', nom: 'Benali', prenom: 'Karim', qual: 'CHEF_CHANTIER', contrat: 'CDI', salaire: 85000, prime: 10000, transport: 3000 },
    { mat: 'EMP-002', nom: 'Meziane', prenom: 'Salim', qual: 'INGENIEUR', contrat: 'CDI', salaire: 120000, prime: 15000, transport: 4000 },
    { mat: 'EMP-003', nom: 'Boudiaf', prenom: 'Mohamed', qual: 'TECHNICIEN', contrat: 'CDI', salaire: 65000, prime: 7000, transport: 3000 },
    { mat: 'EMP-004', nom: 'Hamidou', prenom: 'Ali', qual: 'OUVRIER_QUALIFIE', contrat: 'CDD', salaire: 42000, prime: 5000, transport: 2000 },
    { mat: 'EMP-005', nom: 'Khaldi', prenom: 'Youcef', qual: 'OUVRIER', contrat: 'JOURNALIER', salaire: 35000, prime: 3000, transport: 1500 },
    { mat: 'EMP-006', nom: 'Saidi', prenom: 'Fatima', qual: 'ADMINISTRATIF', contrat: 'CDI', salaire: 55000, prime: 5000, transport: 3000 },
    { mat: 'EMP-007', nom: 'Ramdane', prenom: 'Hocine', qual: 'OUVRIER', contrat: 'JOURNALIER', salaire: 32000, prime: 3000, transport: 1500 },
    { mat: 'EMP-008', nom: 'Belhadj', prenom: 'Omar', qual: 'MANOEUVRE', contrat: 'SAISONNIER', salaire: 28000, prime: 2000, transport: 1000 },
    { mat: 'EMP-009', nom: 'Amrani', prenom: 'Zineb', qual: 'TECHNICIEN', contrat: 'CDI', salaire: 60000, prime: 6000, transport: 3000 },
    { mat: 'EMP-010', nom: 'Ferhat', prenom: 'Djamel', qual: 'GARDIEN', contrat: 'CDI', salaire: 30000, prime: 2000, transport: 1000 },
  ]

  for (let i = 0; i < employes.length; i++) {
    const e = employes[i]
    await prisma.employe.upsert({
      where: { id: i + 1 },
      update: {},
      create: { company_id: company.id, matricule: e.mat, nom: e.nom, prenom: e.prenom, qualification: e.qual, type_contrat: e.contrat, date_embauche: new Date('2023-01-01'), salaire_base: e.salaire, prime_chantier: e.prime, indemnite_transport: e.transport, date_fin_contrat: e.contrat === 'CDD' ? new Date('2026-05-01') : null }
    })
  }

  // Immobilisations
  await prisma.immobilisation.upsert({ where: { id: 1 }, update: {}, create: { company_id: company.id, code: 'ENGIN-001', designation: 'Excavatrice Caterpillar 320D', categorie: 'ENGIN_TP', marque: 'Caterpillar', modele: '320D', date_acquisition: new Date('2022-06-15'), valeur_acquisition: 18000000, duree_amortissement_ans: 8, statut: 'EN_SERVICE' } })
  await prisma.immobilisation.upsert({ where: { id: 2 }, update: {}, create: { company_id: company.id, code: 'VEH-001', designation: 'Camion Benne 15T', categorie: 'VEHICULE', marque: 'Mercedes', modele: 'Actros 2545', date_acquisition: new Date('2023-01-10'), valeur_acquisition: 9500000, duree_amortissement_ans: 5, statut: 'EN_SERVICE' } })
  await prisma.immobilisation.upsert({ where: { id: 3 }, update: {}, create: { company_id: company.id, code: 'ENGIN-002', designation: 'Centrale à béton 75m³/h', categorie: 'ENGIN_TP', marque: 'BHS', modele: 'RO3750', date_acquisition: new Date('2023-03-01'), valeur_acquisition: 12000000, duree_amortissement_ans: 10, statut: 'EN_SERVICE' } })
  await prisma.immobilisation.upsert({ where: { id: 4 }, update: {}, create: { company_id: company.id, code: 'VEH-002', designation: 'Pick-up Toyota Hilux', categorie: 'VEHICULE', marque: 'Toyota', modele: 'Hilux', date_acquisition: new Date('2024-01-15'), valeur_acquisition: 5200000, duree_amortissement_ans: 5, statut: 'EN_SERVICE' } })

  // Clients
  await prisma.client.upsert({ where: { id: 1 }, update: {}, create: { company_id: company.id, type_client: 'PARTICULIER', nom_complet: 'Belhadj Mohamed', cin_ou_rc: '123456789', telephone: '+213 555 11 22 33', wilaya: 'Oran' } })
  await prisma.client.upsert({ where: { id: 2 }, update: {}, create: { company_id: company.id, type_client: 'PARTICULIER', nom_complet: 'Amara Fatima', cin_ou_rc: '987654321', telephone: '+213 555 44 55 66', wilaya: 'Alger' } })
  await prisma.client.upsert({ where: { id: 3 }, update: {}, create: { company_id: company.id, type_client: 'ENTREPRISE', nom_complet: 'Ministère de l\'Éducation Nationale', cin_ou_rc: '16/B-00001', telephone: '+213 21 23 45 67', wilaya: 'Alger' } })
  await prisma.client.upsert({ where: { id: 4 }, update: {}, create: { company_id: company.id, type_client: 'PARTICULIER', nom_complet: 'Cherif Abderrahmane', cin_ou_rc: '456789123', telephone: '+213 555 77 88 99', wilaya: 'Oran' } })
  await prisma.client.upsert({ where: { id: 5 }, update: {}, create: { company_id: company.id, type_client: 'PARTICULIER', nom_complet: 'Hamidou Leila', cin_ou_rc: '321654987', telephone: '+213 555 00 11 22', wilaya: 'Oran' } })

  // Lots
  for (let i = 1; i <= 10; i++) {
    const type = i <= 6 ? 'APPARTEMENT' : i <= 8 ? 'VILLA' : 'LOCAL'
    const prix = type === 'VILLA' ? 28000000 : type === 'LOCAL' ? 8000000 : 18000000
    await prisma.lot.upsert({
      where: { id: i },
      update: {},
      create: { project_id: 1, numero_lot: `LOT-${String(i).padStart(3, '0')}`, type_bien: type, superficie_batie: type === 'VILLA' ? 250 : 100, etage: i <= 6 ? `${Math.floor((i - 1) / 2) + 1}` : 'RDC', prix_vente_ht: prix, prix_vente_ttc: prix, statut: i <= 3 ? 'VENDU' : i === 4 ? 'RESERVE' : 'DISPONIBLE' }
    })
  }

  // Charges fixes
  await prisma.chargeFixe.upsert({ where: { id: 1 }, update: {}, create: { company_id: company.id, designation: 'Loyer bureau Alger', montant_mensuel: 85000, date_debut: new Date('2023-01-01'), actif: true } })
  await prisma.chargeFixe.upsert({ where: { id: 2 }, update: {}, create: { company_id: company.id, designation: 'Assurance engins (globale)', montant_mensuel: 45000, date_debut: new Date('2023-01-01'), actif: true } })
  await prisma.chargeFixe.upsert({ where: { id: 3 }, update: {}, create: { company_id: company.id, designation: 'Abonnement téléphonique pro', montant_mensuel: 12000, date_debut: new Date('2023-01-01'), actif: true } })
  await prisma.chargeFixe.upsert({ where: { id: 4 }, update: {}, create: { company_id: company.id, designation: 'Comptabilité externe', montant_mensuel: 35000, date_debut: new Date('2023-01-01'), actif: false } })

  console.log('✅ Seed terminé avec succès !')
  console.log('👤 Comptes : admin@btp.dz / admin123 | admin@constructions-dz.com / admin123')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
