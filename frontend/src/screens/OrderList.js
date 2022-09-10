import React from "react";
import { Helmet } from "react-helmet-async";
import Table from "react-bootstrap/Table";
import { useReducer } from "react";
import LoadingBox from "../components/LoadingBox";
import Alert from "react-bootstrap/Alert";
import { useEffect } from "react";
import { useContext } from "react";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import Button from "react-bootstrap/Button";
import LinkContainer from "react-router-bootstrap/LinkContainer";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrderList = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    orders: [],
  });

  useEffect(() => {
    if (!userInfo.isAdmin) {
      navigate("/signin");
    }

    const fetchUsers = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get("/api/orders/admin/orderLists");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL" });
        toast.error(getError(err));
      }
    };
    fetchUsers();
  }, [dispatch, navigate, userInfo]);

  return (
    <>
      <Helmet>
        <title>OrderLists</title>
      </Helmet>

      <h1 style={{ fontWeight: "bold" }}>Orders List</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <Alert variant="dark"> {error} </Alert>
      ) : (
        <Table striped bordered hover size="lg">
          <thead>
            <tr>
              <th></th>
              <th>Product Id</th>
              <th>UserName</th>
              <th>Address</th>
              <th>User Id</th>
              <th>TotalPrice</th>
              <th>Delivered</th>
              <th>Paid</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  {
                    <ul>
                      <li></li>
                    </ul>
                  }
                </td>

                <td> {order._id} </td>

                <td> {order.shippingAddress.fullname}</td>
                <td>
                  {order.shippingAddress.address},{order.shippingAddress.city} ,
                  {order.shippingAddress.postalCode}{" "}
                </td>
                <td> {order.user} </td>
                <td> ${order.totalPrice} </td>
                <td>{order.isDelivered ? "Delivered" : "Not Yet"}</td>
                <td> {order.isPaid ? "Paid" : "No"} </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderList;
