import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { TerminalContext } from '../context/TerminalContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  FiFilter, 
  FiX, 
  FiChevronDown, 
  FiChevronUp,
  FiDatabase,
  FiCreditCard,
  FiLink,
  FiMove,
  FiServer,
  FiHardDrive,
  FiActivity,
  FiWifi,
  FiShield,
  FiBarChart2,
  FiDollarSign,
  FiAward,
  FiGift,
  FiShoppingCart,
  FiCheck,
  FiCircle
} from 'react-icons/fi';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const orbitTypes = [
  { id: 'standalone', label: 'Standalone', icon: <FiDatabase className="mr-2 text-blue-500" /> },
  { id: 'standalone_plus', label: 'Standalone +Plus', icon: <FiDatabase className="mr-2 text-blue-500" /> },
  { id: 'integrated', label: 'Integrated', icon: <FiLink className="mr-2 text-green-500" /> },
  { id: 'integrated_plus', label: 'Integrated +Plus', icon: <FiLink className="mr-2 text-green-500" /> }
];

const acquirers = [
  { id: 'cba', label: 'CBA', icon: <FiCreditCard className="mr-2 text-purple-500" /> },
  { id: 'anz', label: 'ANZ', icon: <FiCreditCard className="mr-2 text-purple-500" /> },
  { id: 'westpac', label: 'Westpac', icon: <FiCreditCard className="mr-2 text-purple-500" /> },
  { id: 'nab', label: 'NAB', icon: <FiCreditCard className="mr-2 text-purple-500" /> },
  { id: 'fiserv', label: 'Fiserv', icon: <FiCreditCard className="mr-2 text-purple-500" /> },
  { id: 'first_data', label: 'First Data', icon: <FiCreditCard className="mr-2 text-purple-500" /> }
];

const posConnections = [
  {
    id: 'lightspeed',
    label: 'Lightspeed',
    icon: <FiLink className="mr-2 text-green-500" />,
    expanded: false,
    children: [
      { id: 'r_series', label: 'R-Series' },
      { id: 'vend', label: 'Vend' },
      { id: 'kounta', label: 'Kounta' }
    ]
  },
  {
    id: 'oracle',
    label: 'Oracle',
    icon: <FiLink className="mr-2 text-green-500" />,
    expanded: false,
    children: [
      { id: 'retail_xstore', label: 'Retail Xstore' },
      { id: 'micros', label: 'Micros' }
    ]
  },
  { id: 'retail_directions', label: 'Retail Directions', icon: <FiLink className="mr-2 text-green-500" /> },
  { id: 'ncr', label: 'NCR Counterpoint / POSitouch', icon: <FiLink className="mr-2 text-green-500" /> },
  { id: 'redcat', label: 'Redcat', icon: <FiLink className="mr-2 text-green-500" /> },
  { id: 'swiftpos', label: 'SwiftPOS', icon: <FiLink className="mr-2 text-green-500" /> },
  { id: 'hl_pos', label: 'H&L POS', icon: <FiLink className="mr-2 text-green-500" /> }
];

const terminalHardware = [
  {
    id: 'ingenico',
    label: 'Ingenico',
    icon: <FiHardDrive className="mr-2 text-yellow-500" />,
    expanded: false,
    children: [
      { id: 'move5000', label: 'Move5000' },
      { id: 'dx8000', label: 'DX8000' },
      { id: 'axium', label: 'Axium' }
    ]
  },
  {
    id: 'verifone',
    label: 'Verifone',
    icon: <FiHardDrive className="mr-2 text-yellow-500" />,
    expanded: false,
    children: [
      { id: 't650m', label: 'T650M' },
      { id: 't650p', label: 'T650P' },
      { id: 'victa', label: 'Victa' }
    ]
  },
  {
    id: 'pax',
    label: 'PAX',
    icon: <FiHardDrive className="mr-2 text-yellow-500" />,
    expanded: false,
    children: [
      { id: 'a920max', label: 'A920Max' },
      { id: 'a960', label: 'A960' },
      { id: 'a3700', label: 'A3700' }
    ]
  },
  {
    id: 'castles',
    label: 'Castles',
    icon: <FiHardDrive className="mr-2 text-yellow-500" />,
    expanded: false,
    children: [
      { id: 'pro', label: 'Pro' },
      { id: 's1f3', label: 'S1F3' },
      { id: 's1e2', label: 'S1E2' }
    ]
  }
];

