import React, { useContext } from 'react';
import { TerminalContext } from '../context/TerminalContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiClock } from 'react-icons/fi';

export default function UptimePerformance() {
  // Mock data for uptime trend
  const uptimeData = [
    { month: 'Jan', uptime: 97.2 },
    { month: 'Feb', uptime: 97.8 },
    { month: 'Mar', uptime: 98.1 },
    { month: 'Apr', uptime: 98.4 },
    { month: 'May', uptime: 98.6 },
    { month: 'Jun', uptime: 98.9 },
    { month: 'Jul', uptime: 99.1 },
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Uptime Trend</h3>
        <div className="flex items-center">
          <FiClock className="mr-2 text-gray-400" />
          <span className="text-sm text-gray-500">Last 7 months</span>
        </div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={uptimeData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis domain={[96, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, 'Uptime']} />
            <Line 
              type="monotone" 
              dataKey="uptime" 
              stroke="#4f46e5" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Current Uptime</p>
          <p className="text-2xl font-semibold">{uptimeData[uptimeData.length - 1].uptime}%</p>
        </div>
        <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
          +0.5% from last month
        </div>
      </div>
    </div>
  );
}