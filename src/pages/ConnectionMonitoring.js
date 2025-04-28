import React, { useState } from 'react';

const ConnectionMonitoring = () => {
  // Define the connection data structure with status indicators
  const [connections] = useState({
    ACQUIRERS: {
      status: 'healthy',
      items: [
        { name: 'CBA', status: 'healthy' },
        { name: 'WESTPAC', status: 'healthy' },
        { name: 'NAB', status: 'healthy' },
        { name: 'ANZ', status: 'healthy' },
        { name: 'FISERV', status: 'healthy' },
        { name: 'FIRST DATA', status: 'healthy' },
      ],
    },
    POS: {
      status: 'healthy',
      items: [
        {
          name: 'LIGHTSPEED',
          status: 'healthy',
          subItems: [
            { name: 'R-Series', status: 'healthy' },
            { name: 'Vend', status: 'healthy' },
            { name: 'Kounta', status: 'healthy' },
          ],
        },
        {
          name: 'ORACLE',
          status: 'healthy',
          subItems: [
            { name: 'Retail Xstore', status: 'healthy' },
            { name: 'Micros', status: 'healthy' },
          ],
        },
        { name: 'RETAIL DIRECTIONS', status: 'healthy' },
        { name: 'NCR Counterpoint', status: 'healthy' },
        { name: 'Redcat', status: 'healthy' },
        { name: 'SwiftPOS', status: 'healthy' },
        { name: 'H&L POS', status: 'healthy' },
      ],
    },
    VAS: {
      status: 'warning', // Will be orange because of AfterPay
      items: [
        {
          name: 'ALT PAYMENT METHODS',
          status: 'warning',
          subItems: [
            { name: 'EPAY', status: 'healthy' },
            { name: 'AfterPay', status: 'warning' },
            { name: 'AliPay', status: 'healthy' },
            { name: 'WeChat', status: 'healthy' },
          ],
        },
        {
          name: 'LOYALTY PROGRAMMES',
          status: 'healthy',
          subItems: [
            { name: 'Qantas Frequent Flyer', status: 'healthy' },
            { name: 'Velocity Frequent Flyer', status: 'healthy' },
            { name: 'Coles Flybuys', status: 'healthy' },
            { name: 'Woolworths Rewards', status: 'healthy' },
          ],
        },
        {
          name: 'GIFT CARD SUPPORT',
          status: 'healthy',
          subItems: [
            { name: 'Blackhawk', status: 'healthy' },
            { name: 'Incomm', status: 'healthy' },
            { name: 'GIVEX', status: 'healthy' },
          ],
        },
        {
          name: 'MKTG & INSIGHTS',
          status: 'healthy',
          subItems: [
            { name: 'TruRating', status: 'healthy' },
            { name: 'YumPingo', status: 'healthy' },
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
          subItems: [
            { name: 'Move5000', status: 'healthy' },
            { name: 'DX8000', status: 'healthy' },
            { name: 'Axium', status: 'healthy' },
          ],
        },
        {
          name: 'VERIFONE',
          status: 'healthy',
          subItems: [
            { name: 'T60M', status: 'healthy' },
            { name: 'T650P', status: 'healthy' },
            { name: 'Victa', status: 'healthy' },
          ],
        },
        {
          name: 'PAX',
          status: 'healthy',
          subItems: [
            { name: 'A920Max', status: 'healthy' },
            { name: 'A960', status: 'healthy' },
            { name: 'A3700', status: 'healthy' },
          ],
        },
        {
          name: 'Castles',
          status: 'healthy',
          subItems: [
            { name: 'S1F4 Pro', status: 'healthy' },
            { name: 'S1F3', status: 'healthy' },
            { name: 'S1F2', status: 'healthy' },
          ],
        },
      ],
    },
  });

  // Status indicator component
  const StatusIndicator = ({ status }) => (
    <span
      className={`inline-block w-3 h-3 rounded-full mr-3 ${
        status === 'healthy' ? 'bg-green-500' : 'bg-orange-500'
      }`}
    />
  );

  // Connection group component
  const ConnectionGroup = ({ groupName, groupData }) => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center mb-4">
          <StatusIndicator status={groupData.status} />
          <h2 className="text-lg font-bold text-gray-800">{groupName}</h2>
        </div>
        
        <div className="space-y-3 pl-6">
          {groupData.items.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center">
                <StatusIndicator status={item.status} />
                <span className="font-medium text-gray-700">{item.name}</span>
              </div>
              
              {item.subItems && (
                <div className="pl-6 space-y-1">
                  {item.subItems.map((subItem) => (
                    <div key={subItem.name} className="flex items-center">
                      <StatusIndicator status={subItem.status} />
                      <span className="text-gray-600">{subItem.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Connection Monitoring</h1>
          <p className="text-gray-600 mt-1">
            Real-time status of all system connections and services
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Connection Status Summary</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <StatusIndicator status="healthy" />
                    <span className="ml-2 text-sm text-gray-600">Healthy</span>
                  </div>
                  <div className="flex items-center">
                    <StatusIndicator status="warning" />
                    <span className="ml-2 text-sm text-gray-600">Warning</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">4</div>
                  <div className="text-sm text-gray-500">Healthy Systems</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-orange-500">1</div>
                  <div className="text-sm text-gray-500">Warning Systems</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-gray-600">0</div>
                  <div className="text-sm text-gray-500">Critical Issues</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">99.8%</div>
                  <div className="text-sm text-gray-500">Uptime (24h)</div>
                </div>
              </div>
            </div>
          </div>

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
