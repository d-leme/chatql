import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import {
  type AddMessageMutation,
  type AddMessageMutationVariables,
} from "@/graphql/graphql";
import { useMutation } from "@tanstack/react-query";

const addMessageMutation = graphql(`
  mutation addMessage($channelID: ID!, $content: String!) {
    addMessage(channelID: $channelID, content: $content) {
      id
      content
      owner
      createdAt
    }
  }
`);

export function useAddMessageMutation() {
  return useMutation<AddMessageMutation, Error, AddMessageMutationVariables>({
    mutationFn: async (variables) =>
      await execute(addMessageMutation, variables),
  });
}
