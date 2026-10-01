import React from 'react';

export const ThemeContext = React.createContext({});

export function ThemeProvider({ children }) {
  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
} 