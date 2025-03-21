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

// Initial form data
const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
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

  // Handle form submission for Add or Edit (using toast.promise)
  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      // Editing an existing product
     
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
      .map((key) => formData[key] !== "")
      .every((filled) => filled);
  }

  // Fetch all products on mount
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  console.log("Current Form Data:", formData);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        {/* This button resets the form for a new product */}
        <Button
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setImageFile(null);
            setUploadedImageUrl("");
          }}
        >
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                product={productItem}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>

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
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          {/* Product Image Upload */}
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          {/* Form for adding/editing product details */}
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
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
