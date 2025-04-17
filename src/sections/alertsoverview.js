import React, { useContext } from 'react';
import { TerminalContext } from '../context/TerminalContext';
import { FiAlertTriangle, FiArrowRight } from 'react-icons/fi';

const alertTypes = {
  offline: { color: 'bg-red-100 text-red-800', icon: <FiAlertTriangle className="text-red-500" /> },
  maintenance: { color: 'bg-yellow-100 text-yellow-800', icon: <FiAlertTriangle className="text-yellow-500" /> },
  low_battery: { color: 'bg-blue-100 text-blue-800', icon: <FiAlertTriangle className="text-blue-500" /> }
};

export default function AlertsOverview() {
  const { terminals } = useContext(TerminalContext);
  
  const alerts = terminals.reduce((acc, terminal) => {
    if (terminal.status !== 'online') {
      acc[terminal.status] = (acc[terminal.status] || 0) + 1;
    }
    return acc;
  }, {});
  
  const totalAlerts = Object.values(alerts).reduce((sum, count) => sum + count, 0);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Active Alerts</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
          View all <FiArrowRight className="ml-1" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mr-3">
              <FiAlertTriangle className="text-red-500" />
            </div>
            <div>
              <p className="font-medium">Offline Terminals</p>
              <p className="text-sm text-gray-500">Require immediate attention</p>
            </div>
          </div>
          <div className="text-lg font-semibold">{alerts.offline || 0}</div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mr-3">
              <FiAlertTriangle className="text-yellow-500" />
            </div>
            <div>
              <p className="font-medium">Maintenance Needed</p>
              <p className="text-sm text-gray-500">Scheduled checks</p>
            </div>
          </div>
          <div className="text-lg font-semibold">{alerts.maintenance || 0}</div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <FiAlertTriangle className="text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Low Battery</p>
              <p className="text-sm text-gray-500">Needs replacement soon</p>
            </div>
          </div>
          <div className="text-lg font-semibold">{alerts.low_battery || 0}</div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Total active alerts</span>
          <span className="text-lg font-semibold">{totalAlerts}</span>
        </div>
      </div>
    </div>
  );
}