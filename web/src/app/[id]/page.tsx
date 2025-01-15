import ChatArea from "@/components/ChatArea";

type Params = {
  id: string;
};

type ChatProps = {
  params: Promise<Params>;
};

export default async function Chat({ params }: ChatProps) {
  const { id } = await params;

  return <ChatArea channelId={id} />;
}
