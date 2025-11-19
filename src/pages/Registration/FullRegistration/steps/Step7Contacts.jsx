import '../../Registration.css'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import PhoneNumber from '../../common/PhoneNumber'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale7.svg'
import tg from '../../../../assets/Main/icon-telegram.svg'
import whatsapp from '../../../../assets/Main/icon-whatsapp.svg'
import vk from '../../../../assets/Main/icon-vk.svg'
import close from '../../../../assets/Main/icon_close.svg'

export default function Step7Contacts() {
    const navigate = useNavigate()
    const { 
        stepNumber, setStepNumber,
        userPhone, setUserPhone,
        userEmail, setUserEmail,
        userSocialMedia, setUserSocialMedia,
        userWebsite, setUserWebsite
    } = useAppContext()

    // Локальный стейт для всех полей
    const [localPhone, setLocalPhone] = useState(userPhone || '')
    const [localEmail, setLocalEmail] = useState(userEmail || '')
    const [localWebsite, setLocalWebsite] = useState(userWebsite || '')
    const [localSocialMedia, setLocalSocialMedia] = useState(userSocialMedia || {})
    const [isChecked, setIsChecked] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedService, setSelectedService] = useState('')
    const [emailError, setEmailError] = useState('')
    const [formValid, setFormValid] = useState(false)

    const firstServiceInputRef = useRef(null)

    // Восстановление локального состояния при монтировании
    useEffect(() => {
        setStepNumber(7)
        firstServiceInputRef.current?.focus()
        setLocalPhone(userPhone)
        setLocalEmail(userEmail)
        setLocalWebsite(userWebsite)
        setLocalSocialMedia(userSocialMedia || {})
    }, [])

    // Валидация формы
    useEffect(() => {
        const phoneValid = localPhone.replace(/\D/g, '').length > 10
        const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(localEmail)
        setFormValid(phoneValid && emailValid && isChecked)
    }, [localPhone, localEmail, isChecked])

    const handleBack = () => navigate('/full_registration_step6')

    const handleForward = () => {
        // Сохраняем все данные в контекст
        setUserPhone(localPhone)
        setUserEmail(localEmail)
        setUserWebsite(localWebsite)
        setUserSocialMedia(localSocialMedia)

        alert('Полная регистрация завершена')
        navigate('/')
    }

    const validateEmail = (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)

    // Открытие модалки с выбором сервиса
    const openModal = (service) => {
        setSelectedService(service)
        setModalVisible(true)
    }

    const saveSocialMedia = () => {
        setModalVisible(false)
    }

    const closeModal = () => setModalVisible(false)

    // Проверка, заполнены ли данные для социальной сети
    const isSocialMediaFilled = (service) => {
        return localSocialMedia[service] && 
               (localSocialMedia[service].phone || localSocialMedia[service].nickname)
    }

    return (
        <div>
            <Header hideElements={true} />

            <div className='reg-container'>
                <div className='registr-container' style={{ height: 'auto', paddingBottom: '20px' }}>
                    {/* Шапка и шаг */}
                    <div className='title'>
                        <button className='btn-back' onClick={handleBack}>
                            <img src={arrow} alt='Назад' />
                        </button>
                        <h2 className='login-title'>Полная регистрация</h2>
                    </div>

                    <div className='registr-scale'>
                        <p>7/7</p>
                        <img src={scale} alt='Registration scale' />
                    </div>

                    <p style={{ fontSize: '32px', fontWeight: '600', color: '#151515', marginBottom: '30px' }}>
                        Контакты
                    </p>

                    {/* Номер телефона */}
                    <div className='passport-row'>
                        <div className='passport-field full-width'>
                            <PhoneNumber value={localPhone} onChange={setLocalPhone} />
                        </div>
                    </div>

                    {/* Email */}
                    <div className='passport-row' style={{ marginTop: '-25px' }}>
                        <div className='passport-field full-width'>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h3>E-mail</h3>
                                {emailError && (
                                    <span style={{
                                        color: '#ff4444',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        margin: '0 0 7px auto',
                                    }}>
                                        {emailError}
                                    </span>
                                )}
                            </div>

                            <input
                                type="text"
                                placeholder="Введите почту"
                                value={localEmail}
                                onChange={(e) => {
                                    const value = e.target.value
                                    setLocalEmail(value)
                                    if (!validateEmail(value)) setEmailError("Введите корректный email")
                                    else setEmailError("")
                                }}
                            />
                        </div>
                    </div>

                    {/* Социальные сети */}
                    <div className='passport-field' style={{ margin: '25px 0 0 0' }}>
                        <h3 style={{ marginBottom: 0 }}>Социальные сети</h3>
                        <p style={{ fontSize: '20px', margin: '5px 0 15px 0' }}>
                            Добавьте ссылки на ваши социальные сети
                        </p>

                        <div className="social-buttons">
                            <button 
                                className={`btn-social ${isSocialMediaFilled('telegram') ? 'selected' : ''}`}
                                onClick={() => openModal('telegram')}
                            >
                                <img src={tg} alt='Icon Telegram' style={{ margin: '0 5px 0 -10px' }} /> Telegram
                            </button>
                            <button 
                                className={`btn-social ${isSocialMediaFilled('whatsapp') ? 'selected' : ''}`}
                                onClick={() => openModal('whatsapp')}
                            >
                                <img src={whatsapp} alt='Icon Whatsapp' style={{ margin: '0 5px 0 -10px' }} /> Whatsapp
                            </button>
                            <button 
                                className={`btn-social ${isSocialMediaFilled('vk') ? 'selected' : ''}`}
                                onClick={() => openModal('vk')}
                            >
                                <img src={vk} alt='Icon Vk' style={{ margin: '0 5px 0 -10px' }} /> Вконтакте
                            </button>
                        </div>
                    </div>

                    {/* Сайт */}
                    <div className='passport-field' style={{ margin: '25px 0 0 0' }}>
                        <h3 style={{ marginBottom: 0 }}>Сайт</h3>
                        <p style={{ fontSize: '20px', margin: '5px 0 15px 0' }}>
                            Добавьте ссылку на сайт вашей компании (при наличии)
                        </p>
                        <input
                            value={localWebsite || ''}
                            placeholder='Вставьте ссылку на ваш сайт'
                            onChange={(e) => setLocalWebsite(e.target.value)}
                        />
                    </div>

                    {/* Чекбокс */}
                    <div className="checkbox-wrapper" onClick={() => setIsChecked(prev => !prev)} style={{ marginTop: '60px' }}>
                        <div className={`custom-checkbox ${isChecked ? 'checked' : ''}`}>
                            {isChecked && <span className="inner-square"></span>}
                        </div>
                        <span className="checkbox-text">
                            Я соглашаюсь с <a className='policy-link'>политикой конфиденциальности</a> и обработкой персональных данных
                        </span>
                    </div>

                    <button
                        type="submit"
                        className={`continue-button ${!formValid ? 'disabled' : ''}`}
                        onClick={handleForward}
                        style={{ marginTop: '7px' }}
                        disabled={!formValid}
                    >
                        Зарегистрироваться
                    </button>

                </div>
            </div>

            {/* Модальное окно */}
            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={closeModal}><img src={close} alt='Close' /></button>

                        <h3>Добавьте ссылки на социальные сети</h3>

                        <div className="social-buttons">
                            <button 
                                className={`btn-social ${selectedService === 'telegram' ? 'selected' : ''}`}
                                onClick={() => setSelectedService('telegram')}
                            >
                                <img src={tg} alt="Telegram" style={{ margin: '0 5px 0 -10px' }}/> Telegram
                            </button>
                            <button 
                                className={`btn-social ${selectedService === 'whatsapp' ? 'selected' : ''}`}
                                onClick={() => setSelectedService('whatsapp')}
                            >
                                <img src={whatsapp} alt="Whatsapp" style={{ margin: '0 5px 0 -10px' }} /> Whatsapp
                            </button>
                            <button 
                                className={`btn-social ${selectedService === 'vk' ? 'selected' : ''}`}
                                onClick={() => setSelectedService('vk')}
                            >
                                <img src={vk} alt="Vk" style={{ margin: '0 5px 0 -10px' }}/> Вконтакте
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Номер телефона"
                            value={localSocialMedia[selectedService]?.phone || ''}
                            onChange={(e) =>
                                setLocalSocialMedia(prev => ({
                                    ...prev,
                                    [selectedService]: {
                                        ...prev[selectedService],
                                        phone: e.target.value
                                    }
                                }))
                            }
                        />

                        <input
                            type="text"
                            placeholder="Введите свой никнейм"
                            value={localSocialMedia[selectedService]?.nickname || ''}
                            onChange={(e) =>
                                setLocalSocialMedia(prev => ({
                                    ...prev,
                                    [selectedService]: {
                                        ...prev[selectedService],
                                        nickname: e.target.value
                                    }
                                }))
                            }
                        />

                        <button className="save-button" onClick={saveSocialMedia}>
                            Сохранить
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}