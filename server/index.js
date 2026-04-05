import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { z } from 'zod'
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
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!user || !user.actif) return res.status(401).json({ success: false, message: 'Compte inactif' })
    req.user = user
    next()
  } catch { res.status(401).json({ success: false, message: 'Token invalide' }) }
}

const validate = (schema) => (req, res, next) => {
  try { schema.parse(req.body); next() }
  catch (e) { res.status(400).json({ success: false, errors: e.errors }) }
}

const ok = (res, data, status = 200) => res.status(status).json({ success: true, data })
const err = (res, msg, status = 500) => res.status(status).json({ success: false, message: msg })

// ─── HEALTH ──────────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'OK' }))

// ─── API ROUTER ──────────────────────────────────────────────────────────────
const api = express.Router()
app.use('/api/v1', api)

// AUTH
api.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email }, include: { company: true } })
    if (!user || !await bcrypt.compare(password, user.password_hash))
      return res.status(401).json({ success: false, message: 'Identifiants invalides' })
    if (!user.actif) return res.status(403).json({ success: false, message: 'Compte désactivé' })
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    ok(res, { token, user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role, company: user.company?.nom } })
  } catch (e) { err(res, e.message) }
})

api.get('/auth/me', protect, (req, res) => ok(res, req.user))

api.get('/auth/users', protect, async (req, res) => {
  try { ok(res, await prisma.user.findMany({ where: { company_id: req.user.company_id } })) }
  catch (e) { err(res, e.message) }
})

api.post('/auth/register', protect, async (req, res) => {
  try {
    const { nom, prenom, email, password, role } = req.body
    const hash = await bcrypt.hash(password, 10)
    ok(res, await prisma.user.create({ data: { nom, prenom, email, password_hash: hash, role: role || 'READONLY', company_id: req.user.company_id } }), 201)
  } catch (e) { err(res, e.message) }
})

api.put('/auth/users/:id', protect, async (req, res) => {
  try { ok(res, await prisma.user.update({ where: { id: +req.params.id }, data: req.body })) }
  catch (e) { err(res, e.message) }
})

// PROJETS
api.get('/projects', protect, async (req, res) => {
  try { ok(res, await prisma.project.findMany({ where: { company_id: req.user.company_id }, include: { chantiers: true } })) }
  catch (e) { err(res, e.message) }
})

api.post('/projects', protect, async (req, res) => {
  try { ok(res, await prisma.project.create({ data: { ...req.body, company_id: req.user.company_id, created_by: req.user.id } }), 201) }
  catch (e) { err(res, e.message) }
})

api.put('/projects/:id', protect, async (req, res) => {
  try { ok(res, await prisma.project.update({ where: { id: +req.params.id }, data: req.body })) }
  catch (e) { err(res, e.message) }
})

// CHANTIERS
api.get('/chantiers', protect, async (req, res) => {
  try { ok(res, await prisma.chantier.findMany({ where: { company_id: req.user.company_id }, include: { project: true } })) }
  catch (e) { err(res, e.message) }
})

api.post('/chantiers', protect, async (req, res) => {
  try { ok(res, await prisma.chantier.create({ data: { ...req.body, company_id: req.user.company_id } }), 201) }
  catch (e) { err(res, e.message) }
})

api.put('/chantiers/:id', protect, async (req, res) => {
  try { ok(res, await prisma.chantier.update({ where: { id: +req.params.id }, data: req.body })) }
  catch (e) { err(res, e.message) }
})

// FOURNISSEURS
api.get('/fournisseurs', protect, async (req, res) => {
  try {
    const { search = '' } = req.query
    ok(res, await prisma.fournisseur.findMany({
      where: { company_id: req.user.company_id, actif: true, ...(search ? { raison_sociale: { contains: search } } : {}) },
      orderBy: { id: 'desc' }
    }))
  } catch (e) { err(res, e.message) }
})

api.post('/fournisseurs', protect, async (req, res) => {
  try { ok(res, await prisma.fournisseur.create({ data: { ...req.body, company_id: req.user.company_id } }), 201) }
  catch (e) { err(res, e.message) }
})

api.put('/fournisseurs/:id', protect, async (req, res) => {
  try { ok(res, await prisma.fournisseur.update({ where: { id: +req.params.id }, data: req.body })) }
  catch (e) { err(res, e.message) }
})

api.delete('/fournisseurs/:id', protect, async (req, res) => {
  try { await prisma.fournisseur.update({ where: { id: +req.params.id }, data: { actif: false } }); ok(res, null) }
  catch (e) { err(res, e.message) }
})

// BONS DE COMMANDE
api.get('/bons-commande', protect, async (req, res) => {
  try {
    ok(res, await prisma.bonCommande.findMany({
      where: { company_id: req.user.company_id },
      include: { fournisseur: true, chantier: true, lignes: { include: { article: true } } },
      orderBy: { id: 'desc' }
    }))
  } catch (e) { err(res, e.message) }
})

