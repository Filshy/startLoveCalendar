import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion } from 'framer-motion';

interface CalendarProps {
  activities: any[];
}

export const Calendar: React.FC<CalendarProps> = ({ activities }) => {
  const events = activities.map(activity => ({
    id: activity.id,
    title: activity.title,
    start: activity.date,
    backgroundColor: getEventColor(activity.type),
    borderColor: getEventColor(activity.type),
  }));

  function getEventColor(type: string) {
    switch (type.toLowerCase()) {
      case 'date':
        return '#ec4899';
      case 'trip':
        return '#8b5cf6';
      case 'event':
        return '#06b6d4';
      case 'surprise':
        return '#f59e0b';
      default:
        return '#ec4899';
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="calendar-container"
    >
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        height="auto"
        eventClick={(info) => {
          const activity = activities.find(a => a.id === info.event.id);
          if (activity) {
            const date = new Date(activity.date);
            alert(`
              ${activity.title}
              📍 ${activity.location || 'No location specified'}
              📅 ${date.toLocaleDateString()}
              🕒 ${date.toLocaleTimeString()}
            `);
          }
        }}
      />
    </motion.div>
  );
};