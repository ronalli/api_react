import Note from '../models/note.js';

const Mutation = {
  newNote: async (parent, args, { models }) => {
    return await Note.create({
      content: args.content,
      author: 'Bob Dilan',
    });
  },
};

export default Mutation;
