import React, { useState, useRef } from 'react';
import './Common.css';
import file_loader from '../../../assets/Main/file_loader.svg';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = [...files, ...selectedFiles];

    if (totalFiles.length > 3) {
      alert('Можно загрузить не более 3 файлов.');
      setFiles(totalFiles.slice(0, 3)); // оставляем только первые 3
    } else {
      setFiles(totalFiles);
    }

    e.target.value = ''; // сбрасываем input, чтобы можно было выбрать тот же файл снова при необходимости
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const shortenFileName = (name, maxLength = 25) => {
    if (name.length <= maxLength) return name;
    const extIndex = name.lastIndexOf('.');
    const ext = extIndex !== -1 ? name.slice(extIndex) : '';
    return name.slice(0, maxLength - ext.length - 3) + '...' + ext;
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
        style={{ display: 'none' }}
      />

      <button
        type="button"
        className={`file-upload-button ${files.length > 0 ? 'uploaded' : ''}`}
        onClick={handleButtonClick}
      >
        {files.length === 0 ? (
          <div className="file-upload-content">
            <img src={file_loader} alt="File loader" className="file-upload-icon" />
            <span className="file-upload-text">Загрузить файлы (до 3)</span>
          </div>
        ) : (
          <div className="file-list">
            {files.map((file, index) => (
              <div key={index} className="file-name" title={file.name}>
                <span className="file-name-icon">📄</span>
                <span className="file-name-text">{shortenFileName(file.name)}</span>
                <button
                  type="button"
                  className="file-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            {files.length < 3 && (
              <span className="add-more-text">Добавить ещё файл</span>
            )}
          </div>
        )}
      </button>
    </div>
  );
};

export default FileUpload;
