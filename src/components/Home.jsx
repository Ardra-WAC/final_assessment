import React from "react";
import { Container, Navbar, Form, Button, InputGroup } from "react-bootstrap";
import { useHome } from "../customHooks/useHome";

export default function Home() {
  const { searchState, handleSearchChange, handleSubmit } = useHome();

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-100 text-center" style={{ maxWidth: "600px" }}>
        <h1 className="mb-2">EazyCart</h1>
        <p className="mb-4 text-muted">
          EazyCart makes your shopping feel light
        </p>

        <Navbar bg="light" expand="lg" className="rounded shadow-sm">
          <Container>
            <Form onSubmit={handleSubmit} className="w-100 d-flex">
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchState}
                  onChange={handleSearchChange}
                  className="me-2"
                />
                <Button
                  variant="outline-success"
                  type="submit"
                  disabled={!searchState}
                >
                  Search
                </Button>
              </InputGroup>
            </Form>
          </Container>
        </Navbar>
      </div>
    </Container>
  );
}
