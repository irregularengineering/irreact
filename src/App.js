import React, { Component } from 'react';
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

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: null
    }
  }

  componentDidMount() {
    let tabName = null;
    if (Object.values(TABS).indexOf(window.location.pathname) >= 0) {
      tabName = window.location.pathname.slice(1);
    }
    this.setSelectedTab(tabName);
  }
  
  render() {
    return (
      <Router>
        <div className="App">
          { this.renderHeader() }
          <body>
            <Route path="/" exact component={ this.home } />
            <Route path={TABS.languages} component={ () => (<Languages />) } />
            <Route path={TABS.frameworks} component={ () => (<Frameworks />) } />
            <Route path={TABS.careers} component={ () => (<Careers />) } />
            <Route path={TABS.housing} component={ () => (<Housing />) } />
          </body>
        </div>
      </Router>
    );
  }

  renderHeader() {
    return (
      <header className="App-header">
        <Link to="/" onClick={() => this.setSelectedTab(null)}>
          <img className="banner" src={banner} alt="irregular" />
        </Link>
        <Navbar class="navbar">
          <Navbar.Brand className="navbar-brand">
            <Link class="brand" to="/" onClick={() => this.setSelectedTab(null)}>Irreact</Link>
          </Navbar.Brand>
          <Nav>
            <Link className={this.getTabClass("languages")} to={TABS.languages} onClick={() => this.setSelectedTab("languages")}>
              LANGUAGES
            </Link>
            <Link className={this.getTabClass("frameworks")} to={TABS.frameworks} onClick={() => this.setSelectedTab("frameworks")}>
              FRAMEWORKS
            </Link>
            <Link className={this.getTabClass("careers")} to={TABS.careers} onClick={() => this.setSelectedTab("careers")}>
              CAREERS
            </Link>
            <Link className={this.getTabClass("housing")} to={TABS.housing} onClick={() => this.setSelectedTab("housing")}>
              HOUSING
            </Link>
          </Nav>
        </Navbar>
      </header>
    );
  }

  setSelectedTab(tabName) {
    this.setState({selectedTab: tabName});
  }

  getTabClass(tabName) {
    return this.state.selectedTab === tabName ? "navbar-link-selected" : "navbar-link";
  }

  home() {
    return (
      <img className="professor" src={professor} alt="professor" />
    );
  }
}

export default App;
