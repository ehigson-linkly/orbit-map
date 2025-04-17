import React, { useContext } from 'react';
import { TerminalContext } from '../context/terminalcontext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiActivity } from 'react-icons/fi';

export default function TerminalStatusChart() {
  const { terminals } = useContext(TerminalContext);
  
  const statusCounts = terminals.reduce((acc, terminal) => {
    acc[terminal.status] = (acc[terminal.status] || 0) + 1;
    return acc;
  }, {});
  
  const data = [
    { name: 'Online', value: statusCounts.online || 0, fill: '#4ade80' },
    { name: 'Offline', value: statusCounts.offline || 0, fill: '#f87171' },
    { name: 'Maintenance', value: statusCounts.maintenance || 0, fill: '#fbbf24' },
    { name: 'Low Battery', value: statusCounts.low_battery || 0, fill: '#60a5fa' },
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Terminal Status Overview</h3>
        <div className="flex items-center text-sm text-gray-500">
          <FiActivity className="mr-2" />
          <span>Real-time</span>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Terminals" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <rect key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: item.fill }}
            ></div>
            <span className="text-sm text-gray-600">{item.name}: </span>
            <span className="text-sm font-medium ml-1">{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}