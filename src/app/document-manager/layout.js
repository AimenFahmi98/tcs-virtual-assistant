import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

function Layout({ children }) {
  return (
    <div className="grid grid-cols-[auto_1fr]">
      <Sidebar>
        <Link
          className="ml-20 mt-4 flex items-center justify-center gap-4 text-nowrap text-text_light hover:text-text"
          href={"/ai-assistant"}
        >
          <BiArrowBack className="h-6 w-6" />
          <span>Virtual Assistant</span>
        </Link>
      </Sidebar>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
