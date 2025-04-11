import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function CartItemComponent({
  item,
  position = 0,
  handleChange,
  handleDelete,
}) {
  const [quantity, setQuantity] = useState(item ? item.quantity : 0);
  return (
    <div>
      <div className="flex w-full border-b border-t py-5">
        <img src={item.image} alt="" className="w-20" />

        <div className="flex justify-between items-center w-full px-7">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold">{item.title}</h1>

            <div className="flex gap-3">
              <h3>${item.price}</h3>
              <p className="border px-2 items-center">{item.size}</p>
            </div>
          </div>

          <div>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                handleChange(e, position);
                setQuantity(e.target.value);
              }}
              className="w-15 border px-1"
            />
          </div>
          <Trash2
            className="hover:cursor-pointer z-10"
            id={`item-${position}`}
            onClick={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
