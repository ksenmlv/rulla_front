import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RegistrSelector from '../../../../components/lists/RegistrSelector'
import '../../Registration.css'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale5.svg'


export default function Step5Experience() {
  const navigate = useNavigate()
  const { stepNumber, setStepNumber, userExperience, setUserExperience, specialistsNumber, setSpecialistsNumber, } = useAppContext()

  // проверка на заполненность всех полей
  const isFormComplete = userExperience && specialistsNumber

  // обработчики для получения выбранных значений
  const handleExperienceSelect = (experience) => {
    setUserExperience(experience)
  }
  const handleSpecialistsNumberSelect = (specialistsNumber) => {
    setSpecialistsNumber(specialistsNumber)
  }


  const handleBack = () => {
    navigate('/full_registration_step1')
  }

  const handleForward = () => {
    setStepNumber(stepNumber + 1)
    navigate('/full_registration_step3')
  }

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container'>
        <div className='registr-container' style={{minHeight: '2124px'}}>

          <div className='title'>
              <button className='btn-back' onClick={handleBack}>
                  <img src={arrow} alt='Назад' />
              </button>
              <h2 className="login-title">Полная регистрация</h2>
          </div>

          <div className='registr-scale' >
              <p>5/7</p>
              <img src={scale} alt='Registration scale' />
          </div>

          <p style={{fontSize:'32px', fontWeight:'600', color: '#151515', marginBottom:'30px'}}>Дополнительная информация:</p>

          <div className='input-fields' style={{marginBottom:'40px'}}>
              <h3>Опыт работы</h3>
              <RegistrSelector 
                placeholder={'Укажите опыт работы'} 
                subject={[ '1', '2']}
                onSelect={handleExperienceSelect} />
              <h3>Количество специалистов в компании</h3>
              <RegistrSelector 
                placeholder={'Укажите количество специалистов'} 
                subject={['1', 'до 5', 'до 10', 'до 20', 'до 30', 'более 30']}
                onSelect={handleSpecialistsNumberSelect}/>
          </div>
        
        </div>
      </div>  

      <Footer className='footer footer--registr' />
    </div>
  )
}
