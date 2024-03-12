import { Recipe } from '../models/Recipe.js';
import mongoose from 'mongoose';

export const createRecipe = async (req, res) => {
  const userId = res.locals.user._id;

  try {
    const {
      name,
      shortDescription,
      fullDescription,
      ingredients,
      servings,
      time,
      images,
    } = req.body;

    // Check if all required fields are provided
    if (
      !name ||
      !shortDescription ||
      !fullDescription ||
      !ingredients ||
      !servings ||
      !time
    ) {
      return res
        .status(400)
        .json({ message: 'All required fields must be provided' });
    }

    // Create the recipe
    const recipe = await Recipe.create({
      userId,
      name,
      shortDescription,
      fullDescription,
      ingredients,
      servings,
      time,
      images,
    });

    return res.status(201).json({
      message: 'Recipe created successfully',
      recipe,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const updateRecipe = async (req, res) => {
  const userId = res.locals.user._id;
  const recipeId = req.params.id;

  try {
    // Check if recipe ID is valid
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: 'Invalid recipe ID' });
    }

    // Find the recipe
    const recipe = await Recipe.findById(recipeId);

    // Check if the recipe exists
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the user is the owner of the recipe
    if (recipe.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to update this recipe' });
    }

    // Update the recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { $set: req.body },
      { new: true }
    );

    return res.status(200).json({
      message: 'Recipe updated successfully',
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const deleteRecipe = async (req, res) => {
  const userId = res.locals.user._id;
  const recipeId = req.params.id;

  try {
    // Check if recipe ID is valid
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: 'Invalid recipe ID' });
    }

    // Find the recipe
    const recipe = await Recipe.findById(recipeId);

    // Check if the recipe exists
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the user is the owner of the recipe
    if (recipe.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to delete this recipe' });
    }

    // Delete the recipe
    await Recipe.findByIdAndRemove(recipeId);

    return res.status(200).json({
      message: 'Recipe deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
