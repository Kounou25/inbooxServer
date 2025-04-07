// routes/users.js

import express from 'express';
import {
  createMessage,

} from '../controllers/messagesController.js'; 

const router = express.Router();

// router.get('/', getOtp);
router.post('/', createMessage);


export default router;
