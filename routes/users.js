
const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/usersController');

// Associer chaque route à sa fonction
router.get('/', getUsers);            // Lire tous les utilisateurs
router.post('/', createUser);          // Ajouter un utilisateur
router.put('/:id', updateUser);  // Modifier un utilisateur
router.delete('/:id', deleteUser); // Supprimer un utilisateur

module.exports = router;
