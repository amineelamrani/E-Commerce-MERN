import React, { useEffect, useState } from "react";
import OrderElement from "./OrderElement";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ViewingOrders() {
  const [fetchedOrders, setFetchedOrders] = useState(null);
  const [ordersInfos, setOrdersInfos] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatedData, setUpdatedData] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(
        `/api/v1/users/admin/orders?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data && data.page) {
        setFetchedOrders(data.orders);
        setOrdersInfos({
          page: data.page,
          totalPages: data.totalPages,
          totalOrders: data.totalOrders,
        });
      }
    };
    fetchOrders();
  }, [currentPage, updatedData]);
  return (
    <div className="p-6">
      <h1>Orders Page</h1>
      <div className="flex flex-col gap-5">
        {fetchedOrders !== null &&
          fetchedOrders.map((item, index) => (
            <OrderElement
              order={item}
              key={index}
              setUpdatedData={setUpdatedData}
            />
          ))}
      </div>
      {fetchedOrders !== null && (
        <Pagination className="mt-3">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
                }
              />
            </PaginationItem>
            {Array.from({ length: ordersInfos.totalPages }).map((_, index) => (
              <PaginationItem
                onClick={() => setCurrentPage(index + 1)}
                key={`page ${index}`}
              >
                <PaginationLink
                  isActive={currentPage === index + 1 ? true : false}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage(
                    currentPage < ordersInfos.totalPages
                      ? currentPage + 1
                      : currentPage
                  )
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
