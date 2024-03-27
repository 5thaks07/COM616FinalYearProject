import { Recipe } from '../models/Recipe.js';
import { User } from '../models/User.js';
import mongoose from 'mongoose';
import fs from 'fs';

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

    // Check if images are uploaded
    if (!req.files) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    // Get the images from the request
    const images = req.files;

    // Create the recipe in the database
    const recipe = await Recipe.create({
      userId,
      name,
      type,
      shortDescription,
      fullDescription,
      ingredients,
      servings,
      time,
    });

    // Extract the generated recipe ID from the recipe object
    const { _id: recipeId } = recipe;

    // Move uploaded images to permanent location and generate image URLs
    const imageUrls = await Promise.all(
      Object.entries(images).map(async ([key, image]) => {
        const fileName = `${recipeId}_${key}.${image.name.split('.').pop()}`;
        await image.mv(`${process.env.PERMANENT_UPLOAD_DIR}/${fileName}`);
        return `${process.env.BASE_URL}/uploadImages/${fileName}`;
      })
    );

    // Update the recipe with image URLs
    await Recipe.findByIdAndUpdate(recipeId, { images: imageUrls });

    // Find the user who uploaded the recipe and add the recipe ID to the user's uploadedRecipes array
    await User.findByIdAndUpdate(userId, {
      $push: { uploadedRecipes: recipeId },
    });

    // Return the response with the created recipe
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

    const {
      name,
      type,
      shortDescription,
      fullDescription,
      ingredients,
      servings,
      time,
    } = req.body;

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

    // Check if images are uploaded
    if (!req.files) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    // Find the recipe and delete old images
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the user is the owner of the recipe
    if (recipe.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to update this recipe' });
    }

    // Delete old images
    const deleteImagePromises = recipe.images.map((image) => {
      const imageName = image.split('/').pop();
      return new Promise((resolve, reject) => {
        fs.unlink(`${process.env.PERMANENT_UPLOAD_DIR}/${imageName}`, (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
    await Promise.all(deleteImagePromises);

    // Get the new images from the request
    const images = req.files;

    // Move uploaded images to permanent location and generate image URLs
    const imageUrls = await Promise.all(
      Object.entries(images).map(async ([key, image]) => {
        const fileName = `${recipeId}_${key}.${image.name.split('.').pop()}`;
        await image.mv(`${process.env.PERMANENT_UPLOAD_DIR}/${fileName}`);
        return `${process.env.BASE_URL}/uploadImages/${fileName}`;
      })
    );

    // Update the recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { $set: { ...req.body, images: imageUrls } },
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

    // Delete the images from the server
    const deleteImagePromises = recipe.images.map((image) => {
      const imageName = image.split('/').pop();
      return new Promise((resolve, reject) => {
        fs.unlink(`${process.env.PERMANENT_UPLOAD_DIR}/${imageName}`, (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    await Promise.all(deleteImagePromises);

    // Find the user who uploaded the recipe and remove the recipe ID from the user's uploadedRecipes array
    await User.findByIdAndUpdate(userId, {}, { $pull: { uploadedRecipes: recipeId } });

    // Find all users who have saved the recipe and remove the recipe ID from their savedRecipes array
    await User.updateMany({}, { $pull: { savedRecipes: recipeId } });

    // Delete the recipe
    await Recipe.findByIdAndDelete(recipeId);

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

export const likeRecipe = async (req, res) => {
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

    // Check if the user has already liked the recipe
    if (recipe.likedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'You have already liked this recipe' });
    }

    // Add the user ID to the likedBy array
    recipe.likedBy.push(userId);

    // Increment the likes count
    recipe.likes += 1;

    // Save the updated recipe
    await recipe.save();

    return res.status(200).json({
      message: 'Recipe liked successfully',
      recipe,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRecipeDetailById = async (req, res) => {
  const recipeId = req.params.id;

  try {
    // Check if recipe ID is valid
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: 'Invalid recipe ID' });
    }

    // Find the recipe by ID
    const recipe = await Recipe.findById(recipeId);

    // Check if the recipe exists
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Find the user who uploaded the recipe
    const user = await User.findById(recipe.userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back the user and recipe information
    return res.json({ user, recipe });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const saveRecipe = async (req, res) => {
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

    // Check if the user has already saved the recipe
    if (req.user.savedRecipes.includes(recipeId)) {
      return res
        .status(400)
        .json({ message: 'You have already saved this recipe' });
    }

    // Add the recipe ID to the user's savedRecipes array
    req.user.savedRecipes.push(recipeId);

    // Save the updated user
    await req.user.save();

    return res.status(200).json({
      message: 'Recipe saved successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const getRecipesForUser = async (req, res) => {
  try {
    let recipes;
    const userId = req.user._id;

    recipes = await Recipe.find({ userId: userId });

    // check if Recipes found
    if (!recipes) return res.status(500).json({ message: 'No Recipes found' });

    return res.json(recipes);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
