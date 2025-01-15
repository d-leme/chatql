import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import { type Message, type TypedDocumentString } from "@/graphql/graphql";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const WS_URL = "ws://localhost:8080/query";

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

function extractGraphqlOperation<T, TVariables>(
  query: string | TypedDocumentString<T, TVariables>,
): string {
  const operation = query.split("{")[1]?.trim().split("(")[0];

  if (!operation) {
    throw new Error("Invalid query");
  }

  return operation;
}

export function useGraphQLSubscription<T, TVariables>(
  query: TypedDocumentString<T, TVariables>,
  variables: TVariables,
  onMessage: (data: T) => void,
) {
  const webSocketRef = useRef<WebSocket>();

  useEffect(() => {
    const websocket = new WebSocket(WS_URL, "graphql-transport-ws");

    websocket.onopen = () => {
      websocket.send(JSON.stringify({ type: "connection_init", payload: {} }));
    };

    webSocketRef.current = websocket;

    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => {
    const websocket = webSocketRef.current;
    if (!websocket) return;

    websocket.onmessage = (event) => {
      const operationName = extractGraphqlOperation(query);

      const isAckMessage = (event.data as string).includes("connection_ack");
      if (!isAckMessage) {
        onMessage(JSON.parse(event.data)?.payload?.data as T);
        return;
      }

      const subscriptionQuery = {
        id: Math.random().toString(36).substring(2, 15),
        type: "subscribe",
        payload: {
          query,
          operationName,
          variables,
        },
      };

      websocket.send(JSON.stringify(subscriptionQuery));
    };
  }, [query, variables, onMessage]);
}

export function useChannelMessages(channelId: string): Message[] {
  const queryClient = useQueryClient();
  useGraphQLSubscription(MessageAdded, { channelID: channelId }, (event) =>
    queryClient.setQueryData<Message[]>(
      ["messages", channelId],
      (prevMessages) => [...(prevMessages ?? []), event.messageAdded],
    ),
  );

  const { data } = useQuery({
    queryKey: ["messages", channelId],
    queryFn: async () => {
      const queryResponse = await execute(getMessagesQuery, {
        channelID: channelId,
      });
      return queryResponse.messages;
    },
  });

  return data ?? [];
}
