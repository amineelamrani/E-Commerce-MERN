import UserContext from "@/context/UserContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router";

export function AdminRestricted() {
  const { currentUser } = useContext(UserContext);
  // if currentUser === 'empty' => Show loading
  // if it became null => to login page
  // if not of the above => redirect to Outlet
  return currentUser === "empty" ? (
    <h1>Checking if You have admin rights...</h1>
  ) : currentUser === null || !currentUser.admin ? (
    <Navigate to="/login" />
  ) : (
    <Outlet />
  );
}
