import '../../Registration.css'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale7.svg'
import tg from '../../../../assets/Main/icon-telegram.svg'
import whatsapp from '../../../../assets/Main/icon-whatsapp.svg'
import vk from '../../../../assets/Main/icon-vk.svg'


export default function Step7Contacts() {
    const navigate = useNavigate()
    const { 
        stepNumber, setStepNumber,
        userPhone, setUserPhone,
        userEmail, setUserEmail,
        userSocialMedia, setUserSocialMedia,
        userWebsite, setUserWebsite,
    } = useAppContext()
    
    const [isChecked, setIsChecked] = useState(false)       // для согласия с политикой конф

    // ref для первого поля 
    const firstServiceInputRef = useRef(null);

    // фокус на первый инпут
    useEffect(() => {
        firstServiceInputRef.current?.focus();
    }, []);
    

    const handleBack = () => navigate('/full_registration_step6')

    const handleForward = () => {
        // сохраняем всё в контекст перед переходом
        
        setStepNumber(stepNumber + 1)
        alert('Полная регистрация завершена')
        navigate('/')

        console.log()
    }
  return (
    <div>
      
        <Header hideElements={true} />

        <div className='reg-container'>
            <div className='registr-container' style={{ height: '1045px' }}>

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

                <p style={{ fontSize: '32px', fontWeight: '600', color: '#151515', marginBottom: '30px' }}> Контакты </p>


                {/* номер телефона */}
                <div className='passport-row'>
                    <div className='passport-field full-width'>
                        <h3>Номер телефона</h3>
                        <input 
                            ref={firstServiceInputRef}
                            value={userPhone || ''} 
                            placeholder='+7 123 445 78 90' 
                            maxLength={15}
                            //onChange={handleSeriesChange}
                        />
                    </div>
                </div>

                {/* номер телефона */}
                <div className='passport-row' style={{marginTop: '25px'}}>
                    <div className='passport-field full-width'>
                        <h3>E-mail</h3>
                        <input 
                            //ref={seriesInputRef}
                            value={userEmail || ''} 
                            placeholder='abcd@mail.ru' 
                            //onChange={handleSeriesChange}
                        />
                    </div>
                </div>

                {/* соц сети */}
                <div className='passport-field' style={{margin: '25px 0 0 0'}}>
                    <h3 style={{marginBottom: 0}}>Социальные сети</h3>
                    <p style={{fontSize: '20px', margin: '5px 0 15px 0'}}>Добавьте ссылки на ваши социальные сети </p>

                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <button className='btn-social-media'><img src={tg} alt='Icon Telegram' style={{margin: '0 5px 0 -10px'}}/> Telegram </button>
                        <button className='btn-social-media'><img src={whatsapp} alt='Icon Whatsapp' style={{margin: '0 5px 0 -10px'}}/> Whatsapp </button>
                        <button className='btn-social-media'> <img src={vk} alt='Icon Vk' style={{margin: '0 5px 0 -10px'}}/> Вконтакте</button>
                    </div>
                </div>

                {/* сайт */}
                <div className='passport-field' style={{margin: '25px 0 0 0'}}>
                    <h3 style={{marginBottom: 0}}>Сайт</h3>
                    <p style={{fontSize: '20px', margin: '5px 0 15px 0'}}>Добавьте ссылку на сайт вашей компании (при наличии) </p>
                    <input 
                        //ref={seriesInputRef}
                        value={userWebsite || ''} 
                        placeholder='Вставьте ссылку на ваш сайт' 
                        //onChange={handleSeriesChange}
                    />

                </div>

                {/* согласие с политикой конф */}
                <div className="checkbox-wrapper" onClick={() => setIsChecked(!isChecked)} style={{marginTop: '60px'}}>
                    <div 
                        className={`custom-checkbox ${isChecked ? 'checked' : ''}`} 
                        onClick={() => setIsChecked(!isChecked)} >
                        {isChecked && <span className="inner-square"></span>}
                    </div>
                    <span className="checkbox-text">Я соглашаюсь с <a className='policy-link'>политикой конфеденциальности</a> и обработкой персональных данных</span>
                </div>

                <button 
                    type="submit" 
                    className='continue-button'
                    //className={`continue-button ${!isFormValid ? 'disabled' : ''}`}
                    //disabled={!isFormValid}
                    onClick={handleForward}
                    style={{marginTop:'7px'}}
                >
                    Зарегистрироваться
                </button>

            </div>
        </div>

         <Footer />
    </div>
  )
}
