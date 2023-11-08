import { AssistantRequest } from "@/app/api/assistant/_schema";
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages.mjs";
import { useState } from "react";

type UseAssistantProps = {
  onMessageReceived?: () => void;
};

const useAssistant = (props?: UseAssistantProps) => {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getThreadIdFromExistingMessages = (messages: ThreadMessage[]) => {
    if (messages.length === 0) {
      return undefined;
    }

    return messages[0].thread_id;
  };

  const submit = async (newMessage: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            content: newMessage,
          },
          threadId: getThreadIdFromExistingMessages(messages),
        } as AssistantRequest),
      });

      const newMessages = (await response.json()) as {
        messages: ThreadMessage[];
      };

      setMessages(newMessages.messages);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsSubmitting(false);
      props?.onMessageReceived?.();
    }
  };

  const reload = async () => {
    setIsSubmitting(true);
    setError(null);

    const threadId = getThreadIdFromExistingMessages(messages);

    try {
      if (!threadId) {
        return;
      }

      const response = await fetch(`/api/threads/${threadId}/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const newMessages = (await response.json()) as {
        messages: ThreadMessage[];
      };

      setMessages(newMessages.messages);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsSubmitting(false);
      props?.onMessageReceived?.();
    }
  };

  return {
    messages,
    setMessages,
    isSubmitting,
    submit,
    reload,
    error,
  };
};

export default useAssistant;
