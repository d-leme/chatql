"use client";
import { useCreateChannelMutation } from "@/hooks/useCreateChannelMutation";
import { useGetChannelsQuery } from "@/hooks/useGetChannelsQuery";
import { cn } from "@/lib/utils";
import { Hash, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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

export default function Sidebar() {
  const router = useRouter();
  const { id } = useParams();
  const { mutate } = useCreateChannelMutation();

  const [newChannelName, setNewChannelName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: channels } = useGetChannelsQuery();

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name: newChannelName });
    setNewChannelName("");
  };

  const handleChannelSelect = (channelId: string) => {
    if (id === channelId) return;
    router.push(`/${channelId}`);
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
            <button
              key={channel.id}
              onClick={() => handleChannelSelect(channel.id)}
              className={cn(
                "mb-2 flex w-full items-center rounded p-2 text-left transition-colors duration-150 hover:bg-gray-700",
                { "bg-gray-700": id === channel.id },
              )}
            >
              <Hash className="mr-2 h-4 w-4" />
              {channel.name}
            </button>
          ))}
        </ul>
      </div>
    </div>
  );
}
