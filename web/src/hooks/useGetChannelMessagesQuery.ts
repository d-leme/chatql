import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import { GetMessagesQueryVariables } from "@/graphql/graphql";
import { useQuery } from "@tanstack/react-query";

export const MESSAGES_QUERY_KEY = "messages";

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

export function useGetChannelMessagesQuery(
  variables: GetMessagesQueryVariables,
) {
  const result = useQuery({
    queryKey: [MESSAGES_QUERY_KEY, variables],
    queryFn: async () => (await execute(getMessagesQuery, variables))?.messages,
  });

  return { ...result, data: result.data ?? [] };
}
