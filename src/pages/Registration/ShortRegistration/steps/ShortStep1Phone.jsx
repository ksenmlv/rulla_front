import React, { useState } from 'react'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RoleSwitcher from '../../common/RoleSwitcher'
import PhoneNumber from '../../common/PhoneNumber'
import '../../Registration.css'
import arrow from '../../../../assets/Main/arrow_left.svg'
import { Link, useNavigate } from 'react-router-dom'


export default function ShortStep1Phone() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/enter')
  }

  return (
    <div>
        <Header hideElements={true} />

        <div className='full-reg-container'>
            <div className='registr-container' style={{height: '560px'}}>

                <div className='title'>
                    <button className='btn-back' onClick={handleBack}>
                        <img src={arrow} alt='Назад' />
                    </button>
                    <h2 className="login-title">Регистрация</h2>
                </div>

                <RoleSwitcher />
                <PhoneNumber />
                
                <div className="register-link">
                    У вас еще нет аккаунта? <Link to="/simplified_registration_step1" className="register-here">Зарегистрироваться</Link>
                </div>

            </div>
        </div>

        <Footer className='footer footer--registr' />
    </div>
  )
}
