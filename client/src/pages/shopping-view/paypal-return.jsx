import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const PaypalReturnPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        console.log(data);
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8 text-center bg-white shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Processing Payment... Please Wait!!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center mt-4">
          <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaypalReturnPage;
