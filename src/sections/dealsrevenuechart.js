import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'May', terminals: 1000, volume: 250000 },
  { month: 'Jun', terminals: 1050, volume: 260000 },
  { month: 'Jul', terminals: 1100, volume: 270000 },
  { month: 'Aug', terminals: 1075, volume: 265000 },
  { month: 'Sep', terminals: 1150, volume: 280000 },
  { month: 'Oct', terminals: 1120, volume: 275000 },
];

export default function DealsRevenueChart() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Terminals & Volume</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Line yAxisId="left" type="monotone" dataKey="terminals" stroke="#8884d8" name="Terminals" />
          <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#82ca9d" name="Volume ($)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}