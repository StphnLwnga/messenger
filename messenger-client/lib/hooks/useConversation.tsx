import { useParams } from "next/navigation";
import { useMemo } from "react";

/**
 * A custom hook that manages the conversation state.
 *
 * @return {Object} An object containing the isOpen state and conversationId value
 */
const useConversation = () => {
  const params = useParams();

  const conversationId = useMemo(() => {
    if (!params?.conversationId) return '';

    return params?.conversationId as string;
  }, [params?.conversationId]);

  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return useMemo(() => ({
    isOpen, conversationId
  }), [conversationId, isOpen]);
}

export default useConversation;