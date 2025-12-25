import React, { useState, useRef } from 'react';
import './Common.css';
import file_loader from '../../../assets/Main/file_loader.svg';

const FileUpload = ({ onFilesUpload, maxFiles = 10 }) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const updateFiles = (newFiles) => {
    setFiles(newFiles);
    onFilesUpload?.(newFiles);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    let totalFiles = [...files, ...selectedFiles];

    if (totalFiles.length > maxFiles) {
      alert(`Можно загрузить не более ${maxFiles} файлов.`);
      totalFiles = totalFiles.slice(0, maxFiles);
    }

    updateFiles(totalFiles);
    e.target.value = ''; // сбрасываем input
  };

  const handleRemoveFile = (index) => {
    updateFiles(files.filter((_, i) => i !== index));
  };

  const handleClick = () => fileInputRef.current?.click();

  const shortenFileName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    const extIndex = name.lastIndexOf('.');
    const ext = extIndex !== -1 ? name.slice(extIndex) : '';
    const nameWithoutExt = extIndex !== -1 ? name.slice(0, extIndex) : name;
    return nameWithoutExt.slice(0, maxLength - ext.length - 3) + '...' + ext;
  };

  const isImage = (file) => file.type.startsWith('image/');
  const isVideo = (file) => file.type.startsWith('video/');

  return (
    <div className="file-upload-wrapper">
      {/* === Загрузчик === */}
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
        className="file-upload-button"
        onClick={handleClick}
      >
        <div className="file-upload-content">
          <img src={file_loader} alt="Загрузить" className="file-upload-icon" />
          <span className="file-upload-text">
            Загрузить файл{files.length < maxFiles ? '' : ' (максимум достигнут)'}
          </span>
        </div>
      </button>

      {/* === Сетка загруженных файлов (внизу) === */}
      {files.length > 0 && (
        <div className="uploaded-files-grid">
          {files.map((file, index) => (
            <div key={index} className="uploaded-file-item">
              <div className="file-preview">
                {isImage(file) ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="preview-img"
                  />
                ) : isVideo(file) ? (
                  <video className="preview-video">
                    <source src={URL.createObjectURL(file)} />
                  </video>
                ) : (
                  <div className="file-icon">📄</div>
                )}

                <button
                  type="button"
                  className="remove-file-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                >
                  ✕
                </button>
              </div>

              <div className="file-name" title={file.name}>
                {shortenFileName(file.name)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;