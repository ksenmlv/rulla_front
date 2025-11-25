import '../../Registration.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RegistrSelector from '../../../../components/lists/RegistrSelector'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale2.svg'


export default function Step2Activity() {
  const navigate = useNavigate()
  const { stepNumber, setStepNumber, userRegion, setUserRegion, userActivity, setUserActivity, travelReadiness, setTravelReadiness } = useAppContext()

  // проверка на заполненность всех полей
  const isFormComplete = userActivity && userRegion

  // обработчики для получения выбранных значений
  const handleActivitySelect = (activity) => {
    setUserActivity(activity)
  }
  const handleRegionSelect = (region) => {
    setUserRegion(region)
  }
  
  // нажатие на стрелку назад
  const handleBack = () => {
    navigate('/full_registration_step1')
  }

  const handleForward = () => {
    console.log(userRegion, userActivity, travelReadiness)
    setUserActivity('')
    setUserRegion('')

    setStepNumber(stepNumber + 1)
    navigate('/full_registration_step3')
  }

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container'>
        <div className='registr-container' style={{minHeight: '660px'}}>

          <div className='title'>
              <button className='btn-back' onClick={handleBack}>
                  <img src={arrow} alt='Назад' />
              </button>
              <h2 className="login-title">Полная регистрация</h2>
          </div>

          <div className='registr-scale' >
              <p >2/7</p>
              <img src={scale} alt='Registration scale' />
          </div>

          {/* 2 поля данных */}
          <div className='input-fields' style={{marginBottom:'40px'}}>
              <h3 style={{marginBottom:'10px'}}>Вид деятельности</h3>
              <RegistrSelector 
                placeholder={'Укажите деятельность'} 
                subject={[ 'Название деятельности 1',
                            'Название деятельности 2',
                            'Название деятельности 3',
                            'Название деятельности 4',
                            'Название деятельности 5',
                            'Название деятельности 6',
                            'Название деятельности 7',
                            'Название деятельности 8',
                            'Название деятельности 9',
                            'Название деятельности 10',
                            'Название деятельности 11',
                            'Название деятельности 12',
                            'Название деятельности 13',
                            'Название деятельности 14',
                            'Название деятельности 15',
                            'Название деятельности 16',
                            'Название деятельности 17',
                            'Название деятельности 18',
                            'Название деятельности 19',
                            'Название деятельности 20']}
                onSelect={handleActivitySelect}
                style={{marginBottom:'20px'}} />
              <h3 style={{marginBottom:'10px'}}>Регион</h3>
              <RegistrSelector 
                placeholder={'Укажите регион'} 
                subject={['Москва', 'Омск', 'Тюмень', 'Новгород', 'Сочи', 'Ростов']}
                onSelect={handleRegionSelect}
                multiple={true}
                maxSelect={2}
                style={{marginBottom:'20px'}}/>
          </div>

          <div className="checkbox-wrapper" onClick={() => setTravelReadiness(!travelReadiness)} style={{justifyContent: 'flex-start', margin: '-50px 0 40px 0'}}>
              <div 
                className={`custom-checkbox ${travelReadiness  ? 'checked' : ''}`}  >
                  {travelReadiness && <span className="inner-square"></span>}
              </div>
              <span className="checkbox-text" style={{fontSize: '20px'}}>Готов к выездам в другие регионы</span>
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
