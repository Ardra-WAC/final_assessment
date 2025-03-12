import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome } from "react-icons/fa";

const Fallback = ({ query }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="fallback text-center mt-5">
      <h2>No Results Found</h2>
      <p>Sorry, we couldn't find any products matching "{query}".</p>
      <p>
        Try adjusting your search term or filters to find what you're looking
        for!
      </p>
      <button onClick={goBack} className="btn btn-secondary mt-3">
        Go Back{<FaArrowLeft />}
      </button>
      <Link to="/" className="btn btn-primary mt-3">
        Go to Home {<FaHome />}
      </Link>
    </div>
  );
};

export default Fallback;
