import React, { createContext, useState, useContext } from 'react';
import { 
  FiLink,
  FiHardDrive,
  FiShoppingCart,
  FiAward,
  FiGift,
  FiBarChart2,
  FiDollarSign
} from 'react-icons/fi';

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

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [selectedOrbitTypes, setSelectedOrbitTypes] = useState([]);
  const [selectedAcquirers, setSelectedAcquirers] = useState([]);
  const [selectedPosConnections, setSelectedPosConnections] = useState([]);
  const [selectedHardware, setSelectedHardware] = useState([]);
  const [selectedVas, setSelectedVas] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [posConnectionsState, setPosConnectionsState] = useState([
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
  ]);
  const [hardwareState, setHardwareState] = useState([
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
  ]);
  const [vasState, setVasState] = useState(vasCompatibility);
  const [merchantSearch, setMerchantSearch] = useState('');
  const [industrySearch, setIndustrySearch] = useState('');
  const [activeFilterSection, setActiveFilterSection] = useState(null);

  return (
    <FilterContext.Provider
      value={{
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
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  return useContext(FilterContext);
}
