import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import banner from './irregular_banner.png';
import professor from './professor.jpg';
import Languages from './components/languages.js';
import Frameworks from './components/frameworks.js';
import Careers from './components/careers.js';
import Housing from './components/housing.js';
import './App.css';

const TABS = {
  languages: "/languages",
  frameworks: "/frameworks",
  careers: "/careers",
  housing: "/housing"
};

export default function App() {
  const [selectedTab, setSelectedTab] = useState();

  function getTabClass(tabName) {
    return selectedTab === tabName ? "navbar-link-selected" : "navbar-link";
  }

  function renderHeader() {
    return (
      <header className="App-header">
        <Link to="/" onClick={() => setSelectedTab(null)}>
          <img className="banner" src={banner} alt="irregular" />
        </Link>
        <Navbar className="navbar">
          <Navbar.Brand className="navbar-brand">
            <Link className="brand" to="/" onClick={() => setSelectedTab(null)}>Irreact</Link>
          </Navbar.Brand>
          <Nav>
            <Link className={getTabClass("languages")} to={TABS.languages} onClick={() => setSelectedTab("languages")}>
              LANGUAGES
            </Link>
            <Link className={getTabClass("frameworks")} to={TABS.frameworks} onClick={() => setSelectedTab("frameworks")}>
              FRAMEWORKS
            </Link>
            <Link className={getTabClass("careers")} to={TABS.careers} onClick={() => setSelectedTab("careers")}>
              CAREERS
            </Link>
            <Link className={getTabClass("housing")} to={TABS.housing} onClick={() => setSelectedTab("housing")}>
              HOUSING
            </Link>
          </Nav>
        </Navbar>
      </header>
    );
  }

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      let tabName = null;
      if (Object.values(TABS).indexOf(window.location.pathname) >= 0) {
        tabName = window.location.pathname.slice(1);
      }
      setSelectedTab(tabName);
    }

    return () => mounted = false;
  }, []);

  return (
    <Router>
      <div className="App">
        { renderHeader() }
          <Route path="/" exact component={ home } />
          <Route path={TABS.languages} component={ () => (<Languages />) } />
          <Route path={TABS.frameworks} component={ () => (<Frameworks />) } />
          <Route path={TABS.careers} component={ () => (<Careers />) } />
          <Route path={TABS.housing} component={ () => (<Housing />) } />
      </div>
    </Router>
  );
}

function home() {
  return (
    <img className="professor" src={professor} alt="professor" />
  );
}
