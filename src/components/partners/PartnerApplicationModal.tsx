'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PartnerApplicationForm from './PartnerApplicationForm';

interface PartnerApplicationModalProps {
  trigger: React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
}

export default function PartnerApplicationModal({ trigger }: PartnerApplicationModalProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC key closes the modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Clone the trigger element and inject onClick
  const triggerWithHandler = {
    ...trigger,
    props: {
      ...trigger.props,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setOpen(true);
        trigger.props.onClick?.(e);
      },
    },
  };

  const modal = open ? (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/55 backdrop-blur-sm animate-fade-in"
      style={{ zIndex: 99999 }}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-application-title"
    >
      <div
        className="relative w-full max-w-[500px] my-auto shadow-2xl rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close partner application"
          className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-panda-dark text-white flex items-center justify-center shadow-xl hover:bg-panda-green transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <PartnerApplicationForm />
      </div>
    </div>
  ) : null;

  return (
    <>
      {triggerWithHandler}
      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
