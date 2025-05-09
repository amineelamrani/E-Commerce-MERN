import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import UserContext from "@/context/UserContext";

const initialState = {
  title: "",
  description: "",
  price: "",
  sizes: ["S", "M", "L", "XL", "XXL"],
  images: [],
  category: [],
  subCategory: [],
};

export default function AddingProduct() {
  const [text, setText] = useState("");
  const [inputData, setInputData] = useState({ ...initialState });
  const { setDeleteProducts } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const newValue = text + "\n";
      setInputData({ ...inputData, ["images"]: text.split("\n") });
      setText(newValue); // insert newline after adding to array
    }
  };

  const handleChange = (e) => {
    setLoading(false);
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/v1/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });
    const data = await res.json();
    if (data && data.status === "success") {
      setInputData({ ...initialState });
      setDeleteProducts((st) => !st);
      setLoading(false);
    }
  };
  return (
    <div className="py-5 px-10">
      <h1 className="text-lg text-blue-950 font-bold my-5">
        Add a Product to the store
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 w-full max-w-115"
      >
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="title">Product Title</Label>
          <Input
            type="title"
            id="title"
            placeholder="Enter the title"
            value={inputData.title}
            onChange={(e) => {
              setInputData({ ...inputData, ["title"]: e.target.value });
              setLoading(true);
            }}
            required
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <Label htmlFor="description">Product Description</Label>
          <Textarea
            placeholder="Enter the description"
            id="description"
            value={inputData.description}
            onChange={(e) =>
              setInputData({ ...inputData, ["description"]: e.target.value })
            }
            required
          />
        </div>

        <div className="w-full flex">
          <div className="w-1/3  flex flex-col items-center">
            <Label>Product Category</Label>
            <Select
              required
              onValueChange={(e) =>
                setInputData({ ...inputData, ["category"]: [e] })
              }
            >
              <SelectTrigger className="max-w-24 mx-5">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                  <SelectItem value="Kids">Kids</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-1/3 flex flex-col items-center">
            <Label>Sub Category</Label>
            <Select
              required
              onValueChange={(e) =>
                setInputData({ ...inputData, ["subCategory"]: [e] })
              }
            >
              <SelectTrigger className="max-w-35 mx-5">
                <SelectValue placeholder="Select SubCategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>SubCategories</SelectLabel>
                  <SelectItem value="Topwear">Topwear</SelectItem>
                  <SelectItem value="Bottomwear">Bottomwear</SelectItem>
                  <SelectItem value="Winterwear">Winterwear</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-1/3  flex flex-col items-center">
            <Label htmlFor="price">Product Price</Label>
            <Input
              type="number"
              className="w-20"
              id="price"
              placeholder="Enter the price"
              value={inputData.price}
              onChange={(e) =>
                setInputData({ ...inputData, ["price"]: e.target.value * 1 })
              }
              required
            />
          </div>
        </div>

        <div>
          <h1>Product images</h1>
          <div>
            <Textarea
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type the url of the images and press Enter"
              className="w-full"
              required
            />
            <ul className="flex gap-2 flex-wrap w-full ">
              {inputData.images.map((item, index) => (
                <img src={item} key={index} className="h-15" alt="" />
              ))}
            </ul>
          </div>
        </div>
        <Button type="submit" disabled={loading ? true : false}>
          Oh riah
        </Button>
      </form>
    </div>
  );
}
