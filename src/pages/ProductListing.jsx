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

  const { addToCart, searchTerm, MoveToWishlist } = useShoppingCartContext();

  const [message, setMessage] = useState(null);
  const [wishlistMessage, setWishlistMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // For size popup
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
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
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

  // Handle size popup confirm
  const handleConfirmAddToCart = () => {
    if (selectedProduct && selectedSize) {
      addToCart({ ...selectedProduct, size: selectedSize, quantity: 1 });
      setMessage(selectedProduct._id);
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
    setShowSizePopup(false);
    setSelectedSize(null);
    setSelectedProduct(null);
  };

  return (
    <main className="container-fluid">
      <div className="row">
        {/* LEFT FILTERS */}
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
            id="priceRange"
            value={price}
            onChange={(e) => {
              setPrice(Number(e.target.value));
              setIsPriceTouched(true);
            }}
          />
          <span>{price && <p>₹ {price}</p>}</span>
          <br />
          <h3>Rating</h3>
          <label htmlFor="ratingInput1">
            <input
              type="radio"
              name="rating"
              id="ratingInput1"
              className="mb-2"
              onChange={() => setSelectedRating(5)}
              checked={selectedRating === 5}
            />
            5 Stars & above
          </label>
          <br />
          <label htmlFor="ratingInput2">
            <input
              type="radio"
              name="rating"
              id="ratingInput2"
              className="mb-2"
              onChange={() => setSelectedRating(4)}
              checked={selectedRating === 4}
            />
            4 Stars & above
          </label>
          <br />
          <label htmlFor="ratingInput3">
            <input
              type="radio"
              name="rating"
              id="ratingInput3"
              onChange={() => setSelectedRating(3)}
              checked={selectedRating === 3}
            />
            3 Stars & above
          </label>
          <br />
          <br />
          <h3>Category</h3>
          <label htmlFor="clothing1">
            <input
              type="checkbox"
              name="cloth"
              id="clothing1"
              value="men"
              className="mb-3"
              onChange={handleChange}
              checked={selectedCategory.includes("men")}
            />{" "}
            Casual
          </label>
          <br />
          <label htmlFor="clothing2">
            <input
              type="checkbox"
              name="cloth"
              id="clothing2"
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
              className="btn btn-danger px-4  w-100"
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

            {/* ✅ NO PRODUCTS FOUND MESSAGE */}
            {!loading &&
              filteredProd.length === 0 &&
              (searchTerm.trim() !== "" ||
                isPriceTouched ||
                selectedRating !== null ||
                selectedCategory.length > 0 ||
                primiumCheck) && (
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
                    style={{ maxWidth: "540px" }}
                    onClick={() => navigate(`/productDetails/${product._id}`)}
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
                            src={product.productImage}
                            className="img-fluid rounded-start"
                            alt={product.name}
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
                          <h5 className="card-title mb-0">{product.name}</h5>
                          <p className="card-text">
                            <b>₹{product.price} </b>{" "}
                            <span className="text-muted text-decoration-line-through">
                              ₹3999
                            </span>
                          </p>
                          <p className="text-secondary mb-2">50% off</p>

                          <button
                            className="btn btn-secondary px-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              MoveToWishlist(product);
                              setWishlistMessage(product._id);
                              setTimeout(() => setWishlistMessage(null), 2000);
                            }}
                          >
                            Add to Wishlist
                          </button>
                          {wishlistMessage === product._id && (
                            <p className="text-success mt-2">
                              Added to Wishlist
                            </p>
                          )}

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
                          {message === product._id ? (
                            <p className="text-success mt-2">
                              Successfully added to cart
                            </p>
                          ) : (
                            ""
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
    </main>
  );
};

export default ProductListing;
