import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMembers } from '../api';

const AppContext = createContext(null);

export const DEFAULT_USER = {
  id: 1,
  name: 'Rajvil Choudhary',
  initials: 'RC',
  avatar_color: '#7C5CBF',
};

export function AppProvider({ children }) {
  const [allMembers, setAllMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getMembers().then(r => setAllMembers(r.data)).catch(() => {});
  }, []);

  return (
    <AppContext.Provider value={{ currentUser: DEFAULT_USER, allMembers, searchQuery, setSearchQuery }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
