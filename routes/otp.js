// routes/users.js

import express from 'express';
import {
  //getOtp,
  createOtp,
  verifyOtp,
//   updateOtp,
//   deleteOtp
} from '../controllers/otpController.js'; 

const router = express.Router();

// router.get('/', getOtp);
router.post('/', createOtp);
router.post('/verifyOtp', verifyOtp);
// router.put('/:id', updateOtp);
// router.delete('/:id', deleteOtp);

export default router;
