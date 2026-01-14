import '../../Registration.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import RegistrSelector from '../../../../components/lists/RegistrSelector'
import FileUpload from '../../common/FileUpload'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale4.svg'
import apiClient from '../../../../api/client'

export default function Step4Experience() {
  const navigate = useNavigate()
  const {
    stepNumber,
    setStepNumber,
    userExperience,
    setUserExperience,
    specialistsNumber,
    setSpecialistsNumber,
    userLicense,
    setUserLicense,
    userEducationalDiplom,
    setUserEducationalDiplom,
    userCriminalRecord,
    setUserCriminalRecord,
    contractWork,
    setContractWork,
    userLawSubject,
  } = useAppContext()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleBack = () => {
    navigate('/full_registration_step3')
  }

  // Преобразование выбранного опыта в код бэка
  const mapExperienceToCode = (displayValue) => {
    if (!displayValue) return null;

    const mapping = {
      'До 1 года': '<1',
      '2 года': '2',
      '3 года': '3',
      '4 года': '4',
      '5 лет': '5',
      '6 лет': '6',
      '7 лет': '7',
      '8 лет': '8',
      '9 лет': '9',
      '10-15 лет': '10',    
      '15-20 лет': '15',     
      '20+ лет': '>20',
    }

    return mapping[displayValue] || null;
  }

  const isFormValid =
    !!userExperience &&
    (userLawSubject === 'self-employed' ? true : !!specialistsNumber) &&
    userLicense?.status &&
    userCriminalRecord?.status &&
    (userLawSubject === 'legal_entity' || userEducationalDiplom?.status) &&
    (userLicense?.status !== 'yes' || (userLicense?.files?.length ?? 0) > 0) &&
    (userEducationalDiplom?.status !== 'yes' || (userEducationalDiplom?.files?.length ?? 0) > 0) &&
    (userCriminalRecord?.status !== 'yes' || (userCriminalRecord?.text?.trim().length ?? 0) > 0)

  const handleForward = async () => {
    if (!isFormValid || isLoading) return

    setIsLoading(true)
    setErrorMessage(null)

    // Отладочная информация
    console.group('Шаг 4 — данные перед отправкой')
    console.log('Тип субъекта:', userLawSubject)
    console.log('Опыт:', userExperience, '→', mapExperienceToCode(userExperience))
    console.log('Количество специалистов:', specialistsNumber)
    console.log('Лицензия:', userLicense?.status, userLicense?.files?.length ? `(${userLicense.files.length} файл)` : '')
    console.log('Диплом:', userEducationalDiplom?.status, userEducationalDiplom?.files?.length ? `(${userEducationalDiplom.files.length} файл)` : '')
    console.log('Судимости:', userCriminalRecord?.status, userCriminalRecord?.text?.trim() || '')
    console.log('Готов работать по договору:', contractWork)
    console.groupEnd()

    try {
      const requests = [];

      // 1. Опыт работы — для всех исполнителей, если значение выбрано
      if (userExperience) {
        const experienceCode = mapExperienceToCode(userExperience);

        console.group('Отправка опыта — шаг 4');
        console.log('Выбранный текст:', userExperience);
        console.log('Отправляемый код:', mapExperienceToCode(userExperience) || 'НЕ ОПРЕДЕЛЁН!');
        console.log('Тип исполнителя:', userLawSubject);
        console.groupEnd();
        
        if (experienceCode) {
          requests.push(
            apiClient.put('/executors/me/experience', {
              experienceYearsCode: experienceCode,
            })
          );
        } else {
          console.warn('Не удалось преобразовать опыт в код:', userExperience);
        }
      }

      // 2. Количество специалистов (остаётся с условием)
      if (userLawSubject !== 'self-employed' && specialistsNumber) {
        if (userLawSubject === 'entrepreneur' || userLawSubject === 'individual') {
          requests.push(
            apiClient.put('/executors/individuals/me/entrepreneur', {
              employeesCountCode: specialistsNumber,
            })
          );
        } else if (userLawSubject === 'legal_entity') {
          requests.push(
            apiClient.patch('/executors/companies/me/data', {
              specialistsCount: specialistsNumber,
            })
          );
        }
      }

      // 3. Судимости
      if (userCriminalRecord?.status) {
        const comment = userCriminalRecord.status === 'yes'
          ? (userCriminalRecord.text?.trim() || '')
          : '';

        requests.push(
          apiClient.put('/executors/me/convictions', {
            convictionsComment: comment,
          })
        );
      }

      // 4. Готовность по договору
      requests.push(
        apiClient.patch('/executors/me/readiness', {
          readyToContract: !!contractWork,
        })
      );

      const results = await Promise.allSettled(requests)

      const failedRequests = results.filter((r) => r.status === 'rejected')

      if (failedRequests.length > 0) {
        console.group('Ошибки при сохранении шага 4')
        failedRequests.forEach((err, index) => {
          console.error(`Ошибка в запросе ${index + 1}:`, err.reason?.response?.data || err.reason)
        })
        console.groupEnd()

        throw new Error('Не удалось сохранить часть данных')
      }

      // Успех → следующий шаг
      setStepNumber(stepNumber + 1)
      navigate('/full_registration_step5')
    } catch (err) {
      console.error('Ошибка сохранения шага 4:', err)

      let message = 'Не удалось сохранить данные'

      if (err.response) {
        const { status, data } = err.response
        if (status === 400) message = data?.message || 'Некорректные данные'
        else if (status === 403) message = 'Доступ запрещён'
        else if (status === 404) message = 'Ресурс не найден'
        else message = `Ошибка сервера (${status})`
      } else if (err.request) {
        message = 'Нет ответа от сервера'
      }

      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  const renderRadioField = (title, data, setter, filesFieldLabel) => (
    <div className="passport-field">
      <h3 style={{ marginTop: '10px' }}>{title}</h3>
      {['yes', 'no'].map((val) => (
        <div className="radio-option" key={val} style={{ marginBottom: '10px' }}>
          <input
            type="radio"
            id={`${title}-${val}`}
            name={title}
            value={val}
            checked={data?.status === val}
            onChange={() => setter((prev) => ({ ...prev, status: val }))}
            style={{ margin: '0 10px 0 0' }}
          />
          <label htmlFor={`${title}-${val}`}>{val === 'yes' ? 'Да' : 'Нет'}</label>
        </div>
      ))}

      {data?.status === 'yes' && filesFieldLabel && (
        <>
          <FileUpload onFilesUpload={(files) => setter((prev) => ({ ...prev, files }))} maxFiles={4} />
          <p style={{ marginBottom: '10px' }}>{filesFieldLabel}</p>
        </>
      )}

      {data?.status === 'yes' && title === 'Судимости/текущие суды' && (
        <textarea
          placeholder="Добавьте информацию о судимостях/текущих судах"
          value={data?.text || ''}
          onChange={(e) => setter((prev) => ({ ...prev, text: e.target.value }))}
          className="country-input"
        />
      )}
    </div>
  )

  return (
    <div>
      <Header hideElements />

      <div className="reg-container">
        <div className="registr-container" style={{ height: 'auto', paddingBottom: '17px' }}>
          <div className="title">
            <button className="btn-back" onClick={handleBack}>
              <img src={arrow} alt="Назад" />
            </button>
            <h2 className="login-title">Полная регистрация</h2>
          </div>

          <div className="registr-scale">
            <p>4/6</p>
            <img src={scale} alt="Registration scale" style={{ width: '650px' }} />
          </div>

          <div className="input-fields" style={{ marginBottom: '40px' }}>
            <h3>Опыт работы</h3>
            <RegistrSelector
              placeholder="Укажите опыт работы"
              subject={['До 1 года', '2 года', '3 года', '4 года', '5 лет', '6 лет', '7 лет', '8 лет', '9 лет', '10-15 лет', '15-20 лет', '20+ лет']}
              onSelect={setUserExperience}
            />

            {userLawSubject !== 'self-employed' && (
              <>
                <h3>Количество специалистов в компании</h3>
                <RegistrSelector
                  placeholder="Укажите количество специалистов"
                  subject={['1', 'до 5', 'до 10', 'до 20', 'до 30', 'более 30']}
                  onSelect={setSpecialistsNumber}
                />
              </>
            )}

            {renderRadioField('Наличие лицензии', userLicense, setUserLicense, 'Добавьте скан лицензии')}
            {userLawSubject !== 'legal_entity' &&
              renderRadioField(
                'Наличие диплома о профессиональном образовании',
                userEducationalDiplom,
                setUserEducationalDiplom,
                'Добавьте скан диплома'
              )}
            {renderRadioField('Судимости/текущие суды', userCriminalRecord, setUserCriminalRecord)}

            <div className="checkbox-wrapper" onClick={() => setContractWork((prev) => !prev)} style={{ margin: '20px 0 0 0' }}>
              <div className={`custom-checkbox ${contractWork ? 'checked' : ''}`}>
                {contractWork && (
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                    <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '20px', color: '#000', fontWeight: '500' }}>Готов работать по договору</span>
            </div>


            <button
              type="button"
              className={`continue-button ${!isFormValid || isLoading ? 'disabled' : ''}`}
              onClick={handleForward}
              disabled={!isFormValid || isLoading}
              style={{ margin: '30px 0 0 0' }}
            >
              {isLoading ? 'Сохранение...' : 'Продолжить'}
            </button>
          </div>
        </div>
      </div>

      <Footer className="footer footer--registr" />
    </div>
  )
}