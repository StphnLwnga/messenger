import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import path from "path";
import { gql } from "graphql-tag";
import { resolvers } from "./resolvers";

// Converts GraphQL strings into the format that Apollo libraries expect
const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "./schema.graphql"), {
    encoding: "utf-8",
  })
);


/**
 * Creates an Apollo Server instance, starts the server, and logs the server URL.
 *
 * @return {Promise<void>} Promise that resolves when the server is ready.
 */
async function createApolloServer(): Promise<void> {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    context: async () => {
      // this object becomes our resolver's contextValue, the third positional argument
      const { cache } = server;

      return {
        dataSources: {},
      };
    },
    listen: { port: 4000 },
  });

  console.log(`
    🚀 Server is running!
    📭  Query at ${url}
  `);
}

createApolloServer();
