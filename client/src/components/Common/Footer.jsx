// src/components/Common/Footer.jsx

import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: 'black',
        color: 'white',
      }}
      className="text-center"
    >
      <Container>
        &copy; {new Date().getFullYear()} Course Optimization App
      </Container>
    </footer>
  );
};

export default Footer;
