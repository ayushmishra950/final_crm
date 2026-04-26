import React, { useState, createContext, useContext, useCallback } from 'react';

// 1. Context banaya gaya hai jisse app mein kahin se bhi toast call kiya ja sake
const ToastContext = createContext();

// 2. Custom Hook jo aap apne components me use karenge
export const useCustomToast = () => useContext(ToastContext);

// 3. Provider Component jo aapko App.jsx mein wrap karna hoga
export const CustomToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((title, description, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description, type }]);
    
    // Toast automatically 3 second baad remove ho jayega
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast UI Container */}
      <div className="custom-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`custom-toast ${toast.type}`}>
            <div className="toast-content">
              {toast.title && <h4 className="toast-title">{toast.title}</h4>}
              {toast.description && <p className="toast-desc">{toast.description}</p>}
            </div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>✕</button>
          </div>
        ))}
      </div>

      {/* Standalone CSS for Toast - Kisi external file ki zaroorat nahi */}
      <style>{`
        .custom-toast-container {
          position: fixed;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none; /* Taki pichhe ke elements click ho sakein */
        }

        /* Desktop Size: Bottom Right */
        @media (min-width: 768px) {
          .custom-toast-container {
            bottom: 24px;
            right: 24px;
          }
        }

        /* Mobile Size: Top Right */
        @media (max-width: 767px) {
          .custom-toast-container {
            top: 24px;
            right: 16px;
          }
        }

        .custom-toast {
          pointer-events: auto;
          background: #ffffff;
          border-left: 4px solid #3b82f6; /* Default Blue */
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          width: 320px;
          max-width: 90vw;
          animation: slideIn 0.3s ease-out forwards;
        }

        .custom-toast.success { border-left-color: #22c55e; }
        .custom-toast.error { border-left-color: #ef4444; }
        .custom-toast.warning { border-left-color: #f59e0b; }

        .toast-content {
          flex: 1;
        }

        .toast-title {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .toast-desc {
          margin: 0;
          font-size: 14px;
          color: #64748b;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 16px;
          padding: 0;
          margin-left: 12px;
          transition: color 0.2s;
        }

        .toast-close:hover {
          color: #475569;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
