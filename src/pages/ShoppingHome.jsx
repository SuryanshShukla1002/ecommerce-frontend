import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useShoppingCartContext from "../context/ShoppingCartContext";

const ShoppingHome = () => {
  const { searchTerm } = useShoppingCartContext();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchShoppingData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://ecommerce-backend-five-chi.vercel.app/products",
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

      // const updatedData = data.map((product) => {
      //   if (product.category.toLowerCase().includes("mens casual shirt")) {
      //     return { ...product, category: "Men" };
      //   } else if (
      //     product.category.toLowerCase().includes("women summer dress")
      //   ) {
      //     return { ...product, category: "Women" };
      //   }
      //   return product;
      // });

      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShoppingData();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="bg-body-tertiary">
      <main className="container py-4">
        {loading && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "200px" }}
          >
            <p className="text-center fs-5">
              Product Categories are loading...
            </p>
          </div>
        )}

        {!loading && (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {filteredProducts.map((product, index) => (
              <div key={index} className="col d-flex">
                <Link
                  to={`/product/${product.category}`}
                  style={{ textDecoration: "none", color: "inherit", flex: 1 }}
                >
                  <div className="card h-100 d-flex flex-column">
                    <div
                      style={{
                        width: "100%",
                        height: "250px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f8f9fa",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={product.productImage}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    <div className="card-body text-center p-3 d-flex flex-column justify-content-between flex-grow-1">
                      <h5 className="card-title">
                        {product.category.toUpperCase()}
                      </h5>
                      <p className="card-text">{product.productDescription}</p>
                      <button className="btn btn-info mt-auto px-5">
                        View More
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </section>
  );
};

export default ShoppingHome;
