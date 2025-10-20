import React, { useEffect, useState, useRef } from 'react';
import Select, { components } from 'react-select';
import { citiesApi } from '../../api/citiesApi.ts';
import { useAppContext } from '../../contexts/AppContext.js';
import icon_search from '../../assets/Main/icon_search.svg'


const DropdownIndicator = (props) => {
  const { innerProps } = props;
  return (
    <div {...innerProps}>
      <span style={{
        border: 'solid black',
        borderWidth: '0 2px 2px 0',
        display: 'inline-block',
        padding: '3px',
        transform: 'rotate(45deg)',
        transition: 'transform 0.2s ease'
      }} />
    </div>
  );
};

// Компонент для меню с поиском
const CustomMenu = (props) => {
  const inputRef = useRef(null);

  // Фокусируемся на поле ввода при открытии меню
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);


  return (
    <components.Menu {...props}>
      <div>
        {/* Поле поиска вверху меню */}
        <div style={{
          padding: '15px 15px 0 15px',
          backgroundColor: 'white',
          position: 'sticky', 
          top: 0, 
          zIndex: 10,
          borderRadius: '15px',
        }}>
          <div style={{
            position: 'relative',
            width: '398px',
          }}>
            <img 
              src={icon_search} alt='Поиск'
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
              type="text"
              placeholder="Найти город"
              value={props.selectProps.inputValue}
              onChange={(e) => props.selectProps.onInputChange(e.target.value, { action: 'input-change' })}
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
                e.target.style.borderColor = '#DE5A2B';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
        {/* Список опций */}
        {props.children}
      </div>
    </components.Menu>
  );
};

const customStyles = {
  container: (baseStyles) => ({
    ...baseStyles,
    width: 'auto',
    minWidth: '150px',
    maxWidth: '400px',
  }),
  control: (baseStyles, state) => ({
    ...baseStyles,
    border: 'none',
    boxShadow: 'none',
    borderRadius: '0',
    minHeight: '40px',
    width: 'auto',
    minWidth: '150px',
    maxWidth: '400px',
    cursor: 'pointer',
    ':hover': {
      border: 'none',
    },
    '@media (max-width: 767px)': {
      minWidth: '120px',
      maxWidth: '250px',
      minHeight: '30px',
    },
  }),
  valueContainer: (baseStyles) => ({
    ...baseStyles,
    padding: '0 8px',
    flexWrap: 'nowrap',
    width: 'auto',
    flex: 'none',
    maxWidth: 'calc(400px - 60px)',
    '@media (max-width: 767px)': {
      padding: '0 4px',
      maxWidth: 'calc(250px - 40px)',
    },
  }),
  singleValue: (baseStyles, state) => ({
    ...baseStyles,
    fontSize: '24px',
    fontWeight: '500',
    color: '#000',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    '@media (max-width: 767px)': {
      fontSize: '14px',
    },
  }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    fontSize: '24px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '@media (max-width: 767px)': {
      fontSize: '14px',
    },
  }),
  // Скрываем стандартное поле ввода
  input: (baseStyles) => ({
    ...baseStyles,
    fontSize: '24px',
    fontWeight: '500',
    margin: 0,
    padding: 0,
    width: '0',
    maxWidth: '0',
    opacity: 0,
    '@media (max-width: 767px)': {
      fontSize: '14px',
    },
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    fontSize: '20px',
    fontWeight: state.isSelected ? '800' : '500',
    cursor: 'pointer',
    backgroundColor: state.isFocused ? '#DE5A2B99' : 'white',
    color: state.isSelected ? '#DE5A2B' : '#000',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    padding: '10px 15px',
    minHeight: 'auto',
    lineHeight: '1.3',
    borderRadius: state.isFocused ? '7px' : '0',
    margin: '2px 7px 2px 15px',
    width: '398px', // Фиксированная ширина, как у поля ввода
    ':active': {
      backgroundColor: '#DE5A2B',
      borderRadius: '7px',
    },
    ':last-child': {
      borderBottom: 'none',
    },
    '@media (max-width: 767px)': {
      fontSize: '14px',
      padding: '8px 10px',
      lineHeight: '1.2',
    },
  }),
  indicatorsContainer: (baseStyles) => ({
    ...baseStyles,
    padding: '0 8px 0 0',
    flexShrink: 0,
    '@media (max-width: 767px)': {
      padding: '0 4px 0 0',
    },
  }),
  dropdownIndicator: (baseStyles) => ({
    ...baseStyles,
    padding: '0 4px',
    color: '#000',
    '@media (max-width: 767px)': {
      padding: '0 2px',
    },
  }),
  // Убираем крестик (clear indicator)
  clearIndicator: () => ({
    display: 'none',
  }),

  menu: (baseStyles) => ({
  ...baseStyles,
  border: '2px solid #DE5A2B',
  borderRadius: '15px',
  width: '450px',
  right: '0',
  left: 'auto',
  backgroundColor: 'white',
  marginTop: '5px',
  overflow: 'visible',

  '@media (max-width: 767px)': {
    width: '300px',
  },
}),

