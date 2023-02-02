import Note from '../models/note.js';

const Mutation = {
  newNote: async (parent, args, { models }) => {
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
};

export default Mutation;
