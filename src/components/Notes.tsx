import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { Trash2, Plus, Edit2, Check, X, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

type NoteTheme = 'classic' | 'romantic' | 'minimal' | 'elegant';

interface Note {
  id: string;
  content: string;
  userId: string;
  userEmail: string;
  createdAt: Date;
  theme: NoteTheme;
}

export const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<NoteTheme>('classic');
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const q = query(
      collection(db, 'notes'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Note[];
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await addDoc(collection(db, 'notes'), {
        content: newNote,
        userId: user?.uid,
        userEmail: user?.email,
        createdAt: new Date(),
        theme: selectedTheme
      });
      setNewNote('');
      toast.success('Nota aggiunta con successo!');
    } catch (error) {
      toast.error('Errore nel salvataggio della nota');
    }
  };

  const handleEditNote = async (id: string) => {
    if (!editContent.trim()) return;

    try {
      await updateDoc(doc(db, 'notes', id), {
        content: editContent
      });
      setEditingNote(null);
      toast.success('Nota aggiornata');
    } catch (error) {
      toast.error('Errore nell\'aggiornamento della nota');
    }
  };

  const handleDeleteNote = async (id: string, userId: string) => {
    if (userId !== user?.uid) {
      toast.error('Puoi eliminare solo le tue note');
      return;
    }

    try {
      await deleteDoc(doc(db, 'notes', id));
      toast.success('Nota eliminata');
    } catch (error) {
      toast.error('Errore nell\'eliminazione della nota');
    }
  };

  const startEditing = (note: Note) => {
    if (note.userId !== user?.uid) {
      toast.error('Puoi modificare solo le tue note');
      return;
    }
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const handleThemeChange = async (noteId: string, newTheme: NoteTheme) => {
    try {
      await updateDoc(doc(db, 'notes', noteId), {
        theme: newTheme
      });
      toast.success('Tema della nota aggiornato');
    } catch (error) {
      toast.error('Errore nell\'aggiornamento del tema');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddNote} className="space-y-4">
        <div className="flex space-x-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Scrivi una nuova nota..."
            className="flex-1 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500"
            rows={4}
          />
          <div className="space-y-2">
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as NoteTheme)}
              className="block w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="classic">Classico</option>
              <option value="romantic">Romantico</option>
              <option value="minimal">Minimal</option>
              <option value="elegant">Elegante</option>
            </select>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Aggiungi
            </button>
          </div>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg shadow relative group note-theme-${note.theme || 'classic'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-pink-500 dark:text-pink-400 font-medium">
                {note.userEmail}
              </span>
              {note.userId === user?.uid && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(note)}
                    className="p-2 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id, note.userId)}
                    className="p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
            {editingNote === note.id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditNote(note.id)}
                    className="p-1 rounded-full text-green-500 hover:bg-green-100 dark:hover:bg-green-900"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditingNote(null)}
                    className="p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap mb-2">
                  {note.content}
                </p>
                {note.userId === user?.uid && (
                  <div className="mt-2">
                    <select
                      value={note.theme || 'classic'}
                      onChange={(e) => handleThemeChange(note.id, e.target.value as NoteTheme)}
                      className="text-xs p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    >
                      <option value="classic">Classico</option>
                      <option value="romantic">Romantico</option>
                      <option value="minimal">Minimal</option>
                      <option value="elegant">Elegante</option>
                    </select>
                  </div>
                )}
              </>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 block mt-2">
              {formatDistanceToNow(note.createdAt, { addSuffix: true, locale: it })}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};