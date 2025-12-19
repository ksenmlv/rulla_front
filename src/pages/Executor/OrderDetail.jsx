import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { ordersApi } from '../../api/ordersApi.ts'
import icon_user from '../../assets/Main/icon_user.svg'
import icon_star from '../../assets/Main/icon_star.svg'  
import icon_star_yellow from '../../assets/Main/icon_star_yellow.svg'  
import icon_check from '../../assets/Main/icon_checkmark2.svg'  
import icon_eye from '../../assets/Main/icon_eye.svg'     
import icon_arrow from '../../assets/Main/icon_arrow_top_blue.svg'     
import '../Main/Main.css'
import '../Executor/Executor.css'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

    // загрузка заказов   
    useEffect(() => {
        ordersApi
        .getOrders()
        .then((res) => {
            const foundOrder = res.data.find((o) => o.id === Number(id))
            setOrder(foundOrder || null)
            setLoading(false)
        })
        .catch((err) => {
            console.error('Ошибка загрузки заказов:', err)
            setLoading(false)
        })
    }, [id])

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '100px', fontSize: '20px' }}>Загрузка...</div>
    }

    if (!order) {
        return <div style={{ textAlign: 'center', padding: '100px', fontSize: '20px', color: '#999' }}>
        Заказ не найден
        </div>
    }

  return (
    <div className="order-detail-page">
      <Header
        rightContent={
          <>
            <button className="btn_user" style={{ marginRight: '-10px' }}>
              <img src={icon_user} alt="Пользователь" />
            </button>
            <p style={{ fontSize: '20px', color: '#000', fontWeight: '500', paddingTop: '15px' }}>
              Имя исполнителя
            </p>
          </>
        }
        menuItems={[
          { label: 'Все заказы', to: '/executor_all_orders' },
          { label: 'Мои заказы', to: '/executor_my_orders' },
          { label: 'Тарифы', to: '/pricing_plans' },
        ]}
      />

       <div className="full-container" style={{marginBottom: '220px', minHeight: 'calc(100vh - 904px)'}}>
            <div className="main-container">
                <div className="order-detail-card" style={{marginTop: '150px', display: 'flex', flexDirection: 'row'}}>
                    <div style={{maxWidth: '60%'}}>
                        {/* Заголовок */}
                        <div className="order-detail-header">
                            <div>
                                <h1 className="order-title">{order.title}</h1>
                                <p className="order-category">{order.category}</p>
                            </div>
                        </div>

                        <p className='order-budget' style={{marginTop: '50px'}}>Бюджет: {order.budget}₽</p>

                        {/* Сроки, требования и материалы */}
                        <div className="order-requirements">
                            <p className='order-deadline_ mt-3'>Сроки выполнения: {order.deadline}</p>
                            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                                Требования:
                                <div className="requirements-list">
                                    {order.requirements?.map((req, i) => (
                                        <span key={i} className="requirement-item">
                                        <img src={icon_check} alt="✓" style={{ margin: '0 8px 0 20px' }} />
                                        {req}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                Материалы:
                                <div className="requirements-list">
                                    <span className="requirement-item">
                                        <img src={icon_check} alt="✓" style={{ margin: '0 8px 0 20px' }} />
                                        {order.materials || 'Не указано'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div style={{maxWidth: '35%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: 'auto'}}>
                        {/* информация о заказчике */}
                        <div className="customer-info">
                            <div className="customer-avatar">
                                <img src={icon_user} alt="Заказчик" />
                            </div>
                            <div>
                                <p className="customer-name">{order.customerName}</p>
                                <p className="customer-rating" style={{display: 'flex', alignItems: 'center'}}>
                                {order.customerRating} <img src={icon_star_yellow} alt='Звезда' style={{margin: '0 10px'}}/> {order.customerReviews} отзывов
                                </p>
                            </div>
                        </div> 

                        {/* Кнопка отклика */}
                        <div className="order-actions">
                            <button className="respond-btn">Откликнуться</button>
                            <button className="favorite-btn">
                                <img src={icon_star} alt="Избранное" style={{ width: '28px' }} />
                            </button>
                        </div>
                    </div>              
              
                </div>


                {/* 2ой блок */}
                <div className="order-detail-card" style={{marginTop: '20px'}}>
                    
                    {/* Описание */}
                    {order.description && (
                        <div className="order-description">
                            <h3>Описание:</h3>
                            <p>{order.description}</p>
                            <Link to="#" className="show-more-link">Показать ещё <img src={icon_arrow} alt='Стрелочка' /></Link>
                        </div>
                    )}

                    {/* Фото желаемого результата */}
                    {order.images && order.images.length > 0 && (
                        <div className="desired-result">
                            <h3>Желаемый результат:</h3>
                            <div className="images-gallery">
                            {order.images.map((img, i) => (
                                <img key={i} src={img} alt={`Фото ${i + 1}`} className="result-image" />
                            ))}
                            </div>
                        </div>
                    )}

                    {/* Просмотры и дата */}
                    <div className="order-footer-info">
                        <p> <img src={icon_eye} alt="Иконка просмотров" className=" me-1"  width={20} /> {order.views} просмотров</p>
                        <p style={{marginTop: '-10px'}}>Опубликовано: {order.publishedAt}</p>
                    </div>
                </div>
            </div>
      </div>

      <Footer />
    </div>
  )
}