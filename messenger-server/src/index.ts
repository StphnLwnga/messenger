import { createServer } from 'http';
import { readFileSync } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { gql } from "graphql-tag";
import { Resolvers } from './types';
import { resolvers } from "./resolvers";

interface MyContext {
  token?: string;
}

// Converts GraphQL strings into the format that Apollo libraries expect
const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "./schema.graphql"), {
    encoding: "utf-8",
  })
);

async function main() {
  // Required logic for integrating with Express
  const app = express();

  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = createServer(app);

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // Note you must call `start()` on the `ApolloServer`
  // instance before passing the instance to `expressMiddleware`
  await server.start();

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    '/',
    cors<cors.CorsRequest>(),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      // context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  // Modified server startup
  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server running. 📭  Query at http://localhost:4000/`);
}

main();
