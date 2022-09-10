import React from "react";
import { useReducer } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case " FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const DeleteProducts = () => {
  const [{ loading, products }, dispatch] = useReducer(reducer, {
    loading: false,
    products: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get("/api/products/");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        // console.log(data);
      } catch (err) {
        toast.error(err);
      }
    };
    fetchProduct();
  }, [dispatch]);

  return (
    <>
    <Helmet>
      <title>Products Actions</title>
    </Helmet>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Id</th>
              <th>Category</th>
              <th>Description</th>
              <th>Price</th>
              <th>CountInStock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item._id}>
                <th>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded img-thumbnail"
                  />
                </th>
                <th> {item.name} </th>
                <th> {item._id} </th>
                <th> {item.category} </th>
                <th
                  style={{
                    maxWidth: "200px",
                  }}
                >
                  {" "}
                  {item.description}{" "}
                </th>
                <th> ${item.price} </th>
                <th> {item.countInStock} </th>
                <th>
                  <Link to={`/admin/delete/${item._id}`}>
                    <Button variant="outline-danger">Delete</Button>
                  </Link>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DeleteProducts;
