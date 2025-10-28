import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import '../Enter/Enter.css'
import arrow from '../../assets/Main/arrow_left.svg'


function Enter() {
  const [activeRole, setActiveRole] = useState('executor')   //or customer

  return (
    <div className='layout'>
      <Header hideElements={true} />

      <div className='enter-container'>
        <div className="login-container">

          <div className='title'>
            <button className='btn-back'><img src={arrow} alt='Назад' /></button>
            <h2 className="login-title">Вход</h2>
          </div>

          {/* переключатель роли: заказчик/исполнитель */}
          <div className="role-buttons">
            
            <button 
              className={`role-button ${activeRole === 'executor' ? 'active' : ''}`} 
              onClick={() => setActiveRole('executor')}> Я заказчик
            </button>
            <button 
              className={`role-button ${activeRole === 'customer' ? 'active' : ''}`}
              onClick={() => setActiveRole('customer')}>Я исполнитель
            </button>
          </div>

          {/* инпут номера телефона */}
          <form className="login-form">
            <div className="form-group">
              <label className="form-label">Номер телефона</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+7 123 445 78 90"
              />
            </div>
            <button type="submit" className="continue-button">Продолжить</button>
          </form>

          <div className="register-link">
            У вас еще нет аккаунта? <a href="#" className="register-here">Зарегистрироваться</a>
          </div>

        </div>
      </div>
      



      <Footer className='footer footer--enter' />
    </div>
  )
}

export default Enter
