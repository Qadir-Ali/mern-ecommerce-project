import React from "react";
import { useReducer } from "react";
import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { useContext } from "react";
import { Store } from "../Store";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const CreateProducts = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const navigate = useNavigate();

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    products: [],
  });

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [url, setUrl] = useState("");

  const postDetails = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Eccommerce");
    data.append("cloud_name", "qadirali");
    fetch("https://api.cloudinary.com/v1_1/qadirali/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/products/createProduct", {
        name,
        slug,
        image: url,
        brand,
        category,
        price,
        description,
        countInStock,
      });
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      toast.error(getError(err));
    }
    toast.success("Product has been created");
    navigate('/')
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
    }
  }, [userInfo, navigate]);

  return (
    <>
      <Container className="small-container">
        <Helmet>
          <title>Create Products</title>
        </Helmet>
        <h1 className="my-3">Create Products </h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlid="name">
            <Form.Label> Product Name</Form.Label>
            <Form.Control
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlid="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              type="text"
              required
              onChange={(e) => setSlug(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlid="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlid="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              required

              onChange={(e) => setBrand(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlid="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              required
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlid="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              onClick={postDetails}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlid="countInStock">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="text"
              required
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlid="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="Number"
          
              required
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
          <div className="mb-3">
            <Button type="submit" variant="outline-success">
              Create Product
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default CreateProducts;
