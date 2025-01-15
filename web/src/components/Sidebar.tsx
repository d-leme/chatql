"use client";
import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import {
  type ChannelsQuery,
  type CreateChannelMutation,
  type CreateChannelMutationVariables,
} from "@/graphql/graphql";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Hash, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const Channels = graphql(`
  query channels {
    channels {
      id
      name
    }
  }
`);

const createChannelMutation = graphql(`
  mutation createChannel($name: String!) {
    createChannel(name: $name) {
      id
      name
    }
  }
`);

export default function Sidebar() {
  const [newChannelName, setNewChannelName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate } = useMutation<
    CreateChannelMutation,
    Error,
    CreateChannelMutationVariables
  >({
    mutationFn: async (variables) =>
      execute(createChannelMutation, {
        name: variables.name,
      }),
    onSuccess: ({ createChannel }) => {
      queryClient.setQueryData<ChannelsQuery>(["channels"], (oldData) => {
        const oldChannels = oldData?.channels ?? [];

        return {
          ...(oldData ?? {}),
          channels: [...oldChannels, createChannel],
        };
      });
    },
  });

  const { data } = useQuery({
    queryKey: ["channels"],
    queryFn: () => execute(Channels),
  });

  const { channels } = data ?? {};

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name: newChannelName });
    setNewChannelName("");
  };

  const handleChannelSelect = (channelId: string) => {
    router.replace(`/${channelId}`);
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-700 bg-gray-900 p-4 text-gray-300">
      <h1 className="mb-4 text-2xl font-bold text-white">Slack Clone</h1>
      <div className="flex-1 overflow-y-auto">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-400">Channels</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                <Plus />
              </Button>
            </DialogTrigger>
            <DialogContent className="border border-gray-700 bg-gray-800 text-white">
              <DialogHeader>
                <DialogTitle className="mb-2 text-lg font-semibold">
                  Create a new channel
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateChannel} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="channel-name"
                    className="text-sm font-medium text-gray-300"
                  >
                    Channel name
                  </Label>
                  <Input
                    id="channel-name"
                    type="text"
                    placeholder="e.g. marketing"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    className="border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <DialogClose asChild>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                  >
                    Create Channel
                  </Button>
                </DialogClose>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <ul>
          {channels?.map((channel) => (
            <li
              key={channel.id}
              className="mb-2 flex cursor-pointer items-center rounded p-2 transition-colors duration-150 hover:bg-gray-700"
              onClick={() => handleChannelSelect(channel.id)}
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
