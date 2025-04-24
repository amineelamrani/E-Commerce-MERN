import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Header from "./components/Header";
import Product from "./pages/Product";
import Orders from "./pages/Orders";
import Contact from "./pages/Contact";
import Collection from "./pages/Collection";
import Cart from "./pages/Cart";
import About from "./pages/About";
import SignUp from "./pages/auth/SignUp";
import LogIn from "./pages/auth/LogIn";
import Footer01Page from "./components/Footer";
import AccountVerification from "./pages/auth/AccountVerification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { UserProvider } from "./context/UserContext.jsx";
import { PrivateRoutes } from "./components/utils/PrivateRoutes";
import Purchases from "./pages/Purchases";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="container mx-auto px-5 py-2 font-mono">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:productID" element={<Product />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/orders" element={<Orders />} />
              <Route path="/purchased" element={<Purchases />} />
            </Route>

            <Route path="/contact" element={<Contact />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route
              path="/verify-account/:mail"
              element={<AccountVerification />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:mail" element={<ResetPassword />} />
          </Routes>
          <Footer01Page />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
