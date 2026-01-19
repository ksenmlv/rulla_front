import React, { useState, useRef, useEffect, useCallback } from 'react';
import './RegistrSelector.css';

const RegistrSelector = ({
  subject = [],           // string[] или { title: string, items: string[] }[]
  placeholder = 'Выберите услугу...',
  selected = '',
  onSelect,
  multiple = false,
  maxSelect = Infinity,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');           // single mode
  const [realSearchValue, setRealSearchValue] = useState('');   // multiple mode search
  const [showScrollbar, setShowScrollbar] = useState(false);

  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedList, setSelectedList] = useState([]);

  const dropdownRef = useRef(null);
  const dropdownListRef = useRef(null);
  const selectedOptionRef = useRef(null);
  const scrollThumbRef = useRef(null);
  const scrollTrackRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  // Определяем тип данных
  const isGrouped =
    Array.isArray(subject) &&
    subject.length > 0 &&
    subject[0] != null &&
    typeof subject[0] === 'object' &&
    !Array.isArray(subject[0]) &&
    'title' in subject[0];

  // Все элементы для фильтрации и проверки
  const allItems = isGrouped ? subject.flatMap(g => Array.isArray(g.items) ? g.items : []) : Array.isArray(subject) ? subject : []
  

  // --------------------------- INIT & SYNC -----------------------------------
  useEffect(() => {
    if (multiple) {
      setSelectedList(Array.isArray(selected) ? selected : []);
    } else {
      const val = typeof selected === 'string' ? selected : '';
      setSelectedActivity(val);
      setSearchValue(val);
    }
  }, [selected, multiple]);

  // Закрытие по клику вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        if (!multiple && !allItems.includes(searchValue)) {
          setSearchValue(selectedActivity || '');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchValue, selectedActivity, allItems, multiple]);

  // -------------------------- SCROLL THUMB UPDATE ----------------------------
  const updateScrollThumb = useCallback(() => {
    if (!dropdownListRef.current || !scrollThumbRef.current || !scrollTrackRef.current) return;

    const content = dropdownListRef.current;
    const thumb = scrollThumbRef.current;
    const track = scrollTrackRef.current;

    const scrollTop = content.scrollTop;
    const scrollHeight = content.scrollHeight;
    const clientHeight = content.clientHeight;

    const scrollable = scrollHeight - clientHeight;

    if (scrollable <= 0) {
      // контент не скроллится → скрываем или сбрасываем thumb
      thumb.style.height = '0px';
      thumb.style.opacity = '0';
      return;
    }

    // Реальная высота трека (динамическая!)
    const trackHeight = track.clientHeight;

    // Высота ползунка пропорциональна видимой области
    const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 30); // минимум 30px

    // Позиция
    const progress = scrollTop / scrollable;
    const maxTranslate = trackHeight - thumbHeight;
    const translateY = progress * maxTranslate;

    // Применяем стили
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.setProperty('--thumb-position', `${translateY}px`);
    thumb.style.opacity = '1';
  }, []);


  useEffect(() => {
    if (isOpen && dropdownListRef.current) {
      updateScrollThumb();
      dropdownListRef.current.addEventListener('scroll', updateScrollThumb);

      // скролл к выбранному (single)
      if (!multiple && selectedActivity && selectedOptionRef.current) {
        setTimeout(() => {
          const el = selectedOptionRef.current;
          const list = dropdownListRef.current;
          if (el && list) {
            list.scrollTop = el.offsetTop - list.offsetTop - 50; // небольшой отступ сверху
            updateScrollThumb();
          }
        }, 100);
      }
    }

    return () => {
      if (dropdownListRef.current) {
        dropdownListRef.current.removeEventListener('scroll', updateScrollThumb);
      }
    };
  }, [isOpen, selectedActivity, multiple, updateScrollThumb]);

  // ---------------------------- DRAG SCROLLBAR -------------------------------
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !dropdownListRef.current || !scrollTrackRef.current) return;
      e.preventDefault();

      const track = scrollTrackRef.current.getBoundingClientRect();
      const list = dropdownListRef.current;
      const scrollable = list.scrollHeight - list.clientHeight;

      const relY = e.clientY - track.top;
      const progress = Math.min(Math.max(relY / track.height, 0), 1);

      list.scrollTop = progress * scrollable;
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleThumbMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleTrackClick = (e) => {
    if (!dropdownListRef.current || !scrollTrackRef.current) return;

    const track = scrollTrackRef.current.getBoundingClientRect();
    const list = dropdownListRef.current;
    const scrollable = list.scrollHeight - list.clientHeight;

    const relY = e.clientY - track.top;
    const progress = Math.min(Math.max(relY / track.height, 0), 1);

    list.scrollTop = progress * scrollable;
  };

  // ----------------------------- INPUT ---------------------------------------
  const handleInputChange = (e) => {
    const val = e.target.value;
    multiple ? setRealSearchValue(val) : setSearchValue(val);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!multiple && selectedActivity) {
      setSearchValue('');
    }
  };

  // --------------------------- FILTERING -------------------------------------
  const searchText = (multiple ? realSearchValue : searchValue || '').trim().toLowerCase();

  const filteredItems = searchText
    ? allItems.filter(item => typeof item === 'string' && item.toLowerCase().includes(searchText))
    : allItems;

  useEffect(() => {
    if (isOpen) {
      setShowScrollbar(filteredItems.length > 5);
    }
  }, [isOpen, filteredItems.length]);

  // --------------------------- SELECTION -------------------------------------
  const handleSelectSingle = (item) => {
    if (onSelect) onSelect(item);
    setSelectedActivity(item);
    setSearchValue(item);
    setIsOpen(false);
  };

  const handleSelectMultiple = (item) => {
    let updated = selectedList.includes(item)
      ? selectedList.filter(i => i !== item)
      : [...selectedList, item];

    if (updated.length > maxSelect) return;

    if (onSelect) onSelect(updated);
    setSelectedList(updated);
    setRealSearchValue('');
  };

  // --------------------------- INPUT VALUE -----------------------------------
  const inputValue = multiple
    ? (isOpen ? realSearchValue : selectedList.join(', '))
    : (isOpen ? searchValue : selectedActivity);

  // --------------------------- RENDER ----------------------------------------
  return (
    <div className="activity-input-container" ref={dropdownRef}>
      <input
        type="text"
        className={`activity-input ${isOpen ? 'active' : ''}`}
        placeholder={placeholder}
        value={inputValue}
        onFocus={handleInputFocus}
        onChange={handleInputChange}
        readOnly={disabled}
        disabled={disabled}
      />

      <div
        className={`arrow ${isOpen ? 'arrow-up' : 'arrow-down'}`}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
      >
        <svg width="20" height="12" viewBox="0 0 12 8" fill="none">
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {isOpen && (
        <div className="dropdown-wrapper">
          <div className="activity-dropdown">

            <div
              className="dropdown-content"
              ref={dropdownListRef}
              style={{ paddingRight: showScrollbar ? '10px' : '0', height: '100%' }}
            >

              {filteredItems.length === 0 ? (
                <div className="activity-option" style={{ color: '#999', padding: '12px' }}>
                  {searchText ? 'Ничего не найдено' : 'Каталог услуг пуст или не загрузился'}
                </div>
              ) : isGrouped ? (
                subject.map((group, groupIdx) => {
                  const visible = Array.isArray(group.items)
                    ? group.items.filter(item =>
                        !searchText || (typeof item === 'string' && item.toLowerCase().includes(searchText))
                      )
                    : [];

                  if (visible.length === 0) return null;

                  return (
                    <React.Fragment key={groupIdx}>
                      <div className="group-header">
                        {group.title || 'Без названия'} ({visible.length})
                      </div>

                      {visible.map((item, idx) => {
                        const isSelected = multiple
                          ? selectedList.includes(item)
                          : item === selectedActivity;

                        const isDisabled = multiple && !isSelected && selectedList.length >= maxSelect;

                        return (
                          <div
                            key={`${groupIdx}-${idx}`}
                            ref={!multiple && isSelected ? selectedOptionRef : null}
                            className={`activity-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                            onClick={() => {
                              if (isDisabled || disabled) return;
                              multiple ? handleSelectMultiple(item) : handleSelectSingle(item);
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px' }}
                          >
                            {multiple && (
                              <div className="custom-checkbox-wrapper">
                                <div className={`custom-checkbox ${isSelected ? 'checked' : ''}`}>
                                  {isSelected && (
                                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                                      <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                </div>
                              </div>
                            )}
                            <span>{item}</span>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = multiple ? selectedList.includes(item) : item === selectedActivity;
                  const isDisabled = multiple && !isSelected && selectedList.length >= maxSelect;

                  return (
                    <div
                      key={index}
                      ref={!multiple && isSelected ? selectedOptionRef : null}
                      className={`activity-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => {
                        if (isDisabled || disabled) return;
                        multiple ? handleSelectMultiple(item) : handleSelectSingle(item);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px' }}
                    >
                      {multiple && (
                        <div className="custom-checkbox-wrapper">
                          <div className={`custom-checkbox ${isSelected ? 'checked' : ''}`}>
                            {isSelected && (
                              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                                <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      )}
                      <span>{item}</span>
                    </div>
                  );
                })
              )}
            </div>

            {showScrollbar && (
              <div className="custom-scrollbar">
                <div
                  className="scroll-track"
                  ref={scrollTrackRef}
                  onClick={handleTrackClick}
                />
                <div
                  className="scroll-thumb"
                  ref={scrollThumbRef}
                  onMouseDown={handleThumbMouseDown}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrSelector;