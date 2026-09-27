import React from "react";
import { Card } from "react-bootstrap";
import {Link} from 'react-router-dom'


function ProductScreen({ product }) {



  return (
    <>
      <Card className="my-3 p-2 rounded" style={{border:"1px solid #ddd"}}>
        <Link to={`/products/${product._id}`}>
          <Card.Img src={`http://127.0.0.1:8000${product.image}`} 
          className="d-block mx-auto"
          style={{height:'160px', width:'60%', objectFit:"contain" }}/>
        </Link>

        <Card.Body>
          <Link to={`/products/${product._id}`}>
            <Card.Title>
              <strong>{product.name}</strong>
            </Card.Title>
         </Link>

          <Card.Text as="h5">
            <div className="my-3">
              {product.rating} from {product.numReviews} reviews
            </div>
          </Card.Text>

         <Card.Text as="h6">
            <div className="my-3">
              Rs {product.price}
            </div>
          </Card.Text>

          <Card.Text as="h6">
            
             <Link  className="my-3 text-success" to={`/products/${product._id}`}>
              View More
              </Link>
         
          </Card.Text>



        </Card.Body>
      </Card>
    </>
  );
}

export default ProductScreen;
