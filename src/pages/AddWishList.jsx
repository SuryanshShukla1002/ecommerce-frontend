import { Link } from "react-router-dom";
import useShoppingCartContext from "../context/ShoppingCartContext";

const AddWishList = () => {
  const { wislist, removeWishListCard } = useShoppingCartContext();

  // console.log(wislist);

  return (
    <>
      <main className="bg-body-tertiary" style={{ minHeight: "100vh" }}>
        {wislist.length === 0 ? (
          <p className="text-center p-5">No Items in the WishList</p>
        ) : (
          ""
        )}
        <div className="container py-3">
          <div className="row">
            {wislist.map((wishCart) => (
              <div className="card col-md-4" style={{ width: "18rem;" }}>
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
                  <Link to="/cart">
                    <button className="btn btn-secondary px-4  w-100 mb-2">
                      Move to Cart
                    </button>
                  </Link>
                  <button
                    className="btn btn-primary px-4  w-100"
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
    </>
  );
};
export default AddWishList;
