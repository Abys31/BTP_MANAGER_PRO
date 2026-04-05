import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../db.js'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: {
          select: { nom: true, logo_url: true }
        }
      }
    });

    if (!user || (!await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ success: false, message: "Identifiants invalides" });
    }

    if (!user.actif) {
      return res.status(403).json({ success: false, message: "Compte désactivé, veuillez contacter l'administrateur" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, company_id: user.company_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Audit log
    await prisma.auditLog.create({
      data: {
        company_id: user.company_id,
        user_id: user.id,
        action: 'LOGIN',
        entity_type: 'USER',
        entity_id: user.id,
        ip_address: req.ip
      }
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
          company: user.company.nom
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
