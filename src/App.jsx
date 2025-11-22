// import './App.css'

import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ShoppingHome from "./pages/ShoppingHome";
import ProductListing from "./pages/ProductListing";
import ListingDetails from "./pages/ListingDetails";
import AddWishList from "./pages/AddWishList";
import Cart from "./pages/Cart";
import { ShoppingContextProvider } from "./context/ShoppingCartContext";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Signup from "./components/Signup";
import Login from "./components/Login";

function App() {
  const location = useLocation();

  return (
    <>
      <ShoppingContextProvider>
        {location.pathname !== "/" && location.pathname !== "/login" && (
          <Navbar />
        )}
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ShoppingHome />} />
          <Route path="/product/:categoryName" element={<ProductListing />} />
          <Route
            path="/productDetails/:productId"
            element={<ListingDetails />}
          />
          <Route path="/wishList" element={<AddWishList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </ShoppingContextProvider>
    </>
  );
}

export default App;
