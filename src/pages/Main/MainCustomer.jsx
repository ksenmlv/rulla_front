import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import '../Main/Main.css'
import '../Main/MainCustomer.css'
import TownSelect from '../../components/lists/TownSelect'
import back from '../../assets/Main/back.png'
import icon_connection from '../../assets/Main/icon_connection.png'
import icon_search from '../../assets/Main/icon_search.svg'
import separator from '../../assets/Main/blue_separator.svg'
import main_separator from '../../assets/Main/blue_main_separator.svg'
import arrow_r from '../../assets/Main/arrow_right.svg'
import block_house from '../../assets/Main/block_house.png'
import block_armchair from '../../assets/Main/block_armchair.png'
import block_tap from '../../assets/Main/block_tap.png'
import block_roller from '../../assets/Main/block_roller.png'
import block_power_socket from '../../assets/Main/block_power_socket.png'
import block_table from '../../assets/Main/block_table.png'
import block_tile from '../../assets/Main/block_tile.png'
import block_sofa from '../../assets/Main/block_sofa.png'
import arrow_r_white from '../../assets/Main/arrow_right_white.svg'
import icon_con_manager from '../../assets/Main/icon_connect_manager.svg'
import gear2 from '../../assets/Main/gear2.svg'
import gear3 from '../../assets/Main/gear3.svg'
import hammer2 from '../../assets/Main/hammer2.svg'
import stages from '../../assets/Main/line_of_stages.svg'
import stages_mob from '../../assets/Main/line_stages_mob.svg'
import stage1 from '../../assets/Main/stage1.svg'
import stage2 from '../../assets/Main/stage2.svg'
import stage3 from '../../assets/Main/stage3.svg'
import stage_final from '../../assets/Main/stage_final.svg'
import icon_location from '../../assets/Header/icon_location.png'
import icon_user from '../../assets/Main/icon_user.svg'



