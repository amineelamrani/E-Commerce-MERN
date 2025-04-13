import UserContext from "@/context/UserContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router";

export function PrivateRoutes() {
  const { currentUser } = useContext(UserContext);
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}
