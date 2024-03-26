import { User } from '../models/User.js';
import { Recipe } from '../models/Recipe.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const getUser = async (req, res) => {
  try {
    // Get the user ID from the request parameters and if there is no ID in the request parameters, get the user ID from the request user object
    let userId = req.params.id;
    if (!userId) {
      userId = req.user._id;
    }

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
    // count the number of recipes saved by the user
    const savedRecipesCount = user.savedRecipes.length;

    // Send back the found user
    return res.json({
      name: user.name,
      email: user.email,
      uploadedRecipesCount: uploadedRecipesCount,
      savedRecipesCount: savedRecipesCount,
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

    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user
    const user = await User.findById(decoded.id);

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
  const user = req.user;
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
        await User.findByIdAndDelete(id);
        return res.status(200).json({
          message: 'User Deleted successfully',
        });
      }
    }

    // only allow users to delete their own account
    await User.findByIdAndDelete(user._id);

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
    const savedRecipes = user.savedRecipes || [];
    console.log(savedRecipes);

    // Use Promise.all to wait for all Recipe.findById calls to finish
    const recipes = await Promise.all(
      savedRecipes.map(async (recipeId) => {
        return await Recipe.findById(recipeId);
      })
    );

    // Send back the saved recipes
    return res.json({ savedRecipes: recipes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the password field is not blank
    if (!password) {
      return res.status(400).json({ message: 'Password cannot be blank' });
    }

    let user = req.user;

    // update the user's details
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();

    // Calculate uploaded recipes count and saved recipes count
    const uploadedRecipesCount = user.uploadedRecipes.length;
    const savedRecipesCount = user.savedRecipes.length;

    return res.status(200).json({
      name: user.name,
      email: user.email,
      uploadedRecipesCount: uploadedRecipesCount,
      savedRecipesCount: savedRecipesCount,
      updated: true,
      message: 'User Details Updated successfully',
      redirect: '/',
    });
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
