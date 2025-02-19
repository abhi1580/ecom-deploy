import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const AddressCard = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) => {
  // console.log(selectedId);
  return (
    <Card
      onClick={() => {
        setCurrentSelectedAddress
          ? setCurrentSelectedAddress(addressInfo)
          : null;
      }}
      className={`cursor-pointer ${
        selectedId?._id === addressInfo._id
          ? "border-sky-500 border-[2px] bg-sky-200"
          : ""
      }`}
    >
      <CardContent className=" grid gap-4 p-4">
        <Label className="">Address: {addressInfo?.address}</Label>
        <Label className="">City: {addressInfo?.city}</Label>
        <Label className="">Pincode: {addressInfo?.pincode}</Label>
        <Label className="">Phone: {addressInfo?.phone}</Label>
        <Label className="">Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="flex justify-between p-3">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default AddressCard;
