const express = require('express');
const app = express();
const PORT = 3000;

// Middleware pour comprendre le JSON
app.use(express.json());

// Importer et utiliser les routes utilisateur
const utilisateurRoutes = require('./routes/users');
app.use('/api/users', userRoute);
// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
