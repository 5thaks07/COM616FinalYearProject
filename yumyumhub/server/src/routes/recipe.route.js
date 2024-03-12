import { Router } from 'express';
import { stdAuthAPI } from '../middlewares/user.middleware.js';
import * as RecipeController from '../controllers/recipe.controller.js';

const router = Router();

router.post('/create', stdAuthAPI, RecipeController.createRecipe);
router.put('/update/:id', stdAuthAPI, RecipeController.updateRecipe);
router.delete('/delete/:id', stdAuthAPI, RecipeController.deleteRecipe);

export default router;
