import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js';
import Select from 'react-select';

const SOURCE = 'https://www.zillow.com/research/data/';

const LAYOUT = {
  width: 900, 
  height: 500,
  margin: {'l': 50, 'b': 50, 't': 60, 'r': 10},
  xaxis: { title: 'Date' },
  yaxis: { title: 'Downloads' },
};

const MEASURES = [
  { value: 'price', label: 'Price' },
  { value: 'price_per_square_foot', label: 'Price per square foot' },
]

const DEFAULT_CITIES = [
  'Mountain View',
  'Redwood City',
  'Palo Alto',
  'Los Altos',
].map(city => {
  return { value: city, label: city }
});

class Housing extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.measureSelected = this.measureSelected.bind(this);
    this.citiesChanged = this.citiesChanged.bind(this);
    this.state = {
      priceCities: null,
      priceData: null,
      squareFootCities: null,
      squareFootData: null,
      cityOptions: null,
      selectedCities: DEFAULT_CITIES,
      selectedMeasure: MEASURES[0],
    };
  }

  componentDidMount() {
    this._isMounted = true;
    Plotly.d3.csv('/data/housing_price_data.csv', (err, rows) => {
      let priceCitiesList = [...new Set(rows.map(row => row.city))].sort();
      let priceCities = priceCitiesList.map(city => {
        return { value: city, label: city }
      });
      if (this._isMounted) {
        this.setState({ priceCities });
        this.setState({ priceData: rows });
        this.setState({ cityOptions: priceCities } );
      }
    });
    Plotly.d3.csv('/data/housing_price_per_foot_data.csv', (err, rows) => {
      let squareFootCitiesList = [...new Set(rows.map(row => row.city))].sort();
      let squareFootCities = squareFootCitiesList.map(city => {
        return { value: city, label: city }
      });
      if (this._isMounted) {
        this.setState({ squareFootCities });
        this.setState({ squareFootData: rows });
      }
    });
  }



  componentWillUnmount() {
    this._isMounted = false;
  }

  citiesChanged(selectedCities) {
    // let { selectedMeasure, priceCities, squareFootCities } = this.state;
    // if (selectedMeasure === 'Price') {
    //   this.setState({ cityOptions: priceCities });
    // } else {
    //   this.setState({ cityOptions: squareFootCities });
    // }
    // this.setState({ selectedCities });
  }

  measureSelected(measure) {
    // this.setState({ measure });
  }

  render() {
    let { selectedMeasure, selectedCities, cityOptions } = this.state;
    return (
      <div className="container">
        <div className="chart-title">
          Median Monthly Sale Price by California City
        </div>
        <div className="dropdown">
          <Select
            value={selectedCities}
            onChange={this.citiesChanged}
            options={cityOptions}
            isMulti={true}
            placeholder='Select cities...'
          />
        </div>
        {/* <div className="plot">
          <Plot
            data={plotData}
            layout={LAYOUT}
          />
        </div>
        <div className="source-link">
          <a href={SOURCE} target="_blank" rel="noopener noreferrer">Source: {SOURCE}</a>
        </div> */}
      </div>
    );
  }
}

export default Housing;
