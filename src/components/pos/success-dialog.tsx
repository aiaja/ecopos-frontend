import React, { useState } from 'react';
import { Check, Printer } from 'lucide-react';
interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
}

const SuccessDialog = ({ isOpen, onClose, onPrint }: SuccessDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
       <div>
        <div className="bg-black opacity-50 fixed inset-0 z-40"></div>
      </div>
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl z-50">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Success Text */}
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-2">Success</p>
          <h2 className="text-2xl font-bold text-gray-900">Change: 0</h2>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onPrint}
            className="flex-1 bg-primary text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessDialog;