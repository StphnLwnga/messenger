"use client"

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';

const graphql_endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!

const client = new ApolloClient({
  uri: graphql_endpoint,
  cache: new InMemoryCache(),
});

// const client = new ApolloClient({
//   ssrMode: true,
//   link: createHttpLink({
//     uri: graphql_endpoint,
//   }),
//   cache: new InMemoryCache(),
// });

export function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}