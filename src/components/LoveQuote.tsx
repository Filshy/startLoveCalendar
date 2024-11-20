import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const quotes = [
  "Ti amo non solo per quello che sei, ma per quello che sono io quando sono con te.",
  "Ogni momento con te è il mio preferito.",
  "Il mio cuore sorride quando penso a te.",
  "Sei il mio posto preferito dove andare quando il mio cervello ha bisogno di una pausa.",
  "Con te, anche i giorni ordinari diventano straordinari.",
  "Sei la mia persona preferita di sempre.",
];

export const LoveQuote = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full md:w-2/3 mx-auto"
    >
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 rounded-lg shadow-lg">
        <p className="text-white text-sm md:text-base font-medium italic text-center">
          "{quote}"
        </p>
      </div>
    </motion.div>
  );
};