import React, { useState } from 'react'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import FileUpload from '../../common/FileUpload'
import '../../Registration.css'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale3.svg'
import { useNavigate } from 'react-router-dom'



export default function Step3Passport() {
  const { stepNumber, setStepNumber, userCitizenship, setUserCitizenship } = useAppContext()
  const navigate = useNavigate()

  const regions = ['Российская федерация', 'Страны СНГ', 'Другое']
  const [countryInput, setCountryInput] = useState('')


  const handleCountryChange = (country) => {
    setUserCitizenship(country)
    // очистка поля ввода при выборе РФ
    if (country === 'Российская федерация') {
      setCountryInput('')
    }
  }

  const handleBack = () => {
    navigate('/full_registration_step2')
  }

  const handleForward = () => {
    setStepNumber(stepNumber + 1)
    navigate('/full_registration_step4')
  }

  return (
    <div>

        <Header hideElements={true} />

        <div className='reg-container'>
            <div className='registr-container' style={{minHeight: '1483px'}}>

                <div className='title'>
                    <button className='btn-back' onClick={handleBack}>
                        <img src={arrow} alt='Назад' />
                    </button>
                    <h2 className="login-title">Полная регистрация</h2>
                </div>

                <div className='registr-scale'>
                    <p>3/7</p>
                    <img src={scale} alt='Registration scale' />
                </div>

                <div className='passport-details'>
                    <h2>Паспортные данные:</h2>

                    <h3>Гражданство</h3>

                    {/* выбор страны */}
                    <div className='country-selection'>
                        <div className='radio-group'>
                            {regions.map((region, index) => (
                                <div key={index} className="radio-option">
                                    <input
                                        type="radio"
                                        id={`country-${index}`}
                                        name="country"
                                        value={region}
                                        checked={userCitizenship === region}
                                        onChange={() => handleCountryChange(region)}
                                    />
                                    <label htmlFor={`country-${index}`}>
                                        {region}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* инпут для ввода страны */}
                        <div className="country-input-container">
                            <textarea
                                className="country-input"
                                placeholder={
                                    userCitizenship === 'Российская федерация' 
                                    ? 'Введите название страны' 
                                    : userCitizenship === 'Страны СНГ'
                                    ? 'Введите название страны СНГ'
                                    : 'Введите название страны'
                                }
                                value={countryInput}
                                onChange={(e) => setCountryInput(e.target.value)}
                                disabled={userCitizenship === '' || userCitizenship === 'Российская федерация'}
                            />
                        </div>
                    </div>

                    {/* паспортные данные */}
                    <div className='passport-fields-grid'>
                        <div className='passport-row'>
                            <div className='passport-field'>
                                <h3>Серия паспорта</h3>
                                <input placeholder='00 00' />
                            </div>
                            
                            <div className='passport-field'>
                                <h3>Номер паспорта</h3>
                                <input placeholder='000000' />
                            </div>
                        </div>
                        
                        <div className='passport-row'>
                            <div className='passport-field'>
                                <h3>Паспорт выдан</h3>
                                <input placeholder='ГУ МВД России по г. Москве' />
                            </div>
                            
                            <div className='passport-field'>
                                <h3>Дата выдачи</h3>
                                <input placeholder='00.00.00' />
                            </div>
                        </div>

                        <div className='passport-row'>
                            <div className='passport-field'>
                                <h3>Скан главного разворота</h3>
                                <FileUpload />
                                <p>Добавьте скан 2-3 страницы паспорта</p>
                            </div>
                            
                            <div className='passport-field'>
                                <h3>Скан регистрации</h3>
                                <FileUpload />
                                <p>Добавьте скан 5 страницы паспорта</p>
                            </div>

                            <div className='passport-field'>
                                <h3>Подтверждение личности</h3>
                                <FileUpload />
                                <p>Добавьте фото, на котором четко видно ваше лицо и главный разворот паспорта</p>
                            </div>
                        </div>

                    </div>
                </div>

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
