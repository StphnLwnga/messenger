export const CREATE_USER_FROM_CREDENTIALS = `
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUserFromCredentials(createUserInput: $createUserInput) {
      code
      success
      message
      user {
        id
        name
        email
      }
    }
  }
`;

export const CREATE_UPDATE_USER_WITH_ACCOUNT = `
  mutation CreateUpdateUserWithAccount($createUpdateUserAccountInput: CreateUpdateUserAccountInput!) {
    createUpdateUserWithAccount(createUpdateUserAccountInput: $createUpdateUserAccountInput) {
      code
      success
      message
      user {
        id
        name
        email
        emailVerified
        image
      }
    }
  }
`

export const CREATE_GET_CONVERSATION = `
  mutation CreateConversationMutation($createConversationInput: CreateConversationInput!) {
    createConversation(createConversationInput: $createConversationInput) {
    code
      success
      message
      conversation {
        id
        name
        lastMessageAt
        isGroup
        createdAt
        updatedAt
        users {
          id
          name
          email
          image
        }
      }
    }
  }
`;