import React from 'react';

const merchants = [
  { name: 'Café Nero', transactions: 2210, value: '$84,290', growth: '+12.3%' },
  { name: 'FuelCo', transactions: 1870, value: '$120,380', growth: '+9.7%' },
  { name: 'Health Plus', transactions: 1512, value: '$41,998', growth: '+7.8%' },
  { name: 'BikeStore', transactions: 1204, value: '$25,717', growth: '+5.6%' },
];

export default function CampaignPerformance() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Merchant Growth</h3>
      <table className="w-full text-sm text-left border-separate border-spacing-y-2">
        <thead className="text-xs uppercase text-gray-500">
          <tr>
            <th>No.</th><th>Merchant</th><th>Transactions</th><th>Value</th><th>Growth</th>
          </tr>
        </thead>
        <tbody>
          {merchants.map((m, idx) => (
            <tr key={m.name} className="bg-white rounded-lg shadow-sm border">
              <td className="px-2 py-2">{idx + 1}</td>
              <td className="px-2 py-2">{m.name}</td>
              <td className="px-2 py-2">{m.transactions}</td>
              <td className="px-2 py-2">{m.value}</td>
              <td className="px-2 py-2 text-green-500">{m.growth}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}