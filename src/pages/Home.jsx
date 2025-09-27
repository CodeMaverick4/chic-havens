import { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import Filters from "../components/Filters";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showSortBy, setShowSortBy] = useState(false);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false); // 🔹 search loader

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_DATABASEURL}/travel-db/products.json`
      );
      let arr = [];
      for (let key in response.data) {
        arr.push({ ...response.data[key], id: key });
      }
      setProducts(arr);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("err -->", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 🔹 simulate search loader
  const handleSearch = (value) => {
    setSearch(value);
    setSearching(true);
    setTimeout(() => setSearching(false), 300); // fake debounce loader
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="banner-height">
        <img src="bannerImage.svg" alt="" className="object-fit-cover" />
      </div>

      <div className="container mt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <div
              className="d-flex gap-2 align-items-center fs-5 cursor-pointer"
              onClick={() => setShowFilter((prev) => !prev)}
            >
              <i className="bi bi-filter-left"></i> Filter
            </div>
            {showFilter && <Filters />}

            <div className="position-relative">
              <div
                className="d-flex gap-2 align-items-center fs-5 cursor-pointer"
                onClick={() => setShowSortBy((prev) => !prev)}
              >
                <i className="bi bi-arrow-down-up"></i> Sort By
              </div>
              {showSortBy && (
                <div className="border border-black rounded-3 p-3 position-absolute z-3 bg-white text-nowrap">
                  <div className="d-flex gap-3 align-items-center mb-2">
                    <span className="sort-by-icon "></span>low to high
                  </div>
                  <div className="d-flex gap-3 align-items-center ">
                    <span className="sort-by-icon"></span>high to low
                  </div>
                </div>
              )}
            </div>
          </div>

          <h3>Total Products: {filteredProducts.length}</h3>

          {/* 🔹 Search input */}
          <div className="position-relative">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <i className="bi bi-search search-input-icon"></i>
          </div>
        </div>

        {/* 🔹 Loader */}
        {(isLoading || searching) && (
          <div className="mt-4 text-center w-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* products list */}
        {!isLoading && !searching && (
          <div className="d-flex flex-wrap gap-4 mt-4 justify-content-between ">
            {filteredProducts.map((product, index) => (
              <Card key={`product-${index}`} product={product} />
            ))}
            {filteredProducts.length === 0 && (
              <p className="mt-4 w-100 text-center">No products found</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