menuList: (baseStyles) => ({
  ...baseStyles,
  paddingTop: '5px',
  paddingBottom: '20px',
  margin: 0,
  maxHeight: '300px',
  overflowY: 'auto',
  overflowX: 'hidden',

  // --- стилизация самого скроллбара ---
  scrollbarWidth: 'thin',
  scrollbarColor: '#ECA288 transparent',

  '::-webkit-scrollbar': {
    width: '6px',
  },
  '::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '::-webkit-scrollbar-thumb': {
    backgroundColor: '#ECA288',
    borderRadius: '20px',
    minHeight: '50px',
  },
  '::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#c94f26',
  },
  // вот это убирает стрелочки
  '::-webkit-scrollbar-button': {
    display: 'none',
    width: 0,
    height: 0,
  },
}),



};

const CustomSelector = () => {
  const [inputValue, setInputValue] = useState('');
  const [cities, setCities] = useState([]);
  const { selectedCity, setSelectedCity } = useAppContext();

  const formatCityName = (cityName) => {
    if (!cityName) return '';
    return cityName.split(',')[0].trim();
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setInputValue(''); // Очищаем поиск при выборе
  };

  const formatOptionLabel = ({ value, label }, { context }) => {
    if (context === 'value') {
      return formatCityName(label);
    }
    return label;
  };

  // Функция для кастомного сообщения когда нет вариантов
  const noOptionsMessage = ({ inputValue }) => {
    if (inputValue) {
      return "Нет совпадений";
    }
    return "Введите название города";
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const dataCities = await citiesApi.getCities();
        if (dataCities && dataCities.success && Array.isArray(dataCities.data)) {
          const formattedCities = dataCities.data.map(city => ({
            value: city.id,
            label: city.name
          }));
          setCities(formattedCities);
          if (formattedCities.length > 0) {
            setSelectedCity(formattedCities[0]);
          }
        } else {
          throw new Error('Неверная структура данных городов');
        }
      } catch (err) {
        console.error('Ошибка при загрузке городов:', err);
      }
    };
    fetchCities();
  }, []);

  return (
    <Select
      options={cities}
      value={selectedCity}
      onChange={handleCityChange}
      styles={customStyles}
      isSearchable={true}
      isClearable={true} // Отключаем возможность очистки (убирает крестик)
      onInputChange={(value) => setInputValue(value)}
      inputValue={inputValue}
      placeholder="Выберите город..."
      components={{
        DropdownIndicator,
        IndicatorSeparator: () => null,
        Menu: CustomMenu,
      }}
      menuPlacement="auto"
      formatOptionLabel={formatOptionLabel}
      noOptionsMessage={noOptionsMessage}
    />
  );
};

export default CustomSelector;

