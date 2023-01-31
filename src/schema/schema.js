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

export default typeDefs;
