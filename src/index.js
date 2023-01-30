import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello friends!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use('/graphql', expressMiddleware(server));


app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
