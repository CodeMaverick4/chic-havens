import { useState, useEffect } from "react";

const FilterSidebar = ({ products, filters, setFilters, onClear, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    // Extract unique values from products
    const uniqueCategories = [...new Set(products.map((p) => p.category))];
    const uniqueBrands = [...new Set(products.map((p) => p.brand))];
    const uniqueColors = [...new Set(products.map((p) => p.color).filter(Boolean))];

    setCategories(uniqueCategories);
    setBrands(uniqueBrands);
    setColors(uniqueColors);
  }, [products]);

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleBrandChange = (brand) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const handleColorChange = (color) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handlePriceChange = (min, max) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { min, max },
    }));
  };

  return (
    <div className="filter-sidebar">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Filters</h5>
        <button className="btn-close" onClick={onClose}></button>
      </div>

      {/* Category Filter */}
      <div className="filter-section">
        <h6 className="filter-title">CATEGORY</h6>
        {categories.map((category) => (
          <div key={category} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`category-${category}`}
              checked={filters.categories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            <label className="form-check-label" htmlFor={`category-${category}`}>
              {category}
            </label>
          </div>
        ))}
      </div>

      {/* Brand Filter */}
      <div className="filter-section">
        <h6 className="filter-title">BRAND</h6>
        {brands.map((brand) => (
          <div key={brand} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`brand-${brand}`}
              checked={filters.brands.includes(brand)}
              onChange={() => handleBrandChange(brand)}
            />
            <label className="form-check-label" htmlFor={`brand-${brand}`}>
              {brand}
            </label>
          </div>
        ))}
      </div>

      {/* Price Filter */}
      <div className="filter-section">
        <h6 className="filter-title">PRICE</h6>
        <div className="price-options">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="price"
              id="price1"
              onChange={() => handlePriceChange(0, 500)}
            />
            <label className="form-check-label" htmlFor="price1">
              ₹0 - ₹500
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="price"
              id="price2"
              onChange={() => handlePriceChange(501, 1000)}
            />
            <label className="form-check-label" htmlFor="price2">
              ₹501 - ₹1,000
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="price"
              id="price3"
              onChange={() => handlePriceChange(1001, 2000)}
            />
            <label className="form-check-label" htmlFor="price3">
              ₹1,001 - ₹2,000
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="price"
              id="price4"
              onChange={() => handlePriceChange(2001, 100000)}
            />
            <label className="form-check-label" htmlFor="price4">
              ₹2,001+
            </label>
          </div>
        </div>
      </div>

      {/* Color Filter */}
      {colors.length > 0 && (
        <div className="filter-section">
          <h6 className="filter-title">COLOR</h6>
          {colors.map((color) => (
            <div key={color} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`color-${color}`}
                checked={filters.colors.includes(color)}
                onChange={() => handleColorChange(color)}
              />
              <label className="form-check-label" htmlFor={`color-${color}`}>
                {color}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Clear Filters */}
      <button className="btn btn-outline-dark w-100 mt-3" onClick={onClear}>
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
