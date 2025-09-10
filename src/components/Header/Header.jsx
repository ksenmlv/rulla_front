import React from 'react'
import logo from '../../assets/Header/logo.png'
import icon_location from '../../assets/Header/icon_location.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'
import TownSelect from '../lists/TownSelect';



function Header() {
  return (
    <div className='headerContainer'>
        <div className='d-flex align-items-center'>
            <img src={logo} alt='logo' width={141} height={44} className='header-logo'/>
            <div className='header-items'>
                <a className='text-decoration-none text-dark'>О платформе</a>
                <a className='text-decoration-none text-dark'>Каталог исполнителей</a>
            </div>
            <button className='mobile-menu-btn'>☰</button>
        </div>

        <div className='d-flex align-items-center'>
            <img src={icon_location} alt='location' className='location-icon'/>
            <TownSelect className='town-select'/>
            <button className='btn-orange ms-5'>Войти</button>
        </div>
    </div>
  )
}

export default Header
