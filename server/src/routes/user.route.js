import { Router } from 'express';
import passport from 'passport';

import * as UserController from '../controllers/user.controller.js';

const router = Router();

router.post('/login', UserController.login);
router.post('/register', UserController.create);

// route for getting user profile by id
router.get('/profile/:id', UserController.getUser);

// route for getting user profile by token
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  UserController.getUser
);

router.get(
  '/savedrecipes',
  passport.authenticate('jwt', { session: false }),
  UserController.getSavedRecipes
);

router.get(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  UserController.logout
);

router.delete(
  '/delete',
  passport.authenticate('jwt', { session: false }),
  UserController.deleteUser
);
// route for updating user profile
router.put(
  '/update',
  passport.authenticate('jwt', { session: false }),
  UserController.updateUser
);
// route for removing a saved recipe
router.delete(
  '/savedrecipes/:id',
  passport.authenticate('jwt', { session: false }),
  UserController.removeSavedRecipe
);  
export default router;
