import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/product-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const SearchProducts = () => {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { searchResults, isLoading } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const dispatch = useDispatch();
  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));

      dispatch(resetSearchResults());
    }
  }, [keyword]);
  //check this in listing page also
  useEffect(() => {
    if (productDetails) {
      setOpenDetailsDialog(true);
    } else {
      setOpenDetailsDialog(false);
    }
  });
  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }
  function handleAddToCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        // console.log(user.id, "userID");

        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product added to cart successfully",
        });
      }
    });
  }
  // console.log(searchResults);
  //Loader
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="relative w-12 h-12">
          <div className="absolute w-12 h-12 border-4 border-gray-600 border-t-transparent animate-spin rounded-full"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
            className="py-6 "
            placeholder="Search Products..."
          />
        </div>
      </div>
      {!searchResults.length ? (
        <h1 className="text-5xl font-extrabold">No product found..!!</h1>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            key={item._id}
            product={item}
            handleAddToCart={handleAddToCart}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
};

export default SearchProducts;
