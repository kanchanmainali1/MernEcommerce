import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import ProductImageUpload from "@/components/adminpanel/ProductImageUpload";
import CommonForm from "@/components/common/CommonForm";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} from "@/store/admin/product-slice";

import AdminProductTile from "@/components/adminpanel/AdminProductTile";

// Initial form data with "brand" removed
const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  // Handle form submission for adding or editing a product
  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      // Editing an existing product
      toast.promise(
        dispatch(editProduct({ id: currentEditedId, formData })).unwrap(),
        {
          loading: "Updating product...",
          success: (data) => {
            if (data?.success) {
              dispatch(fetchAllProducts());
              setFormData(initialFormData);
              setOpenCreateProductsDialog(false);
              setCurrentEditedId(null);
              return data?.message?.title || data?.message || "Product updated successfully";
            }
            return "Product update failed!";
          },
          error: (error) => {
            if (typeof error === "string") {
              return error;
            } else if (error?.title) {
              return error.title;
            }
            return "Failed to update product. Please try again.";
          },
        }
      );
    } else {
      // Adding a new product
      toast.promise(
        dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl, // Use the Cloudinary URL
          })
        ).unwrap(),
        {
          loading: "Adding product...",
          success: (data) => {
            if (data?.success) {
              dispatch(fetchAllProducts());
              setOpenCreateProductsDialog(false);
              setImageFile(null);
              setFormData(initialFormData);
              return data?.message?.title || data?.message || "Product added successfully";
            }
            return "Product addition failed!";
          },
          error: (error) => {
            if (typeof error === "string") {
              return error;
            } else if (error?.title) {
              return error.title;
            }
            return "Failed to add product. Please try again.";
          },
        }
      );
    }
  }

  // Delete a product
  function handleDelete(productId) {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  // Basic form validation ignoring averageReview
  function isFormValid() {
    return Object.keys(formData)
      .filter((key) => key !== "averageReview")
      .every((key) => formData[key] !== "");
  }

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(null);
              setFormData(initialFormData);
              setImageFile(null);
              setUploadedImageUrl("");
            }}
            className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
          >
            Add New Product
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productList && productList.length > 0 ? (
            productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                product={productItem}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                handleDelete={handleDelete}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No products available</p>
          )}
        </div>
      </div>

      {/* Modal Sheet for Add/Edit Product */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setImageFile(null);
          setUploadedImageUrl("");
        }}
      >
        {/* Ensure the modal (and dropdown within it) is on top */}
        <SheetContent side="right" className="overflow-auto max-w-lg p-6 bg-white z-50">
          <SheetHeader className="mb-4 border-b pb-2">
            <SheetTitle className="text-2xl font-semibold text-gray-800">
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          {/* Product Image Upload Section */}
          <div className="mb-6">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isEditMode={currentEditedId !== null}
            />
          </div>

          {/* Product Details Form */}
          <div>
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update Product" : "Add Product"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
