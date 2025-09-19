import { createContext, useContext, useEffect, useState } from "react";

const ShoppingCartContext = createContext();

const useShoppingCartContext = () => useContext(ShoppingCartContext);

export default useShoppingCartContext;

export const ShoppingContextProvider = ({ children }) => {
  const [savedProducts, setSavedProducts] = useState(() => {
    const storedProduct = localStorage.getItem("savedProducts");
    return storedProduct ? JSON.parse(storedProduct) : [];
  });

  const [wislist, setWislist] = useState(() => {
    const storedWishlist = localStorage.getItem("wislist");
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [address, setAddress] = useState(() => {
    const storedAddress = localStorage.getItem("userAddress");
    return storedAddress ? storedAddress : "";
  });

  const [checkoutPage, setCheckoutPage] = useState(() => {
    const storedOrderSummary = localStorage.getItem("checkoutPage");
    return storedOrderSummary ? JSON.parse(storedOrderSummary) : [];
  });

  useEffect(() => {
    localStorage.setItem("checkoutPage", JSON.stringify(checkoutPage));
  }, [checkoutPage]);

  useEffect(() => {
    localStorage.setItem("userAddress", address);
  }, [address]);

  useEffect(() => {
    localStorage.setItem("savedProducts", JSON.stringify(savedProducts));
  }, [savedProducts]);

  useEffect(() => {
    localStorage.setItem("wislist", JSON.stringify(wislist));
  }, [wislist]);

  const addToCart = (product) => {
    setSavedProducts((prev) => [...prev, product]);
  };

  const removeCart = (product) => {
    setSavedProducts((prev) => prev.filter((cut) => cut !== product));
  };

  const MoveToWishlist = (product) => {
    setWislist((prev) => [...prev, product]);
  };

  const removeWishListCard = (cartName) => {
    setWislist((prev) => prev.filter((remove) => remove !== cartName));
  };

  const UpdateAddress = (newAddress) => {
    setAddress(newAddress);
  };

  const filterByName = (array) => {
    if (!searchTerm.trim()) return array;
    return array.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const checkOutPageAddress = (order) => {
    setCheckoutPage((prev) => [...prev, order]);
  };

  const removeOrder = (order) => {
    setCheckoutPage((prev) =>
      prev.filter(
        (cancel) => cancel._id !== order._id && cancel.id !== order.id
      )
    );
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        savedProducts,
        wislist,
        searchTerm,
        checkoutPage,
        setSearchTerm,
        filterByName,
        addToCart,
        removeCart,
        MoveToWishlist,
        removeWishListCard,
        address,
        UpdateAddress,
        checkOutPageAddress,
        removeOrder,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};
