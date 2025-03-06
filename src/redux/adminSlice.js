import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunks for fetching data
export const fetchDocuments = createAsyncThunk(
  "documents/fetch",
  async (user_id) => {
    const response = await fetch(`/api/supabase/users/${user_id}/documents`);
    if (!response.ok) throw new Error("Failed to fetch documents");
    const result = await response.json();
    return result.documents || [];
  },
);

export const fetchRoles = createAsyncThunk("documents/fetchRoles", async () => {
  const response = await fetch("/api/supabase/roles");
  if (!response.ok) throw new Error("Failed to fetch roles");
  const result = await response.json();
  return result || [];
});

export const fetchDocumentRoles = createAsyncThunk(
  "documents/fetchDocumentRoles",
  async ({ user_id, docIds }, { rejectWithValue }) => {
    try {
      const promises = docIds.map(async (docId) => {
        const response = await fetch(
          `/api/supabase/users/${user_id}/documents/${docId}/roles`,
        );
        if (!response.ok)
          throw new Error(`Failed to fetch roles for document ${docId}`);
        const roles = await response.json();
        return { docId, roles };
      });

      const results = await Promise.all(promises);
      return results.reduce((acc, { docId, roles }) => {
        acc[docId] = roles;
        return acc;
      }, {});
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addSelectedRolesToSelectedDocuments = createAsyncThunk(
  "documents/addSelectedRolesToSelectedDocuments",
  async (user_id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const promises = [];

      // Use selectedDocIds and rolesToBeAssigned from state
      const { selectedDocIds, rolesToBeAssigned, roles } = state.admin;

      // For each document-role combination, check if role doesn't exist and create add promise
      selectedDocIds.forEach((docId) => {
        const documentRoles = state.admin.documentToRolesMap[docId] || [];
        rolesToBeAssigned.forEach((roleId) => {
          // Only create add request if role doesn't exist for document
          if (!documentRoles.some((role) => role.id === roleId)) {
            promises.push(
              (async () => {
                const response = await fetch(
                  `/api/supabase/users/${user_id}/documents/${docId}/roles`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ role_id: roleId }),
                  },
                );
                if (!response.ok)
                  throw new Error(
                    `Failed to add role ${roleId} to document ${docId}`,
                  );
                const result = await response.json();
                return {
                  documentId: docId,
                  role: roles.filter((role) => role.id === result.role_id)[0],
                };
              })(),
            );
          }
        });
      });

      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const removeSelectedRolesFromSelectedDocuments = createAsyncThunk(
  "documents/removeSelectedRolesFromSelectedDocuments",
  async (user_id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const promises = [];

      // Use selectedDocIds and rolesToBeRemoved from state
      const { selectedDocIds, rolesToBeRemoved } = state.admin;

      // For each document-role combination, check if role exists and create delete promise
      selectedDocIds.forEach((docId) => {
        const documentRoles = state.admin.documentToRolesMap[docId] || [];
        rolesToBeRemoved.forEach((roleId) => {
          // Only create delete request if role exists for document
          if (documentRoles.some((role) => role.id === roleId)) {
            promises.push(
              fetch(
                `/api/supabase/users/${user_id}/documents/${docId}/roles/${roleId}`,
                {
                  method: "DELETE",
                },
              ).then((response) => {
                if (!response.ok)
                  throw new Error(
                    `Failed to remove role ${roleId} from document ${docId}`,
                  );
                return { documentId: docId, roleId };
              }),
            );
          }
        });
      });

      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    // Documents State
    documents: [],
    documentsSearchQuery: "",
    currentDocId: null,
    selectedDocIds: [],
    isFetchingDocuments: false,
    isSelectingDocuments: false,

    // General Roles State
    roles: [],
    isFetchingRoles: false,

    // Role Assignment State
    rolesToBeAssignedSearchQuery: "",
    rolesToBeAssigned: [],
    isSelectingRolesToBeAssigned: false,

    // Role Removal State
    rolesToBeRemovedSearchQuery: "",
    rolesToBeRemoved: [],
    isSelectingRolesToBeRemoved: false,

    // Document Roles State
    documentToRolesMap: {},
    isFetchingDocumentRoles: false,
    isAddingRolesToDocuments: false,
    isRemovingRolesFromDocuments: false,
  },
  reducers: {
    // Document Actions
    setDocumentsSearchQuery: (state, action) => {
      state.documentsSearchQuery = action.payload;
    },
    setSelectedDocId: (state, action) => {
      state.currentDocId = action.payload;
    },
    startSelectingDocuments: (state) => {
      state.isSelectingDocuments = true;
    },
    toggleDocumentSelection: (state, action) => {
      const docId = action.payload;
      const index = state.selectedDocIds.indexOf(docId);
      if (index === -1) {
        state.selectedDocIds.push(docId);
      } else {
        state.selectedDocIds.splice(index, 1);
      }
    },
    stopSelectingDocuments: (state) => {
      state.isSelectingDocuments = false;
    },
    selectAllDocuments: (state) => {
      state.selectedDocIds = state.documents.map((doc) => doc.id);
    },
    clearDocumentSelection: (state) => {
      state.selectedDocIds = [state.currentDocId];
    },

    // Role Assignement Actions
    setRolesToBeAssignedSearchQuery: (state, action) => {
      state.rolesToBeAssignedSearchQuery = action.payload;
    },
    toggleAssignmentOfRole: (state, action) => {
      const roleId = action.payload;
      const index = state.rolesToBeAssigned.indexOf(roleId);
      if (index === -1) {
        state.rolesToBeAssigned.push(roleId);
      } else {
        state.rolesToBeAssigned.splice(index, 1);
      }
    },
    startSelectingRolesToBeAssigned: (state) => {
      state.isSelectingRolesToBeAssigned = true;
    },
    stopSelectingRolesToBeAssigned: (state) => {
      state.isSelectingRolesToBeAssigned = false;
    },
    selectAllRolesForAssignment: (state) => {
      const filteredRoles = state.roles.filter((role) =>
        role.name
          .toLowerCase()
          .includes(state.rolesToBeAssignedSearchQuery.toLowerCase()),
      );

      const availableRoles = filteredRoles.filter(
        (role) =>
          !state.documentToRolesMap[state.currentDocId].some(
            (dr) => dr.id === role.id,
          ),
      );

      state.rolesToBeAssigned = availableRoles.map((role) => role.id);
    },
    clearRoleSelectionForAssignment: (state) => {
      state.rolesToBeAssigned = [];
    },

    // Role Removal Actions
    setRolesToBeRemovedSearchQuery: (state, action) => {
      state.rolesToBeRemovedSearchQuery = action.payload;
    },
    toggleRemovalOfRole: (state, action) => {
      const roleId = action.payload;
      const index = state.rolesToBeRemoved.indexOf(roleId);
      if (index === -1) {
        state.rolesToBeRemoved.push(roleId);
      } else {
        state.rolesToBeRemoved.splice(index, 1);
      }
    },
    startSelectingRolesToBeRemoved: (state) => {
      state.isSelectingRolesToBeRemoved = true;
    },
    stopSelectingRolesToBeRemoved: (state) => {
      state.isSelectingRolesToBeRemoved = false;
    },
    selectAllRolesForRemoval: (state) => {
      const filteredRoles = state.documentToRolesMap[state.currentDocId].filter(
        (role) =>
          role.name
            .toLowerCase()
            .includes(state.rolesToBeRemovedSearchQuery.toLowerCase()),
      );

      state.rolesToBeRemoved = filteredRoles.map((role) => role.id);
    },
    clearRoleSelectionForRemoval: (state) => {
      state.rolesToBeRemoved = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Asynchronous Thunks for Managing Documents
      .addCase(fetchDocuments.pending, (state) => {
        state.isFetchingDocuments = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.isFetchingDocuments = false;
        state.documents = action.payload;
        state.currentDocId = action.payload[0]?.id || null;
        state.selectedDocIds = state.currentDocId ? [state.currentDocId] : [];
      })
      .addCase(fetchDocuments.rejected, (state) => {
        state.isFetchingDocuments = false;
      })

      // Asynchronous Thunks for Managing Document Roles
      .addCase(fetchDocumentRoles.pending, (state) => {
        state.isFetchingDocumentRoles = true;
      })
      .addCase(fetchDocumentRoles.fulfilled, (state, action) => {
        state.isFetchingDocumentRoles = false;
        state.documentToRolesMap = {
          ...state.documentToRolesMap,
          ...action.payload,
        };
      })
      .addCase(fetchDocumentRoles.rejected, (state) => {
        state.isFetchingDocumentRoles = false;
      })

      // Asynchronous Thunks for Managing Roles in General
      .addCase(fetchRoles.pending, (state) => {
        state.isFetchingRoles = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.isFetchingRoles = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state) => {
        state.isFetchingRoles = false;
      })

      // Asynchronous Thunks for Managing Role Assignments
      .addCase(addSelectedRolesToSelectedDocuments.pending, (state) => {
        state.isAddingRolesToDocuments = true;
      })
      .addCase(
        addSelectedRolesToSelectedDocuments.fulfilled,
        (state, action) => {
          state.isAddingRolesToDocuments = false;
          action.payload.forEach(({ documentId, role }) => {
            if (!state.documentToRolesMap[documentId]) {
              state.documentToRolesMap[documentId] = [];
            }
            state.documentToRolesMap[documentId].push(role);
          });
          state.rolesToBeAssigned = [];
        },
      )
      .addCase(
        addSelectedRolesToSelectedDocuments.rejected,
        (state, action) => {
          state.isAddingRolesToDocuments = false;
          console.error("Error Adding Roles to Documents:", action.payload);
        },
      )

      // Asynchronous Thunks for Managing Role Removals
      .addCase(removeSelectedRolesFromSelectedDocuments.pending, (state) => {
        state.isRemovingRolesFromDocuments = true;
      })
      .addCase(
        removeSelectedRolesFromSelectedDocuments.fulfilled,
        (state, action) => {
          state.isRemovingRolesFromDocuments = false;
          // Action payload is now an array of results
          action.payload.forEach(({ documentId, roleId }) => {
            if (state.documentToRolesMap[documentId]) {
              state.documentToRolesMap[documentId] = state.documentToRolesMap[
                documentId
              ].filter((role) => role.id !== roleId);
            }
          });
          state.rolesToBeRemoved = [];
        },
      )
      .addCase(removeSelectedRolesFromSelectedDocuments.rejected, (state) => {
        state.isRemovingRolesFromDocuments = false;
      });
  },
});

export const {
  setDocumentsSearchQuery,
  setSelectedDocId,
  toggleDocumentSelection,
  startSelectingDocuments,
  stopSelectingDocuments,
  selectAllDocuments,
  clearDocumentSelection,
  setRolesToBeAssignedSearchQuery,
  toggleAssignmentOfRole,
  toggleRemovalOfRole,
  startSelectingRolesToBeAssigned,
  stopSelectingRolesToBeAssigned,
  selectAllRolesForAssignment,
  clearRoleSelectionForAssignment,
  startSelectingRolesToBeRemoved,
  stopSelectingRolesToBeRemoved,
  selectAllRolesForRemoval,
  clearRoleSelectionForRemoval,
  setRolesToBeRemovedSearchQuery,
} = adminSlice.actions;
export default adminSlice.reducer;
