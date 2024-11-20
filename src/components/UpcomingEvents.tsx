import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface UpcomingEventsProps {
  activities: any[];
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ activities }) => {
  const upcomingActivities = activities
    .filter(activity => activity.date > new Date())
    .sort((a, b) => a.date - b.date)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Prossimi Eventi
      </h3>
      <div className="space-y-4">
        {upcomingActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-pink-500" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(activity.date, { addSuffix: true, locale: it })}
              </p>
              {activity.location && (
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  {activity.location}
                </div>
              )}
            </div>
          </div>
        ))}
        {upcomingActivities.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Nessun evento in programma
          </p>
        )}
      </div>
    </motion.div>
  );
};