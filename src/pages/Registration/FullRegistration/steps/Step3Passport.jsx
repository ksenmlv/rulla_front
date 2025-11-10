import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import FileUpload from '../../common/FileUpload'
import '../../Registration.css'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale3.svg'



export default function Step3Passport() {
  const navigate = useNavigate()
  const { stepNumber, setStepNumber, passportData, setPassportData } = useAppContext()
  const citizenship = ['Российская федерация', 'Страны СНГ', 'Другое']
  const [isFormValid, setIsFormValid] = useState(false)
  const [dateError, setDateError] = useState('')

  // Определяем, является ли выбранное гражданство РФ
  const isRussianCitizenship = passportData.citizenship === 'Российская федерация'

  // валидация всей формы
  useEffect(() => {
    const validateForm = () => {
      const requiredFields = [
        passportData.citizenship,
        passportData.number,
        passportData.issuedBy,
        passportData.issueDate
      ]

      // Для не-РФ добавляем серию в обязательные поля
      if (!isRussianCitizenship) {
        requiredFields.push(passportData.series)
      }

      const areFieldsFilled = requiredFields.every(field => field && field.trim().length > 0)
      const hasScanMain = passportData.scanMain && passportData.scanMain.length > 0
      const hasScanRegistration = passportData.scanRegistration && passportData.scanRegistration.length > 0
      
      // Если выбрано "Другое" - проверяем поле otherCountry
      const isOtherCountryValid = passportData.citizenship !== 'Другое' || 
                                 (passportData.otherCountry && passportData.otherCountry.trim().length > 0)

      setIsFormValid(areFieldsFilled && isOtherCountryValid && hasScanMain && hasScanRegistration)
    }

    validateForm()
  }, [passportData, isRussianCitizenship])

  const handlePassportChange = (field, value) => {
    setPassportData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // обработчик выбора пункта гражданства
  const handleCountryChange = (country) => {
    handlePassportChange('citizenship', country)
    // очистка поля ввода при выборе РФ
    if (country === 'Российская федерация') {
      handlePassportChange('otherCountry', '')
    }
  }

  // обработчик загрузки файлов
  const handleFileUpload = (field, files) => {
    setPassportData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ...files]
    }))
  }   

  // обработчик заполнения серии паспорта
  const handleSeriesChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 4) value = value.slice(0, 4)
    if (value.length > 2) {
      value = value.slice(0, 2) + ' ' + value.slice(2)
    }
    handlePassportChange('series', value)
  }

  // обработчик заполнения номера паспорта
  const handleNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 6) value = value.slice(0, 6)
    handlePassportChange('number', value)
  }

  // обработчик заполнения даты выдачи паспорта
