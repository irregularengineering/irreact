import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js';

const SOURCE = 'https://www.npmjs.com/';

const LAYOUT = {
  width: 900, 
  height: 500,
  margin: {'l': 50, 'b': 50, 't': 60, 'r': 10},
  xaxis: { title: 'Date' },
  yaxis: { title: 'Downloads' },
};

export default function Frameworks () {
  const [plotData, setPlotData] = useState();

  useEffect(() => {
    let mounted = true;

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
      if (mounted) {
        setPlotData(plotData);
      }
    });

    return () => mounted = false;
  }, []);

  return (
    <div className="container">
      <div className="chart-title">
        Javascript Web Framework Weekly Downloads
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
