
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Save,
  X
} from 'lucide-react';

interface Note {
  id: number;  
  title: string;
  content: string;
  dateCreated: string;
  dateModified: string;
}

interface NotesPageProps {
  onBack: () => void;
}

const NotesPage: React.FC<NotesPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: 'ملاحظة جديدة',
      content: '',
      dateCreated: new Date().toISOString().split('T')[0],
      dateModified: new Date().toISOString().split('T')[0]
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote.id);
    setEditingNote(newNote);
    setIsEditing(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote({ ...note });
    setIsEditing(true);
  };

  const handleSaveNote = () => {
    if (editingNote) {
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? { ...editingNote, dateModified: new Date().toISOString().split('T')[0] }
          : note
      ));
      setIsEditing(false);
      setEditingNote(null);
    }
  };

  const handleDeleteNote = (noteId: number) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote === noteId) {
      setSelectedNote(null);
    }
    setIsEditing(false);
    setEditingNote(null);
  };

  const selectedNoteData = selectedNote ? notes.find(note => note.id === selectedNote) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">الملاحظات الآمنة</h1>
            </div>
          </div>
          
          <button
            onClick={handleCreateNote}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>ملاحظة جديدة</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Notes List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في الملاحظات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-right"
                dir="rtl"
              />
            </div>

            {/* Notes List */}
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-20rem)]">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    {searchQuery ? 'لم يتم العثور على ملاحظات' : 'لا توجد ملاحظات بعد'}
                  </p>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedNote === note.id
                        ? 'bg-purple-600/20 border border-purple-600/30'
                        : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <h3 className="text-white font-medium mb-2 truncate text-right" dir="rtl">{note.title}</h3>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2 text-right" dir="rtl">
                      {note.content.substring(0, 100)}...
                    </p>
                    <p className="text-gray-500 text-xs text-right" dir="rtl">
                      آخر تعديل {note.dateModified}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Note Viewer/Editor */}
          <div className="lg:col-span-2">
            {!selectedNote ? (
              <div className="h-full flex items-center justify-center bg-gray-800/30 rounded-xl border border-gray-700">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">اختر ملاحظة</h3>
                  <p className="text-sm text-gray-500">اختر ملاحظة من القائمة لعرضها أو تعديلها</p>
                </div>
              </div>
            ) : isEditing && editingNote ? (
              /* Editor Mode */
              <div className="h-full bg-gray-800/50 rounded-xl border border-gray-700 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <input
                    type="text"
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                    className="text-lg font-semibold text-white bg-transparent border-none outline-none flex-1 text-right"
                    placeholder="عنوان الملاحظة..."
                    dir="rtl"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNote}
                      className="p-2 rounded-lg bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-2 rounded-lg bg-gray-600/20 border border-gray-600/30 text-gray-400 hover:bg-gray-600/30 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <textarea
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  placeholder="ابدأ بكتابة ملاحظتك..."
                  className="flex-1 p-4 bg-transparent text-white border-none outline-none resize-none font-mono text-sm leading-relaxed text-right"
                  dir="rtl"
                />
              </div>
            ) : selectedNoteData ? (
              /* Viewer Mode */
              <div className="h-full bg-gray-800/50 rounded-xl border border-gray-700 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <h2 className="text-lg font-semibold text-white text-right" dir="rtl">{selectedNoteData.title}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditNote(selectedNoteData)}
                      className="p-2 rounded-lg bg-purple-600/20 border border-purple-600/30 text-purple-400 hover:bg-purple-600/30 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(selectedNoteData.id)}
                      className="p-2 rounded-lg bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap text-right" dir="rtl">
                    {selectedNoteData.content || 'لا يوجد محتوى...'}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-700 text-xs text-gray-500 text-right" dir="rtl">
                  تم الإنشاء: {selectedNoteData.dateCreated} | آخر تعديل: {selectedNoteData.dateModified}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
