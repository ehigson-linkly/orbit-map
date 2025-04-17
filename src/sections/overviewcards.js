import React, { useContext } from 'react';
import { TerminalContext } from '../context/terminalcontext';
import { FiActivity, FiDollarSign, FiAlertTriangle, FiClock } from 'react-icons/fi';

export default function OverviewCards() {
  const { terminals } = useContext(TerminalContext);
  
  const onlineTerminals = terminals.filter(t => t.status === 'online').length;
  const offlineTerminals = terminals.filter(t => t.status === 'offline').length;
  const totalVolume = terminals.reduce((sum, t) => sum + t.volume, 0);
  const avgUptime = terminals.reduce((sum, t) => sum + t.uptime, 0) / terminals.length;
  
  const cards = [
    {
      title: 'Active Terminals',
      value: onlineTerminals.toLocaleString(),
      change: '+5.2%',
      icon: <FiActivity className="w-6 h-6 text-blue-500" />,
      trend: 'up'
    },
    {
      title: 'Daily Volume',
      value: `$${(totalVolume / 1000).toFixed(1)}K`,
      change: '+12.7%',
      icon: <FiDollarSign className="w-6 h-6 text-green-500" />,
      trend: 'up'
    },
    {
      title: 'Terminal Issues',
      value: offlineTerminals,
      change: '-3.1%',
      icon: <FiAlertTriangle className="w-6 h-6 text-yellow-500" />,
      trend: 'down'
    },
    {
      title: 'Avg Uptime',
      value: `${avgUptime.toFixed(1)}%`,
      change: '+0.8%',
      icon: <FiClock className="w-6 h-6 text-purple-500" />,
      trend: 'up'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="text-2xl font-semibold mt-1">{card.value}</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50">
              {card.icon}
            </div>
          </div>
          <div className={`mt-4 text-sm flex items-center ${
            card.trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{card.change}</span>
            <span className="ml-1">vs last period</span>
          </div>
        </div>
      ))}
    </div>
  );
}