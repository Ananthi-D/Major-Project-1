import React from 'react'
import {Container,Row,Col} from 'react-bootstrap'

function Footer() {
  return (
    <footer className=" mt-auto">
      <Container>
        <Row>
          <Col className="text-center py-3 text-dark">
          Copyright @copy; guvi.in
          </Col>
        </Row>
      </Container>
    </footer>
  
  )
}

export default Footer;
