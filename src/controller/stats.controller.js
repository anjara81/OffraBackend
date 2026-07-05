const statsService = require('../service/stats.service');

exports.getDashboard = async (req, res) => {
  try {
    const stats = await statsService.getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};

exports.getOffreStats = async (req, res) => {
  try {
    const stats = await statsService.getOffreStats(req.params.id);
    res.status(200).json(stats);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Erreur serveur" });
  }
};