import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle } from "react-icons/hi2";
import { FcConferenceCall, FcSms, FcExport } from "react-icons/fc";
import { signOut } from "next-auth/react";

import useConversation from "./useConversation";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  return useMemo(() => [
    {
      label: 'Chat',
      href: '/conversations',
      icon: FcSms,
      active: pathname === '/conversations' || !!conversationId,
    },
    {
      label: 'Users',
      href: '/users',
      icon: FcConferenceCall,
      active: pathname === '/users',
    },
    {
      label: 'Logout',
      href: '#',
      icon: FcExport,
      active: false,
      onClick: () => signOut(),
    }
  ], [pathname, conversationId]);
}

export default useRoutes;