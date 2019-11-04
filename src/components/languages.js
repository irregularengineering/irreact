import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js';

const SOURCE = 'https://www.tiobe.com/tiobe-index/';

const LAYOUT = {
  width: 900, 
  height: 500,
  title: 'Programming Language Popularity (TIOBE Index)',
  margin: {'l': 50, 'b': 50, 't': 60, 'r': 10},
  titlefont: { size: 30 },
  xaxis: { title: 'Year' },
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

export default Languages;
