import { Router } from 'express';
import passport from 'passport';
import * as ChatController from '../controllers/chat.controller.js';

const router = Router();

router.post(
  '/create/:secondUserId',
  passport.authenticate('jwt', { session: false }),
  ChatController.createChat
);
router.get('/find/:userId', ChatController.findUserChats);
router.get('/find/:firstUserId/:secondUserId', ChatController.findChat);

export default router;
