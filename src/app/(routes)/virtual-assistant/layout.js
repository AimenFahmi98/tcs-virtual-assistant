import Header from "@/app/ui-components/common/Header";
import ChatSidebar from "./_components/ChatSidebar";

function layout({ children }) {
  return (
    <>
      <ChatSidebar />
      <main>{children}</main>
    </>
  );
}

export default layout;
