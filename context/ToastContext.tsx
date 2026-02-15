import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed  bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="pointer-events-auto min-w-[300px] max-w-md bg-[#0f1b23] border border-white/10 shadow-2xl rounded-xl p-4 flex items-start gap-3 backdrop-blur-xl"
                        >
                            <div className={`mt-0.5 rounded-full p-1 ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                    toast.type === 'error' ? 'bg-red-500/10 text-red-500' :
                                        'bg-blue-500/10 text-blue-500'
                                }`}>
                                {toast.type === 'success' && <CheckCircle className="h-4 w-4" />}
                                {toast.type === 'error' && <AlertCircle className="h-4 w-4" />}
                                {toast.type === 'info' && <Info className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-white text-sm font-medium leading-tight">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-white/20 hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
