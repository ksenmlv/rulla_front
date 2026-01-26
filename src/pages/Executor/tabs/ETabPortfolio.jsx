import React, { useState } from 'react';
import edit from '../../../assets/Main/icon_edit_order.svg';
import plus from '../../../assets/Main/plus.svg';
import close from '../../../assets/Main/icon_close_modal.svg';

import '../EPersonalAccount.css';
import '../../Registration/Registration.css';

export default function ETabPortfolio() {
  const [showEditPortfolio, setShowEditPortfolio] = useState(false);

  // Мок-данные (в реальности — из API)
  const [portfolioItems] = useState([
    { mainTitle: "Название услуги", subTitle: "Название услуги" },
    { mainTitle: "Название услуги", subTitle: "Название услуги" },
    { mainTitle: "Название услуги", subTitle: "Название услуги" },
    { mainTitle: "Название услуги", subTitle: "Название услуги" },
  ]);

  return (
    <div className="services-prices-card">
      {/* Заголовок + кнопка добавления */}
      <div className="card-header">
        <h2 className="card-title">Портфолио</h2>
        <button className="add-service-btn" title="Добавить проект">
          <img src={plus} alt="+" />
        </button>
      </div>

      {/* Список карточек портфолио */}
      <div className="services-list">
        {portfolioItems.map((item, index) => (
          <div key={index} className="service-item" style={{display: 'flex', flexDirection: 'row', width: '100%', height: '100%', alignContent: 'start'}}>
            {/* Изображение */}
            <div className="portfolio-image">
                <div style={{backgroundColor: '#656565', height: '150px', width: '245px', borderRadius: '10px'}}></div>
            </div>

            {/* Текст в две строки */}
            <div className="portfolio-text">
              <div className="service-title">{item.mainTitle}</div>
              <div className="portfolio-subtitle">{item.subTitle}</div>
            </div>

            {/* Карандаш для редактирования */}
            <button 
              className="edit-btn" 
              onClick={() => setShowEditPortfolio(true)}
              style={{marginLeft: 'auto', marginBottom: 'auto'}}
            >
              <img src={edit} alt="✎" />
            </button>
          </div>
        ))}
      </div>

      {/* Модалка редактирования (пока пустая — можно добавить позже) */}
      {showEditPortfolio && (
        <div 
          className="passport-modal-overlay" 
          onClick={() => setShowEditPortfolio(false)}
        >
          <div 
            className="passport-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Редактирование проекта</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowEditPortfolio(false)}
              >
                <img src={close} alt="Закрыть" />
              </button>
            </div>

            <div className="modal-body">
              {/* Здесь будет форма редактирования */}
              <p>Форма редактирования проекта (добавь поля позже)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}