import React from 'react';
import OverviewCards from '../sections/overviewcards';
import TerminalStatusChart from '../sections/terminalstatuschart';
import TopMerchantsTable from '../sections/topmerchantstable';
import RevenueByCategory from '../sections/revenuebycategory';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <OverviewCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TerminalStatusChart />
          <TopMerchantsTable />
        </div>
        
        <div className="space-y-6">
          <RevenueByCategory />
        </div>
      </div>
    </div>
  );
}