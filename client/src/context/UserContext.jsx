import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [newLogin, setNewLogin] = useState(false);
  const [fetchedLatest, setFetchedLatest] = useState(null);
  const [fetchedBestSeller, setFetchedBestSeller] = useState(null);
  const [fetchedProducts, setFetchedProducts] = useState(null); // Collection data : all products
  const [error, setError] = useState(false);
  const [basket, setBasket] = useState(false);
  const [productsToBuy, setProductsToBuy] = useState(null);

  useEffect(() => {
    // Here fetch for the current user
    const fetchCurrentUser = async () => {
      const res = await fetch("/api/v1/users/current", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data && data.status === "success") {
        setCurrentUser({
          name: data.result.name,
          email: data.result.email,
          orders: data.result.orders,
          favourites: data.result.favourites,
          admin: data.result.admin,
        });
      }
    };

    fetchCurrentUser();
  }, [newLogin]);

  useEffect(() => {
    const fetchData = async (apiRoute, setData, index) => {
      try {
        const res = await fetch(apiRoute, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data && data.status === "success") {
          // setFetchedLatest(data.result);
          setData(data.result);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
    };

    fetchData("/api/v1/products/latest", setFetchedLatest);
    fetchData("/api/v1/products/bestseller", setFetchedBestSeller);
  }, []);

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

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        newLogin,
        setNewLogin,
        fetchedLatest,
        fetchedBestSeller,
        setError,
        error,
        fetchedProducts,
        setFetchedProducts,
        basket,
        setBasket,
        productsToBuy,
        setProductsToBuy,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
