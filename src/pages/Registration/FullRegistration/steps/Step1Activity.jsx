import '../../Registration.css'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RegistrSelector from '../../../../components/lists/RegistrSelector'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale.svg'
import icon_close_modal from '../../../../assets/Main/icon_close_modal.svg'
import apiClient from '../../../../api/client'
import '../../../../styles/Modal.css'
import { citiesApi } from '../../../../api/citiesApi.ts'

export default function Step1Activity() {
  const navigate = useNavigate()
  const { stepNumber, setStepNumber, travelReadiness, setTravelReadiness, userLawSubject } = useAppContext()

  const fioInputRef = useRef(null)
  const companyNameRef = useRef(null)

  // Локальные данные для валидации
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [companyName, setCompanyName] = useState('')

  // Ошибки — показываем только после нужного события
  const [birthDateError, setBirthDateError] = useState('')

  // Города
  const [cities, setCities] = useState([])
  const [selectedCities, setSelectedCities] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [modalMessage, setModalMessage] = useState(null)
  const openModal = (msg) => setModalMessage(msg)
  const closeModal = () => setModalMessage(null)

  // Состояние валидности формы (обновляется автоматически)
  const [formIsValid, setFormIsValid] = useState(false)

  // Загрузка городов
  useEffect(() => {
    const loadCities = async () => {
      try {
        const all = await citiesApi.getAllCities()
        setCities(all.sort((a, b) => a.name.localeCompare(b.name, 'ru')))
      } catch (err) {
        console.error('Ошибка загрузки городов:', err)
      }
    }
    loadCities()
  }, [])

  // Автофокус — только при монтировании
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userLawSubject === 'individual' && fioInputRef.current) {
        fioInputRef.current.focus()
      } else if (userLawSubject === 'legal_entity' && companyNameRef.current) {
        companyNameRef.current.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Валидация ФИО 
  const handleFullNameChange = (e) => {
    const value = e.target.value
    const allowed = /^[А-Яа-яЁёA-Za-z\s\-']*$/
    if (allowed.test(value)) {
      setFullName(value)
    }
  }


  // Валидация даты рождения 
  const isValidDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 10) return false
    const digits = dateStr.replace(/\D/g, '')
    if (digits.length !== 8) return false

    const day = parseInt(digits.slice(0,2))
    const month = parseInt(digits.slice(2,4))
    const year = parseInt(digits.slice(4,8))

    // Запрещаем годы раньше 1900
    if (year < 1900) return false

    const date = new Date(year, month - 1, day)
    const today = new Date()

    // Проверяем реальность даты + не в будущем
    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year ||
      date > today
    ) return false

    // Минимум 18 лет
    let age = today.getFullYear() - date.getFullYear()
    const m = today.getMonth() - date.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--
    }
    return age >= 18
  }

  const handleDateChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0,8)
    let formatted = digits
    if (digits.length > 4) formatted = digits.slice(0,2) + '.' + digits.slice(2,4) + '.' + digits.slice(4,8)
    else if (digits.length > 2) formatted = digits.slice(0,2) + '.' + digits.slice(2)

    setBirthDate(formatted)

    // Ошибку показываем только после ввода всей даты
    if (formatted.length === 10) {
      setBirthDateError(isValidDate(formatted) ? '' : 'Некорректная дата (год ≥ 1900, не в будущем)')
    } else {
      setBirthDateError('')
    }
  }

  // Автоматическая валидация формы 
  useEffect(() => {
    let valid = true

    if (userLawSubject === 'individual') {
      const birthErr = birthDate.length === 10 
        ? (isValidDate(birthDate) ? '' : 'Некорректная дата (год ≥ 1900, не в будущем)')
        : 'Введите дату в формате ДД.ММ.ГГГГ'
      if (birthErr) valid = false

      if (selectedCities.length === 0) valid = false
    } else {
      if (companyName.trim().length === 0) valid = false
      if (selectedCities.length === 0) valid = false
    }

    setFormIsValid(valid)
  }, [fullName, birthDate, companyName, selectedCities, userLawSubject])

  //  Финальная проверка + установка ошибок при нажатии кнопки 
  const handleForward = async () => {
    // Устанавливаем ошибки для показа
    const birthErr = birthDate.length === 10 
      ? (isValidDate(birthDate) ? '' : 'Некорректная дата (год ≥ 1900, не в будущем)')
      : 'Введите дату в формате ДД.ММ.ГГГГ'
    setBirthDateError(birthErr)

    // Если есть ошибки — не продолжаем
    if ( birthDateError || selectedCities.length === 0) return

    setIsLoading(true)

    try {
      if (userLawSubject === 'individual') {
        const parts = fullName.trim().split(' ')
        const lastName = parts[0] || null
        const firstName = parts[1] || null
        const middleName = parts[2] || null

        const [day, month, year] = birthDate.split('.')
        const isoBirthDate = `${year}-${month}-${day}`

        await apiClient.patch('/executors/individuals/me/base-data', {
          firstName,
          lastName,
          middleName,
          birthDate: isoBirthDate
        })
      }

      const regionsPayload = selectedCities.map(cityId => ({
        regionType: "CITY",
        cityId,
        regionId: null
      }))

      await apiClient.put('/executors/me/regions', {
        regions: regionsPayload
      })

      setStepNumber(stepNumber + 1)
      navigate('/full_registration_step2')
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка сохранения данных'
      openModal(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container'>
        <div className='registr-container' style={{minHeight: '740px', marginBottom: '175px'}}>

          <div className='title'>
            <button className='btn-back' onClick={() => navigate('/full_registration_step0_1')}>
              <img src={arrow} alt='Назад' />
            </button>
            <h2 className="login-title">Полная регистрация</h2>
          </div>

          <div className='registr-scale'>
            <p>1/6</p>
            <img src={scale} alt='Registration scale' />
          </div>

          <div className='passport-row'>
            {userLawSubject === 'individual' && (
              <>
                <div className='passport-field full-width'>
                  <h3>ФИО</h3>
                  <input 
                    ref={fioInputRef}
                    placeholder='Введите ваше ФИО'
                    value={fullName}
                    onChange={handleFullNameChange}
                  />
                </div>

                <div className='passport-field full-width'>
                  <h3>
                    Дата рождения
                    {birthDateError && <span style={{color:'#ff4444', marginLeft:'10px', fontSize:'16px'}}>{birthDateError}</span>}
                  </h3>
                  <input 
                    placeholder='ДД.ММ.ГГГГ'
                    value={birthDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    maxLength="10"
                  />
                </div>
              </>
            )}

            {userLawSubject === 'legal_entity' && (
              <div className='passport-field full-width'>
                <h3>Наименование организации</h3>
                <input 
                  ref={companyNameRef}
                  placeholder='Введите наименование'
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            )}

            <div className='passport-field full-width'>
              <h3>Регионы работы</h3>
              <div className="registr-selector-wrapper">
                <RegistrSelector 
                  placeholder={'Выберите города'}
                  subject={cities.map(c => c.name)}
                  selected={selectedCities.map(id => cities.find(c => c.id === id)?.name || '')}
                  onSelect={(selectedNames) => {
                    const selectedIds = selectedNames.map(name => 
                      cities.find(c => c.name === name)?.id
                    ).filter(Boolean)
                    setSelectedCities(selectedIds)
                  }}
                  multiple={true}
                />
              </div>
            </div>
          </div>

          <div className="checkbox-wrapper" onClick={() => setTravelReadiness(!travelReadiness)}>
            <div className={`custom-checkbox ${travelReadiness ? 'checked' : ''}`}>
              {travelReadiness && (
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                  <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="checkbox-text">Готов к выездам в другие регионы</span>
          </div>

          <button 
            type="button"
            className={`continue-button ${!formIsValid ? 'disabled' : ''}`} 
            disabled={!formIsValid || isLoading}
            onClick={handleForward}
            style={{marginTop: '50px'}}
          >
            {isLoading ? 'Сохранение...' : 'Продолжить'}
          </button>

        </div>
      </div>

      <Footer className='footer footer--registr' />

      {modalMessage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <img src={icon_close_modal} alt="Закрыть" />
            </button>
            <div className="modal-text">{modalMessage}</div>
            <button className="modal-action-btn" onClick={closeModal}>
              Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  )
}