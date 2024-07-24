import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

/** User's account(s) */
export type Account = {
  __typename?: 'Account';
  /** Account access token */
  access_token?: Maybe<Scalars['String']['output']>;
  /** Token expiration */
  expires_at?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  /** ID token */
  id_token?: Maybe<Scalars['String']['output']>;
  /** Account provider e.g. Google, Github etc. */
  provider: Scalars['String']['output'];
  /** Account provider ID */
  providerAccountId: Scalars['String']['output'];
  /** Account refresh token */
  refresh_token?: Maybe<Scalars['String']['output']>;
  /** Token scope */
  scope?: Maybe<Scalars['String']['output']>;
  /** Session state */
  session_state?: Maybe<Scalars['String']['output']>;
  /** Token type */
  token_type?: Maybe<Scalars['String']['output']>;
  /** Account type */
  type: Scalars['String']['output'];
  /** Account user */
  user?: Maybe<User>;
};

/** User's conversations */
export type Conversation = {
  __typename?: 'Conversation';
  /** Conversation created at */
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** Is the conversation a group */
  isGroup?: Maybe<Scalars['Boolean']['output']>;
  /** Last message in conversation was sent at */
  lastMessageAt?: Maybe<Scalars['String']['output']>;
  /** Conversation messages */
  messages?: Maybe<Array<Maybe<Message>>>;
  /** Conversation name */
  name?: Maybe<Scalars['String']['output']>;
  /** Conversation updated at */
  updatedAt?: Maybe<Scalars['String']['output']>;
  /** Conversation users */
  users?: Maybe<Array<Maybe<User>>>;
};

/** User's messages */
export type Message = {
  __typename?: 'Message';
  /** Message body */
  body?: Maybe<Scalars['String']['output']>;
  /** Conversation the message belongs to */
  conversation?: Maybe<Conversation>;
  /** Message created at */
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** Message image */
  image?: Maybe<Scalars['String']['output']>;
  /** Users that have seen the message */
  seen?: Maybe<Array<Maybe<User>>>;
  /** Sender of the message */
  sender?: Maybe<User>;
  /** Message updated at */
  updatedAt?: Maybe<Scalars['String']['output']>;
};

/** Users */
export type User = {
  __typename?: 'User';
  /** User's accounts */
  accounts?: Maybe<Array<Maybe<Account>>>;
  /** User's conversations */
  conversations?: Maybe<Array<Maybe<Conversation>>>;
  /** User's email */
  email?: Maybe<Scalars['String']['output']>;
  /** User's email verification status */
  emailVerified?: Maybe<Scalars['String']['output']>;
  /** User's hashed password */
  hashedPassword?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** User's image */
  image?: Maybe<Scalars['String']['output']>;
  /** User's messages */
  messages?: Maybe<Array<Maybe<Message>>>;
  /** User's name */
  name?: Maybe<Scalars['String']['output']>;
  /** User's seen messages */
  seenMessages?: Maybe<Array<Maybe<Message>>>;
};