import { useState } from "react";
import useShoppingCartContext from "../context/ShoppingCartContext";

const Profile = () => {
  const { addresses, addAddress, updateAddress, deleteAddress } =
    useShoppingCartContext();
  const [newAddress, setNewAddress] = useState("");

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      addAddress(newAddress);
      setNewAddress("");
    }
  };

  return (
    <main className="container">
      <div className="text-center">
        <h1 className="mt-4">User Profile</h1>
      </div>

      <div className="card mt-3 w-100">
        <div className="card-body">
          <h5 className="card-title">Suryansh Shukla</h5>
          <p className="card-text">
            Full-Stack Web Developer | Expertise in MERN Stack & Modern
            Frameworks
          </p>

          <h4>My Addresses</h4>
          {addresses.map((addr, index) => (
            <div key={index} className="d-flex mb-2">
              <textarea
                className="form-control me-2"
                value={addr}
                rows={2}
                onChange={(e) => updateAddress(index, e.target.value)}
              />
              <button
                className="btn btn-danger"
                onClick={() => deleteAddress(index)}
              >
                Delete
              </button>
            </div>
          ))}

          <div className="d-flex mt-3">
            <textarea
              className="form-control me-2"
              value={newAddress}
              rows={2}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Add new address"
            />
            <button className="btn btn-primary" onClick={handleAddAddress}>
              Add Address
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
