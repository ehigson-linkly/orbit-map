import React, { useContext } from 'react';
import { TerminalContext } from '../context/TerminalContext';

export default function TopMerchantsTable() {
  const { terminals } = useContext(TerminalContext);
  
  // Aggregate merchant data
  const merchantData = terminals.reduce((acc, terminal) => {
    if (!acc[terminal.merchantName]) {
      acc[terminal.merchantName] = {
        terminals: 0,
        uptime: 0,
        totalValue: 0,
        totalVolume: 0
      };
    }
    acc[terminal.merchantName].terminals += 1;
    acc[terminal.merchantName].uptime += terminal.uptime;
    acc[terminal.merchantName].totalValue += terminal.creditValue + terminal.debitValue;
    acc[terminal.merchantName].totalVolume += terminal.creditVolume + terminal.debitVolume;
    return acc;
  }, {});

  const topMerchants = Object.entries(merchantData)
    .map(([name, data]) => ({
      name,
      terminals: data.terminals,
      uptime: (data.uptime / data.terminals).toFixed(1),
      atvValue: (data.totalValue / data.totalVolume).toFixed(2),
      atvVolume: (data.totalVolume / data.terminals).toFixed(0),
      trend: Math.random() > 0.5 ? 'up' : 'down'
    }))
    .sort((a, b) => b.terminals - a.terminals)
    .slice(0, 10);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Merchants</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terminals</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ATV ($)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ATV (#)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topMerchants.map((merchant, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{merchant.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{merchant.terminals}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{merchant.uptime}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${merchant.atvValue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{merchant.atvVolume}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    merchant.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {merchant.trend === 'up' ? '↑' : '↓'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
