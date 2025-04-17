import React, { createContext, useState, useEffect } from 'react';

export const TerminalContext = createContext({
  terminals: [],
  isLoading: true,
  timeRange: '7d',
  setTimeRange: () => {}
});

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
  const statuses = ['online', 'offline', 'maintenance', 'low_battery'];
  const merchants = ['Retail', 'Hospitality', 'Fuel', 'Transport', 'Healthcare'];
  const locations = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Hobart', 'Darwin'];

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

  return Array.from({ length: 100 }, (_, i) => {
    const city = locations[i % locations.length];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const volume = Math.floor(Math.random() * 10000) + 1000;
    const uptime = status === 'online' 
      ? 95 + Math.random() * 5 
      : status === 'maintenance' 
        ? 80 + Math.random() * 15 
        : 50 + Math.random() * 30;
        
    return {
      id: `T-${10000 + i}`,
      status,
      merchantType: merchants[Math.floor(Math.random() * merchants.length)],
      location: city,
      lat: cityCoords[city].lat + (Math.random() * 0.5 - 0.25),
      lng: cityCoords[city].lng + (Math.random() * 0.5 - 0.25),
      volume,
      uptime
    };
  });
}