api.post('/bons-commande', protect, async (req, res) => {
  try {
    const { lignes, ...bcData } = req.body
    const bc = await prisma.$transaction(async (tx) => {
      const created = await tx.bonCommande.create({ data: { ...bcData, company_id: req.user.company_id, created_by: req.user.id } })
      if (lignes?.length) {
        await tx.ligneBC.createMany({ data: lignes.map(l => ({ ...l, bon_commande_id: created.id })) })
      }
      return created
    })
    ok(res, bc, 201)
  } catch (e) { err(res, e.message) }
})

api.get('/bons-commande/:id', protect, async (req, res) => {
  try {
    ok(res, await prisma.bonCommande.findUnique({
      where: { id: +req.params.id },
      include: { fournisseur: true, chantier: true, lignes: { include: { article: true } } }
    }))
  } catch (e) { err(res, e.message) }
})

api.put('/bons-commande/:id/statut', protect, async (req, res) => {
  try { ok(res, await prisma.bonCommande.update({ where: { id: +req.params.id }, data: { statut: req.body.statut } })) }
  catch (e) { err(res, e.message) }
})

// BONS DE LIVRAISON
api.get('/bons-livraison', protect, async (req, res) => {
  try {
    ok(res, await prisma.bonLivraison.findMany({
      where: { bon_commande: { company_id: req.user.company_id } },
      include: { bon_commande: { include: { fournisseur: true } }, chantier: true, lignes: true },
      orderBy: { id: 'desc' }
    }))
  } catch (e) { err(res, e.message) }
})

api.post('/bons-livraison', protect, async (req, res) => {
  try {
    const { lignes, ...blData } = req.body
    const bl = await prisma.$transaction(async (tx) => {
      const created = await tx.bonLivraison.create({ data: { ...blData, created_by: req.user.id } })
      for (const l of (lignes || [])) {
        await tx.ligneBL.create({ data: { bon_livraison_id: created.id, ligne_bc_id: l.ligne_bc_id, quantite_livree: l.quantite_livree } })
        const ligneBC = await tx.ligneBC.findUnique({ where: { id: l.ligne_bc_id }, include: { article: true } })
        if (ligneBC) {
          const art = ligneBC.article
          const newStock = art.stock_actuel + l.quantite_livree
          const newPMP = newStock > 0 ? (art.stock_actuel * art.prix_unitaire_moyen + l.quantite_livree * ligneBC.prix_unitaire_ht) / newStock : art.prix_unitaire_moyen
          await tx.article.update({ where: { id: art.id }, data: { stock_actuel: newStock, prix_unitaire_moyen: newPMP } })
          await tx.mouvementStock.create({
            data: {
              company_id: req.user.company_id, article_id: art.id, chantier_id: blData.chantier_id,
              type_mouvement: 'ENTREE_ACHAT', quantite: l.quantite_livree, prix_unitaire: newPMP,
              valeur_totale: l.quantite_livree * newPMP, reference_document: blData.numero_bl,
              created_by: req.user.id
            }
          })
          await tx.ligneBC.update({ where: { id: l.ligne_bc_id }, data: { quantite_recue: { increment: l.quantite_livree } } })
        }
      }
      return created
    })
    ok(res, bl, 201)
  } catch (e) { err(res, e.message) }
})

// FACTURES FOURNISSEUR
api.get('/factures-fournisseur', protect, async (req, res) => {
  try {
    ok(res, await prisma.factureFournisseur.findMany({
      where: { company_id: req.user.company_id },
      include: { fournisseur: true, paiements: true },
      orderBy: { id: 'desc' }
    }))
  } catch (e) { err(res, e.message) }
})

api.post('/factures-fournisseur', protect, async (req, res) => {
  try { ok(res, await prisma.factureFournisseur.create({ data: { ...req.body, company_id: req.user.company_id } }), 201) }
  catch (e) { err(res, e.message) }
})

api.post('/factures-fournisseur/:id/paiement', protect, async (req, res) => {
  try {
    const { montant, date_paiement, mode_paiement, reference } = req.body
    const facture = await prisma.factureFournisseur.findUnique({ where: { id: +req.params.id }, include: { paiements: true } })
    await prisma.paiementFournisseur.create({ data: { facture_fournisseur_id: +req.params.id, montant, date_paiement: new Date(date_paiement), mode_paiement, reference } })
    const totalPaye = facture.paiements.reduce((s, p) => s + p.montant, 0) + montant
    const statut = totalPaye >= facture.montant_ttc ? 'PAYE' : 'PARTIELLEMENT_PAYE'
    await prisma.factureFournisseur.update({ where: { id: +req.params.id }, data: { statut_paiement: statut } })
    await prisma.fournisseur.update({ where: { id: facture.fournisseur_id }, data: { solde_courant: { decrement: montant } } })
    ok(res, { statut })
  } catch (e) { err(res, e.message) }
})

