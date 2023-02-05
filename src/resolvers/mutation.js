import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import gravater from '../util/gravatar.js';
import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';

const Mutation = {
  newNote: async (parent, args, { models, user }) => {
    if (!user) throw new GraphQLError('You must be signed in to create a note');
    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id),
    });
  },
  deleteNote: async (parent, { id }, { models, user }) => {
    if (!user) throw new GraphQLError('You must be signed in to create a note');
    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id)
      throw new GraphQLError("You don't have permissions to delete the note");
    try {
      await note.remove();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  updateNote: async (parent, { content, id }, { models, user }) => {
    if (!user) throw new GraphQLError('You must be signed in to update a note');
    const note = await models.Note.findById(id);
    if (note && String(note.author) !== user.id)
      throw new GraphQLError("You don't have permissions to update the note");
    return await models.Note.findOneAndUpdate(
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
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed,
      });
      console.log(user);
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (error) {
      console.log(error);
      throw new Error('Error creating account');
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) email = email.trim().toLowerCase();
    const user = await models.User.findOne({ $or: [{ email }, { username }] });
    if (!user) throw new GraphQLError('Error signing in');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new GraphQLError('Error signing in');
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
};

export default Mutation;
