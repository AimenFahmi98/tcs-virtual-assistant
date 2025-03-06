import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching RAG documents
export const fetchDocumentsAvailableToCurrentUser = createAsyncThunk(
  "documents/fetchUserRagDocuments",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/supabase/users/${userId}/documents`);
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error);
      }
      const data = await response.json();
      return data.documents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for fetching RAG documents
export const fetchRagDocumentsAvailableToCurrentUser = createAsyncThunk(
  "documents/fetchRagDocuments",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/supabase/users/${userId}/documents/selected-for-rag`,
      );
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error);
      }
      const data = await response.json();
      return data.documents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for selecting multiple documents for RAG
export const selectMultipleDocumentsForRag = createAsyncThunk(
  "documents/selectMultipleDocuments",
  async ({ userId, documentIds }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setDocumentsBeingSelectedForRAG(documentIds));
      const promises = documentIds.map((documentId) =>
        fetch(`/api/supabase/users/${userId}/documents/selected-for-rag`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ document_id: documentId }),
        }),
      );
      const responses = await Promise.all(promises);
      const results = await Promise.all(
        responses.map(async (response) => {
          if (!response.ok) {
            const error = await response.json();
            throw error;
          }
          return response.json();
        }),
      );
      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for deselecting multiple documents from RAG
export const deselectMultipleDocumentsFromRag = createAsyncThunk(
  "documents/deselectMultipleDocuments",
  async ({ userId, documentIds }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setDocumentsBeingUnselectedForRAG(documentIds));
      const promises = documentIds.map((documentId) =>
        fetch(`/api/supabase/users/${userId}/documents/selected-for-rag`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ document_id: documentId }),
        }),
      );
      const responses = await Promise.all(promises);
      const results = await Promise.all(
        responses.map(async (response) => {
          if (!response.ok) {
            const error = await response.json();
            throw error;
          }
          return response.json();
        }),
      );
      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for selecting a document for RAG
