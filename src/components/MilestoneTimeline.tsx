import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, MapPin } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { it } from 'date-fns/locale';

interface TimelineProps {
  activities: any[];
}

export const MilestoneTimeline: React.FC<TimelineProps> = ({ activities }) => {
  const sortedActivities = [...activities].sort((a, b) => a.date - b.date);

  return (
    <div className="relative space-y-8 before:content-[''] before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-pink-200 dark:before:bg-pink-800">
      {sortedActivities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-12"
        >
          <div className="absolute left-0 p-2 bg-pink-100 dark:bg-pink-900 rounded-full">
            <Heart className="w-4 h-4 text-pink-500" />
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {activity.title}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {activity.userEmail}
              </span>
            </div>
            
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDistance(activity.date, new Date(), { 
                  addSuffix: true,
                  locale: it
                })}
              </div>
              
              {activity.location && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  {activity.location}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};