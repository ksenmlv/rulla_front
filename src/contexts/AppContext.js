import { createContext, useContext, useMemo, useState } from 'react';


const AppContext = createContext()

export const useAppContext = () => {
  return useContext(AppContext);
}

export const AppProvider = ({ children }) => {
  // глобальные состояния
  const [selectedCity, setSelectedCity] = useState(null)


  // оптимизация значения контекста с помощью useMemo
  const value = useMemo(() => ({
    selectedCity,
    setSelectedCity,

  }), [
    selectedCity,

  ])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
