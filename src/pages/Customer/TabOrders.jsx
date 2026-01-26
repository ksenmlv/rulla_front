import React, { useEffect, useState } from 'react'
import { ordersApi } from '../../api/ordersApi.ts'
import apiClient from '../../api/client'  

import edit from '../../assets/Main/icon_edit_order.svg'
import lock_open from '../../assets/Main/icon_lock_open.svg'
import lock_close from '../../assets/Main/icon_lock_close.svg'
import icon_arrow from '../../assets/Main/arrow_right_blue.svg'
import icon_eye from '../../assets/Main/icon_eye.svg'
import icon_response from '../../assets/Main/icon_response.svg'
import { Link } from 'react-router-dom'


export default function TabOrders() {

    // Заказы
    const [orders, setOrders] = useState([])
    const [loadingOrders, setLoadingOrders] = useState(false)

    const getStatusInfo = (order) => {
        const isOpen = order.lockStatus === 'open'
        return {
            icon: isOpen ? lock_open : lock_close,
            text: isOpen ? 'Открыт для откликов' : 'Закрыт для откликов',
            textColor: isOpen ? '#3EC32C' : '#D03636'
        }
    }

    // загрузка заказов
    useEffect(() => {
        const loadOrders = async () => {
        try {
            setLoadingOrders(true)
            const res = await ordersApi.getOrders()  
            setOrders(res.data || [])  
        } catch (e) {
            console.error('Ошибка загрузки заказов:', e)
            setOrders([]) 
        } finally {
            setLoadingOrders(false)
        }
        }

        loadOrders()
    }, [])


  return (
    <>
    {loadingOrders ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>
            Загрузка...
        </div>
        ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>
            Заказы не найдены
        </div>
        ) : (
        <div className="orders-grid">
            {orders.map((order) => {
            const status = getStatusInfo(order)
            return (
                <div key={order.id} className="order-card" style={{ position: 'relative' }}>
                {/* Иконка редактирования */}
                <img 
                    src={edit} 
                    alt="Редактировать" 
                    style={{ 
                    position: 'absolute', 
                    top: '35px', 
                    right: '35px', 
                    cursor: 'pointer'
                    }} 
                />

                <h3 className="order-title">{order.title}</h3>
                <p className="order-category">{order.category}</p>

                <div className="order-status" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <img src={status.icon} alt="Статус" style={{ width: '20px', height: '20px' }} />
                    <span style={{ color: status.textColor, fontWeight: '500' }}>
                    {status.text}
                    </span>
                </div>

                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '10px', 
                    color: '#000', 
                    fontSize: '20px', 
                    fontWeight: '500', 
                    marginBottom: '20px' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={icon_response} alt='Отклики' />{order.responses} откликов
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000B2' }}>
                        <img src={icon_eye} alt="Просмотры" /> {order.views} просмотров
                    </div>
                    <div style={{ color: '#000000B2' }}>
                        Опубликовано: {order.publishedAt}
                    </div>
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
  )
}
