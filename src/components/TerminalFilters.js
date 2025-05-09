import React from 'react';
import { 
  FiFilter, 
  FiDatabase,
  FiCreditCard,
  FiLink,
  FiHardDrive,
  FiServer,
  FiChevronDown,
  FiChevronUp,
  FiShield,
  FiMove,
  FiWifi,
  FiActivity,
  FiSearch,
  FiHome,
  FiMap
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

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

const terminalFeatures = [
  { id: 'acquirer_redundancy', label: 'Acquirer Redundancy', icon: <FiServer className="mr-2 text-pink-500" /> },
  { id: 'ai_fraud', label: 'AI Fraud Detection', icon: <FiShield className="mr-2 text-pink-500" /> },
  { id: 'ai_routing', label: 'AI SmartRouting (LCR)', icon: <FiMove className="mr-2 text-pink-500" /> },
  { id: 'wifi', label: 'WiFi Connectivity', icon: <FiWifi className="mr-2 text-pink-500" /> },
  { id: 'analytics', label: 'Advanced Analytics', icon: <FiActivity className="mr-2 text-pink-500" /> }
];

export default function TerminalFilters({
  terminals = [],
  filteredTerminals = [],
  selectedOrbitTypes,
  setSelectedOrbitTypes,
  selectedAcquirers,
  setSelectedAcquirers,
  selectedPosConnections,
  setSelectedPosConnections,
  selectedHardware,
  setSelectedHardware,
  selectedVas,
  setSelectedVas,
  selectedFeatures,
  setSelectedFeatures,
  posConnectionsState,
  setPosConnectionsState,
  hardwareState,
  setHardwareState,
  vasState,
  setVasState,
  activeFilterSection,
  setActiveFilterSection,
  merchantSearch,
  setMerchantSearch,
  industrySearch,
  setIndustrySearch
}) {
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

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiFilter className="mr-2 text-blue-500" /> 
            <span className="flex-1">Filters</span>
          </h3>
        </div>
        
        <div className="space-y-3">
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

        <div className="mt-4 space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Merchant"
              value={merchantSearch}
              onChange={(e) => setMerchantSearch(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Industry"
              value={industrySearch}
              onChange={(e) => setIndustrySearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link 
              to="/dashboard"
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <FiHome className="mr-2" />
              Dashboard
            </Link>
            <Link 
              to="/terminal-map"
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <FiMap className="mr-2" />
              Map View
            </Link>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Showing {filteredTerminals?.length || 0} of {terminals?.length || 0} terminals
        </p>
      </div>
    </div>
  );
}
