import '../../Registration.css'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import DatePicker from '../../common/Calendar/DatePicker'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import FileUpload from '../../common/FileUpload'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale3.svg'


export default function Step2FullName() {
  const navigate = useNavigate()
  const {
    stepNumber, setStepNumber,
    userLawSubject, setUserLawSubject,
    individualEntrepreneurData, setIndividualEntrepreneurData,
    selfEmployedData, setSelfEmployedData,
    legalEntityData, setLegalEntityData
  } = useAppContext()

  const [dateError, setDateError] = useState('')
  const [isFormValid, setIsFormValid] = useState(false)

  const organizationNameRef = useRef(null)
  const fioInputRef = useRef(null)

  const isLegalEntity = userLawSubject === 'legal_entity'
  const showIPSelfSwitcher = !isLegalEntity

  // фокус на первое поле
  useEffect(() => {
    setTimeout(() => {
      if (isLegalEntity) organizationNameRef.current?.focus()
      else fioInputRef.current?.focus()
    }, 100)
  }, [isLegalEntity, userLawSubject])

  // обработка переключателей
  const getActiveData = () => isLegalEntity ? legalEntityData : userLawSubject === 'self-employed' ? selfEmployedData : individualEntrepreneurData
  const setActiveData = (newData) => {
    if (isLegalEntity) setLegalEntityData(newData)
    else if (userLawSubject === 'self-employed') setSelfEmployedData(newData)
    else setIndividualEntrepreneurData(newData)
  }

  // обработка обновления данных
  const updateField = (field, value) => setActiveData({ ...getActiveData(), [field]: value })

  const addFiles = (field, newFiles) => {
    setActiveData(prev => ({ ...prev, [field]: newFiles }));
  }

  // валидация даты
  const validateDate = (dateStr) => {
    if (!dateStr || dateStr.replace(/\D/g,'').length!==6) return false
    const day=parseInt(dateStr.slice(0,2))
    const month=parseInt(dateStr.slice(3,5))
    const year=parseInt('20'+dateStr.slice(6,8))
    const date=new Date(year, month-1, day)
    const today=new Date()
    return date <= today && date.getDate()===day && date.getMonth()===month-1 && date.getFullYear()===year
  }

  // ИП по умолчанию
  useEffect(() => {
    // если не юридическое лицо и еще не выбрано ИП/Самозанятый
    if (userLawSubject !== 'legal_entity' && 
        userLawSubject !== 'individual_entrepreneur' && 
        userLawSubject !== 'self-employed') {
      setUserLawSubject('individual_entrepreneur')
    }
  }, [userLawSubject, setUserLawSubject])

  // обработка добавления данных
  useEffect(() => {
    const data = getActiveData();
    let valid = false;

    const hasFiles = (field) => Array.isArray(data[field]) && data[field].length > 0;

    if (isLegalEntity) {
      const organizationNameValid = data.organizationName?.trim().length >= 3;
      const innValid = data.INN?.replace(/\D/g,'').length === 10;
      const ogrnValid = data.OGRN?.replace(/\D/g,'').length === 13;
      const dateValid = data.registrationDate && validateDate(data.registrationDate);
      const registrationAddressValid = data.registrationAddress?.trim().length >= 5;
      
      valid = Boolean(
        organizationNameValid &&
        innValid &&
        ogrnValid &&
        dateValid &&
        registrationAddressValid && 
        hasFiles('extractEGRUL')
      );
    } else if (userLawSubject === 'individual_entrepreneur') {
      const innValid = data.INN?.replace(/\D/g,'').length === 12;
      const ogrnipValid = data.OGRNIP?.replace(/\D/g,'').length === 15;
      const dateValid = data.registrationDate && validateDate(data.registrationDate);
      const fioValid = data.FIO?.trim().length >= 5;
      const registrationAddressValid = data.registrationAddress?.trim().length >= 5;
      
      valid = Boolean(
        fioValid &&
        innValid &&
        ogrnipValid &&
        dateValid &&
        registrationAddressValid &&
        hasFiles('extractOGRNIP')
      );
    } else if (userLawSubject === 'self-employed') {
      const innValid = data.INN?.replace(/\D/g,'').length === 12;
      const dateValid = data.registrationDate && validateDate(data.registrationDate);
      const fioValid = data.FIO?.trim().length >= 5;
      
      valid = Boolean(
        fioValid &&
        innValid &&
        dateValid &&
        hasFiles('registrationCertificate')
      );
    }

    setIsFormValid(valid);
  }, [userLawSubject, individualEntrepreneurData, selfEmployedData, legalEntityData, isLegalEntity]);

  const handleFIOChange = e => updateField('FIO', e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g,''))
  const handleINNChange = e => {
    let val=e.target.value.replace(/\D/g,'')
    val=val.slice(0,isLegalEntity?10:12)
    updateField('INN', val)
  }
  const handleOGRNChange = e => updateField('OGRN', e.target.value.replace(/\D/g,'').slice(0,13))
  const handleOGRNIPChange = e => updateField('OGRNIP', e.target.value.replace(/\D/g,'').slice(0,15))
  const handleRegistrationAddressChange = e => updateField('registrationAddress', e.target.value)
  const handleOrganizationNameChange = e => updateField('organizationName', e.target.value)
  const handleDateChange = value => {
    let digits=value.replace(/\D/g,'').slice(0,6)
    let formatted=digits.length>4?digits.slice(0,2)+'.'+digits.slice(2,4)+'.'+digits.slice(4):digits.length>2?digits.slice(0,2)+'.'+digits.slice(2):digits
    updateField('registrationDate', formatted)
    setDateError(digits.length===6 && !validateDate(formatted)?'Некорректная дата':'')
  }

  const handleIPSelfSwitch = type => {
    if(type==='self-employed' && userLawSubject==='individual_entrepreneur') setIndividualEntrepreneurData({ FIO:'', INN:'', OGRNIP:'', registrationDate:'', registrationAddres:'', extractOGRNIP:[] })
    else if(type==='individual_entrepreneur' && userLawSubject==='self-employed') setSelfEmployedData({ FIO:'', INN:'', registrationDate:'', registrationCertificate:[] })
    setUserLawSubject(type)
  }

  const handleBack = () => navigate('/full_registration_step1')
  const handleForward = () => { 
    console.log(userLawSubject, 'ИП', individualEntrepreneurData, 'СЗ', selfEmployedData, 'Физ', legalEntityData)
    setStepNumber(stepNumber + 1)
    navigate('/full_registration_step3') 
  }

  const getValue = field => getActiveData()[field]||''

  return (
    <div>
      <Header hideElements={true}/>
      <div className='reg-container'>
        <div className='registr-container' style={{ height:'auto', paddingBottom: '27px' }}>

          <div className='title'>
            <button className='btn-back' onClick={handleBack}><img src={arrow} alt='Назад'/></button>
            <h2 className="login-title">Полная регистрация</h2>
          </div>
          <div className='registr-scale'><p>2/6</p><img src={scale} alt='Registration scale'/></div>

          {/* переключатели */}
          {showIPSelfSwitcher && <div className="role-switcher">
            <button className={`role-option ${userLawSubject==='individual_entrepreneur'?'active':''}`} onClick={()=>handleIPSelfSwitch('individual_entrepreneur')}>ИП</button>
            <button className={`role-option ${userLawSubject==='self-employed'?'active':''}`} onClick={()=>handleIPSelfSwitch('self-employed')}>Самозанятый</button>
          </div>}

          {/* все инпуты */}
          <div className='passport-fields-grid' style={{marginTop:'30px'}}>
            {isLegalEntity ? <>
              <div className='passport-row'><div className='passport-field full-width'><h3>Наименование организации</h3><input ref={organizationNameRef} value={getValue('organizationName')} onChange={handleOrganizationNameChange} placeholder='Введите наименование организации'/></div></div>
              <div className='passport-row'><div className='passport-field full-width'><h3>ИНН <span style={{color:'#666', fontSize:'15px'}}>(10 цифр)</span></h3><input value={getValue('INN')} onChange={handleINNChange} placeholder='00 00 00000 0' maxLength={10}/></div></div>
              <div className='passport-row'><div className='passport-field full-width'><h3>ОГРН <span style={{color:'#666', fontSize:'15px'}}>(13 цифр)</span></h3><input value={getValue('OGRN')} onChange={handleOGRNChange} placeholder='0000000000000' maxLength={13}/></div></div>
              <div className='passport-row'><div className='passport-field full-width'><h3>Дата регистрации {dateError&&<span style={{color:'#ff4444', marginLeft:'10px', fontSize: '16px'}}>{dateError}</span>}</h3><DatePicker value={getValue('registrationDate')} onChange={handleDateChange} placeholder='00.00.00' error={!!dateError}/></div></div>
              <div className='passport-row'><div className='passport-field full-width'><h3>Адрес регистрации</h3><input value={getValue('registrationAddress')} onChange={e=>updateField('registrationAddress',e.target.value)} placeholder='Укажите юридический адрес'/></div></div>
              <div className='passport-field'><h3>Выписка из ЕГРЮЛ</h3><FileUpload onFilesUpload={(files) => addFiles('extractEGRUL', files)} maxFiles={5} /><p>Добавьте скан документа</p></div>
            </> : <>
              <div className='passport-row'><div className='passport-field full-width'><h3>ФИО</h3><input ref={fioInputRef} value={getValue('FIO')} onChange={handleFIOChange} placeholder='Введите ваше ФИО'/></div></div>
              <div className='passport-row'><div className='passport-field full-width'><h3>ИНН <span style={{color:'#666', fontSize:'15px'}}>(12 цифр)</span></h3><input value={getValue('INN')} onChange={handleINNChange} placeholder='00 00 000000 00' maxLength={12}/></div></div>
              {userLawSubject==='individual_entrepreneur'&&<div className='passport-row'><div className='passport-field full-width'><h3>ОГРНИП <span style={{color:'#666', fontSize:'15px'}}>(15 цифр)</span></h3><input value={getValue('OGRNIP')} onChange={handleOGRNIPChange} placeholder='000000000000000' maxLength={15}/></div></div>}
              <div className='passport-row'><div className='passport-field full-width'><h3>Дата регистрации {dateError&&<span style={{color:'#ff4444', marginLeft:'10px', fontSize: '16px'}}>{dateError}</span>}</h3><DatePicker value={getValue('registrationDate')} onChange={handleDateChange} placeholder='00.00.00' error={!!dateError}/></div></div>
              {userLawSubject==='individual_entrepreneur'&&<div className='passport-row'><div className='passport-field full-width'><h3>Адрес регистрации</h3><input value={getValue('registrationAddress')} onChange={handleRegistrationAddressChange} placeholder='Укажите адрес регистрации'/></div></div>}
              {userLawSubject==='individual_entrepreneur'&&<div className='passport-field'><h3>Выписка из ЕГРИП</h3><FileUpload onFilesUpload={files=>addFiles('extractOGRNIP',files)} maxFiles/><p>Добавьте скан документа</p></div>}
              {userLawSubject==='self-employed'&&<div className='passport-field'><h3>Справка о постановке на учет (СЗ)</h3><FileUpload onFilesUpload={files=>addFiles('registrationCertificate',files)} maxFiles/><p>Добавьте скан документа</p></div>}
            </>}
          </div>

          <button className={`continue-button ${!isFormValid?'disabled':''}`} disabled={!isFormValid} onClick={handleForward} style={{marginTop:'50px'}}>Продолжить</button>
        </div>
      </div>

      <Footer className='footer footer--registr'/>
    </div>
  )
}
