import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { applicationsAPI } from '../api';
import '../styles/FileUpload.css';

export const FileUpload = ({ applicationId, onFileUploaded, initialFiles = [] }) => {
  const [files, setFiles] = useState(initialFiles);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length === 0) return;

    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const fileData = {
          file: file,
          category: 'document', // по умолчанию
          description: file.name
        };

        try {
          const result = await applicationsAPI.uploadFile(applicationId, fileData);
          
          if (result.success) {
            setFiles(prev => [...prev, result.data.file]);
            onFileUploaded && onFileUploaded(result.data.file);
            showToast(`Файл ${file.name} успешно загружен`, 'success');
          } else {
            showToast(`Ошибка загрузки файла ${file.name}: ${result.message}`, 'error');
          }
        } catch (err) {
          console.error(`Upload error for ${file.name}:`, err);
          showToast(`Ошибка загрузки файла ${file.name}`, 'error');
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
      showToast('Ошибка загрузки файлов', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (droppedFiles.length === 0) return;

    setUploading(true);

    try {
      for (const file of droppedFiles) {
        const fileData = {
          file: file,
          category: 'document',
          description: file.name
        };

        try {
          const result = await applicationsAPI.uploadFile(applicationId, fileData);
          
          if (result.success) {
            setFiles(prev => [...prev, result.data.file]);
            onFileUploaded && onFileUploaded(result.data.file);
            showToast(`Файл ${file.name} успешно загружен`, 'success');
          } else {
            showToast(`Ошибка загрузки файла ${file.name}: ${result.message}`, 'error');
          }
        } catch (err) {
          console.error(`Upload error for ${file.name}:`, err);
          showToast(`Ошибка загрузки файла ${file.name}`, 'error');
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
      showToast('Ошибка загрузки файлов', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = async (fileId) => {
    try {
      const result = await applicationsAPI.deleteFile(fileId);
      
      if (result.success) {
        setFiles(prev => prev.filter(file => file.id !== fileId));
        showToast('Файл успешно удален', 'success');
      } else {
        showToast(result.message || 'Ошибка удаления файла', 'error');
      }
    } catch (error) {
      console.error('File deletion error:', error);
      showToast('Ошибка удаления файла', 'error');
    }
  };

  return (
    <div className="file-upload-container">
      <div
        className="file-upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          id="file-upload"
          data-testid="file-upload-input"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
        />
        <label htmlFor="file-upload" className="file-upload-label">
          <div className="file-upload-icon">📁</div>
          <p>
            {uploading ? 'Загрузка файлов...' : 'Перетащите файлы сюда или нажмите для выбора'}
          </p>
          <small className="file-upload-hint">Поддерживаются все типы файлов</small>
        </label>
      </div>

      {files.length > 0 && (
        <div className="uploaded-files-list">
          <h4>Загруженные файлы</h4>
          <ul>
            {files.map((file) => (
              <li key={file.id} className="uploaded-file-item">
                <div className="file-info">
                  <span className="file-name">{file.original_name}</span>
                  <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button
                  className="file-remove-btn"
                  onClick={() => removeFile(file.id)}
                  disabled={uploading}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};