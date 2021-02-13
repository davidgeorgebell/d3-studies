import React, { useState, useEffect } from 'react';
import { csv, scaleBand, scaleLinear, max } from 'd3';

const csvUrl =
  'https://gist.githubusercontent.com/curran/0ac4077c7fc6390f5dd33bf5c06cb5ff/raw/605c54080c7a93a417a3cea93fd52e7550e76500/UN_Population_2019.csv';

let dimensions = {
  width: window.innerWidth * 0.9,
  height: 400,
  margin: {
    top: 15,
    right: 15,
    bottom: 40,
    left: 60,
  },
};
dimensions.boundedWidth =
  dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight =
  dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

export const FirstBarChart = () => {
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    const row = d => {
      d.Population = parseFloat(d['2020']);
      return d;
    };
    csv(csvUrl, row).then(dataset => {
      setDataset(dataset.slice(0, 10));
    });
  }, []);

  if (!dataset) {
    return <pre>Loading...</pre>;
  }

  const yScale = scaleBand()
    .domain(dataset.map(d => d.Country))
    .range([0, dimensions.boundedHeight]);

  const xScale = scaleLinear()
    .domain([0, max(dataset, d => d.Population)])
    .range([0, dimensions.boundedWidth]);

  console.log(xScale.ticks());

  return (
    <svg width={dimensions.width} height={dimensions.height}>
      <g
        transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}>
        {xScale.ticks().map((tickValue, i) => (
          <g transform={`translate(${xScale(tickValue)}, 0)`}>
            <line y2={dimensions.boundedHeight} stroke='black' key={i} />
            <text
              dy='.71em'
              textAnchor='middle'
              y={dimensions.boundedHeight + 3}>
              {tickValue}
            </text>
          </g>
        ))}
        {yScale.domain().map(tickValue => (
          <text
            key={tickValue}
            style={{ textAnchor: 'end' }}
            x={-3}
            dy='.32em'
            y={yScale(tickValue) + yScale.bandwidth() / 2}>
            {tickValue}
          </text>
        ))}
        {dataset.map((d, i) => (
          <rect
            x={0}
            y={yScale(d.Country)}
            width={xScale(d.Population)}
            height={yScale.bandwidth()}
            key={i}
            fill='skyblue'
          />
        ))}
      </g>
    </svg>
  );
};
