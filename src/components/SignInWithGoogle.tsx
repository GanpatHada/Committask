"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export const GoogleSignInButton: React.FC = () => {
  
  return (
    <button
      onClick={()=>signIn("google",{callbackUrl:"/"})}
      className="flex w-full items-center justify-center cursor-pointer space-x-3 rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 transition hover:bg-gray-50"
    >
      <FcGoogle className="text-xl" />
      <span>Sign up with Google</span>
    </button>
  );
};
