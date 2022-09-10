import axios from "axios";
import React, { useReducer } from "react";
import { useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Helmet } from "react-helmet-async";
import Alert from "react-bootstrap/Alert";
import LoadingBox from "../components/LoadingBox";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../Store";
import { getError } from "../utils";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button'

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const UserList = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const navigate = useNavigate();

  const [{ loading, error, users }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    users: [],
  });

  useEffect(() => {
    if (!userInfo.isAdmin) {
      navigate("/signin");
    }

    const fetchUsers = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get("/api/users/admin/userList");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL" });
        toast.error(getError(error));
      }
    };
    fetchUsers();
  }, [dispatch , error ,navigate , userInfo]);


  return (
    <>
      <Helmet>
        <title>UsersList</title>
      </Helmet>
      <h1>Users List</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <Alert variant="dark"> {error} </Alert>
      ) : (
        <Table striped bordered hover size="lg">
          <thead>
            <tr>
              <th> User Id</th>
              <th> User Name </th>
              <th> User Email</th>
              <th>Account Created at</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.name}>
                <td> {user._id} </td>
                <td> {user.name} </td>
                <td> {user.email} </td>
                <td> {user.createdAt.substring(0, 10)} </td>
                <td> {user.isAdmin ? "Admin" : "User"} </td>
              
                 
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserList;
