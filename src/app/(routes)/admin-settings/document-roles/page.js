"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDocuments,
  fetchDocumentRoles,
  fetchRoles,
  clearDocumentSelection,
} from "@/redux/documentSlice";
import DocumentSelector from "./_components/DocumentSelector";
import RoleAssigner from "./_components/RoleRemover";
import RoleRemover from "./_components/RoleAssigner";

export default function Page() {
  const dispatch = useDispatch();
  const { documents, currentDocId, isFetchingDocuments, isFetchingRoles } =
    useSelector((state) => state.documents);

  useEffect(() => {
    dispatch(fetchDocuments());
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (!isFetchingDocuments && !isFetchingRoles) {
      dispatch(fetchDocumentRoles(documents.map((doc) => doc.id)));
    }
  }, [dispatch, documents, isFetchingDocuments, isFetchingRoles]);

  useEffect(() => {
    dispatch(clearDocumentSelection());
  }, [currentDocId, dispatch]);

  return (
    <div className="h-full bg-gradient-to-br from-background to-primary_light">
      <div className="flex items-center justify-center px-16 py-2">
        <div className="flex w-full gap-6">
          <div className="w-1/2 rounded-3xl bg-background p-6 shadow-md_custom">
            <DocumentSelector />
          </div>

          <div className="w-1/2">
            {currentDocId && (
              <div className="flex flex-col gap-4">
                <RoleAssigner />
                <RoleRemover />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
