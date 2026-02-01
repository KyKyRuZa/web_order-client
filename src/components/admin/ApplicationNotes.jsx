import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { notesAPI } from '../../api';
import { FontAwesomeIcon } from '../utils/FontAwesomeIcon';
import { Button } from '../utils/Button';
import '../../styles/ApplicationNotes.css';

export const ApplicationNotes = ({ applicationId }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  // Типы заметок
  const noteTypes = user.role === 'client' ? [
    { value: 'comment', label: 'Комментарий' }
  ] : [
    { value: 'comment', label: 'Комментарий' },
    { value: 'internal', label: 'Внутренняя заметка' },
    { value: 'system', label: 'Системная заметка' },
    { value: 'change_log', label: 'Изменение статуса' }
  ];

  const [selectedNoteType, setSelectedNoteType] = useState(user.role === 'client' ? 'comment' : 'comment');

  // Загрузка заметок
  useEffect(() => {
    if (applicationId) {
      loadNotes();
    }
  }, [applicationId]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getNotesByApplication(applicationId);

      if (response.success) {
        // Сортировка заметок по дате создания (новые первыми)
        const sortedNotes = response.data.notes.sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        );
        setNotes(sortedNotes);
      } else {
        showToast(response.message || 'Ошибка загрузки заметок', 'error');
      }
    } catch (error) {
      console.error('Load notes error:', error);
      showToast('Ошибка загрузки заметок', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Создание новой заметки
  const handleCreateNote = async (e) => {
    e.preventDefault();

    if (!newNote.trim()) {
      showToast('Введите текст заметки', 'error');
      return;
    }

    setSaving(true);

    try {
      const noteData = {
        content: newNote,
        noteType: selectedNoteType
      };

      const response = await notesAPI.createNote(applicationId, noteData);

      if (response.success) {
        setNewNote('');
        // Добавляем новую заметку в начало списка
        setNotes(prev => [response.data.note, ...prev]);
        showToast('Заметка успешно добавлена', 'success');
      } else {
        showToast(response.message || 'Ошибка создания заметки', 'error');
      }
    } catch (error) {
      console.error('Create note error:', error);
      showToast('Ошибка создания заметки', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Обновление заметки
  const handleUpdateNote = async (noteId, updatedContent) => {
    try {
      const response = await notesAPI.updateNote(noteId, { content: updatedContent });

      if (response.success) {
        setNotes(prev => prev.map(note =>
          note.id === noteId ? { ...note, ...response.data.note } : note
        ));
        showToast('Заметка успешно обновлена', 'success');
        setExpandedNoteId(null);
      } else {
        showToast(response.message || 'Ошибка обновления заметки', 'error');
      }
    } catch (error) {
      console.error('Update note error:', error);
      showToast('Ошибка обновления заметки', 'error');
    }
  };

  // Удаление заметки
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту заметку?')) {
      return;
    }

    try {
      const response = await notesAPI.deleteNote(noteId);

      if (response.success) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
        showToast('Заметка успешно удалена', 'success');
      } else {
        showToast(response.message || 'Ошибка удаления заметки', 'error');
      }
    } catch (error) {
      console.error('Delete note error:', error);
      showToast('Ошибка удаления заметки', 'error');
    }
  };

  // Переключение закрепления заметки
  const handleTogglePin = async (noteId) => {
    try {
      const response = await notesAPI.togglePin(noteId);

      if (response.success) {
        setNotes(prev => prev.map(note =>
          note.id === noteId ? { ...note, ...response.data.note } : note
        ));
        showToast(response.data.note.is_pinned ? 'Заметка закреплена' : 'Заметка откреплена', 'info');
      } else {
        showToast(response.message || 'Ошибка изменения статуса закрепления', 'error');
      }
    } catch (error) {
      console.error('Toggle pin error:', error);
      showToast('Ошибка изменения статуса закрепления', 'error');
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    try {
      // Проверяем, является ли dateString валидной датой
      if (!dateString) {
        return 'Нет даты';
      }

      // Попробуем создать объект даты
      const date = new Date(dateString);

      // Проверим, является ли дата валидной
      if (isNaN(date.getTime())) {
        console.error('Invalid date value:', dateString);
        return 'Неверная дата';
      }

      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Ошибка даты';
    }
  };

  if (loading) {
    return (
      <div className="notes-section">
        <div className="notes-loading">
          <FontAwesomeIcon icon="spinner" spin />
          <span>Загрузка заметок...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-section">
      <div className="notes-header">
        <h3>Заметки</h3>
        <span className="notes-count">({notes.length})</span>
      </div>

      {/* Форма добавления новой заметки */}
      <form className="note-form" onSubmit={handleCreateNote}>
        <div className="note-input-row">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Добавить заметку..."
            rows="3"
            className="note-textarea"
          />
        </div>
        
        <div className="note-controls">
          <select
            value={selectedNoteType}
            onChange={(e) => setSelectedNoteType(e.target.value)}
            className="note-type-select"
          >
            {noteTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={saving}
            disabled={!newNote.trim()}
          >
            Добавить
          </Button>
        </div>
      </form>

      {/* Список заметок */}
      <div className="notes-list">
        {notes.length === 0 ? (
          <div className="no-notes">
            <FontAwesomeIcon icon="sticky-note" />
            <p>Пока нет заметок</p>
          </div>
        ) : (
          notes.map(note => (
            <div 
              key={note.id} 
              className={`note-item ${note.is_pinned ? 'pinned' : ''} ${expandedNoteId === note.id ? 'expanded' : ''}`}
            >
              <div className="note-header">
                <div className="note-author-info">
                  {note.is_pinned && (
                    <span className="pinned-indicator" title="Закреплено">
                      <FontAwesomeIcon icon="thumbtack" />
                    </span>
                  )}
                  <span className="note-author">{note.author?.fullName || 'Неизвестный автор'}</span>
                  <span className="note-type-badge">{noteTypes.find(t => t.value === note.note_type)?.label}</span>
                </div>
                
                <div className="note-timestamp">
                  {formatDate(note.createdAt)}
                </div>
              </div>
              
              <div className="note-content">
                {expandedNoteId === note.id ? (
                  <textarea
                    defaultValue={note.content}
                    onBlur={(e) => handleUpdateNote(note.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleUpdateNote(note.id, e.target.value);
                      }
                    }}
                    className="note-edit-textarea"
                    rows="4"
                  />
                ) : (
                  <div 
                    className="note-display-content"
                    onClick={() => {
                      // Разрешаем редактирование только менеджерам, администраторам и владельцам комментариев
                      if (user.role === 'manager' || user.role === 'admin' || user.role === 'super_admin' ||
                          (user.role === 'client' && note.author?.id === user.id && note.note_type === 'comment')) {
                        setExpandedNoteId(note.id);
                      }
                    }}
                  >
                    {note.content}
                  </div>
                )}
              </div>
              
              <div className="note-actions">
                {(user.role === 'manager' || user.role === 'admin' || user.role === 'super_admin') && (
                  <>
                    <button
                      className={`action-btn ${note.is_pinned ? 'pinned' : ''}`}
                      onClick={() => handleTogglePin(note.id)}
                      title={note.is_pinned ? 'Открепить' : 'Закрепить'}
                    >
                      <FontAwesomeIcon icon="thumbtack" rotation={note.is_pinned ? 90 : undefined} />
                    </button>

                    <button
                      className="action-btn"
                      onClick={() => setExpandedNoteId(note.id)}
                      title="Редактировать"
                    >
                      <FontAwesomeIcon icon="edit" />
                    </button>

                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteNote(note.id)}
                      title="Удалить"
                    >
                      <FontAwesomeIcon icon="trash" />
                    </button>
                  </>
                )}
                {user.role === 'client' && note.author?.id === user.id && (
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteNote(note.id)}
                    title="Удалить"
                  >
                    <FontAwesomeIcon icon="trash" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};