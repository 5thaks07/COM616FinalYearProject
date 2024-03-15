import { Router } from 'express';

import * as RecipeController from '../controllers/recipe.controller.js';

const router = Router();

router.get('/list', RecipeController.getRecipes);
router.post('/create', RecipeController.createRecipe);
router.put('/update/:id', RecipeController.updateRecipe);
router.delete('/delete/:id', RecipeController.deleteRecipe);

export default router;
