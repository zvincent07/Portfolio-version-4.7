import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import ReactDOM from "react-dom";

export type ToastVariant = "success" | "error";

type ToastState = {
  message: string;
  variant: ToastVariant;
} | null;

type ToastContextValue = {
  showToast: (options: {
    message: string;
    variant?: ToastVariant;
    duration?: number;
  }) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

type ToastPortalProps = {
  toast: ToastState;
  onClose: () => void;
};

function ToastPortal({ toast, onClose }: ToastPortalProps) {
  if (!toast) return null;

  const { message, variant } = toast;

  const label = variant === "success" ? "[ SUCCESS ]" : "[ ERROR ]";

  const labelColor =
    variant === "success" ? "text-emerald-400" : "text-primary";

  const borderColor =
    variant === "success" ? "border-emerald-500/30" : "border-primary/30";

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 right-0 z-[9999] flex justify-center pt-4 px-4 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-lg bg-[#111823]/95 border ${borderColor} backdrop-blur-md shadow-2xl shadow-black/50`}
        style={{ animation: "slideDown 0.3s ease-out" }}
      >
        <div className="flex items-center gap-2">
          <span className={`font-mono text-xs ${labelColor}`}>{label}</span>
          <span className="w-px h-4 bg-zinc-800"></span>
        </div>
        <p className="text-sm text-zinc-300">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 p-1 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const hideToast = useCallback(() => {
    setToast(null);
    if (timeoutRef.current !== undefined) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const showToast = useCallback(
    (options: { message: string; variant?: ToastVariant; duration?: number }) => {
      const { message, variant = "success", duration = 4000 } = options;

      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current);
      }

      setToast({ message, variant });

      if (duration && duration > 0) {
        timeoutRef.current = window.setTimeout(() => {
          setToast(null);
          timeoutRef.current = undefined;
        }, duration);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastPortal toast={toast} onClose={hideToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
