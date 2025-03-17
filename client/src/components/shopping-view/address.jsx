import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddress,
} from "@/store/shop/address-slice";
import { useToast } from "@/hooks/use-toast";
import AddressCard from "./address-card";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

const Address = ({ setCurrentSelectedAddress, selectedId }) => {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [errors, setErrors] = useState({});
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllAddress(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (isSubmitted) {
      validateForm(); // Run validation only if form was submitted
    }
  }, [formData, isSubmitted]);

  function validateForm() {
    let newErrors = {};

    if (formData.address.trim().length < 3) {
      newErrors.address = "Address must be at least 3 characters.";
    }
    if (formData.city.trim().length < 3) {
      newErrors.city = "City must be at least 3 characters.";
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be a 10-digit number.";
    }
    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be a 6-digit number.";
    }
    if (formData.notes.trim().length < 3) {
      newErrors.notes = "Notes must be at least 3 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  }

  function handleManageAddress(event) {
    event.preventDefault();
    setIsSubmitted(true); // Mark as submitted

    if (!validateForm()) {
      toast({
        title: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "Maximum number of addresses reached",
        variant: "destructive",
      });
      return;
    }

    const action = currentEditedId
      ? editaAddress({
          userId: user?.id,
          addressId: currentEditedId,
          formData,
        })
      : addNewAddress({
          ...formData,
          userId: user?.id,
        });

    dispatch(action).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddress(user?.id));
        setCurrentEditedId(null);
        setFormData(initialAddressFormData);
        setErrors({});
        setIsSubmitted(false); // Reset submission state
        toast({
          title: `Address ${currentEditedId ? "edited" : "added"} successfully`,
        });
      }
    });
  }

  function handleDeleteAddress(getCurrentAddress) {
    const confirm = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (confirm) {
      dispatch(
        deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddress(user?.id));
          toast({ title: "Address deleted successfully" });
        }
      });
    }
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      address: getCurrentAddress?.address || "",
      city: getCurrentAddress?.city || "",
      phone: getCurrentAddress?.phone || "",
      pincode: getCurrentAddress?.pincode || "",
      notes: getCurrentAddress?.notes || "",
    });
    setErrors({});
    setIsSubmitted(false); // Reset submission state when editing
  }

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                selectedId={selectedId}
                key={singleAddressItem._id}
                addressInfo={singleAddressItem}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          errors={isSubmitted ? errors : {}} // Show errors only after submit
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={isSubmitted && Object.keys(errors).length > 0}
        />
      </CardContent>
    </Card>
  );
};

export default Address;