// ARTICLES & STOCK
api.get('/categories-articles', protect, async (req, res) => {
  try { ok(res, await prisma.categorieArticle.findMany({ where: { company_id: req.user.company_id } })) }
  catch (e) { err(res, e.message) }
})

api.post('/categories-articles', protect, async (req, res) => {
  try { ok(res, await prisma.categorieArticle.create({ data: { ...req.body, company_id: req.user.company_id } }), 201) }
  catch (e) { err(res, e.message) }
})

api.get('/articles', protect, async (req, res) => {
  try {
    const { search = '' } = req.query
    ok(res, await prisma.article.findMany({
      where: { company_id: req.user.company_id, actif: true, ...(search ? { designation: { contains: search } } : {}) },
      include: { categorie: true }, orderBy: { designation: 'asc' }
    }))
  } catch (e) { err(res, e.message) }
})

api.post('/articles', protect, async (req, res) => {
  try { ok(res, await prisma.article.create({ data: { ...req.body, company_id: req.user.company_id } }), 201) }
  catch (e) { err(res, e.message) }
})

api.put('/articles/:id', protect, async (req, res) => {
  try { ok(res, await prisma.article.update({ where: { id: +req.params.id }, data: req.body })) }
  catch (e) { err(res, e.message) }
})

api.get('/articles/alertes', protect, async (req, res) => {
  try {
    const articles = await prisma.article.findMany({ where: { company_id: req.user.company_id, actif: true } })
    ok(res, articles.filter(a => a.stock_actuel < a.stock_minimum))
  } catch (e) { err(res, e.message) }
})

api.get('/mouvements-stock', protect, async (req, res) => {
  try {
    const { article_id, chantier_id } = req.query
    ok(res, await prisma.mouvementStock.findMany({
      where: { company_id: req.user.company_id, ...(article_id ? { article_id: +article_id } : {}), ...(chantier_id ? { chantier_id: +chantier_id } : {}) },
      include: { article: true, chantier: true }, orderBy: { date_mouvement: 'desc' }
    }))
  } catch (e) { err(res, e.message) }
})

api.post('/mouvements-stock', protect, async (req, res) => {
  try {
    const { article_id, type_mouvement, quantite, prix_unitaire, chantier_id, notes, reference_document } = req.body
    const art = await prisma.article.findUnique({ where: { id: +article_id } })
    let newStock = art.stock_actuel
    let newPMP = art.prix_unitaire_moyen
    const isEntree = type_mouvement.startsWith('ENTREE') || type_mouvement.startsWith('INVENTAIRE_POSITIF')
    if (isEntree) {
      newStock += +quantite
      newPMP = newStock > 0 ? (art.stock_actuel * art.prix_unitaire_moyen + +quantite * +prix_unitaire) / newStock : +prix_unitaire
    } else {
      newStock -= +quantite
    }
    await prisma.article.update({ where: { id: +article_id }, data: { stock_actuel: newStock, prix_unitaire_moyen: newPMP } })
    const mouvement = await prisma.mouvementStock.create({
      data: { company_id: req.user.company_id, article_id: +article_id, chantier_id: chantier_id ? +chantier_id : null, type_mouvement, quantite: +quantite, prix_unitaire: +prix_unitaire, valeur_totale: +quantite * +prix_unitaire, reference_document, notes, created_by: req.user.id }
    })
    ok(res, mouvement, 201)
  } catch (e) { err(res, e.message) }
})

// INVENTAIRES
api.get('/inventaires', protect, async (req, res) => {
  try { ok(res, await prisma.inventaire.findMany({ where: { company_id: req.user.company_id }, orderBy: { id: 'desc' } })) }
  catch (e) { err(res, e.message) }
})

api.post('/inventaires', protect, async (req, res) => {
  try { ok(res, await prisma.inventaire.create({ data: { ...req.body, company_id: req.user.company_id, created_by: req.user.id } }), 201) }
  catch (e) { err(res, e.message) }
})

api.get('/inventaires/:id', protect, async (req, res) => {
  try {
    ok(res, await prisma.inventaire.findUnique({ where: { id: +req.params.id }, include: { lignes: { include: { article: true } } } }))
  } catch (e) { err(res, e.message) }
})

