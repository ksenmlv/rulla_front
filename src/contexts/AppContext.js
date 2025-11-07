import { createContext, useContext, useMemo, useState } from 'react'


const AppContext = createContext()

export const useAppContext = () => {
  return useContext(AppContext)
}

export const AppProvider = ({ children }) => {
  // глобальные состояния
  const [selectedCity, setSelectedCity] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [userName, setUserName] = useState('')
  const [userRegion, setUserRegion] = useState('')
  const [userActivity, setUserActivity] = useState('')
  const [userCitizenship, setUserCitizenship] = useState('')

  const [userExperience, setUserExperience] = useState()
  const [specialistsNumber, setSpecialistsNumber] = useState('')


  const [stepNumber, setStepNumber] = useState(1)



  // оптимизация значения контекста с помощью useMemo
  const value = useMemo(() => ({
    selectedCity,
    setSelectedCity,
    phoneNumber, 
    setPhoneNumber,
    smsCode, 
    setSmsCode,
    userName, 
    setUserName,
    userRegion, 
    setUserRegion,
    stepNumber, 
    setStepNumber,
    userActivity, 
    setUserActivity,
    userCitizenship, 
    setUserCitizenship,

    userExperience, 
    setUserExperience,
    specialistsNumber, 
    setSpecialistsNumber,

  }), [
    selectedCity,
    phoneNumber,
    smsCode,
    userName,
    userRegion,
    stepNumber,
    userActivity,
    userCitizenship,
    userExperience,
    specialistsNumber,

  ])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
