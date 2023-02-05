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
		favoriteCount: Int!
		favoritedBy: [Note!]!
	}

	type User {
		id: ID!
		username: String!
		email: String!
		avatar: String!
		notes: [Note!]!
		favorites: [Note!]!
	}

	type Query {
		notes: [Note!]!
		note(id: ID!): Note!
		user(username: String!): User
		users: [User!]!
		me: User!
  }
	
	type Mutation {
		newNote(content: String!): Note!
		updateNote(id: ID!, content: String!): Note!
		deleteNote(id: ID!): Boolean!
		signUp(username: String!, email: String!, password: String!): String!
		signIn(username: String, email: String, password: String!): String!
		toggleFavorite(id: ID!): Note!
	}
`;

export default typeDefs;
