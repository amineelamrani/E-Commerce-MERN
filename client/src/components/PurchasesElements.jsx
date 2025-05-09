import React, { useEffect, useState } from "react";
import { TableCell, TableRow } from "./ui/table";
import { Badge } from "@/components/ui/badge";

export default function PurchasesElements({
  orderID,
  index,
  setOrderHighlights,
}) {
  const [orderInfos, setOrderInfos] = useState(null);
  useEffect(() => {
    const fetchOder = async () => {
      const res = await fetch(`/api/v1/users/current/order/${orderID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data && data.status === "success") {
        setOrderInfos(data.result);
      }
    };

    fetchOder();
  }, []);
  // /!\ Not in this MVP bro later
  // display the data regarding that order
  // and when clicking on a order will display a popup screen that contain all the data related to that order (products:quantities, sizes, images... , payment,progress shipment, )
  return (
    <>
      {orderInfos && (
        <TableRow
          className="hover:font-bold hover:cursor-pointer"
          onClick={() => setOrderHighlights({ ...orderInfos })}
        >
          <TableCell>{index + 1}</TableCell>
          <TableCell>#{orderID}</TableCell>
          <TableCell>
            <Badge
              variant={
                orderInfos.statusDelivery === "Order Placed"
                  ? "secondary"
                  : orderInfos.statusDelivery === "Delivered"
                  ? "delivered"
                  : "progress"
              }
            >
              {orderInfos.statusDelivery}
            </Badge>
          </TableCell>
          <TableCell className="uppercase">
            {orderInfos.payment.method}
          </TableCell>
          <TableCell>{orderInfos.payment.status}</TableCell>
          <TableCell>${orderInfos.payment.money}</TableCell>
        </TableRow>
      )}
    </>
  );
}
