import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Initialisation de BTP Manager DZ...')

  // 1. Création de l'entreprise par défaut
  const company = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nom: 'Mon Entreprise BTP',
      email: 'contact@entreprise.dz',
      telephone: '+213 21 00 00 00',
      adresse: 'Adresse de l\'entreprise',
      wilaya: 'Alger',
      nif: '000000000000000',
      rc: '00/00-0000000B00',
      nis: '000000000000000'
    }
  })

  // 2. Création de l'administrateur par défaut
  const passwordHash = await bcrypt.hash('admin123', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@btp-manager.dz' },
    update: {},
    create: {
      company_id: company.id,
      nom: 'Administrateur',
      email: 'admin@btp-manager.dz',
      password_hash: passwordHash,
      role: 'SUPER_ADMIN',
      actif: true
    }
  })

  console.log('✅ Initialisation terminée avec succès !')
  console.log('--------------------------------------------------')
  console.log('👤 Identifiants de connexion :')
  console.log('📧 Email : admin@btp-manager.dz')
  console.log('🔑 MDP   : admin123')
  console.log('--------------------------------------------------')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
