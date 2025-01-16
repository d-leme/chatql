"use client";
import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import {
  Channel,
  type CreateChannelMutation,
  type CreateChannelMutationVariables,
} from "@/graphql/graphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CHANNEL_QUERY_KEY } from "./useGetChannelsQuery";

const createChannelMutation = graphql(`
  mutation createChannel($name: String!) {
    createChannel(name: $name) {
      id
      name
    }
  }
`);

export function useCreateChannelMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    CreateChannelMutation,
    Error,
    CreateChannelMutationVariables
  >({
    mutationFn: async (variables) => execute(createChannelMutation, variables),
    onSuccess: ({ createChannel }) => {
      queryClient.setQueryData<Channel[]>(
        [CHANNEL_QUERY_KEY],
        (oldChannels) => [...(oldChannels ?? []), createChannel],
      );
    },
  });
}
