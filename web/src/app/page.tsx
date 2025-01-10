"use client";
import ChatArea from "@/components/ChatArea";
import MessageInput from "@/components/MessageInput";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function Home() {
  const [selectedChannel, setSelectedChannel] = useState<string>();
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar onChannelSelect={(channelId) => setSelectedChannel(channelId)} />
      <main className="flex flex-1 flex-col">
        {selectedChannel && (
          <>
            <ChatArea channelId={selectedChannel} />
            <MessageInput channelId={selectedChannel} />
          </>
        )}
      </main>
    </div>
  );
}
