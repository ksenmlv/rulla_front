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

  const { phoneNumber, setPhoneNumber, smsCode, setSmsCode } = useAppContext()

  const [activeRole, setActiveRole] = useState('executor')
  const [isValidPhone, setIsValidPhone] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  // 1 этап - телефон, 2 этап - смс
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem('loginStep')
    return saved ? Number(saved) : 1
  })

  // монтирование формы
  useEffect(() => {
    localStorage.removeItem('loginStep')
    localStorage.removeItem('loginPhoneNumber')
    setSmsCode(['', '', '', ''])
    setPhoneNumber('')
    setStep(1)
  }, [])


  // сохранение шага + очистка
  useEffect(() => {
    localStorage.setItem('loginStep', step)

    if (step === 1) {
      localStorage.removeItem('loginPhoneNumber')
      setSmsCode(['', '', '', ''])
    }
    if (step === 2 && phoneNumber) {
      localStorage.setItem('loginPhoneNumber', phoneNumber)
    }
  }, [step, phoneNumber])

  // восстановление телефона
  useEffect(() => {
    if (step === 2) {
      const saved = localStorage.getItem('loginPhoneNumber')
      if (saved) {
        setPhoneNumber(saved)
        setIsValidPhone(true)
      }
    }
  }, [step])

  // фокус на первое поле
  useEffect(() => {
    inputRef.current?.focus()
  }, [activeRole])

  // преобразование smsCode
  const codeArray = Array.isArray(smsCode) ? smsCode : ['', '', '', '']

  // обработка телефона
  const handlePhoneChange = (value) => {
    setPhoneNumber(value)
    const digits = value.replace(/\D/g, '')
    setIsValidPhone(digits.length > 10)
  }

  const isCodeComplete = codeArray.every((d) => d)

  // обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault()

    if (step === 1) {
      setSubmitAttempted(true)
      if (isValidPhone) setStep(2)
      return
    }

    if (step === 2 && isCodeComplete) {
      console.log('Телефон:', phoneNumber, 'Код:', codeArray.join(''))
      localStorage.removeItem('loginStep')
      localStorage.removeItem('loginPhoneNumber')
      setPhoneNumber('')
      setSmsCode(['', '', '', ''])
      navigate('/')
      alert('Успешный вход')
    }
  }

  const handleCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...codeArray]
      newCode[index] = value
      setSmsCode(newCode)

      if (value && index < 3) {
        document.getElementById(`code-${index + 1}`)?.focus()
      }
    }
  }

  // обработка клавиш при вводе кода
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !codeArray[index] && index > 0)
      document.getElementById(`code-${index - 1}`)?.focus()

    if (e.key === 'ArrowLeft' && index > 0)
      document.getElementById(`code-${index - 1}`)?.focus()

    if (e.key === 'ArrowRight' && index < 3)
      document.getElementById(`code-${index + 1}`)?.focus()

    if (e.key === 'Enter' && isCodeComplete) handleSubmit(e)
  }

  const handleBack = () => {
    if (step === 2) {
      setSmsCode(['', '', '', ''])
      setStep(1)
      return
    }
    localStorage.removeItem('loginStep')
    localStorage.removeItem('loginPhoneNumber')
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

          {step === 1 && (
            <div className='role-buttons'>
              <button
                className={`role-button ${activeRole === 'executor' ? 'active' : ''}`}
                onClick={() => setActiveRole('executor')}
              >
                Я заказчик
              </button>

              <button
                className={`role-button ${activeRole === 'customer' ? 'active' : ''}`}
                onClick={() => setActiveRole('customer')}
              >
                Я исполнитель
              </button>
            </div>
          )}

          {/* --- ШАГ 1: телефон --- */}
          {step === 1 && (
            <form className='login-form' onSubmit={handleSubmit}>
              <div className='form-group'>
                <label className='form-label'>Номер телефона</label>

                <PhoneInput
                  value={phoneNumber}
                  ref={inputRef}
                  onChange={handlePhoneChange}
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

                {/* {submitAttempted && !isValidPhone && (
                  <div className='error-message' style={{marginBottom: '-20px'}}>Введите корректный номер телефона</div>
                )} */}
              </div>

              <button
                type='submit'
                className={`continue-button ${!isValidPhone ? 'disabled' : ''}`}
                disabled={!isValidPhone}
              >
                Продолжить
              </button>
            </form>
          )}

          {/* --- ШАГ 2: код --- */}
          {step === 2 && (
            <form className='login-form' onSubmit={handleSubmit}>
              <div className='form-group'>
                <label className='form-label'>
                  Код из СМС
                  <div className='phone-preview'>Код отправлен на номер: {phoneNumber}</div>
                </label>

                <div className='code-inputs'>
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type='text'
                      maxLength='1'
                      value={codeArray[index] || ''}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className='code-input'
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <div className='resend-code'>
                  <button type='button' className='resend-link'>
                    Получить новый код
                  </button>
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
