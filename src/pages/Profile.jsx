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

  const showTemporaryToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      addAddress(newAddress);
      setNewAddress("");
      showTemporaryToast("Address added successfully!");
    }
  };

  const handleOrderAction = (action) => {
    if (orders.length === 0) return;

    if (action === "cancel") {
      orders.forEach((order) => removeOrder(order));
      showTemporaryToast("Orders Cancelled Successfully");
    } else if (action === "place") {
      orders.forEach((order) => removeOrder(order));
      showTemporaryToast("Orders Placed Successfully");
    }
  };

  return (
    <main className="container my-4">
      <div className="text-center mb-4">
        <h1>User Profile</h1>
      </div>

      {/* Addresses */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="mb-3">My Addresses</h4>
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
                style={{ minWidth: "100px", height: "50px" }}
                onClick={() => deleteAddress(index)}
              >
                Delete
              </button>
            </div>
          ))}
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
              style={{ minWidth: "100px", height: "50px" }}
              onClick={handleAddAddress}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="mb-3">Order Summary</h4>
          {orders.length > 0 ? (
            <>
              {orders.map((order) => (
                <div
                  key={order._id || order.id}
                  className="card mb-3 shadow-sm"
                >
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
                  </div>
                </div>
              ))}

              {/* Buttons at the bottom */}
              <div className="d-flex mt-3">
                <button
                  className="btn btn-outline-danger w-50 me-2"
                  onClick={() => handleOrderAction("cancel")}
                  disabled={orders.length === 0}
                >
                  Cancel Orders
                </button>
                <button
                  className="btn btn-outline-success w-50 ms-2"
                  onClick={() => handleOrderAction("place")}
                  disabled={orders.length === 0}
                >
                  Place Orders
                </button>
              </div>
            </>
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
