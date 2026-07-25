import { renderToPipeableStream } from 'react-dom/server';
import React from 'react';
import ThreatMap from './src/components/ThreatMap.tsx';

// mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k })
}));

console.log(React.version);
