import jwt from 'jsonwebtoken'

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: "Non autorisé, pas de jeton" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: "Jeton non valide" })
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next()
  } else {
    res.status(403).json({ message: "Accès refusé: Administrateur requis" })
  }
}
