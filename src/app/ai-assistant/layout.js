import ChatSidebar from "@/components/ChatSidebar";
import Header from "@/components/Header";
import Sidebar from "@/components/ChatSidebar";
import { ChatContextProvider } from "@/context/chatContext";

function layout({ children }) {
  return (
    <div className="relative">
      {/* <div className="absolute inset-0 bg-[url('/bg-7.jpg')] scale-105 bg-cover blur-lg"></div> */}
      <div className="relative grid grid-cols-[auto_1fr] grid-rows-[60px_1fr]">
        <Header />
        <ChatContextProvider>
          <ChatSidebar />
          <main className="relative">{children}</main>
        </ChatContextProvider>
      </div>
    </div>
  );
}

export default layout;
