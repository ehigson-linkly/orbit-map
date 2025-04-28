import React, { useContext } from 'react';
import { TerminalContext } from '../context/TerminalContext';
import { FiActivity, FiDollarSign, FiAlertTriangle, FiClock, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function OverviewCards() {
  const { terminals } = useContext(TerminalContext);
  
  const onlineTerminals = terminals.filter(t => t.status === 'online').length;
  const offlineTerminals = terminals.filter(t => t.status === 'offline').length;
  const totalVolume = terminals.reduce((sum, t) => sum + t.volume, 0);
  const avgUptime = terminals.reduce((sum, t) => sum + t.uptime, 0) / terminals.length;
  
  // Calculate month-over-month changes
  const prevOnline = Math.floor(onlineTerminals * 0.95);
  const prevVolume = Math.floor(totalVolume * 0.93);
  const prevUptime = avgUptime * 0.995;
  const prevIssues = Math.floor(offlineTerminals * 1.07);

  const cards = [
    {
      title: 'Active Terminals',
      value: onlineTerminals.toLocaleString(),
      change: ((onlineTerminals - prevOnline) / prevOnline * 100).toFixed(1),
      icon: <FiActivity className="w-5 h-5" />,
      trend: onlineTerminals >= prevOnline ? 'up' : 'down',
      color: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Daily Volume',
      value: `$${(totalVolume / 1000).toFixed(1)}K`,
      change: ((totalVolume - prevVolume) / prevVolume * 100).toFixed(1),
      icon: <FiDollarSign className="w-5 h-5" />,
      trend: totalVolume >= prevVolume ? 'up' : 'down',
      color: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Terminal Issues',
      value: offlineTerminals,
      change: ((offlineTerminals - prevIssues) / prevIssues * 100).toFixed(1),
      icon: <FiAlertTriangle className="w-5 h-5" />,
      trend: offlineTerminals <= prevIssues ? 'down' : 'up',
      color: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Avg Uptime',
      value: `${avgUptime.toFixed(1)}%`,
      change: ((avgUptime - prevUptime) / prevUptime * 100).toFixed(1),
      icon: <FiClock className="w-5 h-5" />,
      trend: avgUptime >= prevUptime ? 'up' : 'down',
      color: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className={`${card.color} rounded-xl shadow-sm border border-gray-100 p-6`}>
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className={`text-2xl font-bold mt-1 ${card.textColor}`}>{card.value}</p>
            </div>
            <div className={`p-2 rounded-lg ${card.color.replace('50', '100')}`}>
              {card.icon}
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`inline-flex items-center ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {card.trend === 'up' ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
              {Math.abs(card.change)}%
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>
      ))}
    </div>
  );
}
