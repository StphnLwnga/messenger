export const GET_USER = `
  query GetUser($email: String!, $password: String!) {
    getUser(email: $email, password: $password) {
        code
        success
        message
        user { id name email }
    }
  }
`;

export const GET_USER_FOR_SESSION_ACTION = `
  query GetUserForSessionQuery($email: String!) {
    getUserForSession(email: $email) {
        code
        success
        message
        user { 
          id 
          name 
          email 
          image
        }
    }
  }
`;

export const GET_USERS = `
  query GetUsersExcludingSelf($email: String!) {
    getUsersExcludingSelf(email: $email) {
      name
      image
      id
      emailVerified
      email
      createdAt
    }
  }
`;

export const GET_CURRENT_USER_CONVO_WITH_OTHER_USER = `
  query GetCurrentUserConvoWithOtherUserQuery($currentUserEmail: String!, $otherUserEmail: String!) {
    getCurrentUserConvoWithOtherUser(currentUserEmail: $currentUserEmail, otherUserEmail: $otherUserEmail) {
      id
    }
  }
`;