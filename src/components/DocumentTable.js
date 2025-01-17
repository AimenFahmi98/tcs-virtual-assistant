import DocumentRow from "./DocumentRow";

function DocumentTable({ documents }) {
  return (
    <div className="container mx-auto h-full w-[95%] py-2">
      <div className="h-full overflow-x-auto rounded-t-[30px] border border-primary border-b-transparent bg-background">
        <table className="min-w-full text-center text-sm text-text">
          <thead className="bg-primary text-xs font-semibold uppercase tracking-wider text-text">
            <tr>
              <th className="px-6 py-6">File Name</th>
              <th className="px-6 py-6">Date of Upload</th>
              <th className="px-6 py-6">Size</th>
              <th className="px-6 py-6">Number of Chunks</th>
              <th className="px-6 py-6">Selected for RAG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-6">
                  No documents found
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <DocumentRow document={doc} key={doc.id} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DocumentTable;
