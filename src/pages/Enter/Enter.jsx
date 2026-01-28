import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../contexts/AppContext'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import PhoneNumber from '../Registration/common/PhoneNumber'
import arrow from '../../assets/Main/arrow_left.svg'
import apiClient from '../../api/client'
import 'react-international-phone/style.css'
import '../Enter/Enter.css'
import icon_close_modal from '../../assets/Main/icon_close_modal.svg'
import '../../styles/Modal.css'

function Enter() {
  const navigate = useNavigate()

  const {
    setPhoneNumber,
    setUserEmail,
    setSmsCode,
    setUserId,
    setUserPhone,
    setFirstName,
    setLastName,
    setRegStatus,
  } = useAppContext()

  const [activeRole, setActiveRole] = useState('customer') // customer или executor
  const [step, setStep] = useState(1)

  // Для заказчика
  const [customerPhone, setCustomerPhone] = useState('')
  const [countryCode, setCountryCode] = useState('7')
  const [phoneNumberOnly, setPhoneNumberOnly] = useState('')
  const [isCustomerPhoneValid, setIsCustomerPhoneValid] = useState(false) // теперь приходит из PhoneInput
  const [customerCode, setCustomerCode] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)

  // Для исполнителя 
  const [executorContact, setExecutorContact] = useState('')
  const [isValidContact, setIsValidContact] = useState(false)
  const [executorCode, setExecutorCode] = useState(['', '', '', ''])


  const isEmail = executorContact.includes('@')

  const executorPhoneE164 = () => {
    const digits = executorContact.replace(/\D/g, '')
    if (digits.startsWith('7')) return `+${digits}`
    return `+7${digits}`
  }


  // Модальное окно
  const [modalMessage, setModalMessage] = useState(null)
  const openModal = (msg) => setModalMessage(msg)

  const closeModal = () => {
    setModalMessage(null)
    setTimeout(() => {
      document.getElementById('code-0')?.focus()
    }, 100)
  }

  // Таймер повторной отправки
  const [resendTimer, setResendTimer] = useState(0)
  const [canResend, setCanResend] = useState(true)

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  // Валидация контакта для исполнителя
  const validateContact = (value) => {
    const digits = value.replace(/\D/g, '')
    const isPhone = digits.length > 10
    const isEmail = /^[\w.-]+@[\w.-]+\.\w+$/.test(value)
    return isPhone || isEmail
  }

  const handleExecutorContactChange = (value) => {
    setExecutorContact(value)
    setIsValidContact(validateContact(value))
  }

  // Запрос SMS для заказчика
  const requestCustomerCode = async () => {
    if (!isCustomerPhoneValid || isLoading) return
    setIsLoading(true)

    try {
      const response = await apiClient.post('/customer/auth/telephone/code', {
        phone: customerPhone,
      })


      if (response.data && response.data.code && process.env.NODE_ENV === 'development') {
        openModal(`Код для входа: ${response.data.code}`)
      }

      setStep(2)
      setCanResend(false)
      setResendTimer(60)
    } catch (err) {
      const message = err.response?.data?.message || 'Не удалось отправить код'
      openModal(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Подтверждение кода и вход заказчика
  const verifyCustomerCode = async () => {
    const fullCode = customerCode.join('')
    if (fullCode.length !== 4 || isLoading) return

    setIsLoading(true)

    try {
      const response = await apiClient.post('/customer/auth/telephone/verify', {
        phone: customerPhone,
        code: fullCode,
      })


      const { accessToken } = response.data
      localStorage.setItem('accessToken', accessToken)

      const profileRes = await apiClient.get('/customers/me/profile')
      const profile = profileRes.data

      setUserId(profile.userId || '')
      setUserPhone(profile.phone || customerPhone)
      setFirstName(profile.firstName || '')
      setLastName(profile.lastName || '')
      setRegStatus(profile.regStatus || '')

      navigate('/main_customer')
    } catch (err) {
      const message = err.response?.data?.message || 'Неверный код'
      openModal(message)
      setCustomerCode(['', '', '', ''])
    } finally {
      setIsLoading(false)
    }
  }


  // Запрос кода для исполнителя
  const requestExecutorCode = async () => {
    if (!isValidContact || isLoading) return
    setIsLoading(true)

    try {
      if (isEmail) {
        const res = await apiClient.post('/executor/auth/email/code', {
          email: executorContact,
        })

        if (res.data?.code && process.env.NODE_ENV === 'development') {
          openModal(`Код: ${res.data.code}`)
        }
      } else {
        const res = await await apiClient.post('/executor/auth/telephone/code', {
          phone: executorContact,
        })


        if (res.data?.code && process.env.NODE_ENV === 'development') {
          openModal(`Код: ${res.data.code}`)
        }
      }

      setStep(2)
      setResendTimer(60)
      setCanResend(false)
    } catch (err) {
      openModal(err.response?.data?.message || 'Ошибка отправки кода')
    } finally {
      setIsLoading(false)
    }
  }


  // Подтверждение кода исполнителя
  const verifyExecutorCode = async () => {
    const code = executorCode.join('')
    if (code.length !== 4 || isLoading) return

    setIsLoading(true)

    try {
      let res

      if (isEmail) {
        res = await apiClient.post('/executor/auth/email/verify', {
          email: executorContact,
          code,
        })
      } else {
        res = await await apiClient.post('/executor/auth/telephone/verify', {
          phone: executorContact,
          code,
        })
      }

      localStorage.setItem('accessToken', res.data.accessToken)

      navigate('/main_executor')
    } catch (err) {
      openModal(err.response?.data?.message || 'Неверный код')
      setCustomerCode(['', '', '', ''])
    } finally {
      setIsLoading(false)
    }
  }


  const handleSubmit = (e) => {
    e.preventDefault()

    if (activeRole === 'customer') {
      if (step === 1) {
        requestCustomerCode()
      } else {
        verifyCustomerCode()
      }
    } else {
      if (step === 1) {
        requestExecutorCode()
      } else {
        verifyExecutorCode()
      }
    }
  }


  const handleBack = () => {
    if (step === 2) {
      setCustomerCode(['', '', '', ''])
      setStep(1)
      closeModal()
      return
    }
    navigate('/')
  }

  // Повторная отправка кода
  const handleResend = () => {
    if (!canResend || isLoading) return

    if (activeRole === 'customer') {
      requestCustomerCode()
    } else {
      requestExecutorCode()
    }
  }

  // Доступность кнопки "продолжить"
  const isContinueDisabled =
    isLoading ||
    (activeRole === 'customer'
      ? step === 1
        ? !isCustomerPhoneValid
        : customerCode.some((d) => d === '')
      : step === 1
      ? !isValidContact
      : false)


  // автофокус на 1ое поле смс кода
  useEffect(() => {
    if (step === 2) {
      // Небольшая задержка, чтобы DOM успел отрисоваться
      const timer = setTimeout(() => {
        document.getElementById('code-0')?.focus()
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [step])

  return (
    <div className="layout">
      <Header hideElements={true} />

      <div className="enter-container" style={{ marginBottom: '240px' }}>
        <div className="login-container">
          <div className="title">
            <button className="btn-back" onClick={handleBack}>
              <img src={arrow} alt="Назад" />
            </button>
            <h2 className="login-title">Вход</h2>
          </div>

          {step === 1 && (
            <div className="role-buttons">
              <button
                className={`role-button ${activeRole === 'customer' ? 'active' : ''}`}
                onClick={() => {
                  setActiveRole('customer')
                  setExecutorContact('')
                  setIsValidContact(false)
                }}
              >
                Я заказчик
              </button>
              <button
                className={`role-button ${activeRole === 'executor' ? 'active' : ''}`}
                onClick={() => {
                  setActiveRole('executor')
                  setCustomerPhone('')
                }}
              >
                Я исполнитель
              </button>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="form-group">
                <label className="form-label">
                  {activeRole === 'customer' ? 'Номер телефона' : 'Номер телефона или почта'}
                </label>
                {activeRole === 'customer' ? (
                  <PhoneNumber
                    value={customerPhone}
                    onChange={(value, meta) => {
                      setCustomerPhone(value)

                      const raw = value.replace(/\D/g, '')
                      const dialCode = meta.country?.dialCode || '7'
                      const numberWithoutCountry = raw.startsWith(dialCode)
                        ? raw.slice(dialCode.length)
                        : raw

                      setPhoneNumberOnly(numberWithoutCountry)
                      setCountryCode(dialCode)
                    }}
                    onValidityChange={setIsCustomerPhoneValid} // теперь будет обновляться!
                    // onPhoneSubmit не нужен здесь, т.к. submit обрабатывается формой Enter
                  />
                ) : (
                  <input
                    type="text"
                    value={executorContact}
                    onChange={(e) => handleExecutorContactChange(e.target.value)}
                    placeholder="Введите номер телефона или email"
                    className="custom-phone-input"
                    style={{ paddingLeft: '12px' }}
                  />
                )}
              </div>
            )}

            {step === 2 && (
              <div className="form-group">
                <label className="form-label">
                  Код из {activeRole === 'customer' ? 'SMS' : executorContact.includes('@') ? 'Email' : 'SMS'}
                  <div className="phone-preview">
                    Код отправлен на:{' '}
                    {activeRole === 'customer' ? customerPhone : executorContact}
                  </div>
                </label>

                <div className="code-inputs">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      id={`code-${i}`}
                      type="text"
                      maxLength="1"
                      value={activeRole === 'customer' ? customerCode[i] : executorCode[i]}
                      onChange={(e) => {
                        const val = e.target.value
                        if (/^\d?$/.test(val)) {
                          if (activeRole === 'customer') {
                            const newCode = [...customerCode]
                            newCode[i] = val
                            setCustomerCode(newCode)
                            if (val && i < 3) document.getElementById(`code-${i + 1}`)?.focus()
                          } else {
                            const newCode = [...executorCode]
                            newCode[i] = val
                            setExecutorCode(newCode)
                            if (val && i < 3) document.getElementById(`code-${i + 1}`)?.focus()
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !customerCode[i] && i > 0) {
                          document.getElementById(`code-${i - 1}`)?.focus()
                        }
                      }}
                      className="code-input"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {activeRole === 'customer' && (
                  <div className="resend-code">
                    <button type="button" onClick={handleResend} className="resend-link" disabled={!canResend || isLoading} style={{color: '#666'}}>
                      {canResend ? 'Отправить код повторно' : `Повторно через ${resendTimer} сек`}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              className={`continue-button ${isContinueDisabled ? 'disabled' : ''}`}
              disabled={isContinueDisabled}
            >
              {isLoading ? 'Загрузка...' : 'Продолжить'}
            </button>
          </form>

          {modalMessage && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={closeModal}>
                  <img src={icon_close_modal} alt="Закрыть" />
                </button>
                <div className="modal-text">{modalMessage}</div>
                <button className="modal-action-btn" onClick={closeModal}>
                  Понятно
                </button>
              </div>
            </div>
          )}

          <div className="register-link">
            У вас еще нет аккаунта?{' '}
            <Link to="/simplified_registration_step1" className="register-here">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>

      <Footer className="footer footer--enter" />
    </div>
  )
}

export default Enter