"use client";
import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import { TypedDocumentString } from "@/graphql/graphql";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Hash } from "lucide-react";
import React from "react";

const Channels = graphql(`
  query channels {
    channels {
      id
      name
    }
  }
`);

const MessageAdded = graphql(`
  subscription messageAdded {
    messageAdded(channelID: "1") {
      id
      content
      owner
      createdAt
    }
  }
`);

function extractGraphqlOperation<T, TResult>(
  query: string | TypedDocumentString<T, TResult>,
): string {
  const operation = query.split("{")[1]?.trim().split("(")[0];

  if (!operation) {
    throw new Error("Invalid query");
  }

  return operation;
}

export function useReactQuerySubscription() {
  const [messages, setMessages] = React.useState<any[]>([]);
  const queryClient = useQueryClient();
  React.useEffect(() => {
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
      websocket.close();
    };
  }, [queryClient]);
  return { messages };
}

export default function Sidebar() {
  const { data } = useQuery({
    queryKey: ["channels"],
    queryFn: () => execute(Channels),
  });

  const { channels } = data ?? {};

  return (
    <div className="w-64 border-r border-gray-700 bg-gray-900 p-4 text-gray-300">
      <h1 className="mb-4 text-2xl font-bold text-white">Slack Clone</h1>
      <div className="mb-4">
        <h2 className="mb-2 text-lg font-semibold text-gray-400">Channels</h2>
        <ul>
          {channels?.map((channel) => (
            <li
              key={channel.id}
              className="mb-2 flex cursor-pointer items-center rounded p-2 transition-colors duration-150 hover:bg-gray-700"
            >
              <Hash className="mr-2 h-4 w-4" />
              {channel.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
