import React, { lazy, useEffect, useState } from 'react';
import Select from 'react-select';
import { citiesApi } from '../../api/citiesApi.ts'




// const options = [
//   { value: 'moskva', label: 'Москва' },
//   { value: 'spb', label: 'Санкт-Петербург' },
//   { value: 'ekb', label: 'Екатеринбург' },
// ];

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

const customStyles = {
  container: (baseStyles) => ({
    ...baseStyles,
    width: 'auto',
    minWidth: '150px',
    maxWidth: '300px',
  }),
  control: (baseStyles, state) => ({
    ...baseStyles,
    border: 'none',
    boxShadow: 'none',
    borderRadius: '0',
    minHeight: '40px',
    width: 'auto',
    minWidth: '150px',
    maxWidth: '300px',
    cursor: 'pointer',
    ':hover': {
      border: 'none',
    },
    '@media (max-width: 767px)': {
      minWidth: '120px',
      maxWidth: '200px',
      minHeight: '30px',
    },
  }),
  valueContainer: (baseStyles) => ({
    ...baseStyles,
    padding: '0 8px',
    flexWrap: 'nowrap',
    width: 'auto',
    flex: 'none',
    maxWidth: 'calc(300px - 60px)',
    '@media (max-width: 767px)': {
      padding: '0 4px',
      maxWidth: 'calc(200px - 40px)',
    },
  }),
  singleValue: (baseStyles, state) => ({
    ...baseStyles,
    fontSize: '24px',
    fontWeight: '500',
    color: '#000',
    whiteSpace: 'nowrap', // В основном селекторе оставляем в одну строку
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
  input: (baseStyles) => ({
    ...baseStyles,
    fontSize: '24px',
    fontWeight: '500',
    margin: 0,
    padding: 0,
    width: 'auto',
    maxWidth: '100%',
    '@media (max-width: 767px)': {
      fontSize: '14px',
    },
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    fontSize: '18px',
    fontWeight: '500',
    cursor: 'pointer',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: state.isFocused ? '#ffcc80' : 'white',
    color: state.isFocused ? '#000' : '#000',
    // Включаем перенос слов в выпадающем списке
    whiteSpace: 'normal', // Меняем nowrap на normal для переноса
    wordWrap: 'break-word', // Перенос длинных слов
    overflowWrap: 'break-word', // Современное свойство для переноса
    padding: '10px 12px',
    minHeight: 'auto', // Убираем фиксированную высоту
    lineHeight: '1.3', // Увеличиваем межстрочный интервал для читаемости
    ':active': {
      backgroundColor: '#ffb74d',
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
  clearIndicator: (baseStyles, state) => ({
    ...baseStyles,
    display: state.hasValue && state.isFocused ? 'flex' : 'none',
    cursor: 'pointer',
    color: '#000',
    padding: '0 4px',
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    border: '1px solid #e0e0e0',
    minWidth: '180px',
    maxWidth: '250px',
    width: 'auto',
    '@media (max-width: 767px)': {
      minWidth: '140px',
      maxWidth: '180px',
    },
  }),
  menuList: (baseStyles) => ({
    ...baseStyles,
    padding: 0,
    overflowX: 'hidden',
    '::-webkit-scrollbar': {
      width: '6px',
    },
    '::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '3px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  }),
};


const CustomSelector = () => {
  const [inputValue, setInputValue] = useState('')
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)

  // загрузка городов
  useEffect(() => {
    const fetchCities = async () => {
      try {
        // задержка для избежания 429 ошибки
        await new Promise(resolve => setTimeout(resolve, 1000))

        const dataCities = await citiesApi.getCities()

        if (dataCities && dataCities.success && Array.isArray(dataCities.data)) {
          const formattedCities = dataCities.data.map(city => ({
            value: city.id,
            label: city.name
          }))

          setCities(formattedCities) // сохранение массива городов

          if (formattedCities.length > 0) {
            setSelectedCity(formattedCities[0])
          }
        } else {
          throw new Error('Неверная структура данных городов')
        }
      } catch (err) {
        console.error('Ошибка при загрузке городов:', err)
      }
    }

    fetchCities()
  }, [])

  return (
    <Select
      options={cities}
      value={selectedCity}
      onChange={setSelectedCity}
      styles={customStyles}
      isSearchable={true}
      isClearable={true}
      onInputChange={(value) => setInputValue(value)}
      inputValue={inputValue}
      placeholder="Выберите город..."
      components={{
        DropdownIndicator,
        IndicatorSeparator: () => null,
      }}
      menuPlacement="auto"
    />
  );
};

export default CustomSelector;