const FilterCheckbox = ({
  category,
  option,
  searchParams,
  handleCheckboxChange,
}) => {
  const checkboxId = `${category}-${option.label}`; 
  return (
    <div className="p-1 border-bottom d-flex align-items-center">
      <input
        type="checkbox"
        id={checkboxId}
        name={`${category}[]`}
        checked={searchParams.getAll(category).includes(option.label)} 
        onChange={() => handleCheckboxChange(category, option)}
        className="me-2"
      />
      <label htmlFor={checkboxId}>{option.label}</label>
    </div>
  );
};

export default FilterCheckbox;
