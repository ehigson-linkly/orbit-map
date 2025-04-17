import React from 'react';

const metrics = [
  { label: 'Active Terminals', value: '12,480', change: '+5.4%' },
  { label: 'Monthly Volume', value: '$1.48M', change: '+2.1%' },
  { label: 'Terminal Uptime', value: '98.7%', change: '+0.3%' },
  { label: 'Churn Rate', value: '4.3%', change: '-0.9%' },
];

export default function MetricCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-white p-4 rounded-xl shadow-sm border">
          <h3 className="text-xs uppercase text-gray-500 tracking-wide mb-1">{metric.label}</h3>
          <p className="text-xl font-semibold">{metric.value}</p>
          <p className={
            metric.change.startsWith('-')
              ? 'text-red-500 text-sm'
              : 'text-green-500 text-sm'
          }>{metric.change}</p>
        </div>
      ))}
    </div>
  );
}