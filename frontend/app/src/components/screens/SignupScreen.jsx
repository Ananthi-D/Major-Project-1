import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";
import { signup } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import { Link, useNavigate, useLocation } from "react-router-dom";

function SignupScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";
  const [message, setMessage] = useState("");
  const [show, changeshow] = useState("fa fa-eye-slash");

  const userSignup = useSelector((state) => state.userSignup);
  const { error, loading, userInfo } = userSignup;
  const handleClose = () => {
    setMessage("");
  };

  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [formErrors, setFormErrors] = useState({
    firstname: null,
    lastname: null,
    email: null,
    password: null,
    confirmPassword: null,
    termsAccepted: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormValues({
      ...formValues,
      [name]: newValue,
    });
    validateForm(name, newValue);
  };

  const getValidationClass = (name) => {
    if (formValues[name] === "") return "";
    return formErrors[name] ? "is-invalid" : "is-valid";
  };

  const clearForm = () => {
    setFormValues({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    });
  };

  const validateForm = (name, value) => {
    let errorMassage = null;

    switch (name) {
      case "firstname":
      case "lastname":
        if (!value) {
          errorMassage = "This field is required...";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMassage = "Invalid email format..";
        }
        break;

      case "password":
        const minLength=6;
        const passwordRegex=/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[_$@!])[A-Za-z0-9_$@*!]{6,}$/;
        if (value.length < minLength || !passwordRegex.test(value)) {
          errorMassage =
            "Password must include alteast [1-9][a-z][A-Z][_$@*!..]& 6 Characters..";
        }
        break;

      case "confirmPassword":
        if (value !== formValues.password) {
          errorMassage = "Passwords do not match..";
        }
        break;

      case "termsAccepted":
        if (!value) {
          errorMassage = "You must accept the terms and conditions..";
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

  const isFormValid = () => {
    return (
      Object.values(formErrors).every((error) => error === null) &&
      Object.values(formValues).every(
        (value) => value !== "" && value !== false,
      )
    );
  };

  const showPassword = () => {
    var x=document.getElementById("pass1");
    var z=document.getElementById("pass2");
    if (x.type === "password" && z.type === "password") {
      x.type = "text";
      z.type = "text";
      changeshow("fa fa-eye");
    }else{
      x.type = "password";
      z.type = "password";
      changeshow("fa fa-eye-slash");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      signup(
        formValues.firstname,
        formValues.lastname,
        formValues.email,
        formValues.password,
        formValues.email
      ),
    );
    clearForm();
  };

  useEffect(()=>{
    if(userInfo){
      setMessage(userInfo["details"])
    }
    localStorage.removeItem('userInfo')
  },[userInfo])

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
                <h3 className="text-center">Signup Here</h3>
                {message && (
                  <Message variant="success" onClose={()=>setMessage("")}>
                    {message}
                  </Message>
                )}

                {error && (
                  <Message variant="danger" onClose={()=>setMessage("")}>
                    {error}
                  </Message>
                )}

                <Form.Group controlId="firstname">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your first name"
                    name="firstname"
                    value={formValues.firstname}
                    onChange={handleChange}
                    isInvalid={!!formErrors.firstname}
                    className={getValidationClass("firstname")}
                  ></Form.Control>

                  <Form.Control.Feedback type="invalid">
                    {formErrors.firstname}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="lastname" className="mt-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your last name"
                    name="lastname"
                    value={formValues.lastname}
                    onChange={handleChange}
                    isInvalid={!!formErrors.lastname}
                    className={getValidationClass("lastname")}
                  ></Form.Control>

                  <Form.Control.Feedback type="invalid">
                    {formErrors.lastname}
                  </Form.Control.Feedback>
                </Form.Group>

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

                <Form.Group  className="mb-3">
                  <Form.Label>
                    {" "}
                    <span>
                      <i className={show}></i>
                    </span>{" "}
                    password
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Checkbox onClick={showPassword} />{" "}
                    <Form.Control
                      required
                      type="password"
                      name="password"
                      placeholder="password"
                      id="pass1"
                      value={formValues.password}
                      onChange={handleChange}
                      isInvalid={!!formErrors.password}
                      className={getValidationClass("password")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group  className="mb-3">
                  <Form.Label>
                    {" "}
                    <span>
                      <i className={show}></i>
                    </span>{" "}
                    Confirm Password
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Checkbox onClick={showPassword} />{" "}
                    <Form.Control
                      required
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      id="pass2"
                      value={formValues.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!formErrors.confirmPassword}
                      className={getValidationClass("confirmPassword")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.confirmpassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Check
                    required
                    label="Agree to terms and conditions"
                    feedback="You must agree before submitting."
                    name="termsAccepted"
                    value={formValues.termsAccepted}
                    checked={formValues.termsAccepted}
                    onChange={handleChange}
                    isInvalid={!!formErrors.termsAccepted}
                    className={getValidationClass("termsAccepted")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.termsAccepted}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  className="mt-3"
                  variant="success"
                  type="submit"
                  disabled={!isFormValid()}
                >
                  Signup
                </Button>
              </Form>
              <Row className="py-3">
                <Col>
                  Already User?
                  <Link to="/login">Login</Link>
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

export default SignupScreen;
