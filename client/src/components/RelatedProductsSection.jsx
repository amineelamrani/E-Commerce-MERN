import UserContext from "@/context/UserContext";
import React, { useContext } from "react";
import CollectionItemCard from "./CollectionItemCard";

export default function RelatedProductsSection({ subCategory, category }) {
  const { fetchedProducts } = useContext(UserContext);
  let relatedProductContent = <></>;

  if (fetchedProducts !== null) {
    let counter = 0;
    relatedProductContent = fetchedProducts.map((product, index) => {
      if (counter === 5) return;
      if (product.category.includes(category)) {
        if (product.subCategory.includes(subCategory)) {
          counter++;
          return (
            <CollectionItemCard
              title={product.title}
              price={product.price}
              image={product.images[0]}
              key={index}
              id={product._id}
            />
          );
        }
      }
    });
  }

  return (
    <div className="flex flex-col py-24 items-center">
      <h1 className="mb-4 relative text-xl md:text-2xl font-bold after:content-[''] after:absolute after:top-1/2 after:w-8 md:after:w-14 after:h-[2px] after:bg-black">
        <span className="text-slate-500">RELATED</span> PRODUCTS
      </h1>
      <div className="w-full flex flex-wrap items-start">
        {fetchedProducts !== null && relatedProductContent}
      </div>
    </div>
  );
}
