import React, { useState } from 'react';
import { FiActivity, FiAlertCircle, FiCheckCircle, FiClock, FiRefreshCw, FiSearch } from 'react-icons/fi';

const ConnectionMonitoring = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Define the connection data structure with status indicators
  const [connections] = useState({
    ACQUIRERS: {
      status: 'healthy',
      items: [
        { name: 'CBA', status: 'healthy', uptime: '99.99%', lastCheck: '2 min ago' },
        { name: 'WESTPAC', status: 'healthy', uptime: '99.98%', lastCheck: '1 min ago' },
        { name: 'NAB', status: 'healthy', uptime: '99.97%', lastCheck: '3 min ago' },
        { name: 'ANZ', status: 'healthy', uptime: '99.96%', lastCheck: '2 min ago' },
        { name: 'FISERV', status: 'healthy', uptime: '99.95%', lastCheck: '4 min ago' },
        { name: 'FIRST DATA', status: 'healthy', uptime: '99.94%', lastCheck: '1 min ago' },
      ],
    },
    POS: {
      status: 'healthy',
      items: [
        {
          name: 'LIGHTSPEED',
          status: 'healthy',
          uptime: '99.93%',
          lastCheck: '5 min ago',
          subItems: [
            { name: 'R-Series', status: 'healthy', uptime: '99.92%' },
            { name: 'Vend', status: 'healthy', uptime: '99.91%' },
            { name: 'Kounta', status: 'healthy', uptime: '99.90%' },
          ],
        },
        {
          name: 'ORACLE',
          status: 'healthy',
          uptime: '99.89%',
          lastCheck: '3 min ago',
          subItems: [
            { name: 'Retail Xstore', status: 'healthy', uptime: '99.88%' },
            { name: 'Micros', status: 'healthy', uptime: '99.87%' },
          ],
        },
        { name: 'RETAIL DIRECTIONS', status: 'healthy', uptime: '99.86%', lastCheck: '2 min ago' },
        { name: 'NCR Counterpoint', status: 'healthy', uptime: '99.85%', lastCheck: '4 min ago' },
        { name: 'Redcat', status: 'healthy', uptime: '99.84%', lastCheck: '1 min ago' },
        { name: 'SwiftPOS', status: 'healthy', uptime: '99.83%', lastCheck: '3 min ago' },
        { name: 'H&L POS', status: 'healthy', uptime: '99.82%', lastCheck: '2 min ago' },
      ],
    },
    VAS: {
      status: 'warning',
      items: [
        {
          name: 'ALT PAYMENT METHODS',
          status: 'warning',
          uptime: '99.50%',
          lastCheck: '1 min ago',
          subItems: [
            { name: 'EPAY', status: 'healthy', uptime: '99.99%' },
            { name: 'AfterPay', status: 'warning', uptime: '98.50%', issue: 'Latency issues detected' },
            { name: 'AliPay', status: 'healthy', uptime: '99.98%' },
            { name: 'WeChat', status: 'healthy', uptime: '99.97%' },
          ],
        },
        {
          name: 'LOYALTY PROGRAMMES',
          status: 'healthy',
          uptime: '99.99%',
          lastCheck: '2 min ago',
          subItems: [
            { name: 'Qantas Frequent Flyer', status: 'healthy', uptime: '99.99%' },
            { name: 'Velocity Frequent Flyer', status: 'healthy', uptime: '99.98%' },
            { name: 'Coles Flybuys', status: 'healthy', uptime: '99.97%' },
            { name: 'Woolworths Rewards', status: 'healthy', uptime: '99.96%' },
          ],
        },
        {
          name: 'GIFT CARD SUPPORT',
          status: 'healthy',
          uptime: '99.95%',
          lastCheck: '3 min ago',
          subItems: [
            { name: 'Blackhawk', status: 'healthy', uptime: '99.94%' },
            { name: 'Incomm', status: 'healthy', uptime: '99.93%' },
            { name: 'GIVEX', status: 'healthy', uptime: '99.92%' },
          ],
        },
        {
          name: 'MKTG & INSIGHTS',
          status: 'healthy',
          uptime: '99.91%',
          lastCheck: '4 min ago',
          subItems: [
            { name: 'TruRating', status: 'healthy', uptime: '99.90%' },
            { name: 'YumPingo', status: 'healthy', uptime: '99.89%' },
          ],
        },
      ],
    },
    'TERMINAL HARDWARE': {
      status: 'healthy',
      items: [
        {
          name: 'INGENICO',
          status: 'healthy',
          uptime: '99.99%',
          lastCheck: '1 min ago',
          subItems: [
            { name: 'Move5000', status: 'healthy', uptime: '99.98%' },
            { name: 'DX8000', status: 'healthy', uptime: '99.97%' },
            { name: 'Axium', status: 'healthy', uptime: '99.96%' },
          ],
        },
        {
          name: 'VERIFONE',
          status: 'healthy',
          uptime: '99.95%',
          lastCheck: '2 min ago',
          subItems: [
            { name: 'T60M', status: 'healthy', uptime: '99.94%' },
            { name: 'T650P', status: 'healthy', uptime: '99.93%' },
            { name: 'Victa', status: 'healthy', uptime: '99.92%' },
          ],
        },
        {
          name: 'PAX',
          status: 'healthy',
          uptime: '99.91%',
          lastCheck: '3 min ago',
          subItems: [
            { name: 'A920Max', status: 'healthy', uptime: '99.90%' },
            { name: 'A960', status: 'healthy', uptime: '99.89%' },
            { name: 'A3700', status: 'healthy', uptime: '99.88%' },
          ],
        },
        {
          name: 'Castles',
          status: 'healthy',
          uptime: '99.87%',
          lastCheck: '4 min ago',
          subItems: [
            { name: 'S1F4 Pro', status: 'healthy', uptime: '99.86%' },
            { name: 'S1F3', status: 'healthy', uptime: '99.85%' },
            { name: 'S1F2', status: 'healthy', uptime: '99.84%' },
          ],
        },
      ],
    },
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  // Status indicator component
  const StatusIndicator = ({ status, size = 'md' }) => {
    const sizeClasses = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4'
    };
    
    return (
      <span
        className={`inline-block rounded-full mr-2 ${
          status === 'healthy' ? 'bg-green-500' : 'bg-orange-500'
        } ${sizeClasses[size]}`}
      />
    );
  };

  // Connection group component
  const ConnectionGroup = ({ groupName, groupData }) => {
    const filteredItems = groupData.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.subItems && item.subItems.some(subItem => 
        subItem.name.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );

    if (filteredItems.length === 0) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`flex items-center justify-between p-4 ${
          groupData.status === 'healthy' ? 'bg-green-50' : 'bg-orange-50'
        }`}>
          <div className="flex items-center">
            <StatusIndicator status={groupData.status} size="lg" />
            <h2 className="text-lg font-semibold text-gray-800">{groupName}</h2>
          </div>
          <div className="text-sm text-gray-500">
            {groupData.status === 'healthy' ? (
              <span className="text-green-600">All systems operational</span>
            ) : (
              <span className="text-orange-600">Issues detected</span>
            )}
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredItems.map((item) => (
            <div key={item.name} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <StatusIndicator status={item.status} />
                  <div>
                    <div className="font-medium text-gray-800">{item.name}</div>
                    {item.issue && (
                      <div className="text-sm text-orange-600 mt-1 flex items-center">
                        <FiAlertCircle className="mr-1" /> {item.issue}
                      </div>
                    )}
                    {item.subItems && (
                      <div className="mt-2 space-y-2 pl-4">
                        {item.subItems.map((subItem) => (
                          <div key={subItem.name} className="flex items-center">
                            <StatusIndicator status={subItem.status} size="sm" />
                            <span className="text-sm text-gray-600">{subItem.name}</span>
                            {subItem.uptime && (
                              <span className="ml-auto text-xs text-gray-500">{subItem.uptime}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">{item.uptime}</div>
                  <div className="text-xs text-gray-400 flex items-center justify-end mt-1">
                    <FiClock className="mr-1" size={12} /> {item.lastCheck}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FiActivity className="mr-2 text-gray-700" /> Connection Monitoring
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time status of all system connections and services
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search connections..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              <FiRefreshCw className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">System Health Overview</h2>
                <p className="text-gray-300 text-sm mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
              </div>
              <div className="bg-gray-700 rounded-full p-2">
                <FiActivity size={24} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-3xl font-bold">4</div>
                <div className="text-sm text-gray-300">Healthy Systems</div>
              </div>
              <div className="bg-orange-500 bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl font-bold">1</div>
                <div className="text-sm text-orange-200">Warning Systems</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-3xl font-bold">0</div>
                <div className="text-sm text-gray-300">Critical Issues</div>
              </div>
              <div className="bg-green-500 bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl font-bold">99.8%</div>
                <div className="text-sm text-green-200">Overall Uptime</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Alerts</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <FiAlertCircle className="text-orange-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">AfterPay Latency Issues</div>
                  <p className="text-sm text-gray-500 mt-1">Increased response times detected in AfterPay integration</p>
                  <div className="text-xs text-gray-400 mt-1 flex items-center">
                    <FiClock className="mr-1" /> 15 minutes ago
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FiCheckCircle className="text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">System Maintenance Completed</div>
                  <p className="text-sm text-gray-500 mt-1">Scheduled maintenance for Oracle Retail Xstore completed successfully</p>
                  <div className="text-xs text-gray-400 mt-1 flex items-center">
                    <FiClock className="mr-1" /> 2 hours ago
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(connections).map(([groupName, groupData]) => (
            <ConnectionGroup
              key={groupName}
              groupName={groupName}
              groupData={groupData}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConnectionMonitoring;
