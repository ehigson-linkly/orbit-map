import React, { useContext } from 'react';
import { TerminalContext } from '../context/TerminalContext';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function TopMerchantsTable() {
  const { terminals } = useContext(TerminalContext);
  
  // Simulate merchant data aggregation
  const merchantData = terminals.reduce((acc, terminal) => {
    if (!acc[terminal.merchantType]) {
      acc[terminal.merchantType] = {
        terminals: 0,
        volume: 0,
        uptime: 0,
        growth: (Math.random() * 20 - 5).toFixed(1)
      };
    }
    acc[terminal.merchantType].terminals += 1;
    acc[terminal.merchantType].volume += terminal.volume;
    acc[terminal.merchantType].uptime += terminal.uptime;
    return acc;
  }, {});
  
  const topMerchants = Object.entries(merchantData)
    .map(([name, data]) => ({
      name,
      terminals: data.terminals,
      volume: data.volume,
      avgUptime: (data.uptime / data.terminals).toFixed(1),
      growth: parseFloat(data.growth)
    }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Merchants by Volume</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terminals</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topMerchants.map((merchant, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">{merchant.name.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{merchant.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{merchant.terminals.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${(merchant.volume / 1000).toFixed(1)}K</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{merchant.avgUptime}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center text-sm ${
                    merchant.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {merchant.growth >= 0 ? (
                      <FiTrendingUp className="mr-1" />
                    ) : (
                      <FiTrendingDown className="mr-1" />
                    )}
                    {Math.abs(merchant.growth)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}