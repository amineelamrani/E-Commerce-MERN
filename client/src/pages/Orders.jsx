import UserContext from "@/context/UserContext";
import { useContext, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { useNavigate } from "react-router";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Check } from "lucide-react";

export default function Orders() {
  const submitRef = useRef(null);
  let navigate = useNavigate();

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
  const [deliveryInformation, setDeliveryInformation] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (paymentSuccess) {
      const timeoutId = setTimeout(() => {
        localStorage.removeItem("eCommerceForever");
        navigate("/cart");
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [paymentSuccess]);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      // show a popup page that the command is done and redirect him to cart route (+ delete the content of the localStorage as we had ordered the things there)
      setPaymentSuccess(true);
    }

    if (query.get("canceled")) {
      navigate(`/cart`);
    }
  }, []);

  let subTotal = 0,
    total = 0;
  if (productsToBuy !== null) {
    for (let i = 0; i < productsToBuy.length; i++) {
      subTotal += productsToBuy[i].quantity * productsToBuy[i].price;
    }
  }

  total = subTotal + 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // POST method to a backend endpoint for the stripe payment (provide the delivery information, send the products to buy)
    if (paymentMethod === "card") {
      if (correctDeliveryInformation(deliveryInformation)) {
        // fetch for /buy with the provided deliveryInformation + productsToBuy + stripe
        const res = await fetch("/api/v1/users/buy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deliveryInformation,
            productsToBuy,
            paymentMethod: "stripe",
          }),
        });
        const data = await res.json();
        window.location.href = data.url;
      }
    } else {
      console.log("cod");
    }
  };

  const handleChange = (e) => {
    setDeliveryInformation({
      ...deliveryInformation,
      [e.target.name]: e.target.value,
    });
  };

  const correctDeliveryInformation = (deliveryInfos) => {
    // check if the delivery information is robust and well given return true if not robuste return false
    return true;
  };

  ////// ALgorithm Stripe updated
  // 1. Stripe button would be like a select thing (as we did for the size)
  // 2. When we click on the button Place order => We redirect to the checkout page provided by stripe
  // 3. Send the list of the products as a POST method for the route ('/stripe-placing-order')
  // 4. in the server => Got the list of product, map each product to the price_ID's of stripe (or create directly the product for the thing in going https://docs.stripe.com/products-prices/manage-prices?dashboard-or-api=api#create-product then create a price)
  // 5. create an order (for the orderModel) for each product alone + create a stripe checkout session for the products provided in line_items

  // 6. get the session url after it and if success => update the payment item in the 'orderModel' for all the orders added and make it as 'order placed' or let it by default
  // 6.1. if cancel => Do nothing and redirect to canceled=true
  // 6.2. redirect to success=true and give a notif to the user that the order is placed and wait for its delivery (delivery will be updated by the admin later) [when success true show that it is processed successfully and give an overview of the order placed or simply redirect him to orders route after showing the popup with a button that if clicked redirect him to orders route to check the status of their orders]
  return (
    <>
      <div className="flex flex-col md:flex-row w-full py-15 gap-5 relative">
        {paymentSuccess && (
          <div className="absolute w-full h-full z-50 gap-10 flex flex-col items-center justify-center bg-white/30 backdrop-blur-md">
            <h1 className="text-3xl font-bold text-green-600">
              Payment Done successfully
            </h1>
            <Check
              color="#ffffff"
              size={30}
              className="bg-green-600 w-35 h-35 flex items-center justify-center rounded-full"
            />
            <LoadingSpinner className=" h-8 w-8 mx-auto" />
          </div>
        )}
        <div className="w-1/2">
          <h1 className="mb-4 relative text-2xl font-bold after:content-[''] after:absolute after:top-1/2 after:w-14 after:h-[2px] after:bg-black">
            <span className="text-slate-500">DELIVERY</span> INFORMATION
          </h1>
          <form
            className="w-full flex flex-wrap gap-x-4"
            onSubmit={handleSubmit}
          >
            <Input
              type="text"
              placeholder="First name"
              name="firstName"
              onChange={handleChange}
              value={deliveryInformation.firstName}
              className="flex-1"
            />
            <Input
              type="text"
              placeholder="Last name"
              className="flex-1"
              name="lastName"
              onChange={handleChange}
              value={deliveryInformation.lastName}
            />
            <Input
              type="email"
              placeholder="Email adress"
              className="w-full my-2"
              name="email"
              onChange={handleChange}
              value={deliveryInformation.email}
            />
            <Input
              type="text"
              placeholder="Street"
              className="w-full"
              name="street"
              onChange={handleChange}
              value={deliveryInformation.street}
            />
            <Input
              type="text"
              placeholder="City"
              className="flex-1 my-2"
              name="city"
              onChange={handleChange}
              value={deliveryInformation.city}
            />
            <Input
              type="text"
              placeholder="State"
              className="flex-1 my-2"
              name="state"
              onChange={handleChange}
              value={deliveryInformation.state}
            />
            <div className="w-full h-0"></div>
            <Input
              type="number"
              placeholder="Zipcode"
              className="flex-1"
              name="zipCode"
              onChange={handleChange}
              value={deliveryInformation.zipCode}
            />
            <Input
              type="text"
              placeholder="Country"
              className="flex-1"
              name="country"
              onChange={handleChange}
              value={deliveryInformation.country}
            />
            <Input
              type="number"
              placeholder="Phone"
              className="w-full my-2"
              name="phone"
              onChange={handleChange}
              value={deliveryInformation.phone}
            />
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
            <ToggleGroup
              type="single"
              className="flex flex-row gap-2 py-2"
              onValueChange={(e) => {
                setPaymentMethod(e);
              }}
            >
              <ToggleGroupItem
                value="card"
                aria-label="Toggle"
                className={` rounded-sm px-5 py-2 hover:cursor-pointer ${
                  paymentMethod === "card" ? "bg-slate-200" : "bg-white"
                }`}
              >
                By Card
              </ToggleGroupItem>
              <ToggleGroupItem
                value="cod"
                className={` rounded-sm px-5 py-2 hover:cursor-pointer ${
                  paymentMethod === "cod" ? "bg-slate-200" : "bg-white"
                }`}
              >
                Cach on Delivery
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="w-full flex flex-col items-end pt-3">
            <Button className="px-8 " onClick={() => submitRef.current.click()}>
              PLACE ORDER
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
