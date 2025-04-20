import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiMonitor, 
  FiActivity, 
  FiTrendingUp, 
  FiPieChart, 
  FiSettings, 
  FiHelpCircle, 
  FiMap, 
  FiAlertCircle 
} from 'react-icons/fi';

const navItems = [
  { name: 'Terminal Map', icon: <FiMap className="w-5 h-5" />, path: '/terminal-map' }, 
  { name: 'Dashboard', icon: <FiMonitor className="w-5 h-5" />, path: '/dashboard' },
  { name: 'Live Status', icon: <FiActivity className="w-5 h-5" />, path: '/live-status' },
  { name: 'Performance', icon: <FiTrendingUp className="w-5 h-5" />, path: '/performance' },
  { name: 'Revenue Analytics', icon: <FiPieChart className="w-5 h-5" />, path: '/revenue-analytics' },
  { name: 'Alerts', icon: <FiAlertCircle className="w-5 h-5" />, path: '/alerts' },
  { name: 'Settings', icon: <FiSettings className="w-5 h-5" />, path: '/settings' },
  { name: 'Support', icon: <FiHelpCircle className="w-5 h-5" />, path: '/support' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold">TM</span>
          </div>
          <span className="text-xl font-bold tracking-tight">TerminalPro</span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } group`}
            >
              <span className={`mr-3 ${
                isActive 
                  ? 'text-white' 
                  : 'text-gray-400 group-hover:text-white'
              }`}>
                {item.icon}
              </span>
              <span>{item.name}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-white">AD</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-400">admin@terminalpro.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
