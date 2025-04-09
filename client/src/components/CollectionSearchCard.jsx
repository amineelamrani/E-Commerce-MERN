import { Link } from "react-router";

export default function CollectionSearchCard({ title, price, image, id }) {
  return (
    <div className="w-1/2 md:w-1/3 lg:w-1/4 p-2">
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
