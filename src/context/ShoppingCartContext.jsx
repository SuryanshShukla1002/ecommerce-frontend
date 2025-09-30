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

  const [addresses, setAddresses] = useState(() => {
    const storedAddresses = localStorage.getItem("userAddresses");
    return storedAddresses ? JSON.parse(storedAddresses) : [];
  });

  const [checkoutPage, setCheckoutPage] = useState(() => {
    const storedOrderSummary = localStorage.getItem("checkoutPage");
    return storedOrderSummary ? JSON.parse(storedOrderSummary) : [];
  });

  // ✅ new state for placed orders
  const [placedOrders, setPlacedOrders] = useState(() => {
    const storedPlaced = localStorage.getItem("placedOrders");
    return storedPlaced ? JSON.parse(storedPlaced) : [];
  });

  useEffect(() => {
    localStorage.setItem("checkoutPage", JSON.stringify(checkoutPage));
  }, [checkoutPage]);

  useEffect(() => {
    localStorage.setItem("placedOrders", JSON.stringify(placedOrders));
  }, [placedOrders]);

  useEffect(() => {
    localStorage.setItem("userAddresses", JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem("savedProducts", JSON.stringify(savedProducts));
  }, [savedProducts]);

  useEffect(() => {
    localStorage.setItem("wislist", JSON.stringify(wislist));
  }, [wislist]);

  const addToCart = (product) => {
    setSavedProducts((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item._id === product._id &&
          (item.size ? item.size === product.size : true)
      );

      if (existingIndex !== -1) {
        const updatedProducts = [...prev];
        updatedProducts[existingIndex] = {
          ...updatedProducts[existingIndex],
          quantity:
            (updatedProducts[existingIndex].quantity || 1) + product.quantity,
          price: (updatedProducts[existingIndex].price || 0) + product.price,
        };
        return updatedProducts;
      } else {
        return [...prev, product];
      }
    });
  };

  const removeCart = (product) => {
    setSavedProducts((prev) =>
      prev.filter(
        (item) =>
          !(
            item._id === product._id &&
            (item.size ? item.size === product.size : true)
          )
      )
    );
  };

  const MoveToWishlist = (product) => {
    setWislist((prev) => [...prev, product]);
  };

  const removeWishListCard = (cartName) => {
    setWislist((prev) => prev.filter((remove) => remove !== cartName));
  };

  const addAddress = (newAddress) => {
    setAddresses((prev) => [...prev, newAddress]);
  };

  const updateAddress = (index, updatedAddress) => {
    setAddresses((prev) =>
      prev.map((addr, i) => (i === index ? updatedAddress : addr))
    );
  };

  const deleteAddress = (index) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
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

  // ✅ add placed order
  const addPlacedOrder = (order) => {
    setPlacedOrders((prev) => [...prev, order]);
    removeOrder(order);
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        savedProducts,
        wislist,
        searchTerm,
        checkoutPage,
        placedOrders, // ✅
        addresses,
        updateAddress,
        deleteAddress,
        addAddress,
        setSearchTerm,
        filterByName,
        addToCart,
        removeCart,
        MoveToWishlist,
        removeWishListCard,
        checkOutPageAddress,
        removeOrder,
        addPlacedOrder, // ✅
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};
