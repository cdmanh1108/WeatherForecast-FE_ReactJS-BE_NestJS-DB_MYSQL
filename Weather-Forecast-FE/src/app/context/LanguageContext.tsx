import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE, STORAGE_KEYS } from '../utils/constants';
import { storage } from '../utils/localStorage';

type Language = typeof LANGUAGE.EN | typeof LANGUAGE.VI;

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === LANGUAGE.EN ? LANGUAGE.VI : LANGUAGE.EN;
    i18n.changeLanguage(newLang);
    storage.set(STORAGE_KEYS.LANGUAGE, newLang);
  };

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    storage.set(STORAGE_KEYS.LANGUAGE, lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language: i18n.language as Language,
        toggleLanguage,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
