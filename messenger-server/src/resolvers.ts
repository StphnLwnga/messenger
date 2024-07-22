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
        // console.log(userData)
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
    createUserFromCredentials: async (_, { createUserInput }, context) => {
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
    },

    /**
     * A function to create or update a user account with the provided input data.
     *
     * @param {Object} createUpdateUserAccountInput - The input data for creating or updating a user account.
     * @return {Object} An object containing the result of the user creation/update process.
     */
    createUpdateUserWithAccount: async (_, { createUpdateUserAccountInput }, context) => {
      const {
        name, email, emailVerified, image, provider, providerAccountId,
        type, access_token, token_type, scope, expires_at, id_token,
      } = createUpdateUserAccountInput;
      try {
        if (!name || !email || !provider || !providerAccountId || !type) 
          throw new Error('Required details missing.');

        const userData = await prismaClient.user.upsert({
          where: {
            email
          },
          update: {
            accounts: {
              update: {
                where: {
                  provider_providerAccountId: {
                    provider,
                    providerAccountId
                  }
                },
                data: {
                  access_token, id_token, expires_at,
                },
              },
            },
          },
          create: {
            email,
            name,
            image,
            accounts: {
              create: {
                provider,
                providerAccountId,
                type,
                access_token,
                token_type,
                scope,
                id_token,
                expires_at,
              },
            },
          },
          include: {
            accounts: true
          }
        });
        // console.log(userData)
        return {
          code: 200,
          success: true,
          message: 'User created / updated successfully',
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
    },
  },

  // Subscription: {
  //   numberIncremented: {
  //     subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']) as unknown as AsyncIterable<any>,
  //   }
  // },
}