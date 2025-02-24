import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tailwindConfig from "../../tailwind.config.mjs";

const themeConfigs = tailwindConfig.daisyui.themes.reduce((acc, theme) => {
  const [themeName, colors] = Object.entries(theme)[0];
  acc[themeName] = colors;
  return acc;
}, {});

export const fetchTheme = createAsyncThunk("ui/fetchTheme", async (user_id) => {
  const response = await fetch(`/api/supabase/users/${user_id}/theme`);
  if (!response.ok) {
    throw new Error("Failed to fetch theme");
  }
  const data = await response.json();
  return data.name;
});

export const updateTheme = createAsyncThunk(
  "ui/updateTheme",
  async ({ user_id, themeName }) => {
    const response = await fetch(`/api/supabase/users/${user_id}/theme`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: themeName }),
    });

    if (!response.ok) {
      throw new Error("Failed to update theme");
    }

    return themeName;
  },
);

const initialState = {
  isSidebarOpen: false,
  theme: null,
  availableThemes: Object.keys(themeConfigs),
  isFetchingTheme: true,
  isUpdatingTheme: false,
  themeConfigs,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTheme.pending, (state) => {
        state.isFetchingTheme = true;
      })
      .addCase(fetchTheme.fulfilled, (state, action) => {
        state.isFetchingTheme = false;
        if (state.availableThemes.includes(action.payload)) {
          state.theme = action.payload;
        }
      })
      .addCase(fetchTheme.rejected, (state, action) => {
        state.isFetchingTheme = false;
        state.theme = "light";
      })
      .addCase(updateTheme.pending, (state) => {
        state.isUpdatingTheme = true;
      })
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.isUpdatingTheme = false;
        if (state.availableThemes.includes(action.payload)) {
          state.theme = action.payload;
        }
      })
      .addCase(updateTheme.rejected, (state, action) => {
        state.isUpdatingTheme = false;
        console.error("Failed to update theme:", action.error);
      });
  },
});

export const { toggleSidebar, closeSidebar, openSidebar, setTheme } =
  uiSlice.actions;
export default uiSlice.reducer;
