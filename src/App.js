import React, { Component } from 'react';
import { Nav, NavItem, Navbar, NavDropdown } from 'react-bootstrap';
import banner from './irregular_banner.png';
import professor from './professor.jpg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img className="banner" src={banner} alt="irregular" />
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">IRREACT</Navbar.Brand>
            <Nav>
              <Nav.Link href="/">Languages</Nav.Link>
              <Nav.Link href="/">Frameworks</Nav.Link>
              <Nav.Link href="/">Careers</Nav.Link>
              <Nav.Link href="/">Housing</Nav.Link>
            </Nav>
          </Navbar>
        </header>
        <body>
          <img className="professor" src={professor} alt="professor" />
        </body>
      </div>
    );
  }
}

export default App;
