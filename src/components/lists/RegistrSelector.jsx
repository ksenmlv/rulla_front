import React, { useState, useRef, useEffect } from 'react';
import './RegistrSelector.css'; 

const RegistrSelector = ({
  subject = [],
  placeholder,
  onSelect,
  multiple = false,      // новый проп
  maxSelect = Infinity   // новый проп
}) => {

  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(''); 

  // для multiple — массив выбранных
  const [selectedList, setSelectedList] = useState([]);

  const dropdownRef = useRef(null);
  const dropdownListRef = useRef(null);
  const selectedOptionRef = useRef(null);

  /** Закрытие dropdown при клике вне */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);

        if (!multiple) {
          if (!subject.includes(searchValue)) {
            setSearchValue(selectedActivity || '');
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchValue, selectedActivity, subject, multiple]);

  /** Прокрутка к выбранному */
  useEffect(() => {
    if (!multiple && isOpen && selectedActivity && dropdownListRef.current && selectedOptionRef.current) {
      setTimeout(() => {
        const dropdown = dropdownListRef.current;
        const selectedElement = selectedOptionRef.current;
        dropdown.scrollTop = selectedElement.offsetTop - dropdown.offsetTop;
      }, 0);
    }
  }, [isOpen, selectedActivity, multiple]);


  /** Обработка выбора */
  const handleSelectSingle = (activity) => {
    setSelectedActivity(activity);
    setSearchValue(activity);
    setIsOpen(false);
    if (onSelect) onSelect(activity);
  };

  const handleSelectMultiple = (activity) => {
    const alreadySelected = selectedList.includes(activity);

    // Снять выбор
    if (alreadySelected) {
      const updated = selectedList.filter((item) => item !== activity);
      setSelectedList(updated);
      if (onSelect) onSelect(updated);
      return;
    }

    // Блокировать, если достигнут лимит
    if (selectedList.length >= maxSelect) return;

    // Добавить
    const updated = [...selectedList, activity];
    setSelectedList(updated);
    if (onSelect) onSelect(updated);
  };


  /** Ввод */
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!multiple && selectedActivity) {
      setSearchValue('');
    }
  };

  /** Фильтрация */
  const filteredActivities = searchValue
    ? subject.filter((activity) =>
        activity.toLowerCase().startsWith(searchValue.toLowerCase())
      )
    : subject;


  /** Текст в input */
  const inputValue = multiple
    ? selectedList.join(', ')
    : (searchValue || selectedActivity);


  return (
    <div className="activity-input-container" ref={dropdownRef}>
      <input
        type="text"
        className={`activity-input ${isOpen ? 'active' : ''}`}
        placeholder={placeholder}
        value={inputValue}
        onFocus={handleInputFocus}
        onChange={handleInputChange}
        readOnly={false}
      />

      <div
        className={`arrow ${isOpen ? 'arrow-up' : 'arrow-down'}`}
        onClick={() => setIsOpen(!isOpen)}
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
        <div className="activity-dropdown" ref={dropdownListRef}>
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => {

              const isSelected = multiple
                ? selectedList.includes(activity)
                : activity === selectedActivity;

              const isDisabled =
                multiple && !isSelected && selectedList.length >= maxSelect;

              return (
                <div
                  key={index}
                  ref={!multiple && isSelected ? selectedOptionRef : null}
                  className={`activity-option ${
                    isSelected ? 'selected' : ''
                  } ${isDisabled ? 'disabled' : ''}`}
                  onClick={() => {
                    if (isDisabled) return;
                    multiple
                      ? handleSelectMultiple(activity)
                      : handleSelectSingle(activity);
                  }}
                  style={{ display: 'flex', gap: '10px' }}
                >

                {multiple && (
                  <div className="custom-checkbox-wrapper">
                    <div className={`custom-checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <div className="inner-square"></div>}
                    </div>
                  </div>
                )}


                  {activity}
                </div>
              );
            })
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
