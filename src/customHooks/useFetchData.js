import { useState } from "react";
import useSWR from "swr";
import axiosInstance from "../components/axiosConfig";

const CREDENTIALS = {
  kuwait: {
    indexName: "qa-en",
    clientId: "7645129791",
    secretKey: "Qfj1UUkFItWfVFwWpJ65g0VfhjdVGN",
  },
  qatar: {
    indexName: "qa-ar",
    clientId: "5807942863",
    secretKey: "Llz5MR37gZ4gJULMwf762w1lQ13Iro",
  },
};

const fetcher = async ({ searchParams, page }) => {
  const country = searchParams.get("country") || "kuwait";
  const config = CREDENTIALS[country] || CREDENTIALS.kuwait;
  const sortBy = searchParams.get("sort_by") || "1";

  const filter = {};

  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");

  searchParams.forEach((value, key) => {
    if (
      key !== "query" &&
      key !== "dropdown" &&
      key !== "page" &&
      key !== "min_price" &&
      key !== "max_price" &&
      key !== "country" &&
      key !== "sort_by"
    ) {
      if (!filter[key]) {
        filter[key] = [];
      }
      filter[key].push(value);
    }
  });

  const payload = {
    search: searchParams.get("query") || "",
    filter,
    size: 28,
    sort_by: sortBy,
    page,
    index_name: config.indexName,
  };

  if (minPrice) payload.min_price = parseFloat(minPrice);
  if (maxPrice) payload.max_price = parseFloat(maxPrice);

  console.log("Request Payload:", payload);

  const response = await axiosInstance.post("/search", payload, {
    headers: {
      "Client-id": config.clientId,
      "Secret-key": config.secretKey,
      "Content-Type": "application/json",
    },
  });

  console.log("Response from server:", response.data);

  if (!response.data || typeof response.data !== "object") {
    console.log("Invalid response format from server");
  }

  return response.data;
};

function useFetchData() {
  const [searchConfig, setSearchConfig] = useState({
    searchParams: null,
    page: 1,
  });

  const swrKey = searchConfig.searchParams
    ? ["/search", searchConfig.searchParams.toString(), searchConfig.page]
    : null;

  const { data, error, isLoading } = useSWR(
    swrKey,
    () =>
      fetcher({
        searchParams: searchConfig.searchParams,
        page: searchConfig.page,
      }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  const fetchData = (searchParams, page = 1) => {
    if (
      searchConfig.searchParams?.toString() !== searchParams.toString() ||
      searchConfig.page !== page
    ) {
      console.log("Updating searchConfig:", {
        searchParams: searchParams.toString(),
        page,
      });
      setSearchConfig({ searchParams, page });
    }
  };

  return {
    loading: isLoading,
    data,
    error: error?.message || (error && "Failed to fetch search results"),
    fetchData,
  };
}

export default useFetchData;
