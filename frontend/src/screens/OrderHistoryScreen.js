import React from "react";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import Alert from "react-bootstrap/Alert";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { useReducer } from "react";
import { useEffect } from "react";
import { getError } from "../utils";
import axios from "axios";
import Button from "react-bootstrap/Button";

const OrderHistoryScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const navigate = useNavigate();

  const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return { ...state, loading: true };
      case "FETCH_SUCCESS":
        return { ...state, orders: action.payload, loading: false };
      case "FETCH_FAIL":
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    if(!userInfo){
      navigate('/signin')
    }
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(
          "/api/orders/mine",

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <Alert variant="danger"> {error} </Alert>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td> {order._id} </td>
                <td> {order.createdAt.substring(0, 10)} </td>
                <td> ${order.totalPrice.toFixed(2)} </td>
                <td>
                  {" "}
                  {order.isPaid
                    ? order.piadAt.substring(0, 10)
                    : "Not Paid Yet"}{" "}
                </td>
                <td>
                  {" "}
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : "Not Delivered Yet"}{" "}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="outline-dark"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistoryScreen;
