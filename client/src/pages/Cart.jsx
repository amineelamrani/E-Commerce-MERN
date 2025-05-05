import CartItemComponent from "@/components/CartItemComponent";
import { Button } from "@/components/ui/button";
import UserContext from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function Cart() {
  const [cartContent, setCartContent] = useState(
    localStorage.eCommerceForever
      ? JSON.parse(localStorage.eCommerceForever)
      : null
  );
  const { setBasket, currentUser, setProductsToBuy } = useContext(UserContext);
  let cartContentItems = <h1>Cart Empty!</h1>;
  let navigate = useNavigate();

  let subTotal = 0;
  if (cartContent !== null) {
    for (let i = 0; i < cartContent.length; i++) {
      subTotal += cartContent[i].quantity * cartContent[i].price;
    }
  }

  useEffect(() => {
    if (cartContent === null) return;
    localStorage.eCommerceForever = JSON.stringify(cartContent);
    setBasket((basket) => !basket);
  }, [cartContent]);

  useEffect(() => {
    document.title =
      "My Cart | FOREVER Store | The best store with the best quality price ration";
  }, []);

  const handleChange = (e, position) => {
    // need to update the content in the localStorage after clicking on the increase quantity input field
    const cartCopy = [...cartContent];
    cartCopy[position].quantity = e.target.value * 1;
    setCartContent(cartCopy);
  };

  const handleDelete = (e) => {
    const position = e.target.id.split("-")[1];
    if (position === undefined) return;
    const cartCopy = cartContent.filter((_, index) => index !== position * 1);
    setCartContent(cartCopy);
  };

  const handleCheckoutClick = () => {
    if (currentUser === null) {
      toast("You must be logged in to checkout!", {
        duration: 2000,
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
    } else {
      // past localstorage content to productsToBuy state
      setProductsToBuy(JSON.parse(localStorage.eCommerceForever));
      // redirect to /order page
      navigate("/orders");
    }
  };

  if (cartContent !== null) {
    cartContentItems = cartContent.map((item, index) => {
      return (
        <CartItemComponent
          item={item}
          position={index}
          key={index}
          handleChange={handleChange}
          handleDelete={handleDelete}
        />
      );
    });
  }

  return (
    <div className="pt-18 flex flex-col gap-2">
      <Toaster
        position="top-right"
        expand={true}
        richColors
        visibleToasts={1}
      />
      <h1 className="mb-4 relative text-xl md:text-2xl font-bold after:content-[''] after:absolute after:top-1/2 after:w-8 md:after:w-14 after:h-[2px] after:bg-black">
        <span className="text-slate-500">YOUR</span> CART
      </h1>
      <div>{cartContentItems}</div>

      {cartContent !== null && cartContent.length > 0 && (
        <div className="mt-15 w-full flex flex-col items-end ">
          <div className="flex flex-col items-start w-2/3 md:w-1/2">
            <h1 className="mr-14 relative text-xl md:text-2xl font-bold after:content-[''] after:absolute after:top-1/2 after:w-8 md:after:w-14 after:h-[2px] after:bg-black">
              <span className="text-slate-500">CART</span> TOTALS
            </h1>
            <div className="flex flex-row w-full justify-between py-2 text-xs md:text-base">
              <h2>Subtotal</h2>
              <p>${subTotal}</p>
            </div>
            <div className="flex flex-row w-full justify-between border-t border-b py-2 text-xs md:text-base">
              <h2>Shipping Fee</h2>
              <p>$10</p>
            </div>
            <div className="flex flex-row w-full justify-between py-2 font-bold text-xs md:text-base">
              <h2>Total</h2>
              <p>${subTotal + 10 * 1}</p>
            </div>
            <div className="w-full flex flex-col items-end pt-3">
              <Button
                className="px-2 md:px-5 text-xs md:text-base"
                onClick={handleCheckoutClick}
              >
                PROCEED TO CHECKOUT
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
