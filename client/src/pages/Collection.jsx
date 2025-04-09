import CollectionSearchCard from "@/components/CollectionSearchCard";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export default function Collection() {
  const [sorting, setSorting] = useState("relevant");
  const [fetchedProducts, setFetchedProducts] = useState(null);
  const [categories, setCategories] = useState({
    Men: true,
    Women: true,
    Kids: true,
  });
  const [types, setTypes] = useState({
    Topwear: true,
    Bottomwear: true,
    Winterwear: true,
  });
  let sortedProducts = fetchedProducts !== null ? [...fetchedProducts] : null;
  let searchCardsContent = (
    <LoadingSpinner className="my-5 h-14 w-14 mx-auto" />
  );

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/v1/products/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data !== null && data.status === "success") {
        setFetchedProducts(data.result);
      }
    };
    fetchProducts();
  }, []);

  function sortByPriceLowToHigh(items) {
    items.sort((a, b) => a.price - b.price);
  }
  function sortByPriceHighToLow(items) {
    items.sort((a, b) => b.price - a.price);
  }

  if (fetchedProducts !== null) {
    if (sorting === "relevant") {
      sortedProducts = [...fetchedProducts];
    } else if (sorting === "lowest") {
      sortedProducts = [...fetchedProducts];
      sortByPriceLowToHigh(sortedProducts);
    } else if (sorting === "highest") {
      sortedProducts = [...fetchedProducts];
      sortByPriceHighToLow(sortedProducts);
    }
  }

  const handleCheckboxCatChange = (checked, id) => {
    setCategories({ ...categories, [id]: checked });
  };
  const handleCheckboxTypeChange = (checked, id) => {
    setTypes({ ...types, [id]: checked });
  };

  if (fetchedProducts !== null) {
    const { Topwear, Bottomwear, Winterwear } = types;
    searchCardsContent = sortedProducts.map((product, index) => {
      for (const [key, value] of Object.entries(categories)) {
        if (value && product.category.includes(key)) {
          // check the types now
          if (Topwear && Bottomwear && Winterwear) {
            return (
              <CollectionSearchCard
                title={product.title}
                price={product.price}
                image={product.images[0]}
                key={index}
                id={product._id}
              />
            );
          } else if (!Topwear && !Bottomwear && !Winterwear) {
            return;
          }

          for (const [keyType, valueType] of Object.entries(types)) {
            if (valueType && product.subCategory.includes(keyType)) {
              return (
                <CollectionSearchCard
                  title={product.title}
                  price={product.price}
                  image={product.images[0]}
                  key={index}
                />
              );
            }
          }
        }
      }
    });
    if (searchCardsContent.filter((item) => item !== undefined).length === 0) {
      searchCardsContent = (
        <h1 className="text-xl text-red-500 italic my-1 mx-auto">
          No Item Found!
        </h1>
      );
    }
  }

  return (
    <div className="flex flex-col md:flex-row w-full py-5">
      <div className="w-full md:w-1/4 pr-5">
        <h1 className="py-5 font-bold text-xl">FILTERS</h1>
        <div className="w-full border rounded-md p-3 flex flex-col mb-5">
          <h2 className="pb-2 font-bold">CATEGORIES</h2>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="Men"
              checked={categories.Men}
              onCheckedChange={(checked) =>
                handleCheckboxCatChange(checked, "Men")
              }
            />
            <label
              htmlFor="Men"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              MEN
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="Women"
              checked={categories.Women}
              onCheckedChange={(checked) =>
                handleCheckboxCatChange(checked, "Women")
              }
            />
            <label
              htmlFor="Women"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              WOMEN
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="Kids"
              checked={categories.Kids}
              onCheckedChange={(checked) =>
                handleCheckboxCatChange(checked, "Kids")
              }
            />
            <label
              htmlFor="Kids"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              KIDS
            </label>
          </div>
        </div>
        <div className="w-full border rounded-md p-3 flex flex-col">
          <h2 className="pb-2 font-bold">TYPE</h2>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="Topwear"
              checked={types.Topwear}
              onCheckedChange={(checked) =>
                handleCheckboxTypeChange(checked, "Topwear")
              }
            />
            <label
              htmlFor="Topwear"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              TopWear
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="Bottomwear"
              checked={types.Bottomwear}
              onCheckedChange={(checked) =>
                handleCheckboxTypeChange(checked, "Bottomwear")
              }
            />
            <label
              htmlFor="Bottomwear"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              BottomWear
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="Winterwear"
              checked={types.Winterwear}
              onCheckedChange={(checked) =>
                handleCheckboxTypeChange(checked, "Winterwear")
              }
            />
            <label
              htmlFor="Winterwear"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              WinterWear
            </label>
          </div>
        </div>
      </div>
      <div className="w-full md:3/4 pl-5">
        <div className="py-5 flex flex-col sm:flex-row justify-between items-end sm:items-center px-3">
          <h1 className="font-bold text-xl relative self-start after:content-[''] after:absolute after:-right-11 after:top-1/2 after:w-10 after:h-[2px] after:bg-black">
            <span className="text-slate-500">ALL</span> COLLECTIONS
          </h1>
          <Select onValueChange={(e) => setSorting(e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By: Relevant" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort By :</SelectLabel>
                <SelectItem value="relevant">Sort By: Relevant</SelectItem>
                <SelectItem value="lowest">Sort By: Low to High</SelectItem>
                <SelectItem value="highest">Sort By: High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full flex flex-wrap items-start">
          {searchCardsContent}
        </div>
      </div>
    </div>
  );
}
