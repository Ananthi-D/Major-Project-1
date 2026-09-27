import React, { useState, useEffect } from "react";
import { Button, Row, Col, Form,Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import {  updateUserProfile, getUserDetails } from "../../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../../constants/userConstants";
import { listMyOrders } from "../../actions/orderActions";

function ProfileScreen() {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClose = () => setMessage(false);

  const userDetails = useSelector((state) => state.userDetails);
  const { user, error, loading } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderMyList = useSelector((state) => state.orderMyList);
  const { orders, error:errorOrders, loading :loadingOrders}= orderMyList;



useEffect(() => {
  if (!userInfo) {
    navigate('/login');
    return;
  }

  if (!user || !user.first_name) {
    dispatch({ type: USER_UPDATE_PROFILE_RESET });
    dispatch(getUserDetails(userInfo.id));
    dispatch(listMyOrders());
  }
  // else {
  //   setFName(user.first_name || "");
  //   setLName(user.last_name || "");
  // }

}, [dispatch, userInfo, user, navigate]);


  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Password do not match");
    } else {
      dispatch(
        updateUserProfile({
          first_name,
          last_name,
          password,
        }),
      );
      setMessage(" ");
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && (
          <Message variant="danger" onClose={handleClose}>
            {message}
          </Message>
        )}
        {error && (
          <Message variant="danger" onClose={handleClose}>
            {error}
          </Message>
        )}

        {loading && <Loader />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              required
              type="name"
              placeholder="Enter First name"
              value={first_name}
              onChange={(e) => setFirst_name(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="name">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              required
              type="name"
              placeholder="Enter Last name"
              value={last_name}
              onChange={(e) => setLast_name(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Enter Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>

      <Col md={9}>
      <h1>My Orders</h1>
      {loadingOrders
      ?(<Loader />)
      :errorOrders
      ?(<Message variant='danger' onClose={handleClose}>{errorOrders}</Message>)
      :(
        <Table striped responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>Total</th>
              <th>paid</th>
              <th>Delivered</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders?.map(order=>(
              <tr key={order?._id }>
                <td>{order._id }</td>
                <td>{order.createdAt.substring(0,10)}</td>
                <td>Rs {order.totalPrice}</td>
                <td>{order.isPaid ? order.paidAt.substring(0,10) : (

                <i className="fas fa-check" style={{color:'red'}}></i>
              )}</td>
                  
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                     <Button className="btn-sm">
                     Details
                    </Button>
                    </LinkContainer>
                  </td>  

                  
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      </Col>


    </Row>
  );
}

export default ProfileScreen;
