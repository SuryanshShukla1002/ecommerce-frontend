import { useState } from "react";
import useShoppingCartContext from "../context/ShoppingCartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { savedProducts, removeCart, MoveToWishlist, checkOutPageAddress } =
    useShoppingCartContext();

  const [quantity, setQuantity] = useState(0);
  const [wishListAdded, setWishListAdded] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [messageId, setMessageId] = useState(null);
  const [addressInput, setAddressInput] = useState(""); // new state for address

  let discount = 300;
  let deliveryCharges = 499;

  return (
    <main className="bg-body-tertiary" style={{ minHeight: "100vh" }}>
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
                                setTimeout(() => {
                                  setMessageId(false);
                                }, 2000);
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
                      onClick={() => {
                        setOrderPlaced(true);
                      }}
                    >
                      PLACE ORDER
                    </button>
                    {orderPlaced && (
                      <>
                        <label htmlFor="addressInput">Enter the address:</label>
                        <br />
                        <textarea
                          className="w-100"
                          rows={3}
                          value={addressInput}
                          onChange={(e) => setAddressInput(e.target.value)}
                        />
                        <br />
                        <Link to="/checkout">
                          <button
                            className="btn btn-success mt-2"
                            onClick={() => {
                              const orderWithAddress = savedProducts.map(
                                (item) => ({
                                  ...item,
                                  address: addressInput,
                                })
                              );
                              checkOutPageAddress(orderWithAddress);
                            }}
                          >
                            Confirm address
                          </button>
                        </Link>
                      </>
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
