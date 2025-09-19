import { useState } from "react";
import useShoppingCartContext from "../context/ShoppingCartContext";

const Checkout = () => {
  const { checkoutPage, removeOrder } = useShoppingCartContext();
  const orders = (checkoutPage || []).flat();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handlePlaceOrder = (order) => {
    setToastMessage(`Order placed successfully! Order ID: ${order._id}`);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      removeOrder(order);
    }, 3000);
  };

  return (
    <main className="bg-body-tertiary min-vh-100 py-5">
      <section className="container mt-4 col-md-4">
        {orders.length > 0 && (
          <h2 className="text-center mb-4">Order Summary</h2>
        )}
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id || order.id}>
              <div className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Order Name: {order.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Order ID: {order._id}
                  </h6>
                  <p className="card-text">
                    <strong>Price:</strong> ₹{order.price}
                  </p>
                  {order.address && (
                    <p className="card-text">
                      <strong>Delivery Address:</strong> {order.address}
                    </p>
                  )}
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeOrder(order)}
                    >
                      Cancel Order
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => handlePlaceOrder(order)}
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-info text-center">
            No orders found. Your order summary will appear here.
          </div>
        )}
      </section>

      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div
          className={`toast align-items-center text-bg-success border-0 ${
            showToast ? "show" : "hide"
          }`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{toastMessage}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              aria-label="Close"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
