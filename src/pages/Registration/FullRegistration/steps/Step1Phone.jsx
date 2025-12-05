import '../../Registration.css'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import PhoneNumber from '../../common/PhoneNumber'
import RoleSwitcher from '../../common/RoleSwitcher'
import arrow from '../../../../assets/Main/arrow_left.svg'

export default function Step1Phone() {
  const navigate = useNavigate()
  const { phoneNumber, setPhoneNumber, userEmail, setUserEmail, stepNumber, setStepNumber, userLawSubject, setUserLawSubject } = useAppContext()

  // ---------- ЛОКАЛЬНЫЕ СОСТОЯНИЯ ----------
  const [step, setStep] = useState(() => Number(localStorage.getItem("reg_step")) || 1)
  const [contact, setContact] = useState(() => localStorage.getItem("reg_contact") || '')
  const [smsCode, setSmsCode] = useState(() => {
    const saved = localStorage.getItem("reg_code")
    return saved ? JSON.parse(saved) : ['', '', '', '']
  })
  const [role, setRole] = useState('executor')
  const [contactType, setContactType] = useState('phone')
  const [isValidContact, setIsValidContact] = useState(false)

  // ---------- ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ ----------
  const codeArray = useMemo(() => Array.isArray(smsCode) ? smsCode : ['', '', '', ''], [smsCode])
  const isCodeComplete = useMemo(() => codeArray.every(digit => digit !== ''), [codeArray])

  // ---------- УСТАНОВКА ФИЗИЧЕСКОГО ЛИЦА ПО УМОЛЧАНИЮ ----------
  useEffect(() => {
    setUserLawSubject('individual')
  }, [setUserLawSubject])

  // эффект после установки userLawSubject
  useEffect(() => {
    // Сбрасываем поле контакта при изменении типа лица
    setContact('')
    setIsValidContact(false)
  }, [userLawSubject])

  // ---------- ВАЛИДАЦИОННЫЕ ФУНКЦИИ ----------
  const isValidEmail = useCallback((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [])
  const isValidPhone = useCallback((phone) => phone.replace(/\D/g, '').length > 10, [])

  // ---------- ВАЛИДАЦИЯ КОНТАКТА ----------
  const validateContact = useCallback((value) => {
    if (userLawSubject === 'individual') {
      setContactType('phone')
      setIsValidContact(isValidPhone(value))
      return
    }

    if (isValidEmail(value)) {
      setContactType('email')
      setIsValidContact(true)
    } else if (isValidPhone(value)) {
      setContactType('phone')
      setIsValidContact(true)
    } else {
      setContactType('phone')
      setIsValidContact(false)
    }
  }, [userLawSubject, isValidEmail, isValidPhone])

  // ---------- ИНИЦИАЛЬНАЯ ВАЛИДАЦИЯ ----------
  useEffect(() => {
    if (contact) validateContact(contact)
  }, [contact, validateContact])

  // ---------- СОХРАНЕНИЕ В LOCALSTORAGE ----------
  useEffect(() => { localStorage.setItem("reg_step", step) }, [step])
  useEffect(() => { localStorage.setItem("reg_contact", contact) }, [contact])
  useEffect(() => { localStorage.setItem("reg_code", JSON.stringify(smsCode)) }, [smsCode])

  // ---------- ОБРАБОТЧИКИ ----------
  const resetAll = useCallback(() => {
    setContact('')
    setSmsCode(['', '', '', ''])
    setIsValidContact(false)
    setStep(1)
    setContactType('phone')
    localStorage.removeItem('reg_step')
    localStorage.removeItem('reg_contact')
    localStorage.removeItem('reg_code')
  }, [])

  // обработчика переключателя роли (заказчик/исполнитель)
  const handleRoleChange = useCallback((newRole) => {
    setRole(newRole)
    if (newRole === 'customer') {
      resetAll()
      navigate('/simplified_registration_step1')
    }
  }, [resetAll, navigate])

  // обработчик контакта
  const handleContactChange = useCallback((value) => {
    setContact(value)
    validateContact(value)
  }, [validateContact])


  // обработчик отправки формы (сохранения данных)
  const handleSubmit = useCallback((e) => {
    e.preventDefault()

    if (step === 1) {
      if (isValidContact) {
        // сохранение контакта в контекст
        if (contactType === 'phone') {
          setPhoneNumber(contact)
          setUserEmail('') 
        } else {
          setUserEmail(contact) 
          setPhoneNumber('')    // чтобы не мешало
        }
        setStep(2)
      }
      return
    }

    if (step === 2 && isCodeComplete) {
      localStorage.removeItem("reg_step")
      localStorage.removeItem("reg_contact")
      localStorage.removeItem("reg_code")
      console.log('Phone:', phoneNumber, 'email:', userEmail)
      navigate('/full_registration_step1_2')
    }
  }, [step, isValidContact, isCodeComplete, contact, contactType, navigate, setPhoneNumber, setUserEmail])

  // обработчик кода смс
  const handleCodeChange = useCallback((index, value) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...smsCode]
      newCode[index] = value
      setSmsCode(newCode)
      if (value && index < 3) {
        document.getElementById(`code-input-${index + 1}`)?.focus()
      }
    }
  }, [smsCode])

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !smsCode[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`)?.focus()
    }
  }, [smsCode])

  const handleBack = useCallback(() => {
    if (step === 2) {
      setSmsCode(['', '', '', ''])
      setStep(1)
      return
    }
    navigate('/')
  }, [step, navigate])



  const getDisplayContact = useCallback(() => {
    if (contactType === 'phone') {
      const digits = contact.replace(/\D/g, '')
      if (digits.length === 11) {
        return `+7 (${digits.substring(1, 4)}) ${digits.substring(4, 7)}-${digits.substring(7, 9)}-${digits.substring(9)}`
      }
    }
    return contact
  }, [contactType, contact])

  // ---------- РЕНДЕР ----------
  const renderStep1 = () => (
    <>
      <RoleSwitcher activeRole={role} onChangeRole={handleRoleChange} />

      <div className="role-switcher">
        <button
          className={`role-option ${userLawSubject === 'individual' ? 'active' : ''}`}
          onClick={() => setUserLawSubject('individual')}
        >
          Физическое лицо
        </button>
        <button
          className={`role-option ${userLawSubject === 'legal_entity' ? 'active' : ''}`}
          onClick={() => setUserLawSubject('legal_entity')}
        >
          Юридическое лицо
        </button>
      </div>

      <div className='passport-field full-width' style={{marginTop: '45px'}}>
        <h3>
          {userLawSubject === 'individual' ? 'Номер телефона' : 'Номер телефона или почта'}
        </h3>
        {userLawSubject === 'individual' ? (
          <PhoneNumber value={contact} onChange={handleContactChange} />
        ) : (
          <input
            type="text"
            value={contact}
            onChange={(e) => handleContactChange(e.target.value)}
            placeholder="Введите номер телефона или email"
            style={{marginBottom: '50px'}}
          />
        )}
      </div>

      <button
        className={`continue-button ${!isValidContact ? 'disabled' : ''}`}
        disabled={!isValidContact}
        onClick={handleSubmit}
        style={{ marginTop: '10px' }}
      >
        Продолжить
      </button>
    </>
  )

  const renderStep2 = () => (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">
          Код из {contactType === 'phone' ? 'SMS' : 'Email'}
          <div className="phone-preview">
            Код отправлен на {contactType === 'phone' ? 'номер' : 'email'}: {getDisplayContact()}
          </div>
        </label>

        <div className="code-inputs">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength="1"
              value={codeArray[index] || ''}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="code-input"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <div className="resend-code">
          <button type="button" className="resend-link">Получить новый код</button>
        </div>
      </div>

      <button
        type="submit"
        className={`continue-button ${!isCodeComplete ? 'disabled' : ''}`}
        disabled={!isCodeComplete}
      >
        Продолжить
      </button>
    </form>
  )

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container' style={{marginBottom: step === 2 && '230px'}}>
        <div className='registr-container' style={{ height: step === 1 ? '660px' : '570px' }}>
          <div className='title'>
            <button className='btn-back' onClick={handleBack}><img src={arrow} alt='Назад' /></button>
            <h2 className="login-title">Регистрация</h2>
          </div>

          {step === 1 ? renderStep1() : renderStep2()}

          <div className="register-link">
            У вас уже есть аккаунт? <Link to="/enter" className="register-here">Войти</Link>
          </div>
        </div>
      </div>

      <Footer className='footer footer--registr' />
    </div>
  )
}