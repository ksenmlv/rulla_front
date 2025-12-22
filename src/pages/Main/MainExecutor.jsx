import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import '../Main/MainExecutor.css'
import '../Main/Main.css'
import TownSelect from '../../components/lists/TownSelect'
import { ordersApi } from '../../api/ordersApi.ts'
import icon_user from '../../assets/Main/icon_user.svg'
import back from '../../assets/Main/back.png'
import icon_connection from '../../assets/Main/icon_connection.png'
import icon_search from '../../assets/Main/icon_search.svg'
import separator from '../../assets/Main/bw_separator.svg'
import icon_location from '../../assets/Header/icon_location.png'
import icon_eye from '../../assets/Main/icon_eye.svg'
import icon_arrow from '../../assets/Main/arrow_right_blue.svg'
import icon_hammer from '../../assets/Main/icon_hammer.svg'
import icon_gear from '../../assets/Main/icon_gear.svg'
import icon_wrench from '../../assets/Main/icon_wrench.svg'
import icon_gear_wheel from '../../assets/Main/icon_gear_wheel.svg'
import icon_pliers from '../../assets/Main/icon_pliers.svg'


export default function MainExecutor() {
    const navigate = useNavigate()
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)   
    const [orders, setOrders] = useState([])                    // список заказов
    const [loading, setLoading] = useState(true)                // для "Загрузка..."
    const [searchQuery, setSearchQuery] = useState('')          // что ввёл пользователь     

    // определение ширины устройства
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])   

    // загрузка заказов при открытии страницы и при поиске
    useEffect(() => {
        ordersApi.getOrders({ search: searchQuery })
            .then(res => {
                setOrders(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [searchQuery])   // перезагружает при изменении поискового запроса

    // функция для кнопки "Найти"
    const handleSearch = () => {
        const inputValue = document.querySelector('.search-input').value.trim()
        setSearchQuery(inputValue)
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
        <div className='full-container'>
            <div className='main-container'>
                
                {/* первый блок до разделителя */}
                <div className='first-block'>
                    <img rel="preload" src={back} alt='background' className='back_on_top' />

                    {/* локация для мобилки */}
                        { isMobile &&  (   
                            <div className='location-wrapper'>
                                <img src={icon_location} alt='location' className='location-icon'/>
                                <TownSelect className='town-select'/>
                            </div>
                        )}

                    <h1 style={{marginTop: '8vh', width: '50%'}}>Стабильные заказы на ремонт без постоянного поиска клиентов</h1>
                    <p style={{marginTop: '6vh', width: '50%'}}>Получайте предложения от заказчиков и выбирайте только интересные для себя проекты</p>



                    <button className='icon_conn'>
                        <img src={icon_connection} alt='connection' />
                    </button>

                    {/* переадресация поправить !!!*/}
                    <Link to='/main_executor'><button className='btn-search' style={{width: '27%', left: '40px'}}>Найти заказы</button></Link>   
                </div>

                <img src={separator} alt='separator' className='separator'/>


                {/* блок "актуальные заказы" */}
                <div className='whole-block'>
                    <h2 style={{marginTop: '120px'}}>Актуальные заказы</h2>

                    {/* контейнер поиска */}
                     <div className='search-container' style={{position: 'relative', margin: '20px 0 40px 0', display: 'flex', flexDirection: 'row', width: '100%'}} >
                        <div style={{width: '75%'}}>
                            <input type='text' placeholder='Найти заказы' className='search-input' style={{marginLeft: '-40px'}} onKeyPress={(e) => e.key === 'Enter' && handleSearch()}/>
                            <img src={icon_search} alt='search' className='search-icon' style={{left: '0'}}/>
                            <button className='clear-button' style={{ display: 'none'}}>×</button>
                        </div>

                        <button className='btn-search' onClick={handleSearch} style={{width: '24%', bottom: 0}}>Найти</button>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'flex-end', margin: '0 -47% 20px 0'}}>
                        <button onClick={() => navigate('/executor_all_orders')} className="btn-detail" >
                            Все заказы
                            <img src={icon_arrow} alt='Иконка стрелочки' style={{color: '#02283D', marginLeft: '10px'}}/>
                        </button>
                    </div>

                    {/* ячейки заказов */}
                    {loading ? (
                        <div className="text-center py-5">Загрузка заказов...</div>
                        ) : orders.length === 0 ? (
                        <div className="text-center py-5">Заказы не найдены</div>
                        ) : (
                        <div className="row g-4">
                            {orders.slice(0, 3).map(order => (
                            <div key={order.id} className="col-12 col-md-6 col-lg-4">
                                <div className="task-card-modern">

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

                                    {/* Синяя кнопка снизу */}
                                    <Link to={`/executor_order/${order.id}`} className="btn-detail">
                                        Подробнее
                                        <img src={icon_arrow} alt='Иконка стрелочки' style={{color: '#02283D',  marginLeft: '10px'}}/>
                                    </Link>

                                </div>
                            </div>
                            ))}
                        </div>
                    )}
                </div>


                {/* блок "Для кого наша платформа" */}
                <div className='whole-block'>
                     <h2>Для кого наша платформа</h2>

                     <div className="executor-types-container">
                        {/* Первый ряд */}
                        <div className="executor-row">
                            {/* Частные мастера — 40% */}
                            <div className="executor-card width-40">
                                <div className="executor-card__content">
                                    <h3 className="executor-card__title">Частные мастера</h3>
                                    <p className="executor-card__description">
                                    Работайте с клиентами без посредников
                                    </p>
                                </div>
                                <div className="executor-card__icon">
                                    <img src={icon_hammer} alt='Иконка молотка' />
                                </div>
                            </div>

                            {/* Бригады — 60% */}
                            <div className="executor-card width-60">
                                <div className="executor-card__content">
                                    <h3 className="executor-card__title">Бригады</h3>
                                    <p className="executor-card__description">
                                    Берите объемные заказы под ключ
                                    </p>
                                </div>
                                <div className="executor-card__icon" style={{top: '54%', right: '28%'}}>
                                    <img src={icon_gear} alt='Иконка гаечки'/>
                                </div>
                                <div style={{position: 'absolute', bottom: '0', right: '0'}}>
                                    <img src={icon_wrench} alt='Иконка гаечного ключа' />
                                </div>
                            </div>
                        </div>

                        {/* Второй ряд */}
                        <div className="executor-row">
                            {/* Подрядные организации — 60% */}
                            <div className="executor-card width-60">
                                <div className="executor-card__content">
                                    <h3 className="executor-card__title">Подрядные организации</h3>
                                    <p className="executor-card__description">
                                    Постоянный поток заказов для вашей компании
                                    </p>
                                </div>
                               <div style={{position: 'absolute', bottom: '0', right: '0'}}>
                                    <img src={icon_pliers} alt='Иконка плоскогубцев' />
                                </div>
                            </div>

                            {/* Генподрядчики — 40% */}
                            <div className="executor-card width-40">
                                <div className="executor-card__content">
                                    <h3 className="executor-card__title">Генподрядчики</h3>
                                    <p className="executor-card__description">
                                    Найдите субподрядчиков или дополнительные проекты
                                    </p>
                                </div>
                                <div className="executor-card__icon" style={{top: '15%'}}>
                                    <img src={icon_gear_wheel} alt='Иконка шестеренки' />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
        
            </div>
        </div>


        <Footer />
      
    </div>
  )
}
