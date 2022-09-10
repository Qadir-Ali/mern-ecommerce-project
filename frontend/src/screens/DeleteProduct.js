import axios from "axios";
import React from "react";
import { useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";

const reducer = (state, action) => {
  switch (action.type) {
    case "DEL_REQUEST":
      return { ...state };
    case "DEL_SUCCESS":
      return { ...state, delItem: action.payload };
    case "DEL_FAIL":
      return { ...state };

    default:
      return state;
  }
};
const DeleteProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [{ delItem }, dispatch] = useReducer(reducer, {
    delItem: [],
  });
  const deleteThis = () => {
    const del = async () => {
      try {
        const { data } = await axios.delete(`/api/products/${id}`);
        dispatch({ type: "DEL_SUCCESS" });
        toast.success("Product Has been deleted");
      } catch (err) {
        toast.error(err);
      }
    };
    del();

    navigate("/");
  };

  return <> 
  {deleteThis()}
   </>;
};

export default DeleteProduct;
