import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import RegistrSelector from '../../components/lists/RegistrSelector';
import arrow from '../../assets/Main/arrow_left.svg'
import icon_user from '../../assets/Main/icon_user.svg';
import '../../pages/Registration/Registration.css';
import '../Customer/Customer.css';
import { useAppContext } from '../../contexts/AppContext';


export default function AllSpecialistsFilter() {
  const navigate = useNavigate();

  // Состояния фильтров (как на скриншоте)
  const [executorType, setExecutorType] = useState('any'); // any, individual, organization
  const [ratingAbove4, setRatingAbove4] = useState(false);
  const [onlineNow, setOnlineNow] = useState(false);
  const [hasLicense, setHasLicense] = useState(false);
  const [minExperience, setMinExperience] = useState('');
  const [contractWork, setContractWork] = useState(false);
  const [warranty, setWarranty] = useState(false);

    const {
      setUserExperience
    } = useAppContext()

  // Преобразование выбранного опыта в код бэка
  const mapExperienceToCode = (displayValue) => {
    if (!displayValue) return null;

    const mapping = {
      'До 1 года': '<1',
      '2 года': '2',
      '3 года': '3',
      '4 года': '4',
      '5 лет': '5',
      '6 лет': '6',
      '7 лет': '7',
      '8 лет': '8',
      '9 лет': '9',
      '10-15 лет': '10',    
      '15-20 лет': '15',     
      '20+ лет': '>20',
    }

    return mapping[displayValue] || null;
  }

  const handleBack = () => {
    navigate(-1)
  };

  const handleSave = () => {
    console.log('Сохранённые фильтры:', {
      executorType,
      ratingAbove4,
      onlineNow,
      hasLicense,
      minExperience,
      contractWork,
      warranty
    });

    navigate(-1); // возвращаемся на каталог
  };

  return (
    <div>
      <Header
        rightContent={
          <>
            <button className="btn_user" style={{ marginRight: '-10px', border: 'none', background: 'none' }}>
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

      <div className="reg-container">
        <div className="registr-container" style={{ height: 'auto', paddingBottom: '17px' }}>
          <div className="title">
            <button className="btn-back" onClick={handleBack}>
              <img src={arrow} alt="Назад" />
            </button>
            <h2 className="login-title" style={{fontSize: '28px'}}>Фильтры</h2>
          </div>

          <div className="input-fields" style={{ marginBottom: '40px' }}>
            <h3 style={{fontSize: '24px'}}>Тип исполнителя</h3>

            <div className="radio-option_" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                <label className="radio-label_" >
                  <input
                    type="radio"
                    name="executorType"
                    value="any"
                    checked={executorType === 'any'}
                    onChange={() => setExecutorType('any')}
                  />
                  <span>Неважно</span>
                </label>
                <label className="radio-label_">
                  <input
                    type="radio"
                    name="executorType"
                    value="individual"
                    checked={executorType === 'individual'}
                    onChange={() => setExecutorType('individual')}
                  />
                  <span>Частное лицо</span>
                </label>
                <label className="radio-label_">
                  <input
                    type="radio"
                    name="executorType"
                    value="organization"
                    checked={executorType === 'organization'}
                    onChange={() => setExecutorType('organization')}
                  />
                  <span>Организация</span>
                </label>
            </div>

            <div className="checkbox-wrapper" onClick={() => setRatingAbove4(prev => !prev)}>
              <div className={`custom-checkbox ${ratingAbove4 ? 'checked' : ''}`} >
                {ratingAbove4 && (
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                    <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '20px', color: '#000', fontWeight: '500' }}>
                Рейтинг выше 4 ★
              </span>
            </div>

            <div className="checkbox-wrapper" onClick={() => setOnlineNow(prev => !prev)}>
              <div className={`custom-checkbox ${onlineNow ? 'checked' : ''}`}>
                {onlineNow && (
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                    <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '20px', color: '#000', fontWeight: '500' }}>
                Сейчас онлайн
              </span>
            </div>

            <div className="checkbox-wrapper" onClick={() => setHasLicense(prev => !prev)}>
              <div className={`custom-checkbox ${hasLicense ? 'checked' : ''}`}>
                {hasLicense && (
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                    <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '20px', color: '#000', fontWeight: '500' }}>
                Наличие лицензии/СРО
              </span>
            </div>
            

            <h3 style={{marginTop: '40px'}}>Опыт работы</h3>
            <RegistrSelector
              placeholder="Укажите опыт работы"
              subject={['До 1 года', '2 года', '3 года', '4 года', '5 лет', '6 лет', '7 лет', '8 лет', '9 лет', '10-15 лет', '15-20 лет', '20+ лет']}
              onSelect={setUserExperience}
            />


            <div className="checkbox-wrapper" onClick={() => setContractWork(prev => !prev)}>
              <div className={`custom-checkbox ${contractWork ? 'checked' : ''}`}>
                {contractWork && (
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                    <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '20px', color: '#000', fontWeight: '500' }}>
                Работа по договору
              </span>
            </div>

            <div className="checkbox-wrapper" onClick={() => setWarranty(prev => !prev)}>
              <div className={`custom-checkbox ${warranty ? 'checked' : ''}`}>
                {warranty && (
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                    <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '20px', color: '#000', fontWeight: '500' }}>
                Гарантия на работу
              </span>
            </div>

            <button
              type="button"
              className='continue-button'
              onClick={handleSave}
              style={{ margin: '30px 0 -10px 0' }}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>

      <Footer className="footer" />
    </div>
  );
}