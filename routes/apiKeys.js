// routes/users.js

import express from 'express';
import {
  createApiKey,
  //getApiKeyByuuid,
//   updateUser,
//   deleteUser
} from '../controllers/apiKeyController.js'; // N'oublie pas le .js !

const router = express.Router();

//router.get('/', getUsers);
router.post('/', createApiKey);
//router.get('/UserProfile/:email', getUserByEmail);
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);

export default router;
