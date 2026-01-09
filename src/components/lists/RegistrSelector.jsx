import React, { useState, useRef, useEffect, useCallback } from 'react';
import './RegistrSelector.css';

const RegistrSelector = ({
  subject = [],
  placeholder,
  selected,
  onSelect,
  multiple = false,
  maxSelect = Infinity
}) => {

  const [isOpen, setIsOpen] = useState(false);

  const [searchValue, setSearchValue] = useState('');          // single mode (строка)
  const [realSearchValue, setRealSearchValue] = useState('');  // multiple mode (строка поиска)
  const [showScrollbar, setShowScrollbar] = useState(false);

  const [selectedActivity, setSelectedActivity] = useState(''); // single: строка
  const [selectedList, setSelectedList] = useState([]);         // multiple: массив строк

  const dropdownRef = useRef(null);
  const dropdownListRef = useRef(null);
  const selectedOptionRef = useRef(null);
  const scrollThumbRef = useRef(null);
  const scrollTrackRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  // --------------------------- INIT & SYNC -----------------------------------
  useEffect(() => {
    if (multiple) {
      setSelectedList(Array.isArray(selected) ? selected : []);
    } else {
      setSelectedActivity(typeof selected === 'string' ? selected : '');
      setSearchValue(typeof selected === 'string' ? selected : '');
    }
  }, [selected, multiple]);

  // Закрытие при клике вне области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);

        if (!multiple && !subject.includes(searchValue)) {
          setSearchValue(selectedActivity || '');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchValue, selectedActivity, subject, multiple]);

  // -------------------------- SCROLL THUMB UPDATE ----------------------------
  const updateScrollThumb = useCallback(() => {
    if (!dropdownListRef.current || !scrollThumbRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = dropdownListRef.current;
    const scrollableHeight = scrollHeight - clientHeight;

    if (scrollableHeight > 0) {
      const progress = scrollTop / scrollableHeight;
      const trackHeight = 195;
      const thumbHeight = 60;
      const maxTranslate = trackHeight - thumbHeight;
      const translateY = progress * maxTranslate;

      scrollThumbRef.current.style.setProperty('--thumb-position', `${translateY}px`);
    } else {
      scrollThumbRef.current.style.setProperty('--thumb-position', '0px');
    }
  }, []);

  useEffect(() => {
    if (isOpen && dropdownListRef.current) {
      updateScrollThumb();
      dropdownListRef.current.addEventListener('scroll', updateScrollThumb);

      if (!multiple && selectedActivity && selectedOptionRef.current) {
        setTimeout(() => {
          const dropdown = dropdownListRef.current;
          const selectedElement = selectedOptionRef.current;

          if (dropdown && selectedElement) {
            dropdown.scrollTop = selectedElement.offsetTop - dropdown.offsetTop;
            updateScrollThumb();
          }
        }, 0);
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

      const track = scrollTrackRef.current;
      const trackRect = track.getBoundingClientRect();

      const dropdown = dropdownListRef.current;
      const { scrollHeight, clientHeight } = dropdown;
      const scrollableHeight = scrollHeight - clientHeight;

      const mouseY = e.clientY;
      const relativeY = mouseY - trackRect.top;
      const progress = (relativeY / trackRect.height) * 100;
      const clampedProgress = Math.min(Math.max(progress, 0), 100);

      dropdown.scrollTop = (clampedProgress / 100) * scrollableHeight;
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

    const track = scrollTrackRef.current;
    const trackRect = track.getBoundingClientRect();

    const dropdown = dropdownListRef.current;
    const { scrollHeight, clientHeight } = dropdown;
    const scrollableHeight = scrollHeight - clientHeight;

    const mouseY = e.clientY;
    const relativeY = mouseY - trackRect.top;
    const progress = (relativeY / trackRect.height) * 100;
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    dropdown.scrollTop = (clampedProgress / 100) * scrollableHeight;
  };

  // ----------------------------- INPUT LOGIC ---------------------------------
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (multiple) {
      setRealSearchValue(value);
    } else {
      setSearchValue(value);
    }
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!multiple && selectedActivity) {
      setSearchValue('');
    }
  };

  // ----------------------------- FILTERED DATA -------------------------------
  const filteredSubject = multiple
    ? (realSearchValue && typeof realSearchValue === 'string'
        ? subject.filter(item =>
            typeof item === 'string' && item.toLowerCase().startsWith(realSearchValue.toLowerCase())
          )
        : subject)
    : (searchValue && typeof searchValue === 'string'
        ? subject.filter(item =>
            typeof item === 'string' && item.toLowerCase().startsWith(searchValue.toLowerCase())
          )
        : subject);

  useEffect(() => {
    if (isOpen) {
      setShowScrollbar(filteredSubject.length > 4);
    }
  }, [isOpen, filteredSubject.length]);

  // ----------------------------- SELECTION -----------------------------------
  const handleSelectSingle = (item) => {
    if (onSelect) onSelect(item);
    setSelectedActivity(item);
    setSearchValue(item);
    setIsOpen(false);
  };

  const handleSelectMultiple = (item) => {
    let updated;

    if (selectedList.includes(item)) {
      updated = selectedList.filter(i => i !== item);
    } else {
      if (selectedList.length >= maxSelect) return;
      updated = [...selectedList, item];
    }

    if (onSelect) onSelect(updated);
    setSelectedList(updated);
    setRealSearchValue('');
  };

  // ------------------------------ INPUT VALUE --------------------------------
  const inputValue = multiple
    ? (isOpen ? realSearchValue : selectedList.join(', '))
    : (isOpen ? searchValue : selectedActivity);

  // ------------------------------ RENDER -------------------------------------
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
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {isOpen && (
        <div className="dropdown-wrapper">
          <div className="activity-dropdown">

            <div
              className="dropdown-content"
              ref={dropdownListRef}
              style={{ paddingRight: '10px' }}
            >

              {filteredSubject.length > 0 ? (
                filteredSubject.map((item, index) => {
                  const isSelected = multiple ? selectedList.includes(item) : item === selectedActivity;
                  const isDisabled = multiple && !isSelected && selectedList.length >= maxSelect;

                  return (
                    <div
                      key={index}
                      ref={!multiple && isSelected ? selectedOptionRef : null}
                      className={`activity-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => {
                        if (isDisabled) return;
                        multiple ? handleSelectMultiple(item) : handleSelectSingle(item);
                      }}
                      style={{ display: 'flex', gap: '10px' }}
                    >

                      {multiple && (
                        <div className="custom-checkbox-wrapper">
                          <div className={`custom-checkbox ${isSelected ? 'checked' : ''}`}>
                            {isSelected && (
                              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="check-icon">
                                <path
                                  d="M1 5L5 9L13 1"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      )}

                      {item}
                    </div>
                  );
                })
              ) : (
                <div className="activity-option" style={{ color: '#999' }}>
                  Ничего не найдено
                </div>
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