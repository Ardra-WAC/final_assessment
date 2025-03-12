import React, { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import useFetchData from "../customHooks/useFetchData";
import Header from "./Header";
import Fallback from "./Fallback";
import FilterComponent from "./FilterComponent";
import { Card, Button, Container, Row, Col, Pagination } from "react-bootstrap";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading, data, error, fetchData } = useFetchData();
  const query = searchParams.get("query") || "";
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sort_by") || "1";
  const prevParamsRef = useRef({ searchParams: null, page: null });

  const prevParamsStr = prevParamsRef.current.searchParams?.toString();
  const currentParamsStr = searchParams.toString();

  if (
    prevParamsStr !== currentParamsStr ||
    prevParamsRef.current.page !== currentPage
  ) {
    console.log("Fetching data with:", {
      searchParams: currentParamsStr,
      currentPage,
    });
    fetchData(searchParams, currentPage);
    prevParamsRef.current = {
      searchParams: new URLSearchParams(searchParams),
      page: currentPage,
    };
  }

  const totalItems = data?.total || 0;
  const itemsPerPage = 28;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const nextPage = () =>
    currentPage < totalPages ? currentPage + 1 : currentPage;
  const prevPage = () => (currentPage > 1 ? currentPage - 1 : 1);
  const goToPage = (page) =>
    page >= 1 && page <= totalPages ? page : currentPage;

  const generatePageNumbers = () => {
    const range = 2;
    const pageNumbers = [];
    for (
      let i = Math.max(1, currentPage - range);
      i <= Math.min(totalPages, currentPage + range);
      i++
    ) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const changePage = (newPage) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("page", newPage);
      return newParams;
    });
  };

  const sortByText =
    {
      1: "Relevance",
      2: "Price High-Low",
      3: "Price Low-High",
    }[sortBy] || "Relevance";

  if (loading) {
    return (
      <Container className="mt-3">
        <Header />
        <div className="text-center mt-5">Loading...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-3">
        <Header />
        <div className="text-center mt-5 text-danger">Error: {error}</div>
      </Container>
    );
  }

  if (!data || !Array.isArray(data.items) || data.items.length === 0) {
    return (
      <Container className="mt-3">
        <Header />
        <Fallback query={query} />
      </Container>
    );
  }

  return (
    <Container className="mt-3">
      <Header />
      <Row>
        <Col md={4} lg={3}>
          {data.filter_list && Array.isArray(data.filter_list) ? (
            <FilterComponent filters={data.filter_list} />
          ) : (
            <div>No filters available</div>
          )}
        </Col>

        <Col md={8} lg={9}>
          <h1 className="mb-3">Search Results for "{query}"</h1>
          <p className="mb-4">
            Total Results: {totalItems} | Sorted by: {sortByText}
          </p>

          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {data.items.map((item, index) => {
              const isSoldOut = item.is_sold_out;
              return (
                <Col key={item.id || `item-${index}`}>
                  <Card
                    className={`h-100 position-relative ${
                      isSoldOut ? "sold-out" : ""
                    }`}
                  >
                    <Card.Img
                      variant="top"
                      src={item.image_link || "placeholder.jpg"}
                      alt={item.title || "No title"}
                      onError={(e) => (e.target.src = "placeholder.jpg")}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    {isSoldOut && (
                      <div
                        className="position-absolute top-50 start-50 translate-middle text-center text-white bg-dark bg-opacity-75 p-2 rounded"
                        style={{ zIndex: 1 }}
                      >
                        Sold Out
                      </div>
                    )}
                    <Card.Body>
                      <Card.Title>{item.title || "Untitled"}</Card.Title>
                      <div className="card-text">
                        <div className="mb-1">
                          Price: {item.sale_price || "N/A"}
                          <small className="text-muted">
                            {" "}
                            (Original: {item.price || "N/A"})
                          </small>
                        </div>
                        <div className="mb-1">
                          Discount: {item.discount_percentage || 0}%
                        </div>
                        <div className="mb-1">
                          Storage: {item.storage || "N/A"}
                        </div>
                        <div className="mb-1">RAM: {item.ram || "N/A"}</div>
                        <div className="mb-1">Features:</div>
                        <ul className="list-unstyled">
                          {Array.isArray(item.feature_attributes) &&
                          item.feature_attributes.length > 0 ? (
                            item.feature_attributes.map((feature, idx) => (
                              <li key={`feature-${idx}`} className="mb-1">
                                • {feature}
                              </li>
                            ))
                          ) : (
                            <li>No features available</li>
                          )}
                        </ul>
                      </div>
                    </Card.Body>
                    <Card.Footer className="text-center">
                      <Button
                        variant="primary"
                        href={item.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        disabled={isSoldOut}
                      >
                        View Product
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.Prev
                onClick={() => changePage(prevPage())}
                disabled={currentPage === 1}
              />
              {generatePageNumbers().map((pageNum) => (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => changePage(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => changePage(nextPage())}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          )}
        </Col>
      </Row>
    </Container>
  );
}
