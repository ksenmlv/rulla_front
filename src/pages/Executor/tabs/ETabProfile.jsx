import React, { useEffect, useState, useRef } from 'react';
import PhoneNumber from '../../Registration/common/PhoneNumber';
import apiClient from '../../../api/client';
import DatePicker from '../../Registration/common/Calendar/DatePicker';
import FileUpload from '../../Registration/common/FileUpload';
import RegistrSelector from '../../../components/lists/RegistrSelector';
import { countriesApi } from '../../../api/countriesApi.ts';

import avatar from '../../../assets/Main/avatar.svg';
import edit_avatar from '../../../assets/Main/edit_avatar.svg';
import star from '../../../assets/Main/icon_star_yellow.svg';
import close from '../../../assets/Main/icon_close.svg';
import edit from '../../../assets/Main/icon_edit_order.svg';
import award from '../../../assets/Main/award.svg';
import arrow_right from '../../../assets/Main/arrow_right2.svg';
import arrow_left from '../../../assets/Main/arrow_left.svg';

import '../../Registration/Registration.css'
import '../EPersonalAccount.css'
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';

export default function ETabProfile() {
  const navigate = useNavigate()
  const { passportData, setPassportData, directorData, setDirectorData, userLawSubject, contractWork, setContractWork } = useAppContext()

  const citizenshipOptions = ['RU', 'KZ', 'Другое']
  const [countries, setCountries] = useState([]);
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [showEditContacts, setShowEditContacts] = useState(false)
  const [showEditMainInfo, setShowEditMainInfo] = useState(false)
  const [showPassportModal, setShowPassportModal] = useState(false)
  const [showPassportEdit, setShowPassportEdit] = useState(false)
  const [showMore, setShowMore] = useState(false)

  // для редактирования паспорта
  const [isFormValid, setIsFormValid] = useState(false);
  const [dateError, setDateError] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isRussian = passportData.citizenship === 'RU';

  const fileInputRef = useRef(null);


  // Рефы для автофокуса
  const seriesRef = useRef(null);
  const numberDocumentRef = useRef(null);
  const directorPhoneRef = useRef(null);

  // Функция валидации даты (скопирована из Step3Passport)
  const isValidDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 10) return false;
    const digits = dateStr.replace(/\D/g, '');
    if (digits.length !== 8) return false;

    const day = parseInt(digits.slice(0, 2));
    const month = parseInt(digits.slice(2, 4));
    const year = parseInt(digits.slice(4, 8));

    if (year < 1900) return false;

    const issueDate = new Date(year, month - 1, day);
    const today = new Date();

    if (issueDate > today) return false;
    if (issueDate.getDate() !== day || issueDate.getMonth() !== month - 1 || issueDate.getFullYear() !== year) return false;

    let age = today.getFullYear() - year;
    const m = today.getMonth() - (month - 1);
    if (m < 0 || (m === 0 && today.getDate() < day)) age--;
    return age >= 14;
  };

  // Обёртка для изменения даты выдачи
  const handleDateChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) formatted = digits.slice(0, 2) + '.' + digits.slice(2, 4) + '.' + digits.slice(4, 8);
    else if (digits.length > 2) formatted = digits.slice(0, 2) + '.' + digits.slice(2);

    setPassportData(prev => ({ ...prev, issueDate: formatted }));

    if (formatted.length === 10) {
        const valid = isValidDate(formatted);
        setDateError(valid ? '' : 'Некорректная дата (возраст на момент выдачи ≥ 14 лет)');
    } else {
        setDateError('');
    }
    };

    // Функция обновления passportData (если её нет в контексте)
    const updatePassport = (field, value) => {
    setPassportData(prev => ({ ...prev, [field]: value }));
  };


  // Уведомления (локально)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    telegram: false,
  })

  // Загрузка данных исполнителя 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/executors/me/profile');
        setProfile(res.data);

        // предпросмотр аватара, если есть
        if (res.data.avatarUrl) setAvatarPreview(res.data.avatarUrl);
      } catch (err) {
        console.error('Ошибка загрузки профиля исполнителя:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // загрузка стран
  useEffect(() => {
    const loadCountries = async () => {
        try {
        const data = await countriesApi.getAllCountries();
        setCountries(data);
        } catch (err) {
        console.error('Ошибка загрузки стран:', err);
        }
    };
    loadCountries();
    }, []);   

  // Аватар 
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Файл слишком большой (макс. 10 МБ)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);

    // отправка на сервер
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      await apiClient.put('/executors/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки аватара на сервер');
      setAvatarPreview(null);
    }
  };

  // заглушка 
  const displayName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Исполнитель'
    : 'Исполнитель';

    const handleClickEditPassport = () => {
        setShowPassportEdit(true) 
        setShowPassportModal(false) 
    }

    // Валидация формы редактирования паспорта
    useEffect(() => {
        let formValid = false

        if (userLawSubject === 'legal_entity') {
            const fioFilled = directorData.FIO?.trim().length >= 5
            const phoneValid = directorData.phone?.replace(/\D/g,'').length >= 10
            formValid = fioFilled && phoneValid
        } else {
            const issuedByValid = passportData.issuedBy?.trim().length >= 5
            const fieldsFilled = isRussian
            ? passportData.series?.trim() && passportData.number?.trim() && issuedByValid && passportData.issueDate?.trim()
            : passportData.number?.trim() && issuedByValid && passportData.issueDate?.trim()

            const dateValid = isValidDate(passportData.issueDate)
            const scanValid = (passportData.scanPages?.length > 0) && (passportData.scanRegistration?.length > 0)
            const seriesValid = !isRussian || (passportData.series?.replace(/\s/g,'').length === 4)
            const numberValid = isRussian 
            ? passportData.number?.replace(/\D/g,'').length === 6 
            : passportData.number?.trim().length > 0

            formValid = Boolean(fieldsFilled && dateValid && scanValid && seriesValid && numberValid && issuedByValid)
        }

        setIsFormValid(formValid)
    }, [passportData, directorData, dateError, isRussian, userLawSubject])


    // сохранение паспорта
    const handleSavePassport = async () => {
        if (!isFormValid) return;

        setIsLoading(true);
        setErrorMessage(null);

        try {
            if (userLawSubject === 'legal_entity') {
            // Для юридического лица — только директор
            console.log('Отправка данных директора:', {
                directorFullName: directorData.FIO?.trim(),
                directorPhone: directorData.phone,
            });

            await apiClient.patch('/executors/companies/me/data', {
                directorFullName: directorData.FIO?.trim(),
                directorPhone: directorData.phone,
            });
            } else {
            // Физлицо / ИП / Самозанятый
            const isRussian = passportData.citizenship === 'RU';

            const citizenshipIso2 =
                passportData.citizenship === 'Другое'
                ? passportData.citizenshipIso2
                : passportData.citizenship;

            const documentNumber = isRussian
                ? `${passportData.series?.replace(/\s/g, '') || ''}${passportData.number || ''}`.trim()
                : passportData.number?.trim();

            const issuedAt = passportData.issueDate
                ? `${passportData.issueDate.slice(6, 10)}-${passportData.issueDate.slice(3, 5)}-${passportData.issueDate.slice(
                    0,
                    2
                )}`
                : null;

            const passportPayload = {
                citizenshipIso2,
                citizenshipIso3: passportData.citizenshipIso3,
                documentNumber,
                issuedAt,
                issuedBy: passportData.issuedBy?.trim(),
            };

            // Валидация перед отправкой
            if (!citizenshipIso2) throw new Error('Не указан код страны');
            if (!documentNumber) throw new Error('Не указан номер документа');
            if (!issuedAt) throw new Error('Не указана дата выдачи');
            if (!passportPayload.issuedBy) throw new Error('Не указано кем выдан');

            console.log('Отправляемые паспортные данные:', passportPayload);

            // Основные данные паспорта
            await apiClient.put('/executors/individuals/me/passport', passportPayload);

            // Отправка сканов, если они есть
            if (passportData.scanPages?.length > 0 || passportData.scanRegistration?.length > 0) {
                const fd = new FormData();
                if (passportData.scanPages?.length > 0) {
                fd.append('mainPage', passportData.scanPages[0]);
                }
                if (passportData.scanRegistration?.length > 0) {
                fd.append('registrationPage', passportData.scanRegistration[0]);
                }

                await apiClient.post('/executors/individuals/me/passport/scans', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                params: { citizenshipIso2 },
                });
            }
            }

            // Успешно → закрываем модалку
            setShowPassportEdit(false);

            // Можно обновить данные профиля
            const res = await apiClient.get('/executors/me/profile');
            setProfile(res.data);

        } catch (err) {
            let msg = 'Ошибка сохранения данных';

            if (err.response) {
            const status = err.response.status;
            const serverMsg = err.response.data?.message || err.response.data?.error || 'Нет сообщения от сервера';

            if (status === 400) msg = `Неверные данные: ${serverMsg}`;
            else if (status === 403) msg = 'Доступ запрещён (403)';
            else if (status === 404) msg = 'Ресурс не найден (404)';
            else if (status === 409) msg = 'Конфликт данных (409)';
            else msg = `Ошибка ${status}: ${serverMsg}`;
            } else if (err.request) {
            msg = 'Нет ответа от сервера. Проверьте интернет-соединение';
            } else {
            msg = `Ошибка: ${err.message}`;
            }

            setErrorMessage(msg);
            console.error('Ошибка сохранения паспортных данных:', err);
        } finally {
            setIsLoading(false);
        }
        };

  if (loading) return <div className="loading">Загрузка профиля...</div>;

  return (
    <div className="executor-profile">

      {/* Две колонки 70% / 30% */}
      <div className="profile-grid">
        {/* Левая колонка  */}
        <div className="left-column">
            <div className="header" >
                <div className="headerContent" style={{flexDirection: 'column', alignItems: 'flex-start', width: '100%'}}>
                    <div style={{display: 'flex', flexDirection: 'row', gap: '27px', width: '100%'}}>
                        <div className="avatarWrapper" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                            <img 
                                src={avatarPreview || avatar} 
                                alt="Аватар" 
                                style={{
                                    width: '111px',
                                    height: '111px',
                                    objectFit: 'cover',          
                                    borderRadius: '11px',          
                                    display: 'block'
                                }}
                            />
                            <img 
                                src={edit_avatar} 
                                alt="" 
                                className="img_edit_avatar" 
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleAvatarChange}
                            />
                        </div>

                        <div className="headerText">
                            <h1>{displayName}</h1>
                            <p>На сервисе с 2025 года</p>
                        </div>

                        <button className="editButton"  >
                            <img src={edit} alt="Изменить" style={{marginLeft: 'auto'}}/>
                        </button>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div className="field">
                            <div className="fieldLabel">Основная категория услуг</div>
                            <div className="fieldValue">{profile?.mainCategory || 'Название категории'}</div>
                        </div>

                        <div className="field" style={{marginBottom: 0}}>
                            <div className="fieldLabel">Регион и город</div>
                            <div className="fieldValue">
                                {profile?.cities?.map((c) => (
                                <span key={c} className="city-tag">
                                    {c} <span className="map-pin">📍</span>
                                </span>
                                )) || 'Не указан'}
                            </div>
                        </div>
                    </div>

                </div>
            </div>



          {/* Дополнительная информация */}
          <div className="card">
                <div className="cardHeader">
                    <h2 className="cardTitle">Дополнительная информация</h2>
                    <button className="editButton" onClick={() => setShowEditMainInfo(true)}>
                        <img src={edit} alt="edit" />
                    </button>
                </div>
                <div className="field">
                    <div className="fieldLabel">Опыт работы</div>
                    <div className="fieldValue">{profile?.experienceYears || '—'} лет</div>
                </div>
                <div className="field">
                    <div className="fieldLabel">Количество специалистов в компании</div>
                    <div className="fieldValue">{profile?.teamSize || '—'}</div>
                </div>
                <div className="field">
                    <div className="fieldLabel">Образование</div>
                    <div className="education-images">
                        <div className="img-placeholder" />
                        <div className="img-placeholder" />
                        <div className="img-placeholder" />
                        <div className="img-placeholder" />
                    </div>
                </div>

                <div className="checkbox-wrapper" onClick={() => setContractWork((prev) => !prev)} style={{ margin: '20px 0 0 0' }}>
                    <div className={`custom-checkbox ${contractWork ? 'checked' : ''}`}>
                        {contractWork && (
                            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                                <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </div>
                    <span style={{ fontSize: '24px', color: '#000', fontWeight: '500' }}>Готовы взаимодействовать с другими командами?</span>
                </div>
          </div>

          {/* Рейтинг и отзывы */}
          <div className="card">
                <h2 className="cardTitle" style={{marginBottom: '30px'}}>Мой рейтинг и отзывы специалистов</h2>

                <div className="ratingRow">
                    <span>5.0</span>
                    <img src={star} alt='' />
                    <span>12 отзывов</span>
                </div>

                <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
                    <div className="reviewCard" style={{flex: 1}}>
                        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                            <div style={{display: 'flex', alignContent: 'center', gap: '15px'}}>
                                <div className="reviewAvatar" />
                                <p className="reviewAuthor">Имя пользователя</p>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p className="reviewText">Очень доволен работой! Ремонт был сделан качественно, быстро и без скрытых переплат. Теперь знаю, кому смело могу рекомендовать друзьям. </p>
                                <div className="reviewDate">2 сентября 2025 г.</div>
                            </div>
                        </div>
                    </div>

                    <div className="reviewCard" style={{flex: 1}}>
                        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                            <div style={{display: 'flex', alignContent: 'center', gap: '15px'}}>
                                <div className="reviewAvatar" />
                                <p className="reviewAuthor">Имя пользователя</p>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p className="reviewText">Очень доволен работой! Ремонт был сделан качественно, быстро и без скрытых переплат. Теперь знаю, кому смело могу рекомендовать друзьям. </p>
                                <div className="reviewDate">2 сентября 2025 г.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <button style={{marginTop: '20px'}}
                    className={`show-more-link ${showMore ? 'expanded' : ''}`}
                    onClick={() => setShowMore(!showMore)}
                >
                    {showMore ? 'Скрыть' : 'Показать еще'}
                    <span className="arroww">▼</span>
                </button>
            </div>

        </div>

        {/* Правая колонка — 30% */}
        <div className="right-column">

          {/* Контакты */}
          <div className="card contacts-card">
                <div className="cardHeader">
                    <h2 className="cardTitle">Контакты</h2>
                    <button className="editButton" onClick={() => setShowEditContacts(true)}>
                        <img src={edit} alt="edit" />
                    </button>
                </div>
                <div className="field">
                    <div className="fieldLabel">Номер телефона</div>
                    <div className="fieldValue">{profile?.phone || '+7 ___ ___ __ __'}</div>
                </div>
                <div className="field">
                    <div className="fieldLabel">Почта</div>
                    <div className="fieldValue">{profile?.email || '—'}</div>
                </div>
                <div className="field">
                    <div className="fieldLabel">Telegram</div>
                    <div className="fieldValue">{profile?.telegram || '@—'}</div>
                </div>
                <div className="field" style={{marginBottom: 0}}>
                    <div className="fieldLabel">Сайт</div>
                    <div className="fieldValue">{profile?.website ? <a href={profile.website}>{profile.website}</a> : '—'}</div>
                </div>
          </div>

          {/* Награды платформы */}
          <div className="card">
            <h2 className="cardTitle">Награды платформы</h2>
            <div className="award-item">
                <img src={award} alt='' />
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '12px'}}>
                    <span className="award-icon"></span> Название награды
                    <p style={{fontSize: '16px', fontWeight: '400', color: '#656565'}}>Описание</p>
                </div>
            </div>
             <div className="award-item">
                <img src={award} alt='' />
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '12px'}}>
                    <span className="award-icon"></span> Название награды
                    <p style={{fontSize: '16px', fontWeight: '400', color: '#656565'}}>Описание</p>
                </div>
            </div>
          </div>

          {/* Паспортные данные */}
          <div className="card">
            <div style={{display: 'flex', flexDirection: 'row'}} onClick={e => e.stopPropagation()}>
                <h2 className="cardTitle">Паспортные данные</h2>
                <button className="view-passport-btn"><img src={arrow_right} alt='' onClick={()=>setShowPassportModal(true)} style={{height: '25px'}}/></button>
            </div>
            <p style={{fontSize: '24px', fontWeight: '500', color: '#656565', lineHeight: '1.3', margin: '40px 0 0 0'}}>Другие пользователи не видят ваши данные</p>
            
          </div>

          {/* Уведомления */}
          <div className="card">
                <h2 className="cardTitle">Настройка уведомлений</h2>
                <p className="fieldLabel" style={{ margin: '40px 0 0 0' }}> Присылать уведомления на:</p>

                <div style={{ display: 'flex', flexDirection: 'row', gap: '25px'}}>
                    {['На почту', 'По СМС', 'В Telegram'].map((label, index) => {
                        const key = ['email', 'sms', 'telegram'][index]
                        return (
                            <div
                                key={label}
                                className="checkbox-wrapper"
                                style={{ marginBottom: 0 }}
                                onClick={() =>
                                    setNotifications((prev) => ({
                                        ...prev,
                                        [key]: !prev[key],
                                    }))
                                }
                            >
                                <div
                                    className={`custom-checkbox ${
                                        notifications[key] ? 'checked' : ''
                                    }`}
                                >
                                    {notifications[key] && (
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
                                <span className="checkbox-textt" style={{ fontSize: '20px' }}>
                                    {label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

          {/* Действия */}
          <div className="card actions-card">
            <h2 className="cardTitle" style={{marginBottom: '40px'}}>Действия с профилем</h2>
            <a href="#" className="actionLink">Удалить профиль</a>
            <a href="#" className="actionLink" style={{color: '#000000'}}>Выйти</a>
          </div>

        </div>
      </div>



    {/* Модальное окно паспорт */}
    {showPassportModal && (
        <div className="passport-modal-overlay" onClick={() => setShowPassportModal(false)}>
            <div className="passport-modal-content" onClick={e => e.stopPropagation()} >
                <div className="modal-header">
                    <img src={arrow_left} onClick={() => setShowPassportModal(false)} style={{cursor: 'pointer'}}/>
                    <h2>Паспортные данные</h2>
                    <button className="modal-close-btn" onClick={handleClickEditPassport}><img src={edit} /> </button>
                </div>

                <div className="modal-body">
                    <div className="passport-field_">
                        <label>Гражданство</label>
                        <div className="value">Российская федерация</div>
                    </div>

                    <div className="passport-field_">
                        <label>Серия и номер</label>
                        <div className="value">45 12 123456</div>
                    </div>

                    <div className="passport-field_">
                        <label>ФИО</label>
                        <div className="value">Иванов Иван Иванович</div>
                    </div>

                    <div className="passport-field_" >
                        <label>ИНН</label>
                        <div className="value">00 0• •••••0 00</div>
                    </div>

                    <div className="passport-field_" >
                        <label>ОГРНИП</label>
                        <div className="value">00•••••••••••00</div>
                    </div>

                    <div className="passport-field_" style={{marginBottom: 0}}>
                        <label>Дата рождения</label>
                        <div className="value">ДД.ММ.ГГ.</div>
                    </div>

                </div>
            </div>
        </div>
    )}



    {/* модалка редактирования паспорта */}
    {showPassportEdit && (
        <div className="passport-modal-overlay" onClick={() => setShowPassportEdit(false)}>
          <div className='passport-modal-content'>
             <div className='passport-details'>
              <h2>Паспортные данные:</h2>

              <h3>Гражданство</h3>
              <div className='country-selection'>
                <div className='radio-group'>
                  {citizenshipOptions.map((option, i) => (
                    <div key={i} className="radio-option">
                      <input 
                        type="radio" 
                        id={`cit-${i}`} 
                        name="citizenship" 
                        value={option} 
                        checked={passportData.citizenship === option} 
                        onChange={() => {
                          setPassportData(prev => ({
                            ...prev,
                            citizenship: option,
                            series: '',             
                            number: '',              
                            issuedBy: '',           
                            issueDate: '',           
                            scanPages: [],           
                            scanRegistration: [],    
                            otherCountry: option === 'Другое' ? prev.otherCountry : '',
                            cisCountry: ''
                          }));
                        }}

                      />
                      <label htmlFor={`cit-${i}`}>
                        {option === 'RU' ? 'Российская Федерация' : option === 'KZ' ? 'Казахстан' : 'Другое'}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Если "Другое" — показываем RegistrSelector */}
                {passportData.citizenship === 'Другое' && (
                  <div className="registr-selector-wrapper">
                    {countries.length === 0 ? (
                      <div>Загрузка стран...</div>
                    ) : (
                      <div className='passport-field' style={{marginTop: '-10px', width: '300px'}}>
                        <RegistrSelector 
                          placeholder={'Выберите страну'}
                          subject={countries.map(c => c.name_ru)}
                          selected={[passportData.otherCountry].filter(Boolean)}
                          onSelect={(selectedNames) => {
                            const selected = countries.find(c => c.name_ru === selectedNames[0]);
                            if (selected) {
                              setPassportData(prev => ({
                                ...prev,
                                otherCountry: selected.name_ru,
                                citizenship: 'Другое',
                                citizenshipIso2: selected.iso_code2,
                                citizenshipIso3: selected.iso_code3
                              }));

                            }
                          }}
                          multiple={false}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className='passport-fields-grid'>
                {isRussian ? (
                  <div className='passport-row'>
                    <div className='passport-field'>
                      <h3>Серия паспорта</h3>
                      <input ref={seriesRef} value={passportData.series||''} placeholder='00 00' maxLength={5} onChange={(e) => {
                        let value = e.target.value.replace(/\D/g,'').slice(0,4)
                        if (value.length > 2) value = value.slice(0,2) + ' ' + value.slice(2)
                        updatePassport('series', value)
                      }}/>
                    </div>
                    <div className='passport-field'>
                      <h3>Номер паспорта</h3>
                      <input value={passportData.number||''} placeholder='000000' maxLength={6} onChange={(e) => updatePassport('number', e.target.value.replace(/\D/g, ''))}/>
                    </div>
                    <div className='passport-field'>
                      <h3>Паспорт выдан</h3>
                      <input value={passportData.issuedBy||''} onChange={(e) => updatePassport('issuedBy', e.target.value)} placeholder='ГУ МВД России по г. Москве'/>
                    </div>
                    <div className='passport-field'>
                      <h3>Дата выдачи {dateError && <span style={{color:'#ff4444', marginLeft:'10px', fontSize: '16px'}}>{dateError}</span>}</h3>
                      <DatePicker value={passportData.issueDate||''} onChange={handleDateChange} placeholder="ДД.ММ.ГГГГ" error={!!dateError}/>
                    </div>
                  </div>
                ) : (
                  <div className='passport-row'>
                    <div className='passport-field full-width'>
                      <h3>Номер документа</h3>
                      <input ref={numberDocumentRef} value={passportData.number||''} placeholder='Введите номер документа' maxLength={20} onChange={(e) => updatePassport('number', e.target.value)}/>
                    </div>
                    <div className='passport-field full-width'>
                      <h3>Кем выдан</h3>
                      <input value={passportData.issuedBy||''} onChange={(e) => updatePassport('issuedBy', e.target.value)} />
                    </div>
                    <div className='passport-field full-width'>
                      <h3>Дата выдачи {dateError && <span style={{color:'#ff4444', marginLeft:'10px', fontSize: '18px'}}>{dateError}</span>}</h3>
                      <DatePicker value={passportData.issueDate||''} onChange={handleDateChange} placeholder="ДД.ММ.ГГГГ" error={!!dateError}/>
                    </div>
                  </div>
                )}


              </div>
            </div>
          </div>
        </div>
        )}

    </div>
  );
}