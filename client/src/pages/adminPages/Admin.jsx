import AddingProduct from "@/components/utils/adminComponents/AddingProduct";
import ViewingOrders from "@/components/utils/adminComponents/ViewingOrders";
import ViewingProducts from "@/components/utils/adminComponents/ViewingProducts";
import { useState } from "react";

export default function Admin() {
  const [tabSelected, setTabSelected] = useState("adding"); //values : adding, update, orders

  // Admin there is actually two methods :
  //// 1. adding the admin panel in the same url localhost:5173 (go with this method)
  //// 2. or adding another folder for admin and launching in localhost:5174 for example

  // Overview of this route:
  // 1. Tab for adding items => addProduct
  // 2. Tab for listing all the products with no pagination (viewProducts + deleteProduct + updateProduct)
  // 3. Tab for seeing and managing orders with pagination (getAllOrders + updateOrderStatus)

  const handleSelectClick = (e) => {
    setTabSelected(e.target.id);
  };

  return (
    <div className="flex flex-col md:flex-row relative">
      <div className="w-full md:w-1/5 sticky backdrop-blur-3xl top-0 md:relative border-b-2 md:border-none">
        <ul className="sticky top-0 right-0 pl-5 py-5 flex flex-col gap-3">
          <li
            onClick={handleSelectClick}
            id="adding"
            className={`rounded-l-sm border-t-2 border-l-2 border-b-2 p-2 hover:cursor-pointer hover:bg-gray-200 ${
              tabSelected === "adding" ? "bg-gray-200" : "bg-white"
            }`}
          >
            Add Products
          </li>
          <li
            onClick={handleSelectClick}
            id="update"
            className={`rounded-l-sm border-t-2 border-l-2 border-b-2 p-2 hover:cursor-pointer hover:bg-gray-200 ${
              tabSelected === "update" ? "bg-gray-200" : "bg-white"
            }`}
          >
            View Products
          </li>
          <li
            onClick={handleSelectClick}
            id="orders"
            className={`rounded-l-sm border-t-2 border-l-2 border-b-2 p-2 hover:cursor-pointer hover:bg-gray-200 ${
              tabSelected === "orders" ? "bg-gray-200" : "bg-white"
            }`}
          >
            Orders
          </li>
        </ul>
      </div>

      <div className="w-full md:w-4/5 border-l-2">
        {tabSelected === "adding" && <AddingProduct />}
        {tabSelected === "update" && <ViewingProducts />}
        {tabSelected === "orders" && <ViewingOrders />}
      </div>
    </div>
  );
}
