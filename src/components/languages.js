import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js';

const SOURCE = 'https://www.tiobe.com/tiobe-index/';

const LAYOUT = {
  width: 900, 
  height: 500,
  margin: {'l': 50, 'b': 50, 't': 60, 'r': 10},
  xaxis: { title: 'Date' },
  yaxis: { title: 'Rating' },
};

class Languages extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      plotData: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    Plotly.d3.csv('/data/tiobe_index.csv', (err, rows) => {
      let languages = [...new Set(rows.map(row => row.language))];
      let plotData = languages.map(language => {
        let languageRows = rows.filter(row => row.language === language);
        return {
          type: 'scatter',
          mode: 'lines',
          name: language,
          x: languageRows.map(row => row.date),
          y: languageRows.map(row => row.value),
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
      <div className="container">
        <div className="chart-title">
          Programming Language Popularity (TIOBE Index)
        </div>
        <div className="plot">
          <Plot
            data={plotData}
            layout={LAYOUT}
          />
        </div>
        <div className="source-link">
          <a href={SOURCE} target="_blank" rel="noopener noreferrer">Source: {SOURCE}</a>
        </div>
      </div>
    );
  }
}

export default Languages;
