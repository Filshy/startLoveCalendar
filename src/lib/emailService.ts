import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendActivityReminder = async (activity: any) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: activity.userEmail,
      subject: `Promemoria: ${activity.title}`,
      html: `
        <h2>Promemoria Attività</h2>
        <p>Non dimenticare la tua attività programmata per oggi:</p>
        <h3>${activity.title}</h3>
        <p><strong>Data:</strong> ${activity.date.toLocaleString('it-IT')}</p>
        ${activity.location ? `<p><strong>Luogo:</strong> ${activity.location}</p>` : ''}
        <p><strong>Tipo:</strong> ${activity.type}</p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error);
  }
};

export const checkAndSendReminders = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const activitiesRef = collection(db, 'activities');
  const q = query(
    activitiesRef,
    where('date', '>=', today),
    where('date', '<', tomorrow)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const activity = { id: doc.id, ...doc.data() };
    sendActivityReminder(activity);
  });
};