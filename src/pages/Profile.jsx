import { useState, useEffect } from "react";
import useShoppingCartContext from "../context/ShoppingCartContext";

const Profile = () => {
  const { address, UpdateAddress } = useShoppingCartContext();
  const [changeAdress, setChangeAdress] = useState(address);

  useEffect(() => {
    setChangeAdress(address);
  }, [address]);

  const handleAddressUpdate = () => {
    UpdateAddress(changeAdress);
    alert("Address updated!");
  };

  return (
    <main className="container">
      <div className="text-center">
        <h1>User Profile</h1>
      </div>
      <div className="d-flex justify-content-center">
        <div className="card mt-2" style={{ width: "22rem" }}>
          <img
            src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
            className="card-img-top"
            alt="User_Photo"
          />
          <div className="card-body">
            <h5 className="card-title">Suryansh Shukla</h5>
            <p className="card-text">
              Full-Stack Web Developer | Expertise in MERN Stack & Modern
              Frameworks | Turning Ideas Into Interactive & Scalable Web
              Solutions.
            </p>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Email:</strong> suryansh@example.com
            </li>
            <li className="list-group-item">
              <strong>Phone:</strong> +91 xxxxx xxxxx
            </li>
            <li className="list-group-item">
              <strong>Address:</strong>
              <br />
              <textarea
                className="w-100"
                value={changeAdress}
                rows={2}
                onChange={(e) => setChangeAdress(e.target.value)}
              />
            </li>
          </ul>
          <div className="card-body text-center">
            <button className="btn btn-primary" onClick={handleAddressUpdate}>
              Update Address
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
