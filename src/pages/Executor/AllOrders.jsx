import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { ordersApi } from '../../api/ordersApi.ts'
import '../Executor/Executor.css'
import '../Main/Main.css'
import '../Main/MainExecutor.css'
import '../../styles/Modal.css'
import icon_user from '../../assets/Main/icon_user.svg'
import icon_location from '../../assets/Header/icon_location.png'
import icon_eye from '../../assets/Main/icon_eye.svg'
import icon_arrow from '../../assets/Main/arrow_right_blue.svg'
import icon_star from '../../assets/Main/icon_star.svg'
import icon_filter from '../../assets/Main/icon_filter.svg'
import icon_search from '../../assets/Main/icon_search.svg'
import icon_close_modal from '../../assets/Main/icon_close_modal.svg'
import icon_plane from '../../assets/Main/icon_successful_response.svg'



export default function AllOrders() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const [isResponseSentModalOpen, setIsResponseSentModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openResponseSentModal = () => setIsResponseSentModalOpen(true)
  const closeResponseSentModal = () => setIsResponseSentModalOpen(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // загрузка заказов   
  useEffect(() => {
    ordersApi.getOrders()
      .then(res => {
        setOrders(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  // Поиск (пока просто пример — потом добавишь параметр search в API)
  const handleSearch = () => {
    const input = document.querySelector('.search-input-top')
    if (input) {
      const value = input.value.trim()
      // Здесь можно добавить загрузку с параметром { search: value }
      console.log('Поиск по:', value)
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
                { label: 'Все заказы', to: '/executor_all_orders' },
                { label: 'Мои заказы', to: '/executor_my_orders' },
                { label: 'Тарифы', to: '/pricing_plans' },
            ]}
        />


        {/* основная часть */}
        <div className="full-container" style={{marginBottom: '220px', minHeight: 'calc(100vh - 902px)'}}>
            <div className="main-container">

                {/* заголовок */}
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <h1 className="page-title">Все заказы</h1>
                    <p style={{fontSize: '20px', color: '#656565', margin: '147px 0 0 20px'}}>Всего 102342 заявок</p>
                </div>

                {/* Поиск + кнопка фильтра */}
                <div className="orders-controls">
                    <div className="search-bar">
                        <img src={icon_search} alt="Поиск" className="search-icon-top" />
                        <input
                            type="text"
                            placeholder="Поиск"
                            className="search-input-top"
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>

                    <button className="search-btn-top" onClick={handleSearch}> Найти </button>

                    <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
                        <img src={icon_filter} alt="Фильтр" />
                    </button>
                </div>

                {/* Панель фильтров */}
                {showFilters && (
                    <div className="filters-panel">
                    <div className="filters-row">
                        <select className="filter-select">
                        <option>Категория</option>
                        </select>
                        <select className="filter-select">
                        <option>Подкатегория</option>
                        </select>
                        <input type="text" placeholder="Бюджет (от …)" className="filter-input" />
                        <select className="filter-select">
                        <option>Регион</option>
                        </select>
                        <select className="filter-select">
                        <option>Город</option>
                        </select>
                        <input type="text" placeholder="Сроки (с …)" className="filter-input" />
                    </div>

                    <div className="filters-checkbox">
                        <label>
                        <input type="checkbox" />
                        Только актуальные
                        </label>
                    </div>

                    <div className="filters-actions">
                        <button className="subscribe-btn">Подписаться на этот фильтр</button>
                        <button className="reset-btn">Сбросить все</button>
                    </div>
                    </div>
                )}

                {/* карточки заказов */}
                {loading ? (
                    <div style={{textAlign: 'center', padding: '80px', color: '#999'}}>Загрузка заказов...</div>
                ) : orders.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '80px', color: '#999'}}>Заказы не найдены</div>
                ) : (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px'}}>
                        {orders.map(order => (
                            <div key={order.id} className="task-card-modern" style={{border: '1px solid #919191'}}>

                                {/* Заголовок */}
                                <div className="task-header">
                                    <h3 className="task-title-modern">{order.title}</h3>
                                </div>

                                <div className="task-category-modern">{order.category}</div>

                                {/* Основная информация */}
                                <div className="task-details">
                                    <div className="detail-item" style={{color: '#000000', fontWeight: '600', display: 'flex', alignItems: 'center'}}>
                                        Бюджет: {order.budget}₽
                                    </div>
                                    <div className="detail-item" style={{marginBottom: 0}}>
                                        Сроки выполнения: {order.deadline}
                                    </div>
                                    <div className="detail-item" style={{marginBottom: '25px'}}>
                                        <img src={icon_location} alt="Иконка локации" className=" me-2" width={20} />
                                        {order.location}
                                    </div>
                                    <div className="detail-item" style={{marginBottom: 0}}>
                                        <img src={icon_eye} alt="Иконка просмотров" className=" me-2"  width={20} />
                                        {order.views} просмотров
                                    </div>
                                    <div className="detail-item ">
                                        Опубликовано: {order.publishedAt}
                                    </div>
                                </div>

                                {/* Синяя кнопка "Подробнее" */}
                                <Link to={`/executor_order/${order.id}`} className="btn-detail" style={{marginLeft:0}}>
                                    Подробнее
                                    <img src={icon_arrow} alt='Стрелка' style={{marginLeft: '10px'}}/>
                                </Link>

                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px'}}>
                                    <button onClick={openModal} className="respond-btn" style={{marginTop: '40px'}}> Откликнуться </button>
                                    <button className="favorite-btn" onClick={openResponseSentModal} style={{borderRadius: '7px', marginTop: '40px'}}> <img src={icon_star} alt="В избранное"/> </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* модальное окно - отклика нет */}
                {isModalOpen && (
                    <div className='modal-overlay' onClick={closeModal} >
                        <div className='modal-window' onClick={(e) => e.stopPropagation()} >
                            {/* крестик закрытия */}
                            <button onClick={closeModal}> <img src={icon_close_modal} alt='Крестик' /> </button>

                            {/* Текст */}
                            <div className='modal-text' > Для отклика на заказ пройдите <br /> полную регистрацию исполнителя </div>

                            {/* Кнопка */}
                            <button className='modal-action-btn' onClick={() => {
                                alert('Переход на регистрацию исполнителя');
                                closeModal();
                                navigate('/full_registration_step1')
                            }}
                            > Заполнить данные </button>
                        </div>
                    </div>
                )}


                {/* модальное окно - отклик есть */}
                {isResponseSentModalOpen && (
                    <div className="modal-overlay" onClick={closeResponseSentModal}>
                        <div className="response-sent-modal-window" onClick={(e) => e.stopPropagation()}>
                        
                        <button className="response-sent-modal-close" onClick={closeResponseSentModal}>
                            <img src={icon_close_modal} alt="Закрыть" />
                        </button>

                        {/* Иконка самолётика */}
                        <div  className="response-sent-modal-plane">
                            <img src={icon_plane} alt='Отклик улетел'/>
                        </div>

                        {/* Заголовок */}
                        <h2 className="response-sent-modal-title">
                            «Ваш отклик отправлен!<br />Перейти в чат по заказу»
                        </h2>

                        {/* Кнопка "Перейти в чат" */}
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <button 
                                className="response-sent-modal-chat-btn"
                                onClick={() => {
                                alert('Переход в чат по заказу')
                                closeResponseSentModal()
                                // navigate('/chat/order/123') — сюда добавить реальный роут
                                }}
                            >
                                Перейти в чат
                            </button>
                        </div>

                        {/* Блок с похожими заказами */}
                        <div className="response-sent-similar-title">
                            <p>Вас могут заинтересовать эти заказы:</p>
                            <button className="btn-detail" style={{marginLeft: 'auto'}}>
                                Подробнее
                                <img src={icon_arrow} alt='Стрелка' style={{marginLeft: '10px'}}/>
                            </button>
                        </div>

                        {/* Две карточки заказов */}
                        <div className="response-sent-similar-grid">
                            {/* Первая карточка */}
                            <div className="response-sent-similar-card">
                            <h3>Название заказа</h3>
                            <p className="task-category-modern">Категория/подкатегория</p>
                            <p className="budget">Бюджет: 200 000₽</p>
                            <p className="details">Сроки выполнения: 6 месяцев</p>
                            <p className="location">г. Одинцово, Московская обл.</p>
                            <div className="views">
                                <img src={icon_eye} alt="Просмотры" width={18} />
                                <span>120 просмотров</span>
                            </div>
                            <p className="published">Опубликовано: 2 сентября 2025г.</p>
                             <button className="btn-detail" style={{marginLeft: 'auto'}}>
                                Подробнее
                                <img src={icon_arrow} alt='Стрелка' style={{marginLeft: '10px'}}/>
                            </button>
                            </div>

                            {/* Вторая карточка */}
                            <div className="response-sent-similar-card">
                            <h3>Название заказа</h3>
                            <p className="category">Категория/подкатегория</p>
                            <p className="budget">Бюджет: 200 000₽</p>
                            <p className="details">Сроки выполнения: 6 месяцев</p>
                            <p className="location">г. Одинцово, Московская обл.</p>
                            <div className="views">
                                <img src={icon_eye} alt="Просмотры" width={18} />
                                <span>120 просмотров</span>
                            </div>
                            <p className="published">Опубликовано: 2 сентября 2025г.</p>
                             <button className="btn-detail" style={{marginLeft: 'auto'}}>
                                Подробнее
                                <img src={icon_arrow} alt='Стрелка' style={{marginLeft: '10px'}}/>
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    )}

            </div>
        </div>


        <Footer className='footer' />
    </div>
  )
}
