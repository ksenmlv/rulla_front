import '../../Registration.css'
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import RegistrSelector from '../../../../components/lists/RegistrSelector'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import DatePicker from '../../common/Calendar/DatePicker'
import FileUpload from '../../common/FileUpload'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale3.svg'


export default function Step4Passport() {
  const navigate = useNavigate()
  const { stepNumber, setStepNumber, passportData, setPassportData } = useAppContext()

  const citizenshipOptions = ['Российская федерация', 'Страны СНГ', 'Другое']
  const [isFormValid, setIsFormValid] = useState(false)
  const [dateError, setDateError] = useState('')

  const seriesRef = useRef(null)
  const countryRef = useRef(null)
  const numberRef = useRef(null)

  const isRussian = passportData.citizenship === 'Российская федерация'
  const isNotRussian = !isRussian
 
  const CIScountries = ["Азербайджан", "Армения", "Белоруссия", "Казахстан", "Киргизия", "Молдавия", "Таджикистан", "Туркменистан", "Узбекистан", "Украина"]


  // автофокус на первое поле
  useEffect(() => {
    setTimeout(() => {
      if (isRussian) seriesRef.current?.focus()
      else if (isNotRussian) countryRef.current?.focus()
    }, 100)
  }, [passportData.citizenship, isRussian, isNotRussian])

  // загрузка данных из localStorage при первом рендере
  useEffect(() => {
    const saved = localStorage.getItem("passportData")
    if (saved) {
      setPassportData(JSON.parse(saved))
    }}, [])

  // запись в localStorage при каждом изменении паспорта
  useEffect(() => {
    localStorage.setItem("passportData", JSON.stringify(passportData))
  }, [passportData])

  // обновление данных паспорта
  const updatePassport = (field, value) => {
    setPassportData(prev => ({ ...prev, [field]: value }))
  }

  // обновление файлов
  const handleFileUpload = (field, files) => {
    updatePassport(field, files)
  }

  // валидация даты
  const handleDateChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0,6)
    let formatted = digits
    if (digits.length > 4) formatted = digits.slice(0,2) + '.' + digits.slice(2,4) + '.' + digits.slice(4)
    else if (digits.length > 2) formatted = digits.slice(0,2) + '.' + digits.slice(2)

    updatePassport('issueDate', formatted)

    if (digits.length === 6) {
      const day = parseInt(digits.slice(0,2))
      const month = parseInt(digits.slice(2,4))
      const year = parseInt('20'+digits.slice(4,6))
      const date = new Date(year, month-1, day)
      const valid = isValidDate(formatted) 
      setDateError(valid ? '' : 'Некорректная дата')
    } else setDateError('')
  }

  // валидация даты
  const isValidDate = (dateStr) => {
    if (!dateStr) return false
    const digits = dateStr.replace(/\D/g,'')
    if (digits.length !== 6) return false

    const day = parseInt(digits.slice(0,2))
    const month = parseInt(digits.slice(2,4))
    const year = parseInt('20'+digits.slice(4,6))
    const date = new Date(year, month-1, day)
    return date.getDate()===day && date.getMonth()===month-1 && date.getFullYear()===year && date <= new Date()
  }

  // валидация формы
  useEffect(() => {
    const validate = () => {
      const fieldsFilled = isRussian
        ? passportData.series && passportData.number && passportData.issuedBy && passportData.issueDate
        : passportData.number && passportData.issuedBy && passportData.issueDate

      const dateValid = isValidDate(passportData.issueDate)
      const scanValid = (passportData.scanPages?.length > 0) && (passportData.scanRegistration?.length > 0)
      const otherCountryValid = passportData.citizenship !== 'Другое' || (passportData.otherCountry?.trim().length > 0)
      const seriesValid = !isRussian || (passportData.series.replace(/\s/g,'').length === 4)
      const numberValid = isRussian ? passportData.number.replace(/\D/g,'').length === 6 : passportData.number?.trim().length > 0

      setIsFormValid(fieldsFilled && dateValid && scanValid && otherCountryValid && seriesValid && numberValid)
    }
    validate()
  }, [passportData, dateError, isRussian])

  const handleCountryChange = (country) => {
    setPassportData({
      citizenship: country,
      otherCountry: '',
      cisCountry: '',
      series: '',
      number: '',
      issuedBy: '',
      issueDate: '',
      scanPages: [],
      scanRegistration: []
    })
  }

  const handleSeriesChange = (e) => {
    let value = e.target.value.replace(/\D/g,'').slice(0,4)
    if (value.length > 2) value = value.slice(0,2) + ' ' + value.slice(2)
    updatePassport('series', value)
  }

  const handleNumberChange = (e) => {
    let value = e.target.value
    if (isRussian) value = value.replace(/\D/g,'').slice(0,6)
    updatePassport('number', value)
  }

  const handleBack = () => navigate('/full_registration_step3')
  const handleForward = () => {
    console.log(passportData)
    setStepNumber(stepNumber +1 )
    navigate('/full_registration_step5')
  }

  return (
    <div>
      <Header hideElements={true}/>
      <div className='reg-container'>
        <div className='registr-container' style={{ height: 'auto', paddingBottom: '150px', position: 'relative' }}>

          <div className='title'>
            <button className='btn-back' onClick={handleBack}>
              <img src={arrow} alt='Назад'/>
            </button>
            <h2 className="login-title">Полная регистрация</h2>
          </div>

          <div className='registr-scale'>
            <p>4/7</p>
            <img src={scale} alt='Registration scale'/>
          </div>

          <div className='passport-details'>
            <h2>Паспортные данные:</h2>

            <h3>Гражданство</h3>
            <div className='country-selection'>

              <div className='radio-group'>
                {citizenshipOptions.map((option,i)=>(
                  <div key={i} className="radio-option">
                    <input type="radio" id={`cit-${i}`} name="citizenship" value={option} 
                      checked={passportData.citizenship===option} 
                      onChange={()=>handleCountryChange(option)} />
                    <label htmlFor={`cit-${i}`}>{option}</label>
                  </div>
                ))}
              </div>

              {/* инпут для названия страны (Другое) */}
              {passportData.citizenship === 'Другое' && (
                <textarea 
                  ref={countryRef} 
                  placeholder='Введите название страны' 
                  value={passportData.otherCountry||''} 
                  onChange={(e)=>updatePassport('otherCountry', e.target.value)} 
                  className="country-input"
                />
              )}

              {passportData.citizenship === 'Страны СНГ' && (
                <div className='input-fields' style={{margin: '0'}}>
                  <RegistrSelector placeholder={'Выберите страну'} subject={CIScountries} selected={passportData.cisCountry} onSelect={(v) => updatePassport("cisCountry", v)}/>
                </div>
              )}
            </div>

            <div className='passport-fields-grid'>

              {/* поля для РФ */}
              {isRussian ? (
                <div className='passport-row'>
                  <div className='passport-field'>
                    <h3>Серия паспорта</h3>
                    <input ref={seriesRef} value={passportData.series||''} placeholder='00 00' maxLength={5} onChange={handleSeriesChange}/>
                  </div>
                  <div className='passport-field'>
                    <h3>Номер паспорта</h3>
                    <input value={passportData.number||''} placeholder='000000' maxLength={6} onChange={handleNumberChange}/>
                  </div>
                  <div className='passport-field'>
                    <h3>Паспорт выдан</h3>
                    <input value={passportData.issuedBy||''} onChange={(e)=>updatePassport('issuedBy',e.target.value)} placeholder='ГУ МВД России по г. Москве'/>
                  </div>
                  <div className='passport-field'>
                    <h3>Дата выдачи {dateError && <span style={{color:'#ff4444', marginLeft:'10px', fontSize: '18px'}}>{dateError}</span>}</h3>
                    <DatePicker value={passportData.issueDate||''} onChange={(v)=>handleDateChange(v)} placeholder="00.00.00" error={!!dateError}/>
                  </div>
                </div>
              ) : (
                // поля не для РФ
                <div className='passport-row'>
                  <div className='passport-field full-width'>
                    <h3 style={{ marginTop: passportData.citizenship === 'Страны СНГ' ? '-25px' : '0px' }}>Номер документа</h3>
                    <input ref={numberRef} value={passportData.number||''} placeholder='Введите номер документа' maxLength={20} onChange={handleNumberChange}/>
                  </div>
                  <div className='passport-field full-width'>
                    <h3>Кем выдан</h3>
                    <input value={passportData.issuedBy||''} onChange={(e)=>updatePassport('issuedBy',e.target.value)} />
                  </div>
                  <div className='passport-field full-width'>
                    <h3>Дата выдачи {dateError && <span style={{color:'#ff4444', marginLeft:'10px', fontSize: '18px'}}>{dateError}</span>}</h3>
                    <DatePicker value={passportData.issueDate||''} onChange={(v)=>handleDateChange(v)} placeholder="00.00.00" error={!!dateError}/>
                  </div>
                </div>
              )}

              {/* добавление файлов */}
              <div className='passport-row'>
                <div className='passport-field'>
                  <h3>Скан главного разворота</h3>
                  <FileUpload key={passportData.citizenship+'main'} onFilesUpload={(files)=>handleFileUpload('scanPages', files)} maxFiles={1}/>
                  <p>Добавьте скан 2-3 страницы паспорта</p>
                </div>
                <div className='passport-field'>
                  <h3>Скан регистрации</h3>
                  <FileUpload key={passportData.citizenship+'reg'} onFilesUpload={(files)=>handleFileUpload('scanRegistration', files)} maxFiles={1}/>
                  <p style={{width: '330px'}}>Добавьте скан актуальной регистрации — 5-7 страницы</p>
                </div>
              </div>

            </div>
          </div>

          <button 
            className={`continue-button ${!isFormValid?'disabled':''}`} 
            disabled={!isFormValid} 
            onClick={handleForward} 
            style={{position:'absolute', bottom:'15px', width:'714px'}}
          >
            Продолжить
          </button>

        </div>
      </div>
      
      <Footer className='footer footer--registr'/>
    </div>
  )
}
