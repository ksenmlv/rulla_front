import '../../Registration.css'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import DatePicker from '../../common/Calendar/DatePicker'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import FileUpload from '../../common/FileUpload'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale2.svg'
import apiClient from '../../../../api/client'

export default function Step2FullName() {
  const navigate = useNavigate()
  const { stepNumber, setStepNumber } = useAppContext()

  // Временное состояние формы (только до отправки)
  const [formData, setFormData] = useState({
    FIO: '',
    INN: '',
    registrationDate: '',
    OGRNIP: '',
    registrationAddress: '',
    extractOGRNIP: [], // файлы
    registrationCertificate: [], // файлы
  })

  const [dateError, setDateError] = useState('')
  const [isFormValid, setIsFormValid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const fioInputRef = useRef(null)

  const [userLawSubject, setUserLawSubject] = useState('individual_entrepreneur') // по умолчанию ИП
  const showIPSelfSwitcher = userLawSubject !== 'legal_entity'

  // Загрузка данных с сервера
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)
        setErrorMessage(null)

        const profileRes = await apiClient.get('/executors/me/profile')
        const profile = profileRes.data

        // Определяем тип работы
        const workType = profile.individual?.workType || 'ENTREPRENEUR'
        const newType = workType === 'SELF_EMPLOYED' ? 'self-employed' : 'individual_entrepreneur'
        setUserLawSubject(newType)

        // Базовые данные
        const individual = profile.individual || {}
        const fio = [individual.lastName, individual.firstName, individual.middleName]
          .filter(Boolean)
          .join(' ')

        // Дата из ISO → ДД.ММ.ГГГГ
        let regDate = ''
        if (individual.birthDate) {
          const date = new Date(individual.birthDate)
          regDate = `${date.getDate().toString().padStart(2,'0')}.${(date.getMonth()+1).toString().padStart(2,'0')}.${date.getFullYear()}`
        }

        // Специфические данные
        setFormData({
          FIO: fio || '',
          INN: individual.inn || '',
          registrationDate: regDate,
          OGRNIP: profile.individual?.entrepreneur?.ogrnip || '',
          registrationAddress: profile.individual?.entrepreneur?.registrationPlace || '',
          extractOGRNIP: [], // новые файлы
          registrationCertificate: [], // новые файлы
        })
      } catch (err) {
        const msg = err.response?.data?.message || 'Не удалось загрузить профиль'
        setErrorMessage(msg)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  // Автофокус
  useEffect(() => {
    setTimeout(() => fioInputRef.current?.focus(), 100)
  }, [])

  // Валидация ввода
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Валидация даты (год 4 цифры, строгая проверка)
  const isValidDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 10) return false
    const digits = dateStr.replace(/\D/g, '')
    if (digits.length !== 8) return false

    const day = parseInt(digits.slice(0,2))
    const month = parseInt(digits.slice(2,4))
    const year = parseInt(digits.slice(4,8))

    if (year < 1900) return false

    const date = new Date(year, month - 1, day)
    const today = new Date()

    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year &&
      date <= today
    )
  }

  // Обработчик даты (маска ДД.ММ.ГГГГ)
  const handleDateChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0,8)
    let formatted = digits
    if (digits.length > 4) {
      formatted = digits.slice(0,2) + '.' + digits.slice(2,4) + '.' + digits.slice(4,8)
    } else if (digits.length > 2) {
      formatted = digits.slice(0,2) + '.' + digits.slice(2)
    }

    setFormData(prev => ({ ...prev, registrationDate: formatted }))

    if (formatted.length === 10) {
      setDateError(isValidDate(formatted) ? '' : 'Некорректная дата (год ≥ 1900, не в будущем)')
    } else {
      setDateError('')
    }
  }

  // Валидация всей формы
  useEffect(() => {
    let valid = true

    if (userLawSubject === 'individual_entrepreneur') {
      valid = 
        formData.FIO.trim().length >= 5 &&
        formData.INN.replace(/\D/g, '').length === 12 &&
        formData.OGRNIP.replace(/\D/g, '').length === 15 &&
        formData.registrationDate.length === 10 &&
        isValidDate(formData.registrationDate) && // ← строгая проверка даты
        formData.registrationAddress.trim().length >= 5 &&
        formData.extractOGRNIP.length > 0
    } else if (userLawSubject === 'self-employed') {
      valid = 
        formData.FIO.trim().length >= 5 &&
        formData.INN.replace(/\D/g, '').length === 12 &&
        formData.registrationDate.length === 10 &&
        isValidDate(formData.registrationDate) && // ← строгая проверка даты
        formData.registrationCertificate.length > 0
    }

    setIsFormValid(valid)
  }, [formData, userLawSubject])

  // Обработчики ввода
  const handleFIOChange = e => {
    const val = e.target.value.replace(/[^а-яА-ЯёЁa-zA-Z\s-]/g, '')
    setFormData(prev => ({ ...prev, FIO: val }))
  }

  const handleINNChange = e => {
    const val = e.target.value.replace(/\D/g, '')
    const max = userLawSubject === 'individual_entrepreneur' ? 12 : 10
    setFormData(prev => ({ ...prev, INN: val.slice(0, max) }))
  }

  // Переключение ИП/Самозанятый
  const handleIPSelfSwitch = (type) => {
    setUserLawSubject(type)
    setFormData(prev => ({
      ...prev,
      OGRNIP: type === 'individual_entrepreneur' ? prev.OGRNIP : '',
      registrationAddress: type === 'individual_entrepreneur' ? prev.registrationAddress : '',
      extractOGRNIP: type === 'individual_entrepreneur' ? prev.extractOGRNIP : [],
      registrationCertificate: type === 'self-employed' ? prev.registrationCertificate : []
    }))
  }

  const handleForward = async () => {
    if (!isFormValid) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      // 1. Тип работы
      await apiClient.put('/executors/individuals/me/work-type', {
        workType: userLawSubject === 'individual_entrepreneur' ? 'ENTREPRENEUR' : 'SELF_EMPLOYED'
      })

      // 2. Базовые данные
      const [day, month, year] = formData.registrationDate.split('.')
      const isoDate = `${year}-${month}-${day}`

      const basePayload = {
        lastName: formData.FIO.split(' ')[0] || '',
        firstName: formData.FIO.split(' ')[1] || '',
        middleName: formData.FIO.split(' ')[2] || '',
        inn: formData.INN,
        birthDate: isoDate
      }
      await apiClient.patch('/executors/individuals/me/base-data', basePayload)

      // 3. Специфические данные
      if (userLawSubject === 'individual_entrepreneur') {
        await apiClient.put('/executors/individuals/me/entrepreneur', {
          ogrnip: formData.OGRNIP,
          registrationDate: isoDate,
          registrationPlace: formData.registrationAddress
        })

        if (formData.extractOGRNIP.length > 0) {
          const fd = new FormData()
          fd.append('file', formData.extractOGRNIP[0])
          await apiClient.post('/executors/individuals/me/entrepreneur/egrip-extract', fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        }
      } else if (userLawSubject === 'self-employed') {
        await apiClient.put('/executors/individuals/me/self-employed', {
          registrationDate: isoDate
        })

        if (formData.registrationCertificate.length > 0) {
          const fd = new FormData()
          fd.append('file', formData.registrationCertificate[0])
          await apiClient.post('/executors/individuals/me/self-employed/certificate', fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        }
      }

      setStepNumber(stepNumber + 1)
      navigate('/full_registration_step3')
    } catch (err) {
      const msg = err.response?.data?.message || 'Ошибка сохранения данных'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => navigate('/full_registration_step1')

  if (isLoading) return <div className="loading">Загрузка профиля...</div>

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

          {showIPSelfSwitcher && (
            <div className="role-switcher">
              <button 
                className={`role-option ${userLawSubject==='individual_entrepreneur'?'active':''}`} 
                onClick={() => handleIPSelfSwitch('individual_entrepreneur')}
              >
                ИП
              </button>
              <button 
                className={`role-option ${userLawSubject==='self-employed'?'active':''}`} 
                onClick={() => handleIPSelfSwitch('self-employed')}
              >
                Самозанятый
              </button>
            </div>
          )}

          <div className='passport-fields-grid' style={{marginTop:'30px'}}><div className='passport-row'>
              <div className='passport-field full-width'>
                <h3>ИНН <span style={{color:'#666', fontSize:'15px'}}>(12 цифр)</span></h3>
                <input 
                  value={formData.INN} 
                  onChange={handleINNChange} 
                  placeholder='00 00 000000 00' 
                  maxLength={12}
                />
              </div>
            </div>

            {userLawSubject === 'individual_entrepreneur' && (
              <>
                <div className='passport-row'>
                  <div className='passport-field full-width'>
                    <h3>ОГРНИП <span style={{color:'#666', fontSize:'15px'}}>(15 цифр)</span></h3>
                    <input 
                      value={formData.OGRNIP} 
                      onChange={e => handleInputChange('OGRNIP', e.target.value.replace(/\D/g,'').slice(0,15))} 
                      placeholder='000000000000000' 
                      maxLength={15}
                    />
                  </div>
                </div>

                <div className='passport-row'>
                  <div className='passport-field full-width'>
                    <h3>Адрес регистрации</h3>
                    <input 
                      value={formData.registrationAddress} 
                      onChange={e => handleInputChange('registrationAddress', e.target.value)} 
                      placeholder='Укажите адрес регистрации'
                    />
                  </div>
                </div>

                <div className='passport-field'>
                  <h3>Выписка из ЕГРИП</h3>
                  <FileUpload 
                    onFilesUpload={files => setFormData(prev => ({ ...prev, extractOGRNIP: files }))} 
                    maxFiles={1}
                  />
                  <p>Добавьте скан документа</p>
                </div>
              </>
            )}

            <div className='passport-row'>
              <div className='passport-field full-width'>
                <h3>Дата регистрации {dateError && <span style={{color:'#ff4444', marginLeft:'10px', fontSize: '16px'}}>{dateError}</span>}</h3>
                <DatePicker 
                  value={formData.registrationDate} 
                  onChange={handleDateChange} 
                  placeholder='ДД.ММ.ГГГГ' 
                  error={!!dateError}
                />
              </div>
            </div>

            {userLawSubject === 'self-employed' && (
              <div className='passport-field'>
                <h3>Справка о постановке на учет (СЗ)</h3>
                <FileUpload 
                  onFilesUpload={files => setFormData(prev => ({ ...prev, registrationCertificate: files }))} 
                  maxFiles={1}
                />
                <p>Добавьте скан документа</p>
              </div>
            )}
          </div>

          <button 
            className={`continue-button ${!isFormValid || isLoading ? 'disabled' : ''}`} 
            disabled={!isFormValid || isLoading} 
            onClick={handleForward} 
            style={{marginTop:'50px'}}
          >
            {isLoading ? 'Сохранение...' : 'Продолжить'}
          </button>
        </div>
      </div>

      <Footer className='footer footer--registr'/>
    </div>
  )
}