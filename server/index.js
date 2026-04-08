import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()
const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ success: false, message: 'Non autorisé' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { id: decoded.id }, include: { company: true } })
    if (!user || !user.actif) return res.status(401).json({ success: false, message: 'Compte inactif' })
    req.user = user
    next()
  } catch { res.status(401).json({ success: false, message: 'Token invalide' }) }
}

const ok = (res, data, status = 200) => res.status(status).json({ success: true, data })
const err = (res, msg, status = 500) => res.status(status).json({ success: false, message: msg })

// ─── API ROUTES ──────────────────────────────────────────────────────────────
const api = express.Router()
app.use('/api/v1', api)

// --- AUTH ---
api.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email }, include: { company: true } })
    if (!user || !await bcrypt.compare(password, user.password_hash))
      return res.status(401).json({ success: false, message: 'Identifiants invalides' })
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    ok(res, { 
      token, 
      user: { 
        id: user.id, 
        nom: user.nom, 
        email: user.email, 
        role: user.role, 
        company: user.company?.nom,
        company_id: user.company_id
      } 
    })
  } catch (e) { err(res, e.message) }
})

api.get('/auth/me', protect, (req, res) => ok(res, req.user))

// --- MARCHÉS PUBLICS ---
api.get('/marches', protect, async (req, res) => {
  try {
    const marches = await prisma.marche.findMany({
      where: { company_id: req.user.company_id },
      include: { chantiers: true, _count: { select: { chantiers: true, avenants: true } } },
      orderBy: { created_at: 'desc' }
    })
    ok(res, marches)
  } catch (e) { err(res, e.message) }
})

api.get('/marches/:id', protect, async (req, res) => {
  try {
    const marche = await prisma.marche.findUnique({
      where: { id: +req.params.id },
      include: { 
        chantiers: true, 
        lots: true, 
        dqe_items: true, 
        avenants: true,
        company: true 
      }
    })
    if (!marche || marche.company_id !== req.user.company_id) return res.status(404).json({ success: false, message: 'Marché non trouvé' })
    ok(res, marche)
  } catch (e) { err(res, e.message) }
})

api.post('/marches', protect, async (req, res) => {
  try {
    const data = { ...req.body, company_id: req.user.company_id }
    const marche = await prisma.marche.create({ data })
    ok(res, marche, 201)
  } catch (e) { err(res, e.message) }
})

// --- CHANTIERS / LOTS ---
api.get('/chantiers', protect, async (req, res) => {
  try {
    const chantiers = await prisma.chantier.findMany({
      where: { company_id: req.user.company_id },
      include: { marche: true },
      orderBy: { created_at: 'desc' }
    })
    ok(res, chantiers)
  } catch (e) { err(res, e.message) }
})

api.get('/chantiers/:id', protect, async (req, res) => {
  try {
    const chantier = await prisma.chantier.findUnique({
      where: { id: +req.params.id },
      include: { 
        marche: true, 
        situations: true, 
        taches: true, 
        journal_entrees: true, 
        pointages: true, 
        dqe_items: true 
      }
    })
    if (!chantier || chantier.company_id !== req.user.company_id) return res.status(404).json({ success: false, message: 'Chantier non trouvé' })
    ok(res, chantier)
  } catch (e) { err(res, e.message) }
})

// --- FINANCE ---
api.get('/finance/stats', protect, async (req, res) => {
  try {
    const cid = req.user.company_id
    const [factures, depenses, comptes] = await Promise.all([
      prisma.facture.findMany({ where: { company_id: cid } }),
      prisma.depense.findMany({ where: { company_id: cid } }),
      prisma.compteTresorerie.findMany({ where: { company_id: cid } })
    ])
    
    const totalFacture = factures.reduce((s, f) => s + f.montant_ttc, 0)
    const totalEncaisse = factures.reduce((s, f) => s + f.montant_paye, 0)
    const totalDepense = depenses.reduce((s, d) => s + d.montant, 0)
    const totalTresorerie = comptes.reduce((s, c) => s + c.solde, 0)

    ok(res, {
      totalFacture,
      totalEncaisse,
      totalDepense,
      totalTresorerie,
      creances: totalFacture - totalEncaisse
    })
  } catch (e) { err(res, e.message) }
})

// --- DASHBOARD ---
api.get('/dashboard/summary', protect, async (req, res) => {
  try {
    const cid = req.user.company_id
    const [activeChantiers, marches, depenses, comptes] = await Promise.all([
      prisma.chantier.count({ where: { company_id: cid, statut: 'EN_COURS' } }),
      prisma.marche.findMany({ where: { company_id: cid } }),
      prisma.depense.findMany({ 
        where: { 
          company_id: cid, 
          date_depense: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } 
        } 
      }),
      prisma.compteTresorerie.findMany({ where: { company_id: cid } })
    ])

    const totalMarches = marches.reduce((s, m) => s + m.montant_ttc, 0)
    const monthlyDepenses = depenses.reduce((s, d) => s + d.montant, 0)
    const totalTresorerie = comptes.reduce((s, c) => s + c.solde, 0)

    ok(res, {
      activeChantiers,
      totalMarches,
      monthlyDepenses,
      totalTresorerie,
      alertCount: 3 // Mocked for now
    })
  } catch (e) { err(res, e.message) }
})

// --- CLIENTS & FOURNISSEURS ---
api.get('/clients', protect, async (req, res) => {
  try { ok(res, await prisma.client.findMany({ where: { company_id: req.user.company_id } })) }
  catch (e) { err(res, e.message) }
})

api.get('/fournisseurs', protect, async (req, res) => {
  try { ok(res, await prisma.fournisseur.findMany({ where: { company_id: req.user.company_id } })) }
  catch (e) { err(res, e.message) }
})

app.listen(PORT, () => console.log(`🚀 BTP Manager DZ Backend on port ${PORT}`))
