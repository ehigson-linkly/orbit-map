import React, { createContext, useState, useEffect, useContext } from 'react';

export const TerminalContext = createContext({
  terminals: [],
  isLoading: true,
  timeRange: '7d',
  setTimeRange: () => {},
  updateTerminal: () => {}
});

export function TerminalProvider({ children }) {
  const [terminals, setTerminals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  const updateTerminal = async (terminalId, updates) => {
    setTerminals(prevTerminals => 
      prevTerminals.map(terminal => 
        terminal.id === terminalId ? { ...terminal, ...updates } : terminal
      )
    );
  };

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
    updateTerminal
  };

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  return useContext(TerminalContext);
}

function generateMockTerminals() {
  const merchants = ['Retail', 'Hospitality', 'Fuel', 'Transport', 'Healthcare'];
  const merchantNames = {
    Retail: ['Best Buy', 'Target', 'Walmart', 'Kmart', 'Big W', 'Myer', 'David Jones'],
    Hospitality: ['Marriott', 'Hilton', 'Hyatt', 'Accor', 'Meriton', 'Quest'],
    Fuel: ['BP', 'Shell', 'Caltex', 'Ampol', '7-Eleven', 'United'],
    Transport: ['Uber', 'Lyft', 'Didi', 'Ola', 'Taxi Combined', '13CABS'],
    Healthcare: ['Priceline', 'Chemist Warehouse', 'Terry White', 'Amcal', 'Guardian']
  };
  const businessSuffixes = ['PTY LTD', 'LTD', 'Inc', 'Group', 'Holdings', 'Corp'];
  
  const hardwareModels = {
    ingenico: ['move5000', 'dx8000', 'axium'],
    verifone: ['t650m', 't650p', 'victa'],
    pax: ['a920max', 'a960', 'a3700'],
    castles: ['pro', 's1f3', 's1e2']
  };
  const orbitTypes = ['standalone', 'standalone_plus', 'integrated', 'integrated_plus'];
  const acquirers = ['cba', 'anz', 'westpac', 'nab', 'fiserv', 'first_data'];
  const vasOptions = [
    'epay', 'afterpay', 'alipay', 'wechat', 'unionpay',
    'qantas', 'velocity', 'flybuys', 'everyday', 'rewards',
    'blackhawk', 'incomm', 'givex', 'prezzee', 'flexigroup',
    'trurating', 'yumpingo', 'powerrewards', 'visa_discounts',
    'mastercard_priceless', 'amex_offers', 'diners_club'
  ];

  const weightedLocations = [
    'Sydney', 'Sydney', 'Sydney', 'Sydney', 'Sydney',
    'Melbourne', 'Melbourne', 'Melbourne', 'Melbourne',
    'Brisbane', 'Brisbane', 'Brisbane',
    'Perth', 'Perth',
    'Adelaide', 'Adelaide',
    'Canberra', 'Hobart', 'Darwin',
    'Gold Coast', 'Gold Coast',
    'Sunshine Coast', 'Townsville',
    'Newcastle', 'Wollongong',
    'Geelong', 'Toowoomba',
    'Cairns', 'Ballarat', 'Bendigo',
    'Launceston', 'Mackay', 'Rockhampton',
    'Albury', 'Wagga Wagga',
    'Shepparton', 'Coffs Harbour',
    'Dubbo', 'Tamworth',
    'Mildura', 'Orange',
    'Bunbury', 'Geraldton',
    'Bathurst', 'Gladstone',
    'Goulburn'
  ];

  const cityCoords = {
    Sydney: { lat: -33.8688, lng: 151.2093 },
    Melbourne: { lat: -37.8136, lng: 144.9631 },
    Brisbane: { lat: -27.4698, lng: 153.0251 },
    Perth: { lat: -31.9505, lng: 115.8605 },
    Adelaide: { lat: -34.9285, lng: 138.6007 },
    Canberra: { lat: -35.2809, lng: 149.1300 },
    Hobart: { lat: -42.8821, lng: 147.3272 },
    Darwin: { lat: -12.4634, lng: 130.8456 },
    Geelong: { lat: -38.1499, lng: 144.3617 },
    Newcastle: { lat: -32.9283, lng: 151.7817 },
    Wollongong: { lat: -34.4278, lng: 150.8931 },
    "Gold Coast": { lat: -28.0167, lng: 153.4000 },
    "Sunshine Coast": { lat: -26.6500, lng: 153.0667 },
    Townsville: { lat: -19.2589, lng: 146.8169 },
    Cairns: { lat: -16.9186, lng: 145.7781 },
    Toowoomba: { lat: -27.5598, lng: 151.9507 },
    Ballarat: { lat: -37.5622, lng: 143.8503 },
    Bendigo: { lat: -36.7570, lng: 144.2794 },
    Launceston: { lat: -41.4545, lng: 147.1350 },
    Mackay: { lat: -21.1411, lng: 149.1861 },
    Rockhampton: { lat: -23.3783, lng: 150.5091 },
    Albury: { lat: -36.0737, lng: 146.9135 },
    "Wagga Wagga": { lat: -35.1189, lng: 147.3699 },
    Shepparton: { lat: -36.3805, lng: 145.3999 },
    "Coffs Harbour": { lat: -30.2963, lng: 153.1135 },
    Dubbo: { lat: -32.2569, lng: 148.6011 },
    Tamworth: { lat: -31.0833, lng: 150.9167 },
    Mildura: { lat: -34.1852, lng: 142.1625 },
    Orange: { lat: -33.2833, lng: 149.1000 },
    Bunbury: { lat: -33.3271, lng: 115.6414 },
    Geraldton: { lat: -28.7780, lng: 114.6144 },
    Bathurst: { lat: -33.4190, lng: 149.5775 },
    Gladstone: { lat: -23.8425, lng: 151.2550 },
    Goulburn: { lat: -34.7516, lng: 149.7200 }
  };

  return Array.from({ length: 1500 }, (_, i) => {
    const city = weightedLocations[Math.floor(Math.random() * weightedLocations.length)];
    const coords = cityCoords[city] || { lat: -33.0, lng: 151.0 };
    const status = Math.random() < 0.95 ? 'online' : 'offline';
    const volume = Math.floor(Math.random() * 10000) + 1000;
    const uptime = status === 'online' ? 95 + Math.random() * 5 : 50 + Math.random() * 30;
    const merchantType = merchants[Math.floor(Math.random() * merchants.length)];
    const merchantName = merchantNames[merchantType][Math.floor(Math.random() * merchantNames[merchantType].length)];
    const businessName = `${merchantName} ${businessSuffixes[Math.floor(Math.random() * businessSuffixes.length)]}`;
    const orbitType = orbitTypes[Math.floor(Math.random() * orbitTypes.length)];
    const acquirer = acquirers[Math.floor(Math.random() * acquirers.length)];
    const hardwareBrand = Object.keys(hardwareModels)[Math.floor(Math.random() * Object.keys(hardwareModels).length)];
    const hardwareModel = hardwareModels[hardwareBrand][Math.floor(Math.random() * hardwareModels[hardwareBrand].length)];

    const vasCount = Math.floor(Math.random() * 6) + 3;
    const vasFeatures = [];
    const shuffledVas = [...vasOptions].sort(() => 0.5 - Math.random());
    for (let j = 0; j < vasCount; j++) {
      vasFeatures.push({
        id: shuffledVas[j],
        label: shuffledVas[j].charAt(0).toUpperCase() + shuffledVas[j].slice(1).replace(/_/g, ' '),
        enabled: Math.random() > 0.3
      });
    }

    return {
      id: `T-${10000 + i}`,
      status,
      merchantType,
      merchantName: businessName,
      location: city,
      lat: coords.lat + (Math.random() * 0.05 - 0.01),
      lng: coords.lng + (Math.random() * 0.05 - 0.01),
      volume,
      uptime,
      orbitType,
      acquirer,
      hardwareBrand,
      hardwareModel,
      vasFeatures
    };
  });
}
