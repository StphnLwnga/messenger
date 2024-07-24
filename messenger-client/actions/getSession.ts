import { getServerSession, Session } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Retrieves the server session using the provided authentication options.
 *
 * @return {Promise<Session|null>} A promise that resolves to the server session.
 */
export default async function getSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}
