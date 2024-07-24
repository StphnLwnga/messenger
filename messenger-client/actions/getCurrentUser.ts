import axios from "axios";
import getSession from "./getSession";
import { GET_USER_FOR_SESSION_ACTION } from "@/graphql/queries";

const getCurrentUser = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) return null;

    const resp = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
      query: GET_USER_FOR_SESSION_ACTION,
      variables: {
        email: session.user.email
      }
    }, {
      headers: { 'Content-Type': 'application/json', }
    });
    console.log(resp.data.data);
    const { code, success, user } = resp?.data?.data?.getUserForSession;
    if (code !== 200 && !success) return null;
    return user;
  } catch (error) {
    console.log(error)
    return null;
  }
}

export default getCurrentUser;