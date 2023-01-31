import Note from '../models/note.js';

const Query = {
  notes: async (parent, args, { models }) => await Note.find(),
  note: async (parent, args, { models }) => {
    return await Note.findById(args.id);
  },
};

export default Query;
