import React from 'react'
import Header from '../../components/Header/Header'
import '../Main/Main.css'
import back from '../../assets/Main/background_top.png'
import icon_connection from '../../assets/Main/icon_connection.svg'
import icon_search from '../../assets/Main/icon_search.svg'


function Main() {
  return (
    <div className='full-container'>
        <Header />

        {/* <div className='main-container'>
            <div className='first-block'>
                <img src={back} alt='background' className='back_on_top'/>
                <h1>Найдите надежных мастеров для ремонта за 5 минут!</h1>
                <p>Маркетплейс строительных услуг от проверенных исполнителей</p>

                
                <button className='icon_conn'>
                    <img src={icon_connection} alt='connection' />
                </button>

                <div className='search-container'>
                    <input type='text' placeholder='Найти специалиста или услугу' className='search-input'/>
                    <img src={icon_search} alt='search' className='search-icon'/>
                    <button className='clear-button' style={{ display: 'none' }}>×</button>
                </div>

                <button className='btn-search'>Найти</button>

            </div>


        </div> */}

    </div>
  )
}

export default Main
