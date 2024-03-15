import { Router } from 'express';

import * as UserController from '../controllers/user.controller.js';

const router = Router();

router.post('/login', UserController.login);
router.post('/register', UserController.create);

router.get(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  UserController.logout
);

router.delete(
  '/deleteUser',
  passport.authenticate('jwt', { session: false }),
  UserController.deleteUser
);

export default router;
