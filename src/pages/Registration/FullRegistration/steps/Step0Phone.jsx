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
  const [contactType, setContactType] = useState('phone') // phone или email

  // Контакт (телефон или email)
  const [contactInput, setContactInput] = useState('')

  // Для телефона
  const [countryCode, setCountryCode] = useState('7')
  const [phoneNumberOnly, setPhoneNumberOnly] = useState('')

  // Код подтверждения
  const [verificationCode, setVerificationCode] = useState(['', '', '', ''])

  // UI состояния
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [canResend, setCanResend] = useState(true)

  // Модалка
  const [modalMessage, setModalMessage] = useState(null)
  const openModal = (msg) => setModalMessage(msg)
  const closeModal = () => {
    setModalMessage(null)
    if (registrationStep === 2) {
      setTimeout(() => {
        document.getElementById('code-input-0')?.focus()
      }, 100)
    }
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

  // Определение типа контакта и валидация
  const getContactTypeAndValidate = (value) => {
    const trimmed = value.trim()
    const digits = trimmed.replace(/\D/g, '')
    
    // Email проверка
    const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/
    if (emailRegex.test(trimmed)) {
      return { type: 'email', isValid: true, value: trimmed }
    }
    
    // Телефон проверка
    if (digits.length >= 11) { // +7 + 10 цифр = минимум 11
      // Форматируем телефон в E.164
      let phone = trimmed
      if (!phone.startsWith('+') && digits.length >= 11) {
        phone = '+' + digits
      }
      return { type: 'phone', isValid: true, value: phone }
    }
    
    return { type: 'unknown', isValid: false, value: trimmed }
  }

  // Валидация для UI (кнопка "Продолжить")
  const getIsContactValidForUI = () => {
    if (userLawSubject === 'individual') {
      // Для физлица только телефон
      const digits = contactInput.replace(/\D/g, '')
      return digits.length >= 11 // +7 + 10 цифр
    } else {
      // Для юрлица телефон или email
      const validation = getContactTypeAndValidate(contactInput)
      return validation.isValid
    }
  }

  // Обработчик переключения роли
  const handleRoleChange = (newRole) => {
    if (newRole === 'customer') {
      navigate('/simplified_registration_step1')
    }
  }

  // Обработчик ввода контакта
  const handleContactChange = (value) => {
    setContactInput(value)
    // Определяем тип контакта при вводе
    if (userLawSubject === 'legal_entity') {
      const validation = getContactTypeAndValidate(value)
      if (validation.type !== 'unknown') {
        setContactType(validation.type)
      }
    }
  }

  // Специально для PhoneNumber компонента
  const handlePhoneChange = (value, meta) => {
    setContactInput(value)
    const raw = value.replace(/\D/g, '')
    const dialCode = meta.country?.dialCode || '7'
    const numberWithoutCountry = raw.startsWith(dialCode) ? raw.slice(dialCode.length) : raw
    setPhoneNumberOnly(numberWithoutCountry)
    setCountryCode(dialCode)
    setContactType('phone')
  }

  // Запрос кода подтверждения
  const requestVerificationCode = async () => {
    if (!getIsContactValidForUI() || isLoading) return
    setIsLoading(true)
    
    try {
      if (userLawSubject === 'individual' || contactType === 'phone') {
        // Для телефона (физлица или юрлица)
        const phone = contactInput.startsWith('+') 
          ? contactInput 
          : `+${contactInput.replace(/\D/g, '')}`
        
        const response = await apiClient.post('/executors/auth/phone/code', {
          phone
        })

        if (response.data?.code && process.env.NODE_ENV === 'development') {
          openModal(`Код для теста: ${response.data.code}`)
        }

        setRegistrationStep(2)
        setCanResend(false)
        setResendTimer(60)
      } else {
        // Для email (только юрлица)
        const validation = getContactTypeAndValidate(contactInput)
        if (validation.type !== 'email') {
          openModal('Пожалуйста, введите корректный email')
          return
        }

        const response = await apiClient.post('/executors/auth/email/code', {
          email: validation.value
        })

        if (response.data?.code && process.env.NODE_ENV === 'development') {
          openModal(`Код для теста: ${response.data.code}`)
        }

        setRegistrationStep(2)
        setCanResend(false)
        setResendTimer(60)
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Не удалось отправить код'
      if (err.response?.status === 429) {
        openModal('Слишком много попыток. Подождите 60 секунд.')
        setCanResend(false)
        setResendTimer(60)
      } else {
        openModal(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Верификация кода и установка типа исполнителя
  const verifyCodeAndSetType = async () => {
    if (verificationCode.some(d => d === '') || isLoading) return
    setIsLoading(true)
    
    try {
      const code = verificationCode.join('')
      let accessToken

      if (userLawSubject === 'individual' || contactType === 'phone') {
        // Верификация телефона
        const phone = contactInput.startsWith('+') 
          ? contactInput 
          : `+${contactInput.replace(/\D/g, '')}`
        
        const verifyRes = await apiClient.post('/executors/auth/phone/verify', {
          phone,
          code
        })
        
        accessToken = verifyRes.data.accessToken
      } else {
        // Верификация email
        const validation = getContactTypeAndValidate(contactInput)
        const verifyRes = await apiClient.post('/executors/auth/email/verify', {
          email: validation.value,
          code
        })
        
        accessToken = verifyRes.data.accessToken
      }

      // Сохраняем токен
      localStorage.setItem('accessToken', accessToken)
      
      // Устанавливаем заголовок авторизации для последующих запросов
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      // Пытаемся установить тип, но игнорируем 409 ошибку
      // (тип уже может быть установлен ранее)
      const typeEndpoint = userLawSubject === 'individual'
        ? '/executors/me/type/individual'
        : '/executors/me/type/company'

      await apiClient.post(typeEndpoint).catch(error => {
        // Игнорируем только 409 ошибки (Conflict)
        if (error.response?.status !== 409) {
          throw error
        }
        // Для отладки можно залогировать
        console.warn('Тип пользователя уже установлен, продолжаем регистрацию')
      })

      // Успешная регистрация
      setStepNumber(stepNumber + 1)
      navigate('/full_registration_step0_1')
      
    } catch (err) {
      let message = err.response?.data?.message || 'Ошибка при подтверждении кода'
      
      if (err.response?.status === 400) {
        message = 'Неверный код подтверждения'
        setVerificationCode(['', '', '', ''])
        setTimeout(() => {
          document.getElementById('code-input-0')?.focus()
        }, 100)
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
      requestVerificationCode()
    } else {
      verifyCodeAndSetType()
    }
  }

  // Обработка кода подтверждения
  const handleCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)
      if (value && index < 3) {
        document.getElementById(`code-input-${index + 1}`)?.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`)?.focus()
    }
  }

  const handleBack = () => {
    if (registrationStep === 2) {
      setVerificationCode(['', '', '', ''])
      setRegistrationStep(1)
      return
    }
    navigate('/')
  }

  const getDisplayContact = () => {
    if (userLawSubject === 'individual') {
      return contactInput
    }
    
    const validation = getContactTypeAndValidate(contactInput)
    if (validation.type === 'email') {
      return validation.value
    } else if (validation.type === 'phone') {
      return validation.value
    }
    
    return contactInput
  }

  // Рендер шага 1
  const renderStep1 = () => (
    <>
      <RoleSwitcher activeRole={role} onChangeRole={handleRoleChange} />

      <div className="role-switcher">
        <button
          type="button"
          className={`role-option ${userLawSubject === 'individual' ? 'active' : ''}`}
          onClick={() => {
            setUserLawSubject('individual')
            setContactInput('')
            setContactType('phone')
          }}
        >
          Физическое лицо
        </button>
        <button
          type="button"
          className={`role-option ${userLawSubject === 'legal_entity' ? 'active' : ''}`}
          onClick={() => {
            setUserLawSubject('legal_entity')
            setContactInput('')
            setContactType('phone') // сбрасываем на телефон по умолчанию
          }}
        >
          Юридическое лицо
        </button>
      </div>

      <div className='passport-field full-width' style={{ marginTop: '45px' }}>
        <h3>
          {userLawSubject === 'individual' 
            ? 'Номер телефона' 
            : 'Номер телефона или почта'}
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
        type="button"
        className={`continue-button ${!getIsContactValidForUI() ? 'disabled' : ''}`}
        disabled={!getIsContactValidForUI() || isLoading}
        onClick={requestVerificationCode}
        style={{ marginTop: '10px' }}
      >
        {isLoading ? 'Отправка...' : 'Продолжить'}
      </button>
    </>
  )

  // Рендер шага 2
  const renderStep2 = () => {
    const displayContact = getDisplayContact()
    const contactTypeDisplay = userLawSubject === 'individual' || contactType === 'phone' ? 'SMS' : 'email'
    
    return (
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Код из {contactTypeDisplay}
            <div className="phone-preview">
              Код отправлен на: {displayContact}
            </div>
          </label>

          <div className="code-inputs">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                maxLength="1"
                value={verificationCode[index]}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="code-input"
                autoComplete="off"
                inputMode="numeric"
              />
            ))}
          </div>

          <div className="resend-code">
            <button
              type="button"
              className="resend-link"
              onClick={requestVerificationCode}
              disabled={!canResend || isLoading}
            >
              {canResend ? 'Получить новый код' : `Повторная отправка через ${resendTimer} сек`}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={`continue-button ${verificationCode.some(d => d === '') ? 'disabled' : ''}`}
          disabled={verificationCode.some(d => d === '') || isLoading}
        >
          {isLoading ? 'Проверка...' : 'Продолжить'}
        </button>
      </form>
    )
  }

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container' style={{ marginBottom: '237px' }}>
        <div className='registr-container' style={{ height: registrationStep === 1 ? '660px' : '570px' }}>
          <div className='title'>
            <button type="button" className='btn-back' onClick={handleBack}>
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
            <button type="button" className="modal-close-btn" onClick={closeModal}>
              <img src={icon_close_modal} alt="Закрыть" />
            </button>
            <div className="modal-text">{modalMessage}</div>
            <button type="button" className="modal-action-btn" onClick={closeModal}>
              Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  )
}