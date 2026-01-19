import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import '../Customer/Customer.css'
import '../Customer/PersonalAccount.css'
// import '../Registration/Registration.css'
import icon_location from '../../assets/Header/icon_location.png'
import icon_user from '../../assets/Main/icon_user.svg'
import tab_profile from '../../assets/Main/tab_profile.svg'
import tab_orders from '../../assets/Main/tab_orders.svg'
import tab_star from '../../assets/Main/tab_star.svg'
import tab_chat from '../../assets/Main/icon_connection.svg'


export default function PersonalAccount() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('profile');

    // Функция переключения вкладки
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        console.log('Переключились на вкладку:', tabId);
    };

    const tabs = [
        { id: 'profile', label: 'Мой профиль', icon: <img src={tab_profile} alt="" /> },
        { id: 'orders', label: 'Мои заказы', icon: <img src={tab_orders} alt="" /> },
        { id: 'favorites', label: 'Избранное', icon: <img src={tab_star} alt="" /> },
        { id: 'support', label: 'Поддержка', icon: <img src={tab_chat} alt="" /> },
    ];


    return (
        <>
        <Header rightContent={
                <>
                <button className='btn_user' style={{marginRight: '-10px'}}>
                    <img src={icon_user} alt='Иконка пользователя'/>
                </button>
                <p style={{fontSize: '20px', color: '#000', fontWeight: '500', paddingTop: '15px'}}>Имя пользователя</p>
                <button 
                    // onClick={() => setShowCreateForm(true)}
                    className='btn-blue'
                >
                    Создать заказ
                </button>
                </>
            }
            menuItems={[
                { label: 'О платформе', to: '/' },
                { label: 'Каталог исполнителей', to: '/' },
                { label: 'Мои заказы', to: '/customer_my_orders' },
            ]}
        />

            <div className='full-container' style={{marginBottom: '285px'}}>
                <div className='main-container'>

                    <h1 className="page-title" style={{marginTop: '140px'}}>Личный кабинет</h1>

                    {/* линия табов */}
                    <div className="profile-tabs-container">
                        <div className="profile-tabs">
                            {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={handleTabChange}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                <span className="tab-label">{tab.label}</span>
                            </button>
                            ))}
                        </div>

                        {/* Тонкая линия-подчёркивание под активным табом */}
                        <div className="tabs-underline" />
                    </div>


                </div>
            </div>
        
            <Footer />
        </>
    )
}
