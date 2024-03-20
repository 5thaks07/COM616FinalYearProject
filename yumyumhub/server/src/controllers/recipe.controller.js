import { Recipe } from '../models/Recipe.js';
import mongoose from 'mongoose';

export const getRecipes = async (req, res) => {
  try {
    let recipes;
    const type = req.query.search;

    // if admin, return all Recipes
    if (type && res.locals.user.admin) {
      recipes = await Recipe.find({ type: type });
    }
    // if not admin, return all Recipes with type
    else if (type) {
      recipes = await Recipe.find({
        type: type,
      });
    }

    // if not admin, return all Recipes
    else {
      recipes = await Recipe.find();
    }

    // check if Recipes found
    if (!recipes) return res.status(500).json({ message: 'No Recipes found' });

    return res.json(recipes);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createRecipe = async (req, res) => {
  const userId = req.user._id;

  try {
    const {
      name,
      type,
      shortDescription,
      fullDescription,
      ingredients,
      servings,
      time,
    } = req.body;
    console.log(req.body);
    // Check if all required fields are provided
    if (
      !name ||
      !type ||
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
    console.log(req.files);
    // Check if images are uploaded
    if (!req.files) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

   // Get the images from the request
const images = req.files;
console.log(images);
// Move uploaded images to permanent location
const imageUrls = [];
Object.keys(images).forEach(async (key) => {
  const image = images[key];
  const fileName = `${name}_${Date.now()}_${key}.${image.name.split('.').pop()}`;
  await image.mv(`${process.env.PERMANENT_UPLOAD_DIR}/${fileName}`);
  imageUrls.push(`${process.env.BASE_URL}/uploadImages/${fileName}`);
});
console.log(imageUrls);
    // Create the recipe with image URLs
    const recipe = await Recipe.create({
      userId,
      name,
      type,
      shortDescription,
      fullDescription,
      ingredients,
      servings,
      time,
      images: imageUrls,
    });
   console.log(recipe);

    return res.status(201).json({
      message: 'Recipe created successfully',
      recipe,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateRecipe = async (req, res) => {
  const userId = req.user._id;
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
  const userId = req.user._id;
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
