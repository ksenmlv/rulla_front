import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import mockExecutors from '../../../src/mockExecutors.json';
import '../Main/Main.css';
import '../Executor/Executor.css';
import '../Customer/Customer.css';
import icon_user from '../../assets/Main/icon_user.svg';
import icon_star from '../../assets/Main/icon_star.svg';
import avatar from '../../assets/Main/mock_avatar.svg';
import icon_check from '../../assets/Main/icon_checkmark2.svg';
import icon_star_yellow from '../../assets/Main/icon_star_yellow.svg';
import award from '../../assets/Main/icon_award.svg';
import icon_filter from '../../assets/Main/icon_filter.svg'
import icon_arrow from '../../assets/Main/arrow_right_blue.svg'


export default function AllSpecialists() {
  const [executors, setExecutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    setExecutors(mockExecutors);
    setLoading(false);
  }, []);

  const toggleSpecialization = (spec) => {
    if (spec === 'Все специалисты') {
      setSelectedSpecializations([]);
    } else {
      setSelectedSpecializations(prev =>
        prev.includes(spec)
          ? prev.filter(s => s !== spec)
          : [...prev, spec]
      );
    }
  };

  const filteredExecutors = selectedSpecializations.length === 0
    ? executors
    : executors.filter(executor =>
        selectedSpecializations.includes(executor.specialization)
      );

  const specializations = [
    "Все специалисты",
    "Ремонт «под ключ»", 
    "Электрика", 
    "Сантехника", 
    "Отделка", 
    "Дизайн и проектирование", 
    "Двери, окна и балконы",
    "Плиточные работы", 
    "Строительные работы", 
    "Сборка и ремонт мебели", 
    "Изоляция и утепление", 
    "Вентиляция и кондиционирование", 
    "Кровельные работы", 
    "Демонтажные работы", 
    "Сервисное обслуживание", 
    "Ландшафт и наружные сети", 
    "Фасадные работы", 
    "Ремонт коммерческих помещений", 
    "Металлоконструкции и сварка", 
    "Высотные работы", 
    "Другое"
  ];

  return (
    <div>
      <Header
        rightContent={
          <>
            <button className="btn_user" style={{ marginRight: '-10px' }}>
              <img src={icon_user} alt="Иконка пользователя" />
            </button>
            <p style={{ fontSize: '20px', color: '#000', fontWeight: '500', paddingTop: '15px' }}>
              Имя пользователя
            </p>
            <button className='btn-blue'>Создать заказ</button>
          </>
        }
        menuItems={[
          { label: 'О платформе', to: '/about' },
          { label: 'Каталог исполнителей', to: '/customer_catalog' },
          { label: 'Мои заказы', to: '/customer_my_orders' },
        ]}
      />

      <div className="full-container" style={{ marginBottom: '285px', minHeight: 'calc(100vh - 833px)' }}>
        <div className="main-container">

          <h1 className="page-title" style={{ margin: '140px 0 8px 0' }}>
            Каталог исполнителей
          </h1>
          <p style={{ fontSize: '20px', color: '#656565', marginBottom: '40px' }}>
            Найдено 432 проверенных подрядчиков
          </p>

          <Link to={`/customer_all_specialists_filter`}>
            <button className='btn-filter'><img src={icon_filter} alt='Фильтр' /></button>
          </Link>

          <div className="catalog-layout">
          {/* Левая колонка — чекбоксы */}
          <div className="sidebar">
            {specializations.slice(0, showMore ? specializations.length : 10).map(spec => {
              const isChecked = 
                spec === 'Все специалисты'
                  ? selectedSpecializations.length === 0
                  : selectedSpecializations.includes(spec);

              return (
                <div
                  key={spec}
                  className="checkbox-wrapper"
                  onClick={() => toggleSpecialization(spec)}
                >
                  <div className={`custom-checkbox ${isChecked ? 'checked' : ''}`}>
                    {isChecked && (
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                        <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="checkbox-textt">{spec}</span>
                </div>
              );
            })}

            {specializations.length > 10 && (
              <button 
                className={`show-more-link ${showMore ? 'expanded' : ''}`}
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Скрыть' : 'Показать еще'}
                <span className="arrow">▼</span>
              </button>
            )}
          </div>




            {/* Правая часть — карточки */}
            <div className="executors-list">
              {loading ? (
                <div className="loading-message">Загрузка исполнителей...</div>
              ) : filteredExecutors.length === 0 ? (
                <div className="empty-message">Исполнители не найдены</div>
              ) : (
                filteredExecutors.map(executor => (
                  <div key={executor.id} className="executor-card-horizontal">
                    {/* Левый столбец */}
                    <div className="left-column">
                      <div className="photo-name">
                          <img src={avatar} alt={executor.name} className="executor-photo" />

                          <div className="name-block">
                              <div className="verified">
                                <img src={icon_check} alt="✓" />
                                <span>Документы подтверждены</span>
                              </div>

                              <h3 className="executor-name">{executor.name}</h3>
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

                      <div className="actions">
                        <button className="offer-btn">Предложить заказ</button>
                        <button className="favorite-btn">
                          <img src={icon_star} alt="★" />
                        </button>
                      </div>

                      <div className="features">
                        {executor.readyToContract && (
                          <span><img src={icon_check} alt="✓" style={{marginRight: '7px'}}/> Работа по договору</span>
                        )}
                        {executor.readyToGiveWarranty && (
                          <span><img src={icon_check} alt="✓" style={{marginRight: '7px'}}/> Гарантия на работу</span>
                        )}
                      </div>

                      <div className="special-offer">
                        <div className="discount">-25%</div>
                        <h4>Спецпредложение</h4>
                        <p>Закажите комплексный ремонт до конца месяца и получите уборку помещений после finishing с 50% скидкой</p>
                      </div>

                      <Link to={'/executor_profile'} className="btn-look-more">
                          Посмотреть еще 
                          <img src={icon_arrow} alt="Стрелка" style={{ margin: '-5px 0 0 15px' }} />
                      </Link>
                    </div>

                    {/* Вертикальная линия */}
                    <div className="vertical-divider"></div>

                    {/* Правый столбец */}
                    <div className="right-column">
                      <div className="projects-section">
                        <h4>Реализованные проекты ({executor.projects.length})</h4>
                        <div className="projects-grid">
                          {executor.projects.slice(0, 3).map((project, idx) => (
                            <div key={idx} className="project-item">
                              <img src={project.photo} alt={project.name} className="project-photo" />
                              <p className="project-name">{project.name}</p>
                              <p className="project-desc">{project.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="experience">
                        <h4>Опыт работы</h4>
                        <p style={{fontSize: '18px', color: '#656565'}}>{executor.experience} лет</p>
                      </div>

                      <div className="services-section">
                        <h4>Услуги</h4>
                        <ul>
                          {executor.services.map((s, idx) => (
                            <li key={idx}>
                              <span>{s.name}</span>
                              <span className="price">{s.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer className="footer" />
    </div>
  );
}