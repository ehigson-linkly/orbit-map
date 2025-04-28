import React, { useContext } from 'react';
import { TerminalContext } from '../context/TerminalContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STATUS_COLORS = {
  online: '#10B981',
  offline: '#EF4444'
};

export default function TerminalStatusChart() {
  const { terminals } = useContext(TerminalContext);
  
  const statusCounts = terminals.reduce((acc, terminal) => {
    acc[terminal.status] = (acc[terminal.status] || 0) + 1;
    return acc;
  }, {});
  
  const data = [
    { name: 'Online', value: statusCounts.online || 0, status: 'online' },
    { name: 'Offline', value: statusCounts.offline || 0, status: 'offline' }
  ];

  const totalTerminals = data.reduce((sum, item) => sum + item.value, 0);
  const uptimePercentage = ((data[0].value / totalTerminals) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Terminal Status</h3>
          <p className="text-sm text-gray-500">Current online/offline distribution</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">Total Terminals</p>
            <p className="text-lg font-bold">{totalTerminals.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Uptime</p>
            <p className="text-lg font-bold text-green-600">{uptimePercentage}%</p>
          </div>
        </div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid horizontal={true} vertical={false} stroke="#f0f0f0" />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
            <Tooltip 
              formatter={(value) => [`${value} terminals`, 'Count']}
              contentStyle={{
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: 'none'
              }}
            />
            <Bar dataKey="value" name="Terminals" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        {data.map((item) => (
          <div key={item.name} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: STATUS_COLORS[item.status] }}
                ></div>
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-bold">{item.value.toLocaleString()}</span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full" 
                  style={{ 
                    width: `${(item.value / totalTerminals) * 100}%`,
                    backgroundColor: STATUS_COLORS[item.status]
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {((item.value / totalTerminals) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
