import '../../Registration.css'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import PhoneNumber from '../../common/PhoneNumber'
import RoleSwitcher from '../../common/RoleSwitcher'
import arrow from '../../../../assets/Main/arrow_left.svg'
import icon_close_modal from '../../../../assets/Main/icon_close_modal.svg'
import apiClient from '../../../../api/client'
import '../../../../styles/Modal.css'

export default function Step0Phone() {
  const navigate = useNavigate()
  const { stepNumber, setStepNumber, userLawSubject, setUserLawSubject } = useAppContext()

  // Локальные состояния
  const [registrationStep, setRegistrationStep] = useState(1) // 1 — ввод контакта, 2 — код
  const [role] = useState('executor') // всегда исполнитель на этом пути

  // Контакт (телефон или email — только для UI пока)
  const [contactInput, setContactInput] = useState('')

  // Для авторизации по телефону
  const [countryCode, setCountryCode] = useState('7')
  const [phoneNumberOnly, setPhoneNumberOnly] = useState('')

  // Код SMS
  const [smsCode, setSmsCode] = useState(['', '', '', ''])

  // UI состояния
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [canResend, setCanResend] = useState(true)

  // Модалка
  const [modalMessage, setModalMessage] = useState(null)
  const openModal = (msg) => setModalMessage(msg)
  const closeModal = () => {
    setModalMessage(null)
    setTimeout(() => {
      document.getElementById('code-input-0')?.focus()
    }, 100)
  }

  // Реф для поля ввода юр.лица
  const legalEntityInputRef = useRef(null)

  // Автофокус на поле ввода юр лица
  useEffect(() => {
    if (userLawSubject === 'legal_entity') {
      legalEntityInputRef.current?.focus()
    }
  }, [userLawSubject])

  // Автофокус на первое поле кода
  useEffect(() => {
    if (registrationStep === 2 && !modalMessage) {
      const timer = setTimeout(() => {
        document.getElementById('code-input-0')?.focus()
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [registrationStep, modalMessage])

  // Таймер повторной отправки
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  // По умолчанию — физлицо
  useEffect(() => {
    if (!userLawSubject) {
      setUserLawSubject('individual')
    }
  }, [userLawSubject, setUserLawSubject])

  // Валидация телефона для авторизации
  const isPhoneValid = phoneNumberOnly.length >= 10

  // Функция валидации контакта для юр.лица
  const validateContact = (value) => {
    if (!value) return false
    const digits = value.replace(/\D/g, '')
    const isPhone = digits.length > 10
    const isEmail = /^[\w.-]+@[\w.-]+\.\w+$/.test(value.trim())
    return isPhone || isEmail
  }

  // Валидация для UI (кнопка "Продолжить")
  const isContactValidForUI = userLawSubject === 'individual'
    ? isPhoneValid
    : validateContact(contactInput)

  // Обработчик переключения роли
  const handleRoleChange = (newRole) => {
    if (newRole === 'customer') {
      navigate('/simplified_registration_step1')
    }
  }

  // Обработчик ввода контакта
  const handleContactChange = (value) => {
    setContactInput(value)
  }

  // Специально для PhoneNumber
  const handlePhoneChange = (value, meta) => {
    setContactInput(value)
    const raw = value.replace(/\D/g, '')
    const dialCode = meta.country?.dialCode || '7'
    const numberWithoutCountry = raw.startsWith(dialCode) ? raw.slice(dialCode.length) : raw
    setPhoneNumberOnly(numberWithoutCountry)
    setCountryCode(dialCode)
  }

  // Запрос кода
  const requestSmsCode = async () => {
    if (!isPhoneValid || isLoading) return
    setIsLoading(true)
    try {
      const response = await apiClient.post('/executors/auth/phone/code', {
        countryCode,
        phoneNumber: phoneNumberOnly,
      })

      if (response.data?.code && process.env.NODE_ENV === 'development') {
        openModal(`Код для теста: ${response.data.code}`)
      }

      setRegistrationStep(2)
      setCanResend(false)
      setResendTimer(60)
    } catch (err) {
      const message = err.response?.data?.message || 'Не удалось отправить код'
      openModal(err.response?.status === 429 ? 'Слишком много попыток. Подождите.' : message)
    } finally {
      setIsLoading(false)
    }
  }

  // Верификация + установка типа
  const verifyAndSetType = async () => {
    if (smsCode.some(d => d === '') || isLoading) return
    setIsLoading(true)
    try {
      // Верификация
      const verifyRes = await apiClient.post('/executors/auth/phone/verify', {
        countryCode,
        phoneNumber: phoneNumberOnly,
        code: smsCode.join(''),
      })

      const { accessToken } = verifyRes.data
      localStorage.setItem('accessToken', accessToken)

      // Установка типа
      const typeEndpoint = userLawSubject === 'individual'
        ? '/executors/me/type/individual'
        : '/executors/me/type/company'

      await apiClient.post(typeEndpoint)

      // Успех
      setStepNumber(stepNumber + 1)
      alert('Успешное подтверждение номера телефона!')
      navigate('/full_registration_step0_1')
    } catch (err) {
      let message = err.response?.data?.message || 'Ошибка'
      if (err.response?.status === 400) {
        message = 'Неверный код'
        setSmsCode(['', '', '', ''])
      }
      openModal(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Обработка формы
  const handleSubmit = (e) => {
    e.preventDefault()
    if (registrationStep === 1) {
      requestSmsCode()
    } else {
      verifyAndSetType()
    }
  }

  // Обработка кода
  const handleCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...smsCode]
      newCode[index] = value
      setSmsCode(newCode)
      if (value && index < 3) {
        document.getElementById(`code-input-${index + 1}`)?.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !smsCode[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`)?.focus()
    }
  }

  const handleBack = () => {
    if (registrationStep === 2) {
      setSmsCode(['', '', '', ''])
      setRegistrationStep(1)
      return
    }
    navigate('/')
  }

  const getDisplayContact = () => contactInput || ''

  // Рендер шага 1
  const renderStep1 = () => (
    <>
      <RoleSwitcher activeRole={role} onChangeRole={handleRoleChange} />

      <div className="role-switcher">
        <button
          className={`role-option ${userLawSubject === 'individual' ? 'active' : ''}`}
          onClick={() => {
            setUserLawSubject('individual')
            setContactInput('')
          }}
        >
          Физическое лицо
        </button>
        <button
          className={`role-option ${userLawSubject === 'legal_entity' ? 'active' : ''}`}
          onClick={() => {
            setUserLawSubject('legal_entity')
            setContactInput('')
          }}
        >
          Юридическое лицо
        </button>
      </div>

      <div className='passport-field full-width' style={{ marginTop: '45px' }}>
        <h3>
          {userLawSubject === 'individual' ? 'Номер телефона' : 'Номер телефона или почта'}
        </h3>
        {userLawSubject === 'individual' ? (
          <PhoneNumber
            value={contactInput}
            onChange={handlePhoneChange}
          />
        ) : (
          <input
            ref={legalEntityInputRef}
            type="text"
            value={contactInput}
            onChange={(e) => handleContactChange(e.target.value)}
            placeholder="Введите номер телефона или email"
            style={{ marginBottom: '50px' }}
          />
        )}
      </div>

      <button
        className={`continue-button ${!isContactValidForUI ? 'disabled' : ''}`}
        disabled={!isContactValidForUI || isLoading}
        onClick={requestSmsCode}
        style={{ marginTop: '10px' }}
      >
        {isLoading ? 'Отправка...' : 'Продолжить'}
      </button>
    </>
  )

  // Рендер шага 2
  const renderStep2 = () => (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">
          Код из SMS
          <div className="phone-preview">
            Код отправлен на номер: {getDisplayContact()}
          </div>
        </label>

        <div className="code-inputs">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength="1"
              value={smsCode[index]}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="code-input"
            />
          ))}
        </div>

        <div className="resend-code">
          <button
            type="button"
            className="resend-link"
            onClick={requestSmsCode}
            disabled={!canResend || isLoading}
          >
            {canResend ? 'Получить новый код' : `Повторная отправка через ${resendTimer} сек`}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className={`continue-button ${smsCode.some(d => d === '') ? 'disabled' : ''}`}
        disabled={smsCode.some(d => d === '') || isLoading}
      >
        {isLoading ? 'Проверка...' : 'Продолжить'}
      </button>
    </form>
  )

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container' style={{ marginBottom: '237px' }}>
        <div className='registr-container' style={{ height: registrationStep === 1 ? '660px' : '570px' }}>
          <div className='title'>
            <button className='btn-back' onClick={handleBack}>
              <img src={arrow} alt='Назад' />
            </button>
            <h2 className="login-title">Регистрация</h2>
          </div>

          {registrationStep === 1 ? renderStep1() : renderStep2()}

          <div className="register-link">
            У вас уже есть аккаунт? <Link to="/enter" className="register-here">Войти</Link>
          </div>
        </div>
      </div>

      <Footer className='footer footer--registr' />

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