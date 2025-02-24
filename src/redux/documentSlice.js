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

const documentSlice = createSlice({
  name: "documents",
  initialState: {
    availableDocuments: [],
    isFetchingDocuments: false,
    error: null,
  },
  reducers: {},
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
      );
  },
});

export const { availableDocuments, isFetchingDocuments, error } =
  documentSlice.actions;

export default documentSlice.reducer;
