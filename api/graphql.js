import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from 'graphql-scalars';
import jwt from 'jsonwebtoken';
import http from 'http';
import bodyParser from 'body-parser';

import customTypDefs from './schema/schema.js';
import * as customResolvers from './resolvers/index.js';
import * as models from './models/index.js';

dotenv.config();

const URL = `mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@cluster0.g4vmoqk.mongodb.net/database?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 4000;

const getUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      new Error('Session invalid');
    }
  }
};

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.log(`DB connection error: ${err}`));

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs: [customTypDefs, scalarTypeDefs],
  resolvers: [customResolvers, scalarResolvers],
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
});

await server.start();

app.use(
  '/api/graphql',
  cors(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      {
        const token = req.headers.authorization;
        const user = getUser(token);
        return { models, user };
      }
    },
  })
);
await new Promise((res) => httpServer.listen({ port: PORT }, res));

console.log(`🚀 Server ready at http://localhost:${PORT}/api/graphql`);
