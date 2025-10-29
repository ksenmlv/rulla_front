import React, { useState } from 'react'
import logo from '../../assets/Header/logo.png'
import icon_location from '../../assets/Header/icon_location.png'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Header.css'
import TownSelect from '../lists/TownSelect'
import { citiesApi } from '../../api/citiesApi.ts'
import { useNavigate } from 'react-router-dom'



 function Header({ hideElements = false }) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)    // для мобильной версии
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleEnterClick = () => {
    navigate('/enter')
  }

  const handleLogoClick = () => {
    navigate('/')
  }


  return (
    <div className='headerContainer'>
        {/* левая часть: лого и пункты меню */}
        <div className='d-flex align-items-center'>
            <img src={logo} alt='logo' width={141} height={44} className='header-logo' onClick={handleLogoClick}/>
            <div className={`header-items ${isMenuOpen ? 'mobile-open' : ''}`}>
                <a className='text-decoration-none text-dark'>О платформе</a>
                <a className='text-decoration-none text-dark'>Каталог исполнителей</a>
            </div>
        </div>

        {/* правая часть: локация и кнопка войти */}
        {!hideElements && (
          <div className='d-flex align-items-center'>

            <div className='location-wrapper  d-md-flex align-items-center'>
                <img src={icon_location} alt='location' className='location-icon'/>
                <TownSelect className='town-select'/>
            </div>

            <button className='btn-orange ms-5' onClick={handleEnterClick}>Войти</button>
            <button className='mobile-menu-btn' onClick={toggleMenu}>☰</button>
          </div>
        )}

    </div>
  )
}

export default Header










