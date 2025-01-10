"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import { TypedDocumentString } from "@/graphql/graphql";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

const getMessagesQuery = graphql(`
  query getMessages($channelID: ID!) {
    messages(channelID: $channelID) {
      id
      content
      owner
      createdAt
    }
  }
`);

const MessageAdded = graphql(`
  subscription messageAdded($channelID: ID!) {
    messageAdded(channelID: $channelID) {
      id
      content
      owner
      createdAt
    }
  }
`);

type ChatAreaProps = {
  channelId: string;
};

function extractGraphqlOperation<T, TResult>(
  query: string | TypedDocumentString<T, TResult>,
): string {
  const operation = query.split("{")[1]?.trim().split("(")[0];

  if (!operation) {
    throw new Error("Invalid query");
  }

  return operation;
}

export function useReactQuerySubscription(channelId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const webSocketRef = useRef<boolean>(false);

  useEffect(() => {
    console.log("Connecting to websocket");

    if (webSocketRef.current) return;
    webSocketRef.current = true;

    const websocket = new WebSocket(
      "ws://localhost:8080/query",
      "graphql-transport-ws",
    );

    websocket.onopen = () => {
      websocket.send(JSON.stringify({ type: "connection_init", payload: {} }));
    };

    websocket.onmessage = (event) => {
      if ((event.data as string).includes("connection_ack")) {
        websocket.send(
          JSON.stringify({
            id: Math.random().toString(36).substring(2, 15),
            type: "subscribe",
            payload: {
              query: MessageAdded,
              operationName: extractGraphqlOperation(MessageAdded),
              variables: {
                channelID: channelId,
              },
            },
          }),
        );
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          JSON.parse(event.data),
        ]);
      }
    };

    return () => {
      if (websocket.readyState === 1) {
        websocket.close();
      }
    };
  }, []);
  return { messages, lastMessage: messages[messages.length - 1] };
}

export default function ChatArea({ channelId }: ChatAreaProps) {
  const { messages: wsMessages } = useReactQuerySubscription(channelId);

  const { data } = useQuery({
    queryKey: ["messages", channelId],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: () => execute(getMessagesQuery, { channelID: channelId }),
  });

  const messages = useMemo(() => {
    if (!data) {
      return [];
    }
    const msgs = data?.messages ?? [];
    const incommingMsg =
      wsMessages.map((msg) => msg?.payload?.data?.messageAdded) ?? [];

    return [...msgs, ...incommingMsg].filter(Boolean);
  }, [data, wsMessages]);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-800 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className="group mb-4 flex items-start rounded p-2 transition-colors duration-150 hover:bg-gray-700"
        >
          <Avatar className="mr-3 h-10 w-10">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.owner}`}
            />
            <AvatarFallback>
              {(message.owner as string)
                ?.split(" ")
                ?.map((n) => n[0])
                ?.join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="mr-2 font-bold text-white">
                  {message.owner}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <button className="mr-2 text-gray-400 hover:text-white">
                  😄
                </button>
                <button className="text-gray-400 hover:text-white">⋮</button>
              </div>
            </div>
            <p className="text-gray-300">{message.content}</p>
          </div>
        </div>
      ))}
      <div ref={(el) => el?.scrollIntoView()} />
    </div>
  );
}
