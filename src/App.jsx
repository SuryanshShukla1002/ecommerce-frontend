// import './App.css'

import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ShoppingHome from "./pages/ShoppingHome";
import ProductListing from "./pages/ProductListing";
import ListingDetails from "./pages/ListingDetails";
import AddWishList from "./pages/AddWishList";
import Cart from "./pages/Cart";
import { ShoppingContextProvider } from "./context/ShoppingCartContext";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <>
      <ShoppingContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<ShoppingHome />} />
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