api.post('/inventaires/:id/valider', protect, async (req, res) => {
  try {
    const { lignes } = req.body
    await prisma.$transaction(async (tx) => {
      for (const l of (lignes || [])) {
        const art = await tx.article.findUnique({ where: { id: l.article_id } })
        const ecart = l.stock_physique - art.stock_actuel
        if (ecart !== 0) {
          const type = ecart > 0 ? 'INVENTAIRE_POSITIF' : 'INVENTAIRE_NEGATIF'
          await tx.mouvementStock.create({
            data: { company_id: req.user.company_id, article_id: l.article_id, type_mouvement: type, quantite: Math.abs(ecart), prix_unitaire: art.prix_unitaire_moyen, valeur_totale: Math.abs(ecart) * art.prix_unitaire_moyen, reference_document: `INV-${req.params.id}`, created_by: req.user.id }
          })
          await tx.article.update({ where: { id: l.article_id }, data: { stock_actuel: l.stock_physique } })
        }
      }
      await tx.inventaire.update({ where: { id: +req.params.id }, data: { statut: 'VALIDE' } })
    })
    ok(res, { message: 'Inventaire validé' })
  } catch (e) { err(res, e.message) }
})

// EMPLOYÉS
api.get('/employes', protect, async (req, res) => {
  try {
    const { search = '' } = req.query
    ok(res, await prisma.employe.findMany({
      where: { company_id: req.user.company_id, ...(search ? { OR: [{ nom: { contains: search } }, { prenom: { contains: search } }] } : {}) },
      orderBy: { nom: 'asc' }
    }))
  } catch (e) { err(res, e.message) }
})

api.post('/employes', protect, async (req, res) => {
  try { ok(res, await prisma.employe.create({ data: { ...req.body, company_id: req.user.company_id } }), 201) }
  catch (e) { err(res, e.message) }
})

api.get('/employes/:id', protect, async (req, res) => {
  try { ok(res, await prisma.employe.findUnique({ where: { id: +req.params.id }, include: { affectations: { include: { chantier: true } }, avances: true, conges: true } })) }
  catch (e) { err(res, e.message) }
})

api.put('/employes/:id', protect, async (req, res) => {
  try { ok(res, await prisma.employe.update({ where: { id: +req.params.id }, data: req.body })) }
  catch (e) { err(res, e.message) }
})

// AFFECTATIONS
api.get('/affectations-chantier', protect, async (req, res) => {
  try {
    ok(res, await prisma.affectationChantier.findMany({ include: { employe: true, chantier: true } }))
  } catch (e) { err(res, e.message) }
})

api.post('/affectations-chantier', protect, async (req, res) => {
  try { ok(res, await prisma.affectationChantier.create({ data: req.body }), 201) }
  catch (e) { err(res, e.message) }
})

// POINTAGES
api.get('/pointages', protect, async (req, res) => {
  try {
    const { chantier_id, mois, annee } = req.query
    const where = { company_id: req.user.company_id }
    if (chantier_id) where.chantier_id = +chantier_id
    if (mois && annee) {
      where.date_pointage = { gte: new Date(+annee, +mois - 1, 1), lt: new Date(+annee, +mois, 1) }
    }
    ok(res, await prisma.pointage.findMany({ where, include: { employe: true }, orderBy: { date_pointage: 'asc' } }))
  } catch (e) { err(res, e.message) }
})

api.post('/pointages/batch', protect, async (req, res) => {
  try {
    const { pointages } = req.body
    for (const p of (pointages || [])) {
      const existing = await prisma.pointage.findFirst({ where: { employe_id: p.employe_id, chantier_id: p.chantier_id, date_pointage: new Date(p.date_pointage) } })
      if (existing) await prisma.pointage.update({ where: { id: existing.id }, data: { ...p, company_id: req.user.company_id } })
      else await prisma.pointage.create({ data: { ...p, company_id: req.user.company_id } })
    }
    ok(res, { saved: pointages?.length })
  } catch (e) { err(res, e.message) }
})

// CONGÉS
api.get('/conges', protect, async (req, res) => {
  try { ok(res, await prisma.conge.findMany({ include: { employe: true }, orderBy: { id: 'desc' } })) }
  catch (e) { err(res, e.message) }
})

api.post('/conges', protect, async (req, res) => {
  try { ok(res, await prisma.conge.create({ data: { ...req.body, statut: 'DEMANDE' } }), 201) }
  catch (e) { err(res, e.message) }
})

api.put('/conges/:id/statut', protect, async (req, res) => {
  try { ok(res, await prisma.conge.update({ where: { id: +req.params.id }, data: { statut: req.body.statut } })) }
  catch (e) { err(res, e.message) }
})

// AVANCES
api.get('/avances-salaire', protect, async (req, res) => {
  try { ok(res, await prisma.avanceSalaire.findMany({ include: { employe: true }, orderBy: { id: 'desc' } })) }
  catch (e) { err(res, e.message) }
})

api.post('/avances-salaire', protect, async (req, res) => {
  try { ok(res, await prisma.avanceSalaire.create({ data: { ...req.body, statut: 'EN_ATTENTE' } }), 201) }
  catch (e) { err(res, e.message) }
})

