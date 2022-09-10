import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    navigate(query ? `/search/?query=${query}` : "search");
  };

  return (
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search products..."
          aria-label="Search Products"
          aria-describedby="button-search"
        ></FormControl>
        <Button variant='outline-primary' type='submit' id='button=search' >
        <i className="fa-solid fa-magnifying-glass"></i>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBox;
