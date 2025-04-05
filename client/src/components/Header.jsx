import { Link, useLocation } from "react-router";
import cartIcon from "../assets/icons/cart-icon.svg";
import { Button } from "@/components/ui/buttonHeader";
import { UserRound, Search } from "lucide-react";

export default function Header() {
  let location = useLocation();

  return (
    <div className="w-full flex justify-between items-center py-3 border-b-[1px]">
      <h1>
        <Link to="/">FOREVER.</Link>
      </h1>
      <div className="hidden md:flex items-center justify-between gap-5">
        <Link to="/">
          <Button
            className={`${
              location.pathname === "/" &&
              "relative w-full after:content-[''] after:absolute after:top-7 after:mx-auto after:w-1/2 after:h-[2px] after:bg-black"
            }`}
          >
            HOME
          </Button>
        </Link>
        <Link to="/collection">
          <Button
            className={`${
              location.pathname === "/collection" &&
              "relative w-full after:content-[''] after:absolute after:top-7 after:mx-auto after:w-1/2 after:h-[2px] after:bg-black"
            }`}
          >
            COLLECTION
          </Button>
        </Link>
        <Link to="about">
          <Button
            className={`${
              location.pathname === "/about" &&
              "relative w-full after:content-[''] after:absolute after:top-7 after:mx-auto after:w-1/2 after:h-[2px] after:bg-black"
            }`}
          >
            ABOUT
          </Button>
        </Link>
        <Link to="contact">
          <Button
            className={`${
              location.pathname === "/contact" &&
              "relative w-full after:content-[''] after:absolute after:top-7 after:mx-auto after:w-1/2 after:h-[2px] after:bg-black"
            }`}
          >
            CONTACT
          </Button>
        </Link>
        <Link to="/admin">
          <Button variant="outline" className="px-5 rounded-full">
            AdminPanel
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 items-center">
        {/* <img src={searchIcon} className="h-6 w-6" alt="" /> */}
        <Search className="h-6 w-6" />
        {/* <img src={profileIcon} className="h-6 w-6" alt="" /> */}
        <UserRound className="h-6 w-6" />
        <div className="relative">
          <p className="absolute flex items-center justify-center rounded-full bg-black text-white text-[10px] w-3 h-3 bottom-0 right-0">
            0
          </p>
          <img src={cartIcon} className="h-6 w-6" alt="" />
        </div>
      </div>
    </div>
  );
}
