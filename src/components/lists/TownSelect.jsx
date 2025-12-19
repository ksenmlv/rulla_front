import React, { useEffect, useState, useRef, useCallback } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

import { useAppContext } from '../../contexts/AppContext';
import { citiesApi } from '../../api/citiesApi.ts';

import icon_search from '../../assets/Main/icon_search.svg';
import './TownSelector.css';


const CustomSelector = () => {
  const { selectedCity, setSelectedCity } = useAppContext();

  const [inputValue, setInputValue] = useState('');
  

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const [allCities, setAllCities] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [geoLoading, setGeoLoading] = useState(true);
  const [error, setError] = useState(null);

  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const simpleBarRef = useRef(null);

  /* Геолокация */
  useEffect(() => {
    if (selectedCity) {
      setGeoLoading(false);
      return;
    }

    const fallbackToMoscow = async () => {
      try {
        const results = await citiesApi.searchCities('москва');
        const moscow = results.find(
          c => c.cityName.toLowerCase() === 'москва'
        );
        if (moscow) {
          setSelectedCity({ value: moscow.cityId, label: moscow.cityName });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setGeoLoading(false);
      }
    };

    if (!navigator.geolocation) {
      fallbackToMoscow();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const city = await citiesApi.getNearestCity(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setSelectedCity({ value: city.id, label: city.name });
        } catch {
          fallbackToMoscow();
        }
      },
      fallbackToMoscow,
      { timeout: 10000 }
    );
  }, [selectedCity, setSelectedCity]);


  /* Загрузка всех городов */
  useEffect(() => {
    if (allCities.length > 0) return; // уже загружено — не трогаем

    const loadAllCities = async () => {
      setLoadingAll(true);
      try {
        const cities = await citiesApi.getAllCities();

        // Дедупликация по id (на всякий случай)
        const uniqueMap = new Map();
        cities.forEach(city => uniqueMap.set(city.id, city));
        const uniqueCities = Array.from(uniqueMap.values());

        setAllCities(uniqueCities);
      } catch (e) {
        console.error('Ошибка загрузки городов:', e);
        setError('Не удалось загрузить список городов');
      } finally {
        setLoadingAll(false);
      }
    };

    if (isOpen) {
      loadAllCities();
    }
  }, [isOpen, allCities.length]); 


  /* Поиск */
  const performSearch = useCallback(async query => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoadingSearch(true);
    setError(null);

    try {
      // Для коротких запросов снижаем порог релевантности
      const minScore = query.length <= 3 ? 0.05 : 0.1;

      const results = await citiesApi.searchCities(query, minScore);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
      setError('Ошибка поиска');
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }, []);


  /* Запуск поиска при изменении inputValue */
  useEffect(() => {
    performSearch(inputValue);
  }, [inputValue, performSearch]);


  /*  Выбор города */
  const handleCityChange = city => {
    setSelectedCity({
      value: city.id,
      label: city.name,
    });
    setInputValue('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  /* Данные для отображения */
  const displayedCities = React.useMemo(() => {
    let list;

    if (inputValue.trim()) {
      // Поиск — преобразуем в нужный формат
      list = searchResults.map(c => ({ id: c.cityId, name: c.cityName }));
    } else {
      // Полный список
      list = allCities;
    }

    // Финальная дедупликация по id (на всякий случай)
    const uniqueMap = new Map();
    list.forEach(city => uniqueMap.set(city.id, city));

    return Array.from(uniqueMap.values());
  }, [inputValue, searchResults, allCities]);

  /* прокрутка к выбранному городу при открытии меню */
  useEffect(() => {
    if (!isOpen || !simpleBarRef.current || !selectedCity) return;

    const selectedIndex = displayedCities.findIndex(
      city => city.id === selectedCity.value
    );

    if (selectedIndex === -1) return; // выбранный город не в текущем списке

    const listElement = listRef.current;
    if (!listElement) return;

    const itemElement = listElement.children[selectedIndex];
    if (!itemElement) return;

    // Прокручиваем SimpleBar к элементу
    const scrollElement = simpleBarRef.current.getScrollElement();
    scrollElement.scrollTop =
      itemElement.offsetTop - listElement.offsetTop - 50; // -50 для отступа сверху

  }, [isOpen, displayedCities, selectedCity]);

  /*  Клавиатура */
  const handleKeyDown = e => {
    if (!isOpen || !displayedCities.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(i => (i + 1) % displayedCities.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(i =>
          (i - 1 + displayedCities.length) % displayedCities.length
        );
        break;
      case 'Enter':
        if (highlightedIndex >= 0) {
          handleCityChange(displayedCities[highlightedIndex]);
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

  /*  Клик вне */
  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  
  return (
    <div className="town-selector-container" ref={menuRef}>
      <div
        className="town-selector-control"
        onClick={() => {
          setIsOpen(v => !v);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        <div className="town-selector-value">
          {selectedCity
            ? selectedCity.label
            : geoLoading
            ? 'Определение города...'
            : 'Выберите город...'}
        </div>

        <div className={`town-selector-arrow ${isOpen ? 'open' : ''}`}>
          <span />
        </div>
      </div>

      {isOpen && (
        <div className="town-selector-menu">
          <SimpleBar
            className="TownSelector__content"
            ref={simpleBarRef}
            autoHide={false}
            style={{ height: '100%' }}
          >
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
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="town-selector-input"
                />
              </div>
            </div>

            <div className="town-selector-list" ref={listRef}>
              {loadingAll || loadingSearch ? (
                <div className="town-selector-empty">Загрузка...</div>
              ) : error ? (
                <div className="town-selector-empty error">{error}</div>
              ) : displayedCities.length ? (
                displayedCities.map((city, index) => (
                  <div
                    key={city.id}
                    className={
                      'town-selector-item ' +
                      (selectedCity?.value === city.id ? 'selected ' : '') +
                      (highlightedIndex === index ? 'highlighted' : '')
                    }
                    onClick={() => handleCityChange(city)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {city.name}
                  </div>
                ))
              ) : (
                <div className="town-selector-empty">
                  {inputValue ? 'Нет совпадений' : 'Список пуст'}
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
