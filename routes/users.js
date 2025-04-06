// routes/users.js

import express from 'express';
import {
  getUsers,
  createUser,
  getUserByEmail,
//   updateUser,
//   deleteUser
} from '../controllers/usersController.js'; // N'oublie pas le .js !

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/UserProfile/:email', getUserByEmail);
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);

export default router;
