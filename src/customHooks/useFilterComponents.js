import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useFilterComponents = (filters) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState({});
  const [itemsToShow, setItemsToShow] = useState({});

  const [expandedFilters, setExpandedFilters] = useState(
    filters.reduce((acc, filter) => {
      acc[filter.attribute] = true;
      return acc;
    }, {})
  );

  const [priceRange, setPriceRange] = useState(() => {
    const priceFilter = filters.find((f) => f.attribute === "price");
    const minPrice =
      searchParams.get("min_price") || priceFilter?.options?.min_price || 0;
    const maxPrice =
      searchParams.get("max_price") || priceFilter?.options?.max_price || 1000;
    return [parseFloat(minPrice), parseFloat(maxPrice)];
  });

  const selectedFilters = [];
  searchParams.forEach((value, key) => {
    if (key !== "query" && key !== "min_price" && key !== "max_price") {
      const filter = filters.find((f) => f.attribute === key);
      if (filter) {
        value.split(",").forEach((val) => {
          const option = filter.options.find((opt) => {
            const optLabel = typeof opt === "string" ? opt : opt.label;
            return optLabel === val;
          });
          if (option) {
            selectedFilters.push({
              category: key,
              option: typeof option === "string" ? option : option.label,
            });
          }
        });
      }
    }
  });

  const handleCheckboxChange = (category, option) => {
    const label = option.label;
    console.log("handleCheckboxChange:", { category, label, option });

    if (!label || label === "undefined") {
      console.warn(`Skipping invalid label for ${category}:`, label);
      return;
    }

    const currentValues = searchParams.getAll(category);
    const newParams = new URLSearchParams(searchParams);
    const isChecked = currentValues.includes(label);

    if (!isChecked) {
      newParams.append(category, label);
    } else {
      const updatedValues = currentValues.filter((val) => val !== label);
      newParams.delete(category);
      updatedValues.forEach((val) => newParams.append(category, val));
    }

    setSearchParams(newParams, { replace: false });
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (searchParams.get("query")) {
      newParams.set("query", searchParams.get("query"));
    }
    setSearchParams(newParams);
  };

  const removeFilter = (category, optionLabel) => {
    const currentValues = searchParams.getAll(category);
    const newParams = new URLSearchParams(searchParams);
    const updatedValues = currentValues.filter((val) => val !== optionLabel);
    newParams.delete(category);
    updatedValues.forEach((val) => newParams.append(category, val));
    setSearchParams(newParams);
  };

  const handleSearchChange = (category, event) => {
    setSearchQuery((prev) => ({ ...prev, [category]: event.target.value }));
  };

  const handleShowMore = (category) => {
    setItemsToShow((prev) => ({
      ...prev,
      [category]: (prev[category] || 5) + 5,
    }));
  };

  const toggleSection = (attribute) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [attribute]: !prev[attribute],
    }));
  };

  const filterDict = filters.reduce((acc, filter) => {
    let options = filter.options;
    if (filter.attribute !== "price" && Array.isArray(options)) {
      acc[filter.attribute] = options.map((opt) =>
        typeof opt === "string" ? { label: opt, value: opt } : opt
      );
    } else if (
      filter.attribute !== "price" &&
      options &&
      typeof options === "object"
    ) {
      acc[filter.attribute] = Object.entries(options).map(([key, value]) => ({
        label: `${key} (${value})`,
        value: key,
      }));
    } else {
      acc[filter.attribute] = [];
    }
    return acc;
  }, {});

  const handlePriceChange = (values) => {
    setPriceRange(values);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("min_price", values[0]);
    newParams.set("max_price", values[1]);
    setSearchParams(newParams);
  };

  return {
    searchParams,
    searchQuery,
    itemsToShow,
    selectedFilters,
    handleSearchChange,
    handleCheckboxChange,
    clearAllFilters,
    removeFilter,
    handleShowMore,
    setSearchParams,
    expandedFilters,
    priceRange,
    toggleSection,
    filterDict,
    handlePriceChange,
  };
};
