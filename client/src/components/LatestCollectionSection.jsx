import CollectionItemCard from "./CollectionItemCard";

export default function LatestCollectionSection() {
  return (
    <div className="w-full flex flex-col gap-5 items-center">
      <h1 className="relative text-2xl font-bold after:content-[''] after:absolute after:top-1/2 after:w-14 after:h-[2px] after:bg-black">
        <span className="text-slate-500">LATEST</span> COLLECTIONS
      </h1>
      <p className="text-center text-sm">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the.
      </p>
      <div className="w-full flex flex-wrap">
        {Array.from({ length: 10 }).map((_, index) => (
          <CollectionItemCard title={"HEllo"} price={45} key={index} />
        ))}
      </div>
    </div>
  );
}
