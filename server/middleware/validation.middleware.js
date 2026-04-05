export const validateData = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error.errors) {
        const errorMessages = error.errors.map((err) => ({
          champ: err.path.join('.'),
          message: err.message
        }));
        return res.status(400).json({ 
          success: false, 
          message: "Erreur de validation des données", 
          errors: errorMessages 
        });
      }
      res.status(500).json({ success: false, message: "Erreur serveur inattendue" });
    }
  };
};
