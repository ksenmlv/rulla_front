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

  // Локальные данные для валидации и отправки
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [companyName, setCompanyName] = useState('')

  const [birthDateError, setBirthDateError] = useState('')

  // Города
  const [cities, setCities] = useState([])
  const [selectedCities, setSelectedCities] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [modalMessage, setModalMessage] = useState(null)
  const openModal = (msg) => setModalMessage(msg)
  const closeModal = () => setModalMessage(null)

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

  // Автофокус
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

  // Валидация ФИО (физлицо)
  const handleFullNameChange = (e) => {
    const value = e.target.value
    const allowed = /^[А-Яа-яЁёA-Za-z\s\-']*$/
    if (allowed.test(value)) {
      setFullName(value)
    }
  }

  // Валидация даты рождения (физлицо)
  const isValidDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 10) return false
    const digits = dateStr.replace(/\D/g, '')
    if (digits.length !== 8) return false

    const day = parseInt(digits.slice(0,2))
    const month = parseInt(digits.slice(2,4))
    const year = parseInt(digits.slice(4,8))

    if (year < 1900) return false

    const date = new Date(year, month - 1, day)
    const today = new Date()

    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year ||
      date > today
    ) return false

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

    if (formatted.length === 10) {
      setBirthDateError(isValidDate(formatted) ? '' : 'Некорректная дата (год ≥ 1900, не в будущем)')
    } else {
      setBirthDateError('')
    }
  }

  useEffect(() => {
  const checkUser = async () => {
    try {
      const profile = await apiClient.get('/executors/me/profile')
      console.log('Текущий профиль:', profile.data)
      console.log('Тип исполнителя:', profile.data?.executorType)
    } catch (err) {
      console.error('Ошибка проверки профиля:', err.response?.data)
    }
  }
  checkUser()
}, [])

  // Автоматическая валидация формы
  useEffect(() => {
    let valid = true

    if (userLawSubject === 'individual') {
      const fioValid = fullName.trim().split(' ').length >= 2 && fullName.trim().length >= 5
      const birthValid = birthDate.length === 10 && isValidDate(birthDate)
      const citiesValid = selectedCities.length > 0

      if (!fioValid || !birthValid || !citiesValid) valid = false
    } else {
      const nameValid = companyName.trim().length >= 3
      const citiesValid = selectedCities.length > 0

      if (!nameValid || !citiesValid) valid = false
    }

    setFormIsValid(valid)
  }, [fullName, birthDate, companyName, selectedCities, userLawSubject])


  // Отправка на сервер
  const handleForward = async () => {
    if (!formIsValid) return

    setIsLoading(true)

    try {
      // 1. Проверяем текущий профиль и тип исполнителя
      const profileRes = await apiClient.get('/executors/me/profile')
      const executorType = profileRes.data?.executorType

      // 2. Проверяем соответствие выбранного типа и реального
      if (userLawSubject === 'individual' && executorType !== 'INDIVIDUAL') {
        throw new Error('Вы не зарегистрированы как физическое лицо-исполнитель. Пожалуйста, войдите заново.')
      }
      if (userLawSubject === 'legal_entity' && executorType !== 'COMPANY') {
        throw new Error('Вы не зарегистрированы как юридическое лицо. Пожалуйста, войдите заново.')
      }

      // 3. Отправка данных в зависимости от типа
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
      } else if (userLawSubject === 'legal_entity') {
        await apiClient.patch('/executors/companies/me/data', {
          legalName: companyName.trim()
        })
      }

      // 4. Регионы (города) — общие для всех
      const regionsPayload = selectedCities.map(cityId => ({
        regionType: "CITY",
        cityId,
        regionId: null
      }))

      await apiClient.put('/executors/me/regions', {
        regions: regionsPayload
      })

      setStepNumber(stepNumber + 1)
      const profile = await apiClient.get('/executors/me/profile')
      console.log('Текущий профиль:', profile.data)
      navigate('/full_registration_step2')
    } catch (err) {
      let message = err.message || err.response?.data?.message || 'Ошибка сохранения данных'

      if (err.response?.status === 403) {
        message = 'Доступ запрещён. Возможно, тип исполнителя не соответствует. Войдите заново.'
      } else if (err.response?.status === 409) {
        message = 'Данные нельзя изменить после завершения регистрации.'
      }

      openModal(message)

      // Если 401/403 — редирект на логин
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('accessToken')
        setTimeout(() => navigate('/enter'), 2000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container'>
        <div className='registr-container' style={{ height: 'auto', paddingBottom: '20px', marginBottom: '199px'}}>

          <div className='title'>
            <button className='btn-back' onClick={() => navigate('/full_registration_step0_1')}>
              <img src={arrow} alt='Назад' />
            </button>
            <h2 className="login-title">Полная регистрация</h2>
          </div>

          <div className='registr-scale'>
            <p>1/6</p>
            <img src={scale} alt='Registration scale' style={{width: '650px'}}/>
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
              <h3>Города работы</h3>
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
            <span className="checkbox-text">Готов к выездам в другие города</span>
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