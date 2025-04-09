import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [newLogin, setNewLogin] = useState(false);

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

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser, newLogin, setNewLogin }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
