import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import '../Main/Main.css'
import '../Executor/Executor.css'
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



function Catalog() {
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
        <Header />

        <div className='full-container'>
            <div className='main-container'>

                {/* блок "Создать заказ" */}
                <div className='manager-connect'>
                    <div className='d-flex flex-row'>
                        <div className='manager-connect__text'>
                            <h3>Создайте заказ прямо сейчас </h3>
                            <p>и найдите проверенных исполнителей!</p>
                        </div>
                    </div>

                    <div className='d-flex flex-row'>
                        <div className='manager-connect__pics'>
                            <img src={gear2} alt='gear' className='gear2'/>
                            <img src={gear3} alt='gear' className='gear3'/>
                        </div>

                        <button>Создать заказ</button>
                    </div>
                </div>


                {/* блок "Мне нужен специалист в категории:" */}
                <div className='work-options' style={{margin: '-10px 0 220px 0'}}>
                    <h1>Мне нужен специалист в категории:</h1>

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




                
            </div>
        </div>

        <Footer />
    </>
    



  )
}

export default Catalog
