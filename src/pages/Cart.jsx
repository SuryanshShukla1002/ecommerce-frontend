import { useState } from "react";
import useShoppingCartContext from "../context/ShoppingCartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    savedProducts,
    removeCart,
    MoveToWishlist,
    checkOutPageAddress,
    addresses,
    addAddress,
  } = useShoppingCartContext();

  const [wishListAdded, setWishListAdded] = useState(false);
  const [orderPopup, setOrderPopup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [messageId, setMessageId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();

  const discount = 300;
  const deliveryCharges = 499;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress && !newAddress) {
      showToast("Please select or enter an address");
      return;
    }

    const finalAddress = selectedAddress || newAddress;

    if (newAddress) addAddress(newAddress);

    const orderWithAddress = savedProducts.map((item) => ({
      ...item,
      address: finalAddress,
    }));

    checkOutPageAddress(orderWithAddress);

    // Empty the cart
    savedProducts.forEach((item) => removeCart(item));

    showToast("Order placed successfully!");
    setOrderPopup(false);

    // Navigate to checkout page
    navigate("/checkout");
  };

  return (
    <main className="bg-body-tertiary" style={{ minHeight: "100vh" }}>
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#28a745",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            zIndex: 9999,
            boxShadow: "0px 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          {toastMessage}
        </div>
      )}

      <section className="py-4">
        <div className="container">
          <p className="text-center">
            {savedProducts.length > 0 ? (
              <b>My Cart (Showing {savedProducts.length} products)</b>
            ) : (
              <p className="fs-4 py-5 text-danger">No Items In the cart</p>
            )}
          </p>

          <div className="row">
            <div className="col-md-8">
              <div className="row row-cols-1 g-4">
                {savedProducts.map((cart, index) => (
                  <div key={index} className="col ms-auto">
                    <div
                      className="card mb-3 h-100"
                      style={{ maxWidth: "540px" }}
                    >
                      <div className="row g-0 h-100">
                        <div className="col-md-6 d-flex align-items-center">
                          <div
                            style={{
                              width: "100%",
                              height: "200px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={cart.productImage}
                              alt={cart.name}
                              className="img-fluid rounded-start"
                              style={{
                                maxHeight: "100%",
                                maxWidth: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-md-6 d-flex flex-column">
                          <div className="card-body d-flex flex-column justify-content-between h-100">
                            <h5 className="card-title mb-0">{cart.name}</h5>
                            <p className="card-text mb-1">
                              <b>₹{cart.price}</b>{" "}
                              <span className="text-muted text-decoration-line-through">
                                ₹3999
                              </span>
                            </p>
                            <p className="text-secondary mb-0">50% off</p>

                            <button
                              className="btn btn-secondary px-1 w-100 mb-2"
                              onClick={() => removeCart(cart)}
                            >
                              Remove From Cart
                            </button>
                            <button
                              className="btn btn-primary px-1 w-100"
                              onClick={() => {
                                MoveToWishlist(cart);
                                setWishListAdded(true);
                                setMessageId(cart._id);
                                setTimeout(() => setMessageId(false), 2000);
                              }}
                            >
                              {messageId === cart._id
                                ? "SuccessFully added"
                                : "Move to wishlist"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {savedProducts.length > 0 && (
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Price Details</h5>
                    <hr />
                    <p className="d-flex justify-content-between">
                      Price
                      <span>
                        ₹
                        {savedProducts.reduce(
                          (acc, item) => acc + item.price,
                          0
                        )}
                      </span>
                    </p>
                    <p className="d-flex justify-content-between">
                      Discount<span>-₹{discount}</span>
                    </p>
                    <p className="d-flex justify-content-between">
                      Delivery Charges <span>₹{deliveryCharges}</span>
                    </p>
                    <hr />
                    <p className="d-flex justify-content-between">
                      <b>TOTAL AMOUNT </b>
                      <span>
                        <b>
                          ₹
                          {savedProducts.reduce(
                            (acc, item) => acc + item.price,
                            0
                          ) -
                            discount +
                            deliveryCharges}
                        </b>
                      </span>
                    </p>
                    <hr />
                    <p>You will save ₹{discount} on this order</p>

                    <button
                      className="btn btn-primary px-1 w-100 mb-2"
                      onClick={() => setOrderPopup(true)}
                    >
                      PLACE ORDER
                    </button>

                    {orderPopup && (
                      <div
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0,0,0,0.5)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          zIndex: 9999,
                        }}
                      >
                        <div
                          className="card p-3"
                          style={{
                            width: "400px",
                            maxHeight: "80vh",
                            overflowY: "auto",
                          }}
                        >
                          <h5>Select Address</h5>

                          {addresses.length > 0 &&
                            addresses.map((addr, i) => (
                              <div key={i} className="form-check mb-2">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name="address"
                                  value={addr}
                                  onChange={() => setSelectedAddress(addr)}
                                />
                                <label className="form-check-label">
                                  {addr}
                                </label>
                              </div>
                            ))}

                          <div className="mt-2">
                            <label>Or add new address:</label>
                            <textarea
                              className="form-control"
                              rows={3}
                              value={newAddress}
                              onChange={(e) => setNewAddress(e.target.value)}
                            />
                          </div>

                          <div className="mt-3 d-flex justify-content-between">
                            <button
                              className="btn btn-secondary"
                              onClick={() => setOrderPopup(false)}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-success"
                              onClick={handlePlaceOrder}
                            >
                              Confirm Order
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Cart;
