import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("query") || ""
  );
  const [selectedCountry, setSelectedCountry] = useState(
    searchParams.get("country") || "kuwait"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "1"); 

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set("query", searchInput.trim());
    } else {
      newParams.delete("query");
    }
    newParams.set("country", selectedCountry);
    newParams.set("sort_by", sortBy);
    setSearchParams(newParams);
  };

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("country", newCountry);
    newParams.set("sort_by", sortBy);
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort_by", newSortBy);
    setSearchParams(newParams);
  };

  return (
    <header className="header bg-light py-3 shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="brand">
          <h1 className="m-0">EazyCart</h1>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="d-flex align-items-center w-50 justify-content-center"
        >
          <div className="input-group w-100">
            <input
              id="search-input"
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoComplete="off"
              aria-label="Search products"
            />
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-search">{<FaSearch/>}</i>
            </button>
          </div>
        </form>

        <div className="d-flex align-items-center">
          <div className="country-selector me-3">
            <select
              className="form-select"
              value={selectedCountry}
              onChange={handleCountryChange}
              aria-label="Select country"
            >
              <option value="kuwait">Kuwait</option>
              <option value="qatar">Qatar</option>
            </select>
          </div>

          <div className="sort-selector">
            <select
              className="form-select"
              value={sortBy}
              onChange={handleSortChange}
              aria-label="Sort by"
            >
              <option value="1">Relevance</option>
              <option value="2">Price High-Low</option>
              <option value="3">Price Low-High</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
