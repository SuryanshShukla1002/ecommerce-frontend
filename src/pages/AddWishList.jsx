import { useNavigate } from "react-router-dom";
import useShoppingCartContext from "../context/ShoppingCartContext";

const AddWishList = () => {
  const { wislist, removeWishListCard, addToCart } = useShoppingCartContext();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    // ✅ Ensure product has size (default M) and quantity
    const productWithSize = {
      ...product,
      size: product.size || "M",
      quantity: product.quantity || 1,
    };

    addToCart(productWithSize); // add to cart
    removeWishListCard(product); // remove from wishlist
    navigate("/cart"); // go to cart page
  };

  return (
    <main className="bg-body-tertiary" style={{ minHeight: "100vh" }}>
      {wislist.length === 0 && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div
            className="alert alert-warning text-center"
            style={{ padding: "20px 40px", borderRadius: "8px" }}
          >
            No Items in the WishList Yet!!!
          </div>
        </div>
      )}

      <div className="container py-3">
        <div className="row">
          {wislist.map((wishCart, index) => (
            <div
              key={index}
              className="card col-md-4"
              style={{ width: "18rem" }}
            >
              <div
                style={{
                  height: "200px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={wishCart.productImage}
                  alt={wishCart.name}
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div className="card-body text-center">
                <p className="card-text">{wishCart.name}</p>
                <p>
                  <b>₹{wishCart.price}</b>
                </p>
                <p className="text-muted mb-1">
                  Size: <b>{wishCart.size || "M"}</b>
                </p>
                <button
                  className="btn btn-secondary px-4 w-100 mb-2"
                  onClick={() => handleMoveToCart(wishCart)}
                >
                  Move to Cart
                </button>
                <button
                  className="btn btn-primary px-4 w-100"
                  onClick={() => removeWishListCard(wishCart)}
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AddWishList;
