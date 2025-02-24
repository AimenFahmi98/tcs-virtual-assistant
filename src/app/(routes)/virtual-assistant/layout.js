import Header from "@/app/ui-components/Header";
import { ChatContextProvider } from "@/context/chatContext";
import ChatSidebar from "./_components/ChatSidebar";

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