// PAIE - IRG DZ 2024
function calculerIRG(salaireBrut) {
  const cnas = salaireBrut * 0.09
  const revenuImposable = salaireBrut - cnas
  const abattement = Math.min(revenuImposable * 0.40, 2000)
  const base = revenuImposable - abattement
  let irg = 0
  if (base <= 10000) irg = 0
  else if (base <= 30000) irg = (base - 10000) * 0.20
  else if (base <= 120000) irg = 4000 + (base - 30000) * 0.30
  else irg = 4000 + 27000 + (base - 120000) * 0.35
  return Math.round(irg)
}

api.get('/bulletins-paie', protect, async (req, res) => {
  try {
    const { mois, annee } = req.query
    ok(res, await prisma.bulletinPaie.findMany({
      where: { company_id: req.user.company_id, ...(mois ? { mois: +mois } : {}), ...(annee ? { annee: +annee } : {}) },
      include: { employe: true }, orderBy: { id: 'desc' }
    }))
  } catch (e) { err(res, e.message) }
})

api.post('/bulletins-paie/generer-mois', protect, async (req, res) => {
  try {
    const { mois, annee } = req.body
    const employes = await prisma.employe.findMany({ where: { company_id: req.user.company_id, actif: true } })
    const results = []
    for (const emp of employes) {
      const existing = await prisma.bulletinPaie.findFirst({ where: { employe_id: emp.id, mois: +mois, annee: +annee } })
      if (existing) { results.push(existing); continue }
      const pointages = await prisma.pointage.findMany({ where: { employe_id: emp.id, date_pointage: { gte: new Date(+annee, +mois - 1, 1), lt: new Date(+annee, +mois, 1) } } })
      const joursPresents = pointages.filter(p => p.statut_journee === 'PRESENT').length
      const heuresNormales = pointages.reduce((s, p) => s + p.heures_normales, 0)
      const heuresSup25 = pointages.reduce((s, p) => s + p.heures_sup_25, 0)
      const heuresSup50 = pointages.reduce((s, p) => s + p.heures_sup_50, 0)
      const tauxJ = emp.salaire_base / 30
      const tauxH = emp.salaire_base / 30 / 8
      const salaireBrut = joursPresents * tauxJ + heuresSup25 * tauxH * 1.25 + heuresSup50 * tauxH * 1.5 + emp.prime_chantier + emp.indemnite_transport
      const cnasEmp = Math.round(salaireBrut * 0.09)
      const irg = calculerIRG(salaireBrut)
      const avances = await prisma.avanceSalaire.findMany({ where: { employe_id: emp.id, statut: 'EN_ATTENTE' } })
      const totalAvances = avances.reduce((s, a) => s + a.montant, 0)
      const bulletin = await prisma.bulletinPaie.create({
        data: { company_id: req.user.company_id, employe_id: emp.id, mois: +mois, annee: +annee, jours_travailles: joursPresents, heures_normales: heuresNormales, heures_sup_25: heuresSup25, heures_sup_50: heuresSup50, salaire_brut: salaireBrut, prime_chantier: emp.prime_chantier, indemnite_transport: emp.indemnite_transport, retenues_cnas: cnasEmp, retenues_irg: irg, avances_deduites: totalAvances, salaire_net: salaireBrut - cnasEmp - irg - totalAvances, statut: 'BROUILLON' }
      })
      results.push(bulletin)
    }
    ok(res, results)
  } catch (e) { err(res, e.message) }
})

api.put('/bulletins-paie/:id/valider', protect, async (req, res) => {
  try { ok(res, await prisma.bulletinPaie.update({ where: { id: +req.params.id }, data: { statut: 'VALIDE' } })) }
  catch (e) { err(res, e.message) }
})

api.put('/bulletins-paie/:id/payer', protect, async (req, res) => {
  try { ok(res, await prisma.bulletinPaie.update({ where: { id: +req.params.id }, data: { statut: 'PAYE', date_paiement: new Date() } })) }
  catch (e) { err(res, e.message) }
})

// IMMOBILISATIONS
api.get('/immobilisations', protect, async (req, res) => {
  try { ok(res, await prisma.immobilisation.findMany({ where: { company_id: req.user.company_id }, include: { affectations: true, maintenances: { orderBy: { date_maintenance: 'desc' }, take: 1 } } })) }
  catch (e) { err(res, e.message) }
})

api.post('/immobilisations', protect, async (req, res) => {
  try { ok(res, await prisma.immobilisation.create({ data: { ...req.body, company_id: req.user.company_id } }), 201) }
  catch (e) { err(res, e.message) }
})

api.put('/immobilisations/:id', protect, async (req, res) => {
  try { ok(res, await prisma.immobilisation.update({ where: { id: +req.params.id }, data: req.body })) }
  catch (e) { err(res, e.message) }
})

