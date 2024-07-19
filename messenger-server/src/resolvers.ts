
import { currentNumber, pubsub } from "./index"
import { Resolvers } from "./types"

export const resolvers: Resolvers =  {
  Query: {
    hello: () => 'world',
    currentNumber: () => currentNumber,
  },
  Subscription: {
    numberIncremented: {
      subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']) as unknown as AsyncIterable<any>,
    }
  },
}