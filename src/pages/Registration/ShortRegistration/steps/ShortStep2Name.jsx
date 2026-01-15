import '../../Registration.css'
import arrow from '../../../../assets/Main/arrow_left.svg'
import icon_close_modal from '../../../../assets/Main/icon_close_modal.svg'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import apiClient from '../../../../api/client' // ваш apiClient с интерсепторами

export default function ShortStep2Name() {
  const navigate = useNavigate()
  const { setPhoneNumber } = useAppContext() // если нужно очистить телефон

  const nameInputRef = useRef(null)

  const [localName, setLocalName] = useState('')
  const [localEmail, setLocalEmail] = useState('')

  const [isCheckedPolicy, setIsCheckedPolicy] = useState(false)
  const [isCheckedMarketing, setIsCheckedMarketing] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  // Модальное окно для ошибок/сообщений
  const [modalMessage, setModalMessage] = useState(null)
  const openModal = (msg) => setModalMessage(msg)
  const closeModal = () => setModalMessage(null)

  // Автофокус на имя
  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  // Валидация email
  const validateEmail = (value) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)

  const isFormValid =
    localName.trim() !== '' &&
    localEmail.trim() !== '' &&
    validateEmail(localEmail) &&
    isCheckedPolicy

  // Обработчики ввода
  const handleNameChange = (e) => {
    const clean = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '')
    setLocalName(clean)
  }

  const handleEmailChange = (e) => {
    setLocalEmail(e.target.value)
  }

  // Отправка данных на сервер
  const handleSubmit = async () => {
    if (!validateEmail(localEmail)) {
      openModal('Введите корректный email')
      return
    }

    if (!isFormValid) return

    setIsLoading(true)

    try {
      // Сохранение персональных данных
      await apiClient.put('/customers/me/personal-data', {
        firstName: localName.trim(),
        email: localEmail.trim().toLowerCase(),
        acceptUserAgreement: true,                         // предполагаем, что принято ранее
        acceptPrivacyPolicy: isCheckedPolicy,              // обязательно true
        acceptPersonalDataProcessing: isCheckedPolicy,     // обязательно
        acceptMarketing: isCheckedMarketing,               // опционально
      })

      // Получение свежего профиля пользователя
      const profileResponse = await apiClient.get('/customers/me/profile')
      const profile = profileResponse.data

      // Вывод в консоль данных профиля
      console.log('Профиль пользователя после регистрации:', profile)

      // Успех (204 No Content)
      setPhoneNumber('') // очистка
      openModal('Регистрация успешно завершена!') // можно заменить на модалку успеха
      navigate('/') 
    } catch (err) {
      console.error('Ошибка сохранения персональных данных:', err)

      let message = err.response?.data?.message || 'Ошибка при сохранении данных'

      if (err.response?.status === 400) {
        message = 'Проверьте данные или примите обязательные согласия'
      } else if (err.response?.status === 401) {
        message = 'Сессия истекла. Пройдите регистрацию заново.'
        navigate('/simplified_registration_step1')
      } else if (err.response?.status === 409) {
        message = 'Персональные данные уже заполнены'
        navigate('/')
      } else if (err.response?.status === 429) {
        message = 'Слишком много попыток. Попробуйте позже.'
      }

      openModal(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/simplified_registration_step1')
  }

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container' style={{ marginBottom: '237px' }}>
        <div className='registr-container' style={{ height: '648px' }}>
          <div className='title'>
            <button className='btn-back' onClick={handleBack}>
              <img src={arrow} alt='Назад' />
            </button>
            <h2 className="login-title">Регистрация</h2>
          </div>

          <div className='input-fields'>
            <h3>Имя</h3>
            <input
              type='text'
              ref={nameInputRef}
              placeholder='Введите ваше имя'
              value={localName}
              onChange={handleNameChange}
            />

            <h3>Почта</h3>
            <input
              type="text"
              placeholder="Введите ваш e-mail"
              value={localEmail}
              onChange={handleEmailChange}
            />
          </div>

          {/* Обязательный чекбокс */}
          <div
            className="checkbox-wrapper"
            onClick={() => setIsCheckedPolicy(!isCheckedPolicy)}
            style={{ marginBottom: '5px' }}
          >
            <div className={`custom-checkbox ${isCheckedPolicy ? 'checked' : ''}`}>
              {isCheckedPolicy && (
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                  <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="checkbox-text">
              Соглашаюсь с <a className='policy-link'>политикой конфиденциальности</a> и обработкой персональных данных
            </span>
          </div>

          {/* Опциональный чекбокс маркетинга */}
          <div
            className="checkbox-wrapper"
            onClick={() => setIsCheckedMarketing(!isCheckedMarketing)}
            style={{ margin: '0 0 15px 0' }}
          >
            <div className={`custom-checkbox ${isCheckedMarketing ? 'checked' : ''}`}>
              {isCheckedMarketing && (
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                  <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="checkbox-text">
              Хочу получать рекламные рассылки и специальные предложения
            </span>
          </div>

          <button
            type="button"
            className={`continue-button ${(!isFormValid ) ? 'disabled' : ''}`}
            disabled={!isFormValid || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? 'Сохранение...' : 'Зарегистрироваться'}
          </button>

          <div className="register-link">
            У вас уже есть аккаунт? <Link to="/enter" className="register-here">Войти</Link>
          </div>
        </div>
      </div>

      <Footer className='footer footer--registr' />

      {/* Модальное окно — одинаковое с первым шагом */}
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