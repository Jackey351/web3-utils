import { ApolloClient, ApolloLink, InMemoryCache, Observable } from '@apollo/client';
import { ComposeClient } from '@composedb/client';
import { initComposeClient } from './compose-client';

export async function initApolloClient() {
  // Create custom ApolloLink using ComposeClient instance to execute operations
  const compose = await initComposeClient();
  const link = new ApolloLink((operation) => {
    return new Observable((observer) => {
      compose.execute(operation.query, operation.variables).then(
        (result) => {
          observer.next(result);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        },
      );
    });
  });

  // Use ApolloLink instance in ApolloClient config
  const client = new ApolloClient({ cache: new InMemoryCache(), link });
  return client;
}
