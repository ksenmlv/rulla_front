import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { useAppContext } from '../../contexts/AppContext';
import { citiesApi } from '../../api/citiesApi.ts';
import icon_search from '../../assets/Main/icon_search.svg';
import './TownSelector.css';

const TownSelector = () => {
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

  // Геолокация + fallback на Москву
  useEffect(() => {
    if (selectedCity) {
      setGeoLoading(false);
      return;
    }

    const fallbackToMoscow = async () => {
      try {
        const results = await citiesApi.searchCities('Москва');
        const moscow = results.find(c => c.cityName.toLowerCase() === 'москва');
        if (moscow) {
          setSelectedCity({ value: moscow.cityId, label: moscow.cityName });
        }
      } catch (e) {
        console.error('Fallback to Moscow failed:', e);
      } finally {
        setGeoLoading(false);
      }
    };

    if (!navigator.geolocation) {
      fallbackToMoscow();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const city = await citiesApi.getNearestCity(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setSelectedCity({ value: city.id, label: city.name });
        } catch (err) {
          console.warn('Не удалось определить ближайший город:', err);
          fallbackToMoscow();
        }
      },
      (err) => {
        console.warn('Геолокация отклонена:', err.code, err.message);
        fallbackToMoscow();
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  }, [selectedCity, setSelectedCity]);

  // Загрузка всех городов — топ-10 сверху + остальное по алфавиту
  useEffect(() => {
    if (allCities.length > 0 || !isOpen) return;

    const loadAllCities = async () => {
      setLoadingAll(true);
      try {
        const cities = await citiesApi.getAllCities();

        const uniqueMap = new Map();
        cities.forEach(city => {
          if (!uniqueMap.has(city.id)) {
            uniqueMap.set(city.id, { id: city.id, name: city.name });
          }
        });

        const allUniqueCities = Array.from(uniqueMap.values());

        const top10Names = [
          "Москва",
          "Санкт-Петербург",
          "Новосибирск",
          "Екатеринбург",
          "Казань",
          "Нижний Новгород",
          "Челябинск",
          "Красноярск",
          "Самара",
          "Уфа"
        ];

        const top10 = [];
        const top10Set = new Set(top10Names.map(n => n.toLowerCase()));

        allUniqueCities.forEach(city => {
          if (top10Set.has(city.name.toLowerCase())) {
            top10.push(city);
          }
        });

        top10.sort((a, b) => {
          const iA = top10Names.findIndex(n => n.toLowerCase() === a.name.toLowerCase());
          const iB = top10Names.findIndex(n => n.toLowerCase() === b.name.toLowerCase());
          return iA - iB;
        });

        const rest = allUniqueCities
          .filter(c => !top10Set.has(c.name.toLowerCase()))
          .sort((a, b) => a.name.localeCompare(b.name, 'ru'));

        setAllCities([...top10, ...rest]);
      } catch (e) {
        console.error('Ошибка загрузки списка городов:', e);
        setError('Не удалось загрузить список городов');
      } finally {
        setLoadingAll(false);
      }
    };

    loadAllCities();
  }, [isOpen]);

  // Поиск — начинается только с 3 символов (ограничение сервера)
  const performSearch = useCallback(async (query) => {
    const trimmed = query.trim().toLowerCase();

    // Сервер не отдаёт ничего раньше 3 символов
    if (trimmed.length < 3) {
      setSearchResults([]);
      return;
    }

    setLoadingSearch(true);
    setError(null);

    try {
      // Запрашиваем с разумным порогом
      const minScore = trimmed.length <= 4 ? 0.12 : 0.1;
      const rawResults = await citiesApi.searchCities(query.trim(), minScore);

      // Фильтруем только города, которые НАЧИНАЮТСЯ с введённой строки
      const filtered = rawResults.filter(r =>
        r.cityName.toLowerCase().startsWith(trimmed)
      );

      // Дедупликация по названию (оставляем вариант с лучшим score)
      const uniqueMap = new Map();
      filtered.forEach(r => {
        const key = r.cityName.toLowerCase();
        if (!uniqueMap.has(key) || r.score > (uniqueMap.get(key)?.score || 0)) {
          uniqueMap.set(key, {
            id: r.cityId,
            name: r.cityName,
            score: r.score
          });
        }
      });

      // Сортируем: лучший score вверху + алфавит при равенстве
      const deduped = Array.from(uniqueMap.values())
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'ru'));

      setSearchResults(deduped);
    } catch (err) {
      console.error('Ошибка поиска:', err);
      setSearchResults([]);
      // Показываем ошибку только если запрос был осмысленным
      if (trimmed.length >= 3) {
        setError('Ошибка поиска городов');
      }
    } finally {
      setLoadingSearch(false);
    }
  }, []);

  useEffect(() => {
    performSearch(inputValue);
  }, [inputValue, performSearch]);

  const handleCityChange = (city) => {
    setSelectedCity({ value: city.id, label: city.name });
    setInputValue('');
    setHighlightedIndex(-1);
    // меню остаётся открытым
  };

  const displayedCities = useMemo(() => {
    return inputValue.trim() ? searchResults : allCities;
  }, [inputValue, searchResults, allCities]);

  // Прокрутка к выбранному городу при открытии списка
  useEffect(() => {
    if (!isOpen || !simpleBarRef.current || !selectedCity || !listRef.current) return;

    const index = displayedCities.findIndex(c => c.id === selectedCity.value);
    if (index === -1) return;

    const element = listRef.current.children[index];
    if (!element) return;

    const scrollEl = simpleBarRef.current.getScrollElement();
    const itemTop = element.offsetTop;
    const itemHeight = element.offsetHeight;
    const containerHeight = scrollEl.clientHeight;

    const scrollTo = itemTop - (containerHeight / 2) + (itemHeight / 2) - 40;

    scrollEl.scrollTop = Math.max(0, scrollTo);
  }, [isOpen, displayedCities, selectedCity]);

  const handleKeyDown = (e) => {
    if (!isOpen || !displayedCities.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(i => (i + 1) % displayedCities.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(i => (i - 1 + displayedCities.length) % displayedCities.length);
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

  useEffect(() => {
    const handleClickOutside = (e) => {
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
          setIsOpen(prev => {
            const next = !prev;
            if (next) {
              setTimeout(() => inputRef.current?.focus(), 100);
            }
            return next;
          });
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
                <img src={icon_search} alt="Поиск" className="town-selector-search-icon" />
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
                  {inputValue.trim().length < 3
                    ? 'Введите минимум 3 символа'
                    : 'Города не найдены'}
                </div>
              )}
            </div>
          </SimpleBar>
        </div>
      )}
    </div>
  );
};

export default TownSelector;