const vasCompatibility = [
  {
    id: 'alt_payments',
    label: 'Alternative Payment Methods',
    icon: <FiShoppingCart className="mr-2 text-indigo-500" />,
    expanded: false,
    children: [
      { id: 'epay', label: 'EPAY' },
      { id: 'afterpay', label: 'AfterPay' },
      { id: 'alipay', label: 'AliPay' },
      { id: 'wechat', label: 'WeChat' },
      { id: 'unionpay', label: 'UnionPay' }
    ]
  },
  {
    id: 'loyalty',
    label: 'Loyalty Programmes',
    icon: <FiAward className="mr-2 text-indigo-500" />,
    expanded: false,
    children: [
      { id: 'qantas', label: 'Qantas Loyalty' },
      { id: 'velocity', label: 'Velocity Frequent Flyer' },
      { id: 'flybuys', label: 'Coles Flybuys' },
      { id: 'everyday', label: 'Woolworths Everyday Rewards' },
      { id: 'rewards', label: 'American Express Rewards' }
    ]
  },
  {
    id: 'gift_cards',
    label: 'Gift Card Support',
    icon: <FiGift className="mr-2 text-indigo-500" />,
    expanded: false,
    children: [
      { id: 'blackhawk', label: 'Blackhawk' },
      { id: 'incomm', label: 'Incomm' },
      { id: 'givex', label: 'GIVEX' },
      { id: 'prezzee', label: 'Prezzee' },
      { id: 'flexigroup', label: 'FlexiGroup' }
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing & Customer Insights',
    icon: <FiBarChart2 className="mr-2 text-indigo-500" />,
    expanded: false,
    children: [
      { id: 'trurating', label: 'TruRating' },
      { id: 'yumpingo', label: 'YumPingo' },
      { id: 'powerrewards', label: 'Power Rewards' }
    ]
  },
  {
    id: 'card_offers',
    label: 'Cardholder Offers',
    icon: <FiDollarSign className="mr-2 text-indigo-500" />,
    expanded: false,
    children: [
      { id: 'visa_discounts', label: 'Visa Discounts' },
      { id: 'mastercard_priceless', label: 'Mastercard Priceless' },
      { id: 'amex_offers', label: 'Amex Offers' },
      { id: 'diners_club', label: 'Diners Club Privileges' }
    ]
  }
];

const terminalFeatures = [
  { id: 'acquirer_redundancy', label: 'Acquirer Redundancy', icon: <FiServer className="mr-2 text-pink-500" /> },
  { id: 'ai_fraud', label: 'AI Fraud Detection', icon: <FiShield className="mr-2 text-pink-500" /> },
  { id: 'ai_routing', label: 'AI SmartRouting (LCR)', icon: <FiMove className="mr-2 text-pink-500" /> },
  { id: 'wifi', label: 'WiFi Connectivity', icon: <FiWifi className="mr-2 text-pink-500" /> },
  { id: 'analytics', label: 'Advanced Analytics', icon: <FiActivity className="mr-2 text-pink-500" /> }
];

const getTerminalImage = (terminal) => {
  const { acquirer, hardwareBrand, hardwareModel } = terminal;
  const supportedBanks = ['cba', 'nab', 'westpac'];
  const supportedModels = {
    ingenico: ['move5000'],
    verifone: ['t650m', 't650p']
  };
  
  if (supportedBanks.includes(acquirer)) {
    if (hardwareBrand === 'ingenico' && supportedModels.ingenico.includes(hardwareModel)) {
      return `${acquirer}-ingenico-move-5000.jpg`;
    }
    if (hardwareBrand === 'verifone' && supportedModels.verifone.includes(hardwareModel)) {
      return `${acquirer}-verifone-${hardwareModel}.jpg`;
    }
  }
  
  return 'default-terminal.jpg';
};

export default function TerminalMap() {
  const { terminals, isLoading, updateTerminal } = useContext(TerminalContext);
  const [mapReady, setMapReady] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedOrbitTypes, setSelectedOrbitTypes] = useState([]);
  const [selectedAcquirers, setSelectedAcquirers] = useState([]);
  const [selectedPosConnections, setSelectedPosConnections] = useState([]);
  const [selectedHardware, setSelectedHardware] = useState([]);
  const [selectedVas, setSelectedVas] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [posConnectionsState, setPosConnectionsState] = useState([...posConnections]);
  const [hardwareState, setHardwareState] = useState([...terminalHardware]);
  const [vasState, setVasState] = useState([...vasCompatibility]);
  const [filteredTerminals, setFilteredTerminals] = useState([]);
  const [activeFilterSection, setActiveFilterSection] = useState(null);
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const filterPanelRef = useRef(null);
  const [expandedVasGroups, setExpandedVasGroups] = useState({});

  const createCustomIcon = (terminal) => {
    const statusColor = terminal.status === 'online' ? 'border-green-500' : 'border-red-500';
    const terminalImage = getTerminalImage(terminal);
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-white border-4 ${statusColor} shadow-md flex items-center justify-center">
            <div class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
              <img src="/images/terminals/${terminalImage}" alt="Terminal" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  };

  useEffect(() => {
    setMapReady(true);
  }, []);

  useEffect(() => {
    if (terminals.length > 0) {
      setFilteredTerminals(terminals);
    }
  }, [terminals]);

  useEffect(() => {
    if (terminals.length === 0) return;

    let filtered = [...terminals];
    
    filtered = filtered.filter(terminal => 
      selectedOrbitTypes.length === 0 || selectedOrbitTypes.includes(terminal.orbitType)
    );
    
    if (selectedAcquirers.length > 0) {
      filtered = filtered.filter(terminal => 
        selectedAcquirers.includes(terminal.acquirer)
      );
    }
    
    if (selectedPosConnections.length > 0) {
      filtered = filtered.filter(terminal => {
        const posConnection = posConnectionsState
          .flatMap(conn => 
            conn.children ? [conn.id, ...conn.children.map(c => c.id)] : [conn.id]
          )[terminal.id.charCodeAt(5) % posConnectionsState.flatMap(conn => 
            conn.children ? [conn.id, ...conn.children.map(c => c.id)] : [conn.id]
          ).length];
        return selectedPosConnections.includes(posConnection);
      });
    }
    
    if (selectedHardware.length > 0) {
      filtered = filtered.filter(terminal => 
        selectedHardware.includes(terminal.hardwareBrand) || 
        selectedHardware.includes(terminal.hardwareModel)
      );
    }
    
    if (selectedVas.length > 0) {
      filtered = filtered.filter(terminal => 
        terminal.vasFeatures.some(feature => selectedVas.includes(feature.id))
      );
    }
    
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter(terminal => {
        const feature = terminalFeatures[terminal.id.charCodeAt(8) % 5].id;
        return selectedFeatures.includes(feature);
      });
    }
    
    setFilteredTerminals(filtered);
  }, [
    selectedOrbitTypes, 
    selectedAcquirers, 
    selectedPosConnections, 
    selectedHardware,
    selectedVas,
    selectedFeatures,
    terminals,
    posConnectionsState
  ]);

  const handleMouseDown = useCallback((e) => {
    if (!e.target.closest('input, button, select, label')) {
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }
  }, [position.x, position.y]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;
    
    const maxX = window.innerWidth - (filterPanelRef.current?.offsetWidth || 0);
    const maxY = window.innerHeight - (filterPanelRef.current?.offsetHeight || 0);
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const toggleOrbitType = (type) => {
    setSelectedOrbitTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const toggleAcquirer = (acquirer) => {
    setSelectedAcquirers(prev => 
      prev.includes(acquirer) 
        ? prev.filter(a => a !== acquirer) 
        : [...prev, acquirer]
    );
  };

  const togglePosConnection = (connectionId) => {
    setSelectedPosConnections(prev => 
      prev.includes(connectionId) 
        ? prev.filter(c => c !== connectionId) 
        : [...prev, connectionId]
    );
  };

  const toggleHardware = (hardwareId) => {
    setSelectedHardware(prev => 
      prev.includes(hardwareId) 
        ? prev.filter(h => h !== hardwareId) 
        : [...prev, hardwareId]
    );
  };

  const toggleVas = (vasId) => {
    setSelectedVas(prev => 
      prev.includes(vasId) 
        ? prev.filter(v => v !== vasId) 
        : [...prev, vasId]
    );
  };

  const toggleFeature = (featureId) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(f => f !== featureId) 
        : [...prev, featureId]
    );
  };

  const togglePosConnectionGroup = (groupId) => {
    setPosConnectionsState(prev => 
      prev.map(conn => 
        conn.id === groupId 
          ? { ...conn, expanded: !conn.expanded } 
          : conn
      )
    );
  };

  const toggleHardwareGroup = (groupId) => {
    setHardwareState(prev => 
      prev.map(hw => 
        hw.id === groupId 
          ? { ...hw, expanded: !hw.expanded } 
          : hw
      )
    );
  };

  const toggleVasGroup = (groupId) => {
    setVasState(prev => 
      prev.map(vas => 
        vas.id === groupId 
          ? { ...vas, expanded: !vas.expanded } 
          : vas
      )
    );
  };

  const toggleVasGroupInPopup = (groupId) => {
    setExpandedVasGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const toggleVasFeature = async (terminalId, vasId) => {
    const terminal = terminals.find(t => t.id === terminalId);
    if (!terminal) return;

    const updatedFeatures = terminal.vasFeatures.map(feature => 
      feature.id === vasId ? { ...feature, enabled: !feature.enabled } : feature
    );

    await updateTerminal(terminalId, { vasFeatures: updatedFeatures });
  };

  const isPosConnectionSelected = (connectionId) => {
    return selectedPosConnections.includes(connectionId);
  };

  const isPosGroupSelected = (group) => {
    if (!group.children) return isPosConnectionSelected(group.id);
    return group.children.some(child => isPosConnectionSelected(child.id));
  };

  const isHardwareSelected = (hardwareId) => {
    return selectedHardware.includes(hardwareId);
  };

  const isHardwareGroupSelected = (group) => {
    if (!group.children) return isHardwareSelected(group.id);
    return group.children.some(child => isHardwareSelected(child.id));
  };

  const isVasSelected = (vasId) => {
    return selectedVas.includes(vasId);
  };

  const isVasGroupSelected = (group) => {
    if (!group.children) return isVasSelected(group.id);
    return group.children.some(child => isVasSelected(child.id));
  };

  const toggleFilterSection = (section) => {
    setActiveFilterSection(activeFilterSection === section ? null : section);
  };

  if (isLoading || !mapReady) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-500">Loading terminals...</div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-marker img {
          border-radius: 50%;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-popup-tip-container {
          pointer-events: none;
        }
      `}</style>
      
      <div 
        ref={filterPanelRef}
        className={`absolute z-10 bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-200 ${
          showFilters ? 'w-72' : 'w-12'
        } ${isDragging ? 'cursor-grabbing shadow-xl' : 'cursor-default'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          transition: isDragging ? 'none' : 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseDown={handleMouseDown}
      >
        {showFilters ? (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiFilter className="mr-2 text-blue-500" /> 
                <span className="flex-1">Filters</span>
              </h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX />
              </button>
            </div>
            
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleFilterSection('orbit')}
                  className="w-full flex justify-between items-center p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FiDatabase className="mr-2 text-blue-500" />
                    <span>ORBIT Type</span>
                  </div>
                  {activeFilterSection === 'orbit' ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {activeFilterSection === 'orbit' && (
                  <div className="p-3 pt-0 space-y-2">
                    {orbitTypes.map(type => (
                      <div key={type.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`orbit-${type.id}`}
                          checked={selectedOrbitTypes.includes(type.id)}
                          onChange={() => toggleOrbitType(type.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`orbit-${type.id}`} className="ml-2 text-sm text-gray-700">
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleFilterSection('acquirers')}
                  className="w-full flex justify-between items-center p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FiCreditCard className="mr-2 text-purple-500" />
                    <span>Acquirers & Resellers</span>
                  </div>
                  {activeFilterSection === 'acquirers' ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {activeFilterSection === 'acquirers' && (
                  <div className="p-3 pt-0 space-y-2">
                    {acquirers.map(acquirer => (
                      <div key={acquirer.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`acquirer-${acquirer.id}`}
                          checked={selectedAcquirers.includes(acquirer.id)}
                          onChange={() => toggleAcquirer(acquirer.id)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`acquirer-${acquirer.id}`} className="ml-2 text-sm text-gray-700">
                          {acquirer.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleFilterSection('pos')}
                  className="w-full flex justify-between items-center p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FiLink className="mr-2 text-green-500" />
                    <span>POS Connections</span>
                  </div>
                  {activeFilterSection === 'pos' ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {activeFilterSection === 'pos' && (
                  <div className="p-3 pt-0 space-y-2">
                    {posConnectionsState.map(connection => (
                      <div key={connection.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`pos-${connection.id}`}
                              checked={isPosGroupSelected(connection)}
                              onChange={() => {
                                if (connection.children) {
                                  const childIds = connection.children.map(c => c.id);
                                  const allChildrenSelected = childIds.every(id => 
                                    selectedPosConnections.includes(id)
                                  );
                                  
                                  if (allChildrenSelected) {
                                    setSelectedPosConnections(prev => 
                                      prev.filter(id => !childIds.includes(id))
                                    );
                                  } else {
                                    setSelectedPosConnections(prev => [
                                      ...new Set([...prev, ...childIds])
                                    ]);
                                  }
                                } else {
                                  togglePosConnection(connection.id);
                                }
                              }}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`pos-${connection.id}`} className="ml-2 text-sm text-gray-700">
                              {connection.label}
                            </label>
                          </div>
                          {connection.children && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePosConnectionGroup(connection.id);
                              }}
                              className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                            >
                              {connection.expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                            </button>
                          )}
                        </div>
                        
                        {connection.children && connection.expanded && (
                          <div className="ml-6 mt-1 space-y-1">
                            {connection.children.map(child => (
                              <div key={child.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`pos-${child.id}`}
                                  checked={isPosConnectionSelected(child.id)}
                                  onChange={() => togglePosConnection(child.id)}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`pos-${child.id}`} className="ml-2 text-sm text-gray-700">
                                  {child.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleFilterSection('hardware')}
                  className="w-full flex justify-between items-center p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FiHardDrive className="mr-2 text-yellow-500" />
                    <span>Terminal Hardware</span>
                  </div>
                  {activeFilterSection === 'hardware' ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {activeFilterSection === 'hardware' && (
                  <div className="p-3 pt-0 space-y-2">
                    {hardwareState.map(hardware => (
                      <div key={hardware.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`hw-${hardware.id}`}
                              checked={isHardwareGroupSelected(hardware)}
                              onChange={() => {
                                if (hardware.children) {
                                  const childIds = hardware.children.map(c => c.id);
                                  const allChildrenSelected = childIds.every(id => 
                                    selectedHardware.includes(id)
                                  );
                                  
                                  if (allChildrenSelected) {
                                    setSelectedHardware(prev => 
                                      prev.filter(id => !childIds.includes(id))
                                    );
                                  } else {
                                    setSelectedHardware(prev => [
                                      ...new Set([...prev, ...childIds])
                                    ]);                           
                                  }
                                } else {
                                  toggleHardware(hardware.id);
                                }
                              }}
                              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`hw-${hardware.id}`} className="ml-2 text-sm text-gray-700">
                              {hardware.label}
                            </label>
                          </div>
                          {hardware.children && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleHardwareGroup(hardware.id);
                              }}
                              className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                            >
                              {hardware.expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                            </button>
                          )}
                        </div>
                        
                        {hardware.children && hardware.expanded && (
                          <div className="ml-6 mt-1 space-y-1">
                            {hardware.children.map(child => (
                              <div key={child.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`hw-${child.id}`}
                                  checked={isHardwareSelected(child.id)}
                                  onChange={() => toggleHardware(child.id)}
                                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`hw-${child.id}`} className="ml-2 text-sm text-gray-700">
                                  {child.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleFilterSection('vas')}
                  className="w-full flex justify-between items-center p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FiCreditCard className="mr-2 text-indigo-500" />
                    <span>VAS Compatibility</span>
                  </div>
                  {activeFilterSection === 'vas' ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {activeFilterSection === 'vas' && (
                  <div className="p-3 pt-0 space-y-2">
                    {vasState.map(vas => (
                      <div key={vas.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`vas-${vas.id}`}
                              checked={isVasGroupSelected(vas)}
                              onChange={() => {
                                if (vas.children) {
                                  const childIds = vas.children.map(c => c.id);
                                  const allChildrenSelected = childIds.every(id => 
                                    selectedVas.includes(id)
                                  );
                                  
                                  if (allChildrenSelected) {
                                    setSelectedVas(prev => 
                                      prev.filter(id => !childIds.includes(id))
                                    );
                                  } else {
                                    setSelectedVas(prev => [
                                      ...new Set([...prev, ...childIds])
                                    ]);
                                  }
                                } else {
                                  toggleVas(vas.id);
                                }
                              }}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`vas-${vas.id}`} className="ml-2 text-sm text-gray-700">
                              {vas.label}
                            </label>
                          </div>
                          {vas.children && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleVasGroup(vas.id);
                              }}
                              className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                            >
                              {vas.expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                            </button>
                          )}
                        </div>
                        
                        {vas.children && vas.expanded && (
                          <div className="ml-6 mt-1 space-y-1">
                            {vas.children.map(child => (
                              <div key={child.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`vas-${child.id}`}
                                  checked={isVasSelected(child.id)}
                                  onChange={() => toggleVas(child.id)}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`vas-${child.id}`} className="ml-2 text-sm text-gray-700">
                                  {child.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleFilterSection('features')}
                  className="w-full flex justify-between items-center p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FiServer className="mr-2 text-pink-500" />
                    <span>Terminal Features</span>
                  </div>
                  {activeFilterSection === 'features' ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {activeFilterSection === 'features' && (
                  <div className="p-3 pt-0 space-y-2">
                    {terminalFeatures.map(feature => (
                      <div key={feature.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`feature-${feature.id}`}
                          checked={selectedFeatures.includes(feature.id)}
			onChange={() => toggleFeature(feature.id)}
			className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`feature-${feature.id}`} className="ml-2 text-sm text-gray-700">
                          {feature.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {filteredTerminals.length} of {terminals.length} terminals
              </p>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowFilters(true)}
            className="w-full h-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiFilter className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <MapContainer
        center={[-25.2744, 133.7751]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {filteredTerminals.map((terminal) => {
          const hardwareLabel = hardwareState
            .flatMap(hw => 
              hw.children 
                ? [{ id: hw.id, label: hw.label }, ...hw.children.map(c => ({ id: c.id, label: c.label }))]
                : [{ id: hw.id, label: hw.label }]
            )
            .find(item => item.id === terminal.hardwareModel || item.id === terminal.hardwareBrand)?.label;

          return (
            <Marker
              key={terminal.id}
              position={[terminal.lat, terminal.lng]}
              icon={createCustomIcon(terminal)}
            >
              <Popup closeButton={false}>
                <div className="w-80 p-4">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{terminal.merchantName}</h3>
                    <div className="flex justify-center items-center mt-1 space-x-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {terminal.merchantType}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        terminal.status === 'online' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {terminal.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <div>
                      <span className="block font-medium">Terminal ID</span>
                      <span>{terminal.id}</span>
                    </div>
                    <div>
                      <span className="block font-medium">Hardware</span>
                      <span>{hardwareLabel}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {vasCompatibility.map(group => (
                      <div key={group.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVasGroupInPopup(group.id);
                          }}
                          className="w-full flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            {group.icon}
                            <span className="text-sm font-medium">{group.label}</span>
                          </div>
                          {expandedVasGroups[group.id] ? (
                            <FiChevronUp className="text-gray-500" />
                          ) : (
                            <FiChevronDown className="text-gray-500" />
                          )}
                        </button>
                        
                        {expandedVasGroups[group.id] && (
                          <div className="p-2 grid grid-cols-2 gap-2">
                            {group.children.map(child => {
                              const feature = terminal.vasFeatures.find(f => f.id === child.id);
                              return (
                                <button
                                  key={child.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleVasFeature(terminal.id, child.id);
                                  }}
                                  className={`flex items-center text-xs p-1 rounded ${
                                    feature?.enabled 
                                      ? 'bg-indigo-50 text-indigo-700' 
                                      : 'hover:bg-gray-50'
                                  }`}
                                >
                                  {feature?.enabled ? (
                                    <FiCheck className="mr-1 text-indigo-500" size={12} />
                                  ) : (
                                    <FiCircle className="mr-1 text-gray-300" size={12} />
                                  )}
                                  {child.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
