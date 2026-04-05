import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Hash password
  const passwordHash = await bcrypt.hash('password123', 10)

  // 1. Create Company
  const company = await prisma.company.create({
    data: {
      nom: 'SARL CONSTRUCTIONS DZ',
      rc: '1234567A',
      nif: '000012345678901',
      nis: '123456789012345',
      art: '01010101010',
      adresse: '12 Rue Didouche Mourad, Alger',
      telephone: '+213 555 12 34 56',
      email: 'contact@constructions-dz.com'
    }
  })

  // 2. Create Users (Roles)
  const users = [
    { nom: 'Admin', prenom: 'Super', email: 'admin@constructions-dz.com', role: 'SUPER_ADMIN' },
    { nom: 'Directeur', prenom: 'Général', email: 'dg@constructions-dz.com', role: 'DIRECTEUR' },
    { nom: 'Conducteur', prenom: 'Travaux', email: 'ct@constructions-dz.com', role: 'CONDUCTEUR_TRAVAUX' },
    { nom: 'Comptable', prenom: 'Chef', email: 'compta@constructions-dz.com', role: 'COMPTABLE' },
    { nom: 'Pointeur', prenom: 'Chantier', email: 'pointeur@constructions-dz.com', role: 'POINTEUR' }
  ]

  for (const u of users) {
    await prisma.user.create({
      data: {
        company_id: company.id,
        nom: u.nom,
        prenom: u.prenom,
        email: u.email,
        password_hash: passwordHash,
        role: u.role
      }
    })
  }

  const superAdmin = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' }})

  // 3. Create Projects
  const project1 = await prisma.project.create({
    data: {
      company_id: company.id,
      code: 'PRJ-2024-001',
      nom: 'Résidence El Bahia - 100 Logements',
      type_projet: 'PROMOTION_IMMOBILIERE',
      statut: 'EN_COURS',
      date_debut: new Date('2024-01-10'),
      date_fin_prevue: new Date('2025-12-30'),
      budget_total: 500000000,
      wilaya: 'Oran',
      created_by: superAdmin.id
    }
  })

  const project2 = await prisma.project.create({
    data: {
      company_id: company.id,
      code: 'PRJ-2024-002',
      nom: 'Lycée 1000 places - Ain Benian',
      type_projet: 'BATIMENT',
      statut: 'EN_COURS',
      date_debut: new Date('2024-03-15'),
      date_fin_prevue: new Date('2025-06-30'),
      budget_total: 350000000,
      wilaya: 'Alger',
      created_by: superAdmin.id
    }
  })

  // 4. Create Chantiers
  const chantier1 = await prisma.chantier.create({
    data: {
      company_id: company.id,
      project_id: project1.id,
      code: 'CHT-01-01',
      nom: 'Gros Oeuvres - Bâtiment A',
      statut: 'EN_COURS',
      date_debut: new Date('2024-02-01'),
      date_fin_prevue: new Date('2024-10-30'),
      budget_alloue: 100000000
    }
  })

  console.log('Seed DZ effectué avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
