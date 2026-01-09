import '../../Registration.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RegistrSelector from '../../../../components/lists/RegistrSelector'
import FileUpload from '../../common/FileUpload'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale4.svg'


export default function Step4Experience() {
  const navigate = useNavigate()
  const { 
    stepNumber, setStepNumber,
    userExperience, setUserExperience,
    specialistsNumber, setSpecialistsNumber,
    userLicense, setUserLicense,
    userEducationalDiplom, setUserEducationalDiplom,
    userCriminalRecord, setUserCriminalRecord,
    contractWork, setContractWork,
    userLawSubject
  } = useAppContext()

  const handleBack = () => {
    navigate('/full_registration_step3')
  }

  const handleForward = () => {
    console.log(userExperience, specialistsNumber, userLicense, userEducationalDiplom, userCriminalRecord)
    setStepNumber(stepNumber + 1)
    navigate('/full_registration_step5')
  }

  const updateField = (setter, field, value) => setter(prev => ({ ...prev, [field]: value }))

  // проверка на валидность формы
  const isFormValid = 
    !!userExperience &&
    (userLawSubject === 'self-employed' ? true : !!specialistsNumber) &&
    userLicense?.status &&
    userCriminalRecord?.status &&
    (userLawSubject === 'legal_entity' || userEducationalDiplom?.status) &&
    (userLicense.status !== 'yes' || userLicense.files?.length > 0) &&
    (userEducationalDiplom?.status !== 'yes' || userEducationalDiplom.files?.length > 0) &&
    (userCriminalRecord.status !== 'yes' || (userCriminalRecord.text?.trim().length > 0))

  // рендер радиокнопок 
  const renderRadioField = (title, data, setter, filesFieldLabel) => (
    <div className='passport-field' >
      <h3 style={{marginTop: '10px'}}>{title}</h3>
      {['yes', 'no'].map(val => (
        <div className="radio-option" key={val} style={{ marginBottom: '10px' }}>
          <input 
            type="radio" 
            id={`${title}-${val}`} 
            name={title} 
            value={val}
            checked={data?.status === val}
            onChange={() => updateField(setter, 'status', val)}
            style={{ margin: '0 10px 0 0' }}
          />
          <label htmlFor={`${title}-${val}`}>{val === 'yes' ? 'Да' : 'Нет'}</label>
        </div>
      ))}

      {data?.status === 'yes' && filesFieldLabel && (
        <>
          <FileUpload onFilesUpload={(files) => updateField(setter, 'files', files)} maxFiles={4} />
          <p style={{marginBottom: '10px'}}>{filesFieldLabel}</p>
        </>
      )}

      {data?.status === 'yes' && title === 'Судимости/текущие суды' && (
        <textarea
          placeholder="Добавьте информацию о судимостях/текущих судах"
          value={data?.text || ''}
          onChange={(e) => updateField(setter, 'text', e.target.value)}
          className="country-input"
        />
      )}
    </div>
  )


  return (
    <div>
      <Header hideElements />
      <div className='reg-container'>
        <div className='registr-container' style={{ height: 'auto', paddingBottom: '17px' }}>

          <div className='title'>
            <button className='btn-back' onClick={handleBack}>
              <img src={arrow} alt='Назад' />
            </button>
            <h2 className='login-title'>Полная регистрация</h2>
          </div>

          <div className='registr-scale'>
            <p>4/6</p>
            <img src={scale} alt='Registration scale' />
          </div>

          <p style={{ fontSize: '32px', fontWeight: '600', color: '#151515', marginBottom: '30px' }}>
            Дополнительная информация:
          </p>

          <div className='input-fields' style={{ marginBottom: '40px' }}>
            <h3>Опыт работы</h3>
            <RegistrSelector 
              placeholder='Укажите опыт работы' 
              subject={['До 1 года', '2 года', '3 года', '4 года', '5 лет', '6 лет', '7 лет', '8 лет', '9 лет', '10-15 лет', '15-20 лет', '20+ лет']}
              onSelect={setUserExperience} 
            />

            {userLawSubject !== 'self-employed' && (
              <>
                <h3>Количество специалистов в компании</h3>
                <RegistrSelector 
                  placeholder='Укажите количество специалистов' 
                  subject={['1', 'до 5', 'до 10', 'до 20', 'до 30', 'более 30']}
                  onSelect={setSpecialistsNumber} 
                />
              </>
            )}

            {renderRadioField('Наличие лицензии', userLicense, setUserLicense, 'Добавьте скан лицензии')}
            {userLawSubject !== 'legal_entity' && renderRadioField('Наличие диплома о профессиональном образовании', userEducationalDiplom, setUserEducationalDiplom, 'Добавьте скан диплома')}
            {renderRadioField('Судимости/текущие суды', userCriminalRecord, setUserCriminalRecord)}

            {/* Чекбокс */}
            <div className="checkbox-wrapper" onClick={() => setContractWork(prev => !prev)} style={{ margin: '20px 0 0 0' }}>
                <div className={`custom-checkbox ${contractWork ? 'checked' : ''}`}>
                    {contractWork && <svg 
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
                <span style={{fontSize: '20px', color: '#000', fontWeight: '500'}}>
                    Готов работать по договору
                </span>
            </div>

            <button 
              type="submit" 
              className={`continue-button ${!isFormValid ? 'disabled' : ''}`} 
              onClick={handleForward}
              disabled={!isFormValid}
              style={{ margin: '30px 0 0 0' }}
            >
              Продолжить
            </button>

          </div>
        </div>
      </div>
      <Footer className='footer footer--registr' />
    </div>
  )
}
