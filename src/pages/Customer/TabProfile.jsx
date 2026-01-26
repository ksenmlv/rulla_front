import React, { useEffect, useState, useRef } from 'react'
import RegistrSelector from '../../components/lists/RegistrSelector'
import FileUpload from '../Registration/common/FileUpload.jsx'
import PhoneNumber from '../Registration/common/PhoneNumber.jsx'
import { citiesApi } from '../../api/citiesApi.ts'
import { ordersApi } from '../../api/ordersApi.ts'
import apiClient from '../../api/client'  

import avatar from '../../assets/Main/avatar.svg'
import edit_avatar from '../../assets/Main/edit_avatar.svg'
import star from '../../assets/Main/icon_star_yellow.svg'
import close from '../../assets/Main/icon_close.svg'
import edit from '../../assets/Main/icon_edit_order.svg'

export default function TabProfile() {

    const [showMore, setShowMore] = useState(false)
    const [showEditData, setShowEditData] = useState(false)
    const [showEditName, setShowEditName] = useState(false)
    const [showFileSizeModal, setShowFileSizeModal] = useState(false)
    const [badFileName, setBadFileName] = useState('')

    // Аватар
    const [avatarPreview, setAvatarPreview] = useState(null)
    const fileInputRef = useRef(null)

    const handleFileUploadWithCheck = (setter, files) => {
        const tooBig = files.find(f => f.size > 10 * 1024 * 1024)
        if (tooBig) {
            setBadFileName(tooBig.name)
            setShowFileSizeModal(true)
            setter(files.filter(f => f.size <= 10 * 1024 * 1024))
            return
        }
        setter(files)
    }

    // Данные профиля с сервера
    const [profile, setProfile] = useState(null)
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [profileError, setProfileError] = useState(null)

    // Города для селектора регионов
    const [cities, setCities] = useState([])
    const [selectedCities, setSelectedCities] = useState([])
    // Ошибки валидации
    const [errors, setErrors] = useState({})

    // Форма редактирования
    const [editForm, setEditForm] = useState({
        fullName: '',
        email: '',
        phone: '',
    })

    // Уведомления (локально)
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        telegram: false,
    })

    // Загрузка профиля
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoadingProfile(true)
                setProfileError(null)
                const response = await apiClient.get('/customers/me/profile')
                const data = response.data
                setProfile(data)

                const fullName = [data.firstName, data.middleName, data.lastName]
                    .filter(Boolean)
                    .join(' ')

                setEditForm({
                    fullName: fullName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                })

                // Если на сервере есть аватар — можно подставить
                // setAvatarPreview(data.avatarUrl)
            } catch (err) {
                console.error('Ошибка загрузки профиля:', err)
                setProfileError('Не удалось загрузить данные профиля')
            } finally {
                setLoadingProfile(false)
            }
        }

        fetchProfile()
    }, [])

    // ─── Аватар ──────────────────────────────────────────────────
    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Проверка размера 10 МБ
        if (file.size > 10 * 1024 * 1024) {
            setBadFileName(file.name)
            setShowFileSizeModal(true)
            return
        }

        // Локальный предпросмотр
        const reader = new FileReader()
        reader.onloadend = () => {
            setAvatarPreview(reader.result)
        }
        reader.readAsDataURL(file)

        // Отправка на сервер (замените путь на реальный эндпоинт)
        try {
            const formData = new FormData()
            formData.append('avatar', file)   // имя поля может отличаться

            await apiClient.put('/customers/me/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            // Если сервер возвращает обновлённый профиль или url — можно обновить
            // const res = await apiClient.get('/customers/me/profile')
            // setProfile(res.data)
        } catch (err) {
            console.error('Ошибка загрузки аватара:', err)
            alert('Не удалось загрузить фотографию')
            setAvatarPreview(null) // откат при ошибке
        }
    }

    // Валидация формы личных данных
    const validateForm = () => {
        const newErrors = {}

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!editForm.email.trim() || !emailRegex.test(editForm.email.trim())) {
            newErrors.email = 'Некорректный email'
        }

        const phoneDigits = (editForm.phone || profile?.phone || '').replace(/\D/g, '')
        if (phoneDigits.length < 11) {
            newErrors.phone = 'Номер телефона должен содержать минимум 11 цифр'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Сохранение личных данных (email + телефон пока локально)
    const handleSaveData = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            // Email
            if (editForm.email.trim() !== profile?.email) {
                await apiClient.put('/customers/me/email', {
                    email: editForm.email.trim(),
                })
            }

            // Телефон пока только локально (по вашему требованию)

            setProfile(prev => ({
                ...prev,
                email: editForm.email.trim(),
                // phone: editForm.phone,   // раскомментировать при необходимости
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

    // Валидация имени
    const validateName = () => {
        const trimmed = editForm.fullName.trim()
        if (trimmed.length < 3) {
            setErrors({ fullName: 'Имя должно содержать минимум 3 символа' })
            return false
        }
        setErrors({})
        return true
    }

    // Сохранение имени
    const handleSaveName = async (e) => {
        e.preventDefault()
        if (!validateName()) return

        try {
            const firstName = editForm.fullName.trim().split(/\s+/)[0] || ''

            if (firstName && firstName !== profile?.firstName) {
                await apiClient.put('/customers/me/name', { firstName })
            }

            setProfile(prev => ({ ...prev, firstName }))

            setShowEditName(false)
        } catch (err) {
            console.error('Ошибка изменения имени:', err)
            setErrors({
                submit: err.response?.data?.message || 'Не удалось сохранить имя'
            })
        }
    }

    // ─────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────

    const displayName = profile
        ? [profile.firstName, profile.middleName, profile.lastName]
            .filter(Boolean)
            .join(' ') || 'Имя пользователя'
        : 'Имя пользователя'

    return (
        <>
            <div className="headerBlock">
                <div className="headerContent">
                    <div className="avatarWrapper" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                        <img 
                            src={avatarPreview || avatar} 
                            alt="Аватар" 
                            style={{
                                width: '111px',
                                height: '111px',
                                objectFit: 'cover',          
                                borderRadius: '11px',          // делает круг
                                display: 'block'
                            }}
                        />
                        <img 
                            src={edit_avatar} 
                            alt="" 
                            className="img_edit_avatar" 
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    <div className="headerText">
                        <h1>{displayName}</h1>
                        <p>На сервисе с 2025 года</p>
                    </div>
                    <button className="editButton" onClick={() => setShowEditName(true)}>
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

                    <button style={{marginTop: '20px'}}
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

            {/* Модальное окно редактирования личных данных */}
            {showEditData && (
                <div className="modal-overlay" onClick={() => setShowEditData(false)}>
                    <div className="edit-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Личные данные</h2>
                            <button 
                                className="modal-close-btn" 
                                onClick={() => setShowEditData(false)}
                            >
                                <img src={close} alt="Закрыть" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveData} noValidate>

                            {/* Номер телефона */}
                            <div className="passport-field full-width" style={{marginTop: '40px'}}>
                                <h3>Номер телефона {errors.phone && (<span style={{color:'#ff4444', marginLeft:'10px', fontSize: '16px'}}> {errors.phone} </span>)}</h3>
                                <PhoneNumber
                                    value={editForm.phone || profile?.phone || ''}
                                    onChange={(value) => {
                                        setEditForm(prev => ({ ...prev, phone: value }))
                                        setErrors(prev => ({ ...prev, phone: '' }))
                                    }}
                                    disabled={false} 
                                />
                            </div>

                            {/* Почта */}
                            <div className="passport-field full-width" style={{ margin: '-20px 0 30px 0' }}>
                                <h3>
                                    Почта 
                                    {errors.email && (
                                        <span style={{color:'#ff4444', marginLeft:'10px', fontSize: '16px'}}>
                                            {errors.email}
                                        </span>
                                    )}
                                </h3>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => {
                                        setEditForm(prev => ({ ...prev, email: e.target.value }))
                                        setErrors(prev => ({ ...prev, email: '' }))
                                    }}
                                />
                            </div>

                            {/* Общая ошибка сервера */}
                            {errors.submit && (
                                <div style={{ 
                                    color: '#ff4444', 
                                    fontSize: '16px', 
                                    margin: '10px 0 20px 0',
                                    textAlign: 'center'
                                }}>
                                    {errors.submit}
                                </div>
                            )}

                            <div className="modal-buttons">
                                <button 
                                    type="button" 
                                    className="btn-cancel_"
                                    onClick={() => setShowEditData(false)}
                                >
                                    Отмена
                                </button>
                                <button type="submit" className="btn-save_">
                                    Сохранить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Модальное окно редактирования имени */}
            {showEditName && (
                <div className="modal-overlay" onClick={() => setShowEditName(false)}>
                    <div className="edit-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Имя пользователя</h2>
                            <button 
                                className="modal-close-btn" 
                                onClick={() => setShowEditName(false)}
                            >
                                <img src={close} alt="Закрыть" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveName}>

                            <div className="passport-field full-width" style={{ margin: '40px 0 30px 0' }}>
                                <h3>
                                    Имя 
                                    {errors.fullName && (
                                        <span style={{color:'#ff4444', marginLeft:'10px', fontSize: '16px'}}>
                                            {errors.fullName}
                                        </span>
                                    )}
                                    {errors.submit && (
                                        <span style={{color:'#ff4444', marginLeft:'10px', fontSize: '16px'}}>
                                            {errors.submit}
                                        </span>
                                    )}
                                </h3>
                                <input
                                    value={editForm.fullName}
                                    onChange={(e) => {
                                        setEditForm(prev => ({ ...prev, fullName: e.target.value }))
                                        setErrors(prev => ({ ...prev, fullName: '', submit: '' }))
                                    }}
                                    placeholder="Введите имя"
                                />
                            </div>

                            <div className="modal-buttons">
                                <button 
                                    type="button" 
                                    className="btn-cancel_"
                                    onClick={() => setShowEditName(false)}
                                >
                                    Отмена
                                </button>
                                <button type="submit" className="btn-save_">
                                    Сохранить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}