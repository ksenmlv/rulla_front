import React, { useState } from 'react'
import '../common/Common.css'


export default function LawSubjectSwitcher({ currentSubject, onSubjectChange }) {
  return (
    <div className="role-buttons">
        <button 
            className={`role-button ${currentSubject !== 'legal_entity' ? 'active' : ''}`} 
            onClick={() => onSubjectChange('individual_entrepreneur')}> 
            Физическое лицо
        </button>
        <button 
            className={`role-button ${currentSubject === 'legal_entity' ? 'active' : ''}`}
            onClick={() => onSubjectChange('legal_entity')}>
            Юридическое лицо
        </button>
    </div>
  )
}
