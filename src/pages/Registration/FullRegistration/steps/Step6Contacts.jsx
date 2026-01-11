import '../../Registration.css'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import PhoneNumber from '../../common/PhoneNumber'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale1 from '../../../../assets/Main/registr_scale6.svg'
import scale2 from '../../../../assets/Main/registr_scale7.svg'
import tg from '../../../../assets/Main/icon-telegram.svg'
import whatsapp from '../../../../assets/Main/icon-whatsapp.svg'
import vk from '../../../../assets/Main/icon-vk.svg'
import close from '../../../../assets/Main/icon_close.svg'

export default function Step6Contacts() {
    const navigate = useNavigate()
    const { 
        setStepNumber,
        userPhone, setUserPhone,
        userEmail, setUserEmail,
        userSocialMedia, setUserSocialMedia,
        userWebsite, setUserWebsite,
        userLawSubject,
        phoneNumber,
        setUserLawSubject, 
        setUserRegion,
        setUserActivity,
        setTravelReadiness,
        setIndividualEntrepreneurData,
        setSelfEmployedData,
        setLegalEntityData,
        setPassportData,
        setDirectorData,
        setUserExperience,
        setSpecialistsNumber,
        setUserLicense,
        setUserEducationalDiplom,
        setUserCriminalRecord,
        setContractWork,
        setUserService,
        setOtherTeamsInteraction,
        setUserProjects,
        setReviews,
        setCertificates
    } = useAppContext()

    const [isCheckedPolicy, setIsCheckedPolicy] = useState(false)
    const [isCheckedMarketing, setIsCheckedMarketing] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedService, setSelectedService] = useState('')
    const [emailError, setEmailError] = useState('')
    const [submitAttempted, setSubmitAttempted] = useState(false)

    const telegramInputRef = useRef(null)
    const whatsappInputRef = useRef(null)
    const vkInputRef = useRef(null)

    // устанавливаем шаг
    useEffect(() => {
        setStepNumber(6)
    }, [setStepNumber])

    // валидация модального окна
    const isModalValid = () => {
        if (!selectedService) return false

        const data = userSocialMedia[selectedService] || {}

        switch (selectedService) {
            case 'telegram':
                return data.nickname?.trim().length >= 5
            case 'whatsapp':
                const whatsappPhoneDigits = data.phone?.replace(/\D/g, '') || ''
                return whatsappPhoneDigits.length === 11
            case 'vk':
                return data.nickname?.trim().length >= 5
            default:
                return false
        }
    }

    // фокус на поля модалки
    useEffect(() => {
        if (!modalVisible) return

        const timer = setTimeout(() => {
            if (selectedService === 'telegram' && telegramInputRef.current) {
            telegramInputRef.current.focus()
            } else if (selectedService === 'whatsapp' && whatsappInputRef.current) {
            whatsappInputRef.current.focus()
            } else if (selectedService === 'vk' && vkInputRef.current) {
            vkInputRef.current.focus()
            }
        }, 100)

        return () => clearTimeout(timer)
        }, [modalVisible, selectedService])

    // валидация всей формы
    const isFormValid = () => {
        const phoneValid = userPhone.replace(/\D/g, '').length === 11
        const emailValid = /^[a-zA-Zа-яА-ЯёЁ0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userEmail)
        const websiteValid = !userWebsite || userWebsite.trim().length >= 5
        
        return phoneValid && emailValid && isCheckedPolicy && websiteValid
    }

    // проверка заполненности соцсети
    const isSocialMediaFilled = (service) => {
        const data = userSocialMedia[service]
        if (!data) return false
        
        switch(service) {
            case 'telegram':
                return data.nickname?.trim().length >= 5
            case 'whatsapp':
                return data.phone?.replace(/\D/g, '').length === 11
            case 'vk':
                return data.nickname?.trim().length >= 5
            default:
                return false
        }
    }

    const handleBack = () => navigate('/full_registration_step5')

    const handleForward = () => {
        setSubmitAttempted(true)
        
        const phoneValid = userPhone.replace(/\D/g, '').length === 11
        const emailValid = /^[a-zA-Zа-яА-ЯёЁ0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userEmail)
        
        if (!emailValid) {
            setEmailError('Введите корректный email')
            return
        }
        
        if (!phoneValid || !emailValid || !isCheckedPolicy) {
            return 
        }

        console.log('Данные сохранены:', { 
            phone: userPhone, 
            email: userEmail, 
            site: userWebsite, 
            social: userSocialMedia 
        })

        // очистка контекста регистрации
        clearAllRegistrationData()
        
        alert('Полная регистрация завершена')
        navigate('/')
    }

    const handleEmailChange = (e) => {
        const value = e.target.value
        setUserEmail(value)
        if (emailError) {
            setEmailError('')
        }
    }

    const handleWebsiteChange = (e) => {
        setUserWebsite(e.target.value)
    }

    const handleNicknameChange = (e, service) => {
        const value = e.target.value
        setUserSocialMedia(prev => ({
            ...prev,
            [service]: {
                ...prev[service],
                nickname: value
            }
        }))
    }

    const openModal = (service) => {
        setSelectedService(service)
        setModalVisible(true)
        
        // автозаполнение телефона для WhatsApp если не заполнено
        if (service === 'whatsapp') {
            const currentData = userSocialMedia[service] || {}
            if (!currentData.phone && userPhone) {
                setUserSocialMedia(prev => ({
                    ...prev,
                    [service]: {
                        ...prev[service],
                        phone: userPhone
                    }
                }))
            }
        }
    }

    const saveSocialMedia = () => {
        if (isModalValid()) {
            setModalVisible(false)
        }
    }

    const closeModal = () => setModalVisible(false)

    // функция очистки
    const clearAllRegistrationData = () => {
        setUserLawSubject('individual')
        setUserPhone('')
        setUserEmail('')
        setUserRegion([])
        setUserActivity('')
        setTravelReadiness(false)
        setIndividualEntrepreneurData({ FIO: '', INN: '', OGRNIP: '', registrationDate: '', registrationPlace: '', extractOGRNIP: [] })
        setSelfEmployedData({ FIO: '', INN: '', registrationDate: '', registrationCertificate: [] })
        setLegalEntityData({ organizationName: '', INN: '', OGRN: '', registrationDate: '', registrationAddress: '', extractEGRUL: [] })
        setPassportData({ citizenship: 'Российская федерация', otherCountry: '', cisCountry: '', series: '', number: '', issuedBy: '', issueDate: '', scanPages: [], scanRegistration: [] })
        setDirectorData({ FIO: '', phone: '' })
        setUserExperience('')
        setSpecialistsNumber('')
        setUserLicense({ status: '', files: [] })
        setUserEducationalDiplom({ status: '', files: [] })
        setUserCriminalRecord({ status: '', text: '', files: [] })
        setContractWork(false)
        setUserService([{ name: '', price: '', unit: '' }])
        setOtherTeamsInteraction({ status: '', text: '' })
        setUserProjects([{ files: [], text: '' }])
        setReviews({ files: [] })
        setCertificates({ files: [] })
        setUserSocialMedia({})
        setUserWebsite('')
        setStepNumber(1)
        }

    return (
        <div>
            <Header hideElements={true} />

            <div className='reg-container'>
                <div className='registr-container' style={{ height: 'auto', paddingBottom: '27px' }}>
                    <div className='title'>
                        <button className='btn-back' onClick={handleBack}>
                            <img src={arrow} alt='Назад' />
                        </button>
                        <h2 className='login-title'>Полная регистрация</h2>
                    </div>

                    <div className='registr-scale'>
                        <p>6/6</p>
                        <img src={isFormValid() ? scale2 : scale1} alt='Registration scale' width={650}/>
                    </div>

                    <p style={{ fontSize: '32px', fontWeight: '600', color: '#151515', marginBottom: '30px' }}>
                        Контакты
                    </p>

                    {userLawSubject === 'legal_entity' 
                        ? <h3 className='form-label'>Контактный номер телефона компании</h3> 
                        : <h3 className='form-label'>Номер телефона</h3>
                    }

                    {/* номер телефона */}
                    <div className='passport-row'>
                        <div className='passport-field full-width'>
                            <PhoneNumber value={userPhone} onChange={setUserPhone} />
                        </div>
                    </div>

                    {/* email */}
                    <div className='passport-row' style={{ marginTop: '-25px' }}>
                        <div className='passport-field full-width'>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {userLawSubject === 'legal_entity' 
                                    ? <h3>E-mail компании</h3> 
                                    : <h3>E-mail</h3>
                                }
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
                                value={userEmail}
                                onChange={handleEmailChange}
                                className={submitAttempted && emailError ? 'error' : ''}
                            />
                        </div>
                    </div>

                    {/* социальные сети */}
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

                    {/* сайт */}
                    <div className='passport-field' style={{ margin: '25px 0 0 0' }}>
                        <h3 style={{ marginBottom: 0 }}>Сайт</h3>
                        <p style={{ fontSize: '20px', margin: '5px 0 15px 0' }}>
                            Добавьте ссылку на сайт вашей компании (при наличии)
                        </p>
                        <input
                            value={userWebsite || ''}
                            placeholder='Вставьте ссылку на ваш сайт'
                            onChange={handleWebsiteChange}
                            className={submitAttempted && userWebsite && userWebsite.trim().length < 5 ? 'error' : ''}
                        />
                    </div>

                    {/* чекбоксы */}
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
                        className={`continue-button ${!isFormValid() ? 'disabled' : ''}`}
                        onClick={handleForward}
                        style={{ marginTop: '7px' }}
                        disabled={!isFormValid()}
                    >
                        Зарегистрироваться
                    </button>

                </div>
            </div>

            {/* модальное окно */}
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

                        {/* поля ввода */}
                        {selectedService === 'whatsapp' && (
                            <div className='passport-field full-width' style={{marginBottom: '-50px'}}>
                                <h3 style={{ fontSize: '24px', fontWeight: '500', textAlign:'left' }}>
                                    Номер телефона
                                </h3>
                                
                                <PhoneNumber
                                    ref={whatsappInputRef}
                                    value={userSocialMedia[selectedService]?.phone || userPhone || phoneNumber || ''}
                                    onChange={(value) =>
                                        setUserSocialMedia(prev => ({
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

                        {(selectedService === 'telegram' || selectedService === 'vk') && (
                            <div className='passport-field full-width' >
                                <h3 style={{ fontSize: '24px', fontWeight: '500',  textAlign: 'left' }}>
                                    Ссылка
                                </h3>
                                <input
                                    ref={
                                        selectedService === 'telegram' 
                                        ? telegramInputRef 
                                        : vkInputRef
                                    }
                                    value={userSocialMedia[selectedService]?.nickname || ''}
                                    placeholder='Введите ссылку'
                                    onChange={(e) => handleNicknameChange(e, selectedService)}
                                    className={userSocialMedia[selectedService]?.nickname && userSocialMedia[selectedService].nickname.trim().length < 5 ? 'error' : ''}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`save-button ${!isModalValid() ? 'disabled' : ''}`}
                            onClick={saveSocialMedia}
                            disabled={!isModalValid()}
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