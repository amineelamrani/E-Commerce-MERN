import { LoginForm } from "@/components/LoginForm";
import React from "react";

export default function LogIn() {
  return (
    <div className="flex my-10 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
