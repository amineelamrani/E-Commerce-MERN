import testImage from "../assets/p_img47.png";

export default function CollectionSearchCard({ title, price }) {
  return (
    <div className="w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <div className="flex flex-col">
        <img src={testImage} alt="" className="w-full" />
        <h1 className="py-2">{title}</h1>
        <h2>${price}</h2>
      </div>
    </div>
  );
}
