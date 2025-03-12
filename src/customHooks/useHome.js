import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

export function useHome() {
  const [searchState, setSearchState] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchState(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchState) {
      setSearchParams({ query: searchState });
      navigate(`/search?query=${encodeURIComponent(searchState)}`);
    }
  };

  return {
    searchState,
    searchParams,
    handleSearchChange,
    handleSubmit,
  };
}