api.get('/immobilisations/:id/amortissement', protect, async (req, res) => {
  try {
    const immo = await prisma.immobilisation.findUnique({ where: { id: +req.params.id } })
    const annuelAmort = (immo.valeur_acquisition - immo.valeur_residuelle) / immo.duree_amortissement_ans
    const rows = []
    let cumul = 0
    const startYear = new Date(immo.date_acquisition).getFullYear()
    for (let i = 1; i <= immo.duree_amortissement_ans; i++) {
      cumul += annuelAmort
      rows.push({ annee: startYear + i - 1, valeur_brute: immo.valeur_acquisition, amort_annuel: annuelAmort, amort_cumul: cumul, vnc: immo.valeur_acquisition - cumul })
    }
    ok(res, rows)
  } catch (e) { err(res, e.message) }
})

api.get('/affectations-materiel', protect, async (req, res) => {
  try { ok(res, await prisma.affectationMateriel.findMany({ include: { immobilisation: true, chantier: true }, orderBy: { id: 'desc' } })) }
  catch (e) { err(res, e.message) }
})

api.post('/affectations-materiel', protect, async (req, res) => {
  try { ok(res, await prisma.affectationMateriel.create({ data: req.body }), 201) }
  catch (e) { err(res, e.message) }
})

api.put('/affectations-materiel/:id/restituer', protect, async (req, res) => {
  try {
    const aff = await prisma.affectationMateriel.findUnique({ where: { id: +req.params.id } })
    const dateRetour = new Date(req.body.date_retour)
    const jours = Math.ceil((dateRetour - new Date(aff.date_affectation)) / 86400000)
    ok(res, await prisma.affectationMateriel.update({ where: { id: +req.params.id }, data: { date_retour: dateRetour, heures_utilisation: jours } }))
  } catch (e) { err(res, e.message) }
})

api.get('/maintenances', protect, async (req, res) => {
  try { ok(res, await prisma.maintenance.findMany({ include: { immobilisation: true }, orderBy: { date_maintenance: 'desc' } })) }
  catch (e) { err(res, e.message) }
})

api.post('/maintenances', protect, async (req, res) => {
  try { ok(res, await prisma.maintenance.create({ data: req.body }), 201) }
  catch (e) { err(res, e.message) }
})

// CLIENTS
api.get('/clients', protect, async (req, res) => {
  try { ok(res, await prisma.client.findMany({ where: { company_id: req.user.company_id, actif: true } })) }
  catch (e) { err(res, e.message) }
})

api.post('/clients', protect, async (req, res) => {
  try { ok(res, await prisma.client.create({ data: { ...req.body, company_id: req.user.company_id } }), 201) }
  catch (e) { err(res, e.message) }
})

api.put('/clients/:id', protect, async (req, res) => {
  try { ok(res, await prisma.client.update({ where: { id: +req.params.id }, data: req.body })) }
  catch (e) { err(res, e.message) }
})

// LOTS
api.get('/lots', protect, async (req, res) => {
  try {
    const { project_id } = req.query
    ok(res, await prisma.lot.findMany({ where: { ...(project_id ? { project_id: +project_id } : {}), project: { company_id: req.user.company_id } } }))
  } catch (e) { err(res, e.message) }
})

api.post('/lots', protect, async (req, res) => {
  try { ok(res, await prisma.lot.create({ data: req.body }), 201) }
  catch (e) { err(res, e.message) }
})

api.put('/lots/:id', protect, async (req, res) => {
  try { ok(res, await prisma.lot.update({ where: { id: +req.params.id }, data: req.body })) }
  catch (e) { err(res, e.message) }
})

// CONTRATS VENTE
api.get('/contrats-vente', protect, async (req, res) => {
  try {
    ok(res, await prisma.contratVente.findMany({
      where: { company_id: req.user.company_id },
      include: { client: true, lot: true, echeances: true }, orderBy: { id: 'desc' }
    }))
  } catch (e) { err(res, e.message) }
})

api.post('/contrats-vente', protect, async (req, res) => {
  try {
    const { echeances, ...contratData } = req.body
    const contrat = await prisma.$transaction(async (tx) => {
      const c = await tx.contratVente.create({ data: { ...contratData, company_id: req.user.company_id } })
      if (echeances?.length) {
        await tx.echeancePaiement.createMany({ data: echeances.map((e, i) => ({ ...e, contrat_vente_id: c.id, numero_tranche: i + 1, statut: 'EN_ATTENTE' })) })
      }
      await tx.lot.update({ where: { id: contratData.lot_id }, data: { statut: 'VENDU' } })
      return c
    })
    ok(res, contrat, 201)
  } catch (e) { err(res, e.message) }
})

api.get('/contrats-vente/:id', protect, async (req, res) => {
  try {
    ok(res, await prisma.contratVente.findUnique({ where: { id: +req.params.id }, include: { client: true, lot: true, echeances: { include: { encaissements: true } } } }))
  } catch (e) { err(res, e.message) }
})

