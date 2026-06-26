import { motion } from 'framer-motion'
import { Zap, CheckCircle2 } from 'lucide-react'
import { GOOGLE_AUTH_URL } from '@/config/api'

const FEATURES = [
  'AI-powered task creation from text',
  'OCR — extract tasks from screenshots',
  'Smart reminders before every deadline',
  'Calendar, Kanban, and Dashboard views',
]

export function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-background-surface border-r border-border p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-text-primary">DeadlineAI</span>
        </div>

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold font-display text-text-primary leading-tight mb-4"
          >
            Your second brain for{' '}
            <span className="gradient-text">everything that matters.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary text-lg mb-10"
          >
            Never miss an internship deadline, hackathon, assignment, or interview again.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {FEATURES.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 text-text-secondary"
              >
                <CheckCircle2 className="w-5 h-5 text-accent-success flex-shrink-0" />
                {f}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <p className="text-text-muted text-sm">
          Built for college students, job seekers, and professionals.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-text-primary">DeadlineAI</span>
          </div>

          <h2 className="text-2xl font-bold font-display text-text-primary mb-2">
            Welcome back
          </h2>
          <p className="text-text-secondary text-sm mb-8">
            Sign in to your second brain.
          </p>

          
           <a href={GOOGLE_AUTH_URL}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-background-elevated border border-border rounded-lg text-text-primary font-medium text-sm hover:border-border-hover hover:bg-background-surface transition-all duration-200 active:scale-[0.98]"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </a>

          <p className="text-text-muted text-xs text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
