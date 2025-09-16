import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/home/Home";
import Login from "./pages/loginAndRegister/Login";
import Register from "./pages/loginAndRegister/Register";
import Market from "./pages/market/Market";
import MainPage from "./pages/MainPage";
import ProductInfo from "./components/products/product_info/ProductInfo";
import ProtectedRoute from "./routes/ProtectedRoute";
import Cart from "./pages/cart/Cart";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import CheckOutProtected from "./routes/CheckOutProtected";
import Checkout from "./pages/checkout/Checkout";
import Unauthorized from "./pages/Unauthorized";
import "./App.css";
import VerifyEmail from "./pages/verify_email/VerifyEmail";
import Profile from "./pages/profile/profile";
import ProtectedRouteUserAdmin from "./routes/ProtectedRouteUserAdmin";
import ProtectedRouteUser from "./routes/ProtectedRouteUser";
import AdmenProfile from "./pages/adminProfile/AdminProfile";
import ProtectedRouteAdmin from "./routes/ProtectedRouteAdmen";
import MarketManage from "./pages/marketManage/MarketManage";

function App() {
  const [checkoutPageKey, setCheckoutPageKey] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/checkout") {
      setCheckoutPageKey(false);
    }
  }, [location.pathname]);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route index element={<Home />} />

          <Route path="/home" element={<Home />} />

          {/* Client And Admin Routes */}

          <Route path="/market" element={<Market />} />
          <Route path="/market/:id" element={<ProductInfo />} />

          {/* Client Routes */}
          <Route path="/" element={<ProtectedRouteUser />}>
            <Route
              path="/cart"
              element={<Cart setCheckoutPageKey={setCheckoutPageKey} />}
            />
            <Route
              path="/checkout"
              element={
                <CheckOutProtected checkoutPageKey={checkoutPageKey}>
                  <Checkout setCheckoutPageKey={setCheckoutPageKey} />
                </CheckOutProtected>
              }
            />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/" element={<ProtectedRouteAdmin />}>
            <Route path="/adminProfile" element={<AdmenProfile />} />
            <Route path="/market_management" element={<MarketManage />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/sign_up" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="*" element={<h1>Page Not Found :(</h1>} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