api.get('/echeances-paiement', protect, async (req, res) => {
  try {
    const { contrat_id } = req.query
    ok(res, await prisma.echeancePaiement.findMany({ where: { ...(contrat_id ? { contrat_vente_id: +contrat_id } : {}), contrat_vente: { company_id: req.user.company_id } }, include: { encaissements: true, contrat_vente: { include: { client: true } } }, orderBy: { date_echeance: 'asc' } }))
  } catch (e) { err(res, e.message) }
})

api.post('/encaissements', protect, async (req, res) => {
  try {
    const { echeance_id, montant, date_encaissement, mode_paiement, reference_paiement } = req.body
    const enc = await prisma.encaissement.create({ data: { echeance_id: +echeance_id, montant, date_encaissement: new Date(date_encaissement), mode_paiement, reference_paiement, created_by: req.user.id } })
    const ech = await prisma.echeancePaiement.findUnique({ where: { id: +echeance_id }, include: { encaissements: true } })
    const totalEnc = ech.encaissements.reduce((s, e) => s + e.montant, 0)
    const statut = totalEnc >= ech.montant_appel ? 'PAYEE' : 'PARTIELLEMENT_PAYEE'
    await prisma.echeancePaiement.update({ where: { id: +echeance_id }, data: { montant_encaisse: totalEnc, statut } })
    ok(res, enc, 201)
  } catch (e) { err(res, e.message) }
})

// DÉPENSES
api.get('/depenses-directes', protect, async (req, res) => {
  try { ok(res, await prisma.depenseDirecte.findMany({ where: { company_id: req.user.company_id }, include: { chantier: true }, orderBy: { date_depense: 'desc' } })) }
  catch (e) { err(res, e.message) }
})

api.post('/depenses-directes', protect, async (req, res) => {
  try { ok(res, await prisma.depenseDirecte.create({ data: { ...req.body, company_id: req.user.company_id, created_by: req.user.id } }), 201) }
  catch (e) { err(res, e.message) }
})

api.delete('/depenses-directes/:id', protect, async (req, res) => {
  try { await prisma.depenseDirecte.delete({ where: { id: +req.params.id } }); ok(res, null) }
  catch (e) { err(res, e.message) }
})

// CHARGES FIXES
api.get('/charges-fixes', protect, async (req, res) => {
  try { ok(res, await prisma.chargeFixe.findMany({ where: { company_id: req.user.company_id } })) }
  catch (e) { err(res, e.message) }
})

api.post('/charges-fixes', protect, async (req, res) => {
  try { ok(res, await prisma.chargeFixe.create({ data: { ...req.body, company_id: req.user.company_id } }), 201) }
  catch (e) { err(res, e.message) }
})

api.put('/charges-fixes/:id', protect, async (req, res) => {
  try { ok(res, await prisma.chargeFixe.update({ where: { id: +req.params.id }, data: req.body })) }
  catch (e) { err(res, e.message) }
})

// SOUS-TRAITANTS
api.get('/sous-traitants', protect, async (req, res) => {
  try { ok(res, await prisma.sousTraitant.findMany({ where: { company_id: req.user.company_id, actif: true } })) }
  catch (e) { err(res, e.message) }
})

api.post('/sous-traitants', protect, async (req, res) => {
  try { ok(res, await prisma.sousTraitant.create({ data: { ...req.body, company_id: req.user.company_id } }), 201) }
  catch (e) { err(res, e.message) }
})

api.get('/contrats-st', protect, async (req, res) => {
  try { ok(res, await prisma.contratSousTraitance.findMany({ where: { company_id: req.user.company_id }, include: { sous_traitant: true, chantier: true, situations: true }, orderBy: { id: 'desc' } })) }
  catch (e) { err(res, e.message) }
})

api.post('/contrats-st', protect, async (req, res) => {
  try { ok(res, await prisma.contratSousTraitance.create({ data: { ...req.body, company_id: req.user.company_id } }), 201) }
  catch (e) { err(res, e.message) }
})

api.get('/contrats-st/:id/situations', protect, async (req, res) => {
  try { ok(res, await prisma.situationTravauxST.findMany({ where: { contrat_st_id: +req.params.id }, orderBy: { numero_situation: 'asc' } })) }
  catch (e) { err(res, e.message) }
})

api.post('/contrats-st/:id/situations', protect, async (req, res) => {
  try {
    const dernier = await prisma.situationTravauxST.findFirst({ where: { contrat_st_id: +req.params.id }, orderBy: { numero_situation: 'desc' } })
    const numero = (dernier?.numero_situation || 0) + 1
    const situPrecedente = dernier?.montant_cumule_ht || 0
    const montantPeriode = req.body.montant_cumule_ht - situPrecedente
    ok(res, await prisma.situationTravauxST.create({ data: { ...req.body, contrat_st_id: +req.params.id, numero_situation: numero, montant_periode_ht: montantPeriode, statut: 'SOUMISE' } }), 201)
  } catch (e) { err(res, e.message) }
})

