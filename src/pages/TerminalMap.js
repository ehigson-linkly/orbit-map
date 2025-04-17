import React, { useContext, useEffect, useState } from 'react';
import { TerminalContext } from '../context/TerminalContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function TerminalMap() {
  const { terminals, isLoading } = useContext(TerminalContext);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  if (isLoading || !mapReady) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-500">Loading terminals...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <MapContainer
        center={[-25.2744, 133.7751]} // Center of Australia
        zoom={4}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {terminals.map((terminal) => (
          <Marker
            key={terminal.id}
            position={[terminal.lat, terminal.lng]}
          >
            <Popup>
              <div className="w-48">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{terminal.id}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    terminal.status === 'online' 
                      ? 'bg-green-100 text-green-800' 
                      : terminal.status === 'maintenance'
                        ? 'bg-yellow-100 text-yellow-800'
                        : terminal.status === 'low_battery'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                  }`}>
                    {terminal.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{terminal.location}</p>
                  <p>{terminal.merchantType}</p>
                  <p className="mt-1">Volume: ${terminal.volume.toLocaleString()}</p>
                  <p>Uptime: {terminal.uptime.toFixed(1)}%</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
