import PurchasesElements from "@/components/PurchasesElements";
import UserContext from "@/context/UserContext";
import { useContext } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Purchases() {
  // in this route we will display the items purchased by the user and showing their status (delivered, order placed ...)
  const { currentUser } = useContext(UserContext);
  // for the orders in the currentUser state => search for them and display their status for the user
  return (
    <div className="pt-10 flex flex-col gap-2">
      <h1 className="mr-14 relative text-2xl font-bold after:content-[''] after:absolute after:top-1/2 after:w-14 after:h-[2px] after:bg-black">
        <span className="text-slate-500">YOUR</span> PURCHASES
      </h1>
      <Table>
        <TableCaption>Table of all of your orders that you made</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead> </TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Delivery Status</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUser.orders.map((item, index) => (
            <PurchasesElements orderID={item} index={index} key={index} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