// BUDGET CHANTIER
api.get('/budget-chantier/:chantier_id', protect, async (req, res) => {
  try { ok(res, await prisma.budgetChantier.findFirst({ where: { chantier_id: +req.params.chantier_id }, include: { lignes: true }, orderBy: { version: 'desc' } })) }
  catch (e) { err(res, e.message) }
})

api.post('/budget-chantier', protect, async (req, res) => {
  try {
    const { lignes, ...budgetData } = req.body
    const budget = await prisma.$transaction(async (tx) => {
      const b = await tx.budgetChantier.create({ data: { ...budgetData, created_by: req.user.id } })
      if (lignes?.length) await tx.ligneBudget.createMany({ data: lignes.map(l => ({ ...l, budget_id: b.id })) })
      return b
    })
    ok(res, budget, 201)
  } catch (e) { err(res, e.message) }
})

// REPORTING
api.get('/reporting/dashboard-stats', protect, async (req, res) => {
  try {
    const cid = req.user.company_id
    const now = new Date()
    const moisDebut = new Date(now.getFullYear(), now.getMonth(), 1)
    const [projets, chantiers, articles, facturesEchues, employes] = await Promise.all([
      prisma.project.findMany({ where: { company_id: cid, statut: { in: ['EN_COURS', 'ETUDE'] } } }),
      prisma.chantier.findMany({ where: { company_id: cid, statut: 'EN_COURS' } }),
      prisma.article.findMany({ where: { company_id: cid, actif: true } }),
      prisma.factureFournisseur.findMany({ where: { company_id: cid, statut_paiement: { in: ['EN_ATTENTE', 'PARTIELLEMENT_PAYE'] }, date_echeance: { lt: now } } }),
      prisma.employe.findMany({ where: { company_id: cid, actif: true, type_contrat: 'CDD', date_fin_contrat: { lte: new Date(now.getTime() + 30 * 86400000) } } })
    ])
    const articlesSousSeuil = articles.filter(a => a.stock_actuel < a.stock_minimum)
    const valeurStock = articles.reduce((s, a) => s + a.stock_actuel * a.prix_unitaire_moyen, 0)
    ok(res, {
      projets_actifs: projets.filter(p => p.statut === 'EN_COURS').length,
      chantiers_en_cours: chantiers.length,
      ca_encaisse_mois: 0,
      ca_cumule: 0,
      depenses_mois: 0,
      marge_pct: 0,
      creances_clients: 0,
      dettes_fournisseurs: facturesEchues.reduce((s, f) => s + f.montant_ttc, 0),
      valeur_stock: valeurStock,
      articles_sous_seuil: articlesSousSeuil.length,
      factures_echues: facturesEchues.length,
      contrats_cdd_expiration: employes.length,
    })
  } catch (e) { err(res, e.message) }
})

api.get('/reporting/compte-resultat', protect, async (req, res) => {
  try {
    const cid = req.user.company_id
    const [encaissements, achats, paie, depenses] = await Promise.all([
      prisma.encaissement.aggregate({ _sum: { montant: true }, where: { echeance: { contrat_vente: { company_id: cid } } } }),
      prisma.factureFournisseur.aggregate({ _sum: { montant_ht: true }, where: { company_id: cid, statut_paiement: 'PAYE' } }),
      prisma.bulletinPaie.aggregate({ _sum: { salaire_net: true }, where: { company_id: cid, statut: 'PAYE' } }),
      prisma.depenseDirecte.aggregate({ _sum: { montant_ht: true }, where: { company_id: cid } })
    ])
    const totalProduits = encaissements._sum.montant || 0
    const totalCharges = (achats._sum.montant_ht || 0) + (paie._sum.salaire_net || 0) + (depenses._sum.montant_ht || 0)
    ok(res, { produits: { encaissements: totalProduits }, charges: { achats: achats._sum.montant_ht || 0, paie: paie._sum.salaire_net || 0, depenses: depenses._sum.montant_ht || 0 }, resultat: totalProduits - totalCharges, marge_pct: totalProduits > 0 ? ((totalProduits - totalCharges) / totalProduits * 100).toFixed(1) : 0 })
  } catch (e) { err(res, e.message) }
})

// SETTINGS
api.get('/settings/company', protect, async (req, res) => {
  try { ok(res, await prisma.company.findUnique({ where: { id: req.user.company_id } })) }
  catch (e) { err(res, e.message) }
})

api.put('/settings/company', protect, async (req, res) => {
  try { ok(res, await prisma.company.update({ where: { id: req.user.company_id }, data: req.body })) }
  catch (e) { err(res, e.message) }
})

app.listen(PORT, () => console.log(`BTP Manager DZ — Port ${PORT}`))
