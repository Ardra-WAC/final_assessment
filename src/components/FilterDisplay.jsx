const FilterDisplay = ({ selectedFilters, clearAllFilters, removeFilter }) => (
  <div>
    {selectedFilters.length > 0 && (
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-danger" onClick={clearAllFilters}>
          Clear All Filters
        </button>
      </div>
    )}

    <div className="d-inline-flex flex-wrap mb-3">
      {selectedFilters.length > 0 ? (
        selectedFilters.map((filter) => (
          <div
            key={`${filter.category}-${filter.option}`}
            className="m-1 d-flex align-items-center badge bg-primary text-white"
          >
            {filter.option}
            <button
              className="ms-2 btn-close btn-close-white btn-sm"
              onClick={() => removeFilter(filter.category, filter.option)}
              aria-label="Remove filter"
            />
          </div>
        ))
      ) : (
        <div className="text-muted">No filters selected</div>
      )}
    </div>
  </div>
);

export default FilterDisplay;
