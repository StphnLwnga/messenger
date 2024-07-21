import { pubsub } from "./index"
import { Resolvers, User } from "./types"
import prismaClient from "./lib/prismadb"
import bcrypt from 'bcrypt';

export const resolvers: Resolvers = {
  Query: {
    getUser: async (_, { email, password }, context) => {
      try {
        const userData = await prismaClient.user.findUnique({
          where: {
            email
          },
        });

        console.log(userData)

        if (!userData) throw new Error('User not found');

        const emailVerified = userData.emailVerified
          ? userData.emailVerified.toISOString()
          : '';

        const isCorrectPassword = await bcrypt.compare(
          password,
          userData.hashedPassword
        );

        if (!isCorrectPassword) throw new Error('Password is incorrect');

        return {
          code: 200,
          success: true,
          message: `User details successfully retrieved`,
          user: {
            ...userData,
            emailVerified,
          }
        }
      } catch (error) {
        console.log(error);
        return {
          code: 400,
          success: false,
          message: error.message,
        }
      }
    }
  },

  Mutation: {
    createUser: async (_, { createUserInput }, context) => {
      const { name, email, password } = createUserInput;
      try {
        if (!name || !email || !password) throw new Error('Required details missing.')

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = await prismaClient.user.create({
          data: {
            name,
            email,
            hashedPassword
          },
        });

        console.log(userData)

        return {
          code: 200,
          success: true,
          message: 'User created successfully',
          user: {
            ...userData,
            createdAt: userData.createdAt.toISOString(),
            updatedAt: userData.updatedAt.toISOString(),
          } as unknown as User
        }
      } catch (error) {
        console.log(error);
        return {
          code: 400,
          success: false,
          message: error.message,
        }
      }
    }
  },

  // Subscription: {
  //   numberIncremented: {
  //     subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']) as unknown as AsyncIterable<any>,
  //   }
  // },
}