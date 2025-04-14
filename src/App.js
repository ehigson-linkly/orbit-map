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
  BarChart, 
  Bar, 
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
  // Generate transaction data for last 30 days
  const transactionData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 30 - i);
    return {
      date: format(date, 'MMM dd'),
      volume: Math.floor(Math.random() * 10000) + 1000,
      value: Math.floor(Math.random() * 50000) + 5000,
    };
  });

  // Generate uptime data (hourly status for last 7 days)
  const uptimeData = Array.from({ length: 24 * 7 }, (_, i) => {
    const date = subDays(new Date(), 7 - Math.floor(i / 24));
    const hour = i % 24;
    return {
      date: format(date, 'MMM dd'),
      hour,
      status: Math.random() > 0.05 ? 'online' : 'offline' // 5% chance of being offline
    };
  });

  // Calculate uptime percentage
  const totalHours = uptimeData.length;
  const onlineHours = uptimeData.filter(d => d.status === 'online').length;
  const uptimePercent = Math.round((onlineHours / totalHours) * 100);

  // Calculate key metrics
  const totalVolume = transactionData.reduce((sum, day) => sum + day.volume, 0);
  const totalValue = transactionData.reduce((sum, day) => sum + day.value, 0);
  const approvalRate = Math.floor(Math.random() * 10) + 90; // 90-99%
  const lastSeen = format(new Date(), 'MMM dd, h:mm a');
  
  // Get most used VAS feature
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTerminal, setSelectedTerminal] = useState(null);

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
      const statusMatch = statusFilter === "all" || t.status === statusFilter;
      return bankMatch && vasMatch && statusMatch;
    });
  }, [data, selectedBanks, selectedVASOptions, statusFilter]);

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

  if (!authenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#034043" }}>
        <div style={{ background: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", width: "350px", textAlign: "center" }}>
          <img src={LinklyLogo} alt="Linkly Logo" style={{ width: "140px", marginBottom: "1rem" }} />
          <img src={OrbitLogo} alt="Orbit Logo" style={{ width: "100px", marginBottom: "1.5rem" }} />
          <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>Terminal Management System</h2>
          <p style={{ marginBottom: "1.5rem", color: "#666" }}>Please enter the password to access the system</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", border: `1px solid ${error ? "#ff4444" : "#ddd"}`, borderRadius: "4px", fontSize: "1rem" }}
              placeholder="Enter password"
              autoFocus
            />
            {error && <p style={{ color: "#ff4444", marginBottom: "1rem" }}>{error}</p>}
            <button
              type="submit"
              style={{ width: "100%", padding: "0.75rem", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: "pointer" }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"}
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: "#034043",
      color: "#fff",
      fontFamily: 'Helvetica Neue, sans-serif'
    }}>
      {/* HEADER */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem 2rem",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        position: "relative"
      }}>
        <img src={LinklyLogo} alt="Linkly Logo" style={{
          height: "80px"
        }} />
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ display: "flex", flex: 1 }}>
        
        {/* FILTER PANEL */}
        <div style={{
          width: "300px",
          backgroundColor: "#034043",
          borderRight: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "2rem"
        }}>
          <img src={OrbitLogo} alt="Orbit Logo" style={{ height: "80px", marginBottom: "1.5rem" }} />

          <div style={{ width: "100%", padding: "0 1.5rem", overflowY: "auto", flex: 1 }}>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: 600, color: "#fff" }}>Terminal Filters</h2>

            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Bank</label>
            <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '0.5rem', marginBottom: '1rem', maxHeight: '10rem', overflowY: 'auto', background: "#fff", color: "#000" }}>
              {[...new Set(data.map(d => d.bank))].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
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
                  <label htmlFor={`bank-${i}`} style={{ marginLeft: '8px', fontSize: '0.9rem' }}>{b}</label>
                </div>
              ))}
            </div>

            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Value-Added Service</label>
            <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '0.5rem', marginBottom: '1rem', maxHeight: '12rem', overflowY: 'auto', background: "#fff", color: "#000" }}>
              {VAS_OPTIONS.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <input
                    type="checkbox"
                    id={`vas-${i}`}
                    value={v}
                    checked={selectedVASOptions.includes(v)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVASOptions([...selectedVASOptions, v]);
                      } else {
                        setSelectedVASOptions(selectedVASOptions.filter(val => val !== v));
                      }
                    }}
                  />
                  <label htmlFor={`vas-${i}`} style={{ marginLeft: '8px', fontSize: '0.9rem' }}>{v}</label>
                </div>
              ))}
            </div>

            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Status</label>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '4px' }}>
                <input
                  type="radio"
                  id="status-all"
                  name="status"
                  value="all"
                  checked={statusFilter === "all"}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
                <label htmlFor="status-all" style={{ marginLeft: '8px', fontSize: '0.9rem' }}>All</label>
              </div>
              <div style={{ marginBottom: '4px' }}>
                <input
                  type="radio"
                  id="status-active"
                  name="status"
                  value="active"
                  checked={statusFilter === "active"}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
                <label htmlFor="status-active" style={{ marginLeft: '8px', fontSize: '0.9rem' }}>Online</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="status-offline"
                  name="status"
                  value="offline"
                  checked={statusFilter === "offline"}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
                <label htmlFor="status-offline" style={{ marginLeft: '8px', fontSize: '0.9rem' }}>Offline</label>
              </div>
            </div>

            {selectedTerminal && (
              <div style={{ marginTop: "1rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 600 }}>{selectedTerminal.merchant}</h3>
                <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}><em>{selectedTerminal.bank} — Terminal #{selectedTerminal.id}</em></p>
                <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
                  Status: <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: selectedTerminal.status === 'active' ? 'green' : 'red',
                      display: 'inline-block',
                      marginRight: '6px'
                    }}></span>
                    <strong>{selectedTerminal.status === 'active' ? 'Online' : 'Offline'}</strong>
                  </span>
                </p>
                <hr />
                {selectedTerminal.services.map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0.5rem 0" }}>
                    <label style={{ fontSize: "0.875rem" }}>{s.name}</label>
                    <input
                      type="checkbox"
                      checked={s.enabled}
                      onChange={() => toggleVAS(selectedTerminal.id, s.name)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* MAP */}
        <div style={{ flex: 1 }}>
          <MapContainer center={[-25.2744, 133.7751]} zoom={4} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {filteredData.map((t) => (
              <Marker key={t.id} position={[t.lat, t.lng]} icon={getTerminalIcon(t.bank, t.status)} eventHandlers={{
                click: () => setSelectedTerminal(t)
              }}>
                <Popup>
                  <strong>{t.merchant}</strong><br /><em>{t.bank} – Terminal #{t.id}</em><br />
                  Status: <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: t.status === 'active' ? 'green' : 'red',
                      display: 'inline-block',
                      marginRight: '6px'
                    }}></span>
                    <strong>{t.status === 'active' ? 'Online' : 'Offline'}</strong>
                  </span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {/* INSIGHTS PANEL */}
        <div style={{
          width: "350px",
          padding: "1.5rem",
          backgroundColor: "#034043",
          borderLeft: "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
          overflowY: "auto"
        }}>
          {selectedTerminal ? (
            <div>
              <h3 style={{ 
                borderBottom: "1px solid rgba(255,255,255,0.3)", 
                paddingBottom: "0.5rem",
                marginBottom: "1.5rem"
              }}>
                TERMINAL #{selectedTerminal.id} INSIGHTS
              </h3>
              
              {/* Transaction Volume Chart */}
              <div style={{ marginBottom: "2rem" }}>
                <h4 style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                  📊 Transaction Volume (30 days)
                </h4>
                <div style={{ height: "250px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={generateTerminalInsights(selectedTerminal.id).transactionData}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
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
              <div style={{ marginBottom: "2rem" }}>
                <h4 style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                  📈 Uptime Status (7 days)
                  <span style={{ 
                    marginLeft: "auto", 
                    backgroundColor: "#4a6b7b",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.8rem"
                  }}>
                    {generateTerminalInsights(selectedTerminal.id).uptimePercent}% uptime
                  </span>
                </h4>
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap",
                  gap: "2px",
                  marginBottom: "0.5rem"
                }}>
                  {Array.from({ length: 24 * 7 }).map((_, i) => {
                    const status = generateTerminalInsights(selectedTerminal.id).uptimeData[i].status;
                    return (
                      <div 
                        key={i}
                        style={{
                          width: "10px",
                          height: "10px",
                          backgroundColor: status === 'online' ? '#4CAF50' : '#f44336',
                          borderRadius: "2px"
                        }}
                        title={`Hour ${i % 24} on day ${Math.floor(i / 24)}`}
                      />
                    );
                  })}
                </div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  fontSize: "0.8rem",
                  color: "#aaa"
                }}>
                  <span>7 days ago</span>
                  <span>Now</span>
                </div>
              </div>
              
              {/* Key Metrics */}
              <div>
                <h4 style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                  🔢 Key Metrics
                </h4>
                <div style={{ 
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  padding: "1rem"
                }}>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem"
                  }}>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "#aaa" }}>Total Volume</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                        {generateTerminalInsights(selectedTerminal.id).totalVolume.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "#aaa" }}>Approval %</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                        {generateTerminalInsights(selectedTerminal.id).approvalRate}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "#aaa" }}>Last Seen</div>
                      <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                        {generateTerminalInsights(selectedTerminal.id).lastSeen}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "#aaa" }}>Top VAS</div>
                      <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                        {generateTerminalInsights(selectedTerminal.id).topVAS}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center",
              height: "100%",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📊</div>
              <p>Select a terminal from the map or filter panel to view detailed analytics and metrics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;