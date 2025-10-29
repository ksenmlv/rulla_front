import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import '../Enter/Enter.css'
import arrow from '../../assets/Main/arrow_left.svg'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { Link, useNavigate } from 'react-router-dom'

function Enter() {
  const navigate = useNavigate()
  const [activeRole, setActiveRole] = useState('executor')       // or customer
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState(1)                            // 1 - ввод телефона, 2 - ввод кода
  const [isValidPhone, setIsValidPhone] = useState(false)
  const [code, setCode] = useState(['', '', '', ''])
  const [submitAttempted, setSubmitAttempted] = useState(false)  // попытка отправки 1 формы


  // проверка валидности номера тел
  const handlePhoneChange = (value) => {
    setPhone(value)
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
        console.log('Номер телефона:', phone)
        // Здесь можно отправить запрос для получения SMS кода

      }
    } else if (step === 2 && isCodeComplete) {
      console.log('Введенный код:', code.join(''))
      // Обработка ввода кода подтверждения

      // Здесь переход на следующую страницу или завершение входа
    }
  }


  // обработчик ввода кода
  const handleCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) { 
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)
      
      // автопереход к следующему полю
      if (value && index < 3) {
        document.getElementById(`code-input-${index + 1}`)?.focus()
      }
    }
  }

  // проверка заполненности всех полей кода
  const isCodeComplete = code.every(digit => digit !== '')

  // обработчик нажатия клавиш
  const handleKeyDown = (index, e) => {
    // Backspace
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
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
      setCode(['', '', '', ''])
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
                  value={phone}
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
                {submitAttempted && phone && !isValidPhone && (
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
                    Код отправлен на номер: {phone}
                  </div>
                </label>
                <div className="code-inputs">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      id={`code-input-${index}`}
                      type="text"
                      maxLength="1"
                      value={code[index]}
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