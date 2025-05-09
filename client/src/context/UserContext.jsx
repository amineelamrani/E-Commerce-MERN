import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState("empty");
  const [newLogin, setNewLogin] = useState(false); // new login to update when login b another account + when we make the purchase
  const [fetchedLatest, setFetchedLatest] = useState(null);
  const [fetchedBestSeller, setFetchedBestSeller] = useState(null);
  const [fetchedProducts, setFetchedProducts] = useState(null); // Collection data : all products
  const [error, setError] = useState(false);
  const [basket, setBasket] = useState(false);
  const [productsToBuy, setProductsToBuy] = useState(null);
  const [productsPurchased, setProductsPurchased] = useState(null);
  const [deleteProducts, setDeleteProducts] = useState(false); //state to update whenever there is a product deleted in the admin dash
  // it would be like this productsPurchased = [{productId, size}]

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
      } else {
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, [newLogin]);

  useEffect(() => {
    const fetchProductsPurchased = async () => {
      const res = await fetch("/api/v1/products/purchased/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data && data.status === "success") {
        setProductsPurchased(data.result);
      }
    };

    fetchProductsPurchased();
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
  }, [newLogin]);

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
  }, [deleteProducts, newLogin]);

  useEffect(() => {
    setProductsToBuy(
      localStorage.eCommerceForever
        ? JSON.parse(localStorage.eCommerceForever)
        : null
    );
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
        productsPurchased,
        deleteProducts,
        setDeleteProducts,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
