import React from 'react';
import { UpiPaymentFlow } from './UpiPaymentFlow.tsx';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="my-auto w-full max-w-3xl">
        <UpiPaymentFlow isModal={true} onCancel={onClose} />
      </div>
    </div>
  );
};
