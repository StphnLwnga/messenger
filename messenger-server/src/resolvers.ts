import { pubsub } from "./index"
import { Resolvers, User } from "./types"
import prismaClient from "./lib/prismadb"
import bcrypt from 'bcrypt';

export const resolvers: Resolvers = {
  Query: {
    getUsersExcludingSelf: async (_, { email }) => {
      try {
        const users = await prismaClient.user.findMany({
          where: {
            email: {
              not: email
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        return users.map(user => {
          delete user.hashedPassword;
          return {
            ...user,
            emailVerified: user.emailVerified?.toISOString(),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          }
        });
      } catch (error) {
        console.log(error);
        return [];
      }
    },

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
            createdAt: userData.createdAt.toISOString(),
            updatedAt: userData.updatedAt.toISOString(),
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
    },

    getUserForSession: async (_, { email }, context) => {
      try {
        const userData = await prismaClient.user.findUnique({
          where: {
            email
          },
        });

        if (!userData) throw new Error('User not found');

        const emailVerified = userData.emailVerified
          ? userData.emailVerified.toISOString()
          : '';

        return {
          code: 200,
          success: true,
          message: `User details successfully retrieved`,
          user: {
            ...userData,
            emailVerified,
            createdAt: userData.createdAt.toISOString(),
            updatedAt: userData.updatedAt.toISOString(),
          },
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

    createConversation: async (_, { createConversationInput }, context) => {
      try {
        const { isGroup, members, name, currentUserId } = createConversationInput;

        if (isGroup && (!name || !members || members.length < 2)) throw new Error('Cannot create group conversation with less than 2 members & a group name.');
        // if (!isGroup && (!otherUserId || !messages || messages.length < 1)) throw new Error('Cannot create conversation with less than 1 message.');

        /** For group chat conversation with more than 2 members always create a new conversation */
        if (isGroup) {
          const newConversation = await prismaClient.conversation.create({
            data: {
              name,
              isGroup,
              users: {
                connect: [
                  { id: currentUserId },
                  ...members.map((member) => ({ id: member, })),
                ],
              },
            },
            include: {
              users: true,
            }
          });

          return {
            code: 200,
            success: true,
            message: 'Conversation created successfully',
            conversation: {
              ...newConversation,
              lastMessageAt: newConversation.lastMessageAt.toISOString(),
              createdAt: newConversation.createdAt.toISOString(),
              updatedAt: newConversation.updatedAt.toISOString(),
              users: newConversation.users.map((user) => ({
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
                emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
              }))
            }
          }
        }

        /** Handle single conversation between two users */
        const existingConversations = await prismaClient.conversation.findMany({
          where: {
            OR: [
              {
                userIds: {
                  equals: [currentUserId, members[0]],
                },
              },
              {
                userIds: {
                  equals: [members[0], currentUserId],
                },
              },
            ],
          },
        });

        const singleConversation = existingConversations[0]

        if (singleConversation) return {
          code: 200,
          success: true,
          message: 'Conversation created successfully',
          conversation: {
            ...singleConversation,
            lastMessageAt: singleConversation.lastMessageAt.toISOString(),
            createdAt: singleConversation.createdAt.toISOString(),
            updatedAt: singleConversation.updatedAt.toISOString(),
          }
        }

        const newSingleConversation = await prismaClient.conversation.create({
          data: {
            users: {
              connect: [
                { id: currentUserId },
                ...members.map((member) => ({ id: member, })),
              ],
            },
          },
          include: {
            users: true,
          }
        });

        return {
          code: 200,
          success: true,
          message: 'Conversation created successfully',
          conversation: {
            ...newSingleConversation,
            lastMessageAt: newSingleConversation.lastMessageAt.toISOString(),
            createdAt: newSingleConversation.createdAt.toISOString(),
            updatedAt: newSingleConversation.updatedAt.toISOString(),
            users: newSingleConversation.users.map((user) => ({
              ...user,
              createdAt: user.createdAt.toISOString(),
              updatedAt: user.updatedAt.toISOString(),
              emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
            }))
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

  // Subscription: {
  //   numberIncremented: {
  //     subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']) as unknown as AsyncIterable<any>,
  //   }
  // },
}