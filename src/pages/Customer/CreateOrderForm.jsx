import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import arrow_left from '../../assets/Main/arrow_left.svg'
import RegistrSelector from '../../components/lists/RegistrSelector'
import FileUpload from '../Registration/common/FileUpload'
import DatePicker from '../../pages/Registration/common/Calendar/DatePicker'
import apiClient from '../../api/client' 
import mockExecutors from '../../../src/mockExecutors.json'

import '../Main/Main.css'
import '../Customer/Customer.css'
import '../Executor/Executor.css'
import '../../styles/Modal.css'
import progress_bar from '../../assets/Main/progress_bar.svg'
import icon_close_modal from '../../assets/Main/icon_close_modal.svg'
import icon_arrow from '../../assets/Main/arrow_right_blue.svg'
import checkmark from '../../assets/Main/checkmark3.svg'
import icon_check from '../../assets/Main/icon_checkmark2.svg';
import icon_star_yellow from '../../assets/Main/icon_star_yellow.svg';
import award from '../../assets/Main/icon_award.svg';
import icon_star2 from '../../assets/Main/icon_star2.svg';




export default function CreateOrderForm({ onClose, onCreate }) {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  // Каталог с бэкенда
  const [catalog, setCatalog] = useState('')                        // категории 
  const [topCategories, setTopCategories] = useState('')            // подкатегории
  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [catalogError, setCatalogError] = useState(null)

  // Выбранные значения
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedService, setSelectedService] = useState('') 

  // остальные поля формы
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('')
  const [requirements, setRequirements] = useState([])
  const [materials, setMaterials] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [isCheckedPolicy, setIsCheckedPolicy] = useState(false)

  const budgetRef = useRef(null)

  // валидация
  const [isStepTwoValid, setIsStepTwoValid] = useState(false)
  const [startDateError, setStartDateError] = useState('')
  const [endDateError, setEndDateError] = useState('')

  const [showSuccessModal, setShowSuccessModal] = useState(true)

  // автофокус на первое поле
  useEffect(() => {
    setTimeout(() => {
      if (step == 2 ) {
        budgetRef.current?.focus();
      } 
    }, 100);
  }, [step]);

  // Загрузка каталога услуг 
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoadingCatalog(true)
        setCatalogError(null)

        const response = await apiClient.get('/public/services/catalog')
        const data = response.data || []

        // Только верхний уровень категорий (названия)
        const topLevel = data.map(cat => cat.name)
        setTopCategories(topLevel)

        // Полный каталог для фильтрации
        setCatalog(data)
      } catch (err) {
        console.error('Ошибка загрузки каталога:', err)
        setCatalogError('Не удалось загрузить категории и услуги. Попробуйте позже.')
      } finally {
        setLoadingCatalog(false)
      }
    }

    fetchCatalog()
  }, [])

  // Фильтрация услуг по выбранной категории 
  const filteredServices = useMemo(() => {
    if (!selectedCategory || loadingCatalog || catalogError) return []

    const selectedCat = catalog.find(cat => cat.name === selectedCategory)
    if (!selectedCat) return []

    const services = []

    const collectServices = (node) => {
      if (node.services?.length) {
        services.push(...node.services.map(s => s.name))
      }
      if (node.children?.length) {
        node.children.forEach(collectServices)
      }
    }

    collectServices(selectedCat)
    return [...new Set(services)]
  }, [selectedCategory, catalog, loadingCatalog, catalogError])

  // Вычисление сегодняшнего дня
  const today = new Date(2026, 0, 11); // 11 января 2026 — фиксируем текущую дату

  // Функция проверки, что дата не раньше сегодняшнего дня
  const isFutureDate = (dateStr) => {
    if (!dateStr || dateStr.replace(/\D/g, '').length !== 6) return false;
    
    const parsed = parseDate(dateStr);
    if (!parsed || isNaN(parsed.getTime())) return false;
    
    // Сравниваем без учёта времени (только дата)
    return parsed >= today;
  };

  // Валидация дат 
  const isValidDate = (dateStr) => {
    if (!dateStr) return false
    const digits = dateStr.replace(/\D/g, '')
    if (digits.length !== 6) return false
    const day = parseInt(digits.slice(0, 2))
    const month = parseInt(digits.slice(2, 4))
    const year = parseInt('20' + digits.slice(4, 6))
    const date = new Date(year, month - 1, day)
    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year
  }

  const parseDate = (dateStr) => {
    const digits = dateStr.replace(/\D/g, '')
    const day = parseInt(digits.slice(0, 2))
    const month = parseInt(digits.slice(2, 4))
    const year = parseInt('20' + digits.slice(4, 6))
    return new Date(year, month - 1, day)
  }

  const handleDateChange = (value, type) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = digits.slice(0, 2) + '.' + digits.slice(2, 4) + '.' + digits.slice(4);
    } else if (digits.length > 2) {
      formatted = digits.slice(0, 2) + '.' + digits.slice(2);
    }

    if (type === 'start') {
      setStartDate(formatted);
      
      if (digits.length === 6) {
        if (!isValidDate(formatted)) {
          setStartDateError('Некорректная дата');
        } else if (!isFutureDate(formatted)) {
          setStartDateError('Дата не может быть в прошлом');
        } else {
          setStartDateError('');
        }
      } else {
        setStartDateError('');
      }
    } else {
      setEndDate(formatted);
      
      if (digits.length === 6) {
        if (!isValidDate(formatted)) {
          setEndDateError('Некорректная дата');
        } else if (!isFutureDate(formatted)) {
          setEndDateError('Дата не может быть в прошлом');
        } else {
          setEndDateError('');
        }
      } else {
        setEndDateError('');
      }
    }
  }

  const isDateOrderValid = () => {
    if (startDate.replace(/\D/g, '').length !== 6 || endDate.replace(/\D/g, '').length !== 6)
      return true
    return parseDate(startDate) <= parseDate(endDate)
  }

  const toggleRequirement = (value) => {
    setRequirements(prev =>
      prev.includes(value) ? prev.filter(r => r !== value) : [...prev, value]
    )
  }

  // Валидация первого шага
  const isStepOneValid =
    selectedCategory &&
    selectedService &&  
    location.trim().length >= 3 &&
    startDate.replace(/\D/g, '').length === 6 &&
    endDate.replace(/\D/g, '').length === 6 &&
    !startDateError &&
    !endDateError &&
    isDateOrderValid() &&
  isFutureDate(startDate) &&     
  isFutureDate(endDate)

  // Валидация второго шага — бюджет НЕОБЯЗАТЕЛЬНЫЙ
  useEffect(() => {
    const budgetValid = !budget || parseInt(budget) > 0  // true если пусто или > 0
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
      title: selectedService || 'Заказ без названия',
      category: selectedCategory,
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
    setShowSuccessModal(true)
    onClose()
  }

  return (
    <div className='page-wrapper'>
      <div className="create-order-form">
        <button onClick={onClose} className="back-btn">
          <img src={arrow_left} alt="Назад" />
        </button>

        <h2>Найти специалиста для ремонта</h2>

        {step === 2 && (
          <div>
            <img rel='preload' src={progress_bar} alt='Шкала прогресса' style={{ margin: '-10px 0 7px 0' }} />
            <p style={{ textAlign: 'center', fontSize: '20px', color: '#656565', lineHeight: '1.2', marginBottom: '0' }}>
              Чем точнее вы укажете детали заказа, тем лучше подрядчики смогут оценить работу и предложить наиболее выгодные условия
            </p>
          </div>
        )}

        {step === 1 && (
          <>
            <div className="passport-field">
              <h3>Категория</h3>
              <div className="registr-selector">
                  <RegistrSelector
                    placeholder="Выберите категорию"
                    subject={topCategories}
                    onSelect={setSelectedCategory}
                    selected={selectedCategory}
                  />
              </div>
            </div>

            <div className="passport-field">
              <h3>Что нужно сделать?</h3>
              <div className="registr-selector">
                  <RegistrSelector
                    placeholder="Выберите услугу"
                    subject={filteredServices}
                    onSelect={setSelectedService}
                    selected={selectedService}
                    disabled={!selectedCategory || loadingCatalog}
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
                    {startDateError || endDateError || 'Дата окончания раньше даты начала'}
                  </span>
                )}
              </h3>

              <div className="dates-row">
                <DatePicker
                  value={startDate}
                  onChange={v => handleDateChange(v, 'start')}
                  placeholder="Начать"
                  error={!!startDateError || !isDateOrderValid()}
                />
                <DatePicker
                  value={endDate}
                  onChange={v => handleDateChange(v, 'end')}
                  placeholder="Закончить"
                  error={!!endDateError || !isDateOrderValid()}
                />
              </div>
            </div>

            <button
              className={`continue-button ${!isStepOneValid ? 'disabled' : ''}`}
              disabled={!isStepOneValid}
              onClick={() => setStep(2)}
              style={{ margin: '20px 0 0 0' }}
            >
              Продолжить
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="passport-field" style={{ position: 'relative' }}>
              <h3>Бюджет проекта</h3>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center'}}>
                <input
                  ref={budgetRef}
                  value={budget}
                  onChange={e => setBudget(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    paddingRight: '40px' 
                  }}
                />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#656565', fontSize: '20px', pointerEvents: 'none'}}>
                  ₽
                </span>
              </div>
              <p>До какой суммы готовы рассматривать предложения?</p>
            </div>

            <h3 style={{fontSize: '24px', fontWeight: '500', color: '#000', marginBottom: '-5px'}}>Требования к исполнителю</h3>
            
            <div className='checkbox-grid'>
              {['Работа по договору', 'Наличие лицензии', 'Гарантия на работу', 'Юридическое лицо']
                .map(r => (
                  <div key={r} className="checkbox-wrapper" onClick={() => toggleRequirement(r)}>
                    <div className={`custom-checkbox ${requirements.includes(r) ? 'checked' : ''}`}>
                      {requirements.includes(r) && (
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                          <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
              <p style={{width: '70%', marginBottom: '10px'}}>Добавьте до 5 фото желаемого результата для наглядности (при необходимости)</p>
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

            <button 
              className={`continue-button ${!isStepTwoValid ? 'disabled' : ''}`} 
              disabled={!isStepTwoValid} 
              onClick={handleCreate}
              style={{marginBottom: '0'}}
            >
              Разместить заказ
            </button>
          </>
        )}
      </div>




      {/* успешная модалка */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)} style={{overflowY: 'auto'}}>
          <div 
            className="response-sent-modal-window" 
            onClick={e => e.stopPropagation()}
            style={{ margin: '550px 0 100px 0'}}
          >
            {/* Крестик закрытия */}
            <button 
              className="response-sent-modal-close"
              onClick={() => setShowSuccessModal(false)}
            >
              <img src={icon_close_modal} alt="Закрыть" />
            </button>

            <div className="response-sent-modal-plane" > <img src={checkmark} alt='Галочка' /> </div>
            
            <h2 className="response-sent-modal-title" style={{margin: '30px 0 10px 0'}}>
              Ваш заказ опубликован!
            </h2>

            <p style={{
              textAlign: 'center',
              color: '#656565',
              fontSize: '20px',
              fontWeight: '500',
              margin: '0 0 20px 0',
              lineHeight: '1.4',
            }}>
              Отклики специалистов вы можете <br /> видеть в личном кабинете
            </p>

        
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0' }}>
              <button 
                className="response-sent-modal-chat-btn"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/customer_personal_account') 
                  alert('Переход в личный кабинет заказчика');
                }}
              >
                Перейти в личный кабинет
              </button>
            </div>

            {/* Блок "Вам могут подойти" */}
            <div className="response-sent-similar-title" style={{fontWeight: '600'}}>
              <span >Вам могут подойти:</span>
              <Link to={'/customer_all_specialists'} className="detail-link" style={{ marginLeft: 0 }}>
                Все специалисты
                <img src={icon_arrow} alt="Стрелка" style={{ margin: '-5px 0 0 15px' }} />
              </Link>
            </div>


            <div className="response-sent-similar-grid">
              {mockExecutors.slice(0, 2).map((executor) => (
                <div key={executor.id} className="task-card-modern" style={{ border: '1px solid #919191', padding: '25px', borderRadius: '15px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{display: 'flex', flexDirection: 'row'}}>
                      {/* Фото исполнителя / компании */}
                      <div style={{ width: '140px',height: '190px', borderRadius: '7px', marginBottom: '15px', overflow: 'hidden', background: '#e0e0e0'}}>
                        <img src={executor.photo} alt={executor.name}   style={{width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x160?text=Фото+не+загружено'; }}
                        />
                      </div>

                      {/* блок справа от фото */}
                      <div className="name-block" style={{marginLeft: '20px'}}>
                          <div className="verified">
                            <img src={icon_check} alt="✓" width={23}/>
                            <span style={{fontSize: '14px'}}>Документы подтверждены</span>
                          </div>

                          <h3 className="executor-name" style={{fontSize: '20px'}}>{executor.name}</h3>
                          <p className="last-online">Был в сети 10 минут назад</p>
                          <div className="rating">
                              <span>{executor.rating}</span>
                              <img src={icon_star_yellow} alt="★" className="star-icon" />
                              <span>{executor.reviewsCount} отзывов</span>
                          </div>
                          <div className="award">
                              <img src={award} alt="Награда" />
                              <span>Название награды</span>
                          </div>
                      </div>
          
                  </div>
                  
                  {/*кнопки действий  */}
                  <div className="actions">
                    <button className="offer-btn" style={{height: '70px'}}>Предложить заказ</button>
                    <button className="favorite-btn">
                      <img src={icon_star2} alt="★" width={30}/>
                    </button>
                  </div>

  
                  {/* Галочки требований */}
                  <div className="features" style={{flexDirection: 'column', gap: '10px', margin: '15px 0'}}>
                    {executor.readyToContract && (
                      <span><img src={icon_check} alt="✓" style={{marginRight: '7px'}}/> Работа по договору</span>
                    )}
                    {executor.readyToGiveWarranty && (
                      <span><img src={icon_check} alt="✓" style={{marginRight: '7px'}}/> Гарантия на работу</span>
                    )}
                  </div>

                  {/* Спецпредложение */}
                  <div className="special-offer" style={{marginBottom: '30px'}}>
                    <div className="discount">-25%</div>
                    <h4>Спецпредложение</h4>
                    <p>Закажите комплексный ремонт до конца месяца и получите уборку помещений после finishing с 50% скидкой</p>
                  </div>

                  
                  <Link to={'/executor_profile'} className="btn-look-more" >
                      Посмотреть еще 
                      <img src={icon_arrow} alt="Стрелка" style={{ margin: '-5px 0 0 15px' }} />
                  </Link>
                  

                </div>
              ))}
            </div>


          </div>
        </div>
      )}


    </div>
  )
}