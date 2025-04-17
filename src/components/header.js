import React, { useContext } from 'react';
import { TerminalContext } from '../context/TerminalContext';
import { FiSearch, FiBell, FiCalendar, FiChevronDown } from 'react-icons/fi';

export default function Header() {
  const { timeRange, setTimeRange } = useContext(TerminalContext);
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="relative w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search terminals, merchants..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <FiBell className="text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <FiCalendar className="text-gray-600" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm text-gray-700"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last quarter</option>
          </select>
          <FiChevronDown className="text-gray-400" />
        </div>
        
        <div className="w-px h-8 bg-gray-200"></div>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-medium">AU</span>
          </div>
          <span className="text-sm font-medium">Admin User</span>
        </div>
      </div>
    </header>
  );
}