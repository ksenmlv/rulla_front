import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import '../Main/Main.css';
import '../Executor/Executor.css';
import '../Customer/Customer.css';
import icon_user from '../../assets/Main/icon_user.svg';
import icon_star from '../../assets/Main/icon_star.svg';
import avatar from '../../assets/Main/mock_avatar.svg';
import icon_check from '../../assets/Main/icon_checkmark2.svg';
import icon_star_yellow from '../../assets/Main/icon_star_yellow.svg';
import award from '../../assets/Main/icon_award.svg';
import arrow_left from '../../assets/Main/arrow_left.svg';
import icon_arrow from '../../assets/Main/arrow_right_blue.svg';

export default function ExecutorProfile() {
  const navigate = useNavigate();
  const [showMoreReviews, setShowMoreReviews] = useState(false);

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

      <div className="full-container" style={{ marginBottom: '285px', minHeight: 'calc(100vh - 900px)'}}>
        <div className="main-container" >
          <button onClick={() => navigate(-1)} className="back-btnn" style={{ marginBottom: '20px' }}>
            <img src={arrow_left} alt="Назад" />
          </button>

          {/* Первая карточка (оставил как было) */}
          <div className="executor-card-full" style={{ marginTop: '140px' }}>
            {/* Левый столбец — основная информация */}
            <div className="left-column">
              <div className="photo-name">
                <img
                  src={avatar}
                  alt="Фото исполнителя"
                  className="executor-photo"
                  style={{ width: '225px', height: '225px' }}
                />

                <div className="name-block">
                  <div className="verified" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <img src={icon_check} alt="✓" style={{ width: '31px', height: '31px' }} />
                    <span style={{ fontSize: '20px' }}>Документы подтверждены</span>
                  </div>
                  <h3 className="executor-name" style={{ fontSize: '32px' }}>Имя/название компании</h3>
                  <p style={{ fontSize: '20px' }}>Был в сети 10 минут назад</p>
                  <div className="rating">
                    <span style={{ fontSize: '24px' }}>4,9</span>
                    <img src={icon_star_yellow} alt="★" style={{ width: '26px', height: '26px' }} />
                    <span style={{ fontSize: '24px' }}>39 отзывов</span>
                  </div>
                  <div className="award">
                    <img src={award} alt="Награда" style={{ width: '40px', height: '40px' }} />
                    <span style={{ fontSize: '24px' }}>Название награды</span>
                  </div>
                </div>
              </div>

              <div className="features">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', marginTop: '5px' }}>
                  <img src={icon_check} alt="✓" style={{ width: '31px', height: '31px' }} />
                  Работа по договору
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px' }}>
                  <img src={icon_check} alt="✓" style={{ width: '31px', height: '31px' }} />
                  Гарантия на работу
                </span>
              </div>
            </div>

            {/* Правый столбец с кнопками */}
            <div className="right-column" style={{ position: 'absolute', bottom: '20px', right: '40px' }}>
              <div className="actions" style={{ display: 'flex', gap: '12px' }}>
                <button style={{ width: '400px', height: '70px', backgroundColor: '#DE5A2B', border: 'none', borderRadius: '7px', fontSize: '20px', fontWeight: '600', color: '#fff' }}>
                  Предложить заказ
                </button>
                <button className="favorite-btn" style={{ height: '70px', width: '70px' }}>
                  <img src={icon_star} alt="★" style={{ width: '30px', height: '30px' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Вторая карточка — как на скриншоте */}
          <div className="executor-card-full" style={{ flexDirection: 'column' }}>
            {/* Описание исполнителя */}
            <div className='name-block_'>
                {/* Левый столбик: О себе + Гражданство */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <h4>О себе</h4>
                        <p>
                            Добрый день! Меня зовут ……… Я строитель, опыт работы 6+ лет. Специализируюсь в данной сфере 6+ лет. Специализируюсь в ремонте и отделочных работах.
                        </p>
                    </div>

                    <div>
                        <h4>Гражданство</h4>
                        <p>Российская Федерация</p>
                    </div>
                </div>

                {/* Правый столбик: Специализация + Опыт */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h4 >Специализация</h4>
                        <p>Название специализации</p>
                    </div>

                    <div>
                        <h4>Опыт работы</h4>
                        <p>6 лет</p>
                    </div>
                </div>
            </div>

            {/* Спецпредложение — во всю ширину */}
            <div className="special-offer" style={{marginTop: '-10px'}}>
              <div className="discount" style={{right: '30px'}}>-25%</div>

              <h4 style={{ fontSize: '24px'}}> Спецпредложение </h4>

              <p style={{ fontSize: '20px' }}>
                Закажите комплексный ремонт до конца месяца и получите уборку помещений после finishing с 50% скидкой
              </p>
            </div>

            {/* Реализованные проекты */}
            <div className="projects-section" style={{marginTop: '10px'}}>
              <h4 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
                Реализованные проекты (3)
              </h4>

              <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '10px' }}>
                {[1, 2, 3].map(idx => (
                  <div key={idx} className="project-item">
                    <img
                      src={avatar}
                      alt={`Проект ${idx}`}
                      className="project-photo"
                      style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '10px', marginBottom: '8px' }}
                    />
                    <p className="project-name" style={{ fontSize: '24px', margin: '10px 0' }}>
                      Название проекта
                    </p>
                    <p className="project-desc" style={{ fontSize: '20px' }}>
                      Описание проекта
                    </p>
                  </div>
                ))}
              </div>

              <button className='show-more-link' style={{margin: '0 0 0 -5px'}}>
                Показать еще <span>▼</span>
              </button>
            </div>

            {/* Отзывы  */}
            <div className="reviews-section">
              <h4 style={{ fontSize: '24px', fontWeight: '600', color: '#000', marginBottom: '15px' }}>
                Отзывы (4)
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {[1, 2].map(idx => (
                    <div key={idx} style={{
                        background: '#F4F5F5',
                        borderRadius: '10px',
                        padding: '25px'
                    }}>
                        <p style={{ fontSize: '20px', fontWeight: '500', marginBottom: '10px', color: '#000' }}> Имя пользователя </p>
                        <p style={{ fontSize: '16px', color: '#656565', fontWeight: '500', margin: 0, lineHeight: '1.3' }}>
                            Очень довольна работой! Ремонт был качественным, в оговоренные сроки, без лишних вопросов. Теперь знаю, кому доверять!
                        </p>
                        <p style={{ fontSize: '16px', color: '#656565', margin: '15px 0 0 0' }}> 2 сентября 2025 г.</p>
                    </div>
                    ))}
              </div>

              {showMoreReviews && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '20px' }}>
                  {[3, 4].map(idx => (
                    <div key={idx} style={{
                        background: '#F4F5F5',
                        borderRadius: '10px',
                        padding: '25px'
                    }}>
                      <p style={{ fontSize: '20px', fontWeight: '500', marginBottom: '10px', color: '#000' }}>
                        Имя пользователя {idx}
                      </p>
                      <p style={{ fontSize: '16px', color: '#656565', fontWeight: '500', margin: 0, lineHeight: '1.3' }}>
                        Отличный мастер! Всё сделали быстро и аккуратно.
                      </p>
                      <p style={{ fontSize: '16px', color: '#656565', margin: '15px 0 0 0' }}>
                        1 сентября 2025 г.
                      </p>
                    </div>
                  ))}
                </div>
              )}

                <button
                    onClick={() => setShowMoreReviews(true)}
                    className='show-more-link'
                    style={{marginTop: '10px'}}>
                    Показать еще <span>▼</span>
                </button>

            </div>

            {/* Услуги */}
            <div className="services-section" >
              <h4 style={{ fontSize: '24px' }}>
                Услуги
              </h4>

              <ul >
                <li style={{ fontSize: '20px' }}>
                  <span style={{fontSize: '20px'}}>Капитальный ремонт</span>
                  <span style={{ color: '#02283D', fontWeight: '600' }}>от 130 000₽</span>
                </li>
                <li style={{ fontSize: '20px' }}>
                  <span>Техническая экспертиза</span>
                  <span style={{ color: '#02283D', fontWeight: '600' }}>от 70 000₽</span>
                </li>
                <li style={{ fontSize: '20px'}}>
                  <span>Малярные работы</span>
                  <span style={{ color: '#02283D', fontWeight: '600' }}>от 50 000₽</span>
                </li>
              </ul>
            </div>

            {/* Регионы работы */}
            <div className="regions-section">
              <h4 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px', color: '#151515' }}>
                Города работы
              </h4>
              <p style={{ fontSize: '20px', color: '#656565' }}>
                Название города
              </p>
            </div>

            {/* Готовность к взаимодействию */}
            <div className="features" >
              <span style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '24px', color: '#151515', fontWeight: '600', margin: '-10px 0 5px 0' }}>
                <img src={icon_check} alt="✓" style={{ width: '31px', height: '31px' }} />
                Готов взаимодействовать со специалистами из другой команды
              </span>
            </div>

            {/* Сертификаты и лицензии */}
            <div className="certificates-section">
              <h4 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>
                Сертификаты и лицензии
              </h4>

              <div style={{ display: 'flex', gap: '15px' }}>
                <img
                  src={avatar}
                  alt="Сертификат 1"
                  style={{ width: '210px', height: '290px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <img
                  src={avatar}
                  alt="Сертификат 2"
                  style={{ width: '210px', height: '290px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer className="footer" />
    </div>
  );
}