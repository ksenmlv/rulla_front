import '../../Registration.css'
import React from 'react'
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

    const handleBack = () => navigate('/full_registration_step4')
    const handleForward = () => {
        setStepNumber(stepNumber + 1)
        navigate('/full_registration_step7')
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


                {/* услуга и стоимость */}
                <div className='passport-row'>
                    <div className='passport-field full-width'>
                      <h3>Наименование услуги и стоимость</h3>
                      <input

                        placeholder='Введите название услуги'
                        
                      />
                    </div>
                </div>
                <div className='passport-row' style={{marginTop: '15px', position: 'relative', width: '100%'}}>
                    <div className='passport-field full-width'>
                      <input

                        placeholder='от'
                        
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

                {/* кнопка "Добавить еще" */}
                <div className='btn-plus'>
                    <button><img src={plus} alt='Add more' />Добавить еще</button>
                </div>


                {/* взаимодействие с другими командами */}
                <div className='passport-field' style={{marginTop: '25px'}}>
                    <h3>Готовы взаимодействовать с другими командами?</h3>

                    <div className="radio-option"  style={{marginBottom:'10px'}}>
                        <input 
                            type="radio" 
                            id="criminal-yes" 
                            name="criminal" 
                            value="yes"
                            checked={otherTeamsInteraction?.status === 'yes'}
                            onChange={() => setOtherTeamsInteraction({ ...otherTeamsInteraction, status: 'yes' })}
                            style={{margin: '0 10px 0 0'}}
                        />
                        <label htmlFor="criminal-yes">Да</label>
                    </div>

                    <div className="radio-option" style={{marginBottom:'10px'}}>
                        <input 
                            type="radio" 
                            id="criminal-no" 
                            name="criminal" 
                            value="no"
                            checked={otherTeamsInteraction?.status === 'no'}
                            onChange={() => setOtherTeamsInteraction({ ...otherTeamsInteraction, status: 'no', text: '' })}
                            style={{margin: '0 10px 0 0'}}
                        />
                        <label htmlFor="criminal-no">Нет</label>
                    </div>

                    <h3 style={{marginTop: '15px'}}>С кем можете взаимодействовать?</h3>
                    <textarea
                        placeholder="Опишите подробнее"
                        disabled={otherTeamsInteraction?.status !== 'yes'}
                        value={otherTeamsInteraction?.text || ''}
                        onChange={(e) => setOtherTeamsInteraction({ ...otherTeamsInteraction, text: e.target.value })}
                        className="country-input"
                    />
                </div>


                {/* реализованные проекты */}
                <div className="passport-field" style={{marginTop: '25px'}}>
                    <h3 style={{marginBottom: 0}}>Реализованные проекты</h3>
                    <p style={{ color: '#000000B2', fontSize: '20px', margin: '10px 0 10px 0' }}>
                        Подробно опишите ваши проекты и добавьте фото/видео
                    </p>

                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div className="file-upload-area" style={{width: '203px', height: '142px'}}>
                            <FileUpload />
                        </div>

                        <textarea
                            placeholder="Добавьте комментарий"
                            value={userProjects?.text || ''}
                            onChange={(e) => setUserProjects({ ...userProjects, text: e.target.value })}
                            className="country-input"
                            style={{width: '491px', height: '142px'}}
                        />
                    </div>

                    <div className='btn-plus'>
                        <button><img src={plus} alt='Add more' />Добавить еще</button>
                    </div>

                </div>


                {/* отзывы заказчиков */}
                <div className='passport-field' style={{marginTop: '10px'}}>
                    <h3 style={{marginBottom: 0}}>Отзывы от заказчиков</h3>
                    <p style={{fontSize: '20px', margin: '10px 0 10px 0'}}>Добавьте фото реальных отзывов от заказчиков </p>
                    <FileUpload />
                </div>

                {/* сертификаты квалификации */}
                <div className='passport-field' style={{marginTop: '20px'}}>
                    <h3>Сертификаты о повышении квалификации</h3>
                    <FileUpload />
                </div>

                <button 
                    type="submit" 
                    //className={`continue-button ${!isFormValid ? 'disabled' : ''}`} 
                    className='continue-button'
                    onClick={handleForward}
                    //disabled={!isFormValid}
                    style={{margin:'50px 0 0 0'}}
                >
                    Продолжить
                </button>


            </div>
        </div>


    </div>
  )
}
