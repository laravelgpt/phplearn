import React from 'react';
import { Icon } from './Icon';

export interface ModalState {
    isOpen: boolean;
    title?: string;
    content?: React.ReactNode;
    onConfirm?: () => void;
    confirmText?: string;
    onCancel?: () => void;
    cancelText?: string;
    isDestructive?: boolean;
}

interface ModalProps extends ModalState {
    onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content, onConfirm, confirmText = 'Confirm', onCancel, cancelText = 'Cancel', isDestructive = false }) => {
    if (!isOpen) return null;

    const handleCancel = onCancel || onClose;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-start space-x-4">
                        {isDestructive && (
                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                                <Icon icon="alert-triangle" className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                            </div>
                        )}
                        <div className="flex-1">
                             <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-slate-100" id="modal-title">
                                {title}
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {content}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 flex flex-row-reverse gap-3 rounded-b-lg">
                    {onConfirm && (
                        <button
                            type="button"
                            onClick={onConfirm}
                            className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto
                                ${isDestructive 
                                    ? 'bg-red-600 hover:bg-red-500'
                                    : 'bg-sky-600 hover:bg-sky-500'
                                }`}
                        >
                            {confirmText}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex w-full justify-center rounded-md bg-white dark:bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 sm:w-auto"
                    >
                        {onConfirm ? cancelText : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
};