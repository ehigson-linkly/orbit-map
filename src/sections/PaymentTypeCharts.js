import React, { useContext, useState } from 'react';
import { TerminalContext } from '../context/TerminalContext';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { FiDollarSign, FiCreditCard } from 'react-icons/fi';

const PAYMENT_COLORS = {
  credit: '#4F46E5',
  debit: '#10B981'
};

export default function PaymentTypeCharts() {
  const { terminals } = useContext(TerminalContext);
  const [viewMode, setViewMode] = useState('volume'); // Default to 'volume' first

  // Generate more realistic dummy data based on terminal context
  const monthlyData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
    // Filter terminals for this month (simulating monthly data)
    const monthTerminals = terminals.filter((_, index) => index % (6 - i) === 0);
    
    // Calculate aggregates
    const creditValue = monthTerminals.reduce((sum, t) => sum + t.transactionData.creditValue, 0);
    const debitValue = monthTerminals.reduce((sum, t) => sum + t.transactionData.debitValue, 0);
    const creditVolume = monthTerminals.reduce((sum, t) => sum + t.transactionData.creditVolume, 0);
    const debitVolume = monthTerminals.reduce((sum, t) => sum + t.transactionData.debitVolume, 0);
    
    const totalValue = creditValue + debitValue;
    const totalVolume = creditVolume + debitVolume;
    
    return {
      month,
      creditValue,
      debitValue,
      creditVolume,
      debitVolume,
      totalValue,
      totalVolume,
      creditPercent: (creditValue / totalValue * 100),
      debitPercent: (debitValue / totalValue * 100),
      avgValue: totalVolume > 0 ? totalValue / totalVolume : 0
    };
  });

  // Summary metrics
  const currentPeriod = monthlyData[monthlyData.length - 1];
  const prevPeriod = monthlyData[monthlyData.length - 2];
  const valueGrowth = prevPeriod.totalValue > 0 ? 
    ((currentPeriod.totalValue - prevPeriod.totalValue) / prevPeriod.totalValue * 100).toFixed(1) : '0.0';
  const volumeGrowth = prevPeriod.totalVolume > 0 ? 
    ((currentPeriod.totalVolume - prevPeriod.totalVolume) / prevPeriod.totalVolume * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Payment Type Analysis</h3>
          <p className="text-sm text-gray-500">Credit vs Debit performance</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('volume')}
            className={`px-3 py-1 rounded-md text-sm flex items-center ${viewMode === 'volume' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
          >
            <FiCreditCard className="mr-1" /> Volume
          </button>
          <button
            onClick={() => setViewMode('value')}
            className={`px-3 py-1 rounded-md text-sm flex items-center ${viewMode === 'value' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
          >
            <FiDollarSign className="mr-1" /> Value
          </button>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Value/Volume Card */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <p className="text-xs text-gray-500 font-medium mb-2">Total {viewMode === 'value' ? 'Value' : 'Volume'}</p>
          <p className="text-xl font-bold mb-2">
            {viewMode === 'value' 
              ? `$${(currentPeriod.totalValue / 1000).toFixed(1)}K` 
              : currentPeriod.totalVolume.toLocaleString()}
          </p>
          <div className="flex items-center">
            <span className={`inline-flex items-center text-sm ${viewMode === 'value' ? (valueGrowth >= 0 ? 'text-green-600' : 'text-red-600') : (volumeGrowth >= 0 ? 'text-green-600' : 'text-red-600')}`}>
              {viewMode === 'value' ? valueGrowth : volumeGrowth}%
            </span>
            <span className="text-xs text-gray-500 ml-2">vs previous</span>
          </div>
        </div>

        {/* Credit/Debit Split Card */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs text-gray-500 font-medium">Payment Split</p>
              <p className="text-sm font-medium text-indigo-600">Credit: {currentPeriod.creditPercent.toFixed(1)}%</p>
              <p className="text-sm font-medium text-green-600">Debit: {currentPeriod.debitPercent.toFixed(1)}%</p>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
            <div className="h-full flex">
              <div 
                className="bg-indigo-600" 
                style={{ width: `${currentPeriod.creditPercent}%` }}
              ></div>
              <div 
                className="bg-green-500" 
                style={{ width: `${currentPeriod.debitPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Average Value Card */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
          <p className="text-xs text-gray-500 font-medium mb-2">Avg. Transaction Value</p>
          <p className="text-xl font-bold mb-1">${currentPeriod.avgValue.toFixed(2)}</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Credit: ${(currentPeriod.creditValue / currentPeriod.creditVolume).toFixed(2)}</span>
            <span>Debit: ${(currentPeriod.debitValue / currentPeriod.debitVolume).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Main Chart - Now using stacked bars */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip 
              formatter={(value, name) => {
                if (viewMode === 'value') {
                  return [`$${value.toLocaleString()}`, name];
                } else {
                  return [value.toLocaleString(), name];
                }
              }}
              contentStyle={{
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: 'none'
              }}
            />
            <Legend />
            {viewMode === 'value' ? (
              <>
                <Bar dataKey="creditValue" name="Credit" stackId="a" fill={PAYMENT_COLORS.credit} radius={[4, 4, 0, 0]} />
                <Bar dataKey="debitValue" name="Debit" stackId="a" fill={PAYMENT_COLORS.debit} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="totalValue" stroke="#3B82F6" strokeWidth={2} dot={false} name="Total" />
              </>
            ) : (
              <>
                <Bar dataKey="creditVolume" name="Credit" stackId="a" fill={PAYMENT_COLORS.credit} radius={[4, 4, 0, 0]} />
                <Bar dataKey="debitVolume" name="Debit" stackId="a" fill={PAYMENT_COLORS.debit} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="totalVolume" stroke="#3B82F6" strokeWidth={2} dot={false} name="Total" />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
