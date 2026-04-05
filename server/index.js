import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { z } from 'zod'
import { login } from './controllers/authController.js'
import { protect } from './middleware/auth.middleware.js'
import { validateData } from './middleware/validation.middleware.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

// --- SANITY CHECK ---
app.get('/health', (req, res) => res.json({ status: 'OK', message: 'BTP Manager DZ Server running' }))

// --- VALIDATORS ---
const loginSchema = z.object({
  email: z.string().email("L'adresse email est invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères")
})

// --- API ROUTES v1 ---
const apiRouter = express.Router()

// AUTHENTIFICATION
apiRouter.post('/auth/login', validateData(loginSchema), login)
apiRouter.get('/auth/me', protect, (req, res) => res.json({ success: true, data: { user: req.user } }))

app.use('/api/v1', apiRouter)

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: "Une erreur interne s'est produite" })
})

app.listen(PORT, () => console.log(`Serveur BTP Manager DZ lancé sur le port ${PORT}`))
