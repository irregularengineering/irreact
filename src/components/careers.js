import React, { Component } from 'react';
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

class Careers extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.occupationSelected = this.occupationSelected.bind(this);
    this.updatePlotData = this.updatePlotData.bind(this);
    this.stateHovered = this.stateHovered.bind(this);
    this.renderTableRows = this.renderTableRows.bind(this);
    this.state = {
      plotData: null,
      selectedOccupation: null,
      occupations: null,
      rows: null,
      stateMap: null,
      stateHovered: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    Plotly.d3.csv('/data/occupation_data.csv', (err, rows) => {
      if (this._isMounted) {
        let occupationsList = [...new Set(rows.map(row => row.occupation))].sort();
        let occupations = occupationsList.map(occupation => {
          return { value: occupation, label: occupation }
        });
        this.setState({ rows });
        this.setState({ occupations });;
        let selectedOccupation = occupations[0];
        this.updatePlotData(selectedOccupation, rows);
        this.setState({ selectedOccupation });
        this.setState({ stateMap: this.buildStateMap(rows) });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  buildStateMap(rows) {
    let stateMap = {}
    rows.forEach(row => {
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

  occupationSelected(selectedOccupation) {
    let { rows } = this.state;
    this.setState({ selectedOccupation });
    if (selectedOccupation === null) {
      this.setState({ plotData: [PLOT_DATA_PLACEHOLDER] });
      return;
    }
    this.updatePlotData(selectedOccupation, rows);
  }

  updatePlotData(selectedOccupation, rows) {
    let occupationRows = rows.filter(row => 
      row.occupation === selectedOccupation.value && row.measure === 'Annual median wage'
    );
    let plotData = Object.assign({}, PLOT_DATA_PLACEHOLDER);
    plotData.locations = occupationRows.map(row => row.state);
    plotData.z = occupationRows.map(row => row.value);
    this.setState({ plotData: [plotData] });
  }

  stateHovered(hoverEvent) {
    if (!hoverEvent || !hoverEvent.points) {
      return;
    }
    this.setState({ stateHovered: hoverEvent.points[0].location });
  }

  renderStatsTable(state, stateMap, occupations) {
    if (!state) {
      return;
    }
    let tableRows = this.renderTableRows(stateMap[state], occupations);
    return (
      <div>
      <table className="table stats-table">
        <thead>
          <tr>
            <th>Occupation</th>
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

  renderTableRows(stateStats, occupations) {
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

  render() {
    let { plotData, occupations, selectedOccupation, stateHovered, stateMap } = this.state;

    let statsTable = this.renderStatsTable(stateHovered, stateMap, occupations);

    return (
      <div className="container">
        <div className="chart-title">
          Software Engineer Median Annual Salary by State
        </div>
        <div className="dropdown">
          <Select
            value={selectedOccupation}
            onChange={this.occupationSelected}
            options={occupations}
            placeholder='Select an occupation...'
          />
        </div>
        <div className="plot">
          <Plot
            data={plotData}
            layout={LAYOUT}
            onHover={this.stateHovered}
          />
        </div>
        {statsTable}
        <div className="source-link">
          <a href={SOURCE} target="_blank" rel="noopener noreferrer">Source: {SOURCE}</a>
        </div>
      </div>
    );
  }
}

export default Careers;
