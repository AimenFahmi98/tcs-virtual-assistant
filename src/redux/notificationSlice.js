import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  isFetchingNotifications: true,
  isAddingNotification: false,
  isUpdatingNotification: false,
  isDeletingNotification: false,
  error: null,
};

// Async thunks for performing CRUD operations on notifications

// Fetch all notifications for a user
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (userId) => {
    const response = await fetch(`/api/supabase/users/${userId}/notifications`);
    const data = await response.json();
    return data.data;
  },
);

// Add a new notification for a user
export const addNotification = createAsyncThunk(
  "notifications/addNotification",
  async ({ userId, title, content }) => {
    const response = await fetch(
      `/api/supabase/users/${userId}/notifications`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      },
    );
    const data = await response.json();
    return data.data; // Assuming the API returns { success: true, data: {...}, message: "..." }
  },
);

// Update an existing notification
export const updateNotification = createAsyncThunk(
  "notifications/updateNotification",
  async ({ userId, notificationId, ...fields }) => {
    const response = await fetch(
      `/api/supabase/users/${userId}/notifications/${notificationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      },
    );
    const data = await response.json();
    return data; // Assuming the API returns the updated notification object
  },
);

// Delete a notification
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async ({ userId, notificationId }) => {
    await fetch(
      `/api/supabase/users/${userId}/notifications/${notificationId}`,
      {
        method: "DELETE",
      },
    );
    return notificationId; // Return the ID of the deleted notification to update the state
  },
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Reducer to mark a notification as read
    markNotificationAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (notification) => notification.id === notificationId,
      );
      if (notification) {
        notification.isRead = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isFetchingNotifications = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isFetchingNotifications = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isFetchingNotifications = false;
        state.error = action.error.message;
      })
      .addCase(addNotification.pending, (state) => {
        state.isAddingNotification = true;
        state.error = null;
      })
      .addCase(addNotification.fulfilled, (state, action) => {
        state.isAddingNotification = false;
        state.notifications.push(action.payload);
      })
      .addCase(addNotification.rejected, (state, action) => {
        state.isAddingNotification = false;
        state.error = action.error.message;
      })
      .addCase(updateNotification.pending, (state) => {
        state.isUpdatingNotification = true;
        state.error = null;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.isUpdatingNotification = false;
        const { id } = action.payload;
        const index = state.notifications.findIndex(
          (notification) => notification.id === id,
        );
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.isUpdatingNotification = false;
        state.error = action.error.message;
      })
      .addCase(deleteNotification.pending, (state) => {
        state.isDeletingNotification = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isDeletingNotification = false;
        const notificationId = action.payload;
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== notificationId,
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.isDeletingNotification = false;
        state.error = action.error.message;
      });
  },
});

export const { markNotificationAsRead } = notificationSlice.actions;

export default notificationSlice.reducer;
