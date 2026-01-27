import React, { useEffect, useState, useRef } from 'react';
import PhoneNumber from '../../Registration/common/PhoneNumber';
import apiClient from '../../../api/client';
import DatePicker from '../../Registration/common/Calendar/DatePicker';
import FileUpload from '../../Registration/common/FileUpload';
import RegistrSelector from '../../../components/lists/RegistrSelector';
import { countriesApi } from '../../../api/countriesApi.ts';
import RoleSwitcher from '../../Registration/common/RoleSwitcher.jsx';

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
    const { passportData, setPassportData, directorData, setDirectorData, setUserLawSubject, userLawSubject, contractWork, setContractWork } = useAppContext()
    const [activeLawSubject, setActiveLawSubject] = useState('individual_entrepreneur')      // локальное состояние для переключения

    // Уведомления 
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        telegram: false,
    })

    const citizenshipOptions = ['RU', 'KZ', 'Другое']
    const [countries, setCountries] = useState([])
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [showEditContacts, setShowEditContacts] = useState(false)
    const [showEditMainInfo, setShowEditMainInfo] = useState(false)
    const [showPassportModal, setShowPassportModal] = useState(false)
    const [showPassportEdit, setShowPassportEdit] = useState(false)
    const [showMore, setShowMore] = useState(false)

    // для редактирования паспорта
    const [isFormValid, setIsFormValid] = useState(false)
    const [dateError, setDateError] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const isRussian = passportData.citizenship === 'RU'
    const [role] = useState('executor')  
    const [hasValidationErrors, setHasValidationErrors] = useState(false)    //для глобального соо об ошибке


    const handleFileUpload = (field, files) => {
        updatePassport(field, files)
    }
                          

    // Рефы для автофокуса
    const seriesRef = useRef(null);
    const numberDocumentRef = useRef(null);
    const directorPhoneRef = useRef(null);
    const fileInputRef = useRef(null);


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



    // ----- ПАСПОРТ -----
    // Функция валидации даты 
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

    // Обертка для изменения даты выдачи
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

    // Функция обновления passportData 
    const updatePassport = (field, value) => {
        setPassportData(prev => ({ ...prev, [field]: value }));
    };


    // клик по иконке редактирования паспорта
    const handleClickEditPassport = () => {
        setShowPassportEdit(true) 
        setShowPassportModal(false) 
    }


    // при открытии модалки редактирования
    const [initialPassport, setInitialPassport] = useState(null);

    useEffect(() => {
    if (showPassportEdit) {
        setInitialPassport(JSON.stringify(passportData));
    }
    }, [showPassportEdit]);

    const isDirty = initialPassport && JSON.stringify(passportData) !== initialPassport;   //флаг изменения данных



    // Валидация формы редактирования паспорта
    useEffect(() => {
        let formValid = false;
        let errors = false;

        if (userLawSubject === 'legal_entity') {
            const fioFilled = directorData.FIO?.trim().length >= 5;
            const phoneValid = directorData.phone?.replace(/\D/g,'').length >= 10;
            formValid = fioFilled && phoneValid;
            errors = !formValid;
        } else {
            const issuedByValid = passportData.issuedBy?.trim().length >= 5;

            const fieldsFilled = isRussian
            ? passportData.series && passportData.number && issuedByValid && passportData.issueDate
            : passportData.number && issuedByValid && passportData.issueDate;

            const dateValid = isValidDate(passportData.issueDate);
            const scanValid = (passportData.scanPages?.length > 0) && (passportData.scanRegistration?.length > 0);

            const seriesValid = !isRussian || passportData.series?.replace(/\s/g,'').length === 4;
            const numberValid = isRussian
            ? passportData.number?.replace(/\D/g,'').length === 6
            : passportData.number?.trim().length > 0;

            formValid = Boolean(fieldsFilled && dateValid && scanValid && seriesValid && numberValid && issuedByValid);
            errors = !formValid && (
            passportData.issueDate ||
            passportData.series ||
            passportData.number ||
            passportData.issuedBy ||
            passportData.scanPages?.length ||
            passportData.scanRegistration?.length
            );
        }

        setIsFormValid(formValid);
        setHasValidationErrors(errors);
    }, [passportData, directorData, dateError, isRussian, userLawSubject]);



    // сохранение паспорта
    const handleSavePassport = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
        let payload = {};

        if (activeLawSubject === 'legal_entity') {
        // Юридическое лицо — только директор (как в Step3Passport)
        payload = {
            directorFullName: directorData.FIO?.trim(),
            directorPhone: directorData.phone,
        };
        await apiClient.patch('/executors/companies/me/data', payload);
        } else {
        // Физлицо / ИП / Самозанятый — паспорт + доп. поля
        const isRussian = passportData.citizenship === 'RU';

        const citizenshipIso2 =
            passportData.citizenship === 'Другое'
            ? passportData.citizenshipIso2
            : passportData.citizenship;

        const documentNumber = isRussian
            ? `${passportData.series?.replace(/\s/g, '') || ''}${passportData.number || ''}`.trim()
            : passportData.number?.trim();

        const issuedAt = passportData.issueDate
            ? `${passportData.issueDate.slice(6, 10)}-${passportData.issueDate.slice(3, 5)}-${passportData.issueDate.slice(0, 2)}`
            : null;

        payload = {
            citizenshipIso2,
            citizenshipIso3: passportData.citizenshipIso3,
            documentNumber,
            issuedAt,
            issuedBy: passportData.issuedBy?.trim(),
            lawSubject: activeLawSubject, // отправляем выбранную роль
        };

        // Дополнительные поля в зависимости от роли
        if (activeLawSubject === 'individual_entrepreneur' || activeLawSubject === 'self-employed') {
            payload = {
            ...payload,
            fio: passportData.fio?.trim(),
            inn: passportData.inn?.replace(/\D/g, ''),
            ogrnip: passportData.ogrnip?.replace(/\D/g, ''),
            regDate: passportData.regDate
                ? `${passportData.regDate.slice(6, 10)}-${passportData.regDate.slice(3, 5)}-${passportData.regDate.slice(0, 2)}`
                : null,
            regPlace: passportData.regPlace?.trim(),
            };
        } else if (activeLawSubject === 'legal_entity') {
            payload = {
            ...payload,
            organizationName: passportData.organizationName?.trim(),
            inn: passportData.inn?.replace(/\D/g, ''),
            ogrn: passportData.ogrn?.replace(/\D/g, ''),
            regDate: passportData.regDate
                ? `${passportData.regDate.slice(6, 10)}-${passportData.regDate.slice(3, 5)}-${passportData.regDate.slice(0, 2)}`
                : null,
            regPlace: passportData.regPlace?.trim(),
            };
        }

        // Валидация
        if (!citizenshipIso2) throw new Error('Не указан код страны');
        if (!documentNumber) throw new Error('Не указан номер документа');
        if (!issuedAt) throw new Error('Не указана дата выдачи');
        if (!payload.issuedBy) throw new Error('Не указано кем выдан');

        await apiClient.put('/executors/individuals/me/passport', payload);

        // Скан паспорта (если добавлен)
        if (passportData.scanPages?.length > 0 || passportData.scanRegistration?.length > 0) {
            const fd = new FormData();
            if (passportData.scanPages?.length > 0) fd.append('mainPage', passportData.scanPages[0]);
            if (passportData.scanRegistration?.length > 0) fd.append('registrationPage', passportData.scanRegistration[0]);

            await apiClient.post('/executors/individuals/me/passport/scans', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
            params: { citizenshipIso2 },
            });
        }
        }

        // успех — обновляем профиль и закрываем
        setShowPassportEdit(false);
        const res = await apiClient.get('/executors/me/profile');
        setProfile(res.data);

    } catch (err) {
        let msg = 'Ошибка сохранения данных';
        if (err.response) {
        const status = err.response.status;
        const serverMsg = err.response.data?.message || err.response.data?.error || 'Нет сообщения';
        msg = status === 400 ? `Неверные данные: ${serverMsg}` : `Ошибка ${status}: ${serverMsg}`;
        } else if (err.request) {
        msg = 'Нет ответа от сервера';
        } else {
        msg = err.message;
        }
        setErrorMessage(msg);
    } finally {
        setIsLoading(false);
    }
    };

    

    // ----- Аватар ----- 
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


  if (loading) return <div className="loading">Загрузка профиля...</div>;

  return (
    <div className="executor-profile">

      {/* Две колонки 70% / 30% */}
      <div className="profile-grid">
        {/* Левая колонка  */}
        <div className="left-column" >
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
            <div className="passport-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{justifyContent: 'center', position: 'relative'}}>
                <img 
                src={arrow_left} 
                onClick={() => setShowPassportEdit(false)} 
                style={{ cursor: 'pointer', position: 'absolute', top: 0, left: 0 }} 
                alt="Назад"
                />
                <h2>Паспортные данные</h2>
            </div>

            <div className="modal-body passport-details">

            {/* Гражданство */}
            <h3 style={{fontWeight: '500', color: '#000'}}>Гражданство</h3>
                <div className="country-selection">
                <div className="radio-group">
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

                {passportData.citizenship === 'Другое' && (
                    <div className="registr-selector-wrapper">
                    {countries.length === 0 ? (
                        <div>Загрузка стран...</div>
                    ) : (
                        <div className="passport-field" style={{ marginTop: '-10px', width: '300px' }}>
                        <RegistrSelector
                            placeholder="Выберите страну"
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

                {/* Паспорт */}
                <div className="passport-fields-grid">
                {isRussian ? (
                    <div className="passport-row">
                    <div className="passport-field">
                        <h3>Серия паспорта</h3>
                        <input
                        value={passportData.series || ''}
                        placeholder="00 00"
                        maxLength={5}
                        onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (value.length > 2) value = value.slice(0, 2) + ' ' + value.slice(2);
                            updatePassport('series', value);
                        }}
                        />
                    </div>

                    <div className="passport-field">
                        <h3>Номер паспорта</h3>
                        <input
                        value={passportData.number || ''}
                        placeholder="000000"
                        maxLength={6}
                        onChange={(e) => updatePassport('number', e.target.value.replace(/\D/g, ''))}
                        />
                    </div>

                    <div className="passport-field">
                        <h3>Паспорт выдан</h3>
                        <input
                        value={passportData.issuedBy || ''}
                        onChange={(e) => updatePassport('issuedBy', e.target.value)}
                        placeholder="ГУ МВД России по г. Москве"
                        />
                    </div>

                    <div className="passport-field">
                        <h3>Дата выдачи {dateError && (<span style={{ color:'#ff4444', marginLeft:'10px', fontSize:'14px' }}>{dateError}</span>)}</h3>
                        <DatePicker
                        value={passportData.issueDate || ''}
                        onChange={handleDateChange}
                        placeholder="ДД.ММ.ГГГГ"
                        />
                    </div>
                    </div>
                ) : (
                    <div className="passport-row">
                    <div className="passport-field full-width">
                        <h3>Номер документа</h3>
                        <input
                        value={passportData.number || ''}
                        placeholder="Введите номер документа"
                        onChange={(e) => updatePassport('number', e.target.value)}
                        />
                    </div>

                    <div className="passport-field full-width">
                        <h3>Кем выдан</h3>
                        <input
                        value={passportData.issuedBy || ''}
                        onChange={(e) => updatePassport('issuedBy', e.target.value)}
                        />
                    </div>

                    <div className="passport-field full-width">
                        <h3>Дата выдачи {dateError && (<span style={{ color:'#ff4444', marginLeft:'10px', fontSize:'14px' }}>{dateError}</span>)}</h3>
                        <DatePicker
                        value={passportData.issueDate || ''}
                        onChange={handleDateChange}
                        placeholder="ДД.ММ.ГГГГ"
                        />
                    </div>
                    </div>
                )}

                {/* Сканы */}
                <div className="passport-row">
                    <div className="passport-field">
                    <h3>Скан главного разворота</h3>
                    <FileUpload onFilesUpload={(files) => updatePassport('scanPages', files)} maxFiles={1} />
                    </div>
                    <div className="passport-field">
                    <h3>Скан регистрации</h3>
                    <FileUpload onFilesUpload={(files) => updatePassport('scanRegistration', files)} maxFiles={1} />
                    </div>
                </div>
                </div>

                {/* Переключатель ИП / Самозанятый */}
                <div className="role-switcher" style={{ margin: '50px 0 30px 0' }}>
                <button
                    className={`role-option ${activeLawSubject === 'individual_entrepreneur' ? 'active' : ''}`}
                    onClick={() => setActiveLawSubject('individual_entrepreneur')}
                >
                    ИП
                </button>
                <button
                    className={`role-option ${activeLawSubject === 'self-employed' ? 'active' : ''}`}
                    onClick={() => setActiveLawSubject('self-employed')}
                >
                    Самозанятый
                </button>
                </div>

                {/* ИП */}
                {activeLawSubject === 'individual_entrepreneur' && (
                <div className="passport-fields-grid">
                    <div className="passport-field full-width">
                    <h3>ИНН</h3>
                    <input value={passportData.inn || ''} onChange={(e) => updatePassport('inn', e.target.value.replace(/\D/g,''))} />
                    </div>

                    <div className="passport-field full-width">
                    <h3>ОГРНИП</h3>
                    <input value={passportData.ogrnip || ''} onChange={(e) => updatePassport('ogrnip', e.target.value.replace(/\D/g,''))} />
                    </div>

                    <div className="passport-field full-width">
                    <h3>Дата регистрации</h3>
                    <DatePicker value={passportData.regDate || ''} onChange={(v) => updatePassport('regDate', v)} />
                    </div>

                    <div className="passport-field full-width">
                    <h3>Место регистрации</h3>
                    <input value={passportData.regPlace || ''} onChange={(e) => updatePassport('regPlace', e.target.value)} />
                    </div>

                    <div className="passport-field full-width">
                    <h3>Выписка из ЕГРИП</h3>
                    <FileUpload onFilesUpload={(files) => updatePassport('egripFile', files)} maxFiles={1} />
                    </div>
                </div>
                )}

                {/* Самозанятый */}
                {activeLawSubject === 'self-employed' && (
                <div className="passport-fields-grid">
                    <div className="passport-field full-width">
                    <h3>ИНН</h3>
                    <input value={passportData.inn || ''} onChange={(e) => updatePassport('inn', e.target.value.replace(/\D/g,''))} />
                    </div>

                    <div className="passport-field full-width">
                    <h3>Дата постановки на учет</h3>
                    <DatePicker value={passportData.regDate || ''} onChange={(v) => updatePassport('regDate', v)} />
                    </div>

                    <div className="passport-field full-width">
                    <h3>Справка о постановке на учет</h3>
                    <FileUpload onFilesUpload={(files) => updatePassport('taxCertificateFile', files)} maxFiles={1} />
                    </div>
                </div>
                )}

                {/* {hasValidationErrors && (
                    <div style={{ color:'#ff4444', textAlign:'center', marginTop:'12px' }}>
                        Проверьте корректность введённых данных
                    </div>
                )} */}

                <button
                    className={`continue-button ${(!isDirty || isLoading) ? 'disabled' : ''}`}
                    disabled={!isDirty || isLoading}
                    onClick={handleSavePassport}
                    style={{margin: '50px 0 0 0'}}
                    >
                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                </button>

            </div>
            </div>
        </div>
        )}


    </div>
  );
}