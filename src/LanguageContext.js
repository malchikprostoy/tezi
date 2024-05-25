import React, { createContext, useState, useEffect } from 'react';
import Translation from './Data.json';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('tr');
  const [content, setContent] = useState(Translation.tr);

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setLang(savedLang);
      setContent(Translation[savedLang]);
    }
  }, []);

  const changeLanguage = (selectedLang) => {
    setLang(selectedLang);
    setContent(Translation[selectedLang]);
    localStorage.setItem('language', selectedLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, content, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
