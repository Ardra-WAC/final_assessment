import React from "react";
import { useFilterComponents } from "../customHooks/useFilterComponents";
import FilterDisplay from "./FilterDisplay";
import FilterCheckbox from "./FilterCheckBox";
import CustomSlider from "./CustomSlider";
import { Button, Collapse, Form, InputGroup } from "react-bootstrap";

const FilterComponent = ({ filters }) => {
  const {
    searchParams,
    searchQuery,
    itemsToShow,
    selectedFilters,
    handleSearchChange,
    handleCheckboxChange,
    clearAllFilters,
    removeFilter,
    handleShowMore,
    expandedFilters,
    priceRange,
    toggleSection,
    filterDict,
    handlePriceChange,
  } = useFilterComponents(filters);

  return (
    <div className="sidebar bg-light p-3 border rounded">
      <FilterDisplay
        selectedFilters={selectedFilters}
        clearAllFilters={clearAllFilters}
        removeFilter={removeFilter}
      />

      {filters.map((filter) => (
        <div key={filter.attribute} className="mb-3">
          <div
            className="d-flex justify-content-between align-items-center p-2 bg text-white rounded cursor-pointer"
            style={{ backgroundColor: "#0071a1" }}
            onClick={() => toggleSection(filter.attribute)}
          >
            <h5 className="fw-bold mb-0">{filter.label}</h5>
            <span className="fs-5">
              {expandedFilters[filter.attribute] ? "▲" : "▼"}
            </span>
          </div>

          <Collapse in={expandedFilters[filter.attribute]}>
            <div className="ms-3 mt-2">
              {filter.attribute === "price" ? (
                <div className="price-filter">
                  <div className="price-range mb-2">
                    {priceRange[0]} - {priceRange[1]}
                  </div>
                  <CustomSlider
                    min={filter.options?.min_price || 0}
                    max={filter.options?.max_price || 1000}
                    value={priceRange}
                    onChange={handlePriceChange}
                    minDistance={10}
                  />
                  <br />
                </div>
              ) : (
                <>
                  <InputGroup className="mb-2">
                    <Form.Control
                      type="text"
                      placeholder={`Search ${filter.label}`}
                      value={searchQuery[filter.attribute] || ""}
                      onChange={(e) => handleSearchChange(filter.attribute, e)}
                      aria-label={`Search ${filter.label}`}
                      autoComplete="off"
                    />
                  </InputGroup>

                  {filterDict[filter.attribute]
                    .filter((option) =>
                      option.label
                        .toLowerCase()
                        .includes(
                          (searchQuery[filter.attribute] || "").toLowerCase()
                        )
                    )
                    .slice(0, itemsToShow[filter.attribute] || 5)
                    .map((option, index) => (
                      <FilterCheckbox
                        key={`${filter.attribute}-${
                          option.value ?? "unknown"
                        }-${index}`}
                        category={filter.attribute}
                        option={option}
                        searchParams={searchParams}
                        handleCheckboxChange={handleCheckboxChange}
                      />
                    ))}

                  {filterDict[filter.attribute].filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(
                        (searchQuery[filter.attribute] || "").toLowerCase()
                      )
                  ).length === 0 && (
                    <div className="text-muted mt-2">No matching items</div>
                  )}

                  {filterDict[filter.attribute].filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(
                        (searchQuery[filter.attribute] || "").toLowerCase()
                      )
                  ).length > (itemsToShow[filter.attribute] || 5) && (
                    <Button
                      variant="outline-primary"
                      className="mt-2"
                      onClick={() => handleShowMore(filter.attribute)}
                    >
                      {filterDict[filter.attribute].filter((option) =>
                        option.label
                          .toLowerCase()
                          .includes(
                            (searchQuery[filter.attribute] || "").toLowerCase()
                          )
                      ).length - (itemsToShow[filter.attribute] || 5)}{" "}
                      more...
                    </Button>
                  )}
                </>
              )}
            </div>
          </Collapse>
        </div>
      ))}
    </div>
  );
};

export default FilterComponent;
