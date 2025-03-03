import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  totalProducts: 0,
  showing: "",
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams, page, limit }, { rejectWithValue }) => {
    const query = new URLSearchParams();

    // Convert filters properly
    Object.entries(filterParams).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        query.append(key, value.join(",")); // Convert arrays to comma-separated values
      } else if (value) {
        query.append(key, value);
      }
    });

    // Add other params
    query.append("sortBy", sortParams);
    query.append("page", page);
    query.append("limit", limit);

    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/api/shop/products/get?${query.toString()}`
    );

    return response.data; // Ensure API returns `{ products: [], totalCount: 0 }`
  }
);

//get single product based on id
export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    // console.log(fetchAllFilteredProducts, "fetchAllFilteredProducts");

    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`
    );

    // console.log(result);

    return result?.data;
  }
);
const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.isLoading = false;
        state.productList = action.payload.data;
        state.totalProducts = action.payload.totalProducts;
        state.showing = action.payload.showing;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});
export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
