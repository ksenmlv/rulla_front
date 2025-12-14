import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { ordersApi } from '../../api/ordersApi.ts'
import '../Main/Main.css'
import '../Executor/Executor.css'
import icon_user from '../../assets/Main/icon_user.svg'
import icon_active from '../../assets/Main/icon_order_active.svg'
import icon_archived from '../../assets/Main/icon_order_archived.svg'
import icon_completed from '../../assets/Main/icon_order_completed.svg'
import icon_in_progress from '../../assets/Main/icon_order_in_progress.svg'
import icon_arrow from '../../assets/Main/arrow_right_blue.svg'


export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  // Загрузка заказов из orders.json (через существующий ordersApi)
  useEffect(() => {
    ordersApi
      .getOrders()
      .then((res) => {
        setOrders(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Ошибка загрузки заказов:', err)
        setLoading(false)
      })
  }, [])

  // фильтрация по вкладкам 
  const getFilteredOrders = () => {
    switch (activeTab) {
        case 'all':
            return orders
        case 'executor_selected':           // "Вас выбрали исполнителем"
            return orders.filter(order => order.status === 'in_progress')
        case 'no_executor':                 // "Исполнитель не определён"
            return orders.filter(order => order.status === 'active')
        case 'executor_selected_other':     // "Выбран другой исполнитель"
            return orders.filter(order => order.status === 'archived')
        case 'completed':                   // "Завершенные заказы"
            return orders.filter(order => order.status === 'completed')
        default:
            return orders
    }
  }

  const filteredOrders = getFilteredOrders();

  // статус на основе реального поля status
  const getStatusInfo = (order) => {
    switch (order.status) {
        case 'completed':
        return { icon: <img src={icon_completed} alt="Завершен" className="status-svg" />,  text: <span style={{color: '#02283D'}}>Завершен</span> }
        case 'in_progress':
        return {icon: <img src={icon_in_progress} alt="В работе" className="status-svg in_progress" />, text: <span style={{color: '#3EC32C'}}>Вас выбрали исполнителем</span> }
        case 'archived':
        return { icon: <img src={icon_archived} alt="Архив" className="status-svg archived" />, text: <span style={{color: '#D03636'}}>Выбран другой исполнитель</span> }
        case 'active':
        return { icon: <img src={icon_active} alt="Активен" className="status-svg active" />, text: <span style={{color: '#EEA42E'}}>Исполнитель не определён</span> }
        default:
        return { icon: '', color: '#6b7280', text: '' }
    }
  }


  return (
    <div>
        <Header rightContent={
            < >
                <button className='btn_user' style={{marginRight: '-10px'}}><img src={icon_user} alt='Иконка пользователя'/></button>
                <p style={{fontSize: '20px', color: '#000', fontWeight: '500', paddingTop: '15px'}}>Имя пользователя</p>
            </> }
            menuItems={   [
                { label: 'Все заказы', to: '/all_orders' },
                { label: 'Мои заказы', to: '/my_orders' },
                { label: 'Тарифы', to: '/pricing_plans' },
            ]}
        />


       {/* основная часть */}
       <div className="full-container" style={{marginBottom: '285px', minHeight: 'calc(100vh - 833px)'}}>
            <div className="main-container">
                <h1 className="page-title">Мои заказы</h1>

                {/* Вкладки */}
                <div className="orders-tabs">
                    <button
                        className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    > Все заказы </button>
                    <button
                        className={`tab-button ${activeTab === 'executor_selected' ? 'active' : ''}`}
                        onClick={() => setActiveTab('executor_selected')}
                    > Вас выбрали исполнителем </button>
                    <button
                        className={`tab-button ${activeTab === 'no_executor' ? 'active' : ''}`}
                        onClick={() => setActiveTab('no_executor')}
                    > Исполнитель не определён </button>
                    <button
                        className={`tab-button ${activeTab === 'executor_selected_other' ? 'active' : ''}`}
                        onClick={() => setActiveTab('executor_selected_other')}
                    > Выбран другой исполнитель </button>
                    <button
                        className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    > Завершенные заказы </button>
                </div>

                {/* Список заказов */}
                {loading ? (
                    <div className="loading-message">Загрузка заказов...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="empty-message">Заказы не найдены</div>
                ) : (
                    <div className="orders-grid">
                        {filteredOrders.map((order) => {
                            const status = getStatusInfo(order);
                            return (
                            <div key={order.id} className="order-card">
                                {status.icon && (
                                <div className="order-status">
                                    <span className="status-icon" style={{ color: status.color }}>
                                    {status.icon}
                                    </span>
                                    <span className="status-text">{status.text}</span>
                                </div>
                                )}

                                <h3 className="order-title">{order.title}</h3>
                                <p className="order-category">{order.category}</p>
                                <p className="order-budget">Бюджет: {order.budget}₽</p>
                                <p className="order-deadline">Сроки выполнения: {order.deadline}</p>

                                <Link to={`/order/${order.id}`} className="detail-link">
                                Подробнее <img src={icon_arrow} alt='Иконка стрелочки' style={{marginLeft: '7px'}}/>
                                </Link>
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>

        <Footer className='footer' />
    </div>
  )
}
