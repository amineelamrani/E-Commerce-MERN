import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function AccountVerification() {
  const [value, setValue] = useState("");
  let { mail } = useParams();
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    document.title =
      "Verify Account | FOREVER Store | The best store with the best quality price ration";
  }, []);

  const verifyAccountFetch = async (val) => {
    const res = await fetch(
      `/api/v1/users/verify?uniqueString=${val}&mail=${mail}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    if (data && data.status === "success") {
      setLoading(false);
      navigate("/orders");
    }
  };

  return (
    <div className="flex flex-col items-center my-14">
      <h1 className="text-2xl font-bold">Verify your account</h1>
      <p className="italic text-sm pb-8">
        Check your mailbox and paste the code given in the mail
      </p>
      <div className="space-y-2">
        <div className="text-center text-sm">
          {value === "" ? (
            <>Enter your one-time password.</>
          ) : (
            <>You entered: {value}</>
          )}
        </div>
        <InputOTP
          maxLength={12}
          value={value}
          onChange={(value) => {
            if (value.length < 12) {
              setValue(value);
            } else if (value.length === 12) {
              setLoading(true);
              setValue(value);
              verifyAccountFetch(value);
            }
          }}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
            <InputOTPSlot index={6} />
            <InputOTPSlot index={7} />
            <InputOTPSlot index={8} />
            <InputOTPSlot index={9} />
            <InputOTPSlot index={10} />
            <InputOTPSlot index={11} />
          </InputOTPGroup>
        </InputOTP>
        {loading && <LoadingSpinner className="my-5 mx-auto" />}
      </div>
    </div>
  );
}
