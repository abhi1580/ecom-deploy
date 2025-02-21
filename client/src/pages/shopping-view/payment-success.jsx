import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8 text-center bg-white shadow-lg rounded-2xl">
        <CardHeader className="p-0 flex flex-col items-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-bold text-gray-900">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-lg">Thank you for your purchase.</p>
          <Button
            className="mt-6 w-full text-lg"
            onClick={() => navigate("/shop/account")}
          >
            View Orders
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
