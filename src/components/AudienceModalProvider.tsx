'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import AudienceModal from './AudienceModal';

interface AudienceModalContextValue {
  openModal: () => void;
  closeModal: () => void;
}

const AudienceModalContext = createContext<AudienceModalContextValue | null>(null);

export function AudienceModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      openModal: () => setIsOpen(true),
      closeModal: () => setIsOpen(false),
    }),
    []
  );

  return (
    <AudienceModalContext.Provider value={value}>
      {children}
      <AudienceModal open={isOpen} onClose={value.closeModal} />
    </AudienceModalContext.Provider>
  );
}

export function useAudienceModal() {
  const context = useContext(AudienceModalContext);
  if (!context) {
    throw new Error('useAudienceModal must be used within AudienceModalProvider');
  }
  return context;
}
