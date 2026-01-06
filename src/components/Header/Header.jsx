import React, { useEffect, useState } from 'react'
import logo from '../../assets/Header/logo.png'
import icon_location from '../../assets/Header/icon_location.png'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Header.css'
import CustomSelector from '../lists/TownSelect'
import { Link, useNavigate } from 'react-router-dom'



 function Header({
    hideElements = false,
    menuItems,
    rightContent,
    showLocation = true
  }) {

  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)    // для мобильной версии
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // отслеживаем изменение размера окна
  useEffect (() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // дефолтные значения
  const defaultMenuItems = [
    { label: 'О платформе', to: '/about' },
    { label: 'Каталог исполнителей', to: '/executor_catalog' },
  ]
  
  const defaultRightContent = (
    <button className="btn-blue" onClick={() => navigate('/enter')}>
      Войти
    </button>
  )

  const items = menuItems || defaultMenuItems
  const contentOnRight = rightContent || defaultRightContent


  // меню для мобилки
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)


  return (
    <div className='headerContainer'>

        {/* ЛЕВАЯ ЧАСТЬ: лого и пункты меню */}
        <div className='header-left d-flex align-items-center'>
            <Link to='/'>  <img src={logo} alt='logo' width={141} height={44} className='header-logo'/>  </Link>

            {/* декстопные пункты меню */}
            <div className={`header-items ${isMenuOpen ? 'mobile-open' : ''}`}>
                {items.map((item, i) => (
                  item.to ? (
                    <Link key={i} to={item.to} className="text-decoration-none text-dark ">
                      {item.label}
                    </Link>
                  ) : (
                    <a key={i} className="text-decoration-none text-dark" onClick={item.onClick} >
                      {item.label}
                    </a>
                  )
                ))}
            </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: локация и кнопка войти */}
        {!hideElements && (
          <div className='header-right d-flex align-items-center'>

            {/* локация */}
            { showLocation && !isMobile && (
              <div className='location-wrapper d-md-flex align-items-center' style={{marginRight:'30px'}}>
                  <img src={icon_location} alt='location' className='location-icon'/>
                  <CustomSelector className='town-select'/>
              </div>
            )}

            {/* кнопка войти/кнопка юзера */}
            {contentOnRight}

            {/* мобильная кнопка */}
            <button className='mobile-menu-btn' onClick={toggleMenu}>☰</button>
          </div>
        )}

    </div>
  )
}

export default Header










