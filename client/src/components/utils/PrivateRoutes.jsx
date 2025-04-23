import UserContext from "@/context/UserContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router";

export function PrivateRoutes() {
  const { currentUser } = useContext(UserContext);
  // if currentUser === 'empty' => Show loading
  // if it became null => to login page
  // if not of the above => redirect to Outlet
  return currentUser === "empty" ? (
    <h1>Loading</h1>
  ) : currentUser === null ? (
    <Navigate to="/login" />
  ) : (
    <Outlet />
  );
}
