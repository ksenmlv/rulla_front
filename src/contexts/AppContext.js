import { createContext, useContext, useMemo, useState } from 'react'


const AppContext = createContext()

export const useAppContext = () => {
  return useContext(AppContext)
}

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [regStatus, setRegStatus] = useState('')



  // глобальные состояния
  const [selectedCity, setSelectedCity] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [userName, setUserName] = useState('')
  const [contactType, setContactType] = useState('')                  // phone/email для физ лиц
  const [temporaryContact, setTemporaryContact] = useState()          // временный контакт для проверки
 
  // 1 этап
  const [userRegion, setUserRegion] = useState('')
  const [userActivity, setUserActivity] = useState('')
  const [travelReadiness, setTravelReadiness] = useState(false)

  // 2 этап регистрации
  const [userLawSubject, setUserLawSubject] = useState('individual')         // legal_entity || individual || self_employed
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

  // 3 этап регистрации
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
  const [directorData, setDirectorData] = useState({FIO: '', phone: ''})

  // 4 этап регистрации
  const [userExperience, setUserExperience] = useState()
  const [specialistsNumber, setSpecialistsNumber] = useState('')
  const [userLicense, setUserLicense] = useState({ status: '', files: [] });
  const [userEducationalDiplom, setUserEducationalDiplom] = useState({ status: '', files: [] });
  const [userCriminalRecord, setUserCriminalRecord] = useState({ status: '', text: '' });
  const [contractWork, setContractWork] = useState(false)

  // 5 этап регистрации
  const [userService, setUserService] = useState([{ name: '', price: '', unit: '' }])
  const [otherTeamsInteraction, setOtherTeamsInteraction] = useState({ status: '', text: '' })
  const [userProjects, setUserProjects] = useState([{ files: [], text: '' }])
  const [reviews, setReviews] = useState({ files: [] })
  const [certificates, setCertificates] = useState({ files: [] })


  // 6 этап регистрации
  // const [userPhone, setUserPhone] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userSocialMedia, setUserSocialMedia] = useState({
    telegram: { phone: '', nickname: '' },
    whatsapp: { phone: '' },
    vk: { phone: '', nickname: '' }
  })
  const [userWebsite, setUserWebsite] = useState('')

  const [stepNumber, setStepNumber] = useState(1)



  // главная страница исполнителя
  



  // оптимизация значения контекста с помощью useMemo
  const value = useMemo(() => ({
    userId, setUserId,
    userPhone, setUserPhone,
    firstName, setFirstName,
    lastName, setLastName,
    regStatus, setRegStatus,


    selectedCity,
    setSelectedCity,
    phoneNumber, 
    setPhoneNumber,
    smsCode, 
    setSmsCode,
    userName, 
    setUserName,
    contactType, 
    setContactType,
    temporaryContact, 
    setTemporaryContact,
    userRegion, 
    setUserRegion,
    stepNumber, 
    setStepNumber,
    userActivity, 
    setUserActivity,
    travelReadiness, 
    setTravelReadiness,
    passportData, 
    setPassportData,
    directorData, 
    setDirectorData,
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
    contractWork, 
    setContractWork,
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
    userId, 
    userPhone, 
    firstName, 
    lastName, 
    regStatus, 

    selectedCity,
    phoneNumber,
    smsCode,
    userName,
    contactType,
    temporaryContact,
    userRegion,
    stepNumber,
    userActivity,
    travelReadiness,
    passportData,
    directorData,
    userLawSubject,
    individualEntrepreneurData,
    selfEmployedData,
    legalEntityData, 
    userExperience,
    specialistsNumber,
    userLicense,
    userEducationalDiplom, 
    userCriminalRecord, 
    contractWork,
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
