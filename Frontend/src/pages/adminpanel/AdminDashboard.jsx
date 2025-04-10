import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import ProductImageUpload from "@/components/adminpanel/ProductImageUpload";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();

  // Provide a default value so that featureImageList is never undefined
  const { featureImageList = [] } = useSelector(
    (state) => state.commonFeature || {}
  );

  // Handles image feature upload and refreshes the gallery
  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) return;
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  // Fetch current feature images on mount
  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        {/* Feature Image Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
          />
          <Button
            onClick={handleUploadFeatureImage}
            className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded"
          >
            Upload Feature Image
          </Button>
        </div>

        {/* Feature Images Gallery */}
        <div>
          {featureImageList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featureImageList.map((featureImgItem, index) => (
                <div key={index} className="relative">
                  <img
                    src={featureImgItem.image}
                    alt={`Feature ${index}`}
                    className="w-full h-[300px] object-cover rounded-lg shadow"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No feature images available.</p>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default AdminDashboard;
