import jwt from 'jsonwebtoken'
import prisma from '../db.js'

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Non autorisé, pas de jeton" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch fresh user data to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, company_id: true, nom: true, prenom: true, email: true, role: true, actif: true }
    });

    if (!user || !user.actif) {
      return res.status(401).json({ success: false, message: "Utilisateur non trouvé ou inactif" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Jeton non valide ou expiré" });
  }
};
