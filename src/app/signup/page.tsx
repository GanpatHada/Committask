"use client";

import { GoogleSignInButton } from "@/components/SignInWithGoogle";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading]=useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try{
        setLoading(true);
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data.message)
        } else {
          throw new Error('something went wrong')
        }
      }
      catch (err:any) {
      toast.error(err.message || 'unexpected error has occured');
    }
    finally{
      setLoading(false)
    }
  }
};

const clearError = (field: keyof typeof errors) => {
  if (errors[field]) {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  }
};

const getInputClass = (error: string) =>
  `w-full rounded-md border p-2 text-sm focus:outline-none placeholder-gray-300 text-gray-800 focus:border-purple-500 outline-0 ${error ? "border-red-500" : "border-gray-300"
  }`;

return (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
    <div className="h-full w-full sm:max-w-md sm:h-auto rounded-none sm:rounded-xl bg-white p-8 shadow-md">
      <h2 className="mb-6 text-center text-xl font-bold text-gray-800">Create a <span className="text-purple-500">Committask</span> account</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className={getInputClass(errors.name)}
            value={name}
            onChange={(e) => {
              setName(e.target.value);

            }}
            onFocus={() => clearError("name")}
            placeholder="Your full name"
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className={getInputClass(errors.email)}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

            }}
            onFocus={() => clearError("email")}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            className={getInputClass(errors.password)}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);

            }}
            onFocus={() => clearError("password")}
            placeholder="Create a password"
            autoComplete="new-password"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className={getInputClass(errors.confirmPassword)}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);

            }}
            onFocus={() => clearError("confirmPassword")}
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-gradient-to-r from-purple-500 p-2  via-purple-600 to-purple-700 hover:bg-gradient-to-br cursor-pointer text-white transition"
        >
        {loading?'Sign up ...':'Sign up'}
        </button>
      </form>

      {/* Google Sign-in */}
      <div className="my-6 flex items-center justify-center space-x-2">
        <div className="h-px w-16 bg-gray-300" />
        <span className="text-sm text-gray-500">or continue with</span>
        <div className="h-px w-16 bg-gray-300" />
      </div>
      <GoogleSignInButton />

      {/* Login Link */}
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account? <a href="/login" className="text-purple-600 hover:underline">Log in</a>
      </p>
    </div>
  </div>
);
}
