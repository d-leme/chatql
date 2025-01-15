import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import {
  type TypedDocumentString,
  type GetMessagesQuery,
  type Message,
} from "@/graphql/graphql";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";

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

function extractGraphqlOperation<T, TResult>(
  query: string | TypedDocumentString<T, TResult>,
): string {
  const operation = query.split("{")[1]?.trim().split("(")[0];

  if (!operation) {
    throw new Error("Invalid query");
  }

  return operation;
}

export function useReactQuerySubscription<T, TResult>(
  channelId: string,
  query: TypedDocumentString<T, TResult>,
) {
  const webSocketRef = useRef<WebSocket>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (webSocketRef.current) return;

    const websocket = new WebSocket(
      "ws://localhost:8080/query",
      "graphql-transport-ws",
    );

    websocket.onopen = () => {
      websocket.send(JSON.stringify({ type: "connection_init", payload: {} }));
    };

    webSocketRef.current = websocket;

    return () => {
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, []);

  useEffect(() => {
    const websocket = webSocketRef.current;
    if (!websocket) return;

    websocket.onmessage = (event) => {
      if ((event.data as string).includes("connection_ack")) {
        websocket.send(
          JSON.stringify({
            id: Math.random().toString(36).substring(2, 15),
            type: "subscribe",
            payload: {
              query,
              operationName: extractGraphqlOperation(query),
              variables: {
                channelID: channelId,
              },
            },
          }),
        );
      } else {
        const prevMessages = queryClient.getQueryData<
          GetMessagesQuery,
          string[],
          GetMessagesQuery
        >(["messages", channelId]);
        queryClient.setQueryData(["messages", channelId], {
          messages: [
            ...(prevMessages?.messages ?? []),
            JSON.parse(event.data)?.payload?.data?.messageAdded,
          ],
        });
      }
    };
  }, [channelId]);
}

export function useChannelMessages(channelId: string): Message[] {
  useReactQuerySubscription(channelId, MessageAdded);

  const { data } = useQuery({
    queryKey: ["messages", channelId],
    queryFn: () => execute(getMessagesQuery, { channelID: channelId }),
  });

  return data?.messages ?? [];
}
