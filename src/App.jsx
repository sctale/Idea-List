import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// 本地存储工具
const STORAGE_KEY = 'idea-list-data'

function loadIdeas() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveIdeas(ideas) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas))
}

// 相对时间格式化
function formatRelativeTime(timestamp) {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 10) return '刚刚'
  if (seconds < 60) return `${seconds} 秒前`
  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days < 7) return `${days} 天前`

  const date = new Date(timestamp)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const currentYear = new Date().getFullYear()
  if (date.getFullYear() === currentYear) {
    return `${month}月${day}日`
  }
  return `${date.getFullYear()}年${month}月${day}日`
}

// 闪电动画图标
function SparkIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L4.09 12.63C3.74 13.04 3.56 13.24 3.56 13.41C3.56 13.56 3.62 13.7 3.73 13.79C3.86 13.9 4.13 13.9 4.67 13.9H12L11 22L19.91 11.37C20.26 10.96 20.44 10.76 20.44 10.59C20.44 10.44 20.38 10.3 20.27 10.21C20.14 10.1 19.87 10.1 19.33 10.1H12L13 2Z" fill="currentColor" />
    </svg>
  )
}

// 删除图标
function TrashIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// 灵感卡片组件
function IdeaCard({ idea, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const timerRef = useRef(null)

  const handleDelete = useCallback(() => {
    if (confirmDelete) {
      onDelete(idea.id)
      setConfirmDelete(false)
    } else {
      setConfirmDelete(true)
      timerRef.current = setTimeout(() => setConfirmDelete(false), 2000)
    }
  }, [confirmDelete, idea.id, onDelete])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      className="group relative bg-card hover:bg-card-hover border border-border rounded-2xl p-4 transition-colors duration-200"
    >
      <div className="flex items-start gap-3">
        {/* 小闪电图标 */}
        <div className="flex-shrink-0 mt-0.5">
          <SparkIcon className="w-4 h-4 text-amber opacity-60" />
        </div>
        {/* 内容区 */}
        <div className="flex-1 min-w-0">
          <p className="text-text-primary text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {idea.content}
          </p>
          <p className="text-text-muted text-xs mt-2">
            {formatRelativeTime(idea.createdAt)}
          </p>
        </div>
        {/* 删除按钮 */}
        <button
          onClick={handleDelete}
          className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
            confirmDelete
              ? 'bg-danger-bg text-danger scale-110'
              : 'opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger hover:bg-danger-bg'
          }`}
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* 删除确认提示 */}
      {confirmDelete && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-danger bg-danger-bg px-2 py-0.5 rounded-full whitespace-nowrap"
        >
          再次点击确认删除
        </motion.div>
      )}
    </motion.div>
  )
}

// 空状态组件
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center justify-center py-20 px-6"
    >
      <div className="relative mb-6">
        <SparkIcon className="w-16 h-16 text-amber opacity-20" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 blur-xl bg-amber opacity-30"
        />
      </div>
      <p className="text-text-secondary text-lg mb-2">还没有灵感</p>
      <p className="text-text-muted text-sm text-center leading-relaxed">
        闪过脑海的念头，随手记下来<br />别让好想法溜走了
      </p>
    </motion.div>
  )
}

// 主应用
function App() {
  const [ideas, setIdeas] = useState(loadIdeas)
  const [input, setInput] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const textareaRef = useRef(null)
  const listRef = useRef(null)

  // 保存到本地存储
  useEffect(() => {
    saveIdeas(ideas)
  }, [ideas])

  // 自动调整输入框高度
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }, [input])

  // 添加灵感
  const addIdea = useCallback(() => {
    const content = input.trim()
    if (!content) return

    const newIdea = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      content,
      createdAt: Date.now(),
    }

    setIdeas(prev => [newIdea, ...prev])
    setInput('')

    // 重置输入框高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // 滚动到顶部
    if (listRef.current) {
      listRef.current.scrollTop = 0
    }
  }, [input])

  // 删除灵感
  const deleteIdea = useCallback((id) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id))
  }, [])

  // 键盘事件处理
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      addIdea()
    }
  }, [addIdea, isComposing])

  // 输入框获焦动画状态
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="h-full flex flex-col bg-midnight">
      {/* 顶部标题栏 */}
      <header className="flex-shrink-0 px-5 pt-12 pb-3">
        <div className="flex items-center gap-2.5">
          <SparkIcon className="w-6 h-6 text-amber" />
          <h1 className="text-xl font-semibold text-text-primary tracking-tight">闪念</h1>
          {ideas.length > 0 && (
            <span className="text-xs text-text-muted bg-card px-2 py-0.5 rounded-full ml-1">
              {ideas.length}
            </span>
          )}
        </div>
      </header>

      {/* 输入区域 */}
      <div className="flex-shrink-0 px-4 pb-3">
        <div
          className={`relative rounded-2xl border transition-all duration-300 ${
            isFocused
              ? 'border-amber/40 bg-card shadow-[0_0_20px_rgba(245,158,11,0.08)]'
              : 'border-border bg-card'
          }`}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="记下你的灵感..."
            rows={1}
            className="w-full bg-transparent text-text-primary text-[15px] leading-relaxed px-4 py-3 resize-none outline-none placeholder:text-text-muted"
          />
          {/* 发送按钮 */}
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[11px] text-text-muted">
              Enter 发送 · Shift+Enter 换行
            </span>
            <button
              onClick={addIdea}
              disabled={!input.trim()}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                input.trim()
                  ? 'bg-amber text-midnight hover:bg-amber-light active:scale-95 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-card text-text-muted cursor-not-allowed'
              }`}
            >
              <SparkIcon className="w-3.5 h-3.5" />
              记下
            </button>
          </div>
        </div>
      </div>

      {/* 分隔线 */}
      {ideas.length > 0 && (
        <div className="flex-shrink-0 mx-5 border-t border-border" />
      )}

      {/* 灵感列表 */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 py-3"
      >
        {ideas.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {ideas.map(idea => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onDelete={deleteIdea}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 底部安全区 */}
      <div className="flex-shrink-0 h-8" />
    </div>
  )
}

export default App
