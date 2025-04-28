import React, { useContext, useState } from 'react';
import { TerminalContext } from '../context/TerminalContext';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart, Cell } from 'recharts';
import { FiDollarSign, FiCreditCard, FiTrendingUp } from 'react-icons/fi';

const CARD_COLORS = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
  amex: '#016FD0',
  other: '#6C757D'
};

export default function CardTypeCharts() {
  const { terminals } = useContext(TerminalContext);
  const [activeTab, setActiveTab] = useState('volume');

  // Generate monthly data
  const monthlyData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
    const monthTerminals = terminals.filter((_, index) => index % (6 - i) === 0);
    
    const visaValue = monthTerminals.reduce((sum, t) => sum + t.transactionData.visaValue, 0);
    const mastercardValue = monthTerminals.reduce((sum, t) => sum + t.transactionData.mastercardValue, 0);
    const amexValue = monthTerminals.reduce((sum, t) => sum + t.transactionData.amexValue, 0);
    const otherCardValue = monthTerminals.reduce((sum, t) => sum + t.transactionData.otherCardValue, 0);
    
    const visaVolume = monthTerminals.reduce((sum, t) => sum + t.transactionData.visaVolume, 0);
    const mastercardVolume = monthTerminals.reduce((sum, t) => sum + t.transactionData.mastercardVolume, 0);
    const amexVolume = monthTerminals.reduce((sum, t) => sum + t.transactionData.amexVolume, 0);
    const otherCardVolume = monthTerminals.reduce((sum, t) => sum + t.transactionData.otherCardVolume, 0);
    
    const totalValue = visaValue + mastercardValue + amexValue + otherCardValue;
    const totalVolume = visaVolume + mastercardVolume + amexVolume + otherCardVolume;
    
    return {
      month,
      visaValue,
      mastercardValue,
      amexValue,
      otherCardValue,
      visaVolume,
      mastercardVolume,
      amexVolume,
      otherCardVolume,
      totalValue,
      totalVolume,
      visaAvg: visaVolume > 0 ? visaValue / visaVolume : 0,
      mastercardAvg: mastercardVolume > 0 ? mastercardValue / mastercardVolume : 0,
      amexAvg: amexVolume > 0 ? amexValue / amexVolume : 0,
      otherAvg: otherCardVolume > 0 ? otherCardValue / otherCardVolume : 0,
      overallAvg: totalVolume > 0 ? totalValue / totalVolume : 0
    };
  });

  const currentPeriod = monthlyData[monthlyData.length - 1];
  const cardDistribution = [
    { name: 'Visa', value: currentPeriod.visaValue, volume: currentPeriod.visaVolume, color: CARD_COLORS.visa },
    { name: 'Mastercard', value: currentPeriod.mastercardValue, volume: currentPeriod.mastercardVolume, color: CARD_COLORS.mastercard },
    { name: 'Amex', value: currentPeriod.amexValue, volume: currentPeriod.amexVolume, color: CARD_COLORS.amex },
    { name: 'Other', value: currentPeriod.otherCardValue, volume: currentPeriod.otherCardVolume, color: CARD_COLORS.other }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Card Type Analysis</h3>
          <p className="text-sm text-gray-500">Performance by card network</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('volume')}
            className={`px-3 py-1 rounded-md text-sm flex items-center ${activeTab === 'volume' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
          >
            <FiCreditCard className="mr-1" /> Volume
          </button>
          <button
            onClick={() => setActiveTab('value')}
            className={`px-3 py-1 rounded-md text-sm flex items-center ${activeTab === 'value' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
          >
            <FiDollarSign className="mr-1" /> Value
          </button>
          <button
            onClick={() => setActiveTab('average')}
            className={`px-3 py-1 rounded-md text-sm flex items-center ${activeTab === 'average' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
          >
            <FiTrendingUp className="mr-1" /> Avg. Value
          </button>
        </div>
      </div>

      {/* Card Type Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {cardDistribution.map((card) => (
          <div key={card.name} className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: card.color }}></div>
              <p className="text-sm font-medium">{card.name}</p>
            </div>
            <p className="text-lg font-bold">
              {activeTab === 'value' ? `$${(card.value / 1000).toFixed(1)}K` : 
               activeTab === 'volume' ? card.volume.toLocaleString() : 
               `$${(card.value / card.volume).toFixed(2)}`}
            </p>
            <p className="text-xs text-gray-500">
              {activeTab === 'value' ? `${((card.value / currentPeriod.totalValue) * 100).toFixed(1)}% of total` : 
               activeTab === 'volume' ? `${((card.volume / currentPeriod.totalVolume) * 100).toFixed(1)}% of total` : 
               'Avg. value'}
            </p>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip 
              formatter={(value, name) => {
                if (activeTab === 'value') {
                  return [`$${value.toLocaleString()}`, name];
                } else if (activeTab === 'average') {
                  return [`$${value.toFixed(2)}`, name];
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
            <Legend
              payload={[
                { value: 'Visa', type: 'square', id: 'visa', color: CARD_COLORS.visa },
                { value: 'Mastercard', type: 'square', id: 'mastercard', color: CARD_COLORS.mastercard },
                { value: 'Amex', type: 'square', id: 'amex', color: CARD_COLORS.amex },
                { value: 'Other', type: 'square', id: 'other', color: CARD_COLORS.other }
              ]}
            />
            
            {activeTab === 'value' ? (
              <>
                <Bar dataKey="visaValue" name="Visa" stackId="a" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CARD_COLORS.visa} />
                  ))}
                </Bar>
                <Bar dataKey="mastercardValue" name="Mastercard" stackId="a" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CARD_COLORS.mastercard} />
                  ))}
                </Bar>
                <Bar dataKey="amexValue" name="Amex" stackId="a" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CARD_COLORS.amex} />
                  ))}
                </Bar>
                <Bar dataKey="otherCardValue" name="Other" stackId="a" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CARD_COLORS.other} />
                  ))}
                </Bar>
              </>
            ) : activeTab === 'volume' ? (
              <>
                <Bar dataKey="visaVolume" name="Visa" stackId="a" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CARD_COLORS.visa} />
                  ))}
                </Bar>
                <Bar dataKey="mastercardVolume" name="Mastercard" stackId="a" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CARD_COLORS.mastercard} />
                  ))}
                </Bar>
                <Bar dataKey="amexVolume" name="Amex" stackId="a" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CARD_COLORS.amex} />
                  ))}
                </Bar>
                <Bar dataKey="otherCardVolume" name="Other" stackId="a" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CARD_COLORS.other} />
                  ))}
                </Bar>
              </>
            ) : (
              <>
                <Line type="monotone" dataKey="visaAvg" name="Visa" stroke={CARD_COLORS.visa} strokeWidth={2} />
                <Line type="monotone" dataKey="mastercardAvg" name="Mastercard" stroke={CARD_COLORS.mastercard} strokeWidth={2} />
                <Line type="monotone" dataKey="amexAvg" name="Amex" stroke={CARD_COLORS.amex} strokeWidth={2} />
                <Line type="monotone" dataKey="otherAvg" name="Other" stroke={CARD_COLORS.other} strokeWidth={2} />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}