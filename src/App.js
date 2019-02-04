import React, { Component } from 'react';
import banner from './irregular_banner.png';
import professor from './professor.jpg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img className="banner" src={banner} alt="irregular" />
          <img className="professor" src={professor} alt="professor" />
        </header>
      </div>
    );
  }
}

export default App;
