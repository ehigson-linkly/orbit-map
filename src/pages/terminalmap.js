// src/pages/terminalmap.js
import React, { useContext, useState } from 'react';
import { TerminalContext } from '../context/terminalcontext';
import Map from 'react-map-gl';
import { FaTerminal } from 'react-icons/fa';
import { FiFilter, FiX } from 'react-icons/fi';

const AUS_BOUNDS = {
  minLongitude: 112.5,
  minLatitude: -44,
  maxLongitude: 154,
  maxLatitude: -10
};

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

  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
    latitude: -25.2744,
    longitude: 133.7751,
    zoom: 4
  });

  const filteredTerminals = terminals.filter(terminal => {
    const statusMatch = filters.status === 'all' || terminal.status === filters.status;
    const acquirerMatch = filters.acquirers.includes(terminal.acquirer || 'tyro');
    return statusMatch && acquirerMatch;
  });

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
      {/* Header and Filters remain the same as your previous version */}
      {/* Map Container */}
      <Map
        {...viewport}
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onMove={evt => setViewport(evt.viewState)}
        minZoom={3}
        maxBounds={AUS_BOUNDS}
      >
        {/* Include all your Marker and Popup components */}
      </Map>
      {/* Rest of your component remains the same */}
    </div>
  );
}