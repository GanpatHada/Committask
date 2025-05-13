import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

interface StateType {
  name: string;
  email: string;
  image?: string | null;
  theme: "SYSTEM" | "DARK" | "LIGHT";
  themeUpdating: boolean;
}

const initialState: StateType = {
  name: "",
  email: "",
  theme: "SYSTEM",
  themeUpdating: false,
};

export const updateTheme = createAsyncThunk(
  "user/updateTheme",
  async (newTheme: "LIGHT" | "DARK" | "SYSTEM", thunkAPI) => {
   try {
      await toast.promise(
        fetch("/api/user", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: newTheme }),
          credentials: "include",
        }).then((res) => {
          if (!res.ok) throw new Error("Failed to update theme");
        }),
        {
          loading: 'applying theme...',
          success: 'Theme applied successfully!',
          error: 'Failed to apply theme',
        }
      );
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser(
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        theme: "SYSTEM" | "DARK" | "LIGHT";
        image?: string;
      }>
    ) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.image = action.payload.image ?? null;
      state.theme = action.payload.theme;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTheme.pending, (state) => {
        state.themeUpdating = true;
      })
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.themeUpdating = false;
      })
      .addCase(updateTheme.rejected, (state, action) => {
        state.themeUpdating = false;
      });
  },
});

export const { saveUser } = userSlice.actions;
export default userSlice.reducer;
