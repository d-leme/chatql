"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessageAddedSubscription } from "@/hooks/useMessageAddedSubscription";
import MessageInput from "./MessageInput";

type ChatAreaProps = {
  channelId: string;
};

export default function ChatArea({ channelId }: ChatAreaProps) {
  const { data: messages } = useMessageAddedSubscription({
    channelID: channelId,
  });

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-gray-800 p-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className="group mb-4 flex items-start rounded p-2 transition-colors duration-150 hover:bg-gray-700"
          >
            <Avatar className="mr-3 h-10 w-10">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.owner}`}
              />
              <AvatarFallback>
                {message.owner
                  ?.split(" ")
                  ?.map((n) => n[0])
                  ?.join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="mr-2 font-bold text-white">
                    {message.owner}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <button className="mr-2 text-gray-400 hover:text-white">
                    😄
                  </button>
                  <button className="text-gray-400 hover:text-white">⋮</button>
                </div>
              </div>
              <p className="text-gray-300">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={(el) => el?.scrollIntoView()} />
      </div>
      <MessageInput channelId={channelId} />
    </>
  );
}
