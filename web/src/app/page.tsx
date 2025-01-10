import ChatArea from "@/components/ChatArea";
import MessageInput from "@/components/MessageInput";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <main className="flex flex-1 flex-col">
        <ChatArea />
        <MessageInput />
      </main>
    </div>
  );
}
