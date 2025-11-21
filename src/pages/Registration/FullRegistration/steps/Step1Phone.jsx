import '../../Registration.css'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import PhoneNumber from '../../common/PhoneNumber'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale.svg'


export default function Step1Phone() {
  const navigate = useNavigate()
  const { stepNumber, setStepNumber, phoneNumber, setPhoneNumber, smsCode, setSmsCode } = useAppContext()
  const [step, setStep] = useState(1)                              // 1 - ввод телефона, 2 - ввод кода
  const [isValidPhone, setIsValidPhone] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)    // попытка отправки 1 формы для отображения ошибок

  // преобразование smsCode в массив для работы с инпутами
  const codeArray = Array.isArray(smsCode) ? smsCode : ['', '', '', '']

  // восстановление валидности при возврате
  useEffect(() => {
    if (phoneNumber) {
      const digits = phoneNumber.replace(/\D/g, '')
      setIsValidPhone(digits.length > 10)
    }
  }, [])

  // проверка номера
  const handlePhoneChange = (value) => {
    setPhoneNumber(value)

    const digits = value.replace(/\D/g, '')
    setIsValidPhone(digits.length > 10)
  }

  // обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault()

    if (step === 1) {
      setSubmitAttempted(true)

      if (isValidPhone) {
        setStep(2)
        console.log('Номер телефона:', phoneNumber)
      }
      return
    }

    if (step === 2 && isCodeComplete) {
      console.log('Номер телефона:', phoneNumber, 'Код:', codeArray.join(''))
      setPhoneNumber('')
      setSmsCode('')
      setStepNumber(stepNumber + 1)
    }
  }

  const handlePhoneSubmit = () => {
    setSubmitAttempted(true)
    if (isValidPhone) setStep(2)
  }

  // обработка смс кода
  const handleCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) { 
      const newCode = [...codeArray]
      newCode[index] = value
      setSmsCode(newCode)
      
      if (value && index < 3) {
        document.getElementById(`code-input-${index + 1}`)?.focus()
      }
    }
  }

  const isCodeComplete = codeArray.length === 4 && codeArray.every((digit) => digit !== '' && digit !== null && digit !== undefined)

  // обработка клавиш при вводе кода
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!codeArray[index] && index > 0) {
        document.getElementById(`code-input-${index - 1}`)?.focus()
      }
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`code-input-${index - 1}`)?.focus()
    }
    
    if (e.key === 'ArrowRight' && index < 3) {
      document.getElementById(`code-input-${index + 1}`)?.focus()
    }
    
    if (e.key === 'Enter' && isCodeComplete) handleSubmit(e)
  }

  const handleBack = () => {
    if (step === 2) {
      setSmsCode(['', '', '', ''])
      setStep(1) 
      return
    } else {
      navigate('/')
    }
  }

  const handleForward = () => {
    navigate('/full_registration_step2')
  }


  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container'>
            <div className='registr-container' style={{height: step === 1 ? '539px' : '650px'}}>

                <div className='title'>
                    <button className='btn-back' onClick={handleBack}>
                        <img src={arrow} alt='Назад' />
                    </button>
                    <h2 className="login-title">Полная регистрация</h2>
                </div>

                <div className='registr-scale'>
                    <p>1/7</p>
                    <img src={scale} alt='Registration scale' />
                </div>

                {/* --- ШАГ 1: ввод телефона --- */}
                {step === 1 && (
                  <>
                    <h3 className='form-label'>Номер телефона</h3>
                    <PhoneNumber value={phoneNumber} onChange={handlePhoneChange} onPhoneSubmit={handlePhoneSubmit} />

                    <button 
                        className={`continue-button ${!isValidPhone ? 'disabled' : ''}`}
                        disabled={!isValidPhone}
                        onClick={handlePhoneSubmit}
                    > Продолжить </button> 
                  </>
                )}

                {/* --- ШАГ 2: код --- */}
                {step === 2 && (
                  <form className="login-form" onSubmit={handleSubmit} >
                    <div className="form-group">

                      <label className="form-label">
                        Код из СМС
                        <div className="phone-preview">
                          Код отправлен на номер: {phoneNumber}
                        </div>
                      </label>

                      {/* инпуты для кода */}
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
                        <button type="button" className="resend-link">
                          Получить новый код
                        </button>
                      </div>

                    </div>

                    <button 
                      type="submit" 
                      className={`continue-button ${!isCodeComplete ? 'disabled' : ''}`} 
                      disabled={!isCodeComplete}
                      onClick={handleForward}
                    > Продолжить </button>

                  </form>
                )}

                <div className="register-link">
                    У вас уже есть аккаунт? <Link to="/enter" className="register-here">Войти</Link>
                </div>

            </div>
        </div>

      <Footer className='footer footer--registr' />
    </div>
  )
}
