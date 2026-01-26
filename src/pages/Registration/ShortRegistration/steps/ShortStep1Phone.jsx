import '../../Registration.css'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RoleSwitcher from '../../common/RoleSwitcher'
import PhoneNumber from '../../common/PhoneNumber'
import apiClient from '../../../../api/client'
import '../../../Enter/Enter.css'
import '../../../../styles/Modal.css'
import arrow from '../../../../assets/Main/arrow_left.svg'
import icon_close_modal from '../../../../assets/Main/icon_close_modal.svg'

export default function ShortStep1Phone() {
  const navigate = useNavigate()

  const [role, setRole] = useState('customer')
  const [step, setStep] = useState(1) // 1 — телефон, 2 — код
  const [phoneValue, setPhoneValue] = useState('')
  const [countryCode, setCountryCode] = useState('7')
  const [phoneNumberOnly, setPhoneNumberOnly] = useState('')
  const [isPhoneValid, setIsPhoneValid] = useState(false)

  // Локальный SMS-код 
  const [smsCode, setSmsCode] = useState(['', '', '', ''])

  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [canResend, setCanResend] = useState(true)

  // Модальное окно
  const [modalMessage, setModalMessage] = useState(null)
  const openModal = (msg) => setModalMessage(msg)
  const closeModal = () => {
    setModalMessage(null)
    // Возвращаем фокус на первое поле кода после закрытия модалки
    setTimeout(() => {
      document.getElementById('code-0')?.focus()
    }, 100)
  }

  // Автофокус на первое поле кода при переходе на шаг 2
  useEffect(() => {
    if (step === 2 && !modalMessage) {
      const timer = setTimeout(() => {
        document.getElementById('code-0')?.focus()
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [step, modalMessage])

  // Таймер повторной отправки
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  // Валидация телефона
  const customPhoneValidation = (phone, { country }) => {
    const nationalNumber = phone.replace(/\D/g, '').slice(country.dialCode.length)
    const length = nationalNumber.length
    if (country.iso2 === 'ru' || country.dialCode === '7') {
      return length === 10
    }
    return length >= 7 && length <= 13
  }

  // Запрос SMS-кода
  const requestSmsCode = async () => {
    if (!isPhoneValid || isLoading) return
    setIsLoading(true)
    try {
      const response = await apiClient.post('/customers/auth/phone/code', {
        countryCode,
        phoneNumber: phoneNumberOnly,
      })

      if (response.data?.code && process.env.NODE_ENV === 'development') {
        openModal(`Код для теста: ${response.data.code}`)
      }

      setStep(2)
      setCanResend(false)
      setResendTimer(60)
    } catch (err) {
      const message = err.response?.data?.message || 'Не удалось отправить код'
      openModal(err.response?.status === 429 ? 'Слишком частые запросы. Подождите немного.' : message)
    } finally {
      setIsLoading(false)
    }
  }

  // Подтверждение кода
  const verifySmsCode = async () => {
    const fullCode = smsCode.join('')
    if (fullCode.length !== 4 || isLoading) return
    setIsLoading(true)
    try {
      const response = await apiClient.post('/customers/auth/phone/verify', {
        countryCode,
        phoneNumber: phoneNumberOnly,
        code: fullCode,
      })

      const { accessToken } = response.data
      localStorage.setItem('accessToken', accessToken)

      // Получаем профиль для определения следующего шага
      const profileRes = await apiClient.get('/customers/me/profile')
      const profile = profileRes.data

      // Редирект в зависимости от статуса регистрации
      if (profile.regStatus === 'REQUIRED_PERSONAL_DATA') {
        navigate('/simplified_registration_step2')
      } else {
        navigate('/customer_personal_account') 
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Неверный код'
      openModal(message)
      setSmsCode(['', '', '', ''])
    } finally {
      setIsLoading(false)
    }
  }

  // Переключение роли
  const handleRoleChange = (newRole) => {
    setRole(newRole)
    if (newRole === 'executor') {
      setPhoneValue('')
      setSmsCode(['', '', '', ''])
      navigate('/full_registration_step0')
    }
  }

  // Назад
  const handleBack = () => {
    if (step === 2) {
      setSmsCode(['', '', '', ''])
      setStep(1)
      return
    }
    setPhoneValue('')
    navigate('/enter')
  }

  // Повторная отправка
  const handleResend = () => {
    if (canResend && !isLoading) {
      requestSmsCode()
    }
  }

  const isContinueDisabled = isLoading || (step === 1 ? !isPhoneValid : smsCode.some(d => d === ''))

  return (
    <div>
      <Header hideElements={true} />
      <div className="reg-container" style={{ marginBottom: '240px' }}>
        <div className="registr-container" style={{ height: '565px' }}>
          <div className="title">
            <button className="btn-back" onClick={handleBack}>
              <img src={arrow} alt="Назад" />
            </button>
            <h2 className="login-title">Регистрация</h2>
          </div>

          {/* ШАГ 1 — Телефон */}
          {step === 1 && (
            <>
              <RoleSwitcher activeRole={role} onChangeRole={handleRoleChange} />
              <div className="form-group" style={{ marginTop: '35px' }}>
                <label className="form-label">Номер телефона</label>
                <PhoneNumber
                  value={phoneValue}
                  onChange={(value, meta) => {
                    setPhoneValue(value)
                    const raw = value.replace(/\D/g, '')
                    const dialCode = meta.country?.dialCode || '7'
                    const numberWithoutCountry = raw.startsWith(dialCode)
                      ? raw.slice(dialCode.length)
                      : raw
                    setPhoneNumberOnly(numberWithoutCountry)
                    setCountryCode(dialCode)
                  }}
                  onValidityChange={setIsPhoneValid}
                  customValidation={customPhoneValidation}
                />
              </div>
              <button
                className={`continue-button ${isContinueDisabled ? 'disabled' : ''}`}
                disabled={isContinueDisabled}
                onClick={requestSmsCode}
              >
                {isLoading ? 'Отправка...' : 'Продолжить'}
              </button>
            </>
          )}

          {/* ШАГ 2 — Код */}
          {step === 2 && (
            <div className="login-form">
              <div className="form-group">
                <label className="form-label">
                  Код из СМС
                  <div className="phone-preview">Код отправлен на: {phoneValue}</div>
                </label>
                <div className="code-inputs">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      id={`code-${i}`}
                      type="text"
                      maxLength="1"
                      value={smsCode[i]}
                      onChange={(e) => {
                        const val = e.target.value
                        if (/^\d?$/.test(val)) {
                          const newCode = [...smsCode]
                          newCode[i] = val
                          setSmsCode(newCode)
                          if (val && i < 3) {
                            document.getElementById(`code-${i + 1}`)?.focus()
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !smsCode[i] && i > 0) {
                          document.getElementById(`code-${i - 1}`)?.focus()
                        }
                      }}
                      className="code-input"
                    />
                  ))}
                </div>
                <div className="resend-code">
                  <button
                    type="button"
                    className="resend-link"
                    onClick={handleResend}
                    disabled={!canResend || isLoading}
                  >
                    {canResend ? 'Отправить код повторно' : `Повторно через ${resendTimer} сек`}
                  </button>
                </div>
              </div>
              <button
                className={`continue-button ${isContinueDisabled ? 'disabled' : ''}`}
                disabled={isContinueDisabled}
                onClick={verifySmsCode}
              >
                {isLoading ? 'Проверка...' : 'Продолжить'}
              </button>
            </div>
          )}

          <div className="register-link">
            У вас уже есть аккаунт? <Link to="/enter" className="register-here">Войти</Link>
          </div>
        </div>
      </div>

      <Footer className="footer footer--registr" />

      {/* Модальное окно */}
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
    </div>
  )
}