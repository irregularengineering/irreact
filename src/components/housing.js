import React, { useState, useEffect } from 'react';
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

const PRICE_MEASURE = 'PRICE';
const PRICE_PER_SQFT_MEASURE = 'PRICE PER SQ FT';

const DEFAULT_CITIES = [
  'Mountain View',
  'Redwood City',
  'Palo Alto',
  'San Mateo',
].map(city => {
  return { value: city, label: city }
});

export default function Housing() {
  const [priceCities, setPriceCities] = useState();
  const [priceData, setPriceData] = useState();

  const [squareFootCities, setSquareFootCities] = useState();
  const [squareFootData, setSquareFootData] = useState();

  const [cityOptions, setCityOptions] = useState();
  const [selectedCities, setSelectedCities] = useState(DEFAULT_CITIES);
  const [selectedMeasure, setSelectedMeasure] = useState(PRICE_MEASURE);
  const [layout, setLayout] = useState({ ...LAYOUT, yaxis: {title: PRICE_MEASURE } });
  const [plotData, setPlotData] = useState();

  function handleCitiesChanged(selectedCities) { 
    setSelectedCities(selectedCities);
    loadData(selectedCities, selectedMeasure);
  }
  
  function handleMeasureSelected(selectedMeasure) {
    if (selectedMeasure === PRICE_MEASURE) {
      setCityOptions(priceCities);
    } else {
      setCityOptions(squareFootCities);
    }
    setLayout({ ...LAYOUT, yaxis: {title: selectedMeasure } });
    setSelectedMeasure(selectedMeasure);
    loadData(selectedCities, selectedMeasure);
  }

  function loadData(selectedCities, selectedMeasure) {
    let rows = selectedMeasure === PRICE_MEASURE ? priceData : squareFootData;
    if (!rows) {
      return;
    }
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
    setPlotData(plotData);
  }

  useEffect(() => {
    let mounted = true;

    Plotly.d3.csv('/data/housing_price_data.csv', (err, priceData) => {
      let priceCitiesList = [...new Set(priceData.map(row => row.city))].sort();
      let priceCities = priceCitiesList.map(city => {
        return { value: city, label: city }
      });
      if (mounted) {
        setPriceCities(priceCities);
        setPriceData(priceData);
        setCityOptions(priceCities);
        loadData(selectedCities, selectedMeasure);
      }
    });
    Plotly.d3.csv('/data/housing_price_per_foot_data.csv', (err, squareFootData) => {
      let squareFootCitiesList = [...new Set(squareFootData.map(row => row.city))].sort();
      let squareFootCities = squareFootCitiesList.map(city => {
        return { value: city, label: city }
      });
      if (mounted) {
        setSquareFootCities(squareFootCities);
        setSquareFootData(squareFootData);
      }
    });

    return () => mounted = false;
  });

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
              onClick={() => handleMeasureSelected(PRICE_MEASURE)}
            >
              {PRICE_MEASURE}
            </Button>
            <Button 
              className="radio-button"
              active={selectedMeasure === PRICE_PER_SQFT_MEASURE}
              onClick={() => handleMeasureSelected(PRICE_PER_SQFT_MEASURE)}
            >
              {PRICE_PER_SQFT_MEASURE}
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div className="dropdown">
        <Select
          value={selectedCities}
          onChange={handleCitiesChanged}
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
