import ChatSidebar from "@/app/(routes)/virtual-assistant/_components/ChatSidebar";
import Header from "@/app/ui-components/Header";
import { ChatContextProvider } from "@/context/chatContext";

function layout({ children }) {
  return (
    <>
      <Header />
      <ChatContextProvider>
        <ChatSidebar />
        <main>{children}</main>
      </ChatContextProvider>
    </>
  );
}

export default layout;
