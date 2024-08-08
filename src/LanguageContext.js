import React, { createContext, useState, useEffect } from "react";
import i18n from "./i18n";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const changeLanguage = (language) => {
    setLang(language);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, content: i18n.t }}>
      {children}
    </LanguageContext.Provider>
  );
};
