const Address = require("../../models/Address");
const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;
    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid data provided" });
    }
    const newnewlyCreatedAddress = new Address({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });
    await newnewlyCreatedAddress.save();
    res.status(201).json({ success: true, data: newnewlyCreatedAddress });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured" });
  }
};
const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "UserId is required" });
    }
    const addressList = await Address.find({ userId });
    res.status(200).json({ success: true, data: addressList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured" });
  }
};
const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;
    if (!userId || !addressId) {
      return res
        .status(400)
        .json({ success: false, message: "UserId and addressId is required" });
    }
    const address = await Address.findByIdAndUpdate(
      { _id: addressId, userId },
      formData,
      { new: true }
    );
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    res.status(200).json({ success: true, data: address });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured" });
  }
};
const deleteAddress = async (req, res) => {
  console.log("Delete address controller has been called");
  try {
    const { userId, addressId } = req.params;
    console.log(userId);
    console.log(addressId);
    console.log(userId, addressId);
    if (!userId || !addressId) {
      return res
        .status(400)
        .json({ success: false, message: "UserId and addressId is required" });
    }
    const address = await Address.findByIdAndDelete({ _id: addressId, userId });
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured" });
  }
};
module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };
