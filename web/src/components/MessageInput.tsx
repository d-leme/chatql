"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddMessageMutation } from "@/hooks/useAddMessageMutation";
import { Send } from "lucide-react";
import { useState } from "react";

type MessageInputProps = {
  channelId: string;
};

export default function MessageInput({ channelId }: MessageInputProps) {
  const { mutate } = useAddMessageMutation();

  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate({ channelID: channelId, content: message });
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
