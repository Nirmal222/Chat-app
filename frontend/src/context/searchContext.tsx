import React, { createContext, useState, useContext, useCallback } from 'react';
import debounce from 'lodash/debounce';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debouncedSearch: (term: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      // Perform your search operation here
      console.log('Searching for:', term);
      // You can make an API call here or update some other state
    }, 300),
    []
  );

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, debouncedSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};