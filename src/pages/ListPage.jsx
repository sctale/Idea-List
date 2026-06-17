import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadIdeas, saveIdeas, formatRelativeTime, formatDateGroup } from '../utils'

// 搜索图标
function SearchIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

// 关闭图标
function CloseIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

// 灯泡图标
function BulbIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21h6M12 3a6 6 0 0 0-4 10.5V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3.5A6 6 0 0 0 12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 统计图标
function ChartIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export default function ListPage() {
  const [ideas, setIdeas] = useState(loadIdeas)
  const [search, setSearch] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => {
    saveIdeas(ideas)
  }, [ideas])

  // 搜索过滤
  const filteredIdeas = search
    ? ideas.filter(idea => idea.content.toLowerCase().includes(search.toLowerCase()))
    : ideas

  // 按日期分组
  const groupedIdeas = filteredIdeas.reduce((groups, idea) => {
    const group = formatDateGroup(idea.createdAt)
    if (!groups[group]) groups[group] = []
    groups[group].push(idea)
    return groups
  }, {})

  // 删除
  const deleteIdea = useCallback((id) => {
    if (confirmDeleteId === id) {
      setIdeas(prev => prev.filter(idea => idea.id !== id))
      setConfirmDeleteId(null)
    } else {
      setConfirmDeleteId(id)
      setTimeout(() => setConfirmDeleteId(null), 2500)
    }
  }, [confirmDeleteId])

  // 统计数据
  const todayCount = ideas.filter(i => {
    const d = new Date(i.createdAt)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  }).length

  return (
    <div className="h-full flex flex-col bg-cream">
      {/* 顶部 */}
      <div className="flex-shrink-0 px-6 pt-14 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-semibold text-text-primary tracking-tight">汇总</h1>
          <div className="flex items-center gap-1.5 bg-sage-50 px-2.5 py-1 rounded-xl">
            <ChartIcon className="w-3.5 h-3.5 text-sage-400" />
            <span className="text-xs text-sage-500 font-medium">今日 {todayCount}</span>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索灵感..."
            className="w-full bg-white border border-border-light rounded-2xl pl-10 pr-10 py-2.5 text-sm text-text-primary outline-none focus:border-sage-300 transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
            >
              <CloseIcon className="w-3 h-3 text-text-secondary" />
            </button>
          )}
        </div>
      </div>

      {/* 列表 */}
      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-4">
        {filteredIdeas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center pt-16"
          >
            <div className="w-16 h-16 rounded-full bg-sand-50 flex items-center justify-center mb-4">
              <SearchIcon className="w-6 h-6 text-sand-300" />
            </div>
            <p className="text-text-muted text-sm">
              {search ? `没有找到"${search}"相关的灵感` : '还没有灵感，去记录吧'}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedIdeas).map(([group, items]) => (
              <div key={group} className="mb-5 last:mb-0">
                {/* 分组标题 */}
                <div className="flex items-center gap-2 mb-2.5 px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-sage-300" />
                  <span className="text-xs font-medium text-text-secondary">{group}</span>
                  <span className="text-[10px] text-text-muted bg-sand-50 px-1.5 py-0.5 rounded-full">{items.length}</span>
                </div>
                {/* 卡片列表 */}
                <div className="space-y-2">
                  {items.map(idea => (
                    <motion.div
                      key={idea.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -60, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className="group bg-white rounded-2xl px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-border-light relative overflow-visible"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <BulbIcon className="w-4 h-4 text-sage-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-text-primary text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                            {idea.content}
                          </p>
                          <p className="text-text-muted text-[11px] mt-1.5">
                            {formatRelativeTime(idea.createdAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteIdea(idea.id)}
                          className={`flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 ${
                            confirmDeleteId === idea.id
                              ? 'bg-danger-light text-danger scale-110'
                              : 'opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger hover:bg-danger-light'
                          }`}
                        >
                          <CloseIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {confirmDeleteId === idea.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-danger bg-danger-light px-2.5 py-0.5 rounded-full whitespace-nowrap z-10"
                        >
                          再次点击确认删除
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
