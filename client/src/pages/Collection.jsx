import CollectionSearchCard from "@/components/CollectionSearchCard";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function Collection() {
  const [sorting, setSorting] = useState("relevant");

  return (
    <div className="flex flex-col md:flex-row w-full py-5">
      <div className="w-full md:w-1/4 pr-5">
        <h1 className="py-5 font-bold text-xl">FILTERS</h1>
        <div className="w-full border rounded-md p-3 flex flex-col mb-5">
          <h2 className="pb-2 font-bold">CATEGORIES</h2>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              MEN
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              WOMEN
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              KIDS
            </label>
          </div>
        </div>
        <div className="w-full border rounded-md p-3 flex flex-col">
          <h2 className="pb-2 font-bold">TYPE</h2>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              TopWear
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              BottomWear
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              WinterWear
            </label>
          </div>
        </div>
      </div>
      <div className="w-full md:3/4 pl-5">
        <div className="py-5 flex justify-between items-center px-3">
          <h1 className="font-bold text-xl relative after:content-[''] after:absolute after:-right-11 after:top-1/2 after:w-10 after:h-[2px] after:bg-black">
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

        <div className="w-full flex flex-wrap">
          {Array.from({ length: 10 }).map((_, index) => (
            <CollectionSearchCard title={"HEllo"} price={45} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
