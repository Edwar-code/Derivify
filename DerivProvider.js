// DerivProvider.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const DerivContext = createContext();

export const useDeriv = () => {
  return useContext(DerivContext);
};

export const DerivProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem('deriv_api_token');
    const storedAccounts = JSON.parse(localStorage.getItem('deriv_accounts')) || [];
    if (storedToken) {
      setIsConnected(true);
      setAccounts(storedAccounts);
    }
  }, []);

  return (
    <DerivContext.Provider value={{ isConnected, accounts }}>
      {children}
    </DerivContext.Provider>
  );
};
