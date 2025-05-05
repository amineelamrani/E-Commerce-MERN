import { Signupformul } from "@/components/Signupformul";
import { useEffect } from "react";

export default function SignUp() {
  useEffect(() => {
    document.title =
      "Sign Up | FOREVER Store | The best store with the best quality price ration";
  }, []);
  return (
    <div className="flex my-10 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Signupformul />
      </div>
    </div>
  );
}
