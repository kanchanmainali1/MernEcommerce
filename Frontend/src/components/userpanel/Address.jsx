import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from "@/store/user/address-slice";
import CommonForm from "../common/CommonForm";
import { addressFormControls } from "@/config";
import AddressCard from "./AddressCard";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.userAddress);

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast.error("You can add maximum 3 addresses.");
      return;
    }

    const action =
      currentEditedId !== null
        ? dispatch(
            editaAddress({
              userId: user?.id,
              addressId: currentEditedId,
              formData,
            })
          )
        : dispatch(
            addNewAddress({
              ...formData,
              userId: user?.id,
            })
          );

    toast.promise(action, {
      loading: currentEditedId !== null ? "Updating Address..." : "Adding Address...",
      success: (data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(user?.id));
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
          return currentEditedId !== null ? "Address updated successfully" : "Address added successfully";
        }
      },
      error: "Something went wrong. Please try again.",
    });
  }

  function handleDeleteAddress(getCurrentAddress) {
    const action = dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    );

    toast.promise(action, {
      loading: "Deleting Address...",
      success: (data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(user?.id));
          return "Address deleted successfully";
        }
      },
      error: "Failed to delete address. Please try again.",
    });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes,
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch, user?.id]);

  return (
    <Card className="bg-white shadow-lg rounded-lg">
      <div className="mb-5 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addressList && addressList.length > 0 ? (
          addressList.map((singleAddressItem) => (
            <AddressCard
              key={singleAddressItem._id}
              selectedId={selectedId}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={singleAddressItem}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No addresses found. Please add an address.
          </p>
        )}
      </div>
      <CardHeader className="border-t">
        <CardTitle className="text-xl font-bold text-gray-800">
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
