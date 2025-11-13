import '../../Registration.css'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import FileUpload from '../../common/FileUpload'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale6.svg'
import plus from '../../../../assets/Main/plus.svg'

export default function Step6Services() {
    const navigate = useNavigate()
    const { 
        stepNumber, setStepNumber,
        userService, setUserService,
        otherTeamsInteraction, setOtherTeamsInteraction,
        userProjects, setUserProjects,
        reviews, setReviews,
        certificates, setCertificates,
    } = useAppContext()

    // локальные состояния для редактирования 
    const [userServices, setUserServices] = useState(userService || [{ name: '', price: '' }])
    const [projects, setProjects] = useState(userProjects || [{ files: [], text: '' }])
    const [interaction, setInteraction] = useState(otherTeamsInteraction || { status: '', text: '' })
    const [isFormValid, setIsFormValid] = useState(false)

    // ref для первого поля 
    const firstServiceInputRef = useRef(null);

    // фокус на первый инпут
    useEffect(() => {
        firstServiceInputRef.current?.focus();
    }, []);


    // обработчик добавление услуги 
    const handleAddService = () => {
        setUserServices([...userServices, { name: '', price: '' }])
    }

    // обработчик добавление проекта 
    const handleAddProject = () => {
        setProjects([...projects, { files: [], text: '' }])
    }

    // обновление конкретной услуги 
    const handleServiceChange = (index, field, value) => {
        const updated = userServices.map((s, i) => i === index ? { ...s, [field]: value } : s)
        setUserServices(updated)
    }

    // обновление конкретного проекта
    const handleProjectChange = (index, field, value) => {
        const updated = projects.map((p, i) => i === index ? { ...p, [field]: value } : p)
        setProjects(updated)
    }

    // удаление услуги
    const handleRemoveService = (index) => {
        const updated = userServices.filter((_, i) => i !== index)
        setUserServices(updated)
    }

    // удаление проекта
    const handleRemoveProject = (index) => {
        const updated = projects.filter((_, i) => i !== index)
        setProjects(updated)
    }


    // валидация всей формы 
    useEffect(() => {
        const allServicesFilled = userServices.every(s => s.name.trim() && s.price.trim())
        const interactionValid =
            interaction.status === 'yes' ? interaction.text.trim() : interaction.status === 'no'
        const allProjectsFilled = projects.every(p => p.text.trim())
        const hasReviews = reviews?.files?.length > 0
        const hasCertificates = certificates?.files?.length > 0

        setIsFormValid(allServicesFilled && interactionValid && allProjectsFilled && hasReviews && hasCertificates)
    }, [userServices, interaction, projects, reviews, certificates])



    // переходы
    const handleBack = () => navigate('/full_registration_step5')

    const handleForward = () => {
        // сохраняем всё в контекст перед переходом
        setUserService(userServices)
        setOtherTeamsInteraction(interaction)
        setUserProjects(projects)
        setReviews(reviews)
        setCertificates(certificates)
        setStepNumber(stepNumber + 1)
        navigate('/full_registration_step7')

        console.log(userServices, interaction, projects, reviews, certificates)
    }

    return (
        <div>
            <Header hideElements={true} />

            <div className='reg-container'>
                <div className='registr-container' style={{ height: 'auto' }}>
                    
                    <div className='title'>
                        <button className='btn-back' onClick={handleBack}>
                            <img src={arrow} alt='Назад' />
                        </button>
                        <h2 className='login-title'>Полная регистрация</h2>
                    </div>

                    <div className='registr-scale'>
                        <p>6/7</p>
                        <img src={scale} alt='Registration scale' />
                    </div>

                    <p style={{ fontSize: '32px', fontWeight: '600', color: '#151515', marginBottom: '30px' }}>
                        Услуги и реализованные проекты:
                    </p>

                    {/* === Блок услуг === */}
                    {userServices.map((service, index) => (
                        <div key={index} style={{ position: 'relative', marginBottom: '20px' }}>

                            {index > 0 && (
                                <button
                                    onClick={() => handleRemoveService(index)}
                                    style={{
                                        position: 'absolute',
                                        right: '-40px',
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '24px',
                                        color: '#ff4d4d',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ✕
                                </button>
                            )}

                            <div className='passport-row'>
                                <div className='passport-field full-width'>
                                    {index === 0 && <h3>Наименование услуги и стоимость</h3>}
                                    <input
                                        ref={index === 0 ? firstServiceInputRef : null}
                                        placeholder='Введите название услуги'
                                        value={service.name}
                                        onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='passport-row' style={{marginTop: '15px', position: 'relative', width: '100%'}}>
                                <div className='passport-field full-width'>
                                    <input
                                        placeholder='от'
                                        value={service.price}
                                        onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                                        style={{paddingRight: '50px'}}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        right: '20px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#656565',
                                        fontSize: '20px',
                                        pointerEvents: 'none'
                                    }}> ₽ </span>
                                </div>
                            </div>

                        </div>
                    ))}


                    <div className='btn-plus'>
                        <button onClick={handleAddService}><img src={plus} alt='Add more' />Добавить еще</button>
                    </div>

                    {/* === Взаимодействие с другими командами === */}
                    <div className='passport-field' style={{marginTop: '25px'}}>
                        <h3>Готовы взаимодействовать с другими командами?</h3>

                        <div className="radio-option" style={{marginBottom:'10px'}}>
                            <input 
                                type="radio" 
                                id="yes"
                                name="interaction"
                                value="yes"
                                checked={interaction.status === 'yes'}
                                onChange={() => setInteraction({ ...interaction, status: 'yes' })}
                                style={{margin: '0 10px 0 0'}}
                            />
                            <label htmlFor="yes">Да</label>
                        </div>

                        <div className="radio-option" style={{marginBottom:'10px'}}>
                            <input 
                                type="radio" 
                                id="no"
                                name="interaction"
                                value="no"
                                checked={interaction.status === 'no'}
                                onChange={() => setInteraction({ status: 'no', text: '' })}
                                style={{margin: '0 10px 0 0'}}
                            />
                            <label htmlFor="no">Нет</label>
                        </div>

                        <h3 style={{marginTop: '15px'}}>С кем можете взаимодействовать?</h3>
                        <textarea
                            placeholder="Опишите подробнее"
                            disabled={interaction.status !== 'yes'}
                            value={interaction.text}
                            onChange={(e) => setInteraction({ ...interaction, text: e.target.value })}
                            className="country-input"
                        />
                    </div>

                    {/* === Реализованные проекты === */}
                    {projects.map((project, index) => (
                        <div key={index} style={{ position: 'relative', marginTop: '25px' }}>

                            {index > 0 && (
                                <button
                                    onClick={() => handleRemoveProject(index)}
                                    style={{
                                        position: 'absolute',
                                         right: '-40px',
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '24px',
                                        color: '#ff4d4d',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ✕
                                </button>
                            )}

                            {index === 0 && (
                                <>
                                    <h3 style={{marginBottom: 0}}>Реализованные проекты</h3>
                                    <p style={{ color: '#000000B2', fontSize: '20px', margin: '10px 0 10px 0' }}>
                                        Подробно опишите ваши проекты и добавьте фото/видео
                                    </p>
                                </>
                            )}

                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div className="file-upload-area" style={{width: '203px', height: '142px'}}>
                                    <FileUpload />
                                </div>
                                <textarea
                                    placeholder="Добавьте комментарий"
                                    value={project.text}
                                    onChange={(e) => handleProjectChange(index, 'text', e.target.value)}
                                    className="country-input"
                                    style={{width: '491px', height: '142px'}}
                                />
                            </div>

                        </div>
                    ))}


                    <div className='btn-plus'>
                        <button onClick={handleAddProject}><img src={plus} alt='Add more' />Добавить еще</button>
                    </div>

                    {/* === Отзывы === */}
                    <div className='passport-field' style={{marginTop: '10px'}}>
                        <h3 style={{marginBottom: 0}}>Отзывы от заказчиков</h3>
                        <p style={{fontSize: '20px', margin: '10px 0 10px 0'}}>Добавьте фото реальных отзывов от заказчиков </p>
                        <FileUpload onFilesUpload={(files) => setReviews({ files })} /> 
                    </div>

                    {/* === Сертификаты === */}
                    <div className='passport-field' style={{marginTop: '25px'}}>
                        <h3>Сертификаты о повышении квалификации</h3>
                        <FileUpload onFilesUpload={(files) => setCertificates({ files })} />
                    </div>

                    <button 
                        type="submit" 
                        className={`continue-button ${!isFormValid ? 'disabled' : ''}`}
                        onClick={handleForward}
                        disabled={!isFormValid}
                        style={{margin:'50px 0 0 0'}}
                    >
                        Продолжить
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    )
}
