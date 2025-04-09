import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import LoadingSpinner from "./ui/LoadingSpinner";
import UserContext from "@/context/UserContext";
import React, { useContext } from "react";

export function LoginForm({ className, ...props }) {
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { setNewLogin } = useContext(UserContext);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    // check data before sending the request to the server : password is the same as confirmPassword
    await signUpFetch();
  };

  const signUpFetch = async () => {
    const res = await fetch("/api/v1/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });
    const data = await res.json();
    if (data && data.status === "success") {
      setLoading(false);
      setError(false);
      setNewLogin((val) => !val);
      // redirect to /verify-account route to verify the account creation
      navigate(`/orders`);
    } else {
      setError(true);
    }
  };

  if (error) {
    toast.error("An error has occured! Please reenter your credentials", {
      duration: 3000,
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Toaster
        position="top-right"
        expand={true}
        richColors
        visibleToasts={1}
      />
      <Card>
        <h1 className="relative font-serif italic text-2xl after:content-[''] after:absolute after:top-1/2 after:w-14 after:h-[2px] after:bg-black mx-auto">
          Login
        </h1>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={inputData.email}
                  onChange={(e) => {
                    setLoading(false);
                    setError(false);
                    setInputData({ ...inputData, ["email"]: e.target.value });
                  }}
                  required
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <p className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    <Link to="/forgot-password">Forgot your password?</Link>
                  </p>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={inputData.password}
                  onChange={(e) => {
                    setLoading(false);
                    setError(false);
                    setInputData({
                      ...inputData,
                      ["password"]: e.target.value,
                    });
                  }}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                {!loading && (
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                )}
                {loading && <LoadingSpinner className="mx-auto" />}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/sign-up" className="underline">
                Sign Up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
