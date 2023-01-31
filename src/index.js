import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Note from './models/note.js';

dotenv.config();

const URL = `mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@cluster0.g4vmoqk.mongodb.net/database?retryWrites=true&w=majority`;

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.log(`DB connection error: ${err}`));

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

let notes = [
  { id: '1', content: 'This is a note', author: 'Adam Scott' },
  { id: '2', content: 'This is another note', author: 'Harlow Everly' },
  { id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison' },
];

const typeDefs = `#graphql
	type Note {
		id: ID!
		content: String!
		author: String!
	}
	type Query {
    hello: String!
		notes: [Note!]!
		note(id: ID!): Note!
  }
	type Mutation {
		newNote(content: String!): Note!
	}
`;

const resolvers = {
  Query: {
    hello: () => 'Hello friends!',
    notes: async () => await Note.find(),
    note: (parent, args) => {
      return notes.find((note) => note.id === args.id);
    },
  },
  Mutation: {
    newNote: async (parent, args) => {
      return await Note.create({
        content: args.content,
        author: 'Bob Dilan',
      });
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use('/graphql', expressMiddleware(server));

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/graphql`)
);