const handleDateChange = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value.length > 6) value = value.slice(0, 6)
  
  // Форматирование с разделителями
  let formattedValue = value
  if (value.length > 4) {
    formattedValue = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4)
  } else if (value.length > 2) {
    formattedValue = value.slice(0, 2) + '.' + value.slice(2)
  }
  
  handlePassportChange('issueDate', formattedValue)
  
  // валидация
  if (value.length === 6) {
    const day = parseInt(value.slice(0, 2))
    const month = parseInt(value.slice(2, 4))
    const year = parseInt('20' + value.slice(4, 6))
    const date = new Date(year, month - 1, day)
    const today = new Date()
    
    if ((date > today) || (date.getDate() !== day || date.getMonth() !== month - 1)) {
      setDateError('Некорректная дата')
    } else {
      setDateError('')
    }
  } else {
    setDateError('')
  }
}

  const handleBack = () => {
    navigate('/full_registration_step2')
  }

  const handleForward = () => {
    console.log(passportData)

    setPassportData({
        citizenship: '',
        otherCountry: '', 
        series: '',
        number: '',
        issuedBy: '',
        issueDate: '',
        scanPages: [],
        scanRegistration: []
    })


    setStepNumber(stepNumber + 1)
    navigate('/full_registration_step4')
  }

  // Вычисляем высоту контейнера в зависимости от гражданства
  const containerHeight = isRussianCitizenship ? '1120px' : '1365px'

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container'>
        <div className='registr-container' style={{minHeight: containerHeight, position:'relative'}}>

          <div className='title'>
            <button className='btn-back' onClick={handleBack}>
              <img src={arrow} alt='Назад' />
            </button>
            <h2 className="login-title">Полная регистрация</h2>
          </div>

          <div className='registr-scale'>
            <p>3/7</p>
            <img src={scale} alt='Registration scale' />
          </div>

          <div className='passport-details'>
            <h2>Паспортные данные:</h2>

            <h3>Гражданство</h3>

            {/* выбор страны */}
            <div className='country-selection'>
              <div className='radio-group'>
                {citizenship.map((region, index) => (
                  <div key={index} className="radio-option">
                    <input
                      type="radio"
                      id={`country-${index}`}
                      name="country"
                      value={region}
                      checked={passportData.citizenship === region}
                      onChange={() => handleCountryChange(region)}
                    />
                    <label htmlFor={`country-${index}`}>
                      {region}
                    </label>
                  </div>
                ))}
              </div>

              {/* инпут для ввода страны - СКРЫВАЕМ ДЛЯ РФ */}
              {!isRussianCitizenship && (
                <div className="country-input-container">
                  <textarea
                    className="country-input"
                    placeholder={
                      passportData.citizenship === 'Страны СНГ'
                      ? 'Введите название страны СНГ'
                      : 'Введите название страны'
                    }
                    value={passportData.otherCountry || ''}
                    onChange={(e) => handlePassportChange('otherCountry', e.target.value)}
                    disabled={!passportData.citizenship}
                  />
                </div>
              )}
            </div>

            {/* паспортные данные */}
            <div className='passport-fields-grid'>
              
              {/* Для РФ показываем 4 поля */}
              {isRussianCitizenship ? (
                <>
                  <div className='passport-row'>
                    <div className='passport-field'>
                      <h3>Серия паспорта</h3>
                      <input 
                        value={passportData.series || ''} 
                        placeholder='00 00' 
                        maxLength={5}
                        onChange={handleSeriesChange}
                      />
                    </div>
                    
                    <div className='passport-field'>
                      <h3>Номер паспорта</h3>
                      <input 
                        value={passportData.number || ''}
                        placeholder='000000' 
                        maxLength={6}
                        onChange={handleNumberChange}
                      />
                    </div>
                  </div>
                  
                  <div className='passport-row'>
                    <div className='passport-field'>
                      <h3>Паспорт выдан</h3>
                      <input 
                        value={passportData.issuedBy || ''}
                        onChange={(e) => handlePassportChange('issuedBy', e.target.value)}
                        placeholder='ГУ МВД России по г. Москве' 
                      />
                    </div>
                    
                    <div className='passport-field'>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h3>Дата выдачи</h3>
                            {dateError && (
                                <span style={{ 
                                    color: '#ff4444', 
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    marginLeft: '15px',
                                    marginBottom: '10px'
                                }}>
                                    {dateError}
                                </span>
                            )}
                        </div>
                        <input 
                            value={passportData.issueDate || ''}
                            placeholder='00.00.00' 
                            maxLength={8}
                            onChange={handleDateChange}
                            className={dateError ? 'error' : ''}
                        />
                    </div>
                  </div>
                </>
              ) : (
                /* Для не-РФ показываем 3 поля */
                <div className='passport-row'>
                    <div className='passport-field full-width'>
                      <h3>Номер документа</h3>
                      <input 
                        value={passportData.number || ''}
                        placeholder='Введите номер документа' 
                        maxLength={6}
                        onChange={handleNumberChange}
                      />
                    </div>
                  
                    <div className='passport-field full-width'>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h3>Дата выдачи</h3>
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
                            value={passportData.issueDate || ''}
                            placeholder='00.00.00' 
                            maxLength={8}
                            onChange={handleDateChange}
                            className={dateError ? 'error' : ''}
                        />
                    </div>
                    
                    <div className='passport-field full-width'>
                      <h3>Кем выдан</h3>
                      <input 
                        value={passportData.issuedBy || ''}
                        onChange={(e) => handlePassportChange('issuedBy', e.target.value)}
                        placeholder='Кем выдан' 
                      />
                    </div>
                </div>
              )}

              <div className='passport-row'>
                <div className='passport-field'>
                  <h3>Скан главного разворота</h3>
                  <FileUpload onFilesUpload={(files) => handleFileUpload('scanMain', files)} maxFiles={2}/>
                  <p>Добавьте скан 2-3 страницы паспорта</p>
                </div>
                
                <div className='passport-field'>
                  <h3>Скан регистрации</h3>
                  <FileUpload onFilesUpload={(files) => handleFileUpload('scanRegistration', files)} maxFiles={1}/>
                  <p>Добавьте скан 5 страницы паспорта</p>
                </div>
              </div>

            </div>
          </div>

          <button 
            type="submit" 
            className={`continue-button ${!isFormValid ? 'disabled' : ''}`} 
            onClick={handleForward}
            disabled={!isFormValid}
            style={{position:'absolute', bottom:'15px', width:'714px'}}
          >
            Продолжить
          </button>

        </div>
      </div>

      <Footer className='footer footer--registr' />
    </div>
  )
}