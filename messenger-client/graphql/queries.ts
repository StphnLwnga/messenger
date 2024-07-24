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