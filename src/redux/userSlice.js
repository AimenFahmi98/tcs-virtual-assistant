import { createClient } from "@/utils/supabase/client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunks
export const fetchCurrentUser = createAsyncThunk(
  "users/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        throw new Error(error.message || "Failed to fetch user");
      }

      const getCurrentUserResponse = await fetch(
        `/api/supabase/users/${user.id}`,
      );
      if (!getCurrentUserResponse.ok) throw new Error("Failed to fetch user");
      let currentUserProfile = await getCurrentUserResponse.json();

      const getCurrentUserRolesResponse = await fetch(
        `/api/supabase/users/${user.id}/roles`,
      );
      if (!getCurrentUserRolesResponse.ok)
        throw new Error("Failed to fetch user roles");
      currentUserProfile.roles = await getCurrentUserRolesResponse.json();

      return { ...currentUserProfile };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "users/updateProfile",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/supabase/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Failed to update user profile");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    currentUser: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout } = userSlice.actions;
export default userSlice.reducer;
