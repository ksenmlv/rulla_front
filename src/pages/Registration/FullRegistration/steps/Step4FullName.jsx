import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import FileUpload from '../../common/FileUpload'
import LawSubjectSwitcher from '../../common/LawSubjectSwitcher'
import '../../Registration.css'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale4.svg'

export default function Step4FullName() {
  const navigate = useNavigate()
  const { 
    stepNumber, 
    setStepNumber, 
    userLawSubject, 
    setUserLawSubject, 
    individualEntrepreneurData, 
    setIndividualEntrepreneurData, 
    selfEmployedData, 
    setSelfEmployedData,
    legalEntityData,
    setLegalEntityData
  } = useAppContext()
  
  const [dateError, setDateError] = useState('')
  const [formHeight, setFormHeight] = useState('1365px')
  const [isFormValid, setIsFormValid] = useState(false)

  // Рефы для автофокуса
  const organizationNameRef = useRef(null)
  const fioInputRef = useRef(null)

  // Определяем тип субъекта
  const isLegalEntity = (userLawSubject === 'legal_entity')
  const showIPSelfSwitcher = !isLegalEntity

  // Автофокус на первое поле при открытии формы и при переключении
  useEffect(() => {
    setTimeout(() => {
      if (isLegalEntity) {
        organizationNameRef.current?.focus()
      } else {
        fioInputRef.current?.focus()
      }
    }, 100)
  }, [isLegalEntity, userLawSubject]) // Добавляем userLawSubject в зависимости

  // Проверка валидности формы
  useEffect(() => {
    let isValid = false

    if (isLegalEntity) {
      // Валидация для юридического лица
      const innValid = legalEntityData.INN?.replace(/\D/g, '').length === 10 // ИНН юрлица - 10 цифр
      const ogrnValid = legalEntityData.OGRN?.replace(/\D/g, '').length === 13 // ОГРН - 13 цифр
      const dateValid = legalEntityData.registrationDate?.replace(/\D/g, '').length === 6
      const hasExtractEGRUL = legalEntityData.extractEGRUL && legalEntityData.extractEGRUL.length > 0
      
      isValid = Boolean(
        legalEntityData.organizationName?.trim() &&
        innValid &&
        ogrnValid &&
        dateValid &&
        legalEntityData.registrationAddress?.trim() &&
        hasExtractEGRUL
      )
    } else if (userLawSubject === 'individual_entrepreneur') {
      // Валидация для ИП
      const innValid = individualEntrepreneurData.INN?.replace(/\D/g, '').length === 12 // ИНН физлица - 12 цифр
      const ogrnipValid = individualEntrepreneurData.OGRNIP?.replace(/\D/g, '').length === 15 // ОГРНИП - 15 цифр
      const dateValid = individualEntrepreneurData.registrationDate?.replace(/\D/g, '').length === 6
      const hasExtractOGRNIP = individualEntrepreneurData.extractOGRNIP && individualEntrepreneurData.extractOGRNIP.length > 0
      
      isValid = Boolean(
        individualEntrepreneurData.FIO?.trim() &&
        innValid &&
        ogrnipValid &&
        dateValid &&
        individualEntrepreneurData.registrationPlace?.trim() &&
        hasExtractOGRNIP
      )
    } else if (userLawSubject === 'self-employed') {
      // Валидация для самозанятого
      const innValid = selfEmployedData.INN?.replace(/\D/g, '').length === 12 // ИНН физлица - 12 цифр
      const dateValid = selfEmployedData.registrationDate?.replace(/\D/g, '').length === 6
      const hasRegistrationCertificate = selfEmployedData.registrationCertificate && selfEmployedData.registrationCertificate.length > 0
      
      isValid = Boolean(
        selfEmployedData.FIO?.trim() &&
        innValid &&
        dateValid &&
        hasRegistrationCertificate
      )
    }

    setIsFormValid(isValid)
  }, [userLawSubject, individualEntrepreneurData, selfEmployedData, legalEntityData, isLegalEntity])

  // Обработчики для данных юридического лица
  const handleLegalEntityChange = (field, value) => {
    setLegalEntityData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLegalEntityFileUpload = (field, files) => {
    setLegalEntityData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ...files]
    }))
  }

  // Обработчики для ИП
  const handleIndividualEntrepreneurChange = (field, value) => {
    setIndividualEntrepreneurData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Обработчики для самозанятого
  const handleSelfEmployedChange = (field, value) => {
    setSelfEmployedData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSelfEmployedFileUpload = (field, files) => {
    setSelfEmployedData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ...files]
    }))
  }

  // Универсальные обработчики для полей ввода
  const handleFIOChange = (e) => {
    let value = e.target.value
    value = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, '')
    
    if (userLawSubject === 'self-employed') {
      handleSelfEmployedChange('FIO', value)
    } else {
      handleIndividualEntrepreneurChange('FIO', value)
    }
  }

  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 6) value = value.slice(0, 6)
    
    let formattedValue = value
    if (value.length > 4) {
      formattedValue = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4)
    } else if (value.length > 2) {
      formattedValue = value.slice(0, 2) + '.' + value.slice(2)
    }
    
    if (isLegalEntity) {
      handleLegalEntityChange('registrationDate', formattedValue)
    } else if (userLawSubject === 'self-employed') {
      handleSelfEmployedChange('registrationDate', formattedValue)
    } else {
      handleIndividualEntrepreneurChange('registrationDate', formattedValue)
    }
    
    if (value.length === 6) {
      const day = parseInt(value.slice(0, 2))
      const month = parseInt(value.slice(2, 4))
      const year = parseInt('20' + value.slice(4, 6))
      const date = new Date(year, month - 1, day)
      const today = new Date()
      
      if (date > today) {
        setDateError('Дата не может быть больше текущей')
      } else if (date.getDate() !== day || date.getMonth() !== month - 1) {
        setDateError('Некорректная дата')
      } else {
        setDateError('')
      }
    } else {
      setDateError('')
    }
  }

  const handleINNChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    
    // Устанавливаем максимальную длину в зависимости от типа субъекта
    let maxLength = isLegalEntity ? 10 : 12 // 10 для юрлица, 12 для физлица
    if (value.length > maxLength) value = value.slice(0, maxLength)
    
    let formattedValue = value
    if (isLegalEntity) {
      // Форматирование для ИНН юрлица (10 цифр): XX XX XXXXX X
      if (value.length > 8) {
        formattedValue = value.slice(0, 2) + ' ' + value.slice(2, 4) + ' ' + value.slice(4, 9) + ' ' + value.slice(9)
      } else if (value.length > 4) {
        formattedValue = value.slice(0, 2) + ' ' + value.slice(2, 4) + ' ' + value.slice(4)
      } else if (value.length > 2) {
        formattedValue = value.slice(0, 2) + ' ' + value.slice(2)
      }
    } else {
      // Форматирование для ИНН физлица (12 цифр): XX XX XXXXXX XX
      if (value.length > 10) {
        formattedValue = value.slice(0, 2) + ' ' + value.slice(2, 4) + ' ' + value.slice(4, 10) + ' ' + value.slice(10)
      } else if (value.length > 5) {
        formattedValue = value.slice(0, 2) + ' ' + value.slice(2, 4) + ' ' + value.slice(4)
      } else if (value.length > 2) {
        formattedValue = value.slice(0, 2) + ' ' + value.slice(2)
      }
    }
    
    if (isLegalEntity) {
      handleLegalEntityChange('INN', formattedValue)
    } else if (userLawSubject === 'self-employed') {
      handleSelfEmployedChange('INN', formattedValue)
    } else {
      handleIndividualEntrepreneurChange('INN', formattedValue)
    }
  }

  const handleOGRNChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 13) value = value.slice(0, 13) // ОГРН - 13 цифр
    handleLegalEntityChange('OGRN', value)
  }

  const handleOGRNIPChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 15) value = value.slice(0, 15) // ОГРНИП - 15 цифр
    handleIndividualEntrepreneurChange('OGRNIP', value)
  }

  const handleRegistrationPlaceChange = (e) => {
    const value = e.target.value
    if (userLawSubject === 'self-employed') {
      handleSelfEmployedChange('registrationPlace', value)
    } else {
      handleIndividualEntrepreneurChange('registrationPlace', value)
    }
  }

  const handleFileUpload = (field, files) => {
    if (isLegalEntity) {
      handleLegalEntityFileUpload(field, files)
    } else if (userLawSubject === 'self-employed') {
      handleSelfEmployedFileUpload(field, files)
    } else {
      setIndividualEntrepreneurData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), ...files]
      }))
    }
  }

  // Обработчик переключения между ИП и самозанятым с очисткой полей
  const handleIPSelfSwitch = (type) => {
    // Очищаем данные при переключении
    if (type === 'self-employed' && userLawSubject === 'individual_entrepreneur') {
      // Переключаемся на самозанятого - очищаем данные ИП
      setIndividualEntrepreneurData({
        FIO: '',
        INN: '',
        OGRNIP: '',
        registrationDate: '',
        registrationPlace: '',
        extractOGRNIP: []
      })
    } else if (type === 'individual_entrepreneur' && userLawSubject === 'self-employed') {
      // Переключаемся на ИП - очищаем данные самозанятого
      setSelfEmployedData({
        FIO: '',
        INN: '',
        registrationDate: '',
        registrationPlace: '',
        registrationCertificate: []
      })
    }
    setUserLawSubject(type)
  }

  // Получаем текущие значения для отображения в полях ввода
  const getCurrentValue = (field) => {
    if (isLegalEntity) {
      return legalEntityData[field] || ''
    } else if (userLawSubject === 'self-employed') {
      return selfEmployedData[field] || ''
    } else {
      return individualEntrepreneurData[field] || ''
    }
  }

  // Динамическое изменение высоты формы
  useEffect(() => {
    if (isLegalEntity) {
      setFormHeight('1290px') // Высота для юрлица
    } else if (userLawSubject === 'individual_entrepreneur') {
      setFormHeight('1365px') // Высота для ИП (больше полей)
    } else {
      setFormHeight('1130px') // Высота для самозанятого
    }
  }, [userLawSubject, isLegalEntity])

  const handleBack = () => {
    setIndividualEntrepreneurData({
      FIO: '',
      INN: '', 
      OGRNIP: '', 
      regustrationDate: '', 
      extractOGRNIP: []
    })
    setSelfEmployedData({
      FIO: '',
      INN: '', 
      regustrationDate: '',
      registrationCertificate: []
    })
    setLegalEntityData({
      organizationName: '', 
      INN: '', 
      OGRN: '',
      registrationDate: '',
      registrationAddress: '',
      extractEGRUL: []
    })

    navigate('/full_registration_step3')
  }

  const handleForward = () => {
    console.log('Данные ИП:', individualEntrepreneurData)
    console.log('Данные юрлица:', legalEntityData)
    console.log('Данные самозанятого:', selfEmployedData)
    
    setStepNumber(stepNumber + 1)
    navigate('/full_registration_step5')
  }

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container'>
        <div className='registr-container' style={{minHeight: formHeight}}>

            <div className='title'>
                <button className='btn-back' onClick={handleBack}>
                    <img src={arrow} alt='Назад' />
                </button>
                <h2 className="login-title">Полная регистрация</h2>
            </div>

            <div className='registr-scale'>
                <p>4/7</p>
                <img src={scale} alt='Registration scale' />
            </div>

            {/* переключатель физ/юр лицо */}
            <LawSubjectSwitcher 
              currentSubject={userLawSubject}
              onSubjectChange={setUserLawSubject}
            />

            {/* переключатель ИП/самозанятый отображается только для физ лица */}
            {showIPSelfSwitcher && (
              <div className="role-switcher">
                  <div className="role-slider"></div>

                  <button
                    className={`role-option ${userLawSubject === 'individual_entrepreneur' ? 'active' : ''}`}
                    onClick={() => handleIPSelfSwitch('individual_entrepreneur')}
                  > 
                    ИП 
                  </button>

                  <button
                    className={`role-option ${userLawSubject === 'self-employed' ? 'active' : ''}`}
                    onClick={() => handleIPSelfSwitch('self-employed')}
                  > 
                    Самозанятый 
                  </button>
              </div>
            )}

            {/* инпуты для ввода данных */}
            <div className='passport-fields-grid' style={{marginTop:'30px'}}>
              {isLegalEntity ? (
                // === ПОЛЯ ДЛЯ ЮРИДИЧЕСКОГО ЛИЦА ===
                <>
                  <div className='passport-row'>
                    <div className='passport-field full-width'>
                      <h3>Наименование организации</h3>
                      <input
                        ref={organizationNameRef}
                        value={getCurrentValue('organizationName')}
                        onChange={(e) => handleLegalEntityChange('organizationName', e.target.value)}
                        placeholder='Введите наименование организации'
                      />
                    </div>
                  </div>

                  <div className='passport-row'>
                    <div className='passport-field full-width'>
                      <h3>ИНН <span style={{color: '#666', fontSize: '14px'}}>(10 цифр)</span></h3>
                      <input
                        value={getCurrentValue('INN')}
                        onChange={handleINNChange}
                        placeholder='00 00 00000 0'
                        maxLength={14}
                      />
                    </div>
                  </div>

                  <div className='passport-row'>
                    <div className='passport-field full-width'>
                      <h3>ОГРН <span style={{color: '#666', fontSize: '14px'}}>(13 цифр)</span></h3>
                      <input
                        value={getCurrentValue('OGRN')}
                        onChange={handleOGRNChange}
                        placeholder='0000000000000'
                        maxLength={13}
                      />
                    </div>
                  </div>

                  <div className='passport-row'>
                    <div className='passport-field full-width'>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <h3>Дата регистрации</h3>
                        {dateError && (
                          <span style={{ 
                              color: '#ff4444', 
                              fontSize: '16px',
                              fontWeight: '700',
                              marginLeft:'15px',
                              marginBottom: '10px'
                          }}>
                            {dateError}
                          </span>
                        )}
                      </div>
                      <input 
                          value={getCurrentValue('registrationDate')}
                          placeholder='00.00.00' 
                          maxLength={8}
                          onChange={handleDateChange}
                          className={dateError ? 'error' : ''}
                      />
                    </div>
                  </div>

                  <div className='passport-row'>
                    <div className='passport-field full-width'>
                      <h3>Адрес регистрации</h3>
                      <input 
                        value={getCurrentValue('registrationAddress')}
                        onChange={(e) => handleLegalEntityChange('registrationAddress', e.target.value)}
                        placeholder='Укажите юридический адрес' 
                      />
                    </div>
                  </div>

                  <div className='passport-field' style={{marginTop: '10px'}}>
                    <h3>Выписка из ЕГРЮЛ</h3>
                    <FileUpload onFilesUpload={(files) => handleFileUpload('extractEGRUL', files)} maxFiles/>
                    <p>Добавьте скан документа</p>
                  </div>
                </>
              ) : (
                // === ПОЛЯ ДЛЯ ФИЗИЧЕСКИХ ЛИЦ (ИП/САМОЗАНЯТЫЙ) ===
                <>
                  <div className='passport-row'>
                    <div className='passport-field full-width'>
                      <h3>ФИО</h3>
                      <input 
                        ref={fioInputRef}
                        value={getCurrentValue('FIO')}
                        onChange={handleFIOChange}
                        placeholder='Введите ваше ФИО' 
                      />
                    </div>
                  </div>

                  <div className='passport-row'>
                    <div className='passport-field full-width'>
                      <h3>ИНН <span style={{color: '#666', fontSize: '14px'}}>(12 цифр)</span></h3>
                      <input 
                        value={getCurrentValue('INN')}
                        onChange={handleINNChange}
                        placeholder='00 00 000000 00'
                        maxLength={17}
                      />
                    </div>
                  </div>

                  {userLawSubject === 'individual_entrepreneur' && (
                    <div className='passport-row'>
                      <div className='passport-field full-width'>
                        <h3>ОГРНИП <span style={{color: '#666', fontSize: '14px'}}>(15 цифр)</span></h3>
                        <input 
                          value={getCurrentValue('OGRNIP')}
                          onChange={handleOGRNIPChange}
                          placeholder='000000000000000'
                          maxLength={15}
                        />
                      </div>
                    </div>
                  )}

                  <div className='passport-row'>
                    <div className='passport-field full-width'>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <h3>Дата регистрации</h3>
                        {dateError && (
                          <span style={{ 
                              color: '#ff4444', 
                              fontSize: '16px',
                              fontWeight: '700',
                              marginLeft:'15px',
                              marginBottom: '10px'
                          }}>
                            {dateError}
                          </span>
                        )}
                      </div>
                      <input 
                          value={getCurrentValue('registrationDate')}
                          placeholder='00.00.00' 
                          maxLength={8}
                          onChange={handleDateChange}
                          className={dateError ? 'error' : ''}
                      />
                    </div>
                  </div>

                  {userLawSubject === 'individual_entrepreneur' && (
                    <div className='passport-row'>
                      <div className='passport-field full-width'>
                        <h3>Место регистрации</h3>
                        <input 
                          value={getCurrentValue('registrationPlace')}
                          onChange={handleRegistrationPlaceChange}
                          placeholder='Укажите место регистрации' 
                        />
                      </div>
                    </div> 
                  )}

                  {userLawSubject === 'individual_entrepreneur' && (
                    <div className='passport-field' style={{marginTop: '10px'}}>
                      <h3>Выписка из ЕГРИП</h3>
                      <FileUpload onFilesUpload={(files) => handleFileUpload('extractOGRNIP', files)} maxFiles/>
                      <p>Добавьте скан документа</p>
                    </div>
                  )}

                  {userLawSubject === 'self-employed' && (
                    <div className='passport-field' style={{marginTop: '10px'}}>
                      <h3>Справка о постановке на учет (СЗ)</h3>
                      <FileUpload onFilesUpload={(files) => handleFileUpload('registrationCertificate', files)} maxFiles/>
                      <p>Добавьте скан документа</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <button
                type="submit"
                className={`continue-button ${!isFormValid ? 'disabled' : ''}`}
                onClick={handleForward}
                style={{marginTop: '50px'}}
                disabled={!isFormValid}
            >
              Продолжить
            </button>
            

        </div>
      </div>

      <Footer className='footer footer--registr' />
    </div>
  )
}