import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../../actions/userActions";


function LoginScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";
  const [message, setMessage] = useState("");
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;
  const handleClose = () => {
    setMessage(false);
  };

  useEffect(()=>{
    if(userInfo){
      setMessage("Login successful")
      navigate(redirect)
      
  console.log("USER INFO FROM LOCALSTORAGE:", JSON.parse(localStorage.getItem("userInfo")));

    }
  },[userInfo,navigate,redirect])


  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // const newValue = type === "checkbox" ? checked : value;

    setFormValues({
      ...formValues,
      [name]: value,
    });
    validateForm(name, value);
  };

  const isFormValid = () => {
    return (
      Object.values(formErrors).every((error) => error === null) &&
      Object.values(formValues).every(
        (value) => value !== "" && value !== false,
      )
    );
  };

  const getValidationClass = (name) => {
    if (formValues[name] === "") return "";
    return formErrors[name] ? "is-invalid" : "is-valid";
  };

  const clearForm = () => {
    setFormValues({
      email: "",
      password: "",
    });
  };

  const validateForm = (name, value) => {
    let errorMassage = null;

    switch (name) {
   

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMassage = "Invalid email format..";
        }
        break;

      case "password":
        if (value.length < 6) {
          errorMassage = "Password must be at least 6 characters..";
        }
        break;

      default:
        break;
    }

    setFormErrors({
      ...formErrors,
      [name]: errorMassage,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(formValues.email, formValues.password));
    clearForm();
    
   
  }



  return (
    <>
      <Container>
        <Row>
          <Col md="3"></Col>

          {loading ? (
            <Loader />
          ) : (
            <Col md="6">
              <Form onSubmit={submitHandler}>
                <br />
                <h3 className="text-center">Login Here</h3>
                {message && (
                  <Message variant="success" onClose={handleClose}>
                    {message}
                  </Message>
                )}

                {error && (
                  <Message variant="danger" onClose={handleClose}>
                    {error}
                  </Message>
                )}

                <Form.Group controlId="email" className="mt-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    isInvalid={!!formErrors.email}
                    className={getValidationClass("email")}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                    isInvalid={!!formErrors.password}
                    className={getValidationClass("password")}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button className="mt-3" variant="success" type="submit" >
                  Login
                </Button>
              </Form>
              <Row className="py-3">
                <Col>
                  New User?
                  <Link to="/signup">Signup</Link>
                </Col>
              </Row>
            </Col>
          )}
          <Col md="3"></Col>
        </Row>
      </Container>
    </>
  );
}

export default LoginScreen;
