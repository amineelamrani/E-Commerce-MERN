import UserContext from "@/context/UserContext";
import React, { useContext, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const submitRef = useRef(null);
  // /!\ This is only for authorized people

  // first check the total - check if the products are all set (you need to check if there is a task done manually by the client inside the code(no unauthorized code manipulation should be done by the client on the front end))
  // we will have a comm with the server to check for the consistency of the data in the productsToBuy state (userContext)

  // Check the coherence of the data sent

  // This is for authorized people only (done in the Routes)
  // First get the Total price of the products given
  // check for the consistency of the order (or do not prioritize it in this MVP)
  // handle Stripe(sandbox) and Paypal(Sandbox) and COD
  // check for the consistency of the delivery information (in both front end and backend)
  // Possible improve the payment process for the stripe and sandbox (maybe I will need to align with the documentation)

  const { productsToBuy } = useContext(UserContext);

  let subTotal = 0,
    total = 0;
  for (let i = 0; i < productsToBuy.length; i++) {
    subTotal += productsToBuy[i].quantity * productsToBuy[i].price;
  }
  total = subTotal + 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted...");
  };

  return (
    <div className="flex flex-col md:flex-row w-full py-15 gap-5">
      <div className="w-1/2">
        <h1 className="mb-4 relative text-2xl font-bold after:content-[''] after:absolute after:top-1/2 after:w-14 after:h-[2px] after:bg-black">
          <span className="text-slate-500">DELIVERY</span> INFORMATION
        </h1>
        <form className="w-full flex flex-wrap gap-x-4" onSubmit={handleSubmit}>
          <Input type="text" placeholder="First name" className="flex-1" />
          <Input type="text" placeholder="Last name" className="flex-1" />
          <Input
            type="email"
            placeholder="Email adress"
            className="w-full my-2"
          />
          <Input type="text" placeholder="Street" className="w-full" />
          <Input type="text" placeholder="City" className="flex-1 my-2" />
          <Input type="text" placeholder="State" className="flex-1 my-2" />
          <div className="w-full h-0"></div>
          <Input type="number" placeholder="Zipcode" className="flex-1" />
          <Input type="text" placeholder="Country" className="flex-1" />
          <Input type="number" placeholder="Phone" className="w-full my-2" />
          <button
            className="text-[10px] mx-auto hidden"
            type="submit"
            ref={submitRef}
          >
            Use a ref for the other button so when you click it means like you
            clicked this one that will be hidden
          </button>
        </form>
      </div>

      <div className="flex flex-col items-start w-1/2">
        <h1 className="mb-4 relative text-2xl font-bold after:content-[''] after:absolute after:top-1/2 after:w-14 after:h-[2px] after:bg-black">
          <span className="text-slate-500">CART</span> TOTALS
        </h1>
        <div className="flex flex-row w-full justify-between py-2">
          <h2>Subtotal</h2>
          <p>${subTotal}</p>
        </div>
        <div className="flex flex-row w-full justify-between border-t border-b py-2">
          <h2>Shipping Fee</h2>
          <p>$10</p>
        </div>
        <div className="flex flex-row w-full justify-between py-2 font-bold">
          <h2>Total</h2>
          <p>${total}</p>
        </div>
        <div className="my-5 w-full">
          <h1 className="mb-4 relative text-2xl font-bold after:content-[''] after:absolute after:top-1/2 after:w-14 after:h-[2px] after:bg-black">
            <span className="text-slate-500">PAYMENT</span> METHOD
          </h1>
          <div className="flex flex-row gap-2 py-2">
            <Button className="flex-1">STRIPE</Button>
            <Button className="flex-1" variant="secondary">
              PAYPAL
            </Button>
            <Button className="flex-1" variant="destructive">
              COD
            </Button>
          </div>
        </div>
        <div className="w-full flex flex-col items-end pt-3">
          <Button className="px-8 " onClick={() => submitRef.current.click()}>
            PLACE ORDER
          </Button>
        </div>
      </div>
    </div>
  );
}
