import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { ActivityCard } from './ActivityCard';
import { AddActivityModal } from './AddActivityModal';
import { Calendar } from './Calendar';
import { SharedFeed } from './SharedFeed';
import { MilestoneTimeline } from './MilestoneTimeline';
import { LoveQuote } from './LoveQuote';
import { Moon, Sun, Plus, LogOut, Calendar as CalendarIcon, Heart, Users, Clock, FileText, Palette, Camera } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import confetti from 'react-confetti';
import { Notes } from './Notes';
import { UpcomingEvents } from './UpcomingEvents';
import { Memories } from './Memories';

export const Dashboard = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'calendar' | 'cards' | 'shared' | 'timeline' | 'notes' | 'memories'>('calendar');
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'activities'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activitiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate()
      }));
      setActivities(activitiesData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddActivity = async (activityData: any) => {
    try {
      await addDoc(collection(db, 'activities'), {
        ...activityData,
        userId: user?.uid,
        userEmail: user?.email,
        createdAt: new Date()
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success('Attività aggiunta con successo!');
    } catch (error) {
      toast.error('Errore nel salvataggio dell\'attività');
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'activities', id));
      toast.success('Attività eliminata');
    } catch (error) {
      toast.error('Errore nell\'eliminazione dell\'attività');
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const activity = activities.find(a => a.id === id);
    if (!activity) return;

    try {
      await updateDoc(doc(db, 'activities', id), {
        isFavorite: !activity.isFavorite
      });
      toast.success(activity.isFavorite ? 'Rimosso dai preferiti' : 'Aggiunto ai preferiti');
    } catch (error) {
      toast.error('Errore nell\'aggiornamento dei preferiti');
    }
  };

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'love')[] = ['light', 'dark', 'love'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <div className={`min-h-screen ${theme}`}>
      {showConfetti && <confetti />}
      
      <div className={`min-h-screen ${
        theme === 'love' 
          ? 'bg-gradient-to-br from-red-100 via-pink-100 to-purple-100 dark:from-red-900 dark:via-pink-900 dark:to-purple-900'
          : 'bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900'
      }`}>
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400">Together</h1>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Palette className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => auth.signOut()}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4 overflow-x-auto pb-2">
                <button
                  onClick={() => setView('calendar')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap ${
                    view === 'calendar'
                      ? 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <CalendarIcon className="h-5 w-5" />
                  <span>Calendario</span>
                </button>
                
                <button
                  onClick={() => setView('shared')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap ${
                    view === 'shared'
                      ? 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Condivisi</span>
                </button>
                
                <button
                  onClick={() => setView('timeline')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap ${
                    view === 'timeline'
                      ? 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Clock className="h-5 w-5" />
                  <span>Timeline</span>
                </button>
                
                <button
                  onClick={() => setView('notes')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap ${
                    view === 'notes'
                      ? 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span>Note</span>
                </button>

                <button
                  onClick={() => setView('memories')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap ${
                    view === 'memories'
                      ? 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Camera className="h-5 w-5" />
                  <span>Ricordi</span>
                </button>
              </div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nuova Attività
              </button> </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <LoveQuote />
              {view === 'calendar' && <UpcomingEvents activities={activities} />}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
            </div>
          ) : (
            <div className="space-y-6">
              {view === 'calendar' && <Calendar activities={activities} />}
              {view === 'shared' && (
                <SharedFeed
                  activities={activities}
                  currentUser={user}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
              {view === 'timeline' && <MilestoneTimeline activities={activities} />}
              {view === 'notes' && <Notes />}
              {view === 'memories' && <Memories />}
            </div>
          )}
        </main>

        <AddActivityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddActivity}
        />
      </div>
    </div>
  );
};