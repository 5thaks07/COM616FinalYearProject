import { User } from '../models/User.js';
import { Recipe } from '../models/Recipe.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // count the number of recipes uploaded by the user
    const uploadedRecipesCount = user.uploadedRecipes.length;

    // Send back the found user
    return res.json({
      name: user.name,
      email: user.email,
      uploadedRecipesCount: uploadedRecipesCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const login = async (req, res) => {
  try {
    // check if all fields are provided
    if (!req.body.email || !req.body.password)
      return res.status(400).json({ message: 'Email and password required' });
    const email = req.body.email.toLowerCase();
    // check if user exists
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    // check if password matches
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password' });

    // generate auth token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    console.log("Generated Token:", token);

    // return token to client
    return res.status(200).json({
      message: 'Login successful',
      token,
      redirect: '/',
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const create = async (req, res) => {
  try {
    // check if all fields are provided
    if (!req.body.name || !req.body.email || !req.body.password)
      return res
        .status(400)
        .json({ message: 'Name, email and password required' });
    const email = req.body.email.toLowerCase();
    // check if user exists
    const existing = await User.findOne({ email: email });
    if (existing)
      return res.status(401).json({
        message: 'A user with this email already exists',
        redirect: '/login',
      });

    // create user
    const user = await User.create({
      name: req.body.name,
      email: email,
      password: await bcrypt.hash(req.body.password, 10),
    });

    // generate auth token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // return token to client
    return res.status(201).json({
      message: 'User created successfully',
      token,
      redirect: '/',
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: 'Internal server error',
    });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    console.log("Token:", token);

    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);
    console.log(decoded.id);

    // find user
    const user = await User.findById(decoded.id);
    console.log(user);

    // return success message
    return res.status(200).json({
      message: 'Logout successful',
      redirect: '/login',
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: 'Internal server error',
    });
  }
};

export const deleteUser = async (req, res) => {
  const user = res.locals.user;
  const id = req.query.id;
  try {
    if (id) {
      // check if user is admin
      if (!user.admin) {
        return res.status(404).send({
          message: `not found.`,
        });
      }
      // check if id is valid
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'Invalid ID' });
      // check if user is admin
      const founduser = await User.findById(id);
      if (founduser.admin) {
        return res.status(403).send({
          message: `cannot delete an admin user.`,
        });
      } else {
        await User.findByIdAndRemove(id);
        return res.status(200).json({
          message: 'User Deleted successfully',
        });
      }
    }
    // only allow users to delete their own account

    await User.findByIdAndRemove(user._id);

    return res.status(200).json({
      message: 'User Deleted successfully',
      redirect: '/login',
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: `could not delete user ${id}.`,
    });
  }
};

export const getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log(userId);
    // Check if the user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the saved recipes
    const savedRecipes = user.savedRecipes;
    // lpop through the saved recipes and find the recipe and send it back to the client
    savedRecipes.forEach(async (recipeId, index) => {
      const recipe = await Recipe.findById(recipeId);
      savedRecipes[index] = recipe;
    });

    // Send back the saved recipes
    return res.json({ savedRecipes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
