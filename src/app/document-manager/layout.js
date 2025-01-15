import DocumentManagerHeader from "@/components/DocumentManagerHeader";
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
      <main>
        <div className="col-span-1 col-start-2 flex h-full w-full flex-col pl-24 pt-12">
          <h1 className="mb-10 flex items-center text-2xl">Document Manager</h1>
          <div className="flex h-full w-full flex-col rounded-tl-[40px] shadow-md_custom">
            <DocumentManagerHeader />
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Layout;
