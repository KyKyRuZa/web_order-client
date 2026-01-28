import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import '../styles/SimpleFileUpload.css';

export const SimpleFileUpload = ({ onFilesSelected, maxFiles = 5 }) => {
  const [files, setFiles] = useState([]);

  // Helper function to generate unique IDs
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  const { showToast } = useToast();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length === 0) return;

    // Check if adding these files exceeds the max count
    if (files.length + selectedFiles.length > maxFiles) {
      showToast(`Можно загрузить не более ${maxFiles} файлов`, 'error');
      return;
    }

    // Process each selected file
    const newFiles = selectedFiles.map(file => ({
      id: generateId(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type
    }));

    // Add new files to the existing files
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    
    // Notify parent component about the new files
    onFilesSelected && onFilesSelected(updatedFiles);
    
    // Show success message
    if (selectedFiles.length === 1) {
      showToast(`Файл ${selectedFiles[0].name} добавлен`, 'success');
    } else {
      showToast(`${selectedFiles.length} файла(ов) добавлено`, 'success');
    }
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    onFilesSelected && onFilesSelected(updatedFiles);
    showToast('Файл удален', 'info');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="simple-file-upload">
      <div className="file-upload-area">
        <input
          type="file"
          id="simple-file-upload"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="simple-file-upload" className="file-upload-label">
          <div className="upload-icon">📎</div>
          <p>Прикрепить файлы</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="selected-files-list">
          <h4>Выбранные файлы ({files.length}/{maxFiles})</h4>
          <ul>
            {files.map((fileObj) => (
              <li key={fileObj.id} className="file-item">
                <div className="file-info">
                  <span className="file-name">{fileObj.name}</span>
                  <span className="file-size">({formatFileSize(fileObj.size)})</span>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => {
                    const index = files.findIndex(f => f.id === fileObj.id);
                    removeFile(index);
                  }}
                  type="button"
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