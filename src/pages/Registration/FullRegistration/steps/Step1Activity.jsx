import '../../Registration.css'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RegistrSelector from '../../../../components/lists/RegistrSelector'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale2.svg'

export default function Step1Activity() {
  const navigate = useNavigate()
  const { stepNumber, setStepNumber, userRegion, setUserRegion, userActivity, setUserActivity, travelReadiness, setTravelReadiness } = useAppContext()

   const fioInputRef = useRef(null)

  // проверка на заполненность всех полей
  const isFormComplete = userActivity && userRegion && userRegion.length > 0


  const handleBack = () => {
    navigate('/full_registration_step0_1')
  }

  const handleForward = () => {
    console.log('шаг:', stepNumber, 'region:', userRegion, 'activity:', userActivity )
    setStepNumber(stepNumber + 1)
    navigate('/full_registration_step2')
  }

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container'>
        <div className='registr-container' style={{minHeight: '654px', marginBottom: '175px'}}>

          <div className='title'>
              <button className='btn-back' onClick={handleBack}>
                  <img src={arrow} alt='Назад' />
              </button>
              <h2 className="login-title">Полная регистрация</h2>
          </div>

          <div className='registr-scale' >
              <p >1/6</p>
              <img src={scale} alt='Registration scale' />
          </div>

  
             
              {/* <div className='passport-row'>
                <div className='passport-field full-width'>
                  <h3>ФИО</h3>
                  <input ref={fioInputRef} value={getValue('FIO')} onChange={handleFIOChange} placeholder='Введите ваше ФИО'/>
                </div>
              </div> */}

              <h3 style={{marginBottom:'10px'}}>Регион</h3>
              <RegistrSelector 
                placeholder={'Укажите регион'} 
                subject={['Москва', 'Омск', 'Тюмень', 'Новгород', 'Сочи', 'Ростов']}
                selected={Array.isArray(userRegion) ? userRegion : []}
                onSelect={setUserRegion}
                multiple={true}
                maxSelect={5}
                style={{marginBottom:'20px'}}/>

          <div className="checkbox-wrapper" onClick={() => setTravelReadiness(!travelReadiness)} style={{justifyContent: 'flex-start', margin: '-50px 0 40px 0'}}>
              <div className={`custom-checkbox ${travelReadiness ? 'checked' : ''}`} >
                  {travelReadiness &&     <svg 
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
              <span className="checkbox-text" style={{fontSize: '16px'}}>Готов к выездам в другие регионы</span>
          </div>

          <button 
            type="submit" 
            className={`continue-button ${!isFormComplete ? 'disabled' : ''}`} 
            disabled={!isFormComplete}
            onClick={handleForward}
            style={{marginTop: '50px'}}
          >
            Продолжить
          </button>

        </div>
      </div>

      <Footer className='footer footer--registr' />
    </div>
  )
}
