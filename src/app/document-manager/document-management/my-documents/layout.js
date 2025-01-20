import DocumentManagerHeader from "@/components/DocumentManagerHeader";

function layout({ children }) {
  return (
    <div className="col-span-1 col-start-2 flex h-screen w-full flex-col pl-24 pt-12">
      <h1 className="mb-10 flex items-center text-2xl">Document Manager</h1>
      <div className="relative w-full flex-1 flex-col overflow-auto rounded-tl-[40px] shadow-md_custom">
        <DocumentManagerHeader />
        {children}
      </div>
    </div>
  );
}

export default layout;
