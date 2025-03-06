import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks
export const fetchAllRoles = createAsyncThunk(
  "roles/fetchAllRoles",
  async () => {
    try {
      const response = await fetch("/api/supabase/roles");
      if (!response.ok) throw new Error("Failed to fetch roles");
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw error;
    }
  },
);

export const addRole = createAsyncThunk(
  "roles/addRole",
  async ({ name, description }) => {
    const response = await fetch("/api/supabase/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: description || "No description provided",
      }),
    });
    if (!response.ok) throw new Error("Failed to add role");
    return response.json();
  },
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setRoleBeingDeleted(id));
      const response = await fetch(`/api/supabase/roles/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete role");
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const roleSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    isFetchingRoles: false,
    isAddingRole: false,
    isDeletingRole: false,
    error: null,
    roleBeingDeleted: -1,
  },
  reducers: {
    setRoleBeingDeleted: (state, action) => {
      state.roleBeingDeleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch roles
      .addCase(fetchAllRoles.pending, (state) => {
        state.isFetchingRoles = true;
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        state.isFetchingRoles = false;
        state.roles = action.payload;
      })
      .addCase(fetchAllRoles.rejected, (state, action) => {
        state.isFetchingRoles = false;
        state.error = action.error.message;
      })

      // Add role
      .addCase(addRole.pending, (state) => {
        state.isAddingRole = true;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      .addCase(addRole.rejected, (state, action) => {
        state.isAddingRole = false;
        state.error = action.error.message;
      })

      // Delete role
      .addCase(deleteRole.pending, (state) => {
        state.isDeletingRole = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((role) => role.id !== action.payload);
        state.isDeletingRole = false;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.isDeletingRole = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchQuery, setRoleBeingDeleted } = roleSlice.actions;
export default roleSlice.reducer;
