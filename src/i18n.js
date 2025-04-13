import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Импортируйте ваши переводы
import translationEN from "./components/language/en/en.json";
import translationRU from "./components/language/ru/ru.json";
import translationKG from "./components/language/kg/kg.json";
import translationTR from "./components/language/tr/tr.json";

const savedLanguage = localStorage.getItem("language") || "tr";

const resources = {
  en: {
    translation: translationEN,
  },
  ru: {
    translation: translationRU,
  },
  kg: {
    translation: translationKG,
  },
  tr: {
    translation: translationTR,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage, // Язык по умолчанию
  fallbackLng: "en", // Резервный язык
  interpolation: {
    escapeValue: false, // React уже защищает от XSS
  },
});

export default i18n;
