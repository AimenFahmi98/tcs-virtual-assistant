import ChatSidebar from "@/app/(routes)/ai-assistant/_components/ChatSidebar";
import Header from "@/app/ui-components/Header";
import { ChatContextProvider } from "@/context/chatContext";

function layout({ children }) {
  return (
    <div className="relative">
      {/* <div className="absolute inset-0 bg-[url('/bg-7.jpg')] scale-105 bg-cover blur-lg"></div> */}
      <div className="relative grid grid-cols-[auto_1fr] grid-rows-[60px_1fr]">
        <Header />
        <ChatContextProvider>
          <ChatSidebar />
          <main>{children}</main>
        </ChatContextProvider>
      </div>
    </div>
  );
}

export default layout;
