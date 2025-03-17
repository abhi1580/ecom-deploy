import { registerFormControls } from "@/config";
import CommonForm from "@/components/common/form";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  username: "",
  email: "",
  password: "",
};

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const passwordRequirements = {
    length: formData.password.length >= 6,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    specialChar: /[@#$%^&*()_+!~]/.test(formData.password),
  };

  function validateForm() {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!Object.values(passwordRequirements).every(Boolean)) {
      newErrors.password = "Password does not meet the requirements.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function onSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });
        navigate("/auth/login");
      } else {
        toast({ title: data?.payload?.message, variant: "destructive" });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account?{" "}
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        errors={errors}
      />
      {/* Password Validation Checks */}
      <div className="text-sm text-gray-700">
        <p>Password must contain:</p>
        <div className="mt-2 space-y-1">
          <p
            className={`flex items-center ${
              passwordRequirements.length ? "text-green-600" : "text-red-600"
            }`}
          >
            {passwordRequirements.length ? "✅" : "❌"} At least 6 characters
          </p>
          <p
            className={`flex items-center ${
              passwordRequirements.uppercase ? "text-green-600" : "text-red-600"
            }`}
          >
            {passwordRequirements.uppercase ? "✅" : "❌"} At least one
            uppercase letter (A-Z)
          </p>
          <p
            className={`flex items-center ${
              passwordRequirements.lowercase ? "text-green-600" : "text-red-600"
            }`}
          >
            {passwordRequirements.lowercase ? "✅" : "❌"} At least one
            lowercase letter (a-z)
          </p>
          <p
            className={`flex items-center ${
              passwordRequirements.number ? "text-green-600" : "text-red-600"
            }`}
          >
            {passwordRequirements.number ? "✅" : "❌"} At least one number
            (0-9)
          </p>
          <p
            className={`flex items-center ${
              passwordRequirements.specialChar
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {passwordRequirements.specialChar ? "✅" : "❌"} At least one
            special character (@, #, $, etc.)
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthRegister;
