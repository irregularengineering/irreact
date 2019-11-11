import React, { Component } from 'react';

class Housing extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className="container">
        <div className="chart-title">
          Coming Soon
        </div>
      </div>
    );
  }
}

export default Housing;
