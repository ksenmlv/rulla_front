import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import mockExecutors from '../../../src/mockExecutors.json';
import '../Main/Main.css';
import '../Executor/Executor.css';
import '../Customer/Customer.css';
import icon_user from '../../assets/Main/icon_user.svg';
import star_icon from '../../assets/Main/icon_star.svg';
import icon_star from '../../assets/Main/icon_star.svg'  
import avatar from '../../assets/Main/mock_avatar.svg';
import icon_check from '../../assets/Main/icon_checkmark2.svg'  
import icon_star_yellow from '../../assets/Main/icon_star_yellow.svg'  
import award from '../../assets/Main/icon_award.svg';


export default function AllSpecialists() {
  const navigate = useNavigate();
  const [executors, setExecutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // По умолчанию "Все специалисты"

  // Используем мок-данные
  useEffect(() => {
    setExecutors(mockExecutors);
    setLoading(false);
  }, []);

  // Фильтрация по специализации
  const getFilteredExecutors = () => {
    switch (activeTab) {
      case 'all':
        return executors; // Все специалисты
      case 'design':
        return executors.filter((executor) => executor.specialization === 'Дизайн интерьеров');
      case 'plumbing':
        return executors.filter((executor) => executor.specialization === 'Сантехника');
      case 'electric':
        return executors.filter((executor) => executor.specialization === 'Электрика');
      case 'commercial':
        return executors.filter((executor) => executor.specialization === 'Ремонт коммерческих помещений');
      case 'carpentry':
        return executors.filter((executor) => executor.specialization === 'Плотничные работы');
      case 'furniture':
        return executors.filter((executor) => executor.specialization === 'Сборка и ремонт мебели');
      default:
        return executors;
    }
  };

  const filteredExecutors = getFilteredExecutors();

  // Рендер звезд рейтинга
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <img
          key={i}
          src={star_icon}
          alt="star"
          style={{ width: '16px', height: '16px', marginRight: '2px' }}
        />
      );
    }
    return stars;
  };

  return (
    <div>
      <Header
        rightContent={
          <>
            <button className="btn_user" style={{ marginRight: '-10px' }}>
              <img src={icon_user} alt="Иконка пользователя" />
            </button>
            <p style={{ fontSize: '20px', color: '#000', fontWeight: '500', paddingTop: '15px' }}>Имя пользователя</p>
            <button className='btn-blue'>Создать заказ</button>
          </>
        }
        menuItems={[
          { label: 'О платформе', to: '/about' },
          { label: 'Каталог исполнителей', to: '/customer_catalog' },
          { label: 'Мои заказы', to: '/customer_my_orders' },
        ]}
      />

      {/* Основная часть */}
      <div className="full-container" style={{ marginBottom: '285px', minHeight: 'calc(100vh - 833px)' }}>
        <div className="main-container">
          <h1 className="page-title" style={{marginTop: '140px'}}>Каталог исполнителей</h1>

          {/* Вкладки по специализациям */}
          <div className="orders-tabs">
            <button
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Все специалисты
            </button>
            <button
              className={`tab-button ${activeTab === 'design' ? 'active' : ''}`}
              onClick={() => setActiveTab('design')}
            >
              Дизайн интерьеров
            </button>
            <button
              className={`tab-button ${activeTab === 'plumbing' ? 'active' : ''}`}
              onClick={() => setActiveTab('plumbing')}
            >
              Сантехника
            </button>
            <button
              className={`tab-button ${activeTab === 'electric' ? 'active' : ''}`}
              onClick={() => setActiveTab('electric')}
            >
              Электрика
            </button>
            <button
              className={`tab-button ${activeTab === 'commercial' ? 'active' : ''}`}
              onClick={() => setActiveTab('commercial')}
            >
              Ремонт коммерческих помещений
            </button>
            <button
              className={`tab-button ${activeTab === 'carpentry' ? 'active' : ''}`}
              onClick={() => setActiveTab('carpentry')}
            >
              Плотничные работы
            </button>
            <button
              className={`tab-button ${activeTab === 'furniture' ? 'active' : ''}`}
              onClick={() => setActiveTab('furniture')}
            >
              Сборка и ремонт мебели
            </button>
          </div>

          {/* Список исполнителей */}
          {loading ? (
            <div className="loading-message">Загрузка исполнителей...</div>
          ) : filteredExecutors.length === 0 ? (
            <div className="empty-message">Исполнители не найдены</div>
          ) : (
            <div className="executors-grid">
              {filteredExecutors.map((executor) => (
                <div key={executor.id} className="executor-card">
                    <div className="executor-header">
                            <img
                                //   src={executor.photo}
                                src={avatar}
                                alt={executor.name}
                                className="executor-photo"
                            />
                            <div className="executor-info">
                                <div style={{display: 'flex', flexDirection: 'row', alignContent: 'center'}}>
                                    <img src={icon_check} alt="✓" />
                                    <p style={{fontSize: '20px', fontWeight: '500', color: '#656565', margin: '2px 0 0 10px'}}>Документы подтверждены</p>
                                </div>

                                <h3 className="executor-name">{executor.name}</h3>
                                <p style={{fontSize: '20px', fontWeight: '500', color: '#656565',}}>Был в сети 10 минут назад</p>
                                <div className="executor-rating">
                                    <p className="rating-value" style={{display: 'flex', alignItems: 'center'}}>
                                        {executor.rating} <img src={icon_star_yellow} alt='Звезда' style={{margin: '0 10px'}}/> {executor.reviewsCount} отзывов
                                    </p>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'row', alignContent: 'center'}}>
                                    <img src={award} alt='Награда' />
                                    <p style={{fontSize: '20px', fontWeight: '500', color: '#151515', margin: '2px 0 0 10px'}}>Название награды</p>
                                </div>
                            </div>
                    </div>

                    <div className="order-actions" style={{margin: '25px 0 20px 0'}}>
                        <button className="respond-btn" style={{width: '100px'}}>Предложить заказ</button>
                        <button className="favorite-btn">
                            <img src={icon_star} alt="Избранное" style={{ width: '30px' }} />
                        </button>
                    </div>

                    {/* Иконки для готовности работать по договору и гарантии */}
                    <div className="executor-features">
                        {executor.readyToContract && (
                        <div className="feature-item">
                            <img src={icon_check} alt="Готов работать по договору" className="feature-icon" />
                            <span>Работа по договору</span>
                        </div>
                        )}
                        {executor.readyToGiveWarranty && (
                        <div className="feature-item">
                            <img src={icon_check} alt="Гарантия на работу" className="feature-icon" />
                            <span>Гарантия на работу</span>
                        </div>
                        )}
                    </div>


                    <div className="executor-details">
                        <div className="executor-services">
                            <h4>Опыт работы</h4>
                            <p>{executor.experience} лет</p>
                        </div>
                        <div className="executor-services">
                            <h4 style={{marginBottom: '15px'}}>Услуги</h4>
                            <ul>
                                {executor.services.map((service, index) => (
                                    <li key={index}>{service}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="executor-special-offers">
                        <h4>Спецпредложение</h4>
                        <p>{executor.specialOffer}</p>
                    </div>

                    <div className="executor-projects">
                        <h4>Реализованные проекты ({executor.projects.length})</h4>
                        <div className="projects-grid">
                            {executor.projects.map((project, index) => (
                                <img
                                key={index}
                                src={project.photo}
                                alt={`Проект ${index + 1}`}
                                className="project-photo"
                                />
                            ))}
                        </div>
                        <Link to={`/executor_profile/${executor.id}`} className="detail-link"> Посмотреть ещё → </Link>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer className="footer" />
    </div>
  );
}
