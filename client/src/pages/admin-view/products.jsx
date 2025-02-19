import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { useToast } from "@/hooks/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Item } from "@radix-ui/react-select";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "0",
  salePrice: "",
  totalStock: "",
};
const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // console.log("productList", productList);
  // console.log(uploadedImageUrl);

  function onSubmit(e) {
    e.preventDefault();

    currentEditedId != null
      ? dispatch(editProduct({ id: currentEditedId, formData })).then(
          (data) => {
            if (data.payload.success) {
              dispatch(fetchAllProducts());
              setOpenCreateProductsDialog(false);
              setImageFile(null);
              setFormData(initialFormData);
              toast({
                title: "Product edited successfully",
              });
              setCurrentEditedId(null);
            }
          }
        )
      : dispatch(addNewProduct({ ...formData, image: uploadedImageUrl })).then(
          (data) => {
            if (data.payload.success) {
              dispatch(fetchAllProducts());
              setOpenCreateProductsDialog(false);
              setImageFile(null);
              setFormData(initialFormData);
              toast({
                title: "Product added successfully",
              });
            }
          }
        );
  }
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  //delete a product
  function handleDelete(getcurrentProductId) {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    console.log(confirm);
    console.log(getcurrentProductId);
    if (confirm) {
      dispatch(deleteProduct(getcurrentProductId)).then((data) => {
        if (data.payload.success) {
          dispatch(fetchAllProducts());
          toast({
            title: "Product deleted successfully",
            variant: "destructive",
          });
        }
      });
    } else {
      console.log(confirm);
    }
  }
  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          {" "}
          Add new product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                setCurrentEditedId={setCurrentEditedId}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setFormData={setFormData}
                key={productItem._id}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false),
            setCurrentEditedId(null),
            setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            currentEditedId={currentEditedId}
            isEditMode={currentEditedId !== null}
          />
          {/* ***************************************************************************************************************** */}
          {/* {
            //if image is selected then display the selected image here if clicked on remove button then remove image div also

            imageFile && (
              <div className="text-center">
                <img
                  className="max-w-sm mx-auto rounded-lg w-40 h-30 mt-3"
                  src={uploadedImageUrl}
                  alt="Uploading Image..."
                />
              </div>
            )
          } */}
          {/* ************************************************************************************************************************ */}
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              formControls={addProductFormElements}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default AdminProducts;
