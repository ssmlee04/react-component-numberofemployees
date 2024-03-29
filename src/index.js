import React from "react";
import _ from "lodash";
import { Bar } from 'react-chartjs-2';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc';
dayjs.extend(dayjsPluginUTC);

export class NumberOfEmployees extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { profile, imgProp = 'num_employees', theme = 'light' } = this.props;
    const { copied } = this.state;
    if (!profile) {
      return (
        <div style={{ fontSize: 12 }}>Not available at this time... </div>
      );
    }
    if (profile[imgProp] && profile[imgProp].url) {
      const btnClass = copied ? 'react-components-show-url btn btn-sm btn-danger disabled font-12' : 'react-components-show-url btn btn-sm btn-warning font-12';
      const btnText = copied ? 'Copied' : 'Copy Img';
      return (
        <div className='react-components-show-button'>
          <img alt={`${profile.ticker} - ${profile.name} Employees and Productivity`} src={profile[imgProp].url} style={{ width: '100%' }} />
          <CopyToClipboard text={profile[imgProp].url || ''}
            onCopy={() => this.setState({ copied: true })}
          >
            <button className={btnClass} value={btnText}>{btnText}</button>
          </CopyToClipboard>
        </div>
      );
    }

    if (!profile || !profile.numbers || !profile.numbers.number_of_employees_ts) return null;
    if (!profile || !profile.numbers || !profile.numbers.revenue_per_employee_ts) return null;
    const number_of_employees_ts = profile.numbers.number_of_employees_ts || [];
    const revenue_per_employee_ts = profile.numbers.revenue_per_employee_ts || [];
    const number_of_employees = number_of_employees_ts.map(d => d.v);
    const revenue_per_employee = revenue_per_employee_ts.map(d => d.v);
    const fontColor = theme === 'light' ? '#222222' : '#dddddd';
    const dataColor = theme === 'light' ? 'rgba(0, 128, 0, 0.3)' : 'rgba(64, 255, 0, 0.5)';
    const gridColor = theme === 'light' ? 'rgba(80, 80, 80, 0.1)' : 'rgba(255, 255, 255, 0.2)';
    const data = {
      // labels: number_of_employees_ts.map(d => dayjs.utc(d.ts).format('YYYYMM')),
      labels: number_of_employees_ts.map(d => dayjs(d.ts).format('YYYYMM')),
      datasets: [{
        yAxisID: '1',
        type: 'line',
        fill: true,
        backgroundColor: dataColor,
        borderColor: dataColor,
        // pointBackgroundColor: 'white',
        lineTension: 0.3,
        borderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 2,
        data: number_of_employees,
        label: 'Number Of Employees'
      // }, {
      //   yAxisID: '2',
      //   type: 'line',
      //   fill: false,
      //   backgroundColor: 'crimson',
      //   borderColor: 'crimson',
      //   pointBackgroundColor: 'white',
      //   lineTension: 0.3,
      //   borderWidth: 1.5,
      //   pointRadius: 3,
      //   pointHoverRadius: 2,
      //   data: revenue_per_employee,
      //   label: 'Revenue Per Employee'
      }]
    };
    const max = _.max(number_of_employees) || 1;
    const min = _.min(number_of_employees) || 1;
    const delta = max - min;
    const yAxisMin = delta > 0 ? Math.max(0, 2 * min - max) : 0;
    
    const options = {
      legend: {
        display: false,
        labels: {
          fontColor,
          fontSize: 12,
          boxWidth: 10,
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontSize: 12,
            fontColor
          },
          gridLines: {
            color: gridColor
          },
          barPercentage: 0.4
        }],
        yAxes: [{
          type: 'linear',
          display: true,
          position: 'left',
          id: '1',
          gridLines: {
            color: gridColor
          },
          labels: {
            show: true
          },
          ticks: {
            fontColor,
            min: yAxisMin,
            fontSize: 12,
              callback: function(label, index, labels) {
                return Math.floor(label);
              }
          },
        },
        // {
        //   type: 'linear',
        //   display: true,
        //   position: 'right',
        //   id: '2',
        //   labels: {
        //     show: true
        //   },
        //   ticks: {
        //     fontColor: 'crimson',
        //     fontSize: 12,
        //     callback: function(label, index, labels) {
        //       return Math.floor(label);
        //     }
        //   },
        // }
        ]
      },
    };

    return (
      <div style={{ width: '100%', padding: 5, fontSize: 12 }}>
        <div className={`theme-darkred-${theme} mb-2`} style={{ fontWeight: 'bold' }}>{profile.ticker} - {profile.name}&nbsp;<span className={`theme-green-${theme}`}>Employees Analysis</span></div>
        <Bar data={data} height={170} options={options} />
        <div style={{ fontSize: 12, padding: 5, paddingTop: 2 }}>Generated by <a href='https://twitter.com/tradeideashq' target='_blank' className={`theme-darkred-${theme}`}>@tradeideashq</a> with <span style={{ fontSize: 16, color: 'red' }}>💡</span></div>
      </div>
    );
  }
}

export default NumberOfEmployees;
