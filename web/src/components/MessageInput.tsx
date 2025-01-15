"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import {
  type AddMessageMutation,
  type AddMessageMutationVariables,
} from "@/graphql/graphql";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState } from "react";

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

type MessageInputProps = {
  channelId: string;
};

export default function MessageInput({ channelId }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const { mutate } = useMutation<
    AddMessageMutation,
    Error,
    Pick<AddMessageMutationVariables, "content">
  >({
    mutationFn: async (variables) => {
      const response = await execute(addMessageMutation, {
        channelID: channelId,
        content: variables.content,
      });
      return response;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending message:", message);
    mutate({ content: message });
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-700 bg-gray-800 p-4"
    >
      <div className="flex items-center">
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mr-2 flex-1 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />
        <Button
          type="submit"
          size="icon"
          className="bg-green-600 transition-colors duration-150 hover:bg-green-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
