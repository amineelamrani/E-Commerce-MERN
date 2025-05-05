import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

export function Signupformul({ className, ...props }) {
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // check data before sending the request to the server : password is the same as confirmPassword
    await signUpFetch();
  };

  const signUpFetch = async () => {
    const res = await fetch("/api/v1/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });
    const data = await res.json();
    if (data && data.status === "success") {
      // redirect to /verify-account route to verify the account creation
      navigate(`/verify-account/${inputData.email}`);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <h1 className="relative font-serif italic text-2xl after:content-[''] after:absolute after:top-1/2 after:w-14 after:h-[2px] after:bg-black mx-auto">
          Sign Up
        </h1>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder="Name"
                  value={inputData.name}
                  onChange={(e) =>
                    setInputData({ ...inputData, ["name"]: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={inputData.email}
                  onChange={(e) =>
                    setInputData({ ...inputData, ["email"]: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <p className="ml-auto inline-block text-xs md:text-sm underline-offset-4 hover:underline">
                    <Link to="/forgot-password">Forgot your password?</Link>
                  </p>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={inputData.password}
                  onChange={(e) =>
                    setInputData({ ...inputData, ["password"]: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={inputData.confirmPassword}
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      ["confirmPassword"]: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Have an account?{" "}
              <Link to="/login" className="underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
