import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RoleSwitcher from '../../common/RoleSwitcher'
import PhoneNumber from '../../common/PhoneNumber'
import '../../Registration.css'
import arrow from '../../../../assets/Main/arrow_left.svg'



export default function ShortStep1Phone() {
  const { phoneNumber } = useAppContext()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/enter')
  }

  const handlePhoneSubmit = () => {
    navigate('/simplified_registration_step2')
  }


  return (
    <div>
        <Header hideElements={true} />

        <div className='reg-container'>
            <div className='registr-container' style={{height: '580px'}}>

                <div className='title'>
                    <button className='btn-back' onClick={handleBack}>
                        <img src={arrow} alt='Назад' />
                    </button>
                    <h2 className="login-title">Регистрация</h2>
                </div>

                <RoleSwitcher />
                <PhoneNumber onPhoneSubmit={handlePhoneSubmit}/>
                
                <div className="register-link">
                    У вас уже есть аккаунт? <Link to="/enter" className="register-here">Войти</Link>
                </div>

            </div>
        </div>

        <Footer className='footer footer--registr' />
    </div>
  )
}
