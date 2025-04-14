import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";
import OrbitLogo from "./assets/orbit-logo.png";
import LinklyLogo from "./assets/linkly-logo.png";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays } from 'date-fns';

const PASSWORD = "i00t#GG3Fzfe";

const VAS_OPTIONS = [
  "Tap2Phone", "Smart Routing", "eCommerce", "POS Support",
  "AI Fraud Detection", "QR Payments", "Digital Receipts",
  "Cashback Offers", "Buy Now Pay Later", "Currency Conversion"
];

const generateMockTerminals = (count) => {
  const banks = ["ANZ", "NAB", "Westpac", "CBA", "Bendigo", "Macquarie"];
  const majorCities = [
    { name: "Sydney", lat: -33.8688, lng: 151.2093 },
    { name: "Melbourne", lat: -37.8136, lng: 144.9631 },
    { name: "Brisbane", lat: -27.4698, lng: 153.0251 },
    { name: "Perth", lat: -31.9505, lng: 115.8605 },
    { name: "Adelaide", lat: -34.9285, lng: 138.6007 },
    { name: "Canberra", lat: -35.2809, lng: 149.1300 },
    { name: "Hobart", lat: -42.8821, lng: 147.3272 },
    { name: "Alice Springs", lat: -23.6980, lng: 133.8807 },
    { name: "Coober Pedy", lat: -29.0136, lng: 134.7540 },
    { name: "Katherine", lat: -14.4650, lng: 132.2635 },
    { name: "Broken Hill", lat: -31.9530, lng: 141.4535 }
  ];

  const terminalsByCity = {};

  for (let i = 0; i < count; i++) {
    const city = majorCities[Math.floor(Math.random() * majorCities.length)];
    const jitterLat = city.lat + (Math.random() - 0.5) * 0.05;
    const jitterLng = city.lng + (Math.random() - 0.5) * 0.05;

    const terminal = {
      id: i,
      merchant: `Merchant ${Math.random().toString(36).substring(2, 7).toUpperCase()} Pty Ltd`,
      bank: banks[i % banks.length],
      lat: jitterLat,
      lng: jitterLng,
      city: city.name,
      status: "active",
      services: VAS_OPTIONS.map((vas) => ({ name: vas, enabled: Math.random() > 0.5 }))
    };

    if (!terminalsByCity[city.name]) terminalsByCity[city.name] = [];
    terminalsByCity[city.name].push(terminal);
  }

  Object.values(terminalsByCity).forEach((group) => {
    const offlineCount = Math.ceil(group.length * 0.15);
    const shuffled = [...group].sort(() => Math.random() - 0.5);
    for (let i = 0; i < offlineCount; i++) {
      shuffled[i].status = "offline";
    }
  });

  return Object.values(terminalsByCity).flat();
};

const terminals = generateMockTerminals(500);

const getTerminalIcon = (bank, status) => {
  const bankIcons = {
    "westpac": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvqbwpn54NEQrAqBSLP-pJnPcCvU6BtTpt8A&s",
    "cba": "https://www.commbank.com.au/content/dam/caas/newsroom/images/Smart_terminal_1.jpg"
  };
  const statusClass = status === "active" ? "green-status" : "red-status";
  const lowerBank = bank.toLowerCase();

  return new L.Icon({
    iconUrl: bankIcons[lowerBank] || "https://www.castlestech.com/wp-content/uploads/2023/07/S1P-castles-technology.webp",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -30],
    className: `rounded-terminal-icon ${statusClass}`
  });
};