export const selectDocumentForRag = createAsyncThunk(
  "documents/selectDocument",
  async ({ userId, documentId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/supabase/users/${userId}/documents/selected-for-rag`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ document_id: documentId }),
        },
      );
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for deselecting a document from RAG
export const deselectDocumentFromRag = createAsyncThunk(
  "documents/deselectDocument",
  async ({ userId, documentId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/supabase/users/${userId}/documents/selected-for-rag`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ document_id: documentId }),
        },
      );
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for deleting a document
export const deleteDocument = createAsyncThunk(
  "documents/deleteDocument",
  async ({ userId, documentId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/supabase/users/${userId}/documents/${documentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }

      const data = await response.json();
      return { id: documentId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for deleting multiple documents
export const deleteMultipleDocuments = createAsyncThunk(
  "documents/deleteMultipleDocuments",
  async ({ userId, documentIds }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setDocumentsBeingDeleted(documentIds));
      const promises = documentIds.map((documentId) =>
        fetch(`/api/supabase/users/${userId}/documents/${documentId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }),
      );
      const responses = await Promise.all(promises);
      await Promise.all(
        responses.map(async (response) => {
          const data = await response.json();
          if (!response.ok) {
            return rejectWithValue(data.error || "Failed to delete document");
          }
          return data;
        }),
      );
      return documentIds;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for uploading a document
export const uploadDocument = createAsyncThunk(
  "documents/uploadDocument",
  async ({ user_id, formData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/supabase/users/${user_id}/documents`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const documentSlice = createSlice({
  name: "documents",
  initialState: {
    availableDocuments: [],
    availableRAGDocuments: [],
    isFetchingDocuments: false,
    isFetchingRAGDocuments: false,
    documentsBeingSelectedForRAG: [],
    documentsBeingUnselectedForRAG: [],
    documentsBeingDeleted: [],
    isSelectingDocumentsForRAG: false,
    isUnselectingDocumentsForRAG: false,
    isDeletingDocuments: false,
    isUploadingDocument: false,
    error: null,
  },
  reducers: {
    setDocumentsBeingSelectedForRAG: (state, action) => {
      state.documentsBeingSelectedForRAG = action.payload;
    },
    setDocumentsBeingUnselectedForRAG: (state, action) => {
      state.documentsBeingUnselectedForRAG = action.payload;
    },
    setDocumentsBeingDeleted: (state, action) => {
      state.documentsBeingDeleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentsAvailableToCurrentUser.pending, (state) => {
        state.isFetchingDocuments = true;
        state.error = null;
      })
      .addCase(
        fetchDocumentsAvailableToCurrentUser.fulfilled,
        (state, action) => {
          state.isFetchingDocuments = false;
          state.availableDocuments = action.payload;
        },
      )
      .addCase(
        fetchDocumentsAvailableToCurrentUser.rejected,
        (state, action) => {
          state.isFetchingDocuments = false;
          state.error = action.payload;
        },
      )
      .addCase(fetchRagDocumentsAvailableToCurrentUser.pending, (state) => {
        state.isFetchingRAGDocuments = true;
        state.error = null;
      })
      .addCase(
        fetchRagDocumentsAvailableToCurrentUser.fulfilled,
        (state, action) => {
          state.isFetchingRAGDocuments = false;
          state.availableRAGDocuments = action.payload;
        },
      )
      .addCase(
        fetchRagDocumentsAvailableToCurrentUser.rejected,
        (state, action) => {
          state.isFetchingRAGDocuments = false;
          state.error = action.payload;
        },
      )
      .addCase(selectDocumentForRag.pending, (state) => {
        state.isSelectingDocumentsForRAG = true;
        state.error = null;
      })
      .addCase(selectDocumentForRag.fulfilled, (state, action) => {
        state.isSelectingDocumentsForRAG = false;
        state.documentsBeingSelectedForRAG = [];
        state.availableDocuments = state.availableDocuments.map((doc) =>
          doc.id === action.payload.id
            ? { ...doc, selected_for_rag: true }
            : doc,
        );
      })
      .addCase(selectDocumentForRag.rejected, (state, action) => {
        state.isSelectingDocumentsForRAG = false;
        state.documentsBeingSelectedForRAG = [];
        state.error = action.payload;
      })
      .addCase(deselectDocumentFromRag.pending, (state) => {
        state.isUnselectingDocumentsForRAG = true;
        state.error = null;
      })
      .addCase(deselectDocumentFromRag.fulfilled, (state, action) => {
        state.isUnselectingDocumentsForRAG = false;
        state.documentsBeingSelectedForRAG = [];
        state.availableDocuments = state.availableDocuments.map((doc) =>
          doc.id === action.payload.id
            ? { ...doc, selected_for_rag: false }
            : doc,
        );
      })
      .addCase(deselectDocumentFromRag.rejected, (state, action) => {
        state.isUnselectingDocumentsForRAG = false;
        state.documentsBeingUnselectedForRAG = [];
        state.error = action.payload;
      })
      .addCase(selectMultipleDocumentsForRag.pending, (state) => {
        state.isSelectingDocumentsForRAG = true;
        state.error = null;
      })
      .addCase(selectMultipleDocumentsForRag.fulfilled, (state, action) => {
        state.isSelectingDocumentsForRAG = false;
        state.documentsBeingSelectedForRAG = [];
        const updatedIds = action.payload.map((doc) => doc.id);
        state.availableDocuments = state.availableDocuments.map((doc) =>
          updatedIds.includes(doc.id)
            ? { ...doc, selected_for_rag: true }
            : doc,
        );
      })
      .addCase(selectMultipleDocumentsForRag.rejected, (state, action) => {
        state.isSelectingDocumentsForRAG = false;
        state.documentsBeingSelectedForRAG = [];
        state.error = action.payload;
      })
      .addCase(deselectMultipleDocumentsFromRag.pending, (state) => {
        state.isUnselectingDocumentsForRAG = true;
        state.error = null;
      })
      .addCase(deselectMultipleDocumentsFromRag.fulfilled, (state, action) => {
        state.isUnselectingDocumentsForRAG = false;
        state.documentsBeingUnselectedForRAG = [];
        const updatedIds = action.payload.map((doc) => doc.id);
        state.availableDocuments = state.availableDocuments.map((doc) =>
          updatedIds.includes(doc.id)
            ? { ...doc, selected_for_rag: false }
            : doc,
        );
      })
      .addCase(deselectMultipleDocumentsFromRag.rejected, (state, action) => {
        state.isUnselectingDocumentsForRAG = false;
        state.documentsBeingUnselectedForRAG = [];
        state.error = action.payload;
      })
      .addCase(deleteMultipleDocuments.pending, (state) => {
        state.isDeletingDocuments = true;
        state.error = null;
      })
      .addCase(deleteMultipleDocuments.fulfilled, (state, action) => {
        state.isDeletingDocuments = false;
        state.documentsBeingDeleted = [];
        state.availableDocuments = state.availableDocuments.filter(
          (doc) => !action.payload.includes(doc.id),
        );
      })
      .addCase(deleteMultipleDocuments.rejected, (state, action) => {
        state.isDeletingDocuments = false;
        state.documentsBeingDeleted = [];
        state.error = action.payload;
      })
      .addCase(uploadDocument.pending, (state) => {
        state.isUploadingDocument = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isUploadingDocument = false;
        state.availableDocuments = [
          ...state.availableDocuments,
          action.payload,
        ];
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isUploadingDocument = false;
        state.error = action.payload;
      });
  },
});

export const {
  availableDocuments,
  isFetchingDocuments,
  isSelectingDocumentsForRAG,
  isUnselectingDocumentsForRAG,
  isDeletingDocuments,
  documentsBeingSelectedForRAG,
  documentsBeingUnselectedForRAG,
  documentsBeingDeleted,
  setDocumentsBeingDeleted,
  setDocumentsBeingSelectedForRAG,
  setDocumentsBeingUnselectedForRAG,
  error,
} = documentSlice.actions;

export default documentSlice.reducer;
