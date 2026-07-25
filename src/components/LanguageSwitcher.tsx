import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' }
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-white/40 hover:bg-white/60 px-3 py-1.5 rounded-full transition-colors text-sm font-medium border border-white/40 shadow-sm"
      >
        <Globe className="w-4 h-4" />
        <span>{languages.find(l => l.code === i18n.language)?.label || 'English'}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-36 bg-white/90 backdrop-blur-md rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-white/40 z-50 overflow-hidden"
            >
              <div className="p-1 space-y-0.5">
                {languages.map((lng) => (
                  <button
                    key={lng.code}
                    onClick={() => changeLanguage(lng.code)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${i18n.language === lng.code ? 'bg-blue-50/50 text-blue-700' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'}`}
                  >
                    {lng.label}
                    {i18n.language === lng.code && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