const generateTerminalInsights = (terminalId) => {
  const transactionData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 30 - i);
    return {
      date: format(date, 'MMM dd'),
      volume: Math.floor(Math.random() * 10000) + 1000,
      value: Math.floor(Math.random() * 50000) + 5000,
    };
  });

  const uptimeData = Array.from({ length: 24 * 7 }, (_, i) => {
    const date = subDays(new Date(), 7 - Math.floor(i / 24));
    const hour = i % 24;
    return {
      date: format(date, 'MMM dd'),
      hour,
      status: Math.random() > 0.05 ? 'online' : 'offline'
    };
  });

  const totalHours = uptimeData.length;
  const onlineHours = uptimeData.filter(d => d.status === 'online').length;
  const uptimePercent = Math.round((onlineHours / totalHours) * 100);

  const totalVolume = transactionData.reduce((sum, day) => sum + day.volume, 0);
  const totalValue = transactionData.reduce((sum, day) => sum + day.value, 0);
  const approvalRate = Math.floor(Math.random() * 10) + 90;
  const lastSeen = format(new Date(), 'MMM dd, h:mm a');
  
  const vasFeatures = VAS_OPTIONS.map(vas => ({
    name: vas,
    count: Math.floor(Math.random() * 100)
  }));
  const topVAS = [...vasFeatures].sort((a, b) => b.count - a.count)[0].name;

  return {
    transactionData,
    uptimeData,
    uptimePercent,
    totalVolume,
    totalValue,
    approvalRate,
    lastSeen,
    topVAS
  };
};

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState(terminals);
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedVASOptions, setSelectedVASOptions] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [terminalInsights, setTerminalInsights] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((t) => {
      const bankMatch = selectedBanks.length === 0 || selectedBanks.includes(t.bank);
      const vasMatch = selectedVASOptions.length === 0 || selectedVASOptions.every(v => t.services.some(s => s.name === v && s.enabled));
      const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(t.status);
      return bankMatch && vasMatch && statusMatch;
    });
  }, [data, selectedBanks, selectedVASOptions, selectedStatuses]);

  const toggleVAS = (terminalId, vasName) => {
    setData((prev) =>
      prev.map((t) =>
        t.id === terminalId
          ? {
              ...t,
              services: t.services.map((s) =>
                s.name === vasName ? { ...s, enabled: !s.enabled } : s
              )
            }
          : t
      )
    );
  };

  const handleTerminalSelect = (terminal) => {
    setSelectedTerminal(terminal);
    // Cache the insights data for this terminal
    if (!terminalInsights[terminal.id]) {
      setTerminalInsights(prev => ({
        ...prev,
        [terminal.id]: generateTerminalInsights(terminal.id)
      }));
    }
  };

  if (!authenticated) {
    return (
      <div className="login-container">
        <div className="login-box">
          <img src={LinklyLogo} alt="Linkly Logo" className="login-logo" />
          <img src={OrbitLogo} alt="Orbit Logo" className="login-orbit-logo" />
          <h2>Terminal Management System</h2>
          <p>Please enter the password to access the system</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`login-input ${error ? 'error' : ''}`}
              placeholder="Enter password"
              autoFocus
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <img src={LinklyLogo} alt="Linkly Logo" className="header-logo" />
      </header>

      {/* MAIN LAYOUT */}
      <div className="main-content">
        {/* LEFT PANEL - FILTERS */}
        <div className="left-panel">
          <div className="panel-header">
            <img src={OrbitLogo} alt="Orbit Logo" className="orbit-logo" />
            <h2>Terminal Filters</h2>
          </div>
          
          <div className="filter-section">
            <label>Bank</label>
            <div className="filter-box bank-filter">
              {[...new Set(data.map(d => d.bank))].map((b, i) => (
                <div key={i} className="filter-item">
                  <input
                    type="checkbox"
                    id={`bank-${i}`}
                    value={b}
                    checked={selectedBanks.includes(b)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBanks([...selectedBanks, b]);
                      } else {
                        setSelectedBanks(selectedBanks.filter(bank => bank !== b));
                      }
                    }}
                  />
                  <label htmlFor={`bank-${i}`}>{b}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label>VAS Options</label>
            <div className="filter-box vas-filter">
              {VAS_OPTIONS.map((vas, i) => (
                <div key={i} className="filter-item">
                  <input
                    type="checkbox"
                    id={`vas-${i}`}
                    value={vas}
                    checked={selectedVASOptions.includes(vas)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVASOptions([...selectedVASOptions, vas]);
                      } else {
                        setSelectedVASOptions(selectedVASOptions.filter(v => v !== vas));
                      }
                    }}
                  />
                  <label htmlFor={`vas-${i}`}>{vas}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label>Status</label>
            <div className="filter-box">
              <div className="filter-item">
                <input
                  type="checkbox"
                  id="status-active"
                  value="active"
                  checked={selectedStatuses.includes("active")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStatuses([...selectedStatuses, "active"]);
                    } else {
                      setSelectedStatuses(selectedStatuses.filter(s => s !== "active"));
                    }
                  }}
                />
                <label htmlFor="status-active">Online</label>
              </div>
              <div className="filter-item">
                <input
                  type="checkbox"
                  id="status-offline"
                  value="offline"
                  checked={selectedStatuses.includes("offline")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStatuses([...selectedStatuses, "offline"]);
                    } else {
                      setSelectedStatuses(selectedStatuses.filter(s => s !== "offline"));
                    }
                  }}
                />
                <label htmlFor="status-offline">Offline</label>
              </div>
            </div>
          </div>
        </div>
        
        {/* MAP */}
        <div className="map-container">
          <MapContainer center={[-25.2744, 133.7751]} zoom={4} className="map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {filteredData.map((t) => (
              <Marker 
                key={t.id} 
                position={[t.lat, t.lng]} 
                icon={getTerminalIcon(t.bank, t.status)} 
                eventHandlers={{
                  click: () => handleTerminalSelect(t)
                }}
              >
                <Popup className="map-popup">
                  <strong>{t.merchant}</strong>
                  <em>{t.bank} – Terminal #{t.id}</em>
                  <div className="popup-status">
                    <span className={`status-indicator ${t.status}`}></span>
                    <strong>{t.status === 'active' ? 'Online' : 'Offline'}</strong>
                  </div>
                  <div className="popup-services">
                    <h4>Value-Added Services</h4>
                    {t.services.map((s, i) => (
                      <div key={i} className="service-item">
                        <label>{s.name}</label>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={s.enabled}
                            onChange={() => toggleVAS(t.id, s.name)}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    ))}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {/* RIGHT PANEL - INSIGHTS */}
        <div className="right-panel">
          {selectedTerminal ? (
            <div>
              <h3 className="insights-header">
                TERMINAL #{selectedTerminal.id} INSIGHTS
              </h3>
              
              {/* Transaction Volume Chart */}
              <div className="chart-container">
                <h4>
                  <span className="icon">📊</span> Transaction Volume (30 days)
                </h4>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={terminalInsights[selectedTerminal.id]?.transactionData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4a6b7b" />
                      <XAxis dataKey="date" tick={{ fill: '#fff' }} />
                      <YAxis tick={{ fill: '#fff' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#034043',
                          borderColor: '#4a6b7b',
                          color: '#fff'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="volume" 
                        name="Transactions" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        name="Value ($)" 
                        stroke="#82ca9d" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Uptime Status */}
              <div className="uptime-container">
                <h4>
                  <span className="icon">📈</span> Uptime Status (7 days)
                  <span className="uptime-percentage">
                    {terminalInsights[selectedTerminal.id]?.uptimePercent || 0}% uptime
                  </span>
                </h4>
                <div className="uptime-grid">
                  {Array.from({ length: 24 * 7 }).map((_, i) => {
                    const status = terminalInsights[selectedTerminal.id]?.uptimeData[i]?.status || 'online';
                    return (
                      <div 
                        key={i}
                        className={`uptime-cell ${status}`}
                        title={`Hour ${i % 24} on day ${Math.floor(i / 24)}`}
                      />
                    );
                  })}
                </div>
                <div className="uptime-timeline">
                  <span>7 days ago</span>
                  <span>Now</span>
                </div>
              </div>
              
              {/* Key Metrics */}
              <div className="metrics-container">
                <h4>
                  <span className="icon">🔢</span> Key Metrics
                </h4>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <div className="metric-label">Total Volume</div>
                    <div className="metric-value">
                      {(terminalInsights[selectedTerminal.id]?.totalVolume || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Approval %</div>
                    <div className="metric-value">
                      {terminalInsights[selectedTerminal.id]?.approvalRate || 0}%
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Last Seen</div>
                    <div className="metric-value">
                      {terminalInsights[selectedTerminal.id]?.lastSeen || 'N/A'}
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Top VAS</div>
                    <div className="metric-value">
                      {terminalInsights[selectedTerminal.id]?.topVAS || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p>Select a terminal from the map or filter panel to view detailed analytics and metrics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
