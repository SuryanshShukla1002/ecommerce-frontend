import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useShoppingCartContext from "../context/ShoppingCartContext";

const ListingDetails = () => {
  const { productId } = useParams();
  const [detailsData, setDetailsData] = useState([]);
  const [dataItems, setDataItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [addedWishList, setAddedWishList] = useState(false);

  const { addToCart, MoveToWishlist } = useShoppingCartContext();

  const fetchUsrMoreLike = async () => {
    try {
      const res = await fetch(
        `https://ecommerce-backend-five-chi.vercel.app/productItems`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        return "Failed to fetch the data";
      }

      const ItemsData = await res.json();
      setDataItems(ItemsData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserDataDetail = async () => {
    try {
      const res = await fetch(
        `https://ecommerce-backend-five-chi.vercel.app/products/details/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        return "Failed to fetch the data";
      }
      const data = await res.json();
      setDetailsData(data);
      //   console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserDataDetail();
    fetchUsrMoreLike();
  }, []);

  return (
    <>
      <main className="container mt-4">
        {detailsData && (
          <div className="row bg-body-tertiary">
            {/* LEFT SIDE */}
            <div className="col-md-4 p-3 text-center">
              <img
                src={detailsData.productImage}
                alt="photo"
                className="img-fluid mb-3"
              />
              <Link to="/cart">
                <button
                  className="btn btn-primary px-4 mb-3 w-100"
                  onClick={() =>
                    addToCart({
                      ...detailsData,
                      quantity: quantity,
                      price: detailsData.price * quantity,
                    })
                  }
                >
                  Buy now
                </button>
              </Link>
              <button
                className="btn btn-info px-1 w-100"
                onClick={() => {
                  MoveToWishlist(detailsData);
                  setAddedWishList(true);
                  setTimeout(() => {
                    setAddedWishList(false);
                  }, 2000);
                }}
              >
                Add to Wishlist
              </button>
              {addedWishList ? (
                <p className="text-success mt-3">
                  Successfully added to the wishlist{" "}
                </p>
              ) : (
                ""
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="col-md-8 p-3">
              <h3>
                {detailsData.name} {detailsData.productDescription}
              </h3>
              <p>
                <b>{detailsData.rating} ⭐⭐⭐⭐☆</b>
              </p>
              <p>
                <b>
                  ₹{detailsData.price}{" "}
                  <span className="text-muted text-decoration-line-through">
                    3999
                  </span>
                </b>
              </p>
              <p className="text-secondary">50% off</p>
              <p>
                <b>
                  Quantity:{" "}
                  <span
                    className="btn btn-danger"
                    onClick={() => setQuantity((count) => count - 1)}
                  >
                    -
                  </span>{" "}
                  ({quantity}){" "}
                  <span
                    className="btn btn-danger"
                    onClick={() => setQuantity((count) => count + 1)}
                  >
                    +
                  </span>
                </b>
              </p>
              {(detailsData.category === "men" ||
                detailsData.category === "women") && (
                <p>
                  <b>Size:</b>{" "}
                  {["S", "M", "L", "XL"].map((size) => (
                    <span
                      key={size}
                      className={`btn ${
                        selectedSize === size ? "btn-success" : "btn-info"
                      } mx-1`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </span>
                  ))}
                </p>
              )}
              <hr />
              <div className="container">
                <h3>Description</h3>
                <li className="mb-2">
                  {detailsData.description1} <br />
                </li>
                <li className="mb-2">
                  {detailsData.description2} <br />
                </li>
                <li className="mb-2">
                  {detailsData.description3} <br />
                </li>
                <li className="mb-2">{detailsData.description4}</li>
              </div>
            </div>
          </div>
        )}
        <hr />
        <h4 className="py-2">More Items you may like in apparel</h4>
        <div className="row">
          {dataItems
            .filter((item) => item.category === detailsData.category)
            .slice(0, 4)
            .map((data) => (
              <div className="col-md-3 mb-3" key={data._id}>
                <div className="card h-100">
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
                      src={data.productImage}
                      alt={data.name}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div className="card-body text-center">
                    <p className="card-text">
                      <b>{data.name}</b>
                    </p>
                    <button
                      className="btn btn-primary px-4  w-100"
                      onClick={() => {
                        addToCart({
                          ...data,
                          quantity: quantity,
                          price: data.price * quantity,
                        });
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </>
  );
};
export default ListingDetails;
