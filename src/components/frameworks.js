import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js';

const SOURCE = 'https://www.npmjs.com/';

const LAYOUT = {
  width: 900, 
  height: 500,
  title: 'Javascript Web Framework Weekly Downloads',
  margin: {'l': 50, 'b': 50, 't': 60, 'r': 10},
  titlefont: { size: 30 },
  xaxis: { title: 'Date' },
  yaxis: { title: 'Downloads' },
};

class Frameworks extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      plotData: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    Plotly.d3.csv('/data/npm_downloads.csv', (err, rows) => {
      let frameworks = [...new Set(rows.map(row => row.framework))];
      let plotData = frameworks.map(framework => {
        let frameworkRows = rows.filter(row => row.framework === framework);
        return {
          type: 'scatter',
          mode: 'lines',
          name: framework,
          x: frameworkRows.map(row => row.date),
          y: frameworkRows.map(row => row.downloads),
        };
      });
      if (this._isMounted) {
        this.setState({ plotData: plotData });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let { plotData } = this.state;
    return (
      <div className="plot">
        <Plot
          data={ plotData }
          layout={ LAYOUT }
        />
        <div><a href={ SOURCE } target="_blank" rel="noopener noreferrer">Source: { SOURCE }</a></div>
      </div>
    );
  }
}

export default Frameworks;
