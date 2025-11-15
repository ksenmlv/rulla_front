import React, { useState, useRef } from 'react';
import './Common.css';
import file_loader from '../../../assets/Main/file_loader.svg';

const FileUpload = ({ onFilesUpload, maxFiles = 1 }) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const updateFiles = (newFiles) => {
    setFiles(newFiles);
    if (onFilesUpload) {
      onFilesUpload(newFiles);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = [...files, ...selectedFiles];

    if (totalFiles.length > maxFiles) {
      alert(`Можно загрузить не более ${maxFiles} файлов.`);
      updateFiles(totalFiles.slice(0, maxFiles));
    } else {
      updateFiles(totalFiles);
    }

    e.target.value = '';
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
    const newFiles = files.filter((_, i) => i !== index);
    updateFiles(newFiles);
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx, .tiff, .tif, .bmp, .webp"
        style={{ display: 'none' }}
      />

      {/* Основная кнопка загрузки */}
      <button
        type="button"
        className={`file-upload-button ${files.length > 0 ? 'uploaded' : ''}`}
        onClick={handleButtonClick}
      >
        {files.length === 0 ? (
          <div className="file-upload-content">
            <img src={file_loader} alt="File loader" className="file-upload-icon" />
            <span className="file-upload-text">Загрузить файл</span>
          </div>
        ) : (
          <div className="file-list">
            {files.map((file, index) => (
              <div key={index} className="file-name" title={file.name}>
                <span className="file-name-icon">📄</span>
                <span className="file-name-text">{shortenFileName(file.name)}</span>
                {/* ЗАМЕНИТЬ button НА div с role="button" */}
                <div
                  role="button"
                  tabIndex={0}
                  className="file-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRemoveFile(index);
                    }
                  }}
                >
                  ✕
                </div>
              </div>
            ))}
            {/* Показываем "Добавить ещё файл" только если файлов меньше максимального количества */}
            {files.length < maxFiles && (
              <span className="add-more-text">Добавить ещё файл</span>
            )}
          </div>
        )}
      </button>
    </div>
  );
};

export default FileUpload;