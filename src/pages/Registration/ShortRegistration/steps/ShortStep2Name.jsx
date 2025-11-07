import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RoleSwitcher from '../../common/RoleSwitcher'
import '../../Registration.css'
import arrow from '../../../../assets/Main/arrow_left.svg'
import { name } from 'file-loader'


export default function ShortStep2Name() {
  const { userName, userRegion, setUserName, setUserRegion, setPhoneNumber } = useAppContext()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/simplified_registration_step1')
  }

  const [isChecked, setIsChecked] = useState(false)


  // проверка на заполненность полей и галочкм
  const isFormValid = userName.trim() !== '' && userRegion.trim() !== '' && isChecked

  const handleNameChange = (e) => {
    const value = e.target.value
    const onlyLettersName = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '')
    setUserName(onlyLettersName)
  }

  const handleRegionChange = (e) => {
    const value = e.target.value
    const onlyLettersRegion = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '')
    setUserRegion(onlyLettersRegion)
  }

  // нажатие на кнопку "Зарегистрироваться"
  const handleSubmit = () => {
    if (isFormValid) {
      // Логика регистрации
      console.log('Данные для регистрации:', {name: userName, region: userRegion})
      // navigate('/next-step') // Переход на следующий шаг
      setPhoneNumber('')
      setUserName('')
      setUserRegion('')
      alert('Упрощенная регистрация завершена!')
      navigate('/')
    }
  }


  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container'>
        <div className='registr-container' style={{height: '610px'}}>

            <div className='title'>
                <button className='btn-back' onClick={handleBack}>
                    <img src={arrow} alt='Назад' />
                </button>
                <h2 className="login-title">Регистрация</h2>
            </div>

            <div className='input-fields'>
              <h3>Имя</h3>
              <input type='text' placeholder='Введите ваше имя' value={userName} onChange={handleNameChange}/>
              <h3>Регион</h3>
              <input type='text' placeholder='Укажите свой регион' value={userRegion} onChange={handleRegionChange }/>
            </div>

            {/* Checkbox с политикой конфиденциальности */}
            <div className="checkbox-wrapper" onClick={() => setIsChecked(!isChecked)}>
              <div 
                className={`custom-checkbox ${isChecked ? 'checked' : ''}`} 
                onClick={() => setIsChecked(!isChecked)} >
                  {isChecked && <span className="inner-square"></span>}
              </div>
              <span className="checkbox-text">Я соглашаюсь с <a className='policy-link'>политикой конфеденциальности</a> и обработкой персональных данных</span>
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
