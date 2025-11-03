import React, { useState } from 'react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { useNavigate } from 'react-router-dom'
import '../Registration.css'


export default function PhoneNumber() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [isValidPhone, setIsValidPhone] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(true)

  // проверка валидности номера тел
  const handlePhoneChange = (value) => {
    setPhone(value)
    const digitsOnly = value.replace(/\D/g, '')
    setIsValidPhone(digitsOnly.length > 10)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isValidPhone) {
      navigate('/simplified_registration_step2')
    } else {
      // Уже и так показываем ошибку, так как submitAttempted = true
      alert('Номер невалиден')
    }
  }


  return (    
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
        </div>
        <button 
                type="submit" 
                className={`continue-button ${!isValidPhone ? 'disabled' : ''}`}
                disabled={!isValidPhone}
            >
                Продолжить
        </button>
    </form>
  )
}
