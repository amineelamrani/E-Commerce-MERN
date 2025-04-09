import { Link } from "react-router";

export default function CollectionItemCard({ title, price, image, id }) {
  return (
    <div className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2">
      <div className="flex flex-col">
        <div className="overflow-hidden">
          <Link to={`/product/${id}`}>
            <img
              src={image}
              alt=""
              className="w-full hover:cursor-pointer hover:scale-110 transition-transform duration-200"
            />
          </Link>
        </div>
        <h1 className="py-2">{title}</h1>
        <h2>${price}</h2>
      </div>
    </div>
  );
}
