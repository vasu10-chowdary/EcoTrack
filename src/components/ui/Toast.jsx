import { useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

const TOAST_STYLES = {
  success: {
    icon: CheckCircle,
    bg: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.3)',
    iconColor: '#10b981',
  },
  error: {
    icon: AlertCircle,
    bg: 'rgba(239,68,68,0.15)',
    border: 'rgba(239,68,68,0.3)',
    iconColor: '#ef4444',
  },
  info: {
    icon: Info,
    bg: 'rgba(59,130,246,0.15)',
    border: 'rgba(59,130,246,0.3)',
    iconColor: '#3b82f6',
  },
};

function Toast({ toast }) {
  const { removeToast } = useApp();
  const { isDark } = useTheme();
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
  const Icon = style.icon;

  return (
    <div
      className="flex items-start gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium animate-slide-in-right backdrop-blur-xl"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        minWidth: '280px',
        maxWidth: '360px',
      }}
    >
      <Icon size={16} style={{ color: style.iconColor }} className="shrink-0 mt-0.5" />
      <p className={isDark ? 'text-gray-100 flex-1' : 'text-gray-800 flex-1'}>{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-gray-400 hover:text-white transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
