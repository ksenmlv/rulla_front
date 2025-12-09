import React, { useEffect, useState, useRef } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { useAppContext } from '../../contexts/AppContext.js';
import icon_search from '../../assets/Main/icon_search.svg';
import './TownSelector.css';

const CustomSelector = () => {
  const [inputValue, setInputValue] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const { selectedCity, setSelectedCity } = useAppContext();
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const simpleBarRef = useRef(null);

  // Статичный список городов России
  const staticCities = [
    { value: 1, label: 'Москва' },
    { value: 2, label: 'Санкт-Петербург' },
    { value: 3, label: 'Новосибирск' },
    { value: 4, label: 'Екатеринбург' },
    { value: 5, label: 'Казань' },
    { value: 6, label: 'Нижний Новгород' },
    { value: 7, label: 'Челябинск' },
    { value: 8, label: 'Самара' },
    { value: 9, label: 'Омск' },
    { value: 10, label: 'Ростов-на-Дону' },
    { value: 11, label: 'Уфа' },
    { value: 12, label: 'Красноярск' },
    { value: 13, label: 'Пермь' },
    { value: 14, label: 'Воронеж' },
    { value: 15, label: 'Волгоград' },
    { value: 16, label: 'Краснодар' },
    { value: 17, label: 'Саратов' },
    { value: 18, label: 'Тюмень' },
    { value: 19, label: 'Тольятти' },
    { value: 20, label: 'Ижевск' }
  ];

  // Форматирование названия города
  const formatCityName = (cityName) => {
    if (!cityName) return '';
    return cityName.split(',')[0].trim();
  };

  // Инициализация при первом рендере
  useEffect(() => {
    setFilteredCities(staticCities);
    if (!selectedCity && staticCities.length > 0) {
      setSelectedCity(staticCities[0]); // Москва по умолчанию
    }
  }, []);

  // Фильтрация по вводу
  useEffect(() => {
    if (inputValue) {
      const filtered = staticCities.filter(city =>
        city.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCities(filtered);
      setHighlightedIndex(-1);
    } else {
      setFilteredCities(staticCities);
    }
  }, [inputValue]);

  // Выбор города
  const handleCityChange = (city) => {
    setSelectedCity(city);
    setInputValue('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Навигация клавишами
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((highlightedIndex + 1) % filteredCities.length);
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(
          (highlightedIndex - 1 + filteredCities.length) % filteredCities.length
        );
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

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Скролл к выбранному
  useEffect(() => {
    if (isOpen && simpleBarRef.current && selectedCity) {
      const selectedIndex = filteredCities.findIndex(
        (city) => city.value === selectedCity.value
      );
      if (selectedIndex !== -1) {
        const listNode = listRef.current;
        const selectedNode = listNode.children[selectedIndex];
        if (selectedNode) {
          simpleBarRef.current.getScrollElement().scrollTop =
            selectedNode.offsetTop - listNode.offsetTop;
        }
      }
    }
  }, [isOpen, selectedCity, filteredCities]);

  return (
    <div className="town-selector-container" ref={menuRef}>
      {/* Контрол */}
      <div
        className="town-selector-control"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 0);
          }
        }}
      >
        <div className="town-selector-value">
          {selectedCity ? formatCityName(selectedCity.label) : 'Выберите город...'}
        </div>

        <div className={`town-selector-arrow ${isOpen ? 'open' : ''}`}>
          <span />
        </div>
      </div>

      {/* Меню */}
      {isOpen && (
        <div className="town-selector-menu">
          <SimpleBar
            className="TownSelector__content"
            ref={simpleBarRef}
            autoHide={false}
            style={{ height: '100%' }}
          >
            {/* Поиск */}
            <div className="town-selector-search">
              <div className="town-selector-search-wrapper">
                <img
                  src={icon_search}
                  alt="Поиск"
                  className="town-selector-search-icon"
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Найти город"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="town-selector-input"
                />
              </div>
            </div>

            {/* Список */}
            <div className="town-selector-list" ref={listRef}>
              {filteredCities.length > 0 ? (
                filteredCities.map((city, index) => (
                  <div
                    key={city.value}
                    className={
                      'town-selector-item ' +
                      (selectedCity?.value === city.value ? 'selected ' : '') +
                      (highlightedIndex === index ? 'highlighted' : '')
                    }
                    onClick={() => handleCityChange(city)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {city.label}
                  </div>
                ))
              ) : (
                <div className="town-selector-empty">
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