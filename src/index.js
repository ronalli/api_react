import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import customTypDefs from './schema/schema.js';
import * as customResolvers from './resolvers/index.js';
import * as models from './models/note.js';
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from 'graphql-scalars';

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

const server = new ApolloServer({
  typeDefs: [customTypDefs, scalarTypeDefs],
  resolvers: [customResolvers, scalarResolvers],
  context: async () => {
    {
      models;
    }
  },
});
await server.start();

app.use('/graphql', expressMiddleware(server));

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/graphql`)
);
