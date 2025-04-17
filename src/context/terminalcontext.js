// src/context/terminalcontext.js
import React, { createContext, useState, useEffect } from 'react';

export const TerminalContext = createContext();

export function TerminalProvider({ children }) {
  const [terminals, setTerminals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const mockTerminals = generateMockTerminals();
        setTerminals(mockTerminals);
      } catch (error) {
        console.error("Error fetching terminal data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const value = {
    terminals,
    isLoading,
    timeRange,
    setTimeRange,
  };

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
}

function generateMockTerminals() {
  const statuses = ['online', 'offline', 'maintenance'];
  const merchants = ['Retail', 'Hospitality', 'Fuel', 'Transport', 'Healthcare'];
  const locations = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Hobart', 'Darwin'];
  const acquirers = ['tyro', 'square', 'zeller', 'stripe', 'commonwealth', 'westpac'];
  
  // Australia bounding coordinates
  const ausBounds = {
    minLat: -44,
    maxLat: -10,
    minLng: 112.5,
    maxLng: 154
  };
  
  return Array.from({ length: 12480 }, (_, i) => {
    const cityIndex = i % locations.length;
    const city = locations[cityIndex];
    
    // City coordinates with some randomness
    const cityCoords = {
      Sydney: { lat: -33.8688, lng: 151.2093 },
      Melbourne: { lat: -37.8136, lng: 144.9631 },
      Brisbane: { lat: -27.4698, lng: 153.0251 },
      Perth: { lat: -31.9505, lng: 115.8605 },
      Adelaide: { lat: -34.9285, lng: 138.6007 },
      Canberra: { lat: -35.2809, lng: 149.1300 },
      Hobart: { lat: -42.8821, lng: 147.3272 },
      Darwin: { lat: -12.4634, lng: 130.8456 }
    };
    
    // Add some randomness to coordinates (within 1 degree)
    const lat = cityCoords[city].lat + (Math.random() * 2 - 1);
    const lng = cityCoords[city].lng + (Math.random() * 2 - 1);
    
    // Ensure coordinates stay within Australia's bounds
    const clampedLat = Math.max(ausBounds.minLat, Math.min(ausBounds.maxLat, lat));
    const clampedLng = Math.max(ausBounds.minLng, Math.min(ausBounds.maxLng, lng));
    
    return {
      id: `T-${10000 + i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      merchantType: merchants[Math.floor(Math.random() * merchants.length)],
      location: city,
      lat: clampedLat,
      lng: clampedLng,
      volume: Math.floor(Math.random() * 10000),
      uptime: (90 + Math.random() * 10).toFixed(1),
      batteryLevel: Math.floor(Math.random() * 100),
      acquirer: acquirers[Math.floor(Math.random() * acquirers.length)]
    };
  });
}