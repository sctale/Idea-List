import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

// 灯泡图标（记录页）
function BulbIcon({ className = '', filled = false }) {
  return filled ? (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21h6M12 3a6 6 0 0 0-4 10.5V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3.5A6 6 0 0 0 12 3z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) : (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21h6M12 3a6 6 0 0 0-4 10.5V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3.5A6 6 0 0 0 12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 列表图标（汇总页）
function GridIcon({ className = '', filled = false }) {
  return filled ? (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor"/>
      <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor"/>
      <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor"/>
      <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor"/>
    </svg>
  ) : (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  )
}

// 关于图标
function InfoIcon({ className = '', filled = false }) {
  return filled ? (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="currentColor"/>
      <path d="M12 11v4M12 8h.01" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M12 11v4M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

const tabs = [
  { path: '/', label: '记录', Icon: BulbIcon },
  { path: '/list', label: '汇总', Icon: GridIcon },
  { path: '/about', label: '关于', Icon: InfoIcon },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="flex-shrink-0 bg-white/90 backdrop-blur-xl border-t border-border-light">
      <div className="flex items-center justify-around px-6 pt-2 pb-7">
        {tabs.map(({ path, label, Icon }) => {
          const isActive = location.pathname === path
          return (
            <NavLink
              key={path}
              to={path}
              className="flex flex-col items-center gap-0.5 relative py-1 px-3"
            >
              {/* 活跃指示器背景 */}
              {isActive && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute -top-1 w-10 h-10 rounded-2xl bg-sage-50"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon
                  className={`w-[22px] h-[22px] transition-colors duration-200 ${
                    isActive ? 'text-sage-500' : 'text-text-muted'
                  }`}
                  filled={isActive}
                />
                <span className={`text-[10px] transition-all duration-200 ${
                  isActive ? 'text-sage-500 font-semibold' : 'text-text-muted font-normal'
                }`}>
                  {label}
                </span>
              </div>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
