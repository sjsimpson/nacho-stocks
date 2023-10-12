import './Toast.scss'
import { createContext, useMemo, useContext, useEffect, useState } from 'react'
import { clsx } from 'clsx'

const ToastContext = createContext<{ addToast: (toast: Toast) => void } | null>(
  null
)

interface Toast {
  message: string
  type: 'success' | 'error' | 'warn'
}

function ToastProvider({ children }: { children: any }) {
  const [visible, setVisible] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    if (toast) {
      setVisible(true)
      const timeout = setTimeout(() => setVisible(false), 3000)

      return () => clearTimeout(timeout)
    }
  }, [toast])

  useEffect(() => {
    if (!visible) {
      const timeout = setTimeout(() => {
        setToast(null)
      }, 100)

      return () => clearTimeout(timeout)
    }
  }, [visible])

  const addToast = (newToast: Toast) => {
    setToast(newToast)
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toast && (
        <div className={clsx('toast', visible && 'visible', toast.type)}>
          <span>{toast && toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export default ToastProvider
export const useToasts = () => useContext(ToastContext)
