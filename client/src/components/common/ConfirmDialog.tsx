import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open, title, description,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  variant = 'danger', onConfirm, onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            className="relative bg-background-elevated border border-border rounded-xl p-6 w-full max-w-md shadow-lg"
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                variant === 'danger' ? 'bg-accent-danger/10' : 'bg-accent-warning/10'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${
                  variant === 'danger' ? 'text-accent-danger' : 'text-accent-warning'
                }`} />
              </div>
              <div>
                <h3 className="text-text-primary font-semibold mb-1">{title}</h3>
                <p className="text-text-secondary text-sm">{description}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={onCancel} className="btn-secondary text-sm px-4 py-2">
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`text-white font-medium px-4 py-2 rounded-md text-sm transition-all active:scale-95 ${
                  variant === 'danger'
                    ? 'bg-accent-danger hover:bg-red-600'
                    : 'bg-accent-warning hover:bg-amber-600'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}