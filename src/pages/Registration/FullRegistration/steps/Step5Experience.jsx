import '../../Registration.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RegistrSelector from '../../../../components/lists/RegistrSelector'
import FileUpload from '../../common/FileUpload'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale5.svg'

export default function Step5Experience() {
  const navigate = useNavigate()

  const { 
    stepNumber, setStepNumber,
    userExperience, setUserExperience,
    specialistsNumber, setSpecialistsNumber,
    userLicense, setUserLicense,
    userEducationalDiplom, setUserEducationalDiplom,
    userCriminalRecord, setUserCriminalRecord,
    userLawSubject
  } = useAppContext()

  console.log('userLawSubject:', userLawSubject)


  // Проверка заполненности обязательных полей
  const isFormValid =
    userExperience &&
    specialistsNumber &&
    userLicense?.status &&
    userCriminalRecord?.status &&
    // проверяем диплом только если не юридическое лицо
    (userLawSubject === 'legal_entity' || userEducationalDiplom?.status) &&
    (userLicense.status !== 'yes' || (userLicense.files && userLicense.files.length > 0)) &&
    (userEducationalDiplom?.status !== 'yes' || (userEducationalDiplom.files && userEducationalDiplom.files.length > 0)) &&
    (userCriminalRecord.status !== 'yes' || (userCriminalRecord.text && userCriminalRecord.text.trim()));



  const handleBack = () => {
    if (userLawSubject === 'legal_entity') {
      navigate('/full_registration_step3')
    } else {
      navigate('/full_registration_step4')
    }
  }

  const handleForward = () => {
    setStepNumber(stepNumber + 1)
    navigate('/full_registration_step6')
  }

  return (
    <div>
      <Header hideElements={true} />
      <div className='reg-container'>
        <div className='registr-container' style={{ height: 'auto', paddingBottom: '5px' }}>

          <div className='title'>
            <button className='btn-back' onClick={handleBack}>
              <img src={arrow} alt='Назад' />
            </button>
            <h2 className='login-title'>Полная регистрация</h2>
          </div>

          <div className='registr-scale'>
            <p>5/7</p>
            <img src={scale} alt='Registration scale' />
          </div>

          <p style={{ fontSize: '32px', fontWeight: '600', color: '#151515', marginBottom: '30px' }}>
            Дополнительная информация:
          </p>

          <div className='input-fields' style={{ marginBottom: '40px' }}>
            {/* Опыт работы */}
            <h3>Опыт работы</h3>
            <RegistrSelector 
              placeholder={'Укажите опыт работы'} 
              subject={['До 1 года', '2 года', '3 года', '4 года', '5 лет', '6 лет', '7 лет', '8 лет', '9 лет', '10-15 лет', '15-20 лет', '20+ лет']}
              onSelect={setUserExperience} 
            />

            {/* Количество специалистов (для самозанятого убираем) */}
            { userLawSubject !== 'self-employed' && (
              <>
                <h3>Количество специалистов в компании</h3>
                <RegistrSelector 
                  placeholder={'Укажите количество специалистов'} 
                  subject={['1', 'до 5', 'до 10', 'до 20', 'до 30', 'более 30']}
                  onSelect={setSpecialistsNumber} 
                />
              </>
            )}

            {/* Лицензия */}
            <div className='passport-field' >
                <h3>Наличие лицензии</h3>
                <div className="radio-option" style={{marginBottom:'10px'}}>
                  <input 
                    type="radio" 
                    id="license-yes" 
                    name="license" 
                    value="yes"
                    checked={userLicense?.status === 'yes'}
                    onChange={() => setUserLicense({ ...userLicense, status: 'yes' })}
                    style={{margin: '0 10px 0 0'}}
                  />
                  <label htmlFor="license-yes">Да</label>
                </div>
                <div className="radio-option" style={{marginBottom:'10px'}}>
                  <input 
                    type="radio" 
                    id="license-no" 
                    name="license" 
                    value="no"
                    checked={userLicense?.status === 'no'}
                    onChange={() => setUserLicense({ ...userLicense, status: 'no', files: [] })}
                    style={{margin: '0 10px 0 0'}}
                  />
                  <label htmlFor="license-no">Нет</label>
                </div>

                {/* показ  формы для файлоы, только при выборе "Да"*/}
                {userLicense?.status === 'yes' && (
                  <>
                    <FileUpload
                      disabled={userLicense.status !== 'yes'}
                      onFilesUpload={(files) => setUserLicense({ ...userLicense, files })}
                    />
                    <p>Добавьте скан лицензии</p>
                  </>
                )}
            </div>
            

            {/* Диплом */}
            { userLawSubject !== 'legal_entity' && (
              <div className='passport-field' style={{marginTop: '25px'}}>
                <h3>Наличие диплома о профессиональном образовании</h3>
                <div className="radio-option"  style={{marginBottom:'10px'}}>
                  <input 
                    type="radio" 
                    id="diplom-yes" 
                    name="diplom" 
                    value="yes"
                    checked={userEducationalDiplom?.status === 'yes'}
                    onChange={() => setUserEducationalDiplom({ ...userEducationalDiplom, status: 'yes' })}
                    style={{margin: '0 10px 0 0'}}
                  />
                  <label htmlFor="diplom-yes">Да</label>
                </div>
                <div className="radio-option" style={{marginBottom:'10px'}}>
                  <input 
                    type="radio" 
                    id="diplom-no" 
                    name="diplom" 
                    value="no"
                    checked={userEducationalDiplom?.status === 'no'}
                    onChange={() => setUserEducationalDiplom({ ...userEducationalDiplom, status: 'no', files: [] })}
                    style={{margin: '0 10px 0 0'}}
                  />
                  <label htmlFor="diplom-no">Нет</label>
                </div>          

                {/* показ  формы для файлоы, только при выборе "Да"*/}
                {userEducationalDiplom?.status === 'yes' && (
                  <>
                    <FileUpload
                      disabled={userEducationalDiplom.status !== 'yes'}
                      onFilesUpload={(files) => setUserEducationalDiplom({ ...userEducationalDiplom, files })}
                    />
                    <p>Добавьте скан диплома</p>
                  </>
                )}          
              </div>
            )}
            

            {/* Судимости */}
            <div className='passport-field' style={{marginTop: '25px'}}>
                <h3>Судимости/текущие суды</h3>
                <div className="radio-option"  style={{marginBottom:'10px'}}>
                  <input 
                    type="radio" 
                    id="criminal-yes" 
                    name="criminal" 
                    value="yes"
                    checked={userCriminalRecord?.status === 'yes'}
                    onChange={() => setUserCriminalRecord({ ...userCriminalRecord, status: 'yes' })}
                    style={{margin: '0 10px 0 0'}}
                  />
                  <label htmlFor="criminal-yes">Да</label>
                </div>
                <div className="radio-option" style={{marginBottom:'10px'}}>
                  <input 
                    type="radio" 
                    id="criminal-no" 
                    name="criminal" 
                    value="no"
                    checked={userCriminalRecord?.status === 'no'}
                    onChange={() => setUserCriminalRecord({ ...userCriminalRecord, status: 'no', text: '' })}
                    style={{margin: '0 10px 0 0'}}
                  />
                  <label htmlFor="criminal-no">Нет</label>
                </div>

                {/* показ поля, только если статус да */}
                {userCriminalRecord?.status === 'yes' && (
                  <textarea
                    placeholder="Добавьте информацию о судимостях / текущих судах"
                    disabled={userCriminalRecord?.status !== 'yes'}
                    value={userCriminalRecord?.text || ''}
                    onChange={(e) => setUserCriminalRecord({ ...userCriminalRecord, text: e.target.value })}
                    className="country-input"
                  />
                )}
            </div>

            <button 
              type="submit" 
              className={`continue-button ${!isFormValid ? 'disabled' : ''}`} 
              onClick={handleForward}
              disabled={!isFormValid}
              style={{margin:'50px 0 0 0'}}
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
