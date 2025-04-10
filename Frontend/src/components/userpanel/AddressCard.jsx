import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-shadow hover:shadow-xl border-2 ${
        selectedId?._id === addressInfo?._id ? "border-blue-500" : "border-gray-200"
      }`}
    >
      <CardContent className="p-4">
        <div className="space-y-1">
          <Label className="block text-gray-800 font-medium">
            Address: {addressInfo?.address}
          </Label>
          <Label className="block text-gray-700">City: {addressInfo?.city}</Label>
          <Label className="block text-gray-700">Pincode: {addressInfo?.pincode}</Label>
          <Label className="block text-gray-700">Phone: {addressInfo?.phone}</Label>
          <Label className="block text-gray-700">Notes: {addressInfo?.notes}</Label>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between border-t border-gray-200">
        <Button
          onClick={() => handleEditAddress(addressInfo)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
        >
          Edit
        </Button>
        <Button
          onClick={() => handleDeleteAddress(addressInfo)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
