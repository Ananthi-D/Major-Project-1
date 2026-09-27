import React, { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../CheckoutSteps";
import FormContainer from "../FormContainer";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { savePaymentMethod } from "../../actions/cartActions";

function PaymentScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const [paymentMethod, setPaymentMethod] = useState("COD")

  // if (!shippingAddress.address) {
  //   navigate("/shipping");
  // }
  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod("Cash on Delivery"));
    navigate("/placeorder");
  };

  return (
    <div>
      <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as="legend">Select Method</Form.Label>
            <Col>
              <Form.Check
                type="radio"
                label="Cash on Delivery"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
}

export default PaymentScreen;
