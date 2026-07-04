const candidatService = require('../service/candidat.service');

exports.getAll = async (req, res) => {
  try {
    const candidats = await candidatService.getAll();
    res.status(200).json(candidats);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.getById = async (req, res) => {
  try {
    const candidat = await candidatService.getById(req.params.id);
    res.status(200).json(candidat);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.create = async (req, res) => {
  try {
    const candidat = await candidatService.create(req.body);
    res.status(201).json({ message: "Candidat créé avec succès", candidat });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.update = async (req, res) => {
  try {
    const candidat = await candidatService.update(req.params.id, req.body);
    res.status(200).json({ message: "Candidat mis à jour avec succès", candidat });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await candidatService.delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};