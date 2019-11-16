import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js';
import Select from 'react-select';
import { Button, ButtonGroup } from 'react-bootstrap';

const SOURCE = 'https://www.zillow.com/research/data/';

const LAYOUT = {
  width: 900, 
  height: 500,
  margin: {'l': 50, 'b': 50, 't': 60, 'r': 10},
  xaxis: { title: 'Date' },
};

const PRICE_MEASURE = 'Price';
const PRICE_PER_SQFT_MEASURE = 'Price Per Sq Ft';

const DEFAULT_CITIES = [
  'Mountain View',
  'Redwood City',
  'Palo Alto',
  'San Mateo',
].map(city => {
  return { value: city, label: city }
});

class Housing extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.measureSelected = this.measureSelected.bind(this);
    this.citiesChanged = this.citiesChanged.bind(this);
    this.loadData = this.loadData.bind(this);
    this.state = {
      priceCities: [],
      priceData: [],
      squareFootCities: [],
      squareFootData: [],
      cityOptions: [],
      selectedCities: [],
      selectedMeasure: null,
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
        this.setState({ selectedCities: DEFAULT_CITIES } );
        this.setState({ selectedMeasure: PRICE_MEASURE } );
        this.setState({ layout: { ...LAYOUT, yaxis: {title: PRICE_MEASURE } } });
        this.loadData(DEFAULT_CITIES, PRICE_MEASURE, rows, []);
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
    let { selectedMeasure, priceData, squareFootData } = this.state;
    this.loadData(selectedCities, selectedMeasure, priceData, squareFootData);
    this.setState({ selectedCities });
  }

  measureSelected(selectedMeasure) {
    let { priceCities, squareFootCities, selectedCities, priceData, squareFootData } = this.state;
    this.loadData(selectedCities, selectedMeasure, priceData, squareFootData);
    if (selectedMeasure === PRICE_MEASURE) {
      this.setState({ cityOptions: priceCities });
    } else {
      this.setState({ cityOptions: squareFootCities });
    }
    this.setState({ layout: { ...LAYOUT, yaxis: {title: selectedMeasure } } });
    this.setState({ selectedMeasure });
  }

  loadData(selectedCities, selectedMeasure, priceData, squareFootData) {
    let rows = selectedMeasure === PRICE_MEASURE ? priceData : squareFootData;
    let plotData = (selectedCities || []).map(city => {
      let cityRows = rows.filter(row => row.city === city.value);
      return {
        type: 'scatter',
        mode: 'lines',
        name: city.label,
        x: cityRows.map(row => row.date),
        y: cityRows.map(row => row.price),
      };
    });
    this.setState({ plotData });
  }

  render() {
    let { selectedMeasure, selectedCities, cityOptions, plotData, layout } = this.state;
    return (
      <div className="container">
        <div className="header">
          <div className="chart-title">
            Median Monthly Sale Price by California City
          </div>
          <div className="radio">
            <ButtonGroup>
              <Button 
                className="radio-button"
                active={selectedMeasure === PRICE_MEASURE} 
                onClick={() => this.measureSelected(PRICE_MEASURE)}
              >
                {PRICE_MEASURE}
              </Button>
              <Button 
                className="radio-button"
                active={selectedMeasure === PRICE_PER_SQFT_MEASURE}
                onClick={() => this.measureSelected(PRICE_PER_SQFT_MEASURE)}
              >
                {PRICE_PER_SQFT_MEASURE}
              </Button>
            </ButtonGroup>
          </div>
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
        <div className="plot">
          <Plot
            data={plotData}
            layout={layout}
          />
        </div>
        <div className="source-link">
          <a href={SOURCE} target="_blank" rel="noopener noreferrer">Source: {SOURCE}</a>
        </div>
      </div>
    );
  }
}

export default Housing;
