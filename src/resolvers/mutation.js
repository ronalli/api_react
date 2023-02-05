import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import gravater from '../util/gravatar.js';
import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';

import Note from '../models/note.js';
import User from '../models/user.js';

const Mutation = {
  newNote: async (parent, args, { models, user }) => {
    console.log(models, user);
    if (!user) throw new GraphQLError('You must be signed in to create a note');
    return await Note.create({
      content: args.content,
      author: 'Bob Dilan',
    });
  },
  deleteNote: async (parent, { id }, { models }) => {
    try {
      await Note.findByIdAndRemove({ _id: id });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  updateNote: async (parent, { content, id }, { models }) => {
    return await Note.findOneAndUpdate(
      { _id: id },
      { $set: { content } },
      { new: true }
    );
  },
  signUp: async (parent, { username, email, password }, { models }) => {
    email = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 7);
    const avatar = gravater(email);
    try {
      const user = await User.create({
        username,
        email,
        avatar,
        password: hashed,
      });
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (error) {
      console.log(error);
      throw new Error('Error creating account');
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) email = email.trim().toLowerCase();
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) throw new GraphQLError('Error signing in');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new GraphQLError('Error signing in');
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
};

export default Mutation;
