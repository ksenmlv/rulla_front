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

  // 3 этап регистрации
  const [userLawSubject, setUserLawSubject] = useState('individual_entrepreneur')         // legal_entity || individual_entrepreneur || self_employed
  const [individualEntrepreneurData, setIndividualEntrepreneurData] = useState({
      FIO: '',
      INN: '', 
      OGRNIP: '', 
      regustrationDate: '', 
      extractOGRNIP: []
  })
  const [selfEmployedData, setSelfEmployedData] = useState({
    FIO: '',
    INN: '', 
    regustrationDate: '',
    registrationCertificate: []
  })
  const [legalEntityData, setLegalEntityData] = useState({
    organizationName: '', 
    INN: '', 
    OGRN: '',
    registrationDate: '',
    registrationAddress: '',
    extractEGRUL: []
  })

  // 4 этап регистрации
  const [passportData, setPassportData] = useState({
    citizenship: 'Российская федерация', 
    otherCountry: '', // если citizenship === 'other' или 'chf'
    series: '',
    number: '',
    issuedBy: '',
    issueDate: '',
    scanPages: [],
    scanRegistration: []
  })

  // 5 этап регистрации
  const [userExperience, setUserExperience] = useState()
  const [specialistsNumber, setSpecialistsNumber] = useState('')
  const [userLicense, setUserLicense] = useState({ status: '', files: [] });
  const [userEducationalDiplom, setUserEducationalDiplom] = useState({ status: '', files: [] });
  const [userCriminalRecord, setUserCriminalRecord] = useState({ status: '', text: '' });

  // 6 этап регистрации
  const [userService, setUserService] = useState([{ name: '', price: '' }])
  const [otherTeamsInteraction, setOtherTeamsInteraction] = useState({ status: '', text: '' })
  const [userProjects, setUserProjects] = useState([{ files: [], text: '' }])
  const [reviews, setReviews] = useState({ files: [] })
  const [certificates, setCertificates] = useState({ files: [] })

  // 7 этап регистрации
  const [userPhone, setUserPhone] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userSocialMedia, setUserSocialMedia] = useState([])
  const [userWebsite, setUserWebsite] = useState('')


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
    passportData, 
    setPassportData,
    userLawSubject, 
    setUserLawSubject,
    individualEntrepreneurData, 
    setIndividualEntrepreneurData,
    selfEmployedData, 
    setSelfEmployedData,
    legalEntityData, 
    setLegalEntityData,
    userExperience, 
    setUserExperience,
    specialistsNumber, 
    setSpecialistsNumber,
    userLicense, 
    setUserLicense,
    userEducationalDiplom, 
    setUserEducationalDiplom,
    userCriminalRecord, 
    setUserCriminalRecord,
    userService, 
    setUserService,
    otherTeamsInteraction, 
    setOtherTeamsInteraction,
    userProjects, 
    setUserProjects,
    reviews, 
    setReviews,
    certificates, 
    setCertificates,
    userPhone, 
    setUserPhone,
    userEmail, 
    setUserEmail,
    userSocialMedia, 
    setUserSocialMedia,
    userWebsite, 
    setUserWebsite,


  }), [
    selectedCity,
    phoneNumber,
    smsCode,
    userName,
    userRegion,
    stepNumber,
    userActivity,
    passportData,
    userLawSubject,
    individualEntrepreneurData,
    selfEmployedData,
    legalEntityData, 
    userExperience,
    specialistsNumber,
    userLicense,
    userEducationalDiplom, 
    userCriminalRecord, 
    userService,
    otherTeamsInteraction, 
    userProjects, 
    reviews, 
    certificates, 
    userPhone, 
    userEmail, 
    userSocialMedia, 
    userWebsite, 


  ])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
