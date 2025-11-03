import React, { useState } from 'react'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RoleSwitcher from '../../common/RoleSwitcher'
import { Link, useNavigate } from 'react-router-dom'
import '../../Registration.css'
import arrow from '../../../../assets/Main/arrow_left.svg'


export default function ShortStep2Name() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/enter')
  }

  const [isChecked, setIsChecked] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    region: ''
  })

  // проверка на заполненность полей и галочкм
  const isFormValid = formData.name.trim() !== '' && formData.region.trim() !== '' && isChecked

  const handleNameChange = (e) => {
    const value = e.target.value
    const onlyLetters = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '')
    setFormData(prev => ({
      ...prev,
      name: onlyLetters
    }))
  }

  const handleRegionChange = (e) => {
    const value = e.target.value
    const onlyLetters = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '')
    setFormData(prev => ({
      ...prev,
      region: onlyLetters
    }))
  }

  // нажатие на кнопку "Зарегистрироваться"
  const handleSubmit = () => {
    if (isFormValid) {
      // Логика регистрации
      console.log('Форма отправлена:', formData)
      // navigate('/next-step') // Переход на следующий шаг
      alert('Упрощенная регистрация завершена!')
      navigate('/')
    }
  }


  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container'>
        <div className='registr-container' style={{height: '731px'}}>

            <div className='title'>
                <button className='btn-back' onClick={handleBack}>
                    <img src={arrow} alt='Назад' />
                </button>
                <h2 className="login-title">Регистрация</h2>
            </div>

            <RoleSwitcher />

            <div className='input-fields'>
              <h3>Имя</h3>
              <input type='text' placeholder='Введите ваше имя' value={formData.name} onChange={handleNameChange}/>
              <h3>Регион</h3>
              <input type='text' placeholder='Укажите свой регион' value={formData.region} onChange={handleRegionChange }/>
            </div>

            {/* Checkbox с политикой конфиденциальности */}
            <div className="checkbox-wrapper" onClick={() => setIsChecked(!isChecked)}>
              <div className={`custom-checkbox ${isChecked ? 'checked' : ''}`}>
                {isChecked && <span className="checkmark">✓</span>}
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
