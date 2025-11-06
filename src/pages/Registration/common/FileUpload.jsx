import React, { useState, useRef } from 'react';
import './Common.css'
import file_loader from '../../../assets/Main/file_loader.svg'

const FileUpload = () => {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
        style={{ display: 'none' }}
      />
      <button 
        type="button" 
        className="file-upload-button"
        onClick={handleButtonClick}
      >
        <div className="file-upload-content">
          <img src={file_loader} alt='File loader' className="file-upload-icon" />
          <span className="file-upload-text">Загрузить файл</span>
          {fileName && (
            <div className="file-name">
              Выбран файл: {fileName}
            </div>
          )}
        </div>
      </button>
    </div>
  );
};

export default FileUpload;