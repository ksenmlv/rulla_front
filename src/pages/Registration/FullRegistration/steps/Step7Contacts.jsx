import '../../Registration.css'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import PhoneNumber from '../../common/PhoneNumber'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale1 from '../../../../assets/Main/registr_scale7-1.svg'
import scale2 from '../../../../assets/Main/registr_scale7-2.svg'
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
        userWebsite, setUserWebsite,
        userLawSubject,
        phoneNumber               // для отображения в соц сетях
    } = useAppContext()

    // Локальный стейт для всех полей
    const [localPhone, setLocalPhone] = useState(userPhone || '')
    const [localEmail, setLocalEmail] = useState(userEmail || '')
    const [localWebsite, setLocalWebsite] = useState(userWebsite || '')
    const [localSocialMedia, setLocalSocialMedia] = useState(userSocialMedia || {})
    const [isCheckedPolicy, setIsCheckedPolicy] = useState(false)                      // чекбокс политики конф
    const [isCheckedMarketing, setIsCheckedMarketing] = useState(false)               // чекбокс с маркетингом
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedService, setSelectedService] = useState('')
    const [emailError, setEmailError] = useState('')
    const [formValid, setFormValid] = useState(false)                      // корректность заполненных полей формы
    const [submitAttempted, setSubmitAttempted] = useState(false)          // была ли попытка отправки
    const [modalValid, setModalValid] = useState(false)                    // корректность заполненных полей модалки

    const firstServiceInputRef = useRef(null)
    const phoneInputRef = useRef(null)
    const nicknameInputRef = useRef(null)

    // восстановление локального состояния при монтировании
    useEffect(() => {
        setStepNumber(7)
        firstServiceInputRef.current?.focus()

        // загрузка данных из контекста в локальные состояния
        setLocalPhone(userPhone || '')
        setLocalEmail(userEmail || '')
        setLocalWebsite(userWebsite || '')
        setLocalSocialMedia(userSocialMedia || {})
    }, [userPhone, userEmail, userWebsite, userSocialMedia, setStepNumber])


    // валидация формы при изменении полей
    useEffect(() => {
        const phoneValid = localPhone.replace(/\D/g, '').length > 10
        const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(localEmail)
        const websiteValid = !localWebsite || localWebsite.trim().length >= 5
        
        setFormValid(phoneValid && emailValid && isCheckedPolicy && websiteValid)
        
        if (emailError && emailValid) {
            setEmailError('')
        }
    }, [localPhone, localEmail, isCheckedPolicy, localWebsite])


    // восстановление телефона при открытии модалки
    useEffect(() => {
        if (modalVisible && selectedService && (selectedService === 'whatsapp')) {
            // если еще нет телефона
            if (!localSocialMedia[selectedService]?.phone && localPhone) {
                setLocalSocialMedia(prev => ({
                    ...prev,
                    [selectedService]: {
                        ...prev[selectedService],
                        phone: localPhone 
                    }
                }));
            }
        }
    }, [modalVisible, selectedService, localPhone]);

    // валидация модального окна
    useEffect(() => {
        console.log('Phone:', phoneNumber)

        if (!selectedService) return setModalValid(false);

        const data = localSocialMedia[selectedService] || {};

        switch (selectedService) {
            case 'telegram':
                const telegramNicknameValid = data.nickname?.trim().length >= 5;
                setModalValid(telegramNicknameValid);
                break;
            case 'whatsapp':
                const whatsappPhoneDigits = data.phone?.replace(/\D/g, '') || '';
                const whatsappPhoneValid = whatsappPhoneDigits.length > 10;
                setModalValid(whatsappPhoneValid);
                break;
            case 'vk':
                const vkNicknameValid = data.nickname?.trim().length >= 5;
                setModalValid(vkNicknameValid);
                break;
            default:
                setModalValid(false);
        }
    }, [localSocialMedia, selectedService]);

    // автофокус при смене сервиса в модалке
    useEffect(() => {
        if (modalVisible) {
            setTimeout(() => {
                if ( selectedService === 'whatsapp') {
                    phoneInputRef.current?.focus();
                } else if (selectedService === 'telegram' || selectedService === 'vk') {
                    nicknameInputRef.current?.focus();
                }
            }, 100);
        }
    }, [selectedService, modalVisible]);

    const handleBack = () => navigate('/full_registration_step6')

    const handleForward = () => {
        setSubmitAttempted(true) // устанавливаем, что была попытка отправки
        
        const phoneValid = localPhone.replace(/\D/g, '').length > 10
        const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(localEmail)
        const websiteValid = !localWebsite || localWebsite.trim().length >= 5
        
        if (!emailValid) {
            setEmailError("Введите корректный email")
        }
        
        if (!phoneValid || !emailValid || !isCheckedPolicy || !websiteValid) {
            return 
        }

        // сохранение данных в контекст
        setUserPhone(localPhone)
        setUserEmail(localEmail)
        setUserWebsite(localWebsite)
        setUserSocialMedia(localSocialMedia)

        console.log('phone:', userPhone, 'email:',  userEmail, 'site:', userWebsite, 'соц сети:', userSocialMedia)
        alert('Полная регистрация завершена')
        navigate('/')
    }

    const validateEmail = (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)

    // Обработчик изменения email
    const handleEmailChange = (e) => {
        const value = e.target.value
        setLocalEmail(value)
        // Сбрасываем ошибку при начале ввода
        if (emailError) {
            setEmailError("")
        }
    }

    // Обработчик для сайта (минимум 5 символов)
    const handleWebsiteChange = (e) => {
        setLocalWebsite(e.target.value);
    }

    // Обработчик для никнейма в модалке (минимум 5 символов)
    const handleNicknameChange = (e, service) => {
        const value = e.target.value;
        setLocalSocialMedia(prev => ({
            ...prev,
            [service]: {
                ...prev[service],
                nickname: value
            }
        }));
    }

    // Открытие модалки с выбором сервиса
    const openModal = (service) => {
        setSelectedService(service)
        setModalVisible(true)
    }

    const saveSocialMedia = () => {
        setModalVisible(false)
    }

    const closeModal = () => setModalVisible(false)

    // проверка, заполнены ли данные для социальной сети
    const isSocialMediaFilled = (service) => {
        const data = localSocialMedia[service];
        if (!data) return false;
        
        switch(service) {
            case 'telegram':
                return data.nickname?.trim().length >= 5;
            case 'whatsapp':
                return data.phone?.replace(/\D/g, '').length > 10;
            case 'vk':
                return data.nickname?.trim().length >= 5;
            default:
                return false;
        }
    }

    return (
        <div>
            <Header hideElements={true} />

            <div className='reg-container'>
                <div className='registr-container' style={{ height: 'auto', paddingBottom: '27px' }}>
                    {/* Шапка и шаг */}
                    <div className='title'>
                        <button className='btn-back' onClick={handleBack}>
                            <img src={arrow} alt='Назад' />
                        </button>
                        <h2 className='login-title'>Полная регистрация</h2>
                    </div>

                    <div className='registr-scale'>
                        <p>6/6</p>
                        <img src={formValid ? scale2 : scale1} alt='Registration scale' width={654}/>
                    </div>

                    <p style={{ fontSize: '32px', fontWeight: '600', color: '#151515', marginBottom: '30px' }}>
                        Контакты
                    </p>

                    {userLawSubject === 'legal_entity' ? <h3 className='form-label'>Контактный номер телефона компании</h3> : <h3 className='form-label'>Номер телефона</h3>}

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
                                {userLawSubject === 'legal_entity' ? <h3>E-mail компании</h3> : <h3>E-mail</h3>}
                                {submitAttempted && emailError && (
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
                                onChange={handleEmailChange}
                                className={submitAttempted && emailError ? 'error' : ''}
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
                            onChange={handleWebsiteChange}
                            className={submitAttempted && localWebsite && localWebsite.trim().length < 5 ? 'error' : ''}
                        />
                    </div>

                    {/* Чекбокс */}
                    <div className="checkbox-wrapper" onClick={() => setIsCheckedPolicy(prev => !prev)} style={{ margin: '60px 0 0 0' }}>
                        <div className={`custom-checkbox ${isCheckedPolicy ? 'checked' : ''}`}>
                            {isCheckedPolicy && <svg 
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
                                                  </svg>}
                        </div>
                        <span className="checkbox-text">
                            Соглашаюсь с <a className='policy-link'>политикой конфиденциальности</a> и обработкой персональных данных
                        </span>
                    </div>

                    <div className="checkbox-wrapper" onClick={() => setIsCheckedMarketing(prev => !prev)} style={{margin: '5px 0 15px 0'}} >
                        <div className={`custom-checkbox ${isCheckedMarketing ? 'checked' : ''}`}>
                            {isCheckedMarketing && <svg 
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
                                                    </svg>}
                        </div>
                        <span className="checkbox-text"> Хочу получать рекламные рассылки и специальные предложения </span>
                    </div>

                    <button
                        type="button"
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

                        <div className="social-buttons" >
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

                        {/* телефон — только для tg и whatsapp */}
                        {( selectedService === 'whatsapp') && (
                            <div className='passport-field full-width' style={{marginBottom: '-50px'}}>
                                <h3 style={{ fontSize: '24px', fontWeight: '500', textAlign:'left' }}>
                                    Номер телефона
                                </h3>
                                
                                <PhoneNumber
                                    ref={phoneInputRef}
                                    value={localSocialMedia[selectedService]?.phone || phoneNumber}
                                    onChange = {(value) =>
                                        setLocalSocialMedia(prev => ({
                                            ...prev,
                                            [selectedService]: {
                                                ...prev[selectedService],
                                                phone: value
                                            }
                                        }))
                                    }  
                                />
                            </div>
                        )}

                        {/* ник — для tg и vk */}
                        {(selectedService === 'telegram' || selectedService === 'vk') && (
                            <div className='passport-field full-width' >
                                <h3 style={{ fontSize: '24px', fontWeight: '500',  textAlign: 'left' }}>
                                    Ссылка
                                </h3>
                                <input
                                    ref={nicknameInputRef}
                                    value={localSocialMedia[selectedService]?.nickname || ''}
                                    placeholder='Введите ссылку'
                                    onChange={(e) => handleNicknameChange(e, selectedService)}
                                    className={localSocialMedia[selectedService]?.nickname && localSocialMedia[selectedService].nickname.trim().length < 5 ? 'error' : ''}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`save-button ${!modalValid ? 'disabled' : ''}`}
                            onClick={saveSocialMedia}
                            disabled={!modalValid}
                        >
                            Сохранить
                        </button>
                        
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}