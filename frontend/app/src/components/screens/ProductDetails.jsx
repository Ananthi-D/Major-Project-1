import React, { useState, useEffect } from "react";
// import products from "../../products";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
// import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import { listProductDetails } from "../../actions/productAction";

function ProductDetails({ params }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product = {} } = productDetails;
  const [message, setMessage] = useState("");

  const handleClose=()=>setMessage(false);

  console.log("PRODUCT:", product);
  console.log("COUNT IN STOCK:", product.countInStock);

  const navigate = useNavigate();
  const location = useLocation();
  const [qty, setqty] = useState(1);

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  return (
    <>
      <div>
        <Link to="/" className="btn btn-dark my-3">
          Go Back
        </Link>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger" onClose={handleClose}>{error}</Message>
        ) : (
          <Row>
            <Col md={6}>
              <Image
                src={product.image}
                alt={product.name}
                fluid
                style={{ height: "400px", objectFit: "contain" }}
              />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h5>
                    Rating:{product.rating} | No.Of.reviews {product.numReviews}
                  </h5>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p>Description:{product.description}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h3>Price:{product.price}</h3>
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card className=" p-4  mx-7 shadow" style={{ border: "1px solid #ddd" }}>
                <ListGroup variant="flush" >
                  <ListGroup.Item style={{ borderBottom: "1px solid #ddd" }}>
                    <Row>
                      <Col md={6}>Status</Col>
                      <Col md={6}>
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item style={{ borderBottom: "1px solid #ddd" }}>
                    <Row>
                      <Col md={6}>Category</Col>
                      <Col md={6}>{product.category}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item style={{ borderBottom: "1px solid #ddd" }}>
                    <Row>
                      <Col md={6}>Brand</Col>
                      <Col md={6}>{product.brand}</Col>
                    </Row>
                  </ListGroup.Item>

                  
                  {product.countInStock > 0 && (
  <ListGroup.Item>
    <Row className="align-items-center">
      <Col md={6}>Qty</Col>
      <Col md={6}>
        <Form.Control
          as="select"
          value={qty}
          onChange={(e) => setqty(Number(e.target.value))}
        >
          {[...Array(product.countInStock).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </Form.Control>
      </Col>
    </Row>
  </ListGroup.Item>
)}
               

                  <ListGroup.Item>
                    <Button
                      className="btn btn-success"
                      disabled={product.countInStock == 0}
                      type="button"
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}

export default ProductDetails;
