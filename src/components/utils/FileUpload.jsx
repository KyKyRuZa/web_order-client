import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { applicationsAPI } from '../../api';
import '../../styles/FileUpload.css';

export const FileUpload = ({ onFilesSelected, maxFiles = 5, applicationId, initialFiles = [] }) => {
  const [files, setFiles] = useState(initialFiles.map(file => ({
    ...file,
    id: file.id || file.fileId || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: file.original_name || file.filename || file.name,
    isExisting: true // Помечаем, что файл уже существует на сервере
  })));

  // Обновляем файлы при изменении initialFiles (например, при загрузке данных при редактировании)
  useEffect(() => {
    setFiles(initialFiles.map(file => ({
      ...file,
      id: file.id || file.fileId || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.original_name || file.filename || file.name,
      isExisting: true // Помечаем, что файл уже существует на сервере
    })));
  }, [initialFiles]);

  // Helper function to generate unique IDs
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  const { showToast } = useToast();

  const handleFileChange = async (e) => {
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
      type: file.type,
      isExisting: false // Новый файл, еще не загружен на сервер
    }));

    // Add new files to the existing files
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    // Notify parent component about the new files
    onFilesSelected && onFilesSelected(updatedFiles);

    // If applicationId is provided, upload files to server
    if (applicationId) {
      for (const fileObj of newFiles) {
        try {
          const response = await applicationsAPI.uploadFile(applicationId, {
            file: fileObj.file,
            description: fileObj.name
          });

          if (response.success) {
            // Update the file object with server response, ensuring the server ID is preserved
            setFiles(prevFiles =>
              prevFiles.map(f =>
                f.id === fileObj.id ? {
                  ...f,
                  ...response.data.file,
                  id: response.data.file.id, // Use the server-generated ID
                  isExisting: true
                } : f
              )
            );

            showToast(`Файл ${fileObj.name} успешно загружен`, 'success');
          } else {
            throw new Error(response.message || 'Ошибка загрузки файла');
          }
        } catch (error) {
          console.error('File upload error:', error);

          // Remove the failed file from the list
          setFiles(prevFiles => prevFiles.filter(f => f.id !== fileObj.id));

          showToast(`Ошибка загрузки файла ${fileObj.name}: ${error.message}`, 'error');
        }
      }
    } else {
      // Show success message for local addition only
      if (selectedFiles.length === 1) {
        showToast(`Файл ${selectedFiles[0].name} добавлен`, 'success');
      } else {
        showToast(`${selectedFiles.length} файла(ов) добавлено`, 'success');
      }
    }
  };

  const removeFile = async (indexToRemove) => {
    const fileToRemove = files[indexToRemove];

    if (fileToRemove.isExisting && applicationId) {
      // If it's an existing file and we have applicationId, try to delete from server
      try {
        // We need the actual file ID from the server to delete it
        // The fileToRemove should have an id property that corresponds to the server file ID
        if (fileToRemove.id) {
          const response = await applicationsAPI.deleteFile(fileToRemove.id);

          if (response.success) {
            const updatedFiles = files.filter((_, index) => index !== indexToRemove);
            setFiles(updatedFiles);
            onFilesSelected && onFilesSelected(updatedFiles);
            showToast(`Файл ${fileToRemove.name || 'Файл'} удален`, 'info');
          } else {
            throw new Error(response.message || 'Ошибка удаления файла');
          }
        } else {
          // If no server ID, just remove from local state
          const updatedFiles = files.filter((_, index) => index !== indexToRemove);
          setFiles(updatedFiles);
          onFilesSelected && onFilesSelected(updatedFiles);
          showToast(`Файл ${fileToRemove.name || 'Файл'} удален`, 'info');
        }
      } catch (error) {
        console.error('File deletion error:', error);
        // Show more specific error message
        if (error.response?.status === 404) {
          showToast(`Файл не найден на сервере, удален локально`, 'warning');
          // Still remove from local state if file doesn't exist on server
          const updatedFiles = files.filter((_, index) => index !== indexToRemove);
          setFiles(updatedFiles);
          onFilesSelected && onFilesSelected(updatedFiles);
        } else {
          showToast(`Ошибка удаления файла: ${error.message || error}`, 'error');
        }
      }
    } else {
      // Just remove from local state
      const updatedFiles = files.filter((_, index) => index !== indexToRemove);
      setFiles(updatedFiles);
      onFilesSelected && onFilesSelected(updatedFiles);
      showToast(`Файл ${fileToRemove.name || 'Файл'} удален`, 'info');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="file-upload">
      <div className="file-upload-area">
        <label htmlFor="file-upload" className="file-upload-label">
          <p>Прикрепить файлы</p>
        </label>
        <input
          type="file"
          id="file-upload"
          multiple
          onChange={handleFileChange}
        />
        
      </div>

      {files.length > 0 && (
        <div className="selected-files-list">
          <h4>Выбранные файлы ({files.length}/{maxFiles})</h4>
          <ul>
            {files.map((fileObj) => (
              <li key={fileObj.id} className={`file-item ${fileObj.isExisting ? 'existing-file' : 'new-file'}`}>
                <div className="file-info">
                  <span className="file-name">{fileObj.original_name || fileObj.name || 'Файл'}</span>
                  <span className="file-size">({formatFileSize(fileObj.size)})</span>
                  {fileObj.isExisting && <span className="file-status">(загружен)</span>}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => {
                    const index = files.findIndex(f => f.id === fileObj.id);
                    removeFile(index);
                  }}
                  type="button"
                  title="Удалить файл"
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