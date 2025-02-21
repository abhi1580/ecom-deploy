import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import React from "react";

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8 text-center bg-white shadow-lg rounded-2xl">
        <CardHeader>
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <CardTitle className="text-3xl font-bold text-gray-900">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-lg">
            Your payment was not completed.
          </p>
          <button
            className="mt-6 w-full text-lg bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            onClick={() => navigate("/shop/home")}
          >
            Return to Shop
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelPage;
