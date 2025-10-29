import React, { useState } from 'react'
import '../common/Common.css'


export default function RoleSwitcher() {
  const [activeRole, setActiveRole] = useState('executor')  

  return (
    <div className="role-buttons">
        <button 
            className={`role-button ${activeRole === 'executor' ? 'active' : ''}`} 
            onClick={() => setActiveRole('executor')}> 
            Я заказчик
        </button>
        <button 
            className={`role-button ${activeRole === 'customer' ? 'active' : ''}`}
            onClick={() => setActiveRole('customer')}>
            Я исполнитель
        </button>
    </div>
  )
}
