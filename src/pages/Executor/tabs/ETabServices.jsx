import React, { useState } from 'react';
import edit from '../../../assets/Main/icon_edit_order.svg'; 
import plus from '../../../assets/Main/plus.svg';    
import close from '../../../assets/Main/icon_close_modal.svg';             

import '../EPersonalAccount.css'
import '../../Registration/Registration.css'


export default function ETabServices() {
  const [showEditService, setShowEditService] = useState(false)
  const [priceType, setPriceType] = useState('fixed') // 'fixed' или 'range'
  const [fixedPrice, setFixedPrice] = useState('')
  const [rangeFrom, setRangeFrom] = useState('')
  const [rangeTo, setRangeTo] = useState('')

  // Проверка, можно ли сохранить
  const isSaveEnabled = 
    priceType === 'fixed' 
      ? fixedPrice.trim() !== '' 
      : (rangeFrom.trim() !== '' && rangeTo.trim() !== '' && Number(rangeTo) >= Number(rangeFrom));


  // Пример данных  мок
  const [services] = useState([
    {
      title: "Название услуги",
      price: "от 10 000 ₽",
      subservices: [
        { name: "Подкатегория услуги (более конкретная)", price: "от 10 000 ₽" },
        { name: "Подкатегория услуги (более конкретная)", price: "по договорённости" },
      ],
    },
    {
      title: "Название услуги",
      price: "от 10 000 ₽",
      subservices: [
        { name: "Подкатегория услуги (более конкретная)", price: "от 10 000 ₽" },
        { name: "Подкатегория услуги (более конкретная)", price: "по договорённости" },
      ],
    },
    {
      title: "Название услуги",
      price: "от 10 000 ₽",
      subservices: [
        { name: "Подкатегория услуги (более конкретная)", price: "по договорённости" },
      ],
    },
    {
      title: "Название услуги",
      price: "от 10 000 ₽",
      subservices: [
        { name: "Подкатегория услуги (более конкретная)", price: "от 10 000 ₽" },
        { name: "Подкатегория услуги (более конкретная)", price: "по договорённости" },
      ],
    },
  ]);

  return (
    <div className="services-prices-card">
      <div className="card-header">
        <h2 className="card-title">Услуги и цены</h2>
        <button className="add-service-btn" title="Добавить услугу">
          <img src={plus} alt="+" /> 
        </button>
      </div>

      <div className="services-list">
        {services.map((service, index) => (
          <div key={index} className="service-item">
            <div className="service-main-row">
              <div className="service-title">{service.title}</div>
              <div className="service-price">
                {service.price}
                <button className="edit-btn" onClick={()=>setShowEditService(true)}>
                  <img src={edit} alt="✎" />
                </button>
              </div>
            </div>

            {service.subservices?.length > 0 && (
              <ul className="subservices-list">
                {service.subservices.map((sub, subIndex) => (
                  <li key={subIndex} className="subservice-item">
                    <span className="subservice-name">• {sub.name}</span>
                    <span className="service-price">
                      {sub.price}
                      <button className="edit-btn" onClick={()=>setShowEditService(true)}>
                        <img src={edit} alt="✎" />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>




      {/* модалка редактирования услуги */}
      {showEditService && (
        <div 
          className="passport-modal-overlay" 
          onClick={() => setShowEditService(false)}
        >
          <div 
            className="passport-modal-content"
            onClick={e => e.stopPropagation()}
          >
            {/* Заголовок + крестик */}
            <div className="modal-header">
              <h2>Название услуги</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowEditService(false)}
              >
                <img src={close} alt="Закрыть" />
              </button>
            </div>

            {/* Тело модалки */}
            <div className="modal-body">
              {/* Круглые радиокнопки — как в Step5Services */}
              <div className="passport-field" style={{ marginTop: '20px' }}>
                {['Цена услуги', 'Ценовой диапазон'].map((label, index) => {
                  const value = index === 0 ? 'fixed' : 'range';
                  return (
                    <div 
                      className="radio-option" 
                      key={label} 
                      style={{ marginBottom: '12px', cursor: 'pointer' }}
                      onClick={() => setPriceType(value)}
                    >
                      <input
                        type="radio"
                        id={`price-${value}`}
                        name="priceType"
                        value={value}
                        checked={priceType === value}
                        onChange={() => setPriceType(value)}
                        style={{ margin: '0 12px 0 0', cursor: 'pointer' }}
                      />
                      <label 
                        htmlFor={`price-${value}`}
                        style={{ cursor: 'pointer', fontSize: '18px' }}
                      >
                        {label}
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* Один инпут для фиксированной цены */}
              {priceType === 'fixed' && (
                <div className="passport-field" style={{position: 'relative'}}>
                  <input
                    type="text"
                    placeholder="0"
                    value={fixedPrice}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFixedPrice(val);
                    }}
                    maxLength={13}
                    style={{position: 'relative'}}
                  />
                  <span className="currency">₽</span>
                </div>
              )}

              {/* Два инпута для диапазона */}
              {priceType === 'range' && (
                <div className="passport-row">
                  <div className="passport-field" style={{ flex: 1, position: 'relative'}}>
                    <input
                      type="text"
                      placeholder="От"
                      value={rangeFrom}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setRangeFrom(val);
                      }}
                      maxLength={13}
                    />
                    <span className="currency">₽</span>
                  </div>

                  <div className="passport-field" style={{ flex: 1, position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="До"
                      value={rangeTo}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setRangeTo(val);
                      }}
                      maxLength={13}
                      className="country-input"
                    />
                    <span className="currency">₽</span>
                  </div>
                </div>
              )}

              {/* Ошибка валидации */}
              {priceType === 'range' && rangeTo && rangeFrom && Number(rangeTo) < Number(rangeFrom) && (
                <div className="validation-error" style={{ color: '#ff4444', fontSize: '14px', marginTop: '8px' }}>
                  «До» должно быть больше или равно «От»
                </div>
              )}

              {/* Кнопки */}
              <div className="modal-buttons" style={{ marginTop: '32px' }}>
                <button 
                  className="btn-cancel"
                  onClick={() => setShowEditService(false)}
                >
                  Отмена
                </button>
                <button 
                  className={`btn-save ${!isSaveEnabled ? 'disabled' : ''}`}
                  disabled={!isSaveEnabled}
                  onClick={() => {
                    console.log('Сохраняем:', { priceType, fixedPrice, rangeFrom, rangeTo });
                    setShowEditService(false);
                    // Здесь логика сохранения в будущем
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}