import '../../Registration.css'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import arrow from '../../../../assets/Main/arrow_left.svg'
import icon from '../../../../assets/Main/icon_branch_form.svg'


export default function Step0_1Branch() {
  const navigate = useNavigate()

  const handleLater = () => {
    alert('Короткая регистрация исполнителя завершена')
    navigate('/')
  }

  const handleForward = () => {
    alert('Начало полной регистрации исполнителя')
    navigate('/full_registration_step1')
  }

  const handleBack = () => {
    navigate('/full_registration_step0')
  }

  return (
    <div>
      <Header hideElements={true} />

      <div className='reg-container' style={{marginBottom: '410px'}}>
        <div className='registr-container' style={{ height: '397px'}}>
          <div className='title'>
            <button className='btn-back' onClick={handleBack}><img src={arrow} alt='Назад' /></button>
            <img rel="preload" src={icon} alt='Картинка' style={{display: 'block'}} />
          </div>

          <p style={{fontSize:'20px', fontWeight: '500', color: '#000', lineHeight: '1.3', width: '604px', textAlign: 'center', margin: '0 auto'}}>Для получения возможности отклика на заказы, необходимо пройти полную регистрацию – нажмите “<Link to='/full_registration_step1' className="register-here" style={{fontSize: '20px', textDecoration: 'none'}}>Продолжить</Link>”, чтобы сделать это сейчас.</p>

          <div style={{display: 'flex', gap: '20px', marginTop: '40px'}}>
            <button 
              className='continue-button' style={{width: '50%', backgroundColor: '#fff', color: '#02283D', border: '2px solid #02283D'}}  
              onClick={handleLater}> Позже
            </button>
            <button 
              className='continue-button' style={{width: '50%'}}
              onClick={handleForward}> Продолжить
            </button>
          </div>

        </div>
      </div>

      <Footer className='footer footer--registr' />
      
    </div>
  )
}
