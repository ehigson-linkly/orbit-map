import React, { useContext, useEffect, useState } from 'react';
import { TerminalContext } from '../context/TerminalContext';
import { useFilter } from '../context/FilterContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  FiShoppingCart,
  FiAward,
  FiGift,
  FiBarChart2,
  FiDollarSign,
  FiCheck,
  FiCircle,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import TerminalFilters from '../components/TerminalFilters';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
  { id: 'acquirer_redundancy', label: 'Acquirer Redundancy' },
  { id: 'ai_fraud', label: 'AI Fraud Detection' },
  { id: 'ai_routing', label: 'AI SmartRouting (LCR)' },
  { id: 'wifi', label: 'WiFi Connectivity' },
  { id: 'analytics', label: 'Advanced Analytics' }
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
  const {
    selectedOrbitTypes,
    selectedAcquirers,
    selectedPosConnections,
    selectedHardware,
    selectedVas,
    selectedFeatures,
    merchantSearch,
    industrySearch,
    posConnectionsState,
    hardwareState,
    vasState,
    setSelectedOrbitTypes,
    setSelectedAcquirers,
    setSelectedPosConnections,
    setSelectedHardware,
    setSelectedVas,
    setSelectedFeatures,
    setPosConnectionsState,
    setHardwareState,
    setVasState,
    setMerchantSearch,
    setIndustrySearch,
    activeFilterSection,
    setActiveFilterSection
  } = useFilter();
  
  const [mapReady, setMapReady] = useState(false);
  const [filteredTerminals, setFilteredTerminals] = useState([]);
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
    
    if (merchantSearch) {
      filtered = filtered.filter(terminal => 
        terminal.merchantName.toLowerCase().includes(merchantSearch.toLowerCase())
      );
    }
    
    if (industrySearch) {
      filtered = filtered.filter(terminal => 
        terminal.merchantType.toLowerCase().includes(industrySearch.toLowerCase())
      );
    }
    
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
    merchantSearch,
    industrySearch,
    posConnectionsState
  ]);

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

  if (isLoading || !mapReady) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-500">Loading terminals...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
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
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 h-full">
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

        <div className="w-80 bg-white border-1 border-gray-200 flex flex-col shadow-lg overflow-y-auto">
          <TerminalFilters
            terminals={terminals}
            filteredTerminals={filteredTerminals}
            selectedOrbitTypes={selectedOrbitTypes}
            setSelectedOrbitTypes={setSelectedOrbitTypes}
            selectedAcquirers={selectedAcquirers}
            setSelectedAcquirers={setSelectedAcquirers}
            selectedPosConnections={selectedPosConnections}
            setSelectedPosConnections={setSelectedPosConnections}
            selectedHardware={selectedHardware}
            setSelectedHardware={setSelectedHardware}
            selectedVas={selectedVas}
            setSelectedVas={setSelectedVas}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
            posConnectionsState={posConnectionsState}
            setPosConnectionsState={setPosConnectionsState}
            hardwareState={hardwareState}
            setHardwareState={setHardwareState}
            vasState={vasState}
            setVasState={setVasState}
            activeFilterSection={activeFilterSection}
            setActiveFilterSection={setActiveFilterSection}
            merchantSearch={merchantSearch}
            setMerchantSearch={setMerchantSearch}
            industrySearch={industrySearch}
            setIndustrySearch={setIndustrySearch}
          />
        </div>
      </div>
    </div>
  );
}
