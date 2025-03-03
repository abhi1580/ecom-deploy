import React, { useEffect, useState } from "react";
import ProductFilter from "../../components/shopping-view/filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sortOptions } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/product-slice";
import ShoppingProductTile from "../../components/shopping-view/product-tile";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "../../components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import CustomPagination from "@/components/common/pagination";

const ShoppingList = () => {
  const dispatch = useDispatch();
  const { productList, productDetails, isLoading, totalProducts, showing } =
    useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalProducts / limit);

  useEffect(() => {
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    sessionStorage.setItem("filters", JSON.stringify(filters));

    // const params = new URLSearchParams();
    // Object.entries(filters).forEach(([key, value]) => {
    //   if (Array.isArray(value) && value.length > 0) {
    //     params.append(key, value.join(","));
    //   }
    // });
    // params.set("page", currentPage);
    // params.set("limit", limit);
    // params.set("sort", sort);

    const params = new URLSearchParams({
      page: currentPage,
      limit,
      sort,
      ...Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(",") : value,
        ])
      ),
    });

    setSearchParams(params);
  }, [filters, currentPage, sort]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: filters,
        sortParams: sort,
        page: currentPage,
        limit,
      })
    );
  }, [dispatch, sort, filters, currentPage]);

  const handleSort = (value) => {
    setSort(value);
  };

  const handleFilter = (sectionId, option) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (!updatedFilters[sectionId]) updatedFilters[sectionId] = [];

      const optionIndex = updatedFilters[sectionId].indexOf(option);
      if (optionIndex === -1) {
        updatedFilters[sectionId].push(option);
      } else {
        updatedFilters[sectionId].splice(optionIndex, 1);
      }

      return { ...updatedFilters };
    });
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  const handleAddToCart = (productId, totalStock) => {
    const cartItemsList = cartItems.items || [];
    const existingItem = cartItemsList.find(
      (item) => item.productId === productId
    );

    if (existingItem && existingItem.quantity + 1 > totalStock) {
      toast({
        title: `Only ${existingItem.quantity} quantity can be added for this item`,
        variant: "destructive",
      });
      return;
    }

    dispatch(addToCart({ userId: user.id, productId, quantity: 1 })).then(
      (data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({ title: "Product added to cart successfully" });
        }
      }
    );
  };

  useEffect(() => {
    setOpenDetailsDialog(Boolean(productDetails));
  }, [productDetails]);

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
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 p-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <ProductFilter filters={filters} handleFilter={handleFilter} />
      </div>

      <div className="bg-white w-full rounded-lg shadow-md">
        <div className="p-5 border-b flex items-center justify-between bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-900">All Products</h2>
          <div className="flex items-center gap-4">
            {/* <span className="text-gray-600">{totalProducts} Products</span> */}
            {productList && productList.length > 1 ? (
              <span className="text-gray-600">{showing}</span>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowUpDownIcon className="h-4 w-4 text-gray-600" />
                  <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] shadow-lg bg-white"
              >
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((item) => (
                    <DropdownMenuRadioItem key={item.id} value={item.id}>
                      {item.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
          {productList.length ? (
            productList.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
                handleAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full py-6">
              No products found.
            </p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="border-t bg-gray-50 py-4 flex justify-center rounded-b-lg">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
};

export default ShoppingList;
