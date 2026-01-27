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
  const { stepNumber, setStepNumber, userLawSubject, setUserLawSubject } = useAppContext()
  const innRef = useRef(null)

  const [formData, setFormData] = useState({
    INN: '',
    registrationDate: '',
    OGRNIP: '',
    registrationAddress: '',
    extractOGRNIP: [],
    registrationCertificate: [],
    OGRN: '',
    egrulExtract: [],
  })


  useEffect(() => {
  // Проверяем токен при загрузке компонента
  const token = localStorage.getItem('accessToken')
  console.log('Токен при загрузке компонента:', token ? 'присутствует' : 'отсутствует')
  
  if (!token || token === 'null' || token === 'undefined') {
    console.warn('Токен не найден или невалиден. Редирект на вход...')
    navigate('/enter')
  }
}, [navigate])

  const [dateError, setDateError] = useState('')
  const [isFormValid, setIsFormValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  // Функция очистки полей при смене типа
  const resetFormForType = (type) => {
    setFormData({
      INN: '',
      registrationDate: '',
      OGRNIP: type === 'ENTREPRENEUR' ? '' : [],
      registrationAddress: '',
      extractOGRNIP: type === 'ENTREPRENEUR' ? [] : [],
      registrationCertificate: type === 'SELF_EMPLOYED' ? [] : [],
      OGRN: type === 'legal_entity' ? '' : [],
      egrulExtract: type === 'legal_entity' ? [] : [],
    })
    setDateError('')
  }

  // Автофокус на первое поле
  useEffect(() => {
    setTimeout(() => innRef.current?.focus(), 100)
  }, [])

  // Установка ИП по умолчанию для физлиц и очистка при первом рендере
  useEffect(() => {
    if (!userLawSubject || userLawSubject === 'individual') {
      setUserLawSubject('ENTREPRENEUR')
      resetFormForType('ENTREPRENEUR')
    }
  }, []) // Только при монтировании

  // Очистка полей при смене типа исполнителя
  useEffect(() => {
    resetFormForType(userLawSubject)
    // Фокус на ИНН после смены типа
    setTimeout(() => innRef.current?.focus(), 100)
  }, [userLawSubject])

  // Валидация даты
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

  const handleDateChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0,8)
    let formatted = digits
    if (digits.length > 4) formatted = digits.slice(0,2) + '.' + digits.slice(2,4) + '.' + digits.slice(4,8)
    else if (digits.length > 2) formatted = digits.slice(0,2) + '.' + digits.slice(2)

    setFormData(prev => ({ ...prev, registrationDate: formatted }))

    if (formatted.length === 10) {
      setDateError(isValidDate(formatted) ? '' : 'Некорректная дата (год ≥ 1900, не в будущем)')
    } else {
      setDateError('')
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Валидация формы
  useEffect(() => {
    let valid = true

    const dateValid = formData.registrationDate.length === 10 && isValidDate(formData.registrationDate)
    const innDigits = formData.INN.replace(/\D/g, '')

    if (userLawSubject === 'ENTREPRENEUR') {
      valid = 
        innDigits.length === 12 &&
        formData.OGRNIP.replace(/\D/g, '').length === 15 &&
        dateValid &&
        formData.registrationAddress.trim().length >= 5 &&
        formData.extractOGRNIP.length > 0
    } else if (userLawSubject === 'SELF_EMPLOYED') {
      valid = 
        innDigits.length === 12 &&
        dateValid &&
        formData.registrationCertificate.length > 0
    } else if (userLawSubject === 'legal_entity') {
      valid = 
        innDigits.length === 10 &&
        formData.OGRN.replace(/\D/g, '').length === 13 &&
        dateValid &&
        formData.registrationAddress.trim().length >= 5 &&
        formData.egrulExtract.length > 0
    }

    setIsFormValid(valid)
  }, [formData, userLawSubject])





const handleForward = async () => {
  if (!isFormValid) return

  setIsLoading(true)
  setErrorMessage(null)

  try {
    const [day, month, year] = formData.registrationDate.split('.')
    const isoDate = `${year}-${month}-${day}`

    // Проверяем токен
    const token = localStorage.getItem('accessToken')
    if (!token || token === 'null' || token === 'undefined') {
      localStorage.removeItem('accessToken')
      throw new Error('Токен авторизации отсутствует. Пожалуйста, войдите заново.')
    }

    // Проверяем авторизацию
    try {
      await apiClient.get('/executors/me/profile')
    } catch (authErr) {
      if (authErr.response?.status === 401 || authErr.response?.status === 403) {
        localStorage.removeItem('accessToken')
        throw new Error('Ошибка авторизации. Пожалуйста, войдите заново.')
      }
      throw authErr
    }

    // Для физлиц: пробуем установить тип работы
    if (userLawSubject !== 'legal_entity') {
      const targetWorkType = 
        userLawSubject === 'individual_entrepreneur' ? 'ENTREPRENEUR' : 
        userLawSubject === 'self-employed' ? 'SELF_EMPLOYED' : null

      if (targetWorkType) {
        try {
          await apiClient.put('/executors/individuals/me/work-type', null, {
            params: { workType: targetWorkType }
          })
        } catch (typeErr) {
          // Игнорируем 409 (уже установлено) и 500 (ошибка на сервере)
          if (typeErr.response?.status !== 409 && typeErr.response?.status !== 500) {
            if (typeErr.response?.status === 401 || typeErr.response?.status === 403) {
              localStorage.removeItem('accessToken')
              throw new Error('Ошибка авторизации. Пожалуйста, войдите заново.')
            }
            throw typeErr
          }
        }
      }

      // Базовые данные для физлица
      try {
        await apiClient.patch('/executors/individuals/me/base-data', {
          inn: formData.INN,
          birthDate: isoDate
        })
      } catch (baseErr) {
        if (baseErr.response?.status === 401 || baseErr.response?.status === 403) {
          localStorage.removeItem('accessToken')
          throw new Error('Ошибка авторизации. Пожалуйста, войдите заново.')
        }
        throw baseErr
      }
    }

    // Обработка по типам пользователя
    if (userLawSubject === 'individual_entrepreneur') {
      // Данные ИП
      try {
        await apiClient.put('/executors/individuals/me/entrepreneur', {
          ogrnip: formData.OGRNIP,
          registrationDate: isoDate,
          registrationPlace: formData.registrationAddress
        })
      } catch (entrepreneurErr) {
        // Игнорируем 409 ошибки (возможно тип работы не установлен)
        if (entrepreneurErr.response?.status !== 409) {
          if (entrepreneurErr.response?.status === 401 || entrepreneurErr.response?.status === 403) {
            localStorage.removeItem('accessToken')
            throw new Error('Ошибка авторизации. Пожалуйста, войдите заново.')
          }
          throw entrepreneurErr
        }
      }

      // Файл ЕГРИП
      if (formData.extractOGRNIP.length > 0) {
        const fd = new FormData()
        fd.append('file', formData.extractOGRNIP[0])
        
        try {
          await apiClient.post('/executors/individuals/me/entrepreneur/egrip-extract', fd, {
            headers: { 
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          })
        } catch (fileErr) {
          if (fileErr.response?.status === 401 || fileErr.response?.status === 403) {
            localStorage.removeItem('accessToken')
            throw new Error('Ошибка авторизации при загрузке файла. Пожалуйста, войдите заново.')
          }
          throw new Error(`Не удалось загрузить файл ЕГРИП: ${fileErr.response?.data?.message || 'Ошибка сервера'}`)
        }
      }

    } else if (userLawSubject === 'self-employed') {
      // Данные самозанятого
      try {
        await apiClient.put('/executors/individuals/me/self-employed', {
          registrationDate: isoDate
        })
      } catch (selfErr) {
        // Игнорируем 409 ошибки
        if (selfErr.response?.status !== 409) {
          if (selfErr.response?.status === 401 || selfErr.response?.status === 403) {
            localStorage.removeItem('accessToken')
            throw new Error('Ошибка авторизации. Пожалуйста, войдите заново.')
          }
          throw selfErr
        }
      }

      // Файл справки
      if (formData.registrationCertificate.length > 0) {
        const fd = new FormData()
        fd.append('file', formData.registrationCertificate[0])
        
        try {
          await apiClient.post('/executors/individuals/me/self-employed/certificate', fd, {
            headers: { 
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          })
        } catch (certErr) {
          if (certErr.response?.status === 401 || certErr.response?.status === 403) {
            localStorage.removeItem('accessToken')
            throw new Error('Ошибка авторизации при загрузке файла. Пожалуйста, войдите заново.')
          }
          throw new Error(`Не удалось загрузить справку: ${certErr.response?.data?.message || 'Ошибка сервера'}`)
        }
      }

    } else if (userLawSubject === 'legal_entity') {
      // Данные юрлица
      try {
        await apiClient.patch('/executors/companies/me/data', {
          inn: formData.INN,
          ogrn: formData.OGRN,
          registrationDate: isoDate,
          registrationPlace: formData.registrationAddress.trim()
        })
      } catch (companyErr) {
        if (companyErr.response?.status === 401 || companyErr.response?.status === 403) {
          localStorage.removeItem('accessToken')
          throw new Error('Ошибка авторизации. Пожалуйста, войдите заново.')
        }
        throw new Error(`Не удалось сохранить данные юрлица: ${companyErr.response?.data?.message || 'Ошибка сервера'}`)
      }

      // Файл ЕГРЮЛ
      if (formData.egrulExtract.length > 0) {
        const fd = new FormData()
        fd.append('file', formData.egrulExtract[0])
        
        try {
          await apiClient.post('/executors/companies/me/egrul-extract', fd, {
            headers: { 
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          })
        } catch (egrulErr) {
          if (egrulErr.response?.status === 401 || egrulErr.response?.status === 403) {
            localStorage.removeItem('accessToken')
            throw new Error('Ошибка авторизации при загрузке файла. Пожалуйста, войдите заново.')
          }
          throw new Error(`Не удалось загрузить файл ЕГРЮЛ: ${egrulErr.response?.data?.message || 'Ошибка сервера'}`)
        }
      } else {
        throw new Error('Пожалуйста, загрузите выписку из ЕГРЮЛ')
      }
    }

    // Успешное завершение
    setStepNumber(stepNumber + 1)
    navigate('/full_registration_step3')

  } catch (err) {
    console.error('Ошибка при отправке данных:', err)
    
    // Формируем понятное сообщение об ошибке
    let msg = err.message || 'Ошибка сохранения данных'
    
    // Если это ошибка сети или сервера
    if (err.response?.status >= 500) {
      msg = 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.'
    } else if (err.response?.status === 400) {
      msg = 'Некорректные данные. Проверьте введенные значения.'
    } else if (err.response?.status === 409) {
      msg = 'Данные уже существуют или конфликтуют с текущим состоянием.'
    }

    setErrorMessage(msg)

  } finally {
    setIsLoading(false)
  }
}




  const handleBack = () => navigate('/full_registration_step1')

  return (
    <div>
      <Header hideElements={true}/>
      <div className='reg-container'>
        <div className='registr-container' style={{ height: 'auto', paddingBottom: '27px' }}>

          <div className='title'>
            <button className='btn-back' onClick={handleBack}>
              <img src={arrow} alt='Назад'/>
            </button>
            <h2 className="login-title">Полная регистрация</h2>
          </div>

          <div className='registr-scale'>
            <p>2/6</p>
            <img src={scale} alt='Registration scale' style={{width: '650px'}}/>
          </div>

          {/* Переключатель только для физлиц */}
          {userLawSubject !== 'legal_entity' && (
            <div className="role-switcher">
              <button 
                className={`role-option ${userLawSubject === 'ENTREPRENEUR' ? 'active' : ''}`} 
                onClick={() => setUserLawSubject('ENTREPRENEUR')}
              >
                ИП
              </button>
              <button 
                className={`role-option ${userLawSubject === 'SELF_EMPLOYED' ? 'active' : ''}`} 
                onClick={() => setUserLawSubject('SELF_EMPLOYED')}
              >
                Самозанятый
              </button>
            </div>
          )}

          <div className='passport-fields-grid' style={{marginTop:'30px'}}>
            {/* ИНН */}
            <div className='passport-row'>
              <div className='passport-field full-width'>
                <h3>ИНН <span style={{color:'#666', fontSize:'15px'}}>
                  ({userLawSubject === 'legal_entity' ? '10' : '12'} цифр)
                </span></h3>
                <input 
                  ref={innRef}
                  value={formData.INN} 
                  onChange={e => handleInputChange('INN', e.target.value.replace(/\D/g, '').slice(0, userLawSubject === 'legal_entity' ? 10 : 12))} 
                  placeholder={userLawSubject === 'legal_entity' ? '0000000000' : '000000000000'} 
                  maxLength={userLawSubject === 'legal_entity' ? 10 : 12}
                />
              </div>
            </div>

            {/* Поля ИП */}
            {userLawSubject === 'ENTREPRENEUR' && (
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
              </>
            )}

            {/* Поля юрлица */}
            {userLawSubject === 'legal_entity' && (
              <>
                <div className='passport-row'>
                  <div className='passport-field full-width'>
                    <h3>ОГРН <span style={{color:'#666', fontSize:'15px'}}>(13 цифр)</span></h3>
                    <input 
                      value={formData.OGRN} 
                      onChange={e => handleInputChange('OGRN', e.target.value.replace(/\D/g,'').slice(0,13))} 
                      placeholder='0000000000000' 
                      maxLength={13}
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
              </>
            )}

            {/* Дата регистрации */}
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

            {/* Файлы */}
            {userLawSubject === 'ENTREPRENEUR' && (
              <div className='passport-field'>
                <h3>Выписка из ЕГРИП</h3>
                <FileUpload 
                  onFilesUpload={files => handleInputChange('extractOGRNIP', files)} 
                  maxFiles={1}
                />
                <p>Добавьте скан документа</p>
              </div>
            )}

            {userLawSubject === 'SELF_EMPLOYED' && (
              <div className='passport-field'>
                <h3>Справка о постановке на учет (СЗ)</h3>
                <FileUpload 
                  onFilesUpload={files => handleInputChange('registrationCertificate', files)} 
                  maxFiles={1}
                />
                <p>Добавьте скан документа</p>
              </div>
            )}

            {userLawSubject === 'legal_entity' && (
              <div className='passport-field'>
                <h3>Выписка из ЕГРЮЛ</h3>
                <FileUpload 
                  onFilesUpload={files => handleInputChange('egrulExtract', files)} 
                  maxFiles={1}
                />
                <p>Добавьте скан документа</p>
              </div>
            )}
          </div>

          {errorMessage && (
            <div style={{ color: '#ff4444', margin: '15px 0', textAlign: 'center' }}>
              {errorMessage}
            </div>
          )}

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