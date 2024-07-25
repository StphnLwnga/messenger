import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import axios from 'axios';
import bcrypt from 'bcrypt';
import { CREATE_UPDATE_USER_WITH_ACCOUNT } from '@/graphql/mutations';
import { GET_USER } from '@/graphql/queries';
import { Session } from 'inspector';

const graphql_endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      /**
       * Asynchronously creates or updates a user account based on the provided profile and tokens.
       *
       * @param {Object} profile - The profile object containing user information.
       * @param {Object} tokens - The tokens object containing access token and other authentication details.
       * @return {Promise<Object>} A Promise that resolves to the user object if the account creation/update is successful.
       * @throws {Error} If the account creation/update is unsuccessful or if an error occurs during the process.
       */
      async profile(profile, tokens) {
        const { login, id, avatar_url, name, email } = profile;
        const { access_token, token_type, scope } = tokens;
        try {
          const res = await axios.post(graphql_endpoint, {
            query: CREATE_UPDATE_USER_WITH_ACCOUNT,
            variables: {
              createUpdateUserAccountInput: {
                type: "oauth",
                token_type,
                scope,
                providerAccountId: id.toString(),
                provider: "github",
                name: name ?? login,
                image: avatar_url,
                emailVerified: "",
                email,
                access_token
              },
            },
            headers: { 'Content-Type': 'application/json', }
          });
          // console.log(res.data)
          const { code, success, message, user } = res.data?.data?.createUpdateUserWithAccount;
          if (code === 400 || !success) throw new Error('Invalid credentials')
          return user;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      async profile(profile, tokens) {
        // console.log(profile, tokens)
        const { sub, email, picture, name } = profile;
        const { token_type, scope, expires_at, id_token } = tokens;
        try {
          const res = await axios.post(graphql_endpoint, {
            query: CREATE_UPDATE_USER_WITH_ACCOUNT,
            variables: {
              createUpdateUserAccountInput: {
                type: "oauth",
                token_type,
                scope,
                providerAccountId: sub,
                provider: "google",
                name,
                image: picture,
                emailVerified: "",
                email,
                id_token,
                expires_at,
              },
            },
            headers: { 'Content-Type': 'application/json', }
          });
          // console.log(res.data)
          const { code, success, message, user } = res.data?.data?.createUpdateUserWithAccount;
          if (code === 400 || !success) throw new Error('Invalid credentials')
          return user;
          // return {
          //   ...profile,
          //   id: profile.sub,
          // }
        } catch (error: any) {
          console.log(error);
          throw new Error(error.message);
        }
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      /**
       * A function that authorizes the user based on the provided credentials.
       *
       * @param {any} credentials - The user's credentials containing email and password.
       * @return {Promise} The user object upon successful authorization.
       */
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password)
            throw new Error('Email and password are required')

          const res = await axios.post(graphql_endpoint, {
            query: GET_USER,
            variables: {
              email: credentials?.email,
              password: credentials?.password,
            }
          }, {
            headers: { 'Content-Type': 'application/json', }
          });

          // console.log(res.data)

          if (res.data?.data?.getUser.code === 400) throw new Error('Invalid credentials')

          const { user } = res.data?.data?.getUser;
          return user;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.message);
        }
      }
    })
  ],
  // debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session: ({session, user}) => {
      // TODO: Add user ID to session to be extracted in UserBox component when creating a conversation
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }