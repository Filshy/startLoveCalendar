import React from 'react';
import { Calendar, Clock, Heart, MapPin, Star, Trash2 } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface ActivityCardProps {
  activity: {
    id: string;
    title: string;
    date: Date;
    location?: string;
    type: string;
    isFavorite: boolean;
  };
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onDelete, onToggleFavorite }) => {
  const timeUntil = formatDistance(activity.date, new Date(), { addSuffix: true });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{activity.title}</h3>
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">{timeUntil}</span>
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
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleFavorite(activity.id)}
            className={`p-2 rounded-full transition-colors ${
              activity.isFavorite
                ? 'text-pink-500 bg-pink-100 dark:bg-pink-900'
                : 'text-gray-400 hover:text-pink-500 bg-gray-100 dark:bg-gray-700'
            }`}
          >
            <Star className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            className="p-2 rounded-full text-gray-400 hover:text-red-500 bg-gray-100 dark:bg-gray-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};