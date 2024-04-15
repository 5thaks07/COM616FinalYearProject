import { Router } from 'express';
import passport from 'passport';
import * as MessageController from '../controllers/message.controller.js';

const router = Router();

router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  MessageController.createMessage
);
router.get('/get/:chatId', MessageController.getMessages);

export default router;
