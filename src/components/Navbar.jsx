import { Link } from "react-router-dom";
import useShoppingCartContext from "../context/ShoppingCartContext";

const Navbar = () => {
  const { searchTerm, setSearchTerm } = useShoppingCartContext();
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand text-secondary fw-bold" to="/">
          MyShoppingSite
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <form
            className="d-flex mx-auto"
            role="search"
            style={{ maxWidth: "400px", width: "100%" }}
          >
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/wishList" className="nav-link">
                <img
                  src="https://static.thenounproject.com/png/3386813-200.png"
                  alt="User"
                  className="me-1"
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "contain",
                  }}
                />
                WishList
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/cart" className="nav-link">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/012/414/422/non_2x/add-shopping-cart-icon-free-png.png"
                  alt="Cart"
                  className="me-1"
                  style={{
                    width: "40px",
                    height: "30px",
                    objectFit: "contain",
                  }}
                />
                Cart
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIwRBD9gNuA2GjcOf6mpL-WuBhJADTWC3QVQ&s"
                  alt="Cart"
                  className="me-1 rounded-xl"
                  style={{
                    width: "40px",
                    height: "30px",
                    objectFit: "contain",
                  }}
                />
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
