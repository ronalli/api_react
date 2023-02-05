// import { DateTimeTypeDefinition } from 'graphql-scalars';
// import BuildSc
// console.log(DateTimeResolver);

const typeDefs = `#graphql
scalar DateTime

	type Note {
		id: ID!
		content: String!
		author: User!
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	type User {
		id: ID!
		username: String!
		email: String!
		avatar: String
		notes: [Note!]!
	}

	type Query {
    hello: String!
		notes: [Note!]!
		note(id: ID!): Note!
  }
	
	type Mutation {
		newNote(content: String!): Note!
		updateNote(id: ID!, content: String!): Note!
		deleteNote(id: ID!): Boolean!
		signUp(username: String!, email: String!, password: String!): String!
		signIn(username: String, email: String, password: String!): String!
	}
`;

export default typeDefs;
