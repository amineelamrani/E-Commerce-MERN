export default function CollectionSearchCard({ title, price, image }) {
  return (
    <div className="w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <div className="flex flex-col">
        <div className="overflow-hidden">
          <img
            src={image}
            alt=""
            className="w-full hover:cursor-pointer hover:scale-110 transition-transform duration-200"
          />
        </div>
        <h1 className="py-2">{title}</h1>
        <h2>${price}</h2>
      </div>
    </div>
  );
}
