export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Non authentifié" });
    }

    if (req.user.role === 'SUPER_ADMIN' || allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ success: false, message: "Accès refusé: privilèges insuffisants" });
    }
  };
};
