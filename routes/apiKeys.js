// routes/users.js

import express from 'express';
import {
  createApiKey,
  //getApiKeyByuuid,
  getApiKeys,
//   deleteUser
} from '../controllers/apiKeyController.js'; // N'oublie pas le .js !

const router = express.Router();

router.get('/', getApiKeys);
router.post('/', createApiKey);
//router.get('/UserProfile/:email', getUserByEmail);
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);

export default router;
