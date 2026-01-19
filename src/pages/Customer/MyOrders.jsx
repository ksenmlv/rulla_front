import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { ordersApi } from '../../api/ordersApi.ts'
import CreateOrderForm from './CreateOrderForm.jsx'
import '../Main/Main.css'
import '../Customer/Customer.css'
import '../Executor/Executor.css'
import '../Registration/Registration.css'
import icon_user from '../../assets/Main/icon_user.svg'
import icon_arrow from '../../assets/Main/arrow_right_blue.svg'
import lock_open from '../../assets/Main/icon_lock_open.svg'
import lock_close from '../../assets/Main/icon_lock_close.svg'
import icon_eye from '../../assets/Main/icon_eye.svg'
import icon_edit from '../../assets/Main/icon_edit_order.svg'
import icon_response from '../../assets/Main/icon_response.svg'
import gear2 from '../../assets/Main/gear2.svg'
import gear3 from '../../assets/Main/gear3.svg'

export default function CusMyOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  // загрузка заказов с бэка
  useEffect(() => {
    ordersApi.getOrders()
      .then((res) => {
        setOrders(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Ошибка загрузки заказов:', err)
        setLoading(false)
      })
  }, [])

  const handleClickUser = () => {
    navigate('/customer_personal_account')
  } 

  const getStatusInfo = (order) => {
    const isOpen = order.lockStatus === 'open'
    return {
      icon: isOpen ? lock_open : lock_close,
      text: isOpen ? 'Открыт для откликов' : 'Закрыт для откликов',
      textColor: isOpen ? '#3EC32C' : '#D03636'
    }
  }


  return (
    <div>
      <Header rightContent={
        <>
          <button className='btn_user' style={{marginRight: '-10px'}} onClick={handleClickUser}>
            <img src={icon_user} alt='Иконка пользователя'/>
          </button>
          <p style={{fontSize: '20px', color: '#000', fontWeight: '500', paddingTop: '15px'}}>Имя пользователя</p>
          <button 
            onClick={() => setShowCreateForm(true)}
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

      <div className="full-container" style={{marginBottom: '285px'}}>
        <div className="main-container">

          {showCreateForm ? (
            <CreateOrderForm
              onClose={() => setShowCreateForm(false)}
              onCreate={(order) => setOrders(prev => [order, ...prev])}
              existingOrders={orders}
            />

          ) : (
            
            <>
              <div className="promo-banner">
                <div className="promo-content">
                  <div className="promo-text">
                    <h3>Создайте заказ прямо сейчас</h3>
                    <p>и найдите проверенных исполнителей!</p>
                  </div>
                  <div className="promo-gears">
                    <img src={gear3} alt="" className="gear gear-large" />
                    <img src={gear2} alt="" className="gear gear-small" />
                  </div>
                  <button className="promo-button" onClick={() => setShowCreateForm(true)}>
                    Создать заказ
                  </button>
                </div>
              </div>

              <h1 className="page-title" style={{marginTop: '40px'}}>Мои заказы</h1>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Загрузка...</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Заказы не найдены</div>
              ) : (
                <div className="orders-grid">
                  {orders.map((order) => {
                    const status = getStatusInfo(order)
                    return (
                      <div key={order.id} className="order-card" style={{position: 'relative'}}>
                        <img src={icon_edit} alt="Редактировать" style={{ position: 'absolute', top: '35px', right: '35px', cursor: 'pointer' }} />

                        <h3 className="order-title">{order.title}</h3>
                        <p className="order-category">{order.category}</p>

                        <div className="order-status" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                          <img src={status.icon} alt="Статус" style={{ width: '20px', height: '20px' }} />
                          <span style={{ color: status.textColor, fontWeight: '500' }}>
                            {status.text}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: '#000', fontSize: '20px', fontWeight: '500', marginBottom: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <img src={icon_response} alt='Отклики' />{order.responses} откликов
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000B2' }}>
                            <img src={icon_eye} alt="Просмотры" /> {order.views} просмотров
                          </div>
                          <div style={{color: '#000000B2' }}>Опубликовано: {order.publishedAt}</div>
                        </div>

                        <Link to={`/order/${order.id}`} className="detail-link" style={{ marginLeft: 0 }}>
                          Подробнее
                          <img src={icon_arrow} alt="Стрелка" style={{ margin: '-5px 0 0 15px' }} />
                        </Link>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </div>

      <Footer className='footer' />
    </div>
  )
}