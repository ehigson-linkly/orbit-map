import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Retail', value: 4400 },
  { name: 'Hospitality', value: 3600 },
  { name: 'Petrol', value: 2700 },
  { name: 'Other', value: 1200 },
];

const COLORS = ['#82ca9d', '#8884d8', '#ffc658', '#ff8042'];

export default function RevenueChannelsPie() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border h-[350px]">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Terminal Industry Split</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}