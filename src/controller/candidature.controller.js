const candidatureService = require('../service/candidature.service');

exports.getAll = async (req, res) => {
  try {
    const candidatures = await candidatureService.getAll(req.query);
    res.status(200).json(candidatures);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.getById = async (req, res) => {
  try {
    const candidature = await candidatureService.getById(req.params.id);
    res.status(200).json(candidature);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.create = async (req, res) => {
  try {
    const candidature = await candidatureService.create(req.body, req.file);
    res.status(201).json({ message: "Candidature envoyée avec succès", candidature });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.updateStatut = async (req, res) => {
  try {
    const candidature = await candidatureService.updateStatut(req.params.id, req.body.statut);
    res.status(200).json({ message: "Statut mis à jour avec succès", candidature });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await candidatureService.delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};