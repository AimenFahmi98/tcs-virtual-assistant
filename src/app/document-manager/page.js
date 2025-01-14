import DocumentManager from "@/components/DocumentManager";

function Page() {
  return (
    <div className="col-span-1 col-start-2 flex h-full w-full flex-col pl-32 pt-12">
      <h1 className="mb-10 flex items-center text-2xl">Document Manager</h1>
      <DocumentManager />
    </div>
  );
}

export default Page;
