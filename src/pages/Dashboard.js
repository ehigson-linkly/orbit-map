import React from 'react';
import OverviewCards from '../sections/overviewcards';
import TerminalStatusChart from '../sections/terminalstatuschart';
import TopMerchantsTable from '../sections/topmerchantstable';
import RevenueByCategory from '../sections/revenuebycategory';
import TerminalFilters from '../components/TerminalFilters';
import { useFilter } from '../context/FilterContext';
import { useTerminal } from '../context/TerminalContext';

export default function Dashboard() {
  const { terminals, filteredTerminals } = useTerminal();
  const {
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
    merchantSearch,
    setMerchantSearch,
    industrySearch,
    setIndustrySearch,
    activeFilterSection,
    setActiveFilterSection
  } = useFilter();

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <OverviewCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <TerminalStatusChart />
              <TopMerchantsTable />
            </div>
            
            <div className="space-y-6">
              <RevenueByCategory />
            </div>
          </div>
        </div>

        <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-lg overflow-y-auto">
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
