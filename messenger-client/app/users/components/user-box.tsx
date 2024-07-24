"use client"

import { gql, useQuery, useLazyQuery } from '@apollo/client';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { User } from "@/graphql/types";
import { GET_CURRENT_USER_CONVO_WITH_OTHER_USER } from "@/graphql/queries";
import { Loading } from '@/components/ui/loading';
import Avatar from '@/components/avatar';

interface UserBoxProps {
  user: User;
}

const GET_CONVERSATIONS = gql(GET_CURRENT_USER_CONVO_WITH_OTHER_USER);

const UserBox = ({user}: UserBoxProps) => {
  const session = useSession();
  const router = useRouter();

  const [getConversations, {loading, error, data}] = useLazyQuery(GET_CONVERSATIONS, {
    variables: {
      currentUserEmail: session.data?.user?.email,
      otherUserEmail: user.email,
    }
  });

  useEffect(() => {
    if (data?.data) router.push(`/conversations/${data?.data?.id}`);
  }, [data, router]);

  if (loading) return <Loading size={60} />;

  if (error) return `Error! ${error}`;

  return ( 
    <div 
    className="
      w-full relative flex items-center space-x-3  p-3 py-2 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer
    "
    onClick={() => getConversations()}
    >
      <Avatar user={user} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between mb-1 items-center">
            <p className="font-medium text-sm text-gray-600 dark:text-slate-300">
              {user.name}
            </p>
          </div>
        </div>
      </div>
    </div>
   );
}
 
export default UserBox;