"use client";

import { useState } from "react";
import { GoogleSignInButton } from "@/components/SignInWithGoogle";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loading,setLoading]=useState<boolean>(false);

  const validate = (): boolean => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        const res = await signIn("credentials", {
          redirect: true,
          callbackUrl: '/', 
          email,
          password,
        });
        if (res?.error) {
          throw(res.error);
        } else {
          toast.success('Login successfull');
        }
      } catch (error:any) {
        toast.error(error)
      }
      finally{
        setLoading(false)
      }
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="h-full w-full sm:max-w-md sm:h-auto rounded-none sm:rounded-xl bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-800">
          Login to <span className="text-purple-500">Committask</span> account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full rounded-md border p-2 text-sm text-gray-800 focus:border-purple-500 outline-0 placeholder-gray-300 ${emailError ? "border-red-600" : "border-gray-300"
                }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

              }}
              onFocus={() => setEmailError("")}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`w-full rounded-md border p-2 text-sm text-gray-800 focus:border-purple-500 outline-0  placeholder-gray-300 ${passwordError ? "border-red-600" : "border-gray-300"
                }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onFocus={() => setPasswordError("")}
              placeholder="Your password"
              autoComplete="new-password"
            />
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gradient-to-r from-purple-500 p-2 via-purple-600 to-purple-700 hover:bg-gradient-to-br cursor-pointer text-white transition"
          >
          {loading?'Login ...':'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-center space-x-2">
          <div className="h-px w-16 bg-gray-300" />
          <span className="text-sm text-gray-500">or continue with</span>
          <div className="h-px w-16 bg-gray-300" />
        </div>

        <GoogleSignInButton />

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-purple-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
