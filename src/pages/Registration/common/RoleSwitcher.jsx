import React from 'react'
import '../common/Common.css'

export default function RoleSwitcher({ activeRole, onChangeRole }) {
  return (
    <div className="role-buttons">
      <button 
        className={`role-button ${activeRole === 'customer' ? 'active' : ''}`} 
        onClick={() => onChangeRole('customer')}
      > 
        Я заказчик
      </button>
      <button 
        className={`role-button ${activeRole === 'executor' ? 'active' : ''}`}
        onClick={() => onChangeRole('executor')}
      >
        Я исполнитель
      </button>
    </div>
  )
}
