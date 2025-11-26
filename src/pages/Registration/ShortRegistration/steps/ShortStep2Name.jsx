import arrow from '../../../../assets/Main/arrow_left.svg'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RegistrSelector from '../../../../components/lists/RegistrSelector'
import '../../Registration.css'


export default function ShortStep2Name() {
  const { userName, userRegion, setUserName, setUserRegion, userEmail, setUserEmail, setPhoneNumber } = useAppContext()

  const navigate = useNavigate()
  const nameInputRef = useRef(null)

  const [isCheckedPolicy, setIsCheckedPolicy] = useState(false)                      // чекбокс политики конф
  const [isCheckedMarketing, setIsCheckedMarketing] = useState(false)               // чекбокс с маркетингом
  const [emailError, setEmailError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)                             // состояние для показа ошибки почты

  // локальные состояние
  const [localEmail, setLocalEmail] = useState(userEmail || '')
  const [localName, setLocalName] = useState(userName || '')

  // автофокус на первое поле при монтировании компонента
  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  // валидация e-mail
  const validateEmail = (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)

  // общая валидность
  const isFormValid = localName.trim() !== '' && localEmail.trim() !== '' && validateEmail(localEmail) && isCheckedPolicy

  // ввод имени
  const handleNameChange = (e) => {
    const clean = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '')
    setLocalName(clean)
  }

  // ввод почты
  const handleEmailChange = (e) => {
    const value = e.target.value
    setLocalEmail(value)

    // не показываем ошибку во время набора
    if (isSubmitted) {
      setEmailError(validateEmail(value) ? '' : 'Введите корректный email')
    }
  }


  // const handleRegionSelect = (selectedRegions) => {
  //   setUserRegion(selectedRegions.join(', '))
  // }


  // обработка кнопки "Зарегистрироваться"
  const handleSubmit = () => {
    setIsSubmitted(true)
    // если email неверный — не отправляем
    if (!validateEmail(localEmail)) {
      setEmailError("Введите корректный email")
      return
    }

    if (!isFormValid) return

    // сохранение контекста при сабмите
    setUserName(localName)
    setUserEmail(localEmail)

    console.log('Регистрация:', {
      name: localName,
      email: localEmail
    })

    // очистка
    setPhoneNumber('')
    setLocalName('')
    setLocalEmail('')

    alert('Упрощенная регистрация завершена!')
    navigate('/')
  }

  const handleBack = () => {
    navigate('/simplified_registration_step1')
  }


  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container'>
        <div className='registr-container' style={{ height: 'auto', paddingBottom: '20px' }}>

            <div className='title'>
                <button className='btn-back' onClick={handleBack}>
                    <img src={arrow} alt='Назад' />
                </button>
                <h2 className="login-title">Регистрация</h2>
            </div>

            <div className='input-fields'>
              <h3>Имя</h3>
              <input type='text' ref={nameInputRef} placeholder='Введите ваше имя' value={localName} onChange={handleNameChange}/>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3>Электронная почта</h3>
                  {isSubmitted  && emailError && (
                      <span style={{
                          color: '#ff4444',
                          fontSize: '16px',
                          fontWeight: '700',
                          margin: '0 0 7px auto',
                      }}>
                          {emailError}
                      </span>
                  )}
              </div>

              <input
                  type="text"
                  placeholder="Введите почту"
                  value={localEmail}
                  onChange={handleEmailChange}
              />

              {/* <RegistrSelector
                subject={['Москва', 'Омск', 'Тюмень', 'Новгород', 'Сочи', 'Ростов']}
                placeholder="Выберите предмет"
                multiple={true}
                maxSelect={2}
                onSelect={handleRegionSelect}
              /> */}

            </div>

            {/* checkbox с политикой конфиденциальности */}
            <div className="checkbox-wrapper" onClick={() => setIsCheckedPolicy(!isCheckedPolicy)}>
              <div 
                className={`custom-checkbox ${isCheckedPolicy ? 'checked' : ''}`} 
                onClick={() => setIsCheckedPolicy(!isCheckedPolicy)} >
                  {isCheckedPolicy && <span className="inner-square"></span>}
              </div>
              <span className="checkbox-text">Соглашаюсь с <a className='policy-link'>политикой конфеденциальности</a> и <a className='policy-link'>обработкой персональных данных</a></span>
            </div>

            {/* checkbox с маркетингом */}
            <div className="checkbox-wrapper" onClick={() => setIsCheckedMarketing(!isCheckedMarketing)} style={{margin: '5px 0 15px 0'}}>
              <div 
                className={`custom-checkbox ${isCheckedMarketing ? 'checked' : ''}`} 
                onClick={() => setIsCheckedMarketing(!isCheckedMarketing)} >
                  {isCheckedMarketing && <span className="inner-square"></span>}
              </div>
              <span className="checkbox-text"> Хочу получать рекламные рассылки и специальные предложения </span>
            </div>

            <button 
                type="submit" 
                className={`continue-button ${!isFormValid ? 'disabled' : ''}`}
                disabled={!isFormValid}
                onClick={handleSubmit}
            >
                Зарегистрироваться
            </button>

            <div className="register-link">
                У вас уже есть аккаунт? <Link to="/enter" className="register-here">Войти</Link>
            </div>

        </div>
      </div>

      <Footer className='footer footer--registr' />
    </div>
  )
}
