import React from 'react'
import { useAppContext } from '../../contexts/AppContext'
import  './Footer.css'
import separator from '../../assets/Main/bw_separator2.svg'
import logo from '../../assets/Main/logo_footer.svg'
import icon_location from '../../assets/Main/icon_location.svg'
import icon_vk from '../../assets/Main/icon_vk.svg'
import icon_inst from '../../assets/Main/icon_inst.svg'
import icon_tg from '../../assets/Main/icon_tg.svg'
import gear4 from '../../assets/Main/gear4.svg'


function Footer() {
  const { selectedCity } = useAppContext()

  return (
    <div className='footer'>
        <img src={separator} alt='separator' className='separator' />

        <div className='black-block'>

            {/* иконка и гео */}
            <div className='black-block__title'>
                <img src={logo} alt='logo' />
                <p><img src={icon_location} alt='icon of location'/>
                    {selectedCity ? selectedCity.label.split(',')[0].trim() : 'Москва'}
                </p>
            </div>

            {/* 3 колонки */}
            <div className='three-columns d-flex flex-row'>

                {/* 1ая колонка с ссылками на разделы и тд */}
                <div className='first-column'>
                    <p style={{color: '#ffffff'}}>Платформа</p>
                    <a>Главная</a>
                    <a>О платформе</a>
                    <a>Каталог исполнителей</a>
                    <a>Ответы на частые вопросы</a>
                    <a>Контакты</a>
                    <a>Политика конфиденциальности</a>
                </div>

                {/* 2ая колонка */}
                <div className='second-column'>
                    <p>Заказчику</p>
                    <button className='btn-white'>Оставить заявку</button>
                    <p style={{marginTop:'59px'}}>Исполнителю</p>
                    <button className='btn-white'>Найти заказы</button>
                    <button className='btn-black'>Тарифы</button>
                </div>

                {/* 3ья колонка */}
                <div className='third-column'>
                    <p>Остались вопросы?</p>
                    <button className='btn-support'>Написать в чат поддержки</button>
                    <div className='d-flex flex-row'>
                        <button className='btn-soc-network'><img src={icon_vk} alt='icon vk'/></button>
                        <button className='btn-soc-network'><img src={icon_inst} alt='icon instagram'/></button>
                        <button className='btn-soc-network'><img src={icon_tg} alt='icon telegram'/></button>
                    </div>
                    <img src={gear4} alt='gear wheel' className='img-gear'/>
                </div>

            </div>

        </div>
    </div>
  )
}

export default Footer
