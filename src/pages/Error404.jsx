import React from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import './Registration/Registration.css'
import './Main/Main.css'
import logo from '../assets/Main/logo.svg'
import img from '../assets/Main/img_404.svg'
import vk from '../assets/Main/icon_vk_blue.svg'
import tg from '../assets/Main/icon_tg_blue.svg'
import whatsapp from '../assets/Main/icon-whatsapp.svg'


export default function Error404() {
  return (
    <div>
        <div className='full-container'>
            <div className='main-container' style={{display: 'flex', justifyContent: 'center', minHeight: '1137px' }} >
                <div className='404-container' style={{margin: '140px 0 300px 0', display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <img src={logo} alt='Логотип' width={120} />
                    <img src={img} alt='' width={270} style={{margin: '100px 0 200px 0'}}/>
                    <h1 style={{fontSize: '48px', fontWeight: '800', color: '#02283D'}}>Ведутся технические работы</h1>
                    <p style={{fontSize: '24px', fontWeight: '500', color: '#656565', width: '67%', textAlign: 'center', lineHeight: '1.3'}}>Сайт находится на техническом обслуживании и скоро будет доступен.</p>
                    <p style={{fontSize: '28px', fontWeight: '500', color: '#151515', marginTop: '40px'}}>Связаться с нами:</p>
                    
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <button className='btn-social'><img src={tg} alt='Icon Telegram' style={{ margin: '0 5px 0 -10px' }} /></button>
                        <button className='btn-social'><img src={whatsapp} alt='Icon Whatsapp' style={{ margin: '0 5px 0 -10px' }} /> </button>
                        <button className='btn-social'> <img src={vk} alt='Icon Vk' style={{ margin: '0 5px 0 -10px' }} /> </button>
                    </div>
                    
                </div>
            </div>
        </div>

        <Footer  className='footer'/>
    </div>
  )
}
