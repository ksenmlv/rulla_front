import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../contexts/AppContext'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { PhoneInput } from 'react-international-phone'
import arrow from '../../assets/Main/arrow_left.svg'
import apiClient from '../../api/client' 
import 'react-international-phone/style.css'
import '../Enter/Enter.css'


function Enter() {
  const navigate = useNavigate()
  const inputRef = useRef()

  const {
    phoneNumber, setPhoneNumber,
    userEmail, setUserEmail,
    smsCode, setSmsCode,
    // поля профиля после входа заказчика
    setUserId,
    setUserPhone,
    setFirstName,
    setLastName,
    setRegStatus,
  } = useAppContext()

  const [activeRole, setActiveRole] = useState('customer')        // customer = заказчик, executor = исполнитель
  const [step, setStep] = useState(1)

  // для заказчика 
  const [customerPhone, setCustomerPhone] = useState('')          // полный номер с +
  const [countryCode, setCountryCode] = useState('7')
  const [phoneNumberOnly, setPhoneNumberOnly] = useState('')      // только 10 цифр
  const [isCustomerPhoneValid, setIsCustomerPhoneValid] = useState(false)
  const [customerCode, setCustomerCode] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)

  // модальное окно с ошибкой
  const [errorModal, setErrorModal] = useState('')                // текст ошибки или пустая строка

  // для исполнителя (старая локальная логика)
  const [isValidContact, setIsValidContact] = useState(false)

  const validateContact = (value) => {
    const digits = value.replace(/\D/g, '')
    const isPhone = digits.length > 10
    const isEmail = /^[\w.-]+@[\w.-]+\.\w+$/.test(value)
    return { isPhone, isEmail }
  }

  const handleContactInput = (value) => {
    const { isPhone, isEmail } = validateContact(value)

    if (isPhone) {
      setPhoneNumber(value)
      setUserEmail('')
      setIsValidContact(true)
    } else if (isEmail) {
      setUserEmail(value)
      setPhoneNumber('')
      setIsValidContact(true)
    } else {
      setIsValidContact(false)
    }
  }

  const executorCodeArray = Array.isArray(smsCode) ? smsCode : ['', '', '', '']
  const isExecutorCodeComplete = executorCodeArray.every(d => d !== '')

  const handleExecutorCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const updated = [...executorCodeArray]
      updated[index] = value
      setSmsCode(updated)

      if (value && index < 3) {
        document.getElementById(`code-${index + 1}`)?.focus()
      }
    }
  }

  const handleExecutorKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !executorCodeArray[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus()
    }
  }

  // таймер повторной отправки для заказчика (60 секунд)
  const [canResend, setCanResend] = useState(true)
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  // запрос sms-кода для заказчика
  const requestCustomerCode = async () => {
    setIsLoading(true)
    setErrorModal('')

    try {
      const response = await apiClient.post('/customers/auth/phone/code', {
        countryCode,
        phoneNumber: phoneNumberOnly,
      })

      console.log('dev sms code:', response.data)

      // успех — 204 
      setStep(2)
      setCanResend(false)
      setResendTimer(60)
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка отправки кода'
      setErrorModal(message)
    } finally {
      setIsLoading(false)
    }
  }

  // подтверждение кода и вход заказчика
  const verifyCustomerCode = async () => {
    setIsLoading(true)
    setErrorModal('')

    const fullCode = customerCode.join('')

    try {
      const response = await apiClient.post('/customers/auth/phone/verify', {
        countryCode,
        phoneNumber: phoneNumberOnly,
        code: fullCode,
      })

      if (response.ok) {
        await loadCustomerProfile()
        navigate('/')
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Неверный код'
      setErrorModal(message)
      setCustomerCode(['', '', '', ''])
    } finally {
      setIsLoading(false)
    }
  }

  // загрузка профиля после успешного входа заказчика
  const loadCustomerProfile = async () => {
    try {
      const response = await apiClient.get('/customers/me/profile')
      const profile = response.data

      setUserId(profile.userId || '')
      setUserPhone(profile.phone || customerPhone)
      setFirstName(profile.firstName || '')
      setLastName(profile.lastName || '')
      setRegStatus(profile.regStatus || '')
    } catch (err) {
      console.error('Не удалось загрузить профиль')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (activeRole === 'customer') {
      if (step === 1 && isCustomerPhoneValid) {
        requestCustomerCode()
      } else if (step === 2 && customerCode.every(d => d !== '')) {
        verifyCustomerCode()
      }
    } else {
      if (step === 1 && isValidContact) {
        setStep(2)
      } else if (step === 2 && isExecutorCodeComplete) {
        setPhoneNumber('')
        setUserEmail('')
        setSmsCode(['', '', '', ''])
        alert('Успешный вход (исполнитель)')
        navigate('/')
      }
    }
  }

  const handleBack = () => {
    if (step === 2) {
      if (activeRole === 'customer') {
        setCustomerCode(['', '', '', ''])
      } else {
        setSmsCode(['', '', '', ''])
      }
      setStep(1)
      setErrorModal('')
      return
    }
    navigate('/')
  }

  const handleResend = () => {
    if (activeRole === 'customer' && canResend && !isLoading) {
      requestCustomerCode()
    }
  }

  const isContinueDisabled =
    isLoading ||
    (activeRole === 'customer'
      ? (step === 1 ? !isCustomerPhoneValid : !customerCode.every(d => d !== ''))
      : (step === 1 ? !isValidContact : !isExecutorCodeComplete))

  return (
    <div className='layout'>
      <Header hideElements={true} />

      <div className='enter-container' style={{ marginBottom: '240px' }}>
        <div className='login-container'>
          <div className='title'>
            <button className='btn-back' onClick={handleBack}>
              <img src={arrow} alt='Назад' />
            </button>
            <h2 className='login-title'>Вход</h2>
          </div>

          {/* Выбор роли */}
          {step === 1 && (
            <div className='role-buttons'>
              <button
                className={`role-button ${activeRole === 'customer' ? 'active' : ''}`}
                onClick={() => {
                  setActiveRole('customer')
                  setUserEmail('')
                  setPhoneNumber('')
                  setIsValidContact(false)
                }}
              >
                Я заказчик
              </button>
              <button
                className={`role-button ${activeRole === 'executor' ? 'active' : ''}`}
                onClick={() => {
                  setActiveRole('executor')
                  setPhoneNumber('')
                  setUserEmail('')
                }}
              >
                Я исполнитель
              </button>
            </div>
          )}

          <form className='login-form' onSubmit={handleSubmit}>
            {/* Шаг 1 — ввод контакта */}
            {step === 1 && (
              <div className='form-group'>
                <label className='form-label'>
                  {activeRole === 'customer' ? 'Номер телефона' : 'Номер телефона или почта'}
                </label>

                {activeRole === 'customer' ? (
                  <PhoneInput
                    value={customerPhone}
                    onChange={(value, meta) => {
                      setCustomerPhone(value)

                      const raw = value.replace(/\D/g, '')
                      const dialCode = meta.dialCode || '7'
                      const numberWithoutCountry = raw.startsWith(dialCode)
                        ? raw.slice(dialCode.length)
                        : raw

                      setPhoneNumberOnly(numberWithoutCountry)
                      setCountryCode(meta.dialCode || '7')

                      setIsCustomerPhoneValid(numberWithoutCountry.length === 10)
                    }}
                    ref={inputRef}
                    defaultCountry='ru'
                    international
                    countryCallingCodeEditable={false}
                    inputClassName='custom-phone-input'
                    countrySelectorStyleProps={{ buttonClassName: 'country-selector-button' }}
                    forceDialCode={true}
                  />
                ) : (
                  <input
                    type='text'
                    value={phoneNumber || userEmail}
                    onChange={(e) => handleContactInput(e.target.value)}
                    placeholder='Введите номер телефона или email'
                    className='custom-phone-input'
                    style={{ paddingLeft: '12px' }}
                  />
                )}
              </div>
            )}

            {/* Шаг 2 — ввод кода */}
            {step === 2 && (
              <div className='form-group'>
                <label className='form-label'>
                  Код из {activeRole === 'customer' ? 'SMS' : userEmail ? 'Email' : 'SMS'}
                  <div className='phone-preview'>
                    Код отправлен на:{' '}
                    {activeRole === 'customer' ? customerPhone : userEmail || phoneNumber}
                  </div>
                </label>

                <div className='code-inputs'>
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      id={`code-${i}`}
                      type='text'
                      maxLength='1'
                      value={activeRole === 'customer' ? customerCode[i] : executorCodeArray[i]}
                      onChange={(e) => {
                        if (activeRole === 'customer') {
                          const newCode = [...customerCode]
                          newCode[i] = e.target.value
                          setCustomerCode(newCode)
                          if (e.target.value && i < 3) {
                            document.getElementById(`code-${i + 1}`)?.focus()
                          }
                        } else {
                          handleExecutorCodeChange(i, e.target.value)
                        }
                      }}
                      onKeyDown={(e) => activeRole === 'executor' && handleExecutorKeyDown(i, e)}
                      className='code-input'
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <div className='resend-code'>
                  <button type='button' onClick={handleResend} className='resend-link'>
                    {activeRole === 'customer'
                      ? canResend
                        ? 'Отправить код повторно'
                        : `Повторно через ${resendTimer} сек`
                      : 'Получить новый код'}
                  </button>
                </div>
              </div>
            )}

            <button
              type='submit'
              className={`continue-button ${isContinueDisabled ? 'disabled' : ''}`}
              disabled={isContinueDisabled}
            >
              {isLoading ? 'Загрузка...' : 'Продолжить'}
            </button>
          </form>

          {/* Модальное окно с ошибкой */}
          {errorModal && (
            <div className='modal-overlay' onClick={() => setErrorModal('')}>
              <div className='modal' onClick={(e) => e.stopPropagation()}>
                <p>{errorModal}</p>
                <button onClick={() => setErrorModal('')}>ОК</button>
              </div>
            </div>
          )}

          <div className='register-link'>
            У вас еще нет аккаунта?{' '}
            <Link to='/simplified_registration_step1' className='register-here'>
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>

      <Footer className='footer footer--enter' />
    </div>
  )
}

export default Enter