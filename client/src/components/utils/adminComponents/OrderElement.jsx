import { Cuboid } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrderElement({ order, setUpdatedData }) {
  const productTitle = order.products.map((item, index) => {
    return item.title
      ? item.title + " x " + item.quantity + " " + item.size
      : item.productID + " x " + item.quantity + " " + item.size;
  });

  const handleStatusChange = async (e) => {
    const res = await fetch(`/api/v1/users/admin/orders/${order._id}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ statusDelivery: e }),
    });
    const data = await res.json();
    if (data && data.status === "success") {
      setUpdatedData((st) => !st);
    }
  };

  return (
    <div className="flex justify-between p-7 border">
      <Cuboid size={47} className="my-3 border p-1" />

      <div className="text-wrap max-w-72 text-sm">
        <p className="mb-2 text-xs font-bold">{productTitle.join(", ")}</p>
        <p className="font-bold italic">
          {order.deliveryInformation.firstName}{" "}
          {order.deliveryInformation.lastName}
        </p>
        <p>
          <span className="text-blue-900 font-bold ">Adress :</span>
          {` ${order.deliveryInformation.street}, ${order.deliveryInformation.city}, ${order.deliveryInformation.state}, ${order.deliveryInformation.country}, ${order.deliveryInformation.zipCode}`}
        </p>
      </div>

      <div className="text-wrap max-w-72 text-sm">
        <p>Items : {order.products.length + 1}</p>
        <p>Method : {order.payment.method}</p>
        <p>Payment : {order.payment.status}</p>
        <p>Date : {order.createdAt.split("T")[0]}</p>
      </div>

      <p>${order.payment.money}</p>

      <div>
        <Select
          required
          disabled={order.statusDelivery === "Delivered" ? true : false}
          defaultValue={order.statusDelivery}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="Order Placed">Order Placed</SelectItem>
              <SelectItem value="Packing">Packing</SelectItem>
              <SelectItem value="Shipping">Shipping</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
