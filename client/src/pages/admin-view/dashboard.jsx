import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  deleteFeatureImage,
  getFeatureImages,
} from "@/store/common-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2 } from "lucide-react";

const AdminDashboard = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { featureImageList, isLoading } = useSelector(
    (state) => state.commonFeature
  );
  const dispatch = useDispatch();

  const handleUploadFeatureImage = async () => {
    if (!uploadedImageUrl) {
      window.alert("No image selected!");
      setImageFile(null);
      setUploadedImageUrl("");
      return;
    }

    // Set loading state to true while uploading
    setImageLoadingState(true);

    try {
      const data = await dispatch(addFeatureImage(uploadedImageUrl));

      if (data.payload.success) {
        console.log(data.payload.success);
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      } else {
        window.alert("Failed to upload image");
      }
    } catch (error) {
      console.error(error);
      window.alert("An error occurred during the upload");
    } finally {
      // Set loading state to false after upload
      setImageLoadingState(false);
    }
  };

  const handleDeleteFeatureImage = (imageId) => {
    const confirmation = window.confirm("Do you want to delete this image?");
    if (confirmation) {
      dispatch(deleteFeatureImage(imageId)).then(() => {
        dispatch(getFeatureImages());
      });
    }
  };

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Upload Feature Images
      </h1>

      {/* Image Upload Section */}
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />

      {/* Upload Button */}
      <Button
        onClick={handleUploadFeatureImage}
        className={`mt-5 w-full text-white font-medium py-2 px-4 rounded-md transition duration-300 ${
          imageLoadingState || !imageFile
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
        disabled={imageLoadingState || !imageFile}
      >
        {imageLoadingState ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="animate-spin border-t-2 border-white w-4 h-4 rounded-full"></div>
            <span>Uploading...</span>
          </div>
        ) : (
          "Upload"
        )}
      </Button>

      {/* Image Gallery Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((featureImage) => (
            <div key={featureImage._id} className="relative group">
              <img
                src={featureImage.image}
                alt={featureImage.name}
                className="w-full h-40 object-cover rounded-lg shadow-lg transition-transform transform group-hover:scale-105"
              />
              {/* Delete Icon */}
              <button
                onClick={() => handleDeleteFeatureImage(featureImage._id)}
                className="absolute inset-0 flex items-center justify-center bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
              >
                <Trash2 className="w-8 h-8 text-white" />
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500">
            No images available
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
