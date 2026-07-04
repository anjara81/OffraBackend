const offreService = require('../service/offre.service');

exports.getAll = async (req, res) => {
  try {
    const offres = await offreService.getAll(req.query);
    res.status(200).json(offres);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.getById = async (req, res) => {
  try {
    const offre = await offreService.getById(req.params.id);
    res.status(200).json(offre);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.create = async (req, res) => {
  try {
    const offre = await offreService.create(req.body);
    res.status(201).json({ message: "Offre créée avec succès", offre });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.update = async (req, res) => {
  try {
    const offre = await offreService.update(req.params.id, req.body);
    res.status(200).json({ message: "Offre mise à jour avec succès", offre });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await offreService.delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};