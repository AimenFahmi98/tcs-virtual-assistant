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

export const uploadProfilePicture = createAsyncThunk(
  "users/uploadProfilePicture",
  async ({ userId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `/api/supabase/users/${userId}/profile-picture`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) throw new Error("Failed to upload profile picture");
      const data = await response.json();
      return data.publicUrl;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteProfilePicture = createAsyncThunk(
  "users/deleteProfilePicture",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/supabase/users/${userId}/profile-picture`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete profile picture");
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    currentUser: null,
    isLoading: true,
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
      })
      // Handle uploadProfilePicture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser.profile_picture_url = action.payload;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle deleteProfilePicture
      .addCase(deleteProfilePicture.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProfilePicture.fulfilled, (state) => {
        state.isLoading = false;
        state.currentUser.profile_picture_url = null;
      })
      .addCase(deleteProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout } = userSlice.actions;
export default userSlice.reducer;
