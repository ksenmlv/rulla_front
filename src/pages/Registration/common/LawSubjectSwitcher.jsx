import React, { useState } from 'react'
import '../common/Common.css'


export default function LawSubjectSwitcher() {
  const [activeRole, setActiveRole] = useState('individual')  

  return (
    <div className="role-buttons">
        <button 
            className={`role-button ${activeRole === 'individual' ? 'active' : ''}`} 
            onClick={() => setActiveRole('individual')}> 
            Физическое лицо
        </button>
        <button 
            className={`role-button ${activeRole === 'legal' ? 'active' : ''}`}
            onClick={() => setActiveRole('legal')}>
            Юридическое лицо
        </button>
    </div>
  )
}
