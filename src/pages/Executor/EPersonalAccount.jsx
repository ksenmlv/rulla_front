import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import ETabProfile from './tabs/ETabProfile'
import ETabServices from './tabs/ETabServices'

import '../Customer/Customer.css'
// import '../Executor/Executor.css'
import '../Executor/EPersonalAccount.css'
import '../Customer/PersonalAccount.css'
import '../Main/Main.css'
import '../Registration/Registration.css'

import icon_user from '../../assets/Main/icon_user.svg'
import tab_profile from '../../assets/Main/tab_profile.svg'
import tab_chat from '../../assets/Main/tab_chat.svg'
import tab_orders from '../../assets/Main/tab_orders.svg'
import tab_portfolio from '../../assets/Main/tab_portfolio.svg'
import tab_services from '../../assets/Main/tab_services.svg'
import ETabPortfolio from './tabs/ETabPortfolio'


export default function EPersonalAccount() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')

  // переключение табов
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  const tabs = [
    { id: 'profile', label: 'Мой профиль', icon: <img src={tab_profile} alt="" /> },
    { id: 'services', label: 'Мои услуги', icon: <img src={tab_services} alt="" /> },
    { id: 'portfolio', label: 'Портфолио', icon: <img src={tab_portfolio} alt="" /> },
    { id: 'orders', label: 'Мои заказы', icon: <img src={tab_orders} alt="" /> },
    { id: 'support', label: 'Поддержка', icon: <img src={tab_chat} alt="" /> },
  ]
 
  useEffect(() => {
    if (activeTab === 'orders') {
      navigate('/executor_my_orders');
    }
  }, [activeTab, navigate]);



  return (
    <>
      <Header
        rightContent={
          <>
            <button className="btn_user" style={{ marginRight: '-10px' }}>
              <img src={icon_user} alt="Иконка пользователя" />
            </button>
            <p
              style={{
                fontSize: '20px',
                color: '#000',
                fontWeight: '500',
                paddingTop: '15px',
              }}
            >
              {/* {profile
                ? [profile.firstName, profile.middleName, profile.lastName]
                    .filter(Boolean)
                    .join(' ') || 'Имя пользователя'
                : 'Имя пользователя'} */} Имя пользователя
            </p>
          </>
        }
        menuItems={[
          { label: 'Все заказы', to: '/executor_all_orders' },
          { label: 'Мои заказы', to: '/executor_my_orders' },
          { label: 'Тарифы', to: '/' },
        ]}
      />

      <div className="full-container" style={{ marginBottom: '285px', minHeight: '1000px' }}>
        <div className="main-container">
          <h1 className="page-title">Личный кабинет</h1>

          {/* Табы */}
          <div className="profile-container">
            <div className="profile-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-button_ ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
              
            </div>
          </div>

          <div className="profileContainer">
            {/* Вкладка профиля */}
            { activeTab === 'profile' && (
               <ETabProfile />
            )} 

            {/* Вкладка услуг */}
            { activeTab === 'services' && (
               <ETabServices />
            )} 

            {/* Вкладка портфолио */}
            { activeTab === 'portfolio' && (
               <ETabPortfolio />
            )} 
       

       

          </div>

         



          

        </div>
      </div>

      <Footer />
    </>
  )
}