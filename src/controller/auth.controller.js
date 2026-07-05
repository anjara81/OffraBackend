const authService = require('../service/auth.service');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.status(200).json({
      message: "Connexion réussie",
      ...result
    });

  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.register = async (req, res) => {
  try {
    const { nom, email, password } = req.body;
    const admin = await authService.register(nom, email, password);

    res.status(201).json({
      message: "Admin créé avec succès",
      admin
    });

  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const admin = await authService.getProfile(req.admin.id);
    res.status(200).json(admin);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const admin = await authService.updateProfile(req.admin.id, req.body);
    res.status(200).json({ message: "Profil mis à jour avec succès", admin });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.admin.id, currentPassword, newPassword);
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};