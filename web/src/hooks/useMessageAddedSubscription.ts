import { graphql } from "@/graphql";
import {
  MessageAddedSubscriptionVariables,
  type Message,
} from "@/graphql/graphql";
import { useQueryClient } from "@tanstack/react-query";
import {
  MESSAGES_QUERY_KEY,
  useGetChannelMessagesQuery,
} from "./useGetChannelMessagesQuery";
import { useGraphQLSubscription } from "./useGraphQLSubscription";

const messageAddedSubscription = graphql(`
  subscription messageAdded($channelID: ID!) {
    messageAdded(channelID: $channelID) {
      id
      content
      owner
      createdAt
    }
  }
`);

export function useMessageAddedSubscription(
  variables: MessageAddedSubscriptionVariables,
) {
  const queryClient = useQueryClient();

  useGraphQLSubscription({
    query: messageAddedSubscription,
    variables,
    onMessage(event) {
      queryClient.setQueryData<Message[]>(
        [MESSAGES_QUERY_KEY, variables],
        (prevMessages) => [...(prevMessages ?? []), event.messageAdded],
      );
    },
  });

  return useGetChannelMessagesQuery(variables);
}
