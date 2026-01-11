import '../../Registration.css'
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import RegistrSelector from '../../../../components/lists/RegistrSelector'
import PhoneNumber from '../../common/PhoneNumber'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import DatePicker from '../../common/Calendar/DatePicker'
import FileUpload from '../../common/FileUpload'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale3.svg'
import apiClient from '../../../../api/client'
import { countriesApi } from '../../../../api/countriesApi.ts'

export default function Step3Passport() {
  const navigate = useNavigate()
  const { stepNumber, setStepNumber, passportData, setPassportData, directorData, setDirectorData, userLawSubject } = useAppContext()

  const citizenshipOptions = ['RU', 'KZ', 'Другое']
  const [countries, setCountries] = useState([])

  const [isFormValid, setIsFormValid] = useState(false)
  const [dateError, setDateError] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const seriesRef = useRef(null)
  const directorPhoneRef = useRef(null)
  const numberDocumentRef = useRef(null)

  const isRussian = passportData.citizenship === 'RU'

  // РФ по умолчанию
  // useEffect(() => {
  //     updatePassport('citizenship', 'RU')
    
  // }, [])

  // Загрузка стран
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await countriesApi.getAllCountries()
        setCountries(data)
      } catch (err) {
        console.error('Ошибка загрузки стран:', err)
        setErrorMessage('Не удалось загрузить список стран')
      }
    }
    loadCountries()
  }, [])

  // Автофокус
  useEffect(() => {
    setTimeout(() => {
      if (userLawSubject === 'legal_entity') {
        directorPhoneRef.current?.focus()
      } else if (passportData.citizenship === 'RU') {
        seriesRef.current?.focus()
      } else if (passportData.citizenship === 'KZ') {
        numberDocumentRef.current?.focus()
      }
    }, 100)
  }, [passportData.citizenship, userLawSubject])

  const updatePassport = (field, value) => {
    setPassportData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field, files) => {
    updatePassport(field, files)
  }

  // Валидация даты выдачи паспорта (≥ 14 лет на момент выдачи)
  const isValidDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 10) return false
    const digits = dateStr.replace(/\D/g, '')
    if (digits.length !== 8) return false

    const day = parseInt(digits.slice(0,2))
    const month = parseInt(digits.slice(2,4))
    const year = parseInt(digits.slice(4,8))

    if (year < 1900) return false

    const issueDate = new Date(year, month - 1, day)
    const today = new Date()

    if (issueDate > today) return false
    if (issueDate.getDate() !== day || issueDate.getMonth() !== month - 1 || issueDate.getFullYear() !== year) return false

    let age = today.getFullYear() - year
    const m = today.getMonth() - (month - 1)
    if (m < 0 || (m === 0 && today.getDate() < day)) age--
    return age >= 14
  }

  const handleDateChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0,8)
    let formatted = digits
    if (digits.length > 4) formatted = digits.slice(0,2) + '.' + digits.slice(2,4) + '.' + digits.slice(4,8)
    else if (digits.length > 2) formatted = digits.slice(0,2) + '.' + digits.slice(2)

    updatePassport('issueDate', formatted)

    if (formatted.length === 10) {
      const valid = isValidDate(formatted)
      setDateError(valid ? '' : 'Некорректная дата (возраст на момент выдачи ≥ 14 лет)')
    } else {
      setDateError('')
    }
  }

  const handleDirectorFIOChange = (value) => {
    const cleanValue = value.replace(/[^а-яА-ЯёЁa-zA-Z\s]/g, '')
    setDirectorData(prev => ({ ...prev, FIO: cleanValue }))
  }

  const handleDirectorPhoneChange = (value) => {
    const digits = value.replace(/\D/g, '')
    setDirectorData(prev => ({ ...prev, phone: digits }))
  }

  // Валидация формы
  useEffect(() => {
    let formValid = false

    if (userLawSubject === 'legal_entity') {
      const fioFilled = directorData.FIO?.trim().length >= 5
      const phoneValid = directorData.phone?.replace(/\D/g,'').length >= 10
      formValid = fioFilled && phoneValid
    } else {
      const issuedByValid = passportData.issuedBy?.trim().length >= 5
      const fieldsFilled = isRussian
        ? passportData.series?.trim() && passportData.number?.trim() && issuedByValid && passportData.issueDate?.trim()
        : passportData.number?.trim() && issuedByValid && passportData.issueDate?.trim()

      const dateValid = isValidDate(passportData.issueDate)
      const scanValid = (passportData.scanPages?.length > 0) && (passportData.scanRegistration?.length > 0)
      const seriesValid = !isRussian || (passportData.series?.replace(/\s/g,'').length === 4)
      const numberValid = isRussian 
        ? passportData.number?.replace(/\D/g,'').length === 6 
        : passportData.number?.trim().length > 0

      formValid = Boolean(fieldsFilled && dateValid && scanValid && seriesValid && numberValid && issuedByValid)
    }

    setIsFormValid(formValid)
  }, [passportData, directorData, dateError, isRussian, userLawSubject])

  const handleBack = () => navigate('/full_registration_step2')

  const handleForward = async () => {
    if (!isFormValid) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      if (userLawSubject === 'legal_entity') {
        console.log('Отправка юрлица:', { directorFullName: directorData.FIO.trim(), directorPhone: directorData.phone })
        await apiClient.patch('/executors/companies/me/data', {
          directorFullName: directorData.FIO.trim(),
          directorPhone: directorData.phone
        })
      } else {
        // Подготовка данных паспорта
        const citizenshipIso2 = passportData.citizenship === 'Другое'
            ? passportData.citizenshipIso2
            : passportData.citizenship;

        const documentNumber = isRussian 
          ? `${passportData.series?.replace(/\s/g,'') || ''}${passportData.number || ''}`.trim()
          : passportData.number?.trim()

        const issuedAt = passportData.issueDate 
          ? `${passportData.issueDate.slice(6,10)}-${passportData.issueDate.slice(3,5)}-${passportData.issueDate.slice(0,2)}`
          : null

        const passportPayload = {
          citizenshipIso2,
          citizenshipIso3: passportData.citizenshipIso3, // всегда обязателен
          documentNumber,
          issuedAt,
          issuedBy: passportData.issuedBy?.trim()
        };




        // Отладка
        console.log('Отправляемые паспортные данные:', passportPayload)

        // Проверка перед отправкой
        if (!citizenshipIso2) throw new Error('Не указан код страны')
        if (!documentNumber) throw new Error('Не указан номер документа')
        if (!issuedAt) throw new Error('Не указана дата выдачи')
        if (!passportPayload.issuedBy) throw new Error('Не указано кем выдан')

        await apiClient.put('/executors/individuals/me/passport', passportPayload)

        // Файлы — только после успеха
        if (passportData.scanPages?.length > 0 || passportData.scanRegistration?.length > 0) {
          const fd = new FormData()
          if (passportData.scanPages?.length > 0) fd.append('mainPage', passportData.scanPages[0])
          if (passportData.scanRegistration?.length > 0) fd.append('registrationPage', passportData.scanRegistration[0])

          console.log('Отправка сканов с citizenshipIso2:', citizenshipIso2)
          await apiClient.post('/executors/individuals/me/passport/scans', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
            params: { citizenshipIso2 }
          })
        }
      }

      setStepNumber(stepNumber + 1)
      navigate('/full_registration_step4')
    } catch (err) {
      let msg = 'Ошибка сохранения данных'

      if (err.response) {
        // Сервер вернул ответ с ошибкой
        const status = err.response.status
        const serverMsg = err.response.data?.message || err.response.data?.error || 'Нет сообщения от сервера'

        console.log('Сервер ответил ошибкой:', { status, message: serverMsg, data: err.response.data })

        if (status === 400) msg = `Неверные данные: ${serverMsg}`
        else if (status === 403) msg = 'Доступ запрещён (403). Пользователь не является физлицом?'
        else if (status === 404) msg = 'Ресурс не найден (404). Возможно, профиль не создан'
        else if (status === 409) msg = 'Конфликт (409). Возможно, данные уже завершены'
        else msg = `Ошибка ${status}: ${serverMsg}`
      } else if (err.request) {
        // Запрос отправлен, но нет ответа
        msg = 'Нет ответа от сервера. Проверьте интернет или сервер'
      } else {
        msg = `Ошибка клиента: ${err.message}`
      }

      setErrorMessage(msg)
      console.error('Полная ошибка:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Header hideElements={true}/>
      <div className='reg-container'>
        <div className='registr-container' style={{ height: userLawSubject === 'legal_entity' ? '610px' : 'auto', paddingBottom: '170px', position: 'relative' }}>

          <div className='title'>
            <button className='btn-back' onClick={handleBack}>
              <img src={arrow} alt='Назад'/>
            </button>
            <h2 className="login-title">Полная регистрация</h2>
          </div>

          <div className='registr-scale'>
            <p>3/6</p>
            <img src={scale} alt='Registration scale' style={{width: '650px'}}/>
          </div>

          {/* паспортные данные для ИП и СЗ */}
          {userLawSubject !== 'legal_entity' && (
            <div className='passport-details'>
              <h2>Паспортные данные:</h2>

              <h3>Гражданство</h3>
              <div className='country-selection'>
                <div className='radio-group'>
                  {citizenshipOptions.map((option, i) => (
                    <div key={i} className="radio-option">
                      <input 
                        type="radio" 
                        id={`cit-${i}`} 
                        name="citizenship" 
                        value={option} 
                        checked={passportData.citizenship === option} 
                        onChange={() => {
                          setPassportData(prev => ({
                            ...prev,
                            citizenship: option,
                            series: '',             
                            number: '',              
                            issuedBy: '',           
                            issueDate: '',           
                            scanPages: [],           
                            scanRegistration: [],    
                            otherCountry: option === 'Другое' ? prev.otherCountry : '',
                            cisCountry: ''
                          }));
                        }}

                      />
                      <label htmlFor={`cit-${i}`}>
                        {option === 'RU' ? 'Российская Федерация' : option === 'KZ' ? 'Казахстан' : 'Другое'}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Если "Другое" — показываем RegistrSelector */}
                {passportData.citizenship === 'Другое' && (
                  <div className="registr-selector-wrapper">
                    {countries.length === 0 ? (
                      <div>Загрузка стран...</div>
                    ) : (
                      <div className='passport-field' style={{marginTop: '-10px', width: '300px'}}>
                        <RegistrSelector 
                          placeholder={'Выберите страну'}
                          subject={countries.map(c => c.name_ru)}
                          selected={[passportData.otherCountry].filter(Boolean)}
                          onSelect={(selectedNames) => {
                            const selected = countries.find(c => c.name_ru === selectedNames[0]);
                            if (selected) {
                              setPassportData(prev => ({
                                ...prev,
                                otherCountry: selected.name_ru,
                                citizenship: 'Другое',
                                citizenshipIso2: selected.iso_code2,
                                citizenshipIso3: selected.iso_code3
                              }));

                            }
                          }}
                          multiple={false}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className='passport-fields-grid'>
                {isRussian ? (
                  <div className='passport-row'>
                    <div className='passport-field'>
                      <h3>Серия паспорта</h3>
                      <input ref={seriesRef} value={passportData.series||''} placeholder='00 00' maxLength={5} onChange={(e) => {
                        let value = e.target.value.replace(/\D/g,'').slice(0,4)
                        if (value.length > 2) value = value.slice(0,2) + ' ' + value.slice(2)
                        updatePassport('series', value)
                      }}/>
                    </div>
                    <div className='passport-field'>
                      <h3>Номер паспорта</h3>
                      <input value={passportData.number||''} placeholder='000000' maxLength={6} onChange={(e) => updatePassport('number', e.target.value.replace(/\D/g, ''))}/>
                    </div>
                    <div className='passport-field'>
                      <h3>Паспорт выдан</h3>
                      <input value={passportData.issuedBy||''} onChange={(e) => updatePassport('issuedBy', e.target.value)} placeholder='ГУ МВД России по г. Москве'/>
                    </div>
                    <div className='passport-field'>
                      <h3>Дата выдачи {dateError && <span style={{color:'#ff4444', marginLeft:'10px', fontSize: '16px'}}>{dateError}</span>}</h3>
                      <DatePicker value={passportData.issueDate||''} onChange={handleDateChange} placeholder="ДД.ММ.ГГГГ" error={!!dateError}/>
                    </div>
                  </div>
                ) : (
                  <div className='passport-row'>
                    <div className='passport-field full-width'>
                      <h3>Номер документа</h3>
                      <input ref={numberDocumentRef} value={passportData.number||''} placeholder='Введите номер документа' maxLength={20} onChange={(e) => updatePassport('number', e.target.value)}/>
                    </div>
                    <div className='passport-field full-width'>
                      <h3>Кем выдан</h3>
                      <input value={passportData.issuedBy||''} onChange={(e) => updatePassport('issuedBy', e.target.value)} />
                    </div>
                    <div className='passport-field full-width'>
                      <h3>Дата выдачи {dateError && <span style={{color:'#ff4444', marginLeft:'10px', fontSize: '18px'}}>{dateError}</span>}</h3>
                      <DatePicker value={passportData.issueDate||''} onChange={handleDateChange} placeholder="ДД.ММ.ГГГГ" error={!!dateError}/>
                    </div>
                  </div>
                )}

                {/* файлы */}
                <div className='passport-row'>
                  <div className='passport-field'>
                    <h3>Скан главного разворота</h3>
                    <FileUpload key={passportData.citizenship+'main'} onFilesUpload={(files)=>handleFileUpload('scanPages', files)} maxFiles={1}/>
                    { passportData.scanPages?.length < 1 && ( 
                      <p>Добавьте скан 2-3 страницы паспорта</p> 
                    )}
                  </div>
                  <div className='passport-field'>
                    <h3>Скан регистрации</h3>
                    <FileUpload key={passportData.citizenship+'reg'} onFilesUpload={(files)=>handleFileUpload('scanRegistration', files)} maxFiles={1}/>
                    { passportData.scanRegistration?.length < 1 && (
                      <p style={{width: '330px'}}>Добавьте скан актуальной регистрации — 5-7 страницы</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Юрлицо: телефон и ФИО директора */}
          {userLawSubject === 'legal_entity' && (
            <div className='passport-row'>
              <div className='passport-field full-width' style={{marginBottom: '-50px'}}>
                <h3>Номер телефона руководителя</h3>
                <PhoneNumber  ref={directorPhoneRef} value={directorData.phone} onChange={handleDirectorPhoneChange} />
              </div>
              <div className='passport-field full-width'>
                <h3>ФИО руководителя</h3>
                <input value={directorData.FIO||''} onChange={(e)=>handleDirectorFIOChange(e.target.value)} />
              </div>
            </div>
          )}

          <button 
            className={`continue-button ${!isFormValid || isLoading ? 'disabled' : ''}`} 
            disabled={!isFormValid || isLoading} 
            onClick={handleForward} 
            style={{position:'absolute', bottom:'27px', width:'714px'}}
        >
            {isLoading ? 'Сохранение...' : 'Продолжить'}
          </button>

        </div>
      </div>
      
      <Footer className='footer footer--registr'/>
    </div>
  )
}