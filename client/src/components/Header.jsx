import { Link, useLocation } from "react-router";
import cartIcon from "../assets/icons/cart-icon.svg";
import profileIcon from "../assets/icons/profile-icon.svg";
import searchIcon from "../assets/icons/search-icon.svg";
import { Button } from "@/components/ui/buttonHeader";

export default function Header() {
  let location = useLocation();

  return (
    <div className="w-full flex justify-between items-center py-3">
      <h1>
        <Link to="/">FOREVER.</Link>
      </h1>
      <div className="flex items-center justify-between gap-5">
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
        <Link to="/">AdminPanel</Link>
      </div>

      <div className="flex gap-2">
        <img src={searchIcon} className="h-5 w-5" alt="" />
        <img src={profileIcon} className="h-5 w-5" alt="" />
        <img src={cartIcon} className="h-5 w-5" alt="" />
      </div>
    </div>
  );
}
