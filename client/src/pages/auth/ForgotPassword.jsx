import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";

export default function ForgotPassword() {
  const [mail, setMail] = useState("");
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // check data before sending the request to the server : password is the same as confirmPassword
    await signUpFetch();
  };
  useEffect(() => {
    document.title =
      "Forgot Password | FOREVER Store | The best store with the best quality price ration";
  }, []);

  const signUpFetch = async () => {
    const res = await fetch("/api/v1/users/forgetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: mail }),
    });
    const data = await res.json();
    if (data && data.status === "success") {
      // redirect to /verify-account route to verify the account creation
      navigate(`/reset-password/${mail}`);
    }
  };

  return (
    <div className="flex flex-col items-center my-14">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full">
              Forgot password
            </Button>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/sign-up" className="underline">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