function MainCustomer() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)        

  // определение ширины устройства
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);   


  return (
    <>
        <Header rightContent={
            < >
                <button className='btn_user'><img src={icon_user} alt='Иконка пользователя'/></button>
                <button className='btn-blue'>Создать заказ</button>
            </> }
            menuItems={   [
                { label: 'О платформе', to: '/about' },
                { label: 'Каталог исполнителей', to: '/' },
                { label: 'Мои заказы', to: '/customer_my_orders' },
            ]}
        />

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

                    <h1>Найдите надежных мастеров для ремонта за 5 минут!</h1>
                    <p style={{width: '48%', top:'55%'}}>Сервис для поиска надежных подрядчиков в сфере ремонта и строительства</p>



                    <button className='icon_conn'>
                        <img src={icon_connection} alt='connection' />
                    </button>

                    <Link to='/'><button className='btn-create-order'>Создать заказ</button></Link>
                </div>

                <img src={main_separator} alt='separator' className='separator'/>


                {/* блок "что нужно сделать?" */}
                <div className='work-options'>
                    <h1>Что нужно сделать?</h1>

                    <div className='block-large'>
                        <div>
                            <h2>Ремонт “Под ключ”</h2>
                            <p>Смотреть отклики <img src={arrow_r} alt='arrow' /></p>
                        </div>
                        <img src={block_house} alt='house' className='img-house'/>
                    </div>

                    <div className='blocks'>
                        <div className='block'>
                            <h3>Проектирование и дизайн</h3>
                            <img src={block_armchair} alt='armchair' className='img-block armchair' />
                        </div>
                        
                        <div className='block'>
                            <h3>Сантехника</h3>
                            <img src={block_tap} alt='tap' className='img-block tap' width={217}/>
                        </div>
                        
                        <div className='block'>
                            <h3>Отделка</h3>
                            <p>Стены/потолки/полы</p>
                            <img src={block_roller} alt='roller' className='img-block roller' />
                        </div>
                        
                        <div className='block'>
                            <h3>Электрика</h3>
                            <img src={block_power_socket} alt='power_socket' style={{ bottom:'20px' }} className='img-block'/>
                        </div>

                        <div className='block'>
                            <h3>Ремонт коммерческих помещений</h3>
                            <img src={block_table} alt='table' style={{ bottom:'7px' }} className='img-block table' />
                        </div>
                        
                        <div className='block'>
                            <h3>Плиточные работы</h3>
                            <img src={block_tile} alt='tile' className='img-block tile' width={411}/>
                        </div>
                        
                        <div className='block'>
                            <h3 style={{ width:'277px' }}>Сборка и ремонт мебели</h3>
                            <img src={block_sofa} alt='sofa' style={{ bottom:'-13px' }} className='img-block sofa' width={283}/>
                        </div>
                        
                        <div className='block dark'>
                            <h3>Другое</h3>
                            <p>Перейти <img src={arrow_r_white} alt='arrow' /></p>
                        </div>

                    </div>
                </div>


                {/* блок этапов работы */}
                <div className='work-stages'>
                    <h1>Как это работает?</h1>

                    <div className='stages-wrapper'>

                        <div className='stages-vertical'>
                            <img src={ isMobile ? stages_mob : stages} alt='line of stages' className='line-of-stages' />
                            <div className='stages-numbers'>
                                <img src={stage1} alt='stage 1' className='stage1' />
                                <img src={stage2} alt='stage 2' className='stage2' style={{marginLeft:'9%'}} />
                                <img src={stage3} alt='stage 3' className='stage3' style={{marginLeft:'8%'}}/>
                                { !isMobile && (<img src={stage_final} alt='stage final' className='stage-final' /> )}
                            </div>
                        </div>
                    
                        <div className='stages-text'>
                            <div style={ !isMobile ? {width:'435px', marginLeft:'5px'} : {width: '240px', marginBottom: '25px'} }>
                                <h3>Оставьте заявку</h3>
                                <p>Укажите вид работ, сроки и все детали, чтобы исполнители знали, что нужно делать</p>
                            </div>
                            <div style={ !isMobile ? {width:'418px', marginLeft:'10px'} : {width: '240px', marginBottom: '28px'} }>
                                <h3>Получите предложения</h3>
                                <p style={ !isMobile ? {width:'409px'} : {} }>Мастера будут оставлять отклики, которые вы увидите в разделе «Мои заказы»</p>
                            </div>
                            <div style={ !isMobile ? {width:'488px', marginLeft:'13px'} : {width: '240px'}}>
                                <h3>Выберите лучшего</h3>
                                <p>Сравните предложенные варианты и свяжитесь с понравившимся мастером напрямую, чтобы обсудить подробности</p>
                            </div>
                        </div>
                    </div>
                    
                </div>


                {/* блок "возникли сложности?" */}
                <div className='manager-connect'>
                    <div className='d-flex flex-row'>
                        <div className='manager-connect__icon'>
                            <img src={icon_con_manager} alt='icon connect' />
                        </div>

                        <div className='manager-connect__text'>
                            <h3>Возникли сложности?</h3>
                            <p>Воспользуйтесь помощью менеджера</p>
                        </div>
                    </div>

                    <div className='d-flex flex-row'>
                        <div className='manager-connect__pics'>
                            <img src={gear2} alt='gear' className='gear2'/>
                            <img src={gear3} alt='gear' className='gear3'/>
                        </div>

                        <button>Связаться с менеджером</button>
                    </div>

                </div>


                {/* блок "оставьте заявку" */}
                <div className='request d-flex flex-column'>
                    <div>
                        <h2>Оставьте заявку прямо сейчас,</h2>
                        <p>чтобы найти проверенного специалиста уже сегодня! </p>
                    </div>
                    <div className='d-flex justify-content-start'>
                        <button>Оставить заявку</button>
                    </div>
                    <img src={hammer2} alt='hammer' />
                </div>
                
            </div>

        </div>

        <Footer />
    </>
    



  )
}

export default MainCustomer;
