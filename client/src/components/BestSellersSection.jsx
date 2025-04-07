import CollectionItemCard from "./CollectionItemCard";
import LoadingSpinner from "./ui/LoadingSpinner";

export default function BestSellersSection({ data }) {
  return (
    <div className="w-full flex flex-col gap-5 items-center">
      <h1 className="relative text-2xl font-bold after:content-[''] after:absolute after:top-1/2 after:w-14 after:h-[2px] after:bg-black">
        <span className="text-slate-500">BEST</span> SELLERS
      </h1>
      <p className="text-center text-sm">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the.
      </p>
      {data !== null && (
        <div className="w-full flex flex-wrap">
          {data.map((product, index) => (
            <CollectionItemCard
              title={product.title}
              price={product.price}
              image={product.images[0]}
              key={index}
            />
          ))}
        </div>
      )}
      {data === null && <LoadingSpinner />}
    </div>
  );
}
