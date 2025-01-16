import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import { Channel } from "@/graphql/graphql";
import { useQuery } from "@tanstack/react-query";

export const CHANNEL_QUERY_KEY = "channels";

const getChannelsQuery = graphql(`
  query channels {
    channels {
      id
      name
    }
  }
`);

export function useGetChannelsQuery() {
  const result = useQuery<Channel[]>({
    queryKey: [CHANNEL_QUERY_KEY],
    queryFn: async () => (await execute(getChannelsQuery))?.channels,
  });

  return { ...result, data: result.data ?? [] };
}
