import React, { createContext, useContext, useState, useCallback } from 'react';
import ModernAlertModal, { AlertType } from '../components/common/ModernAlertModal';

interface AlertOptions {
    title: string;
    message: string;
    type?: AlertType;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState<AlertOptions>({
        title: '',
        message: '',
        type: 'info',
    });

    const showAlert = useCallback((opts: AlertOptions) => {
        setOptions(opts);
        setVisible(true);
    }, []);

    const hideAlert = useCallback(() => {
        setVisible(false);
        if (options.onCancel) options.onCancel();
    }, [options]);

    const handleConfirm = useCallback(() => {
        if (options.onConfirm) options.onConfirm();
    }, [options]);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <ModernAlertModal
                visible={visible}
                title={options.title}
                message={options.message}
                type={options.type}
                confirmText={options.confirmText}
                cancelText={options.cancelText}
                onClose={() => setVisible(false)}
                onConfirm={handleConfirm}
            />
        </AlertContext.Provider>
    );
};
