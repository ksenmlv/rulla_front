import '../../Registration.css'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import PhoneNumber from '../../common/PhoneNumber'
import RoleSwitcher from '../../common/RoleSwitcher'
import arrow from '../../../../assets/Main/arrow_left.svg'

export default function Step0Phone() {
  const navigate = useNavigate()
  const { stepNumber, setStepNumber, 
          phoneNumber, setPhoneNumber, 
          smsCode, setSmsCode,
          userEmail, setUserEmail,  
          contactType, setContactType,
          temporaryContact, setTemporaryContact,
          userLawSubject, setUserLawSubject } = useAppContext()

  // локальные состояния
  const [registrationStep, setRegistrationStep] = useState(1)
  const [role, setRole] = useState('executor')

  // установка физ лица по умолчанию и тип контакта - тф
  useEffect(() => {
    if (!userLawSubject) {
      setUserLawSubject('individual')
    }
    
    if (!contactType) {
      setContactType('phone')
    }
  }, [setUserLawSubject, setContactType, userLawSubject, contactType])


  // валидация
  const isValidEmail = useCallback((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [])
  const isValidPhone = useCallback((phone) => phone.replace(/\D/g, '').length > 10, [])

  const isValidContact = useMemo(() => {
    if (!temporaryContact) return false
    
    if (userLawSubject === 'individual') {
      return isValidPhone(temporaryContact)
    }
    
    // для юр лиц телефон или email
    return isValidEmail(temporaryContact) || isValidPhone(temporaryContact)
  }, [temporaryContact, userLawSubject, isValidEmail, isValidPhone])

    
  // автоматическое определение типа контакта
  useEffect(() => {
    if (!temporaryContact) {
      setContactType('phone')
      return
    }

    if (userLawSubject === 'individual') {
      setContactType('phone')
    } else {
      if (isValidEmail(temporaryContact)) {
        setContactType('email')
      } else if (isValidPhone(temporaryContact)) {
        setContactType('phone')
      }
    }
  }, [temporaryContact, userLawSubject, isValidEmail, isValidPhone, setContactType])


  // проверка завершенности кода
  const isCodeComplete = useMemo(() => 
    smsCode && smsCode.length === 4 && smsCode.every(digit => digit !== ''), 
    [smsCode]
  )


  // обработчика переключателя роли (заказчик/исполнитель)
  const handleRoleChange = useCallback((newRole) => {
    setRole(newRole)
    if (newRole === 'customer') {
      setTemporaryContact('')
      setSmsCode(['', '', '', ''])
      setRegistrationStep(1)
      navigate('/simplified_registration_step1')
    }
  },[setTemporaryContact, setSmsCode, setRegistrationStep, navigate])


  // обработчик контакта
  const handleContactChange = useCallback((value) => {
    setTemporaryContact(value)
  }, [setTemporaryContact])


  // обработчик отправки формы (сохранения данных)
  const handleSubmit = useCallback((e) => {
    e.preventDefault()

    if (registrationStep  === 1) {
      if (isValidContact) {
        // сохранение контакта в контекст
        if (contactType === 'phone') {
          setPhoneNumber(temporaryContact)
          setUserEmail('') 
        } else {
          setUserEmail(temporaryContact) 
          setPhoneNumber('')    
        }
        setRegistrationStep(2)
      }
      return
    }

    if (registrationStep === 2 && isCodeComplete) {
      // отправка на сервер и удаление из контекста!!!!!!!!

      console.log(stepNumber)
      setPhoneNumber('')
      setStepNumber(stepNumber + 1)
      navigate('/full_registration_step0_1')
    }
  }, [registrationStep, isValidContact, isCodeComplete, temporaryContact, contactType, setPhoneNumber, setUserEmail, stepNumber, setStepNumber, navigate])


  // обработчик кода смс
  const handleCodeChange = useCallback((index, value) => {
    if (/^\d?$/.test(value)) {
      const currentCode = smsCode || ['', '', '', '']
      const newCode = [...currentCode]
      newCode[index] = value
      setSmsCode(newCode)

      if (value && index < 3) {
        document.getElementById(`code-input-${index + 1}`)?.focus()
      }
    }
  }, [smsCode, setSmsCode])


const handleKeyDown = useCallback((index, e) => {
  const currentCode = smsCode || ['', '', '', '']
  if (e.key === 'Backspace' && !currentCode[index] && index > 0) {
    document.getElementById(`code-input-${index - 1}`)?.focus()
  }
}, [smsCode])


  const handleBack = useCallback(() => {
    if (registrationStep === 2) {
      setSmsCode(['', '', '', ''])
      setRegistrationStep(1)
      return
    }
    navigate('/')
  }, [registrationStep, setSmsCode, navigate])


  // форматирование контакта для отображения
  const getDisplayContact = useCallback(() => {
    if (!temporaryContact) return ''
    
    if (contactType === 'phone') {
      const digits = temporaryContact.replace(/\D/g, '')
      if (digits.length === 11) {
        return `+7 (${digits.substring(1, 4)}) ${digits.substring(4, 7)}-${digits.substring(7, 9)}-${digits.substring(9)}`
      }
    }
    return temporaryContact
  }, [temporaryContact, contactType])


  // рендер 1 шага
  const renderStep1 = () => (
    <>
      <RoleSwitcher activeRole={role} onChangeRole={handleRoleChange} />

      <div className="role-switcher">
        <button
          className={`role-option ${userLawSubject === 'individual' ? 'active' : ''}`}
          onClick={() => {
            setUserLawSubject('individual')
            setTemporaryContact('') 
            setContactType('phone') 
          }}
        >
          Физическое лицо
        </button>
        <button
          className={`role-option ${userLawSubject === 'legal_entity' ? 'active' : ''}`}
          onClick={() => {
            setUserLawSubject('legal_entity')
            setTemporaryContact('') 
          }}
        >
          Юридическое лицо
        </button>
      </div>

      <div className='passport-field full-width' style={{marginTop: '45px'}}>
        <h3>
          {userLawSubject === 'individual' ? 'Номер телефона' : 'Номер телефона или почта'}
        </h3>
        {userLawSubject === 'individual' ? (
          <PhoneNumber value={temporaryContact || ''}  onChange={handleContactChange} />
        ) : (
          <input
            type="text"
            value={temporaryContact || ''} 
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

  // рендер 2 шага
  const renderStep2 = () => {
    const currentCode = smsCode || ['', '', '', '']

    return (
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
                    value={currentCode[index] || ''}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="code-input"
                    autoFocus={index === 0 && !currentCode[0]}
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
  }

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container' style={{marginBottom: '237px' }}>
        <div className='registr-container' style={{ height: registrationStep === 1 ? '660px' : '570px' }}>
          <div className='title'>
            <button className='btn-back' onClick={handleBack}><img src={arrow} alt='Назад' /></button>
            <h2 className="login-title">Регистрация</h2>
          </div>

          {registrationStep === 1 ? renderStep1() : renderStep2()}

          <div className="register-link">
            У вас уже есть аккаунт? <Link to="/enter" className="register-here">Войти</Link>
          </div>
        </div>
      </div>

      <Footer className='footer footer--registr' />
    </div>
  )
}