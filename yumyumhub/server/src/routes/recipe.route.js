import { Router } from 'express';

import * as RecipeController from '../controllers/recipe.controller.js';
import passport from 'passport';

const router = Router();

router.get('/list', RecipeController.getRecipes);
router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  RecipeController.createRecipe
);
router.put(
  '/update/:id',
  passport.authenticate('jwt', { session: false }),
  RecipeController.updateRecipe
);
router.delete(
  '/delete/:id',
  passport.authenticate('jwt', { session: false }),
  RecipeController.deleteRecipe
);
router.put('/like/:id', passport.authenticate('jwt', { session: false }), RecipeController.likeRecipe);
export default router;
