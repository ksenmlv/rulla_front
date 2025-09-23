import React, { useState } from 'react';
import Select from 'react-select';

const options = [
  { value: 'moskva', label: 'Москва' },
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'ekb', label: 'Екатеринбург' },
];

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
  control: (baseStyles, state) => ({
    ...baseStyles,
    border: 'none',
    boxShadow: 'none',
    borderRadius: '0',
    minHeight: '40px',
    width: state.selectProps.menuIsOpen ? 'auto' : 'fit-content',
    minWidth: '200px',
    maxWidth: '300px',
    cursor: 'pointer',
    ':hover': {
      border: 'none',
    },
    '@media (max-width: 320px)': {
      minWidth: '120px',
      maxWidth: '150px',
      minHeight: '30px',
    },
  }),
  valueContainer: (baseStyles) => ({
    ...baseStyles,
    padding: '0 8px',
    flexWrap: 'nowrap',
    '@media (max-width: 320px)': {
      padding: '0 4px',
    },
  }),
  singleValue: (baseStyles) => ({
    ...baseStyles,
    fontSize: '24px',
    fontWeight: '500',
    color: '#000',
    whiteSpace: 'nowrap',
    '@media (max-width: 320px)': {
      fontSize: '14px',
    },
  }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    fontSize: '24px',
    fontWeight: '500',
    '@media (max-width: 320px)': {
      fontSize: '14px',
    },
  }),
  input: (baseStyles) => ({
    ...baseStyles,
    fontSize: '24px',
    fontWeight: '500',
    '@media (max-width: 320px)': {
      fontSize: '14px',
    },
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    fontSize: '24px',
    fontWeight: '500',
    cursor: 'pointer',
    backgroundColor: state.isFocused ? '#ffcc80' : 'white',
    color: state.isFocused ? '#000' : '#000',
    ':active': {
      backgroundColor: '#ffb74d',
    },
    '@media (max-width: 320px)': {
      fontSize: '14px',
      padding: '8px 12px',
    },
  }),
  indicatorsContainer: (baseStyles) => ({
    ...baseStyles,
    padding: '0',
    '@media (max-width: 320px)': {
      transform: 'scale(0.8)',
    },
  }),
  dropdownIndicator: (baseStyles) => ({
    ...baseStyles,
    padding: '0 8px',
    color: '#000',
    '@media (max-width: 320px)': {
      padding: '0 4px',
    },
  }),
  clearIndicator: (baseStyles, state) => ({
    ...baseStyles,
    display: state.hasValue && state.isFocused ? 'flex' : 'none',
    cursor: 'pointer',
    color: '#000',
    '@media (max-width: 320px)': {
      transform: 'scale(0.8)',
    },
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    '@media (max-width: 320px)': {
      width: '200px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
  }),
  menuList: (baseStyles) => ({
    ...baseStyles,
    '@media (max-width: 320px)': {
      padding: '5px 0',
    },
  }),
};

const CustomSelector = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Select
      options={options}
      defaultValue={options[0]}
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