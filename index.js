import express from 'express';
const app = express();
const PORT = 3000;

// Middleware pour comprendre le JSON
app.use(express.json());

// Importer et utiliser les routes utilisateur
import usersRoutes from './routes/users.js';
app.use('/api/users', usersRoutes);


// Importer et utiliser les routes otps
import otpRoutes from './routes/otp.js';
app.use('/api/otp', otpRoutes);
// Démarrage du serveur 
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
