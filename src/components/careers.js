import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format'
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js';
import Select from 'react-select';

const SOURCE = 'https://download.bls.gov/pub/time.series/oe';

const PLOT_TYPE = 'choropleth';
const COLOR_BAR = [
  [0.0, '#ffffff'],
  [1.0, '#204060']
]
const LAYOUT = {
  width: 900, 
  height: 500,
  margin: {'l': 50, 'b': 50, 't': 60, 'r': 10},
  geo: {
    scope: 'usa',
    project: { type: 'albers usa' },
    showlakes: true,
    lakecolor: '#ffffff',
  },
};
const PLOT_DATA_PLACEHOLDER = {
  type: PLOT_TYPE,
  locationmode: 'USA-states',
  colorscale: COLOR_BAR,
  autocolorscale: false,
  colorbar: { title: 'Median Salary (USD)'},
  marker: {
    line: {
      color: '#ffffff',
      width: 2,
    }
  },
  locations: [],
  z: []
};
const PERCENTILE_COLUMN_MAP = {
  'Annual 10th percentile wage': '10th Ptile',
  'Annual 25th percentile wage': '25th Ptile',
  'Annual median wage': '50th Ptile',
  'Annual 75th percentile wage': '75th Ptile',
  'Annual 90th percentile wage': '90th Ptile',
};
const TABLE_COLUMNS = [
  '10th Ptile',
  '25th Ptile',
  '50th Ptile',
  '75th Ptile',
  '90th Ptile',
];

export default function Careers() {
  const [occupations, setOccupations] = useState();
  const [occupationData, setOccupationData] = useState();
  const [selectedOccupation, setSelectedOccupation] = useState();
  const [stateMap, setStateMap] = useState();
  const [plotData, setPlotData] = useState([PLOT_DATA_PLACEHOLDER]);
  const [stateHovered, setStateHovered] = useState();

  function buildStateMap(occupationData) {
    let stateMap = {}
    occupationData.forEach(row => {
      if (!(row.state in stateMap)) {
        stateMap[row.state] = {};
      }
      if (!(row.occupation in stateMap[row.state])) {
        stateMap[row.state][row.occupation] = {};
      }
      let column = PERCENTILE_COLUMN_MAP[row.measure];
      if (column && row.value) {
        stateMap[row.state][row.occupation][column] = row.value;
      }
    });
    return stateMap;
  };

  function handleOccupationSelected(selectedOccupation) {
    setSelectedOccupation(selectedOccupation);
    if (selectedOccupation === null) {
      setPlotData([PLOT_DATA_PLACEHOLDER]);
      return;
    }
    updatePlotData(occupationData, selectedOccupation);
  }

  function updatePlotData(occupationData, selectedOccupation) {
    if (!occupationData || !selectedOccupation) {
      console.log('Unable to plot');
      console.log(occupationData);
      console.log(selectedOccupation);
      return;
    }
    let occupationRows = occupationData.filter(row => 
      row.occupation === selectedOccupation.value && row.measure === 'Annual median wage'
    );
    let plotData = Object.assign({}, PLOT_DATA_PLACEHOLDER);
    plotData.locations = occupationRows.map(row => row.state);
    plotData.z = occupationRows.map(row => row.value);
    setPlotData([plotData]);
  }

  function handleStateHovered(hoverEvent) {
    if (!hoverEvent || !hoverEvent.points) {
      return;
    }
    setStateHovered(hoverEvent.points[0].location);
  }

  function renderStatsTable(state) {
    if (!state) {
      return;
    }
    let tableRows = renderTableRows(stateMap[state], occupations);
    return (
      <div>
      <table className="table stats-table">
        <thead>
          <tr>
            <th>{`Occupation (${state})`}</th>
            {TABLE_COLUMNS.map(column => {
              return [<th key={column}>{column}</th>]
            })}
          </tr>
        </thead>
          {tableRows}
      </table>
    </div>
    );
  }

  function renderTableRows(stateStats, occupations) {
    return (
      <tbody>
        {occupations.map((occupation, key) => {
          return [
          <tr key={occupation.value}>
            <td>{occupation.label}</td>
              {TABLE_COLUMNS.map(column => {
                if (!(occupation.value in stateStats) || !(column in stateStats[occupation.value])) {
                  return [<td key={occupation.value + column}></td>]
                }
                return [<td key={occupation.value + column}>
                  <NumberFormat value={stateStats[occupation.value][column]} thousandSeparator={true} displayType={'text'}/>
                  </td>
                ]
              })}
          </tr>
          ]
        })}
      </tbody>
    );
  }

  useEffect(() => {
    let mounted = true;

    Plotly.d3.csv('/data/occupation_data.csv', (err, occupationData) => {
      if (mounted) {
        let occupationsList = [...new Set(occupationData.map(row => row.occupation))].sort();
        let occupations = occupationsList.map(occupation => {
          return { value: occupation, label: occupation }
        });
        let selectedOccupation = occupations[0];
        setOccupationData(occupationData);
        setOccupations(occupations);
        setSelectedOccupation(selectedOccupation);
        setStateMap(buildStateMap(occupationData));
        updatePlotData(occupationData, selectedOccupation);
      }
    });

    return () => mounted = false;
  }, []);


  let statsTable = renderStatsTable(stateHovered);

  return (
    <div className="container">
      <div className="chart-title">
        Software Engineer Median Annual Salary by State
      </div>
      <div className="dropdown">
        <Select
          value={selectedOccupation}
          onChange={handleOccupationSelected}
          options={occupations}
          placeholder='Select an occupation...'
        />
      </div>
      <div className="plot">
        <Plot
          data={plotData}
          layout={LAYOUT}
          onHover={handleStateHovered}
        />
      </div>
      {statsTable}
      <div className="source-link">
        <a href={SOURCE} target="_blank" rel="noopener noreferrer">Source: {SOURCE}</a>
      </div>
    </div>
  );
}
