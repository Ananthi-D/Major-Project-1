import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../../actions/cartActions";
import FormContainer from "../FormContainer";
import CheckoutSteps from "../CheckoutSteps";

function ShippingScreen() {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  console.log(shippingAddress)

  const dispatch = useDispatch();

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");


  const submitHandler=(e)=>{
    e.preventDefault()
    dispatch(saveShippingAddress({name: userInfo.first_name, email: userInfo.email,address,city,postalCode,country}))
    navigate('/payment')
  }

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <div style={{ borderBottom: "2px solid black", margin: "20px 0" }}></div>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter address"
            value={address ? address : ""}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="City">
          <Form.Label>City</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter city"
            value={city ? city : ""}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode">
          <Form.Label>Pin code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter postal code "
            value={postalCode ? postalCode : ""}
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter country"
            value={country ? country : ""}
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <br/>

        <Button className="mt-4" type="submit" variant="success">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ShippingScreen;
