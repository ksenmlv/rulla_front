import React, { useState } from 'react';
import Select from 'react-select';

const options = [
  { value: 'moskva', label: 'Москва' },
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'ekb', label: 'Екатеринбург' },
];

const DropdownIndicator = (props) => {
  return (
    <div {...props}>
      <span style={{ border: 'solid black', borderWidth: '0 2px 2px 0', display: 'inline-block', padding: '3px', transform: 'rotate(45deg)' }} />
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
    minWidth: '150px',
    maxWidth: '200px',
    cursor: 'pointer',
    ':hover': {
      border: 'none',
    },
  }),
  valueContainer: (baseStyles) => ({
    ...baseStyles,
    padding: '0 8px',
    flexWrap: 'nowrap',
  }),
  singleValue: (baseStyles) => ({
    ...baseStyles,
    fontSize: '24px',
    fontWeight: '500',
    color: '#000',
    whiteSpace: 'nowrap',
  }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    fontSize: '24px',
    fontWeight: '500',
  }),
  input: (baseStyles) => ({
    ...baseStyles,
    fontSize: '24px',
    fontWeight: '500',
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
  }),
  indicatorsContainer: (baseStyles) => ({
    ...baseStyles,
    padding: '0',
  }),
  dropdownIndicator: (baseStyles) => ({
    ...baseStyles,
    padding: '0 8px',
    color: '#000',
  }),
  clearIndicator: (baseStyles, state) => ({
    ...baseStyles,
    display: state.hasValue && state.isFocused ? 'flex' : 'none',
    cursor: 'pointer',
    color: '#000',
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
    />
  );
};

export default CustomSelector;
