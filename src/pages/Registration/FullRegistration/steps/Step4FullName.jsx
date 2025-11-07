import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import LawSubjectSwitcher from '../../common/LawSubjectSwitcher'
import '../../Registration.css'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale4.svg'


export default function Step4FullName() {
  const navigate = useNavigate()
  const { stepNumber, setStepNumber } = useAppContext()

  const handleBack = () => {
    navigate('/full_registration_step1')
  }

  const handleForward = () => {
    setStepNumber(stepNumber + 1)
    navigate('/full_registration_step5')
  }

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container'>
        <div className='registr-container' style={{minHeight: '943px'}}>

            <div className='title'>
                <button className='btn-back' onClick={handleBack}>
                    <img src={arrow} alt='Назад' />
                </button>
                <h2 className="login-title">Полная регистрация</h2>
            </div>

            <div className='registr-scale'>
                <p>4/7</p>
                <img src={scale} alt='Registration scale' />
            </div>

            <LawSubjectSwitcher />

            <button 
                type="submit" 
                className='continue-button'
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
