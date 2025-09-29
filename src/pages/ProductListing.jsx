import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useShoppingCartContext from "../context/ShoppingCartContext";

const ProductListing = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const { addToCart, searchTerm, wislist, MoveToWishlist } =
    useShoppingCartContext();

  const [allProduct, setAllProduct] = useState([]);
  const [filteredProd, setFilteredProd] = useState([]);
  const [selectedCategory, setselectedCategory] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [price, setPrice] = useState(1000);
  const [isPriceTouched, setIsPriceTouched] = useState(false);
  const [primiumCheck, setPrimiumCheck] = useState(false);

  const [message, setMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // fetch products
  const fetchProductByCategory = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://ecommerce-backend-five-chi.vercel.app/products/${categoryName}`,
        { headers: { "Content-Type": "application/json" } }
      );
      if (!res.ok) {
        setFilteredProd([]);
        return;
      }
      const data = await res.json();
      setAllProduct(data);
      setFilteredProd(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductByCategory();
  }, [categoryName]);

  // memoized category list to avoid recomputation in useEffect
  const allCategories = useMemo(
    () => Array.from(new Set(allProduct.map((p) => p.category))),
    [allProduct]
  );

  // filter products
  useEffect(() => {
    let updated = [...allProduct];

    if (searchTerm.trim()) {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (isPriceTouched) {
      updated = updated.filter((p) => Number(p.price) <= price);
    }

    if (selectedRating != null) {
      updated = updated.filter((p) => Number(p.rating) >= selectedRating);
    }

    // category filter: only 1 category filter at a time
    if (selectedCategory.length === 1) {
      updated = updated.filter((p) => selectedCategory.includes(p.category));
    }

    // both checkboxes (premium + category) → show empty
    if (primiumCheck && selectedCategory.length > 0) {
      updated = [];
    } else if (primiumCheck) {
      updated = updated.filter(
        (p) => Number(p.rating) > 3 && Number(p.rating) < 4
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
    setSelectedProduct(null);
    setSelectedSize(null);
  };

  const handleAddToWishlist = (product) => {
    const alreadyInWishlist = wislist.find((item) => item._id === product._id);

    if (alreadyInWishlist) {
      setToastMessage("Already in Wishlist");
    } else {
      MoveToWishlist(product);
      setToastMessage("Added to Wishlist");
    }

    setTimeout(() => setToastMessage(null), 2000);
  };

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

  return (
    <main className="container-fluid">
      <div className="row">
        {/* LEFT FILTERS */}
        <div className="col-md-3 bg-white p-3">
          <h2 className="mb-4">Filters</h2>

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
          <p>₹ {price}</p>

          <h3>Rating</h3>
          {[5, 4, 3].map((rate) => (
            <div key={rate}>
              <label>
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === rate}
                  onChange={() => setSelectedRating(rate)}
                />{" "}
                {rate} Stars & above
              </label>
            </div>
          ))}

          <h3>Category</h3>
          {allCategories.map((cat) => (
            <div key={cat}>
              <label>
                <input
                  type="checkbox"
                  value={cat}
                  checked={selectedCategory.includes(cat)}
                  onChange={handleChange}
                />{" "}
                Casual
              </label>
            </div>
          ))}

          <label>
            <input
              type="checkbox"
              checked={primiumCheck}
              onChange={handleChangeForPremium}
              className="mt-2"
            />{" "}
            Premium
          </label>

          <div className="text-center mt-3">
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

            {!loading && filteredProd.length > 0 && (
              <>
                <p>
                  <b>Showing All Products</b> (Showing {filteredProd.length}{" "}
                  products)
                </p>
                <div className="row row-cols-1 row-cols-md-2 g-4">
                  {filteredProd.map((product) => (
                    <div key={product._id} className="col">
                      <div
                        className="card mb-3 h-100"
                        onClick={() =>
                          navigate(`/productDetails/${product._id}`)
                        }
                      >
                        <div className="row g-0 h-100">
                          <div className="col-md-6 col-12 d-flex justify-content-center align-items-center">
                            <img
                              src={product.productImage}
                              alt={product.name}
                              className="img-fluid rounded-start"
                              style={{ maxHeight: "200px", objectFit: "cover" }}
                            />
                          </div>
                          <div className="col-md-6 d-flex flex-column">
                            <div className="card-body d-flex flex-column justify-content-between h-100">
                              <h5 className="card-title mb-0">
                                {product.name}
                              </h5>
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
              </>
            )}
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

      {/* TOAST */}
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
