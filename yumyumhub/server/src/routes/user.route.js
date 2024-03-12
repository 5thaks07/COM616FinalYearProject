import { Router } from 'express';
import {
  noAuthAPI,
  stdAuthAPI,
  adminAuthAPI,
} from '../middlewares/user.middleware.js';
import * as UserController from '../controllers/user.controller.js';

const router = Router();

router.post('/login', noAuthAPI, UserController.login);
router.post('/register', noAuthAPI, UserController.create);

router.get('/logout', stdAuthAPI, UserController.logout);

router.delete('/deleteUser', stdAuthAPI, UserController.deleteUser);

export default router;
