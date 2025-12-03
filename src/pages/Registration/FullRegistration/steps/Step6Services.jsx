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
import RegistrSelector from '../../../../components/lists/RegistrSelector'


export default function Step6Services() {
    const navigate = useNavigate()
    const { 
        stepNumber, setStepNumber,
        userService, setUserService,
        otherTeamsInteraction, setOtherTeamsInteraction,
        userProjects, setUserProjects,
        reviews, setReviews,
        certificates, setCertificates,
        userLawSubject
    } = useAppContext()

    const [userServices, setUserServices] = useState(userService || [{ name: '', price: '' }])
    const [projects, setProjects] = useState(userProjects || [{ files: [], text: '' }])
    const [interaction, setInteraction] = useState(otherTeamsInteraction || { status: '', text: '' })
    const [isFormValid, setIsFormValid] = useState(false)

    // фокус на первое поле
    const firstServiceInputRef = useRef(null)
    useEffect(() => { firstServiceInputRef.current?.focus() }, [])

    const addItem = (setter, defaultValue) => setter(prev => [...prev, defaultValue])
    const removeItem = (setter, index) => setter(prev => prev.filter((_, i) => i !== index))
    const updateItem = (setter, index, field, value) => setter(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))

    // валидация формы
    useEffect(() => {
    // название услуги минимум 3 символа
    const allServicesFilled = userServices.every(s => 
        s.name.trim().length >= 3 && s.price.trim()
    );
    
    // цена содержит цифры
    const allPricesValid = userServices.every(s => 
        s.price.replace(/\D/g, '').length > 0
    );
    
    // все проекты имеют минимум 5 символов
    const allProjectsValid = projects.every(p => 
        p.text.trim().length >= 5
    );
    
    const interactionValid = interaction.status === 'yes' 
        ? interaction.text.trim() 
        : interaction.status === 'no';
    
    setIsFormValid(allServicesFilled && allPricesValid && allProjectsValid && interactionValid);
    }, [userServices, interaction, projects]);


    // обработчик названия услуги (минимум 3 символа)
    const handleServiceNameChange = (index, value) => {
        updateItem(setUserServices, index, 'name', value);
    }

    // обработчик цены (только цифры)
    const handleServicePriceChange = (index, value) => {
        // только цифры
        const digits = value.replace(/\D/g, '');
        updateItem(setUserServices, index, 'price', digits);
    }

    // обработчик текста проекта (минимум 5 символов)
    const handleProjectTextChange = (index, value) => {
        updateItem(setProjects, index, 'text', value);
    }

    const handleBack = () => navigate('/full_registration_step5')

    const handleForward = () => {
        setUserService(userServices)
        setOtherTeamsInteraction(interaction)
        setUserProjects(projects)
        console.log(userServices, interaction, projects)
        setStepNumber(stepNumber + 1)
        navigate('/full_registration_step7')
    }

    return (
        <div>
            <Header hideElements />
            <div className='reg-container'>
                <div className='registr-container' style={{ height: 'auto', paddingBottom: '57px' }}>

                    <div className='title'>
                        <button className='btn-back' onClick={handleBack}>
                            <img src={arrow} alt='Назад' />
                        </button>
                        <h2 className='login-title'>Полная регистрация</h2>
                    </div>

                    <div className='registr-scale'>
                        <p>5/6</p>
                        <img src={scale} alt='Registration scale' />
                    </div>

                    <p style={{ fontSize: '32px', fontWeight: '600', color: '#151515', marginBottom: '30px' }}>
                        Услуги и реализованные проекты
                    </p>

                    {/* услуги */}
                    {userServices.map((s, i) => (
                        <div key={i} style={{ position: 'relative', marginBottom: '25px' }}>

                            {/* показываем крестик, когда больше 1 элемента */}
                            {userServices.length > 1 && (
                                <button 
                                    className='file-remove' 
                                    onClick={() => removeItem(setUserServices, i)}
                                    style={i === 0 ? { top: '42px' } : {}}
                                >
                                    ✕
                                </button>
                            )}
                            
                            <div className='passport-row'>
                                <div className='passport-field full-width'>
                                    {i === 0 && <h3>Наименование услуги и стоимость</h3>}
                                    <input
                                        ref={i === 0 ? firstServiceInputRef : null}
                                        placeholder='Введите название услуги'
                                        value={s.name}
                                        onChange={(e) => handleServiceNameChange(i, e.target.value)} 
                                    />
                                </div>
                            </div>

                            <div className='passport-row' style={{ marginTop: '15px', position: 'relative', width: '100%' }}>
                                <div className='passport-field '>
                                    <input
                                        placeholder='от'
                                        value={s.price}
                                        onChange={(e) => handleServicePriceChange(i, e.target.value)}
                                        style={{ paddingRight: '50px' }}
                                    />
                                    <span style={{
                                        position: 'absolute', left: '310px', top: '50%',
                                        transform: 'translateY(-50%)', color: '#656565', fontSize: '20px', pointerEvents: 'none'
                                    }}>₽</span>
                                </div>
                                <div className='passport-field '>
                                    <div className='registr-selector-wrapper'>
                                        <RegistrSelector 
                                            placeholder='за'
                                            subject={['за услугу', 'за метр', 'за м²', 'за м³', 'за шт', 'за час']} 
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}

                    <div className='btn-plus'>
                        <button onClick={() => addItem(setUserServices, { name: '', price: '' })} style={{marginTop: '-5px'}}>
                            <img src={plus} alt='Add more' />Добавить еще
                        </button>
                    </div>

                    {/* взаимодействие с другими командами */}
                    <div className='passport-field' style={{ marginTop: '25px' }}>
                        <h3>Готовы взаимодействовать с другими командами?</h3>
                        {['yes','no'].map(val => (
                            <div className='radio-option' key={val} style={{ marginBottom: '10px' }}>
                                <input
                                    type='radio' id={val} name='interaction' value={val}
                                    checked={interaction.status === val}
                                    onChange={() => setInteraction(val === 'yes' ? { ...interaction, status: 'yes' } : { status: 'no', text: '' })}
                                    style={{ margin: '0 10px 0 0' }}
                                />
                                <label htmlFor={val}>{val === 'yes' ? 'Да' : 'Нет'}</label>
                            </div>
                        ))}

                    </div>

                    {/* реализованные проекты */}
                    {projects.map((p, i) => (
                        <div key={i} style={{ position: 'relative', marginTop: '20px' }}>

                            {/* показываем крестик, когда больше 1 элемента */}
                            {projects.length > 1 && (
                                <button 
                                    className='file-remove' 
                                    onClick={() => removeItem(setProjects, i)}
                                    style={i === 0 ? { top: '70px' } : {}}
                                >
                                    ✕
                                </button>
                            )}

                            {i === 0 && <>
                                <h3 style={{fontSize: '24px', color: '#000000', marginBottom: 0 }}>Реализованные проекты</h3>            
                                <p style={{ color: '#000000B2', fontSize: '20px', margin: '0 0 10px 0'}}>Подробно опишите ваши проекты и добавьте фото/видео </p>
                            </>} 

                            <div style={{ display: 'flex', justifyContent: 'space-between', minHeight: '142px', height: 'auto' }}>
                                <div className='file-upload-area' style={{ width: '203px' }}>
                                    <FileUpload maxFiles={10}/>
                                </div>
                                <textarea
                                    placeholder='Опишите подробности проекта (бюджет, сроки, поставленные задачи и др.)'
                                    value={p.text}
                                    onChange={(e) => handleProjectTextChange(i, e.target.value)} 
                                    className='country-input'
                                    style={{ width: '491px', height: 'auto', lineHeight: '1.2' }}
                                />
                            </div>
                        </div>
                    ))}

                    <div className='btn-plus'>
                        <button onClick={() => addItem(setProjects, { files: [], text: '' })}>
                            <img src={plus} alt='Add more' />Добавить еще
                        </button>
                    </div>

                    <p style={{ color: '#00000078', fontSize: '16px', margin: '-50px 0 10px 0', width: '500px', lineHeight: '1.1' }}>Вы сможете добавить дополнительные файлы в личном кабинете после регистрации</p> <br></br>

                    {/* отзывы */}
                    <div className='passport-field' style={{ marginTop: '10px' }}>
                        <h3 style={{ marginBottom: 0 }}>Отзывы от заказчиков</h3>
                        <p style={{ fontSize: '20px', margin: '5px 0 10px 0' }}>Добавьте фото реальных отзывов от заказчиков</p>
                        <FileUpload maxFiles={10} onFilesUpload={(files) => setReviews({ files })} />
                        <p style={{ color: '#00000078', fontSize: '16px', margin: '10px 0 10px 0',  lineHeight: '1.1' }}>Вы сможете добавить дополнительные файлы в личном кабинете после регистрации</p> 
                    </div>

                    {/* сертификаты */}
                    {userLawSubject !== 'legal_entity' && (
                        <div className='passport-field' style={{ marginTop: '25px' }}>
                            <h3>Сертификаты о повышении квалификации</h3>
                            <FileUpload maxFiles={10} onFilesUpload={(files) => setCertificates({ files })} />
                            <p style={{ color: '#00000078', fontSize: '16px', margin: '10px 0 10px 0',  lineHeight: '1.1' }}>Вы сможете добавить дополнительные файлы в личном кабинете после регистрации</p> 
                        </div>
                    )}

                    <button
                        type='submit'
                        className={`continue-button ${!isFormValid ? 'disabled' : ''}`}
                        onClick={handleForward}
                        disabled={!isFormValid}
                        style={{ margin: '50px 0 0 0' }}
                    >
                        Продолжить
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    )
}
