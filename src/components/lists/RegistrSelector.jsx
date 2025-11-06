import React, { useState, useRef, useEffect } from 'react';
import './RegistrSelector.css'; 

const RegistrSelector = ({ subject = [], placeholder, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  

  const dropdownRef = useRef(null);
  const dropdownListRef = useRef(null);
  const selectedOptionRef = useRef(null);

  // Закрытие dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // если введённого текста нет в списке — очищаем
        if (!subject.includes(searchValue)) {
          setSearchValue(selectedActivity || '');
        }
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchValue, selectedActivity, subject]);

  // Прокрутка к выбранному элементу при открытии списка
  useEffect(() => {
    if (isOpen && selectedActivity && dropdownListRef.current && selectedOptionRef.current) {
      setTimeout(() => {
        const dropdown = dropdownListRef.current;
        const selectedElement = selectedOptionRef.current;
        dropdown.scrollTop = selectedElement.offsetTop - dropdown.offsetTop;
      }, 0);
    }
  }, [isOpen, selectedActivity]);

  const handleSelect = (activity) => {
    setSelectedActivity(activity);
    setSearchValue(activity);
    setIsOpen(false);
    if (onSelect) onSelect(activity); 
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    setIsOpen(true);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (selectedActivity) {
      setSearchValue('');
    }
  };

  // Фильтрация при вводе: по первой букве, иначе показываем всё
  const filteredActivities = searchValue
    ? subject.filter((activity) =>
        activity.toLowerCase().startsWith(searchValue.toLowerCase())
      )
    : subject;

  return (
    <div className="activity-input-container" ref={dropdownRef}>
      <input
        type="text"
        className={`activity-input ${isOpen ? 'active' : ''}`}
        placeholder={placeholder}
        value={searchValue || selectedActivity}
        onFocus={handleInputFocus}
        onChange={handleInputChange}
      />
      <div
        className={`arrow ${isOpen ? 'arrow-up' : 'arrow-down'}`}
        onClick={toggleDropdown}
      >
        <svg width="20" height="12" viewBox="0 0 12 8" fill="none">
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isOpen && (
        <div 
          className="activity-dropdown" 
          ref={dropdownListRef}
        >
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <div
                key={index}
                ref={activity === selectedActivity ? selectedOptionRef : null}
                className={`activity-option ${
                  activity === selectedActivity ? 'selected' : ''
                }`}
                onClick={() => handleSelect(activity)}
              >
                {activity}
              </div>
            ))
          ) : (
            <div className="activity-option" style={{ color: '#999' }}>
              Ничего не найдено
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegistrSelector;
