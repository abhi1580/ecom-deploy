import React, { useRef } from "react";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";

const ShoppingOrderDetailsView = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth);
  const printRef = useRef(null);

  // Print function
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=600,height=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Order</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .print-container { max-width: 600px; margin: auto; }
            .print-container label { font-weight: bold; }
            .print-container ul { padding: 0; }
            .print-container li { list-style: none; padding: 5px 0; }
          </style>
        </head>
        <body>
          <div class="print-container">${printContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <DialogTitle className="sr-only">Order Details</DialogTitle>

      {/* Printable Order Section */}
      <div className="grid gap-6" ref={printRef}>
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>₹{orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>

        <Separator />

        {/* Order Items List */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems?.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center justify-between"
                    >
                      <span>Title: {item.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: ₹{item.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>

        <Separator />

        {/* Shipping Information */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.username}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={handlePrint}>
          Print Order
        </Button>
      </div>
    </DialogContent>
  );
};

export default ShoppingOrderDetailsView;
