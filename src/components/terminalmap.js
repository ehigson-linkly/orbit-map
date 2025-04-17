import React, { useContext, useState } from 'react';
import { TerminalContext } from '../context/terminalcontext';
import Map from 'react-map-gl';
import { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
import { FaTerminal } from 'react-icons/fa';
import { FiFilter, FiX } from 'react-icons/fi';

// Australia bounding box coordinates
const AUS_BOUNDS = {
  minLongitude: 112.5,
  minLatitude: -44,
  maxLongitude: 154,
  maxLatitude: -10
};

// Mock acquirers data
const ACQUIRERS = [
  { id: 'tyro', name: 'Tyro Payments', color: '#4f46e5' },
  { id: 'square', name: 'Square', color: '#3a86ff' },
  { id: 'zeller', name: 'Zeller', color: '#8338ec' },
  { id: 'stripe', name: 'Stripe', color: '#635bff' },
  { id: 'commonwealth', name: 'CommBank', color: '#009688' },
  { id: 'westpac', name: 'Westpac', color: '#e53935' },
];

export default function TerminalMap() {
  const { terminals } = useContext(TerminalContext);
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    acquirers: ACQUIRERS.map(a => a.id)
  });
  const [showFilters, setShowFilters] = useState(false);

  // Initial viewport centered on Australia
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
    latitude: -25.2744,
    longitude: 133.7751,
    zoom: 4
  });

  // Major Australian cities for reference
  const cities = [
    { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { name: 'Melbourne', lat: -37.8136, lng: 144.9631 },
    { name: 'Brisbane', lat: -27.4698, lng: 153.0251 },
    { name: 'Perth', lat: -31.9505, lng: 115.8605 },
    { name: 'Adelaide', lat: -34.9285, lng: 138.6007 },
    { name: 'Canberra', lat: -35.2809, lng: 149.1300 },
    { name: 'Hobart', lat: -42.8821, lng: 147.3272 },
    { name: 'Darwin', lat: -12.4634, lng: 130.8456 }
  ];

  // Filter terminals based on selected filters
  const filteredTerminals = terminals.filter(terminal => {
    const statusMatch = filters.status === 'all' || terminal.status === filters.status;
    const acquirerMatch = filters.acquirers.includes(terminal.acquirer || 'tyro');
    return statusMatch && acquirerMatch;
  });

  // Toggle acquirer filter
  const toggleAcquirerFilter = (acquirerId) => {
    setFilters(prev => ({
      ...prev,
      acquirers: prev.acquirers.includes(acquirerId)
        ? prev.acquirers.filter(id => id !== acquirerId)
        : [...prev.acquirers, acquirerId]
    }));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Map Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Terminal Map</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
          >
            <FiFilter />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Filters Panel */}
        {showFilters && (
          <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 w-64">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                <FiX />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
              <div className="space-y-2">
                {['all', 'online', 'offline', 'maintenance'].map(status => (
                  <label key={status} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={filters.status === status}
                      onChange={() => setFilters({ ...filters, status })}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span className="capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Acquirers</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {ACQUIRERS.map(acquirer => (
                  <label key={acquirer.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.acquirers.includes(acquirer.id)}
                      onChange={() => toggleAcquirerFilter(acquirer.id)}
                      style={{ color: acquirer.color }}
                    />
                    <span>{acquirer.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Map Container */}
        <Map
          {...viewport}
          mapStyle="mapbox://styles/mapbox/light-v10"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          onMove={evt => setViewport(evt.viewState)}
          minZoom={3}
          maxBounds={AUS_BOUNDS}
        >
          {/* Navigation Controls */}
          <div className="absolute top-4 left-4">
            <NavigationControl />
          </div>
          <div className="absolute top-16 left-4">
            <FullscreenControl />
          </div>

          {/* City Markers */}
          {cities.map(city => (
            <Marker key={city.name} latitude={city.lat} longitude={city.lng}>
              <div className="bg-white px-2 py-1 rounded shadow text-xs font-medium">
                {city.name}
              </div>
            </Marker>
          ))}

          {/* Terminal Markers */}
          {filteredTerminals.map(terminal => (
            <Marker
              key={terminal.id}
              latitude={terminal.lat || -25 + Math.random() * 15}
              longitude={terminal.lng || 115 + Math.random() * 35}
            >
              <div 
                className="relative cursor-pointer"
                onClick={() => setSelectedTerminal(terminal)}
              >
                <div className={`absolute inset-0 rounded-full ${terminal.status === 'online' ? 'bg-green-500' : 'bg-red-500'} opacity-20 animate-ping`}></div>
                <div className={`relative z-10 ${terminal.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                  <FaTerminal size={24} />
                </div>
              </div>
            </Marker>
          ))}

          {/* Selected Terminal Popup */}
          {selectedTerminal && (
            <Popup
              latitude={selectedTerminal.lat || -25 + Math.random() * 15}
              longitude={selectedTerminal.lng || 115 + Math.random() * 35}
              onClose={() => setSelectedTerminal(null)}
              closeButton={false}
              anchor="top"
            >
              <div className="p-2 w-64">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{selectedTerminal.id}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    selectedTerminal.status === 'online' 
                      ? 'bg-green-100 text-green-800' 
                      : selectedTerminal.status === 'maintenance'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedTerminal.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                  <div>
                    <p className="text-gray-500">Merchant</p>
                    <p>{selectedTerminal.merchantType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Acquirer</p>
                    <p>{ACQUIRERS.find(a => a.id === (selectedTerminal.acquirer || 'tyro'))?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p>{selectedTerminal.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Uptime</p>
                    <p>{selectedTerminal.uptime}%</p>
                  </div>
                </div>
                
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last activity</span>
                    <span>{new Date(selectedTerminal.lastActivity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </Map>

        {/* Status Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
          <h4 className="text-sm font-medium mb-2">Terminal Status</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Online</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">Offline</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm">Maintenance</span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-md p-3 z-10 flex space-x-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Terminals</p>
            <p className="text-lg font-semibold">{filteredTerminals.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Online</p>
            <p className="text-lg font-semibold text-green-600">
              {filteredTerminals.filter(t => t.status === 'online').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Offline</p>
            <p className="text-lg font-semibold text-red-600">
              {filteredTerminals.filter(t => t.status === 'offline').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}