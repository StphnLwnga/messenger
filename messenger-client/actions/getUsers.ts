import axios from "axios";
import getSession from "./getSession";
import { GET_USERS } from "@/graphql/queries";

const getUsers = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) return [];

    const res = await axios.post(
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
      {
        query: GET_USERS,
        variables: { email: session.user.email },
      },
      { headers: { 'Content-Type': 'application/json', } }
    );
    // console.log(res.data.data);
    const { getUsersExcludingSelf: users } = res?.data?.data;
    return users;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default getUsers;