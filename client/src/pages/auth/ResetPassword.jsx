import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useParams } from "react-router";

export default function ResetPassword() {
  const [inputData, setInputData] = useState({
    resetToken: "",
    password: "",
    confirmPassword: "",
  });
  let { mail } = useParams();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // check data before sending the request to the server : password is the same as confirmPassword
    await signUpFetch();
  };

  const signUpFetch = async () => {
    const res = await fetch(
      `/api/v1/users/resetPassword/${mail}/${inputData.resetToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: inputData.password,
          confirmPassword: inputData.confirmPassword,
        }),
      }
    );
    const data = await res.json();
    if (data && data.status === "success") {
      // redirect to /verify-account route to verify the account creation
      navigate(`/orders`);
    }
  };

  return (
    <div className="flex flex-col items-center my-14">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="resetToken">Reset Token</Label>
            <Input
              id="resetToken"
              type="name"
              placeholder="Reset Token"
              value={inputData.resetToken}
              onChange={(e) =>
                setInputData({ ...inputData, ["resetToken"]: e.target.value })
              }
              required
            />
          </div>

          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
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
              Reset password
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
