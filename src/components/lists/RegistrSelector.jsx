import React, { useState, useRef, useEffect, useCallback } from 'react';
import './RegistrSelector.css';

const RegistrSelector = ({
  subject = [], // string[] или { title: string, items: string[] }[]
  placeholder = 'Выберите услугу...',
  selected = '',
  onSelect,
  multiple = false,
  maxSelect = Infinity,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(''); // single mode
  const [realSearchValue, setRealSearchValue] = useState(''); // multiple mode search
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedList, setSelectedList] = useState([]);
  
  // Состояние для отслеживания открытых/закрытых групп
  const [expandedGroups, setExpandedGroups] = useState({});
  
  // Состояние для текущей активной группы (стики-заголовок)
  const [activeStickyGroup, setActiveStickyGroup] = useState(null);
  
  // Состояние для категории, из которой выбрана услуга
  const [selectedCategoryByService, setSelectedCategoryByService] = useState(null);
  
  const dropdownRef = useRef(null);
  const dropdownListRef = useRef(null);
  const selectedOptionRef = useRef(null);
  const scrollThumbRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const groupHeadersRef = useRef({});
  const [isDragging, setIsDragging] = useState(false);

  // Определяем тип данных
  const isGrouped = Array.isArray(subject) && subject.length > 0 && 
                    subject[0] != null && typeof subject[0] === 'object' && 
                    !Array.isArray(subject[0]) && 'title' in subject[0];

  // Все элементы для фильтрации и проверки
  const allItems = isGrouped 
    ? subject.flatMap(g => Array.isArray(g.items) ? g.items : []) 
    : Array.isArray(subject) ? subject : [];

  // --------------------------- INIT & SYNC -----------------------------------
  useEffect(() => {
    if (multiple) {
      setSelectedList(Array.isArray(selected) ? selected : []);
    } else {
      const val = typeof selected === 'string' ? selected : '';
      setSelectedActivity(val);
      setSearchValue(val);
      
      // Определяем категорию для выбранной услуги
      if (isGrouped && val) {
        let categoryIndex = null;
        subject.forEach((group, index) => {
          if (Array.isArray(group.items) && group.items.includes(val)) {
            categoryIndex = index;
          }
        });
        setSelectedCategoryByService(categoryIndex);
      }
    }
    
    // Инициализация всех групп как открытых
    if (isGrouped) {
      const initialExpanded = {};
      subject.forEach((group, index) => {
        initialExpanded[index] = true;
      });
      setExpandedGroups(initialExpanded);
    }
  }, [selected, multiple, subject, isGrouped]);

  // --------------------------- SCROLL OBSERVER -------------------------------
  useEffect(() => {
    if (!isOpen || !isGrouped || !dropdownListRef.current) return;

    const listElement = dropdownListRef.current;
    const groupElements = groupHeadersRef.current;

    const handleScroll = () => {
      const scrollTop = listElement.scrollTop;
      const listRect = listElement.getBoundingClientRect();
      
      // Находим текущую видимую группу
      let currentGroup = null;
      let maxBottom = -Infinity;
      
      Object.entries(groupElements).forEach(([index, element]) => {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const relativeTop = rect.top - listRect.top + scrollTop;
        
        // Если элемент находится в видимой области или выше нее
        if (relativeTop <= scrollTop + 50 && relativeTop > maxBottom) {
          currentGroup = parseInt(index);
          maxBottom = relativeTop;
        }
      });
      
      setActiveStickyGroup(currentGroup);
    };

    listElement.addEventListener('scroll', handleScroll);
    // Инициализируем при открытии
    setTimeout(handleScroll, 100);
    
    return () => {
      listElement.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, isGrouped, subject]);

  // Функция для переключения видимости группы
  const toggleGroup = (groupIndex, e) => {
    if (e) {
      e.stopPropagation();
    }
    setExpandedGroups(prev => ({
      ...prev,
      [groupIndex]: !prev[groupIndex]
    }));
  };

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
      thumb.style.height = '0px';
      thumb.style.opacity = '0';
      return;
    }
    
    const trackHeight = track.clientHeight;
    const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 30);
    const progress = scrollTop / scrollable;
    const maxTranslate = trackHeight - thumbHeight;
    const translateY = progress * maxTranslate;
    
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.setProperty('--thumb-position', `${translateY}px`);
    thumb.style.opacity = '1';
  }, []);

  useEffect(() => {
    if (isOpen && dropdownListRef.current) {
      updateScrollThumb();
      dropdownListRef.current.addEventListener('scroll', updateScrollThumb);
      
      if (!multiple && selectedActivity && selectedOptionRef.current) {
        setTimeout(() => {
          const el = selectedOptionRef.current;
          const list = dropdownListRef.current;
          if (el && list) {
            list.scrollTop = el.offsetTop - list.offsetTop - 50;
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
    
    // Определяем категорию для выбранной услуги
    if (isGrouped) {
      let categoryIndex = null;
      subject.forEach((group, index) => {
        if (Array.isArray(group.items) && group.items.includes(item)) {
          categoryIndex = index;
        }
      });
      setSelectedCategoryByService(categoryIndex);
    }
    
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
              {/* Стики-заголовок (фиксированный сверху) */}
              {isGrouped && activeStickyGroup !== null && (
                <div 
                  className="sticky-group-header"
                >
                  <div 
                    className={`group-header ${selectedCategoryByService === activeStickyGroup ? 'selected-group' : ''}`}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      margin: '0 15px 8px 15px',
                      borderRadius: '8px',
                      border: '1px solid #02283D',
                      backgroundColor: selectedCategoryByService === activeStickyGroup ? '#02283D' : 'transparent',
                      color: selectedCategoryByService === activeStickyGroup ? 'white' : '#02283D',
                      fontWeight: 500,
                      fontSize: '16px',
                    }}
                  >
                    <span>
                      {subject[activeStickyGroup]?.title || 'Без названия'}
                    </span>
                    <span 
                      onClick={(e) => toggleGroup(activeStickyGroup, e)}
                      style={{ 
                        fontSize: '16px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                      }}
                    >
                      {expandedGroups[activeStickyGroup] ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
              )}
              
              {filteredItems.length === 0 ? (
                <div className="activity-option" style={{ 
                  color: '#999', 
                  padding: '12px',
                  margin: '0 15px',
                }}>
                  {searchText ? 'Ничего не найдено' : 'Каталог услуг пуст или не загрузился'}
                </div>
              ) : isGrouped ? (
                subject.map((group, groupIdx) => {
                  // Фильтруем элементы группы по поиску
                  const visibleItems = Array.isArray(group.items) 
                    ? group.items.filter(item => 
                        !searchText || (typeof item === 'string' && item.toLowerCase().includes(searchText))
                      )
                    : [];
                  
                  // Если нет видимых элементов и есть поиск - скрываем группу
                  if (visibleItems.length === 0 && searchText) return null;
                  
                  const isGroupExpanded = expandedGroups[groupIdx] && !searchText;
                  const isGroupSelected = selectedCategoryByService === groupIdx;
                  
                  return (
                    <React.Fragment key={groupIdx}>
                      {/* Обычный заголовок группы (не стики) */}
                      {(!searchText || visibleItems.length > 0) && (
                        <div 
                          ref={el => groupHeadersRef.current[groupIdx] = el}
                          className={`group-header ${isGroupSelected ? 'selected-group' : ''}`}
                          style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #02283D',
                            backgroundColor: isGroupSelected ? '#02283D' : 'transparent',
                            color: isGroupSelected ? 'white' : '#02283D',
                            fontWeight: 500,
                            fontSize: '16px',
                            position: 'relative',
                            margin: groupIdx === 0 ? '0 15px 8px 15px' : '8px 15px 8px 15px',
                          }}
                        >
                          <span>
                            {group.title || 'Без названия'} 
                            {!searchText && ` (${visibleItems.length})`}
                          </span>
                          {!searchText && (
                            <span 
                              onClick={(e) => toggleGroup(groupIdx, e)}
                              style={{ 
                                fontSize: '16px',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                backgroundColor: 'transparent',
                              }}
                            >
                              {isGroupExpanded ? '▲' : '▼'}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Показываем элементы группы только если она раскрыта или идет поиск */}
                      {(isGroupExpanded || searchText) && visibleItems.map((item, idx) => {
                        const isSelected = multiple ? selectedList.includes(item) : item === selectedActivity;
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
                            style={{
                              padding: '8px 15px',
                              margin: '0 15px',
                              borderRadius: '0',
                            }}
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
                            <span style={{ marginLeft: multiple ? '10px' : '0' }}>{item}</span>
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
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '8px 15px',
                        margin: '0 15px',
                      }}
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
                      <span style={{ marginLeft: multiple ? '10px' : '0' }}>{item}</span>
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