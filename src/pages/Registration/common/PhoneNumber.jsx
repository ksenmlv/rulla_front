import React, { useEffect, useRef, useState } from 'react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import '../Registration.css'

export default function PhoneNumber({ value, onChange, onValidityChange }) {
  const inputRef = useRef(null)
  const [isValidPhone, setIsValidPhone] = useState(false)

  // фокус на поле при монтировании
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // функция валидации
  const validatePhone = (value) => {
    const digitsOnly = value.replace(/\D/g, '')
    return digitsOnly.length > 10
  }

  // обработка изменения номера
  const handlePhoneChange = (value, meta) => {
    onChange(value, meta)

    const isValid = validatePhone(value)
    setIsValidPhone(isValid)

    if (onValidityChange) {
      onValidityChange(isValid)
    }
  }

  // если value меняется извне (например, при возврате на экран)
  useEffect(() => {
    if (!value) {
      setIsValidPhone(false)
      onValidityChange?.(false)
      return
    }

    const isValid = validatePhone(value)
    setIsValidPhone(isValid)
    onValidityChange?.(isValid)
  }, [value])

  return (
    <div className="form-group">
      <PhoneInput
        ref={inputRef}
        value={value}
        onChange={handlePhoneChange}
        defaultCountry="ru"
        international
        forceDialCode
        countryCallingCodeEditable={false}
        placeholder="Введите номер телефона"
        inputClassName="custom-phone-input"
        countrySelectorStyleProps={{
          buttonClassName: 'country-selector-button',
        }}
        showDisabledDialCodeAndPrefix={false}
      />
    </div>
  )
}
