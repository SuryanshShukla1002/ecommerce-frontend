import { useState } from "react";
import useShoppingCartContext from "../context/ShoppingCartContext";

const Profile = () => {
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    checkoutPage,
    removeOrder,
  } = useShoppingCartContext();
  const [newAddress, setNewAddress] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const orders = (checkoutPage || []).flat();

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      addAddress(newAddress);
      setNewAddress("");
      showTemporaryToast("Address added successfully!");
    }
  };

  const showTemporaryToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleOrderAction = (order, action) => {
    const msg =
      action === "place"
        ? `Order placed successfully! Order ID: ${order._id || order.id}`
        : `Order cancelled! Order ID: ${order._id || order.id}`;

    setToastMessage(msg);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      removeOrder(order);
    }, 3000);
  };

  return (
    <main className="container my-4">
      <div className="text-center mb-4">
        <h1>User Profile</h1>
      </div>

      {/* Profile Info & Addresses */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Suryansh Shukla</h5>
          <p className="card-text">suryansh334@gmail.com</p>

          <h4 className="mt-4 mb-3">My Addresses</h4>

          {/* Existing Addresses */}
          {addresses.map((addr, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <textarea
                className="form-control me-2"
                value={addr}
                rows={2}
                onChange={(e) => updateAddress(index, e.target.value)}
              />
              <button
                className="btn btn-danger text-nowrap"
                style={{ minWidth: "120px", height: "50px" }}
                title="Delete this address"
                onClick={() => deleteAddress(index)}
              >
                Delete
              </button>
            </div>
          ))}

          {/* Add New Address */}
          <div className="d-flex align-items-center mt-3">
            <textarea
              className="form-control me-2"
              rows={2}
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Add new address"
            />
            <button
              className="btn btn-primary"
              style={{ minWidth: "120px", height: "50px" }}
              title="Add new address"
              onClick={handleAddAddress}
            >
              Add Address
            </button>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="mb-3">Order Summary</h4>
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id || order.id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Order Name: {order.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Order ID: {order._id || order.id}
                  </h6>
                  <p className="card-text">
                    <strong>Price:</strong> ₹{order.price}
                  </p>
                  {order.address && (
                    <p className="card-text">
                      <strong>Delivery Address:</strong> {order.address}
                    </p>
                  )}
                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleOrderAction(order, "cancel")}
                    >
                      Cancel Order
                    </button>
                    <button
                      className="btn btn-outline-success"
                      onClick={() => handleOrderAction(order, "place")}
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-info text-center">
              No orders found. Your order summary will appear here.
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 9999 }}
        >
          <div
            className="toast align-items-center text-bg-success border-0 show"
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
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
