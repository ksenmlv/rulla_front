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
  const [activeRole, setActiveRole] = useState('executor')       // or customer
  const [step, setStep] = useState(1)                            // 1 - ввод телефона, 2 - ввод кода
  const [isValidPhone, setIsValidPhone] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)  // попытка отправки 1 формы

  // фокус на инпут
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // преобразование smsCode в массив для работы с инпутами
  const codeArray = Array.isArray(smsCode) ? smsCode : (typeof smsCode === 'string' ? smsCode.split('') : ['', '', '', ''])


  // проверка валидности номера тел
  const handlePhoneChange = (value) => {
    setPhoneNumber(value)
    const digitsOnly = value.replace(/\D/g, '')
    setIsValidPhone(digitsOnly.length > 10)
  }

  // обработка нажатия на кнопку "Продолжить"
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (step === 1) {
      setSubmitAttempted(true)    // флаг попытки отправки
      
      if (isValidPhone) {
        setStep(2)
        console.log('Номер телефона:', phoneNumber)
        // Здесь можно отправить запрос для получения SMS кода

      }
    } else if (step === 2 && isCodeComplete) {
      console.log('Введенный код:', codeArray.join(''))
      // Обработка ввода кода подтверждения

      // переход на следующую страницу и завершение входа
      setPhoneNumber('')
      setSmsCode('')
      alert('Успешный вход')
      navigate('/')
    }
  }


  // обработчик ввода кода
  const handleCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) { 
      const newCode = [...codeArray]
      newCode[index] = value
      setSmsCode(newCode)
      
      // автопереход к следующему полю
      if (value && index < 3) {
        document.getElementById(`code-input-${index + 1}`)?.focus()
      }
    }
  }

  // проверка заполненности всех полей кода
  const isCodeComplete = codeArray.every(digit => digit !== '')

  // обработчик нажатия клавиш
  const handleKeyDown = (index, e) => {
    // Backspace
    if (e.key === 'Backspace') {
      if (!codeArray[index] && index > 0) {
        // поле пустое и нажали Backspace - переход к предыдущему полю
        document.getElementById(`code-input-${index - 1}`)?.focus()
      }
    }
    
    // обработка стрелок
    if (e.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`code-input-${index - 1}`)?.focus()
    }
    
    if (e.key === 'ArrowRight' && index < 3) {
      document.getElementById(`code-input-${index + 1}`)?.focus()
    }
    
    // обработка Enter - отправка формы если все поля заполнены
    if (e.key === 'Enter' && isCodeComplete) {
      handleSubmit(e)
    }
  }


  const handleBack = () => {
    if (step === 2) {
      setSmsCode(['', '', '', ''])
      setStep(1)
    } else {
      navigate('/')
    }
  }



  return (
    <div className='layout'>
      <Header hideElements={true} />

      <div className='enter-container'>
        <div className="login-container">

          <div className='title'>
            <button className='btn-back' onClick={handleBack}>
              <img src={arrow} alt='Назад' />
            </button>
            <h2 className="login-title">
              Вход
            </h2>
          </div>

          {/* переключатель роли: заказчик/исполнитель */}
          {step === 1 && (
            <div className="role-buttons">
              <button 
                className={`role-button ${activeRole === 'executor' ? 'active' : ''}`} 
                onClick={() => setActiveRole('executor')}> 
                Я заказчик
              </button>
              <button 
                className={`role-button ${activeRole === 'customer' ? 'active' : ''}`}
                onClick={() => setActiveRole('customer')}>
                Я исполнитель
              </button>
            </div>
          )}

          {/* форма ввода телефона */}
          {step === 1 && (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Номер телефона</label>
                <PhoneInput
                  placeholder="Введите номер телефона"
                  value={phoneNumber}
                  ref={inputRef}
                  onChange={handlePhoneChange}
                  defaultCountry="ru"
                  international
                  countryCallingCodeEditable={false}
                  inputClassName='custom-phone-input'
                  countrySelectorStyleProps={{
                    buttonClassName: "country-selector-button"
                  }}
                  showDisabledDialCodeAndPrefix={false}
                  forceDialCode={true}
                />
                {submitAttempted && phoneNumber && !isValidPhone && (
                  <div className="error-message">
                    Введите корректный номер телефона
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                className={`continue-button ${!isValidPhone ? 'disabled' : ''}`}
                disabled={!isValidPhone}
              >
                Продолжить
              </button>
            </form>
          )}

          {/* Форма ввода кода подтверждения */}
          {step === 2 && (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Код из СМС
                  <div className="phone-preview">
                    Код отправлен на номер: {phoneNumber}
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
                      // Здесь можно добавить логику для управления вводом кода
                    />
                  ))}
                </div>
                <div className="resend-code">
                  <button type="button" className="resend-link">
                    Получить новый код
                  </button>
                </div>
              </div>
              <button type="submit" className={`continue-button ${!isCodeComplete ? 'disabled' : ''}`} disabled={!isCodeComplete}>
                Продолжить
              </button>
            </form>
          )}


          <div className="register-link">
            У вас еще нет аккаунта? <Link to="/simplified_registration_step1" className="register-here">Зарегистрироваться</Link>
          </div>
          

        </div>
      </div>

      <Footer className='footer footer--enter' />
    </div>
  )
}

export default Enter