import React, { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DatePicker.css";
import calendarIcon from "../../../../assets/Main/icon_calendar.png";

export default function CustomDatePicker({ value, onChange, placeholder = "00.00.00", error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Форматирование даты при выборе из календаря
  const handleSelect = (date) => {
    const formatted =
      String(date.getDate()).padStart(2, "0") +
      "." +
      String(date.getMonth() + 1).padStart(2, "0") +
      "." +
      String(date.getFullYear()).slice(4);

    onChange(formatted);
    setOpen(false);
  };

  // Закрытие календаря при клике вне
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Маска ввода (как в Step3Passport)
  const handleInputChange = (e) => {
    let inputValue = e.target.value.replace(/\D/g, '').slice(0, 8); // только цифры, макс 6
    let formatted = inputValue;

    if (inputValue.length > 4) {
      formatted = inputValue.slice(0, 2) + '.' + inputValue.slice(2, 4) + '.' + inputValue.slice(4);
    } else if (inputValue.length > 2) {
      formatted = inputValue.slice(0, 2) + '.' + inputValue.slice(2);
    }

    onChange(formatted);
  };

  const formatNavigationLabel = ({ date, view }) => {
    if (view === 'month') {
      const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    return '';
  };

  return (
    <div className="date-picker-wrapper" ref={ref}>
      <input
        className={`date-input ${error ? "date-input--error" : ""}`}
        value={value}
        onChange={handleInputChange} // ← теперь маска работает
        placeholder={placeholder}
        maxLength={10}
      />

      <img
        src={calendarIcon}
        alt="календарь"
        className="calendar-icon"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="calendar-popup" style={{ top: '-335px' }}>
          <Calendar
            onClickDay={handleSelect}
            className="custom-calendar"
            maxDetail="month"
            minDetail="month"
            navigationLabel={formatNavigationLabel}
            onClickNav={undefined}
            prevLabel="‹"
            nextLabel="›"
            view="month"
            showNeighboringMonth={false}
          />
        </div>
      )}
    </div>
  );
}