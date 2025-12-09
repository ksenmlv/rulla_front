import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RoleSwitcher from '../../common/RoleSwitcher'
import PhoneNumber from '../../common/PhoneNumber'
import '../../Registration.css'
import '../../../Enter/Enter.css'
import arrow from '../../../../assets/Main/arrow_left.svg'

export default function ShortStep1Phone() {
  const navigate = useNavigate()
  const inputRef = useRef()

  const { phoneNumber, setPhoneNumber, smsCode, setSmsCode } = useAppContext()

  const [role, setRole] = useState('customer')
  const [isValidPhone, setIsValidPhone] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  // шаги (1 — телефон, 2 — код)
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem('regShortStep')
    return saved ? Number(saved) : 1
  })

  // восстановление значений при загрузке
  useEffect(() => {
    const savedPhone = localStorage.getItem('regShortPhone')
    if (savedPhone) {
      setPhoneNumber(savedPhone)
      const digits = savedPhone.replace(/\D/g, '')
      setIsValidPhone(digits.length > 10)
    }

    const savedCode = localStorage.getItem('regShortCode')
    if (savedCode) {
      setSmsCode(JSON.parse(savedCode))
    }
  }, [])

  // сохранение состояния в storage
  useEffect(() => {
    localStorage.setItem('regShortStep', step)
  }, [step])

  useEffect(() => {
    if (phoneNumber) {
      localStorage.setItem('regShortPhone', phoneNumber)
    }
  }, [phoneNumber])

  useEffect(() => {
    localStorage.setItem('regShortCode', JSON.stringify(smsCode))
  }, [smsCode])

  const codeArray = Array.isArray(smsCode) ? smsCode : ['', '', '', '']

  // сброс всех значений
  const resetAll = () => {
    setPhoneNumber('')
    setSmsCode(['', '', '', ''])
    setIsValidPhone(false)
    setSubmitAttempted(false)
    setStep(1)

    localStorage.removeItem('regShortStep')
    localStorage.removeItem('regShortPhone')
    localStorage.removeItem('regShortCode')
  }

  // ввод телефона
  const handlePhoneChange = (value) => {
    setPhoneNumber(value)

    const digits = value.replace(/\D/g, '')
    setIsValidPhone(digits.length > 10)
  }

  const isCodeComplete = codeArray.every((d) => d)

  // обработка отправки
  const handleSubmit = (e) => {
    e.preventDefault()

    // ШАГ 1 — телефон
    if (step === 1) {
      setSubmitAttempted(true)
      if (isValidPhone) setStep(2)
      return
    }

    // ШАГ 2 — код
    if (step === 2 && isCodeComplete) {
      console.log('Регистрация:', phoneNumber, codeArray.join(''))

      // очистка storage
      localStorage.removeItem('regShortStep')
      localStorage.removeItem('regShortPhone')
      localStorage.removeItem('regShortCode')

      // очистка контекста
      setSmsCode(['', '', '', ''])
      setPhoneNumber('')

      // переход дальше
      navigate('/simplified_registration_step2')
    }
  }

  // смс код
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

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !codeArray[index] && index > 0)
      document.getElementById(`code-${index - 1}`)?.focus()

    if (e.key === 'ArrowLeft' && index > 0)
      document.getElementById(`code-${index - 1}`)?.focus()

    if (e.key === 'ArrowRight' && index < 3)
      document.getElementById(`code-${index + 1}`)?.focus()

    if (e.key === 'Enter' && isCodeComplete) handleSubmit(e)
  }


  // обработчик переключения роли
  const handleRoleChange = (newRole) => {
    setRole(newRole)
    if (newRole === 'executor') {
      resetAll()
      navigate('/full_registration_step0')
    }
  }

  // назад
  const handleBack = () => {
    if (step === 2) {
      setSmsCode(['', '', '', ''])
      setStep(1)
      return
    }

    resetAll()
    navigate('/enter')
  }

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container' style={{marginBottom: '240px'}}>
        <div className='registr-container' style={{ height: '565px' }}>

          <div className='title'>
            <button className='btn-back' onClick={handleBack}>
              <img src={arrow} alt='Назад' />
            </button>
            <h2 className='login-title'>Регистрация</h2>
          </div>

          {/* ШАГ 1 */}
          {step === 1 && (
            <>
              <RoleSwitcher activeRole={role} onChangeRole={handleRoleChange} />

              <h3 className='form-label' style={{ margin: '39px 0 12px 0' }}>Номер телефона</h3>

              <PhoneNumber
                value={phoneNumber}
                onChange={handlePhoneChange}
                ref={inputRef}
              />

              <button
                className={`continue-button ${!isValidPhone ? 'disabled' : ''}`}
                disabled={!isValidPhone}
                onClick={(e) => handleSubmit(e)}
              >
                Продолжить
              </button>
            </>
          )}

          {/* ШАГ 2 — код */}
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

          {/* ссылка на вход */}
          <div className='register-link'>
            У вас уже есть аккаунт?{' '}
            <Link to='/enter' className='register-here' onClick={resetAll}>
              Войти
            </Link>
          </div>

        </div>
      </div>

      <Footer className='footer footer--registr' />
    </div>
  )
}
