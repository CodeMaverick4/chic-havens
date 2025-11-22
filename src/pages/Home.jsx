import { useEffect, useState, useCallback, useRef } from "react";
import Card from "../components/Card";
import axios from "axios";
import FilterSidebar from "../components/FilterSidebar";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searching, setSearching] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 100000 },
    colors: [],
  });

  const [sortBy, setSortBy] = useState(""); // 'lowToHigh', 'highToLow', 'newest'

  // Ref for debounce timeout
  const debounceTimeout = useRef(null);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_DATABASEURL}/main-database/products.json`
      );
      console.log(response)
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

  // ==================== DEBOUNCED SEARCH ====================
  const handleSearch = (value) => {
    setSearch(value);
    setSearching(true);

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(value);
      setSearching(false);
    }, 500); // 500ms delay
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // ==================== APPLY FILTERS AND SEARCH ====================
  const getFilteredProducts = useCallback(() => {
    let filtered = [...products];

    // Search filter (use debouncedSearch)
    if (debouncedSearch) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.brand?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.category?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.category)
      );
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => filters.brands.includes(p.brand));
    }

    // Price range filter
    filtered = filtered.filter(
      (p) =>
        Number(p.price) >= filters.priceRange.min &&
        Number(p.price) <= filters.priceRange.max
    );

    // Color filter (if you have color field)
    if (filters.colors.length > 0) {
      filtered = filtered.filter((p) => 
        filters.colors.some(color => 
          p.color?.toLowerCase() === color.toLowerCase()
        )
      );
    }

    // ==================== SORT BY ====================
    if (sortBy === "lowToHigh") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "highToLow") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "newest") {
      // Assuming you have a createdAt field
      filtered.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });
    } else if (sortBy === "popular") {
      // If you have a sales or rating field
      filtered.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    }

    return filtered;
  }, [products, debouncedSearch, filters, sortBy]);

  const filteredProducts = getFilteredProducts();

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 100000 },
      colors: [],
    });
    setSearch("");
    setDebouncedSearch("");
    setSortBy("");
  };

  // Get active sort label
  const getSortLabel = () => {
    switch (sortBy) {
      case "lowToHigh":
        return "Price: Low to High";
      case "highToLow":
        return "Price: High to Low";
      case "newest":
        return "Newest First";
      case "popular":
        return "Most Popular";
      default:
        return "SORT BY";
    }
  };

  return (
    <>
      {/* Banner */}
      <div className="banner-height">
        <img
          src="bannerImage.svg"
          alt="Banner"
          className="w-100 h-100 object-fit-cover"
        />
      </div>

      <div className="container mt-4">
        {/* Top Bar */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          {/* Filter & Sort */}
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-dark d-flex align-items-center gap-2"
              onClick={() => setShowFilter((prev) => !prev)}
            >
              <i className="bi bi-funnel"></i> FILTERS
              {(filters.categories.length > 0 ||
                filters.brands.length > 0 ||
                filters.colors.length > 0) && (
                <span className="badge bg-dark rounded-pill">
                  {filters.categories.length +
                    filters.brands.length +
                    filters.colors.length}
                </span>
              )}
            </button>

            <div className="dropdown">
              <button
                className="btn btn-outline-dark dropdown-toggle d-flex align-items-center gap-2"
                type="button"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-arrow-down-up"></i> {getSortLabel()}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    className={`dropdown-item ${
                      sortBy === "lowToHigh" ? "active" : ""
                    }`}
                    onClick={() => setSortBy("lowToHigh")}
                  >
                    <i className="bi bi-sort-numeric-down me-2"></i>
                    Price: Low to High
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item ${
                      sortBy === "highToLow" ? "active" : ""
                    }`}
                    onClick={() => setSortBy("highToLow")}
                  >
                    <i className="bi bi-sort-numeric-up me-2"></i>
                    Price: High to Low
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item ${
                      sortBy === "newest" ? "active" : ""
                    }`}
                    onClick={() => setSortBy("newest")}
                  >
                    <i className="bi bi-clock me-2"></i>
                    Newest First
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item ${
                      sortBy === "popular" ? "active" : ""
                    }`}
                    onClick={() => setSortBy("popular")}
                  >
                    <i className="bi bi-star me-2"></i>
                    Most Popular
                  </button>
                </li>
                {sortBy && (
                  <>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => setSortBy("")}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Clear Sort
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Product Count */}
          <h5 className="mb-0">
            {filteredProducts.length} Product
            {filteredProducts.length !== 1 ? "s" : ""}
          </h5>

          {/* Search */}
          <div className="position-relative">
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search products..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: "300px" }}
            />
            <i
              className="bi bi-search position-absolute"
              style={{
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            ></i>
            {searching && (
              <div
                className="spinner-border spinner-border-sm position-absolute"
                style={{
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                role="status"
              >
                <span className="visually-hidden">Searching...</span>
              </div>
            )}
            {search && !searching && (
              <i
                className="bi bi-x-circle position-absolute"
                style={{
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                }}
              ></i>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(search ||
          sortBy ||
          filters.categories.length > 0 ||
          filters.brands.length > 0 ||
          filters.colors.length > 0) && (
          <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
            <span className="text-muted small">Active filters:</span>
            {search && (
              <span className="badge bg-secondary">
                Search: "{search}"
                <i
                  className="bi bi-x ms-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSearch("");
                    setDebouncedSearch("");
                  }}
                ></i>
              </span>
            )}
            {sortBy && (
              <span className="badge bg-secondary">
                Sort: {getSortLabel()}
                <i
                  className="bi bi-x ms-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSortBy("")}
                ></i>
              </span>
            )}
            {filters.categories.map((cat) => (
              <span key={cat} className="badge bg-secondary">
                {cat}
              </span>
            ))}
            {filters.brands.map((brand) => (
              <span key={brand} className="badge bg-secondary">
                {brand}
              </span>
            ))}
            {filters.colors.map((color) => (
              <span key={color} className="badge bg-secondary">
                {color}
              </span>
            ))}
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleClearFilters}
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="row">
          {/* Filter Sidebar */}
          {showFilter && (
            <div className="col-md-3">
              <FilterSidebar
                products={products}
                filters={filters}
                setFilters={setFilters}
                onClear={handleClearFilters}
                onClose={() => setShowFilter(false)}
              />
            </div>
          )}

          {/* Products Grid */}
          <div className={showFilter ? "col-md-9" : "col-12"}>
            {(isLoading || searching) && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">
                  {isLoading ? "Loading products..." : "Searching..."}
                </p>
              </div>
            )}

            {!isLoading && !searching && (
              <>
                {filteredProducts.length > 0 ? (
                  <div className="products-grid">
                    {filteredProducts.map((product) => (
                      <Card key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i
                      className="bi bi-inbox"
                      style={{ fontSize: "60px", color: "#ccc" }}
                    ></i>
                    <h5 className="mt-3">No products found</h5>
                    <p className="text-muted">
                      {search
                        ? `No results for "${search}"`
                        : "Try adjusting your filters"}
                    </p>
                    <button
                      className="btn btn-primary mt-3"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
