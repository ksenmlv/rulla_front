import React, { useState, useRef } from 'react';
import './Common.css';
import file_loader from '../../../assets/Main/file_loader.svg';


const FileUpload = ({ onFilesUpload, maxFiles = 1 }) => {
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)

  const updateFiles = (newFiles) => {
    setFiles(newFiles)
    onFilesUpload?.(newFiles)       // уведомляем родителя о новых файлах
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    let totalFiles = [...files, ...selectedFiles]

    if (totalFiles.length > maxFiles) {
      alert(`Можно загрузить не более ${maxFiles} файлов.`)
      totalFiles = totalFiles.slice(0, maxFiles)
    }

    updateFiles(totalFiles)
    e.target.value = ''
  };

  const handleRemoveFile = (index) => {
    updateFiles(files.filter((_, i) => i !== index))
  };

  const handleClick = () => fileInputRef.current?.click()

  const shortenFileName = (name, maxLength = 25) => {
    if (name.length <= maxLength) return name
    const extIndex = name.lastIndexOf('.')
    const ext = extIndex !== -1 ? name.slice(extIndex) : ''
    return name.slice(0, maxLength - ext.length - 3) + '...' + ext
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept=".jpg,.jpeg,.png,.bmp,.webp,.tiff,.tif,.gif,.avif,.heic,.heif,.mp4,.mov,.avi,.mkv,.webm,.m4v"
        style={{ display: 'none' }}
      />

      <button
        type="button"
        className={`file-upload-button ${files.length ? 'uploaded' : ''}`}
        onClick={handleClick}
      >
        {files.length === 0 ? (
          <div className="file-upload-content">
            <img rel='preload' src={file_loader} alt="File loader" className="file-upload-icon" />
            <span className="file-upload-text">Загрузить файл</span>
          </div>
        ) : (
          <div className="file-list">
            {files.map((file, index) => (
              <div key={index} className="file-name" title={file.name} style={{position: 'relative'}}>
                  <span className="file-name-icon">📄</span>
                  <span className="file-name-text">{shortenFileName(file.name)}</span>

                  <div 
                    className="file-remove-inside"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                  > ✕ </div>

              </div>
            ))}
            {files.length < maxFiles && <span className="add-more-text">Добавить ещё файл</span>}
          </div>
        )}
      </button>
    </div>
  );
};

export default FileUpload;
