import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  isFetchingNotifications: true,
  isAddingNotification: false,
  isUpdatingNotification: false,
  isBroadcastingNotification: false,
  notificationBeingUpdated: -1,
  notificationBeingDeleted: -1,
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

// Mark a notification as read in the database
export const markNotificationAsReadInDB = createAsyncThunk(
  "notifications/markNotificationAsReadInDB",
  async ({ userId, notificationId }, { dispatch }) => {
    dispatch(setNotificationBeingUpdated(notificationId));
    const response = await fetch(
      `/api/supabase/users/${userId}/notifications/${notificationId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_read: true }),
      },
    );
    dispatch(markNotificationAsRead(notificationId));
    const data = await response.json();
    return data;
  },
);

// Mark a notification as unread in the database
export const markNotificationAsUnreadInDB = createAsyncThunk(
  "notifications/markNotificationAsUnreadInDB",
  async ({ userId, notificationId }, { dispatch }) => {
    dispatch(setNotificationBeingUpdated(notificationId));
    const response = await fetch(
      `/api/supabase/users/${userId}/notifications/${notificationId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_read: false }),
      },
    );
    dispatch(markNotificationAsUnread(notificationId));
    const data = await response.json();
    return data;
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
// Add a new broadcast notification based on roles
export const broadcastNotificationBasedOnRoles = createAsyncThunk(
  "notifications/broadcastNotificationBasedOnRoles",
  async ({ roles, title, content }) => {
    const response = await fetch(
      `/api/supabase/notifications/broadcast/based-on-roles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roles, title, content }),
      },
    );
    const data = await response.json();
    return data; // Assuming the API returns { success: true, data: {...}, message: "..." }
  },
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async ({ userId, notificationId }, { dispatch }) => {
    dispatch(setNotificationBeingDeleted(notificationId));
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
        notification.is_read = true;
      }
    },
    markNotificationAsUnread: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (notification) => notification.id === notificationId,
      );
      if (notification) {
        notification.is_read = false;
      }
    },
    setNotificationBeingUpdated: (state, action) => {
      state.notificationBeingUpdated = action.payload;
    },
    setNotificationBeingDeleted: (state, action) => {
      state.notificationBeingDeleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(broadcastNotificationBasedOnRoles.pending, (state) => {
        state.isBroadcastingNotification = true;
        state.error = null;
      })
      .addCase(broadcastNotificationBasedOnRoles.fulfilled, (state, action) => {
        state.isBroadcastingNotification = false;
        state.notifications.push(action.payload);
      })
      .addCase(broadcastNotificationBasedOnRoles.rejected, (state, action) => {
        state.isBroadcastingNotification = false;
        state.error = action.error.message;
      })
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
        state.notificationBeingDeleted = -1;
        const notificationId = action.payload;
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== notificationId,
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.isDeletingNotification = false;
        state.notificationBeingDeleted = -1;
        state.error = action.error.message;
      })
      .addCase(markNotificationAsReadInDB.pending, (state) => {
        state.isUpdatingReadStatus = true;
        state.error = null;
      })
      .addCase(markNotificationAsReadInDB.fulfilled, (state, action) => {
        state.isUpdatingReadStatus = false;
        state.notificationBeingUpdated = -1;
      })
      .addCase(markNotificationAsReadInDB.rejected, (state, action) => {
        state.isUpdatingReadStatus = false;
        state.error = action.error.message;
        state.notificationBeingUpdated = -1;
      })
      .addCase(markNotificationAsUnreadInDB.pending, (state) => {
        state.isUpdatingReadStatus = true;
        state.error = null;
      })
      .addCase(markNotificationAsUnreadInDB.fulfilled, (state, action) => {
        state.isUpdatingReadStatus = false;
        state.notificationBeingUpdated = -1;
      })
      .addCase(markNotificationAsUnreadInDB.rejected, (state, action) => {
        state.isUpdatingReadStatus = false;
        state.error = action.error.message;
        state.notificationBeingUpdated = -1;
      });
  },
});

export const {
  markNotificationAsRead,
  markNotificationAsUnread,
  setNotificationBeingUpdated,
  setNotificationBeingDeleted,
} = notificationSlice.actions;

export default notificationSlice.reducer;
