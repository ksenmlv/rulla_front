import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../contexts/AppContext'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { PhoneInput } from 'react-international-phone'
import arrow from '../../assets/Main/arrow_left.svg'
import 'react-international-phone/style.css'
import '../Enter/Enter.css'

function Enter() {
  const navigate = useNavigate()
  const inputRef = useRef()

  const {
    phoneNumber, setPhoneNumber,
    userEmail, setUserEmail,
    smsCode, setSmsCode
  } = useAppContext()

  const [activeRole, setActiveRole] = useState('executor') // заказчик / исполнитель
  const [isValidContact, setIsValidContact] = useState(false)

  const [step, setStep] = useState(() => Number(localStorage.getItem('loginStep')) || 1)

  // ------------------------------------
  // Валидация телефона / email
  // ------------------------------------
  const validateContact = (value) => {
    const digits = value.replace(/\D/g, '')
    const isPhone = digits.length > 10
    const isEmail = /^[\w.-]+@[\w.-]+\.\w+$/.test(value)
    return { isPhone, isEmail }
  }

  const handleContactInput = (value) => {
    const { isPhone, isEmail } = validateContact(value)

    if (activeRole === 'executor') {
      // заказчик → только телефон
      setPhoneNumber(value)
      setIsValidContact(isPhone)
      return
    }

    // исполнитель → телефон или email
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
      setUserEmail('')
      setPhoneNumber(value)
    }
  }

  // ------------------------------------
  // LocalStorage
  // ------------------------------------
  useEffect(() => {
    localStorage.setItem('loginStep', step)
  }, [step])

  useEffect(() => {
    const contactValue = phoneNumber || userEmail
    if (contactValue) localStorage.setItem('loginPhone', contactValue)
  }, [phoneNumber, userEmail])

  useEffect(() => {
    localStorage.setItem('loginCode', JSON.stringify(smsCode))
  }, [smsCode])

  // ------------------------------------
  // Code handler
  // ------------------------------------
  const codeArray = Array.isArray(smsCode) ? smsCode : ['', '', '', '']
  const isCodeComplete = codeArray.every(d => d)

  const handleCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const updated = [...codeArray]
      updated[index] = value
      setSmsCode(updated)

      if (value && index < 3) {
        document.getElementById(`code-${index + 1}`)?.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !codeArray[index] && index > 0)
      document.getElementById(`code-${index - 1}`)?.focus()
  }

  // ------------------------------------
  // Submit
  // ------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault()

    if (step === 1) {
      if (isValidContact) setStep(2)
      return
    }

    if (step === 2 && isCodeComplete) {
      localStorage.clear()
      setPhoneNumber('')
      setUserEmail('')
      setSmsCode(['', '', '', ''])
      alert('Успешный вход')
      navigate('/')
    }
  }

  // ------------------------------------
  // Reset
  // ------------------------------------
  const resetAll = () => {
    setPhoneNumber('')
    setUserEmail('')
    setSmsCode(['', '', '', ''])
    setIsValidContact(false)
    setStep(1)
    localStorage.clear()
  }

  const handleBack = () => {
    if (step === 2) {
      setSmsCode(['', '', '', ''])
      setStep(1)
      return
    }

    resetAll()
    navigate('/')
  }

  return (
    <div className='layout'>
      <Header hideElements={true} />

      <div className='enter-container'>
        <div className='login-container'>

          <div className='title'>
            <button className='btn-back' onClick={handleBack}>
              <img src={arrow} alt='Назад' />
            </button>
            <h2 className='login-title'>Вход</h2>
          </div>

          {/* РОЛИ */}
          {step === 1 && (
            <div className='role-buttons'>
              <button
                className={`role-button ${activeRole === 'executor' ? 'active' : ''}`}
                onClick={() => { setActiveRole('executor'); setUserEmail(''); }}
              >
                Я заказчик
              </button>

              <button
                className={`role-button ${activeRole === 'customer' ? 'active' : ''}`}
                onClick={() => { setActiveRole('customer'); setPhoneNumber(''); }}
              >
                Я исполнитель
              </button>
            </div>
          )}

          {/* ШАГ 1 */}
          {step === 1 && (
            <form className='login-form' onSubmit={handleSubmit}>
              <div className='form-group'>

                {activeRole === 'executor' ? (
                  <>
                    <label className='form-label'>Номер телефона</label>

                    <PhoneInput
                      value={phoneNumber}
                      ref={inputRef}
                      onChange={handleContactInput}
                      defaultCountry='ru'
                      international
                      countryCallingCodeEditable={false}
                      inputClassName='custom-phone-input'
                      countrySelectorStyleProps={{
                        buttonClassName: 'country-selector-button'
                      }}
                      showDisabledDialCodeAndPrefix={false}
                      forceDialCode={true}
                    />
                  </>
                ) : (
                  <>
                    <label className='form-label'>Номер телефона или почта</label>
                    <input
                      type='text'
                      value={phoneNumber || userEmail}
                      ref={inputRef}
                      onChange={(e) => handleContactInput(e.target.value)}
                      placeholder='Введите номер телефона или email'
                      className='custom-phone-input'
                      style={{ paddingLeft: '12px' }}
                    />
                  </>
                )}

              </div>

              <button
                type='submit'
                className={`continue-button ${!isValidContact ? 'disabled' : ''}`}
                disabled={!isValidContact}
              >
                Продолжить
              </button>
            </form>
          )}

          {/* ШАГ 2 */}
          {step === 2 && (
            <form className='login-form' onSubmit={handleSubmit}>
              <div className='form-group'>
                <label className='form-label'>
                  Код из {userEmail ? 'Email' : 'SMS'}
                  <div className='phone-preview'>
                    Код отправлен на: {userEmail || phoneNumber}
                  </div>
                </label>

                <div className='code-inputs'>
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      id={`code-${i}`}
                      type='text'
                      maxLength='1'
                      value={codeArray[i] || ''}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className='code-input'
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <div className='resend-code'>
                  <button type='button' className='resend-link'>Получить новый код</button>
                </div>
              </div>

              <button
                type='submit'
                className={`continue-button ${!isCodeComplete ? 'disabled' : ''}`}
                disabled={!isCodeComplete}
              >
                Продолжить
              </button>
            </form>
          )}

          <div className='register-link'>
            У вас еще нет аккаунта?{' '}
            <Link to='/simplified_registration_step1' className='register-here' onClick={resetAll}>
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
