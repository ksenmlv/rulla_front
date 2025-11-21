import React, { useEffect, useRef, useState } from 'react'
import { PhoneInput } from 'react-international-phone'
import { useAppContext } from '../../../contexts/AppContext'
import { useNavigate } from 'react-router-dom'
import 'react-international-phone/style.css'
import '../Registration.css'


export default function PhoneNumber({ value, onChange, onPhoneSubmit }) {
  const navigate = useNavigate()
  const { phoneNumber, setPhoneNumber, stepNumber, userLawSubject } = useAppContext()
  const [isValidPhone, setIsValidPhone] = useState(false)
  const inputRef = useRef()

  // фокус на инпут при открытии формы
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [])

  // проверка валидности при монтировании компонента
  useEffect(() => {
    if (phoneNumber) {
      const digitsOnly = phoneNumber.replace(/\D/g, '')
      setIsValidPhone(digitsOnly.length > 10)
    }
  }, [phoneNumber]) 

  // проверка валидности номера тел
  const handlePhoneChange = (value) => {
    onChange(value) 
    const digitsOnly = value.replace(/\D/g, '')
    setIsValidPhone(digitsOnly.length > 10)
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isValidPhone) {
      if (onPhoneSubmit) {
        onPhoneSubmit()
      } else {
        navigate('/')
      }
    } else {
      alert('Пожалуйста, введите корректный номер телефона')
    }
  }


  return (    
    <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
            {/* {userLawSubject === 'legal_entity' ? <h3 className='form-label'>Контактный номер телефона генерального директора</h3> : <h3 className='form-label'>Номер телефона</h3>} */}

            <PhoneInput
                placeholder="Введите номер телефона"
                value={value}
                ref={inputRef}
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
          
        {/* 
        {stepNumber !== 7 && (
          <button 
                type="submit" 
                className={`continue-button ${!isValidPhone ? 'disabled' : ''}`}
                disabled={!isValidPhone}
            >
                Продолжить
          </button> 
        )} 
         */}

    </form>
  )
}
