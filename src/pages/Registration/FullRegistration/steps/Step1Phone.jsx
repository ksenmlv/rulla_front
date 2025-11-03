import React, { useState } from 'react'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import PhoneNumber from '../../common/PhoneNumber'
import '../../Registration.css'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale.svg'
import { Link, useNavigate } from 'react-router-dom'


export default function Step1Phone() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)                              // 1 - ввод телефона, 2 - ввод кода
  const [isValidPhone, setIsValidPhone] = useState(false)
  const [code, setCode] = useState(['', '', '', ''])
  const [submitAttempted, setSubmitAttempted] = useState(false)    // попытка отправки 1 формы

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container'>
            <div className='registr-container' style={{height: '539px'}}>

                <div className='title'>
                    <button className='btn-back' onClick={handleBack}>
                        <img src={arrow} alt='Назад' />
                    </button>
                    <h2 className="login-title">Регистрация</h2>
                </div>

                <div className='registr-scale'>
                    <p>1/7</p>
                    <img src={scale} alt='Registration scale' />
                </div>

                <PhoneNumber />

                <div className="register-link">
                    У вас уже есть аккаунт? <Link to="/" className="register-here">Войти</Link>
                </div>


            </div>
        </div>

      <Footer className='footer footer--registr' />
    </div>
  )
}
