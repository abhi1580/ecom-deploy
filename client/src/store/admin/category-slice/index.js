import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  categories: [],
};

export const getAllCategoriesForAdmin = createAsyncThunk(
  "/category/getAllCategories",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/categories/get`
    );

    return response.data;
  }
);
export const addNewCategory = createAsyncThunk(
  "/category/addNewCategory",
  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/categories/add`,
      formData
    );

    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  "/category/deleteCategory",
  async (id) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/admin/categories/delete/${id}`
    );

    return response.data;
  }
);

const categorySlice = createSlice({
  name: "categorySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategoriesForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCategoriesForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.options;
      })
      .addCase(getAllCategoriesForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.categories = [];
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.options;
      });

    // other slice reducers...
  },
});

export default categorySlice.reducer;
