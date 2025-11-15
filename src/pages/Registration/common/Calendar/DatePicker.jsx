import React, { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DatePicker.css";
import calendarIcon from "../../../../assets//Main//icon_calendar.png"

export default function CustomDatePicker({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleSelect = (date) => {
    const formatted =
      String(date.getDate()).padStart(2, "0") +
      "." +
      String(date.getMonth() + 1).padStart(2, "0") +
      "." +
      String(date.getFullYear()).slice(2);

    onChange(formatted);
    setOpen(false);
  };

  // закрываем календарь при клике вне его
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="date-picker-wrapper" ref={ref}>
      <input
        className={`date-input ${error ? "date-input--error" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="00.00.00"
      />

      {/* Иконка календаря внутри инпута */}
      <img
        src={calendarIcon}
        alt="calendar"
        className="calendar-icon"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="calendar-popup">
          <Calendar onClickDay={handleSelect} />
        </div>
      )}
    </div>
  );
}
