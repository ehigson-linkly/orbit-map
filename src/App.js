import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";

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
      services: VAS_OPTIONS.map((vas) => ({
        name: vas,
        enabled: Math.random() > 0.5
      }))
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
    "Westpac": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvqbwpn54NEQrAqBSLP-pJnPcCvU6BtTpt8A&s",
    "CBA": "https://www.commbank.com.au/content/dam/caas/newsroom/images/Smart_terminal_1.jpg"
  };

  const statusClass = status === "active" ? "green-status" : "red-status";

  return new L.Icon({
    iconUrl: bankIcons[bank] || "https://www.castlestech.com/wp-content/uploads/2023/07/S1P-castles-technology.webp",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -30],
    className: `rounded-terminal-icon ${statusClass}`
  });
};

function App() {
  const [data, setData] = useState(terminals);
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedVASOptions, setSelectedVASOptions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTerminal, setSelectedTerminal] = useState(null);

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

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: 'Helvetica Neue, sans-serif' }}>
      <div style={{ width: "340px", background: "white", color: "#111", padding: "2rem 1.5rem", overflowY: "auto", boxShadow: "2px 0 8px rgba(0,0,0,0.05)" }}>
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem", fontWeight: 600 }}>Terminal Filters</h2>

        <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>Bank</label>
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '0.5rem', marginBottom: '1rem', maxHeight: '10rem', overflowY: 'auto' }}>
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
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '0.5rem', marginBottom: '1rem', maxHeight: '12rem', overflowY: 'auto' }}>
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
                <strong>{t.merchant}</strong><br /><em>{t.bank} – Terminal #{t.id}</em>
                <br />
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
    </div>
  );
}

export default App;
