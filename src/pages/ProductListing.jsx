import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useShoppingCartContext from "../context/ShoppingCartContext";

const ProductListing = () => {
  const navigate = useNavigate();
  const [allProduct, setAllProduct] = useState([]);
  const [filteredProd, setFilteredProd] = useState([]);
  const [selectedCategory, setselectedCategory] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [price, setPrice] = useState(1000);
  const [isPriceTouched, setIsPriceTouched] = useState(false);
  const [primiumCheck, setPrimiumCheck] = useState(false);
  const { categoryName } = useParams();

  const { addToCart, searchTerm, wislist, MoveToWishlist } =
    useShoppingCartContext();

  const [message, setMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null); // For toast popup
  const [loading, setLoading] = useState(false);

  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setselectedCategory((prev) => [...prev, value]);
    } else {
      setselectedCategory((prev) => prev.filter((c) => c !== value));
    }
  };

  const handleChangeForPremium = (e) => {
    setPrimiumCheck(e.target.checked);
  };

  const fetchProductByCategory = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://ecommerce-backend-five-chi.vercel.app/products/${categoryName}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!res.ok) {
        console.error("Unable to fetch the data.");
        setFilteredProd([]);
        return;
      }
      const data = await res.json();
      setFilteredProd(data);
      setAllProduct(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductByCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let updated = [...allProduct];

    if (searchTerm.trim() !== "") {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (isPriceTouched) {
      updated = updated.filter((prices) => Number(prices.price) <= price);
    }

    if (selectedRating != null) {
      updated = updated.filter((rate) => Number(rate.rating) >= selectedRating);
    }

    if (selectedCategory.length > 0) {
      updated = updated.filter((p) => selectedCategory.includes(p.category));
    }

    if (primiumCheck) {
      updated = updated.filter(
        (rateCategory) =>
          Number(rateCategory.rating) > 3 && Number(rateCategory.rating) < 4
      );
    }

    setFilteredProd(updated);
  }, [
    allProduct,
    price,
    selectedCategory,
    selectedRating,
    isPriceTouched,
    primiumCheck,
    searchTerm,
  ]);

  const handleRemoveFilters = () => {
    setselectedCategory([]);
    setPrice(1000);
    setSelectedRating(null);
    setIsPriceTouched(false);
    setPrimiumCheck(false);
    setFilteredProd(allProduct);
  };

  const handleConfirmAddToCart = () => {
    if (selectedProduct && selectedSize) {
      addToCart({ ...selectedProduct, size: selectedSize, quantity: 1 });
      setMessage(selectedProduct._id);
      setTimeout(() => setMessage(null), 2000);
    }
    setShowSizePopup(false);
    setSelectedSize(null);
    setSelectedProduct(null);
  };

  const handleAddToWishlist = (product) => {
    const alreadyInWishlist = wislist.find((item) => item._id === product._id);

    if (alreadyInWishlist) {
      setToastMessage("Already in Wishlist");
    } else {
      MoveToWishlist(product);
      setToastMessage("Added to Wishlist");
    }

    setTimeout(() => setToastMessage(null), 2000); // auto-hide toast
  };

  return (
    <main className="container-fluid">
      {/* LEFT FILTERS */}
      <div className="row">
        <div className="col-md-3 bg-white p-3">
          <h2 className="mb-4">Filters</h2>
          <br />
          <h3>Price</h3>
          <input
            type="range"
            className="form-range"
            min="1000"
            max="2000"
            step="50"
            value={price}
            onChange={(e) => {
              setPrice(Number(e.target.value));
              setIsPriceTouched(true);
            }}
          />
          <span>{price && <p>₹ {price}</p>}</span>
          <br />
          <h3>Rating</h3>
          {[5, 4, 3].map((rate) => (
            <div key={rate}>
              <label>
                <input
                  type="radio"
                  name="rating"
                  onChange={() => setSelectedRating(rate)}
                  checked={selectedRating === rate}
                />{" "}
                {rate} Stars & above
              </label>
            </div>
          ))}
          <br />
          <h3>Category</h3>
          <label>
            <input
              type="checkbox"
              value="men"
              onChange={handleChange}
              checked={selectedCategory.includes("men")}
            />{" "}
            Casual
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="premium-men"
              checked={primiumCheck}
              onChange={handleChangeForPremium}
            />{" "}
            Premium
          </label>
          <br />
          <br />
          <div className="text-center">
            <button
              className="btn btn-danger w-100"
              onClick={handleRemoveFilters}
            >
              Remove Filters
            </button>
          </div>
        </div>

        {/* RIGHT PRODUCTS */}
        <div className="col-md-9 bg-body-tertiary">
          <div className="container py-4">
            {loading && (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "200px" }}
              >
                <p className="text-center fs-5">Loading Products.....</p>
              </div>
            )}

            {!loading && (
              <p>
                <b>Showing All Products</b> (Showing {filteredProd.length}{" "}
                products)
              </p>
            )}

            {!loading && filteredProd.length === 0 && (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "200px" }}
              >
                <p className="text-center fs-5 text-danger">
                  No products found for the selected filters.
                </p>
              </div>
            )}

            <div className="row row-cols-1 row-cols-md-2 g-4">
              {filteredProd.map((product) => (
                <div
                  key={product._id}
                  className="col"
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="card mb-3 h-100"
                    onClick={() => navigate(`/productDetails/${product._id}`)}
                  >
                    <div className="row g-0 h-100">
                      <div className="col-md-6 d-flex align-items-center">
                        <img
                          src={product.productImage}
                          className="img-fluid rounded-start"
                          alt={product.name}
                          style={{ maxHeight: "200px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="col-md-6 d-flex flex-column">
                        <div className="card-body d-flex flex-column justify-content-between h-100">
                          <h5 className="card-title mb-0">{product.name}</h5>
                          <p className="card-text">
                            <b>₹{product.price}</b>{" "}
                            <span className="text-muted text-decoration-line-through">
                              ₹3999
                            </span>
                          </p>
                          <p className="text-secondary mb-2">50% off</p>

                          <button
                            className="btn btn-secondary px-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToWishlist(product);
                            }}
                          >
                            Add to Wishlist
                          </button>

                          <button
                            className="btn btn-primary px-4 mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                product.category === "men" ||
                                product.category === "women"
                              ) {
                                setSelectedProduct(product);
                                setShowSizePopup(true);
                              } else {
                                addToCart({ ...product, quantity: 1 });
                                setMessage(product._id);
                                setTimeout(() => setMessage(null), 2000);
                              }
                            }}
                          >
                            Add to Cart
                          </button>
                          {message === product._id && (
                            <p className="text-success mt-2">
                              Successfully added to cart
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SIZE POPUP */}
      {showSizePopup && (
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
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h5>Select Size</h5>
            <div className="d-flex justify-content-around my-3">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className={`btn ${
                    selectedSize === size
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              className="btn btn-success w-100"
              disabled={!selectedSize}
              onClick={handleConfirmAddToCart}
            >
              Confirm
            </button>
            <button
              className="btn btn-danger w-100 mt-2"
              onClick={() => {
                setShowSizePopup(false);
                setSelectedProduct(null);
                setSelectedSize(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "15px 25px",
            backgroundColor:
              toastMessage === "Already in Wishlist" ? "#ff0707ff" : "#28a745",
            color: "white",
            borderRadius: "8px",
            zIndex: 99999,
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {toastMessage}
        </div>
      )}
    </main>
  );
};

export default ProductListing;
