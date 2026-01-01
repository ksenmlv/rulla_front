import React, { useEffect, useState } from 'react'
import arrow_left from '../../assets/Main/arrow_left.svg'
import RegistrSelector from '../../components/lists/RegistrSelector'
import FileUpload from '../Registration/common/FileUpload'
import DatePicker from '../../pages/Registration/common/Calendar/DatePicker'

import '../Main/Main.css'
import '../Customer/Customer.css'
import '../Executor/Executor.css'
// import '../Registration/Registration.css'
import progress_bar from '../../assets/Main/progress_bar.svg'

export default function CreateOrderForm({ onClose, onCreate, existingOrders }) {
  const [step, setStep] = useState(1)

  // шаг 1
  const [category, setCategory] = useState('')
  const [task, setTask] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // шаг 2
  const [budget, setBudget] = useState('')
  const [requirements, setRequirements] = useState([])
  const [materials, setMaterials] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [isCheckedPolicy, setIsCheckedPolicy] = useState(false)
  
  // валидация второго шага
  const [isStepTwoValid, setIsStepTwoValid] = useState(false)

  // ошибки дат
  const [startDateError, setStartDateError] = useState('')
  const [endDateError, setEndDateError] = useState('')

  const categories = [...new Set(existingOrders.map(o => o.category))]
  const tasks = existingOrders.filter(o => o.category === category).map(o => o.title)


  /* ДАТЫ */
  const isValidDate = (dateStr) => {
    if (!dateStr) return false

    const digits = dateStr.replace(/\D/g, '')
    if (digits.length !== 6) return false

    const day = parseInt(digits.slice(0, 2))
    const month = parseInt(digits.slice(2, 4))
    const year = parseInt('20' + digits.slice(4, 6))

    const date = new Date(year, month - 1, day)

    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
    )
  }

  const parseDate = (dateStr) => {
    const digits = dateStr.replace(/\D/g, '')
    const day = parseInt(digits.slice(0, 2))
    const month = parseInt(digits.slice(2, 4))
    const year = parseInt('20' + digits.slice(4, 6))
    return new Date(year, month - 1, day)
  }

  const handleDateChange = (value, type) => {
    const digits = value.replace(/\D/g, '').slice(0, 6)
    let formatted = digits

    if (digits.length > 4) {
      formatted = digits.slice(0, 2) + '.' + digits.slice(2, 4) + '.' + digits.slice(4)
    } else if (digits.length > 2) {
      formatted = digits.slice(0, 2) + '.' + digits.slice(2)
    }

    if (type === 'start') {
      setStartDate(formatted)

      if (digits.length === 6) {
        const valid = isValidDate(formatted)
        setStartDateError(valid ? '' : 'Некорректная дата')
      } else {
        setStartDateError('')
      }
    } else {
      setEndDate(formatted)

      if (digits.length === 6) {
        const valid = isValidDate(formatted)
        setEndDateError(valid ? '' : 'Некорректная дата')
      } else {
        setEndDateError('')
      }
    }
  }


  /* ПРОВЕРКА ПОРЯДКА ДАТ  */
  const isDateOrderValid = () => {
    if (
      startDate.replace(/\D/g, '').length !== 6 ||
      endDate.replace(/\D/g, '').length !== 6
    ) return true

    return parseDate(startDate) <= parseDate(endDate)
  }


  const toggleRequirement = (value) => {
    setRequirements(prev =>
      prev.includes(value)
        ? prev.filter(r => r !== value)
        : [...prev, value]
    )
  }

  // валидация 1ого шага
  const isStepOneValid =
    category &&
    task &&
    location.trim().length >= 3 &&
    startDate.replace(/\D/g, '').length === 6 &&
    endDate.replace(/\D/g, '').length === 6 &&
    !startDateError &&
    !endDateError &&
    isDateOrderValid()

  // валидация второго шага
  useEffect(() => {
    const budgetValid = parseInt(budget) > 0
    const requirementsValid = requirements.length > 0
    const materialsValid = !!materials
    const descriptionValid = description.trim().length >= 10
    const imagesValid = images.length > 0
    const policyValid = isCheckedPolicy

    setIsStepTwoValid(
      budgetValid &&
      requirementsValid &&
      materialsValid &&
      descriptionValid &&
      imagesValid &&
      policyValid
    )
  }, [budget, requirements, materials, description, images, isCheckedPolicy])

  const handleCreate = () => {
    const newOrder = {
      id: Date.now(),
      title: task,
      category,
      location,
      budget: budget ? `${budget} ₽` : 'По договорённости',
      deadline: `${startDate} — ${endDate}`,
      requirements,
      materials,
      description,
      images,
      views: 0,
      responses: 0,
      publishedAt: new Date().toLocaleDateString('ru-RU'),
      lockStatus: 'open'
    }

    console.log('Создан заказ:', newOrder) 
    onCreate(newOrder)
    alert('Заказ создан!')
    
    onClose()
  }

  return (
    <div className='page-wrapper'>
      <div className="create-order-form">
        <button onClick={onClose} className="back-btn">
          <img src={arrow_left} alt="" />
        </button>

        <h2>Найти специалиста для ремонта</h2>

        {/* шкала для 2ого шага */}
        {step === 2 && (
          <div >
            <img rel='preload' src={progress_bar} alt='Шкала' style={{margin: '-10px 0 7px 0'}}/>
            <p style={{textAlign:'center', fontSize: '20px', color: '#656565', lineHeight: '1.2', marginBottom: '0'}}>Чем точнее вы укажете детали заказа, тем лучше подрядчики смогут оценить работу и предложить наиболее выгодные условия</p>
          </div>
        )}

        
          <>
            <div className="passport-field">
              <h3>Категория</h3>
              <div className="registr-selector">
                <RegistrSelector
                  placeholder="Выберите категорию"
                  subject={categories}
                  onSelect={setCategory}
                />
              </div>
            </div>

            <div className="passport-field">
              <h3>Что нужно сделать</h3>
              <div className="registr-selector">
                <RegistrSelector
                  placeholder="Выберите подкатегорию"
                  subject={tasks}
                  onSelect={setTask}
                  disabled={!category}
                />
              </div>
            </div>

            <div className="passport-field">
              <h3>Местоположение</h3>
              <input
                placeholder="Укажите свое местоположение"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            <div className="passport-field">
              <h3>
                Сроки
                {(startDateError || endDateError || !isDateOrderValid()) && (
                  <span style={{ color: '#ff4444', marginLeft: '10px', fontSize: '16px' }}>
                    {startDateError ||
                    endDateError ||
                    'Дата окончания раньше даты начала'}
                  </span>
                )}
              </h3>

              <div className="dates-row">
                <DatePicker
                  value={startDate}
                  onChange={(v) => handleDateChange(v, 'start')}
                  placeholder="Начать"
                  error={!!startDateError || !isDateOrderValid()}
                />
                <DatePicker
                  value={endDate}
                  onChange={(v) => handleDateChange(v, 'end')}
                  placeholder="Закончить"
                  error={!!endDateError || !isDateOrderValid()}
                />
              </div>
            </div>

            {step === 1 && (
              <button
                className={`continue-button ${!isStepOneValid ? 'disabled' : ''}`}
                disabled={!isStepOneValid}
                onClick={() => setStep(2)}
                style={{ margin: '20px 0 0 0' }}
              >
                Продолжить
              </button>
            )}
          </>
      

        {step === 2 && (
          <>
            <div className="passport-field">
              <h3>Бюджет проекта</h3>
              <input
                placeholder="От"
                value={budget}
                onChange={e => setBudget(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <h3 style={{fontSize: '24px', fontWeight: '500', color: '#000', marginBottom: '-5px'}}>Требования к исполнителю</h3>
            
            <div className='checkbox-grid'>
              {['Работа по договору', 'Наличие лицензии', 'Гарантия на работу', 'Юридическое лицо']
                .map(r => (
                  <div key={r} className="checkbox-wrapper" onClick={() => toggleRequirement(r)}>
                    <div className={`custom-checkbox ${requirements.includes(r) ? 'checked' : ''}`}>
                      {requirements.includes(r) && (
                        <svg
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
                        </svg>
                      )}
                    </div>

                    <span className='checkbox-text'>{r}</span>
                  </div>
              ))}
            </div>


            <h3 style={{fontSize: '24px', fontWeight: '500', color: '#000', marginBottom: '-15px'}}>Материалы</h3>
            {['Уже куплены', 'Закуплю сам', 'От исполнителя'].map(m => (
              <label key={m} className="radio-option">
                <input type="radio" checked={materials === m} onChange={() => setMaterials(m)} />
                  {m}
              </label>
            ))}

            <div className='passport-field' style={{marginTop: '15px'}}>
              <h3>Описание</h3>
              <textarea 
                placeholder='Добавьте описание своего проекта' 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                className="description-input"
              />
            </div> 
            
            <div className='passport-field'>
              <h3 style={{marginBottom: '-5px'}}>Желаемый результат</h3>
              <p style={{width: '65%', marginBottom: '10px'}}>Добавьте 2-3 фото желаемого результата для наглядности (при необходимости)</p>
              <FileUpload maxFiles={5} onFilesUpload={setImages} />
            </div>

            <div className="checkbox-wrapper" onClick={() => setIsCheckedPolicy(prev => !prev)} style={{ margin: '20px 0 0 0' }}>
                <div className={`custom-checkbox ${isCheckedPolicy ? 'checked' : ''}`}>
                    {isCheckedPolicy && <svg 
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
                <span style={{color: '#000000B2'}}>
                    Соглашаюсь с <a className='policy-link'>политикой конфиденциальности</a> и обработкой персональных данных
                </span>
            </div>

            <button className={`continue-button ${!isStepTwoValid ? 'disabled' : ''}`} disabled={!isStepTwoValid} onClick={handleCreate} style={{marginBottom: '0'}}>
              Разместить заказ
            </button>
          </>
        )}
      </div>
    </div>
  )
}
