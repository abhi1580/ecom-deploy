import { loginFormControls } from "@/config";
import CommonForm from "@/components/common/form";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/auth-slice";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  email: "",
  password: "",
};

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({}); // Add errors state
  const dispatch = useDispatch();
  const { toast } = useToast();

  function validateForm() {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Please enter your email address";
    }
    if (!formData.password) {
      newErrors.password = "Please enter your password";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return false if there are errors
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return; // Validate before submitting

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign In to Your Account
        </h1>
        <p className="mt-2">
          Don't have an account?{" "}
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        errors={errors} // Pass errors to CommonForm
      />
    </div>
  );
};

export default AuthLogin;
