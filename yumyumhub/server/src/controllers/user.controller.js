import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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
    // Set the auth token as a cookie
    res.cookie('token', token);
    // save token to user document
    user.token = token;
    await user.save();

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
    // Set the auth token as a cookie
    res.cookie('token', token);

    // save token to user document
    user.token = token;
    await user.save();

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

    // remove token
    user.token = '';
    res.clearCookie('token');
    await user.save();

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
    user.token = '';
    res.clearCookie('token');
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
