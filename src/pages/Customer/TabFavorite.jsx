import React, { useEffect, useState } from 'react'
import mockExecutors from '../../../src/mockExecutors.json'
import '../Main/Main.css'
import '../Executor/Executor.css'
import '../Customer/Customer.css'
import icon_star from '../../assets/Main/icon_star.svg'
import avatar from '../../assets/Main/mock_avatar.svg'
import icon_check from '../../assets/Main/icon_checkmark2.svg'
import icon_star_yellow from '../../assets/Main/icon_star_yellow.svg'
import award from '../../assets/Main/icon_award.svg'
import icon_arrow from '../../assets/Main/arrow_right_blue.svg'
import { Link } from 'react-router-dom'

export default function TabFavorite() {
  const [executors, setExecutors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setExecutors(mockExecutors)
    setLoading(false)
  }, [])

  return (
    <div className="executors-list">
      {loading ? (
        <div className="loading-message">Загрузка исполнителей...</div>
      ) : executors.length === 0 ? (
        <div className="empty-message">Исполнители не найдены</div>
      ) : (
        executors.map(executor => (
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
                  <span>
                    <img src={icon_check} alt="✓" style={{ marginRight: '7px' }} />
                    Работа по договору
                  </span>
                )}
                {executor.readyToGiveWarranty && (
                  <span>
                    <img src={icon_check} alt="✓" style={{ marginRight: '7px' }} />
                    Гарантия на работу
                  </span>
                )}
              </div>

              <div className="special-offer">
                <div className="discount">-25%</div>
                <h4>Спецпредложение</h4>
                <p>
                  Закажите комплексный ремонт до конца месяца и получите уборку помещений после
                  finishing с 50% скидкой
                </p>
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
                <p style={{ fontSize: '18px', color: '#656565' }}>{executor.experience} лет</p>
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
  )
}