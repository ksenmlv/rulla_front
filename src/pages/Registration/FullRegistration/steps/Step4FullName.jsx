import React, { useState } from 'react'
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
  const { stepNumber, setStepNumber, userLawSubject, setUserLawSubject, individualEntrepreneurData, setIndividualEntrepreneurData } = useAppContext()
  const [dateError, setDateError] = useState('')

  const handleIndividualEntrepreneurChange = (field, value) => {
    setIndividualEntrepreneurData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // обработчик для ФИО (только буквы и пробелы)
  const handleFIOChange = (e) => {
    let value = e.target.value
    // только буквы, пробелы и дефисы
    value = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, '')
    handleIndividualEntrepreneurChange('FIO', value)
  }

  // обработчик заполнения даты
  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 6) value = value.slice(0, 6)
    
    // форматирование с разделителями
    let formattedValue = value
    if (value.length > 4) {
      formattedValue = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4)
    } else if (value.length > 2) {
      formattedValue = value.slice(0, 2) + '.' + value.slice(2)
    }
    
    handleIndividualEntrepreneurChange('registrationDate', formattedValue)
    
    // валидация
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

  // обработчик для ИНН
  const handleINNChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 12) value = value.slice(0, 12)
    
    // Форматирование ИНН с пробелами
    let formattedValue = value
    if (value.length > 10) {
      formattedValue = value.slice(0, 2) + ' ' + value.slice(2, 5) + ' ' + value.slice(5, 9) + ' ' + value.slice(9)
    } else if (value.length > 5) {
      formattedValue = value.slice(0, 2) + ' ' + value.slice(2, 5) + ' ' + value.slice(5)
    } else if (value.length > 2) {
      formattedValue = value.slice(0, 2) + ' ' + value.slice(2)
    }
    
    handleIndividualEntrepreneurChange('INN', formattedValue)
  }

  // обработчик для ОГРНИП
  const handleOGRNIPChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 15) value = value.slice(0, 15)
    handleIndividualEntrepreneurChange('OGRNIP', value)
  }

  const handleFileUpload = (field, files) => {
    setIndividualEntrepreneurData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ...files]
    }))
  }   


  const handleBack = () => {
    navigate('/full_registration_step3')
  }

  const handleForward = () => {
    console.log(userLawSubject)
    setUserLawSubject({FIO: '', INN: '', OGRNIP: '', regustrationDate: '', extractOGRNIP: []})
    setStepNumber(stepNumber + 1)
    navigate('/full_registration_step5')
  }

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container'>
        <div className='registr-container' style={{minHeight: '1365px'}}>

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
            <LawSubjectSwitcher />

            {/* переключатель ИП/самозанятый */}
            <div className="role-switcher">
              <div className="role-slider"></div>
              
              <button
                className={`role-option ${userLawSubject === 'individual_entrepreneur' ? 'active' : ''}`}
                onClick={() => setUserLawSubject('individual_entrepreneur')}
              >
                ИП
              </button>
              
              <button
                className={`role-option ${userLawSubject === 'self-employed' ? 'active' : ''}`}
                onClick={() => setUserLawSubject('self-employed')}
              >
                Самозанятый
              </button>
            </div>

            {/* инпуты для ввода данных ИП */}
            <div className='passport-fields-grid' style={{marginTop:'30px'}}>
                <div className='passport-row'>
                    <div className='passport-field full-width'>
                        <h3>ФИО</h3>
                        <input 
                          value={individualEntrepreneurData.FIO || ''}
                          onChange={handleFIOChange}
                          placeholder='Введите ваше ФИО' 
                        />
                    </div>
                </div>

                <div className='passport-row'>
                    <div className='passport-field full-width'>
                        <h3>ИНН</h3>
                        <input 
                          value={individualEntrepreneurData.INN || ''}
                          onChange={handleINNChange}
                          placeholder='00 00 000000 00'
                          maxLength={15}
                        />
                    </div>
                </div>

                <div className='passport-row'>
                    <div className='passport-field full-width'>
                        <h3>ОГРНИП</h3>
                        <input 
                          value={individualEntrepreneurData.OGRNIP || ''}
                          onChange={handleOGRNIPChange}
                          placeholder='000000000000000'
                          maxLength={15}
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
                            value={individualEntrepreneurData.registrationDate || ''}
                            placeholder='00.00.00' 
                            maxLength={8}
                            onChange={handleDateChange}
                            className={dateError ? 'error' : ''}
                        />
                    </div>
                </div>

                <div className='passport-row'>
                    <div className='passport-field full-width'>
                        <h3>Место регистрации</h3>
                        <input 
                          value={individualEntrepreneurData.registrationPlace || ''}
                          onChange={(e) => handleIndividualEntrepreneurChange('registrationPlace', e.target.value)}
                          placeholder='Укажите место регистрации' 
                        />
                    </div>
                </div>

                <div className='passport-field' style={{marginTop: '10px'}}>
                  <h3>Выписка из ЕГРИП</h3>
                  <FileUpload onFilesUpload={(files) => handleFileUpload('extractOGRNIP', files)} maxFiles/>
                  <p>Добавьте скан документа</p>
                </div>
            </div>

            <button 
                type="submit" 
                className='continue-button'
                onClick={handleForward}
                style={{marginTop: '50px'}}
            >
                Продолжить
            </button>

        </div>
      </div>

      <Footer className='footer footer--registr' />
    </div>
  )
}