import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { gql } from "graphql-tag";
import { PubSub } from 'graphql-subscriptions';
import { createServer } from 'http';
import { readFileSync } from "fs";
import path from "path";
import cors from 'cors';
import express from 'express';
import 'dotenv/config';

import { resolvers } from "./resolvers";

export const pubsub = new PubSub();

export let currentNumber = 0;

function incrementNumber() {
  currentNumber++;
  pubsub.publish('NUMBER_INCREMENTED', { numberIncremented: currentNumber });
  setTimeout(incrementNumber, 3000);
}

interface MyContext {
  token?: string;
}

// Converts GraphQL strings into the format that Apollo libraries expect
const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "./schema.graphql"), {
    encoding: "utf-8",
  })
);

/**
 * A main function that integrates with Express and Apollo Server to handle incoming requests,
 * create a WebSocket server, and set up Express middleware for CORS and body parsing.
 *
 * @return {Promise<void>} A promise that resolves when the server is started
 */
async function main(): Promise<void> {
  // Required logic for integrating with Express
  const app = express();

  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = createServer(app);

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use serves expressMiddleware at a different path
    path: '/',
  });


  // Create the schema, which will be used separately by ApolloServer & the WebSocket server.
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Hand in the schema we just created and have the WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  // Same ApolloServer initialization as before, plus the drain plugin for our httpServer.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() { await serverCleanup.dispose() },
          };
        },
      },
    ],
  });

  // Note you must call `start()` on the `ApolloServer` instance before passing the instance to `expressMiddleware`
  await server.start();

  // Set up our Express middleware to handle CORS, body parsing, & expressMiddleware function.
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

  const PORT = 4000;
  // Now that our HTTP server is fully set up, we can listen to it.
  httpServer.listen(PORT, () => {
    console.log(`
      🚀 Server is now running. 
      📭 Query at http://localhost:${PORT}/
      🔛 Subscription at ws://localhost:${PORT}/
    `);
  });

  incrementNumber();
}

main();
