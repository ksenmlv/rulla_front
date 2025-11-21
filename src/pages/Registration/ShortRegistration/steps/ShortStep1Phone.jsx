import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RoleSwitcher from '../../common/RoleSwitcher'
import PhoneNumber from '../../common/PhoneNumber'
import '../../Registration.css'
import '../../../Enter/Enter.css'
import arrow from '../../../../assets/Main/arrow_left.svg'



export default function ShortStep1Phone() {
  const { phoneNumber, setPhoneNumber } = useAppContext()  
  const [isValidPhone, setIsValidPhone] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const navigate = useNavigate()

  // локальное состояние для роли
  const [role, setRole] = useState('executor')

  // обработчик изменения роли
  const handleRoleChange = (newRole) => {
    setRole(newRole)
    if (newRole === 'customer') {
      navigate('/full_registration_step1') // переход на полный этап регистрации
    }
  }

  // проверка номера телефона
  const handlePhoneChange = (value) => {
    setPhoneNumber(value)
    const digitsOnly = value.replace(/\D/g, '')
    setIsValidPhone(digitsOnly.length > 10)
  }

  // восстановление валидности при возврате
  useEffect(() => {
    if (phoneNumber) {
      const digitsOnly = phoneNumber.replace(/\D/g, '')
      setIsValidPhone(digitsOnly.length > 10)
    }
  }, [])

  const handlePhoneSubmit = () => {
    setSubmitAttempted(true)
    if (!isValidPhone) return
    navigate('/simplified_registration_step2')
  }
  
  const handleBack = () => {
    navigate('/enter')
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

                <RoleSwitcher activeRole={role} onChangeRole={handleRoleChange}/>

                <h3 className='form-label' style={{margin: '39px 0 13px 0'}}>Номер телефона</h3>
                <PhoneNumber value={phoneNumber} onChange={handlePhoneChange} onPhoneSubmit={handlePhoneSubmit}/>

                <button 
                      className={`continue-button ${!isValidPhone ? 'disabled' : ''}`}
                      disabled={!isValidPhone}
                      onClick={handlePhoneSubmit}
                  > Продолжить </button> 
                
                <div className="register-link">
                    У вас уже есть аккаунт? <Link to="/enter" className="register-here">Войти</Link>
                </div>

            </div>
        </div>

        <Footer className='footer footer--registr' />
    </div>
  )
}
