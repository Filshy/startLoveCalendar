import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Calendar, Clock } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface SharedFeedProps {
  activities: any[];
  currentUser: any;
  onToggleFavorite: (id: string) => void;
}

export const SharedFeed: React.FC<SharedFeedProps> = ({ activities, currentUser, onToggleFavorite }) => {
  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {activity.userEmail?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.userEmail}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {activity.title}
                  </h3>
                </div>
              </div>
              {activity.userId !== currentUser?.uid && (
                <button
                  onClick={() => onToggleFavorite(activity.id)}
                  className={`p-2 rounded-full transition-colors ${
                    activity.isFavorite
                      ? 'text-pink-500 bg-pink-100 dark:bg-pink-900'
                      : 'text-gray-400 hover:text-pink-500 bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {formatDistance(activity.date, new Date(), { addSuffix: true })}
                </span>
              </div>
              {activity.location && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{activity.location}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">{activity.type}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};