import React, { useEffect, useState, useRef } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { citiesApi } from '../../api/citiesApi.ts';
import { useAppContext } from '../../contexts/AppContext.js';
import icon_search from '../../assets/Main/icon_search.svg';
import './TownSelector.css';

const CustomSelector = () => {
  const [inputValue, setInputValue] = useState('');
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const { selectedCity, setSelectedCity } = useAppContext();
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const simpleBarRef = useRef(null);


  // Форматирование названия города
  const formatCityName = (cityName) => {
    if (!cityName) return '';
    return cityName.split(',')[0].trim();
  };

  // Загрузка городов
  // useEffect(() => {
  //   const fetchCities = async () => {
  //     try {
  //       const dataCities = await citiesApi.getCities();
  //       if (dataCities && dataCities.success && Array.isArray(dataCities.data)) {
  //         const formattedCities = dataCities.data.map(city => ({
  //           value: city.id,
  //           label: city.name
  //         }));
  //         setCities(formattedCities);
  //         setFilteredCities(formattedCities);
  //         if (formattedCities.length > 0) {
  //           setSelectedCity(formattedCities[0]);
  //         }
  //       }
  //     } catch (err) {
  //       console.error('Ошибка при загрузке городов:', err);
  //     }
  //   };
  //   fetchCities();
  // }, []);

  // Фильтрация городов по вводу
  useEffect(() => {
    if (inputValue) {
      const filtered = cities.filter(city =>
        city.label.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      setFilteredCities(filtered);
      setHighlightedIndex(-1);
    } else {
      setFilteredCities(cities);
    }
  }, [inputValue, cities]);

  // Обработка выбора города
  const handleCityChange = (city) => {
    setSelectedCity(city);
    setInputValue('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Обработка нажатия клавиш
  const handleKeyDown = (e) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (highlightedIndex + 1) % filteredCities.length;
        setHighlightedIndex(nextIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = (highlightedIndex - 1 + filteredCities.length) % filteredCities.length;
        setHighlightedIndex(prevIndex);
        break;
      case 'Enter':
        if (highlightedIndex >= 0) {
          handleCityChange(filteredCities[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  // Логика для прокрутки при открытии меню
  useEffect(() => {
    if (isOpen && simpleBarRef.current && selectedCity) {
      const selectedIndex = filteredCities.findIndex(city => city.value === selectedCity.value);
      if (selectedIndex !== -1) {
        const listNode = listRef.current;
        const selectedNode = listNode.children[selectedIndex];
        if (selectedNode) {
          simpleBarRef.current.getScrollElement().scrollTop = selectedNode.offsetTop - listNode.offsetTop;
        }
      }
    }
  }, [isOpen, selectedCity, filteredCities]);



  return (
    <div
      style={{
        position: 'relative',
        width: 'auto',
        minWidth: '150px',
        maxWidth: '400px',
        fontSize: '24px',
        fontWeight: '500',
        cursor: 'pointer',
      }}
      ref={menuRef}
    >
      {/* Контрол */}
      <div
        style={{
          border: 'none',
          boxShadow: 'none',
          borderRadius: '0',
          minHeight: '40px',
          width: 'auto',
          minWidth: '150px',
          maxWidth: '400px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px',
          backgroundColor: 'transparent',
        }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 0);
          }
        }}
      >
        <div
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 'calc(400px - 60px)',
            marginRight: '15px',
          }}
        >
          {selectedCity ? formatCityName(selectedCity.label) : 'Выберите город...'}
        </div>
        <div
          style={{
            padding: '0 8px 0 0',
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <span
            style={{
              border: 'solid black',
              borderWidth: '0 2px 2px 0',
              display: 'inline-block',
              padding: '3px',
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      </div>

      {/* Меню */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            left: 'auto',
            zIndex: 1000,
            border: '2px solid #DE5A2B',
            borderRadius: '15px',
            width: '450px',
            height: '355px',
            backgroundColor: 'white',
            marginTop: '5px',
            overflow: 'hidden',
          }}
        >
          <SimpleBar 
            className="TownSelector__content"
            ref={simpleBarRef}
            style={{ 
              maxHeight: '350px',
              height: '100%',
            }}
            autoHide={false}
          >
            {/* Поле поиска */}
            <div
              style={{
                padding: '15px 15px 0 15px',
                backgroundColor: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '398px',
                }}
              >
                <img
                  src={icon_search}
                  alt='Поиск'
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: '18px',
                    width: '18px',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Найти город"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: '1px solid #ECA288',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: '#FFF9F7',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#DE5A2B';
                    e.target.style.boxShadow = '0 0 0 2px rgba(222, 90, 43, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ECA288';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Список городов */}
            <div
              ref={listRef}
              style={{
                paddingTop: '5px',
                paddingBottom: '5px',
                margin: 0,
              }}
            >
              {filteredCities.length > 0 ? (
                filteredCities.map((city, index) => (
                  <div
                    key={city.value}
                    style={{
                      fontSize: '20px',
                      fontWeight: selectedCity?.value === city.value ? '700' : '500',
                      cursor: 'pointer',
                      backgroundColor: highlightedIndex === index ? '#F3F3F3' : 'white',
                      color: selectedCity?.value === city.value ? '#DE5A2B' : '#000',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      padding: '10px 15px',
                      lineHeight: '1.3',
                      borderRadius: highlightedIndex === index ? '7px' : '0',
                      margin: '2px 7px 2px 15px',
                      width: '398px',
                      transition: 'background-color 0.2s ease',
                    }}
                    onClick={() => handleCityChange(city)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {city.label}
                  </div>
                ))
              ) : (
                <div style={{ paddingTop: '10px', color: '#666', fontSize: '20px', textAlign: 'center' }}>
                  {inputValue ? 'Нет совпадений' : 'Введите название города'}
                </div>
              )}
            </div>
          </SimpleBar>
        </div>
      )}
    </div>
  );
};

export default CustomSelector;