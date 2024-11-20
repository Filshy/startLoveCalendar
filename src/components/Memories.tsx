import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { Camera, Heart, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

export const Memories = () => {
  const [memories, setMemories] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const q = query(
      collection(db, 'memories'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setMemories(memoriesData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !imageUrl.trim()) return;

    try {
      await addDoc(collection(db, 'memories'), {
        description,
        imageUrl,
        userId: user?.uid,
        userEmail: user?.email,
        createdAt: new Date(),
        likes: []
      });
      setDescription('');
      setImageUrl('');
      toast.success('Ricordo aggiunto con successo!');
    } catch (error) {
      toast.error('Errore nel salvataggio del ricordo');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">I Nostri Ricordi</h2>
        
        <form onSubmit={handleAddMemory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL Immagine
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://esempio.com/immagine.jpg"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrizione
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Racconta questo momento speciale..."
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <Upload className="h-5 w-5 mr-2" />
            Condividi Ricordo
          </button>
        </form>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {memories.map((memory, index) => (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={memory.imageUrl}
              alt="Ricordo"
              className="w-full h-48 object-cover"
            />
            
            <div className="p-4">
              <p className="text-gray-900 dark:text-white mb-2">{memory.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{memory.userEmail}</span>
                <span>{formatDistanceToNow(memory.createdAt, { addSuffix: true, locale: it })}</span>
              </div>
              
              <button className="mt-3 inline-flex items-center text-pink-600 hover:text-pink-500">
                <Heart className="h-5 w-5 mr-1" />
                <span>{memory.likes?.length || 0}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};