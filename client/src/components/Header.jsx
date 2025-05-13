import { Link, useLocation, useNavigate } from "react-router";
import cartIcon from "../assets/icons/cart-icon.svg";
import { Button } from "@/components/ui/buttonHeader";
import { UserRound, Search, Menu } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { useContext } from "react";
import UserContext from "@/context/UserContext";

export default function Header() {
  let location = useLocation();
  let navigate = useNavigate();
  const { basket, setBasket, currentUser, setNewLogin } =
    useContext(UserContext);

  const calculateOrdersNumber = () => {
    const arr = JSON.parse(localStorage.eCommerceForever);
    let counter = 0;
    for (let i = 0; i < arr.length; i++) {
      counter += arr[i].quantity;
    }
    return counter;
  };

  const handleLoginClick = async () => {
    const res = await fetch("/api/v1/users/signout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data && data.status === "success") {
      setNewLogin((st) => !st);
      navigate("/login");
    }
  };

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
        {currentUser && currentUser.admin && (
          <Link to="/admin">
            <Button variant="outline" className="px-5 rounded-full">
              AdminPanel
            </Button>
          </Link>
        )}
      </div>

      <div className="flex items-center">
        <Link to="/collection?search=">
          <Search className="h-6 w-6" />
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <UserRound className="h-6 w-6" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink onClick={() => navigate("/purchased")}>
                  Purchases
                </NavigationMenuLink>
                {currentUser && currentUser !== "empty" && (
                  <NavigationMenuLink onClick={handleLoginClick}>
                    Logout
                  </NavigationMenuLink>
                )}
                {currentUser === null && (
                  <NavigationMenuLink onClick={() => navigate("/login")}>
                    Login
                  </NavigationMenuLink>
                )}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Link to="/cart">
          <div className="relative flex items-center justify-center">
            <p className="absolute flex items-center justify-center rounded-full bg-black text-white text-center text-[6px] w-3 h-3 bottom-0 right-0">
              {localStorage.eCommerceForever === undefined
                ? `0`
                : `${calculateOrdersNumber()}`}
            </p>
            <img src={cartIcon} className="h-6 w-6" alt="" />
          </div>
        </Link>
        <NavigationMenu className="flex md:hidden" orientation="vertical">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Menu className="h-6 w-6 hover:scale-110" />
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <NavigationMenuLink onClick={() => navigate("/")}>
                  HOME
                </NavigationMenuLink>
                <NavigationMenuLink onClick={() => navigate("/collection")}>
                  COLLECTION
                </NavigationMenuLink>
                <NavigationMenuLink onClick={() => navigate("/about")}>
                  ABOUT
                </NavigationMenuLink>
                <NavigationMenuLink onClick={() => navigate("/contact")}>
                  CONTACT
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
