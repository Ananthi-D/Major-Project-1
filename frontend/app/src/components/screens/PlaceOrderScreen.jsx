import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../CheckoutSteps";
import Loader from "../Loader";
import Message from "../Message";
import { createOrder } from "../../actions/orderActions";
import { ORDER_CREATE_RESET } from "../../constants/orderConstants";
import { useNavigate } from "react-router-dom";

function PlaceOrderScreen() {
  const navigate = useNavigate();

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, success } = orderCreate;

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart) || {};
  const { cartItems, shippingAddress, paymentMethod } = cart;


  const itemsPrice = cart?.cartItems?.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  ) || 0;

  console.log("CART DATA:", cart);


  const shippingPrice = itemsPrice > 1000 ? 0 : 100;

  const taxPrice = 0.18 * itemsPrice;

  const totalPrice = itemsPrice + shippingPrice + taxPrice;



  useEffect(() => {
  if (!paymentMethod) {
    navigate("/payment")
  }
}, [paymentMethod, navigate])

  useEffect(() => {
    if (success && order) {
      navigate(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [success, order, navigate, dispatch]);

  const placeOrder = () => {
    console.log("CLICK WORKING");

    
    dispatch(
      createOrder({
        orderItems: cart?.cartItems || [],
        shippingAddress: cart?.shippingAddress || {},
        paymentMethod: cart?.paymentMethod || "COD",
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }),
    );
  };

  return (
    <>
      <div>
        <CheckoutSteps step1 step2 step3 step4 />
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Shipping: </strong>
                  {cart.shippingAddress?.address}, {cart.shippingAddress?.city}
                  {"  "}
                  {cart.shippingAddress?.postalCode},{"  "}
                  {cart.shippingAddress?.country}
                </p>
              </ListGroup.Item>
              

              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong>
                  {cart?.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : cart?.paymentMethod}
                </p>
              </ListGroup.Item>
              

              <ListGroup.Item>
                <h2>Order Items</h2>
                {cartItems.length === 0 ? (
                  <Message variant="info">Your cart is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {cart.cartItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>

                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>

                          <Col md={4}>
                            {item.qty} X {item.price}={" "}
                            {(item.qty * item.price).toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4}>
            <Card style={{ padding: "15px", border: "1px solid #ccc" }}>
              <ListGroup variant="flush">
                <ListGroup.Item style={{ borderBottom: "1px solid #ddd" }}>
                  <h2>Order Summary</h2>
                </ListGroup.Item>

                <ListGroup.Item style={{ borderBottom: "1px solid #ddd" }}>
                  <Row>
                    <Col>Items:</Col>
                    <Col>Rs.{itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item style={{ borderBottom: "1px solid #ddd" }}>
                  <Row>
                    <Col>Shipping:</Col>
                    <Col>Rs.{shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item style={{ borderBottom: "1px solid #ddd" }}>
                  <Row>
                    <Col>Tax:</Col>
                    <Col>Rs.{taxPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item style={{ borderBottom: "1px solid #ddd" }}>
                  <Row>
                    <Col>Total:</Col>
                    <Col>Rs.{totalPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  {error && <Message variant="danger">{error}</Message>}
                </ListGroup.Item>

                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={cartItems.length === 0}
                    onClick={placeOrder}
                  >
                    Place Order
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default PlaceOrderScreen;
