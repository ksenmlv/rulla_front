import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import RegistrSelector from '../../components/lists/RegistrSelector'
import PhoneNumber from '../Registration/common/PhoneNumber.jsx'
import { citiesApi } from '../../api/citiesApi.ts'
import apiClient from '../../api/client'  

import '../Customer/Customer.css'
import '../Customer/PersonalAccount.css'
import '../Main/Main.css'
import '../Registration/Registration.css'

import icon_user from '../../assets/Main/icon_user.svg'
import tab_profile from '../../assets/Main/tab_profile.svg'
import tab_orders from '../../assets/Main/tab_orders.svg'
import tab_star from '../../assets/Main/tab_star.svg'
import tab_chat from '../../assets/Main/tab_chat.svg'
import avatar from '../../assets/Main/avatar.svg'
import edit_avatar from '../../assets/Main/edit_avatar.svg'
import edit from '../../assets/Main/icon_edit_order.svg'
import star from '../../assets/Main/icon_star_yellow.svg'
import close from '../../assets/Main/icon_close.svg'

export default function PersonalAccount() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('profile')
  const [showMore, setShowMore] = useState(false)
  const [showEditData, setShowEditData] = useState(false)

  // Данные профиля с сервера
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState(null)

  // Города для селектора регионов
  const [cities, setCities] = useState([])
  const [selectedCities, setSelectedCities] = useState([])

  // Уведомления (локально)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    telegram: false,
  })

  // Форма редактирования
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
  })

  // Ошибки валидации
  const [errors, setErrors] = useState({})

  // Загрузка профиля
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true)
        setProfileError(null)
        const response = await apiClient.get('/customers/me/profile')
        const data = response.data
        setProfile(data)

        // Заполняем форму редактирования текущими данными
        const fullName = [data.firstName, data.middleName, data.lastName]
          .filter(Boolean)
          .join(' ')
        setEditForm({
          fullName: fullName || '',
          email: data.email || '',
        })
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err)
        setProfileError('Не удалось загрузить данные профиля')
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [])

  // Загрузка списка городов
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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  const tabs = [
    { id: 'profile', label: 'Мой профиль', icon: <img src={tab_profile} alt="" /> },
    { id: 'orders', label: 'Мои заказы', icon: <img src={tab_orders} alt="" /> },
    { id: 'favorites', label: 'Избранное', icon: <img src={tab_star} alt="" /> },
    { id: 'support', label: 'Поддержка', icon: <img src={tab_chat} alt="" /> },
  ]

  // Валидация формы
  const validateForm = () => {
    const newErrors = {}

    const trimmed = editForm.fullName.trim()
    if (trimmed.length < 5) {
      newErrors.fullName = 'ФИО должно содержать минимум 5 символов'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!editForm.email.trim() || !emailRegex.test(editForm.email.trim())) {
      newErrors.email = 'Введите корректный адрес электронной почты'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Сохранение изменений
  const handleSave = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const nameParts = editForm.fullName.trim().split(/\s+/)
      const firstName = nameParts[0] || ''

      // Обновляем имя
      if (firstName && firstName !== profile?.firstName) {
        await apiClient.put('/customers/me/name', { firstName })
      }

      // Обновляем email
      if (editForm.email.trim() !== profile?.email) {
        await apiClient.put('/customers/me/email', {
          email: editForm.email.trim(),
        })
      }

      // Обновляем локальное состояние профиля
      setProfile((prev) => ({
        ...prev,
        firstName,
        email: editForm.email.trim(),
        // middleName и lastName не обновляем, т.к. меняем только firstName
      }))

      setShowEditData(false)
      setErrors({})
    } catch (err) {
      console.error('Ошибка сохранения профиля:', err)
      setErrors({
        submit: err.response?.data?.message || 'Ошибка при сохранении данных',
      })
    }
  }

  return (
    <>
      <Header
        rightContent={
          <>
            <button className="btn_user" style={{ marginRight: '-10px' }}>
              <img src={icon_user} alt="Иконка пользователя" />
            </button>
            <p
              style={{
                fontSize: '20px',
                color: '#000',
                fontWeight: '500',
                paddingTop: '15px',
              }}
            >
              {profile
                ? [profile.firstName, profile.middleName, profile.lastName]
                    .filter(Boolean)
                    .join(' ') || 'Имя пользователя'
                : 'Загрузка...'}
            </p>
            <button className="btn-blue">Создать заказ</button>
          </>
        }
        menuItems={[
          { label: 'О платформе', to: '/' },
          { label: 'Каталог исполнителей', to: '/' },
          { label: 'Мои заказы', to: '/customer_my_orders' },
        ]}
      />

      <div className="full-container" style={{ marginBottom: '285px' }}>
        <div className="main-container">
          <h1 className="page-title">Личный кабинет</h1>

          {/* Табы */}
          <div className="profile-tabs-container">
            <div className="profile-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="profileContainer">
            {/* Верхний блок */}
            <div className="headerBlock">
              <div className="headerContent">
                <div className="avatarWrapper">
                  <img src={avatar} alt="Аватар" />
                  <img src={edit_avatar} alt="" className="img_edit_avatar" />
                </div>

                <div className="headerText">
                  <h1>
                    {profile
                      ? [profile.firstName, profile.middleName, profile.lastName]
                          .filter(Boolean)
                          .join(' ') || 'Имя пользователя'
                      : 'Загрузка...'}
                  </h1>
                  <p>На сервисе с 2025 года</p>
                </div>
                <button className="editButton">
                  <img src={edit} alt="Изменить" />
                </button>
              </div>
            </div>

            {/* Основная сетка */}
            <div className="gridContainer">
              {/* Личные данные */}
              <div className="card">
                <div className="cardHeader">
                  <h2 className="cardTitle">Личные данные</h2>
                  <button
                    className="editButton"
                    onClick={() => setShowEditData(true)}
                  >
                    <img src={edit} alt="Изменить" />
                  </button>
                </div>

                {loadingProfile ? (
                  <div>Загрузка...</div>
                ) : profileError ? (
                  <div style={{ color: 'red' }}>{profileError}</div>
                ) : profile ? (
                  <>
                    <div className="field">
                      <div className="fieldLabel">ФИО</div>
                      <div className="fieldValue">
                        {[profile.firstName, profile.middleName, profile.lastName]
                          .filter(Boolean)
                          .join(' ') || '—'}
                      </div>
                    </div>

                    <div className="field">
                      <div className="fieldLabel">Номер телефона</div>
                      <div className="fieldValue">
                        {profile.phone || '—'}
                        {profile.phoneVerified && (
                          <span style={{ color: 'green' }}> ✓ подтверждён</span>
                        )}
                      </div>
                    </div>

                    <div className="field">
                      <div className="fieldLabel">Почта</div>
                      <div className="fieldValue">
                        {profile.email || '—'}
                        {profile.emailVerified && (
                          <span style={{ color: 'green' }}> ✓ подтверждена</span>
                        )}
                      </div>
                    </div>

                    <div className="field">
                      <div className="fieldLabel">Регион</div>
                      <div className="fieldValue">Москва</div> {/* пока статично */}
                    </div>
                  </>
                ) : null}
              </div>

              {/* Рейтинг и отзывы */}
              <div className="card">
                <h2 className="cardTitle" style={{marginBottom: '30px'}}>Мой рейтинг и отзывы специалистов</h2>

                <div className="ratingRow">
                    <span>5.0</span>
                    <img src={star} alt='' />
                    <span>12 отзывов</span>
                </div>

                <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
                    <div className="reviewCard" style={{flex: 1}}>
                        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                            <div style={{display: 'flex', alignContent: 'center', gap: '15px'}}>
                                <div className="reviewAvatar" />
                                <p className="reviewAuthor">Имя пользователя</p>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p className="reviewText">Очень доволен работой! Ремонт был сделан качественно, быстро и без скрытых переплат. Теперь знаю, кому смело могу рекомендовать друзьям. </p>
                                <div className="reviewDate">2 сентября 2025 г.</div>
                            </div>
                        </div>
                    </div>

                    <div className="reviewCard" style={{flex: 1}}>
                        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                            <div style={{display: 'flex', alignContent: 'center', gap: '15px'}}>
                                <div className="reviewAvatar" />
                                <p className="reviewAuthor">Имя пользователя</p>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p className="reviewText">Очень доволен работой! Ремонт был сделан качественно, быстро и без скрытых переплат. Теперь знаю, кому смело могу рекомендовать друзьям. </p>
                                <div className="reviewDate">2 сентября 2025 г.</div>
                            </div>
                        </div>
                    </div>
                </div>

                
                <button style={{marginTop: '40px'}}
                    className={`show-more-link ${showMore ? 'expanded' : ''}`}
                    onClick={() => setShowMore(!showMore)}
                >
                    {showMore ? 'Скрыть' : 'Показать еще'}
                    <span className="arroww">▼</span>
                </button>
                
            </div>

            </div>

            {/* Уведомления + действия */}
            <div className="gridContainer2">
              <div className="card">
                <h2 className="cardTitle">Настройка уведомлений</h2>
                <p className="fieldLabel" style={{ margin: '20px 0 0 0' }}> Присылать уведомления на:</p>

                <div style={{ display: 'flex', flexDirection: 'row', gap: '25px' }}>
                  {['На почту', 'По СМС', 'В Telegram'].map((label, index) => {
                    const key = ['email', 'sms', 'telegram'][index]
                    return (
                      <div
                        key={label}
                        className="checkbox-wrapper"
                        style={{ marginBottom: 0 }}
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                      >
                        <div
                          className={`custom-checkbox ${
                            notifications[key] ? 'checked' : ''
                          }`}
                        >
                          {notifications[key] && (
                            <svg
                              width="14"
                              height="10"
                              viewBox="0 0 14 10"
                              fill="none"
                              className="check-icon"
                            >
                              <path
                                d="M1 5L5 9L13 1"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="checkbox-textt" style={{ fontSize: '20px' }}>
                          {label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="card">
                <h2 className="cardTitle" style={{ marginBottom: '30px' }}>
                  Действия с профилем
                </h2>
                <a href="#" className="actionLink">
                  Удалить профиль
                </a>
                <a href="#" className="actionLink logoutLink">
                  Выйти
                </a>
              </div>
            </div>
          </div>

          {/* Модальное окно редактирования */}
          {showEditData && (
            <div
              className="modal-overlay"
              onClick={() => setShowEditData(false)}
            >
              <div
                className="edit-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Личные данные</h2>
                  <button
                    className="modal-close-btn"
                    onClick={() => setShowEditData(false)}
                  >
                    <img src={close} alt="Закрыть" />
                  </button>
                </div>

                <form onSubmit={handleSave}>
                  <div className="passport-field full-width" style={{marginTop: '40px'}}>
                    <h3>Номер телефона</h3>
                    <PhoneNumber
                      value={profile?.phone || ''}
                      disabled // пока без редактирования телефона
                    />
                  </div>

                  <div className="passport-field full-width" style={{ margin: '-20px 0 30px 0' }}>
                    <h3>ФИО</h3>
                    <input
                      value={editForm.fullName}
                      onChange={(e) => {
                        setEditForm((prev) => ({ ...prev, fullName: e.target.value }))
                        setErrors((prev) => ({ ...prev, fullName: '' }))
                      }}
                    />
                    {errors.fullName && (
                      <span className="error-text">{errors.fullName}</span>
                    )}
                  </div>

                  <div className="passport-field full-width" style={{ marginBottom: '30px' }}>
                    <h3>Почта</h3>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => {
                        setEditForm((prev) => ({ ...prev, email: e.target.value }))
                        setErrors((prev) => ({ ...prev, email: '' }))
                      }}
                    />
                    {errors.email && (
                      <span className="error-text">{errors.email}</span>
                    )}
                  </div>

                  <div className="passport-field full-width" style={{ marginBottom: '30px' }}>
                    <h3>Регионы работы</h3>
                    <div className="registr-selector-wrapper">
                      <RegistrSelector
                        placeholder="Выберите города"
                        subject={cities.map((c) => c.name)}
                        selected={selectedCities.map(
                          (id) => cities.find((c) => c.id === id)?.name || ''
                        )}
                        onSelect={(selectedNames) => {
                          const selectedIds = selectedNames
                            .map((name) => cities.find((c) => c.name === name)?.id)
                            .filter(Boolean)
                          setSelectedCities(selectedIds)
                        }}
                        multiple={true}
                      />
                    </div>
                  </div>

                  <div className="modal-buttons">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setShowEditData(false)}
                    >
                      Отмена
                    </button>
                    <button type="submit" className="btn-save">
                      Сохранить
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}