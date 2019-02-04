import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import banner from './irregular_banner.png';
import professor from './professor.jpg';
import Languages from './components/languages.js';
import Frameworks from './components/frameworks.js';
import Careers from './components/careers.js';
import Housing from './components/housing.js';
import './App.css';

class App extends Component {
  
  render() {
    return (
      <Router>
        <div className="App">
          { this.renderHeader() }
          <body>
            <Route path="/" exact component={ this.home } />
            <Route path="/languages" component={ () => (<Languages />) } />
            <Route path="/frameworks" component={ () => (<Frameworks />) } />
            <Route path="/careers" component={ () => (<Careers />) } />
            <Route path="/housing" component={ () => (<Housing />) } />
          </body>
        </div>
      </Router>
    );
  }

  renderHeader() {
    return (
      <header className="App-header">
        <img className="banner" src={banner} alt="irregular" />
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">IRREACT</Navbar.Brand>
          <Nav>
            <Nav.Link href="/languages">Languages</Nav.Link>
            <Nav.Link href="/frameworks">Frameworks</Nav.Link>
            <Nav.Link href="/careers">Careers</Nav.Link>
            <Nav.Link href="/housing">Housing</Nav.Link>
          </Nav>
        </Navbar>
      </header>
    );
  }

  home() {
    return (
      <img className="professor" src={professor} alt="professor" />
    );
  }
}

export default App;
