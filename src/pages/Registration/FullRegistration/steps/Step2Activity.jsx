import '../../Registration.css'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RegistrSelector from '../../../../components/lists/RegistrSelector'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale2.svg'

export default function Step2Activity() {
  const navigate = useNavigate()
  const { stepNumber, setStepNumber, setUserRegion, setUserActivity, setTravelReadiness } = useAppContext()

  // локальные состояния
  const [localActivity, setLocalActivity] = useState('')
  const [localRegion, setLocalRegion] = useState([])
  const [localTravelReadiness, setLocalTravelReadiness] = useState(false)

  // при загрузке читаем данные из localStorage
  useEffect(() => {
    const savedActivity = localStorage.getItem('userActivity')
    const savedRegion = localStorage.getItem('userRegion')
    const savedTravel = localStorage.getItem('travelReadiness')

    if (savedActivity) setLocalActivity(savedActivity)
    if (savedRegion) setLocalRegion(JSON.parse(savedRegion))
    if (savedTravel) setLocalTravelReadiness(savedTravel === 'true')
  }, [])

  // сохраняем изменения в localStorage
  useEffect(() => {
    localStorage.setItem('userActivity', localActivity)
  }, [localActivity])

  useEffect(() => {
    localStorage.setItem('userRegion', JSON.stringify(localRegion))
  }, [localRegion])

  useEffect(() => {
    localStorage.setItem('travelReadiness', localTravelReadiness)
  }, [localTravelReadiness])

  // проверка на заполненность всех полей
  const isFormComplete = localActivity && localRegion.length > 0

  // обработчики для получения выбранных значений
  const handleActivitySelect = (activity) => setLocalActivity(activity)
  const handleRegionSelect = (region) => setLocalRegion(region)
  const handleTravelReadinessToggle = () => setLocalTravelReadiness(prev => !prev)

  const handleBack = () => {
    setLocalActivity('')
    navigate('/full_registration_step1')
  }

  const handleForward = () => {
    // сохраняем в глобальный контекст
    // setUserActivity(localActivity)
    // setUserRegion(localRegion)
    // setTravelReadiness(localTravelReadiness)

    setLocalActivity('')

    setStepNumber(stepNumber + 1)
    navigate('/full_registration_step3')
  }

  return (
    <div>
      <Header hideElements={true} />
      <div className='reg-container'>
        <div className='registr-container' style={{minHeight: '654px'}}>
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

          <div className='input-fields' style={{marginBottom:'40px'}}>
              <h3 style={{marginBottom:'10px'}}>Вид деятельности</h3>
              <RegistrSelector 
                placeholder={'Укажите деятельность'} 
                subject={[ 'Название деятельности 1','Название деятельности 2','Название деятельности 3','Название деятельности 4','Название деятельности 5','Название деятельности 6','Название деятельности 7','Название деятельности 8','Название деятельности 9','Название деятельности 10','Название деятельности 11','Название деятельности 12','Название деятельности 13','Название деятельности 14','Название деятельности 15','Название деятельности 16','Название деятельности 17','Название деятельности 18','Название деятельности 19','Название деятельности 20']}
                selected={localActivity}
                onSelect={handleActivitySelect}
                style={{marginBottom:'20px'}} />

              <h3 style={{marginBottom:'10px'}}>Регион</h3>
              <RegistrSelector 
                placeholder={'Укажите регион'} 
                subject={['Москва', 'Омск', 'Тюмень', 'Новгород', 'Сочи', 'Ростов']}
                selected={Array.isArray(localRegion) ? localRegion : []}
                onSelect={handleRegionSelect}
                multiple={true}
                maxSelect={2}
                style={{marginBottom:'20px'}}/>
          </div>

          <div className="checkbox-wrapper" onClick={handleTravelReadinessToggle} style={{justifyContent: 'flex-start', margin: '-50px 0 40px 0'}}>
              <div className={`custom-checkbox ${localTravelReadiness ? 'checked' : ''}`} >
                  {localTravelReadiness &&     <svg 
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
