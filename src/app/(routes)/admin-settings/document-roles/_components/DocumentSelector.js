import { IoMdSearch } from "react-icons/io";
import Spinner from "@/app/ui-components/common/Spinner";
import {
  formatFileSize,
  getFileIcon,
} from "@/utils/document-management/common";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedDocId,
  setDocumentsSearchQuery,
  clearDocumentSelection,
  selectAllDocuments,
  toggleDocumentSelection,
  startSelectingDocuments,
  stopSelectingDocuments,
} from "@/redux/adminSlice";

function DocumentSelector() {
  const dispatch = useDispatch();
  const {
    // Documents State
    documents,
    documentsSearchQuery,
    currentDocId,
    selectedDocIds,
    isFetchingDocuments,
    isSelectingDocuments,
  } = useSelector((state) => state.admin);

  const isAllDocumentsSelected = selectedDocIds.length === documents.length;

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(documentsSearchQuery.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-4 transform border-b-2 border-primary">
        <div className="flex items-center justify-between px-4">
          <h2 className="mb-4 text-xl font-semibold">Documents</h2>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                !isSelectingDocuments
                  ? dispatch(startSelectingDocuments())
                  : dispatch(stopSelectingDocuments());

                dispatch(clearDocumentSelection());
              }}
              className="text-sm text-text_light hover:text-text"
            >
              {!isSelectingDocuments ? "Select" : "Cancel"}
            </button>
            {isSelectingDocuments && (
              <button
                onClick={() => {
                  isAllDocumentsSelected
                    ? dispatch(clearDocumentSelection())
                    : dispatch(selectAllDocuments());
                }}
                className="text-sm text-text_light hover:text-text"
              >
                {isAllDocumentsSelected ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <IoMdSearch className="h-6 w-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={documentsSearchQuery}
            onChange={(e) => dispatch(setDocumentsSearchQuery(e.target.value))}
            className="w-full bg-background text-text placeholder:text-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {isFetchingDocuments ? (
        <Spinner />
      ) : (
        <div className="max-h-[calc(100vh-300px)] space-y-2 overflow-auto">
          {filteredDocuments.map((doc) => (
            <div
              onClick={() => {
                isSelectingDocuments
                  ? dispatch(toggleDocumentSelection(doc.id))
                  : dispatch(setSelectedDocId(doc.id));
              }}
              key={doc.id}
              className={`cursor-pointer rounded-lg p-4 transition-all ${isSelectingDocuments && selectedDocIds.includes(doc.id) && "bg-blue-50 hover:bg-blue-50"} ${
                currentDocId === doc.id
                  ? "border-2 border-primary bg-primary_light"
                  : "hover:bg-primary"
              }`}
            >
              <div className="flex items-center gap-2">
                {isSelectingDocuments && (
                  <input
                    type="checkbox"
                    checked={selectedDocIds.includes(doc.id)}
                    onChange={() => dispatch(toggleDocumentSelection(doc.id))}
                    onClick={(e) => e.stopPropagation()}
                    className="h-3 w-3"
                  />
                )}
                <div className="flex flex-1 items-center gap-2">
                  <span className="text-text_light">
                    {getFileIcon(doc.name)}
                  </span>
                  <h4 className="font-semibold">{doc.name}</h4>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-text_light">
                <span>Size: {formatFileSize(doc.size)}</span>
                <span>{new Date(doc.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentSelector;
