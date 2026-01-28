import '../../Registration.css'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../../contexts/AppContext'
import Header from '../../../../components/Header/Header'
import Footer from '../../../../components/Footer/Footer'
import FileUpload from '../../common/FileUpload'
import arrow from '../../../../assets/Main/arrow_left.svg'
import scale from '../../../../assets/Main/registr_scale5.svg'
import plus from '../../../../assets/Main/icon_plus.svg'
import RegistrSelector from '../../../../components/lists/RegistrSelector'
import apiClient from '../../../../api/client'

export default function Step5Services() {
  const navigate = useNavigate()
  const { 
    stepNumber, setStepNumber,
    userService, setUserService,
    otherTeamsInteraction, setOtherTeamsInteraction,
    readyToContract, 
    readyToGiveWarranty, 
    userProjects, setUserProjects,
    reviews, setReviews,
    certificates, setCertificates,
    userLawSubject
  } = useAppContext()

  const [isFormValid, setIsFormValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [showFileSizeModal, setShowFileSizeModal] = useState(false)
  const [badFileName, setBadFileName] = useState('') 
  const [units, setUnits] = useState([])                  // единицы измерения


  // Каталог услуг (для выбора в RegistrSelector)
  const [catalog, setCatalog] = useState([])
  const [loadingCatalog, setLoadingCatalog] = useState(true)

  const unitOptions = useMemo(
    () => units.map(u => u.name).filter(name => name && name.trim() !== ''),
    [units]
  )



  const groupedServices = useMemo(() => {
    const groups = [];

    const collectGroups = (node, parentTitle = '') => {
      if (!node) return;

      // Если есть услуги — добавляем группу
      if (Array.isArray(node.services) && node.services.length > 0) {
        const title = node.name?.trim() || 'Без названия';
        const fullTitle = parentTitle ? `${title}` : title;

        const items = node.services
          .map(s => s?.name?.trim())
          .filter(Boolean);

        if (items.length > 0) {
          groups.push({ title: fullTitle, items });
        }
      }

      // Рекурсия по children
      if (Array.isArray(node.children)) {
        const currentTitle = node.name?.trim() || '';
        node.children.forEach(child => collectGroups(child, currentTitle));
      }
    };

    if (Array.isArray(catalog)) {
      catalog.forEach(node => collectGroups(node));
    }

    // Добавляем группу "Другое" в конец
    groups.push({ 
      title: 'Другое', 
      items: ['Другое'] 
    });

    return groups;
  }, [catalog]);


  const allServices = useMemo(() => {
    const services = [];

    const collect = (node) => {
      if (!node) return;

      if (Array.isArray(node.services)) {
        node.services.forEach(s => {
          if (!s?.name) return;

          const defaultUnit =
            s.unitOptions?.find(u => u?.isDefault) ||
            s.unitOptions?.[0] ||
            {};

          services.push({
            id: s.id,
            name: s.name.trim(),
            priceFromRub: s.priceFromRub || 0, 
            unitName: defaultUnit.unitName || "",
            unitSymbol: defaultUnit.unitSymbol || "",
            unitId: defaultUnit.unitId || null,
            unitCode: defaultUnit.unitCode || null,
            unitOptionId: defaultUnit.unitId || null
          });
        });
      }

      if (Array.isArray(node.children)) {
        node.children.forEach(collect);
      }
    };

    catalog.forEach(collect);

    return services;
  }, [catalog]);


  // фокус на первое поле
  const firstServiceSelectorRef = useRef(null)
  useEffect(() => {
    setTimeout(() => firstServiceSelectorRef.current?.focus(), 100)
  }, [])

  // Загрузка единиц измерения
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await apiClient.get('/public/services/units')
        setUnits(res.data || [])
      } catch (e) {
        console.error('Ошибка загрузки единиц измерения', e)
      }
    }
    fetchUnits()
  }, [])


  // Загрузка каталога услуг с ценами и единицами измерения
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoadingCatalog(true)
        // Загружаем каталог с ценами и единицами измерения
        const res = await apiClient.get('/public/services/catalog?includeUnits=true&includeServices=true')
        setCatalog(res.data || [])
      } catch (err) {
        console.error('Ошибка загрузки каталога услуг:', err)
      } finally {
        setLoadingCatalog(false)
      }
    }
    fetchCatalog()
  }, [])

  // Инициализация userService, если он пустой
  useEffect(() => {
    if (!userService || userService.length === 0) {
      setUserService([
        {
          serviceId: null,
          name: '',
          customName: '',
          price: '',
          unitName: '',
          unitId: null
        }
      ])
    }
  }, [userService, setUserService])

  const addItem = (setter, defaultValue) => setter(prev => [...prev, defaultValue])
  const removeItem = (setter, index) => setter(prev => prev.filter((_, i) => i !== index))
  const updateItem = (setter, index, field, value) => 
    setter(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))

  const handleServiceSelect = (index, serviceName) => {
    // Проверяем, если выбрано "Другое"
    if (serviceName === 'Другое') {
      setUserService(prev =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                serviceId: null,
                name: 'Другое',
                customName: '',
                price: '',
                unitName: '',
                unitId: null
              }
            : item
        )
      )
      return;
    }

    const selected = allServices.find(s => s.name === serviceName)
    if (!selected) return

    setUserService(prev =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              serviceId: selected.id,
              name: selected.name,
              customName: '',
              price: '',
              unitName: selected.unitName || "",
              unitId: selected.unitId || null
            }
          : item
      )
    )
  }


  // Обработчик выбора единицы измерения
  const handleUnitSelect = (index, unitName) => {
    const unit = units.find(u => u.name === unitName)
    if (!unit) return

    setUserService(prev =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              unitId: unit.id,
              unitName: unit.name
            }
          : item
      )
    )
  }



  const handleFileUploadWithCheck = (setter, files) => {
    const tooBig = files.find(f => f.size > 10 * 1024 * 1024)
    if (tooBig) {
      setBadFileName(tooBig.name)
      setShowFileSizeModal(true)
      setter(files.filter(f => f.size <= 10 * 1024 * 1024))
      return
    }
    setter(files)
  }

  // Валидация формы
  useEffect(() => {
    const allServicesFilled = userService.every(s => {
      // Проверяем цену (должно быть число больше 0)
      const priceNum = parseFloat(s.price);
      const hasPrice = !isNaN(priceNum) && priceNum > 0;
      
      // Проверяем единицу измерения
      const hasUnit = !!s.unitId;
      
      // Проверяем название услуги
      let hasValidName = false;
      if (s.name === 'Другое') {
        hasValidName = s.customName && s.customName.trim().length >= 3;
      } else {
        hasValidName = s.name && s.name.trim().length >= 3;
      }

      return hasPrice && hasUnit && hasValidName;
    });

    const interactionValid =
      otherTeamsInteraction.status === 'yes' ||
      otherTeamsInteraction.status === 'no'

    setIsFormValid(allServicesFilled && interactionValid);

  }, [userService, otherTeamsInteraction])


  const handleBack = () => navigate('/full_registration_step4')


  const handleForward = async () => {
    if (!isFormValid || isLoading) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      // === 1. Готовности ===
      const readinessData = {}

      if (otherTeamsInteraction.status === 'yes' || otherTeamsInteraction.status === 'no') {
        readinessData.readyToCollaborate = otherTeamsInteraction.status === 'yes'
      }

      if (typeof readyToContract !== 'undefined') {
        readinessData.readyToContract = !!readyToContract
      }

      if (typeof readyToGiveWarranty !== 'undefined') {
        readinessData.readyToGiveWarranty = !!readyToGiveWarranty
      }

      if (Object.keys(readinessData).length > 0) {
        await apiClient.patch('/executors/me/readiness', readinessData)
      }

      // === 2. Услуги ===
      const servicesToSend = userService
        .filter(s => s.price && s.unitId)
        .map(s => {
          const isCustom = s.name === 'Другое'

          return {
            serviceId: isCustom ? null : s.serviceId,
            unitId: s.unitId,
            priceType: 'FROM',
            priceFromRub: Number(s.price),
            priceToRub: null,
            note: isCustom ? s.customName?.trim() : null,
            active: true
          }
        })


      if (servicesToSend.length > 0) {
        await apiClient.put('/executors/me/services', { services: servicesToSend })
      }

      // === 3. Проекты ===
      for (const p of userProjects) {
        if ((!p.files || p.files.length === 0) && (!p.text || !p.text.trim())) continue

        const fd = new FormData()
        p.files?.forEach(f => fd.append('file', f))
        if (p.text?.trim()) fd.append('projectDescription', p.text.trim())

        await apiClient.post('/executors/me/projects', fd)
      }

      // === 4. Отзывы ===
      for (const f of reviews.files || []) {
        const fd = new FormData()
        fd.append('file', f)
        await apiClient.post('/executors/me/reviews', fd)
      }

      // === 5. Сертификаты (только для физлиц) ===
      if (userLawSubject !== 'legal_entity') {
        for (const f of certificates.files || []) {
          const fd = new FormData()
          fd.append('file', f)
          await apiClient.post('/executors/me/certificates', fd)
        }
      }

      // === 6. Переход на следующий шаг ===
      setStepNumber(stepNumber + 1)
      navigate('/full_registration_step6')

    } catch (err) {
      console.error('Ошибка сохранения шага 5:', err)

      let msg = 'Не удалось сохранить данные'
      if (err.response?.status === 413) {
        msg = 'Один или несколько файлов слишком большие (макс. 10 МБ)'
      } else if (err.response) {
        msg = err.response.data?.message || `Ошибка сервера (${err.response.status})`
      }

      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div>
      <Header hideElements />
      <div className='reg-container'>
        <div className='registr-container' style={{ height: 'auto', paddingBottom: '57px' }}>

          <div className='title'>
            <button className='btn-back' onClick={handleBack}>
              <img src={arrow} alt='Назад' />
            </button>
            <h2 className='login-title'>Полная регистрация</h2>
          </div>

          <div className='registr-scale'>
            <p>5/6</p>
            <img src={scale} alt='Registration scale' style={{width: '650px'}}/>
          </div>

          <p style={{ fontSize: '30px', fontWeight: '600', color: '#151515', marginBottom: '30px' }}>
            Услуги и реализованные проекты
          </p>

          {/* Услуги */}
          {userService.map((s, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: '25px' }}>

              {userService.length > 1 && (
                <button 
                  className='file-remove' 
                  onClick={() => removeItem(setUserService, i)}
                  style={i === 0 ? { top: '42px' } : {}}
                >
                  ✕
                </button>
              )}
              
              <div className='passport-row'>
                <div className='passport-field full-width'>
                  {i === 0 && <h3>Наименование услуги и стоимость</h3>}
                  <div className="registr-selector-wrapper">
                    <RegistrSelector
                      ref={i === 0 ? firstServiceSelectorRef : null}
                      placeholder='Выберите услугу из каталога'
                      subject={groupedServices || []}
                      selected={s.name}
                      onSelect={(val) => handleServiceSelect(i, val)}
                      disabled={loadingCatalog}
                    />
                  </div>
                </div>
              </div>

              {s.name === 'Другое' && (
                <div className='passport-row'>
                  <div className='passport-field full-width'>
                    <input
                      style={{ marginTop: '10px', width: '100%' }}
                      placeholder="Введите название услуги"
                      value={s.customName}
                      onChange={(e) =>
                        updateItem(setUserService, i, 'customName', e.target.value)
                      }
                    />
                  </div>
                </div>
              )}


              <div className='passport-row' style={{ marginTop: '15px', position: 'relative', width: '100%' }}>
                <div className='passport-field'>
                  <input
                    type='number'
                    placeholder='от'
                    value={s.price || ''}
                    onChange={(e) => updateItem(setUserService, i, 'price', e.target.value)}
                    style={{ 
                      paddingRight: '50px',
                    }}
                  />
                  <span style={{
                    position: 'absolute', 
                    right: '10px', 
                    top: '50%',
                    transform: 'translateY(-50%)', 
                    color: '#656565', 
                    fontSize: '20px', 
                    pointerEvents: 'none'
                  }}>₽</span>
                </div>
                <div className='passport-field'>
                  <div className="registr-selector-wrapper">
                    <RegistrSelector
                      placeholder='за'
                      subject={unitOptions}
                      selected={s.unitName}
                      onSelect={(val) => handleUnitSelect(i, val)}
                    />
                  </div>
                </div>
              </div>

            </div>
          ))}

          <div className='btn-plus'>
            <button
              onClick={() =>
                addItem(setUserService, {
                  serviceId: null,
                  name: '',
                  price: '',
                  unitName: '',
                  unitOptionId: null
                })
              }
              style={{marginTop: '-5px'}}>
              <img src={plus} alt='Add more' />Добавить еще
            </button>
          </div>

          {/* Взаимодействие с другими командами — радиокнопки */}
          <div className='passport-field' style={{ marginTop: '40px' }}>
            <h3>Готовы взаимодействовать с другими командами/специалистами?</h3>
            {['yes','no'].map(val => (
              <div className='radio-option' key={val} style={{ marginBottom: '10px' }}>
                <input
                  type='radio' id={val} name='interaction' value={val}
                  checked={otherTeamsInteraction.status === val}
                  onChange={() => setOtherTeamsInteraction(prev => ({ ...prev, status: val }))}
                  style={{ margin: '0 10px 0 0' }}
                />
                <label htmlFor={val}>{val === 'yes' ? 'Да' : 'Нет'}</label>
              </div>
            ))}
          </div>

          {/* Реализованные проекты */}
          {userProjects.map((p, i) => (
            <div key={i} style={{ position: 'relative', marginTop: '40px' }}>
              {userProjects.length > 1 && (
                <button 
                  className='file-remove' 
                  onClick={() => removeItem(setUserProjects, i)}
                  style={i === 0 ? { top: '70px' } : {}}
                >
                  ✕
                </button>
              )}

              {i === 0 && <>
                <h3 style={{fontSize: '20px', color: '#000000', marginBottom: 0 }}>Реализованные проекты</h3>            
                <p style={{ color: '#000000B2', fontSize: '16px', margin: '0 0 10px 0'}}>Подробно опишите ваши проекты и добавьте фото/видео </p>
              </>} 

              <div style={{ display: 'flex', justifyContent: 'space-between', minHeight: '142px', height: 'auto' }}>
                <div className='file-upload-area' style={{ width: '203px' }}>
                  <FileUpload 
                    maxFiles={10} 
                    onFilesUpload={(files) => handleFileUploadWithCheck(
                      (newFiles) => updateItem(setUserProjects, i, 'files', newFiles),
                      files
                    )}
                  />
                </div>
                <textarea
                  placeholder='Опишите подробности проекта (бюджет, сроки, поставленные задачи и др.)'
                  value={p.text}
                  onChange={(e) => updateItem(setUserProjects, i, 'text', e.target.value)} 
                  className='country-input'
                  style={{ width: '491px', height: 'auto', lineHeight: '1.2', fontSize: '18px' }}
                />
              </div>
            </div>
          ))}

          <div className='btn-plus'>
            <button onClick={() => addItem(setUserProjects, { files: [], text: '' })}>
              <img src={plus} alt='Add more' />Добавить еще
            </button>
          </div>

          <p style={{ color: '#00000078', fontSize: '16px', margin: '-50px 0 10px 0', width: '500px', lineHeight: '1.1' }}>
            Вы сможете добавить дополнительные файлы в личном кабинете после регистрации
          </p>

          {/* Отзывы */}
          <div className='passport-field' style={{ marginTop: '50px' }}>
            <h3 style={{ marginBottom: 0 }}>Отзывы от заказчиков</h3>
            <p style={{ fontSize: '20px', margin: '5px 0 10px 0' }}>Добавьте фото реальных отзывов от заказчиков</p>
            <FileUpload 
              maxFiles={10} 
              onFilesUpload={(files) => handleFileUploadWithCheck(
                (newFiles) => setReviews(prev => ({ ...prev, files: newFiles })),
                files
              )}
            />
            <p style={{ color: '#00000078', fontSize: '16px', margin: '10px 0 10px 0', lineHeight: '1.1' }}>
              Вы сможете добавить дополнительные файлы в личном кабинете после регистрации
            </p> 
          </div>

          {/* Сертификаты */}
          {userLawSubject !== 'legal_entity' && (
            <div className='passport-field' style={{ marginTop: '25px' }}>
              <h3>Сертификаты о повышении квалификации</h3>
              <FileUpload 
                maxFiles={10} 
                onFilesUpload={(files) => handleFileUploadWithCheck(
                  (newFiles) => setCertificates(prev => ({ ...prev, files: newFiles })),
                  files
                )}
              />
              <p style={{ color: '#00000078', fontSize: '16px', margin: '10px 0 10px 0', lineHeight: '1.1' }}>
                Вы сможете добавить дополнительные файлы в личном кабинете после регистрации
              </p> 
            </div>
          )}

          {/* Два чекбокса — в самом низу */}
          <div className="checkbox-wrapper" 
               onClick={() => setOtherTeamsInteraction(prev => ({...prev, readyToContract: !prev.readyToContract}))}
               style={{ margin: '20px 0 -10px 0'}}>
            <div className={`custom-checkbox ${otherTeamsInteraction.readyToContract ? 'checked' : ''}`}>
              {otherTeamsInteraction.readyToContract && (
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                  <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="checkbox-text" style={{fontSize: '20px', fontWeight: '500', color: '#000' }}>
              Готов работать по договору
            </span>
          </div>

          <div className="checkbox-wrapper" onClick={() => setOtherTeamsInteraction(prev => ({...prev, readyToGiveWarranty: !prev.readyToGiveWarranty})) }>
            <div className={`custom-checkbox ${otherTeamsInteraction.readyToGiveWarranty ? 'checked' : ''}`}>
              {otherTeamsInteraction.readyToGiveWarranty && (
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                  <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="checkbox-text" style={{fontSize: '20px', fontWeight: '500', color: '#000' }}>
              Готов давать гарантию на выполненную работу
            </span>
          </div>

          {/* Модалка при слишком большом файле */}
          {showFileSizeModal && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
                <h3>Файл слишком большой</h3>
                <p>Файл «{badFileName}» превышает 10 МБ и был удалён.</p>
                <p>Максимальный размер одного файла — 10 МБ.</p>
                <button 
                  className="save-button"
                  onClick={() => setShowFileSizeModal(false)}
                  style={{ marginTop: '20px' }}
                >
                  Понятно
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div style={{
              color: '#ff4444',
              fontSize: '16px',
              textAlign: 'center',
              margin: '20px 0'
            }}>
              {errorMessage}
            </div>
          )}

          <button
            type='submit'
            className={`continue-button ${!isFormValid || isLoading ? 'disabled' : ''}`}
            onClick={handleForward}
            disabled={!isFormValid || isLoading}
            style={{ margin: '40px 0 0 0' }}
          >
            {isLoading ? 'Сохранение...' : 'Продолжить'}
          </button>

        </div>
      </div>

      <Footer />
    </div>
  )
}